module.exports = {
  name: 'ng-core-auth-api',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/ng/core/auth/api',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
