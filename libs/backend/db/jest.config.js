module.exports = {
  name: 'backend-db',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/db',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
