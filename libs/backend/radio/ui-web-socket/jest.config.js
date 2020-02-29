module.exports = {
  name: 'backend-radio-ui-web-socket',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/backend/radio/ui-web-socket',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
