import { getPlayButton } from '../support/app.po';
import { expectPlayingAudio, resolveApp } from '../support/commands';
import { closeWSServer, setupMockWSServer } from '../support/websocket';

describe('Player', () => {
  before(() => {
    setupMockWSServer();
  });
  after(() => {
    closeWSServer();
  });

  beforeEach(() => {
    resolveApp();
  });

  it('should play radio', () => {
    getPlayButton().click();
    cy.wait(2000);
    expectPlayingAudio();
  });
});
