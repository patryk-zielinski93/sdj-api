module.exports = {
  name: 'ng-presentation-main-top-rated-feature',
  preset: '../../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../../coverage/libs/ng/presentation/main/top-rated/feature',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
