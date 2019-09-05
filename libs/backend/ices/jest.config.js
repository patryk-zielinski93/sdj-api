module.exports = {
  name: 'backend-redis',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/redis',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
