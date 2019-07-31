module.exports = {
  name: 'backend-websocket',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/backend/websocket',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
