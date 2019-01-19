import * as path from 'path';

const root = path.join(__dirname, './..');

export const pathConfig = {
  root: root,
  tracks: path.join(root, 'public', 'tracks')
};