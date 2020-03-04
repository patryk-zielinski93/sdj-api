module.exports = {
  name: 'ng-presentation-main-most-played-feature',
  preset: '../../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../../coverage/libs/ng/presentation/main/most-played/feature',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
