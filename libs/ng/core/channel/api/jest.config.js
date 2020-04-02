module.exports = {
  name: 'ng-core-channel-api',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/ng/core/channel/api',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
