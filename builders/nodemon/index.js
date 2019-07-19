"use strict";
exports.__esModule = true;
var architect_1 = require("@angular-devkit/architect");
var childProcess = require("child_process");
exports["default"] = architect_1.createBuilder(function (options, context) {
    return new Promise(function (resolve) {
        var args = [];
        if (options.debug) {
            args = args.concat(['--config', 'nodemon-debug.json']);
        }
        var child = childProcess.spawn('nodemon', args);
        child.stdout.on('data', function (data) {
            context.logger.info(data.toString());
        });
        child.stderr.on('data', function (data) {
            context.logger.error(data.toString());
        });
        child.on('close', function (code) {
            resolve({ success: true });
        });
    });
});
