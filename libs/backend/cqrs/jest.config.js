module.exports = {
  name: 'backend-cqrs',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/cqrs',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
