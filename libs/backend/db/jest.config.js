module.exports = {
  name: 'backend-db',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/db',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
