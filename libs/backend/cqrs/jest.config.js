module.exports = {
  name: 'backend-cqrs',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/cqrs',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
