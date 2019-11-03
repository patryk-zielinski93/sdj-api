module.exports = {
  name: 'ng-shared-domain',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/ng/shared/domain',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
