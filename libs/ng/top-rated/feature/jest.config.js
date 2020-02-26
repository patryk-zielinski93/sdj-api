module.exports = {
  name: 'ng-top-rated-feature',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/ng/top-rated/feature',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
