export const getPlayButton = () => cy.get('.play');
export const getPlayerHtmlAudioElement = () => cy.get('#playerHtmlAudio');
export const getTrackNameElement = () =>
  cy.get("[data-test~='awesome-player__title']");
export const getArtistNameElement = () =>
  cy.get("[data-test~='awesome-player__second-title']");
export const getQueuedTracks = () => cy.get("[data-test~='queued-track']");
