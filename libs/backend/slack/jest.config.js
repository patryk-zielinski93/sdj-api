module.exports = {
  name: 'backend-slack',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/slack',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
