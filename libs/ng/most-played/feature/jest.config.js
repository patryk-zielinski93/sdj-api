module.exports = {
  name: 'ng-most-played-feature',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/ng/most-played/feature',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
