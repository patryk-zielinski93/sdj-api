module.exports = {
  name: 'backend-websocket',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/websocket',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
