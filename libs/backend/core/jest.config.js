module.exports = {
  name: 'backend-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/core',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
