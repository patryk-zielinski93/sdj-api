module.exports = {
  name: 'ng-core-shared-infrastructure-slack',
  preset: '../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../coverage/libs/ng/core/shared/infrastructure-slack',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
