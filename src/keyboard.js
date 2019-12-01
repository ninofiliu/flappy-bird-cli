const canvas = require('./canvas');

module.exports = {
    listenersByLetter: {},
    listen() {
        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true);
        process.stdin.on('data', (letter) => {
            if (letter === '\x03') {
                canvas.finish();
                process.exit();
            }
            if (!this.listenersByLetter[letter]) return;
            this.listenersByLetter[letter]();
        });
    },
};
