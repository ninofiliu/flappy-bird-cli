const { colors } = require('console-canvas');
const keyboard = require('../keyboard');
const canvas = require('../canvas');
const config = require('../config');

module.exports = {
    state: {},
    render() {
        renderBackground();
        renderBox();
        canvas.print();

        function renderBackground() {
            canvas.drawRect(0, 0, config.screenWidth, config.screenHeight, colors.bg.cyan);
        }

        function renderBox() {
            canvas.drawRect(20, 13, 51, 24, colors.bg.black);
            canvas.drawRect(18, 12, 49, 23, colors.bg.yellow);
            canvas.write(22, 14, 'FLAPPY BIRD', colors.fg.black);
            canvas.write(22, 16, 'Developed by Nino Filiu', colors.fg.black);
            canvas.write(22, 17, 'Idea by Dong Nguyen', colors.fg.black);
            canvas.write(22, 19, '[p] play', colors.fg.black);
            canvas.write(22, 20, '[q] quit', colors.fg.black);
        }
    },
    start() {
        this.render();
        keyboard.listenersByLetter = {
            p: () => this.go('game'),
            q: () => this.go('quit'),
        };
    },
    go(activity) {
        switch (activity) {
        case 'game':
            // TODO
            break;
        case 'quit':
            canvas.finish();
            process.exit();
            break;
        }
    },
};
