const { colors } = require('console-canvas');
const canvas = require('../canvas');
const keyboard = require('../keyboard');
const config = require('../config');
const gameOver = require('./game-over');

module.exports = {

    start() {
        this.state = {
            score: 0,
            frame: 0,
            paused: false,
            bird: {
                x: 20,
                y: 18,
                yy: 0,
            },
            obstacles: [
                {
                    x: config.screenWidth,
                    y: Math.floor(config.screenHeight * Math.random()),
                },
            ],
        };
        canvas.reset();
        this.update();
        keyboard.listenersByLetter = {
            ' ': () => {
                this.state.bird.yy = -config.birdJumpForce;
            },
            p: () => {
                this.paused = !this.paused;
                if (!this.paused) this.update();
            },
            q: () => this.end('quit'),
        };
    },
    update() {
        if (this.state.paused) return;
        this.state.frame++;

        moveBird.bind(this)();
        moveObstacles.bind(this)();
        updateObstacles.bind(this)();
        if (isGameOver.bind(this)()) {
            this.end('game-over');
            return;
        }
        updateScore.bind(this)();

        this.render();
        setTimeout(() => this.update(), 1000 / config.fps);

        function moveBird() {
            this.state.bird.y += this.state.bird.yy;
            if (this.state.bird.y < config.birdSizeY) {
                this.state.bird.y = config.birdSizeY;
            }
            if (this.state.bird.y > config.screenHeight - config.birdSizeY) {
                this.state.bird.y = config.screenHeight - config.birdSizeY;
            }
            this.state.bird.yy += config.birdAcceleration;
        }
        function moveObstacles() {
            for (const obstacle of this.state.obstacles) {
                obstacle.x -= config.obstaclesSpeed;
            }
        }
        function updateObstacles() {
            const last = this.state.obstacles[this.state.obstacles.length - 1];
            if (last.x < config.screenWidth) {
                this.state.obstacles.push({
                    x: last.x + config.obstaclesSpacing,
                    y: Math.floor(config.screenHeight * Math.random()),
                });
            }
            if (this.state.obstacles[0].x < 0) {
                this.state.obstacles.shift();
            }
        }
        function isGameOver() {
            const { bird } = this.state;
            for (const obstacle of this.state.obstacles) {
                if (Math.abs(bird.x - obstacle.x) < config.birdSizeX + config.obstaclesSizeX) {
                    if (Math.abs(bird.y - obstacle.y) > config.obstaclesSizeY) {
                        return true;
                    }
                }
            }
            return false;
        }
        function updateScore() {
            if (this.state.frame >= 30) {
                if ((this.state.frame - 30) % (config.obstaclesSpacing / config.obstaclesSpeed) === 0) {
                    this.state.score++;
                }
            }
        }
    },
    end(activity) {
        switch (activity) {
        case 'quit':
            canvas.finish();
            process.exit();
            break;
        case 'game-over':
            gameOver.start({ score: this.state.score });
        }
    },

    render() {
        renderBackground.bind(this)();
        renderObstacles.bind(this)();
        renderBird.bind(this)();
        renderInfos.bind(this)();
        canvas.print();

        function renderBackground() {
            canvas.drawRect(
                0,
                0,
                config.screenWidth,
                config.screenHeight,
                colors.bg.brCyan,
            );
        }
        function renderBird() {
            canvas.drawRect(
                this.state.bird.x - config.birdSizeX,
                this.state.bird.y - config.birdSizeY,
                this.state.bird.x + config.birdSizeX,
                this.state.bird.y + config.birdSizeY,
                colors.bg.yellow,
            );
        }
        function renderObstacles() {
            for (const obstacle of this.state.obstacles) {
                const x0 = Math.max(0, obstacle.x - config.obstaclesSizeX);
                const x1 = Math.min(config.screenWidth, obstacle.x + config.obstaclesSizeX);
                canvas.drawRect(
                    x0,
                    0,
                    x1,
                    obstacle.y - config.obstaclesSizeY,
                    colors.bg.green,
                );
                canvas.drawRect(
                    x0,
                    obstacle.y + config.obstaclesSizeY,
                    x1,
                    config.screenHeight,
                    colors.bg.green,
                );
            }
        }
        function renderInfos() {
            const color = colors.fg.black;
            const x0 = config.screenWidth - 18;
            canvas.drawEmptyRectangle(x0, 0, config.screenWidth - 2, 6, color);
            canvas.write(x0 + 2, 1, 'jump  [space]', color);
            canvas.write(x0 + 2, 2, 'pause     [p]', color);
            canvas.write(x0 + 2, 3, 'quit      [q]', color);
            canvas.write(x0 + 2, 5, `SCORE ${(`${this.state.score}`).padStart(7, ' ')}`, color);
        }
    },
};
