import { getPlayButton } from '../support/app.po';
import { expectPlayingAudio, resolveApp } from '../support/commands';

describe('Player', () => {
  beforeEach(() => {
    resolveApp();
  });

  it('should play radio', () => {
    getPlayButton().click();
    cy.wait(10000);
    expectPlayingAudio();
  });
});
