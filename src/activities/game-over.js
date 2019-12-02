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
        };
    },

    render() {
        canvas.drawRect(32, 16, 45, 21, colors.bg.black);
        canvas.drawRect(30, 15, 43, 20, colors.bg.red);
        canvas.write(32, 16, 'GAME OVER', colors.fg.black);
        canvas.write(32, 18, '[q] quit', colors.fg.black);
        canvas.print();
    },
};
