(function(){
    const fetch = require("isomorphic-fetch");
    const config = require('./config.json')[0];

    const key = [
        ['warn', '\x1b[35m', '(?)'],
        ['error', '\x1b[31m', 'DOWN'],
        ['log', '\x1b[32m', 'UP']
    ]

    // URLS that will be checked
    var urls = [];

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
            engine.check(false);
        },
        // Gets the status of a url
        getUrlStatus: function(env) {
            var p = new Promise(function (resolve, reject) {
                fetch(env).then((response) => {
                    if (response.statusText && response.statusText == 'OK') {
                        engine.lineBreak();
                        console.log(env + ' (' + response.status + ')');
                        resolve(); // fulfilled successfully
                    } else {
                        engine.lineBreak();
                        console.error(env + ' (' + response.status + ')');
                        reject(); // error, rejected
                    }
                }).catch((error) => {
                    engine.lineBreak();
                    console.warn('\x1b[36m%s\x1b[0m', env + ' is not valid! (' + error.status + ')');
                    reject(error);
                });

                resolve();

            });
        },
        // To make it... prettyish? 
        lineBreak: function () {console.info('-----------------------------------------------------------------------');}
    }

    engine.run();
    //engine.run();
})();