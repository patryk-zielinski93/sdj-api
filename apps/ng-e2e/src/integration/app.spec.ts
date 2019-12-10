import {
  getChannelListItem,
  getNavbarList,
  getPlayButton
} from '../support/app.po';
import { resolveApp } from '../support/commands';

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
