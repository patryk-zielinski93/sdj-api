import { WebSocketEvents } from '@sdj/shared/domain';
import { isPlaying, resolveApp } from '../support/helpers/helpers';
import {
  getArtistNameElement,
  getPlayButton,
  getPlayerHtmlAudioElement,
  getQueuedTracks,
  getTrackNameElement
} from '../support/selectors/radio.selectors';
import { mockConfig } from '../support/mocks/configs';
import { emmitInWs } from '../support/mocks/websocket';

describe('Radio', () => {
  beforeEach(() => {
    resolveApp();
  });

  describe('Player', () => {
    it('should play', () => {
      getPlayButton().click();
      cy.wait(2000);
      getPlayerHtmlAudioElement().then((els: JQuery<HTMLAudioElement>) => {
        const el: HTMLAudioElement = els.get(0);
        expect(isPlaying(el)).to.eq(true);
      });
    });

    it('should play radio', () => {
      setTimeout(() => {
        emmitInWs(WebSocketEvents.roomIsRunning);
      }, 2000);
      getPlayButton().click();
      cy.wait(3000);
      getPlayerHtmlAudioElement().then((els: JQuery<HTMLAudioElement>) => {
        const el: HTMLAudioElement = els.get(0);
        expect(el.src).to.eq('http:' + mockConfig.radioStreamUrl + 'C9RQHAD53');
      });
    });
  });

  describe('Queue', () => {
    it('should display current track', () => {
      setTimeout(() => {
        emmitInWs(WebSocketEvents.queuedTrackList, [
          { track: { title: 'Song 1' }, addedBy: { name: 'Maciej Sikorski' } }
        ]);
      }, 2000);
      cy.wait(3000);
      getTrackNameElement().contains('Song 1');
      getArtistNameElement().contains('Maciej Sikorski');
    });

    it('should display tracks in queue', () => {
      setTimeout(() => {
        emmitInWs(WebSocketEvents.queuedTrackList, [
          {
            track: { id: '2Lb2BiUC898', title: 'Song 1' },
            addedBy: { name: 'Maciej Sikorski' }
          },
          {
            track: { id: '2Lb2BiUC898', title: 'Song 2' },
            addedBy: { name: 'Maciej Sikorski' }
          },
          {
            track: { id: '2Lb2BiUC898', title: 'Song 3' },
            addedBy: { name: 'Maciej Sikorski' }
          }
        ]);
      }, 2000);
      cy.wait(3000);
      getQueuedTracks()
        .its('length')
        .should('eq', 2);
    });
  });
});
