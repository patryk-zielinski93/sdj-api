module.exports = {
  name: 'ng-presentation-main-radio-presentation',
  preset: '../../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../../coverage/libs/ng/presentation/main/radio/presentation',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
