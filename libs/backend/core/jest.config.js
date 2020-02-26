module.exports = {
  name: 'backend-core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/core',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
