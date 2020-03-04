module.exports = {
  name: 'ng-core-auth-infrastructure',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/ng/core/auth/infrastructure',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
