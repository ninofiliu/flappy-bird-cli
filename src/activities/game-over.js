const { colors } = require('console-canvas');
const canvas = require('../canvas');
const keyboard = require('../keyboard');

module.exports = {
    state: {
        score: null,
    },

    start({ score }) {
        this.state.score = score;
        this.render();
        keyboard.listenersByLetter = {
            q: () => {
                canvas.finish();
                process.exit();
            },
            // eslint-disable-next-line global-require
            r: () => require('./game').start(),
        };
    },

    render() {
        canvas.drawRect(31, 16, 46, 22, colors.bg.black);
        canvas.drawRect(29, 15, 44, 21, colors.bg.red);
        canvas.write(31, 16, 'GAME OVER', colors.fg.black);
        canvas.write(31, 18, '[r] restart', colors.fg.black);
        canvas.write(31, 19, '[q] quit', colors.fg.black);
        canvas.print();
    },
};
