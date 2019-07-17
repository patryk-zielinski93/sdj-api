"use strict";
exports.__esModule = true;
var architect_1 = require("@angular-devkit/architect");
var childProcess = require("child_process");
exports["default"] = architect_1.createBuilder(function (options, context) {
    return new Promise(function (resolve) {
        var target = architect_1.targetFromTargetString(options.buildTarget);
        Promise.all([
            context.getTargetOptions(target),
            context.getBuilderNameForTarget(target)
        ]).then(function (_a) {
            var options = _a[0], builderName = _a[1];
            var child = childProcess.spawn('nodemon', ['--config nodemon-debug.json']);
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
});
