#!/usr/bin/env node
const keyboard = require('./keyboard');
const intro = require('./activities/intro');

keyboard.listen();
intro.start();
