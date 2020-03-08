export const getPlayButton = () => cy.get('.play');
export const getPlayerHtmlAudioElement = () => cy.get('#playerHtmlAudio');
export const getTrackNameElement = () => cy.get('.song .name');
export const getArtistNameElement = () => cy.get('.song .artist');
export const getQueuedTracks = () => cy.get("[data-test~='queued-track']");
