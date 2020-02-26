module.exports = {
  name: 'sdj',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/sdj',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
