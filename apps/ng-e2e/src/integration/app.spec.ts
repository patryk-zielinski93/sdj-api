import {
  getNavbarList,
  getChannelListItem,
  getPlayButton
} from '../support/app.po';
import { login, expectPlayingAudio, resolveApp } from '../support/commands';

describe('SDJ', () => {
  beforeEach(() => {
    resolveApp();
  });

  it('should display player', () => {
    getPlayButton().should('be.visible');
  });

  it('should countain channels list', () => {
    getNavbarList().within(() => {
      getChannelListItem().should('have.length.greaterThan', 1);
    });
  });
});
