module.exports = {
  name: 'ng-shell',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/ng/shell',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
