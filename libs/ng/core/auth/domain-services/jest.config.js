module.exports = {
  name: 'ng-core-auth-domain-services',
  preset: '../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../coverage/libs/ng/core/auth/domain-services',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
