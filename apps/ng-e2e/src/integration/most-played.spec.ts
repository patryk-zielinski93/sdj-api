import { resolveApp } from '../support/helpers/helpers';
import { mockConfig } from '../support/mocks/configs';
import { getMostPlayedPlayer } from '../support/selectors/most-played.selectors';

describe('Most Played', () => {
  const channelId = 'C9RQHAD53';
  beforeEach(() => {
    resolveApp(`${channelId}/most-played`);
  });

  it('should display player', () => {
    cy.route(
      'POST',
      `http:${mockConfig.backendUrl}graphql`,
      'fixture:most-played-tracks.response.json'
    );
    getMostPlayedPlayer().should('be.visible');
  });
});
