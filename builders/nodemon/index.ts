import {
  BuilderOutput,
  createBuilder,
  targetFromTargetString
} from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import { OptionsT } from './schema';

export default createBuilder((options: any, context) => {
  return new Promise<BuilderOutput>(resolve => {
    const target = targetFromTargetString(options.buildTarget);
    Promise.all([
      context.getTargetOptions(target),
      context.getBuilderNameForTarget(target)
    ]).then(([optionsT, builderName]: [OptionsT, string]) => {
      const args = [];
      if (optionsT.debug) {
        args.concat(['--config', 'nodemon-debug.json']);
      }
      const child = childProcess.spawn('nodemon', args);
      child.stdout.on('data', data => {
        context.logger.info(data.toString());
      });
      child.stderr.on('data', data => {
        context.logger.error(data.toString());
      });
      child.on('close', code => {
        resolve({ success: true });
      });
    });
  });
});
