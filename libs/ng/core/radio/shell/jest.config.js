module.exports = {
  name: 'ng-core-radio-shell',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/ng/core/radio/shell',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
