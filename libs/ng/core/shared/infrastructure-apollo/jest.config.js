module.exports = {
  name: 'ng-core-shared-infrastructure-apollo',
  preset: '../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../coverage/libs/ng/core/shared/infrastructure-apollo',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
