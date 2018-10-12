(function(){
    const fetch = require("isomorphic-fetch");
    const moment = require('moment');
    const config = require('./config.json')[0];
    const fs = require('fs');

    const key = [
        ['warn', '\x1b[35m', '(?)'],
        ['error', '\x1b[31m', 'DOWN'],
        ['log', '\x1b[32m', 'UP']
    ]

    const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');

    // URLS that will be checked
    var urls = [];
    var output = '';
    var urlCount = 0;
    var urlInc = 0;

    // Additional static URLS from config
    if(config.urls){
        urls = urls.concat(config.urls);
    }

    key.forEach(function (pair) {
        var method = pair[0],
            human = pair[2],
            reset = '\x1b[0m', color = '\x1b[36m' + pair[1];
        console[method] = console[method].bind(console, color, human.toUpperCase(), reset);
    });

    // // Additional Dynamic URLS from processors specified in config
    if (config.processors) {
        config.processors.forEach(function(process){
            var procUrls = require(process);
            urls = urls.concat(procUrls);
        });
        //console.log('urls', urls);
    }

    // CLI arguements
    const args = process.argv.slice(2)
    const filter = args[0];

    // Where the magic happens
    const engine = {
        // Does all the things
        check: function(kill){
            
            // Fitler results
            if(filter){
                urls = urls.filter(function (str) { return str.indexOf(filter) !== -1; });
                
            }
            
            urls.forEach(env => {
                engine.getUrlStatus(env);
            });
            
        },
        run: function(){
            console.info('Started at '+currentTime);
            urlCount = urls.length;
            engine.check(false);
        },
        // Gets the status of a url
        getUrlStatus: function(env) {
            var p = new Promise(function (resolve, reject) {
                var message = '';
                fetch(env).then((response) => {
                    if (response.statusText && response.statusText == 'OK') {
                        engine.lineBreak();
                        message = '[UP] ' + env + ' (' + response.status + ') | ' + moment().format('MM-DD-YY, h:mm:ss');
                        console.log(message);
                        output += message;
                        resolve(); // fulfilled successfully
                    } else {
                        engine.lineBreak();
                        message = '[DOWN] ' + env + ' (' + response.status + ') | ' + moment().format('MM-DD-YY, h:mm:ss');
                        console.error(message);
                        output += message + '\n';
                        reject(); // error, rejected
                    }
                    urlInc++;                    

                    // Log output when last promise has been fulfilled
                    //if ((urlInc === urlLength) && (config.logging === true)) {
                        engine.logOutput();
                    //}
                    
                }).catch((error) => {
                    engine.lineBreak();
                    message = '[?] ' + env + ' is not valid! (' + error.status + ') | ' + moment().format('MM-DD-YY, h:mm:ss');
                    console.warn(message);
                    output += message + '\n';

                    urlInc++;                    

                    engine.logOutput();

                    reject(error);

                });

                resolve();

            });
        },
        logOutput: function () {
            if ((urlInc === urlCount) && (config.logging === true)) {
                var name = 'logs/battery-log_' + moment().format('MM-DD-YY') + '_' + moment().format('h:mm:ss a') + '.txt';
                fs.appendFile(name, output, function (err) {
                    if (err) throw err;
                    engine.lineBreak();
                    console.info('Saved to log: ' + name);
                });
            }
        },
        // To make it... prettyish? 
        lineBreak: function () {console.info('-----------------------------------------------------------------------');}
    }

    engine.run();
    //engine.run();
})();