module.exports = {
  name: 'sdj',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/sdj',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
