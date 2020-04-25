"use strict";

const cursor = require('ansi')(process.stdout);
const chalk = require('chalk');


let options = {
    animate: false,
    duration: 12,
    seed: 0,
    speed: 20,
    spread: 8.0,
    freq: 0.3,
};

let rainbow = function (freq, i) {

    let red = Math.round(Math.sin(freq * i + 0) * 127 + 128);
    let green = Math.round(Math.sin(freq * i + 2 * Math.PI / 3) * 127 + 128);
    let blue = Math.round(Math.sin(freq * i + 4 * Math.PI / 3) * 127 + 128);

    return {
        red: red,
        green: green,
        blue: blue
    }
};

let colorize = function (char, colors) {
    process.stdout.write(chalk.rgb(colors.red, colors.green, colors.blue)(char));
};

let printlnPlain = function (colorize, line) {

    for (let i = 0; i < line.length; i++) {
        colorize(line[i], rainbow(options.freq, options.seed + i / options.spread));
    }
};


let println = function (line) {
    printlnPlain(colorize, line);
    process.stdout.write('\n');
};


let fromString = function (string) {

    string = string || '';
    let lines = string.split('\n');
    lines.forEach(function (line) {
        options.seed += 1;
        println(line);
        cursor.show();
    });
};

exports.options = options;
exports.println = println;
exports.fromString = fromString;
