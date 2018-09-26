const qaEnvRange = [1, 30];

var urls = [];

for (i = qaEnvRange[0]; i <= qaEnvRange[1]; i++) {
    urls.push('https://qa' + i + '.snapfinance.com/api/v1/commons/states');
}

module.exports = urls;

