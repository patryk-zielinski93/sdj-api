module.exports = {
  name: 'ng-shell',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/ng/shell',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
