const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname + '/src/env.sample.js'), 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }
    let result = data
        .replace(/{{backendUrl}}/g, process.env.BACKEND_URL)
        .replace(/{{radioStreamUrl}}/g, process.env.RADIO_STREAM_URL);

    fs.writeFile(path.join(__dirname + '/src/env.js'), result, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});
