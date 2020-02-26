module.exports = {
  name: 'ng-shared-ui-common',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/ng/shared/ui/common',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
