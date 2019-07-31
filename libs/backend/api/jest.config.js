module.exports = {
  name: 'backend-api',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/api',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
