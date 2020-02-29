module.exports = {
  name: 'backend-radio-ui-slack',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/backend/radio/ui-slack',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
