module.exports = {
  name: 'backend-redis',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/redis',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
