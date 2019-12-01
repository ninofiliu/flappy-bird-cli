const { ConsoleCanvas } = require('console-canvas');
const config = require('./config');

const canvas = new ConsoleCanvas(config.screenWidth, config.screenHeight);

module.exports = canvas;
