module.exports = {
  name: 'ng-top-rated-feature',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/ng/top-rated/feature',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
