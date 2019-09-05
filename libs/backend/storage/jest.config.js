module.exports = {
  name: 'backend-storage',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/storage',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
