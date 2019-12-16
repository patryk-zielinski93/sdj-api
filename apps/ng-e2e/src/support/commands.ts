// ***********************************************
import { mockConfig } from './configs';
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { playerHtmlAudio } from './player.po';

export function login(): void {
  window.localStorage.setItem('token', 'xoxo');
}

export const expectPlayingAudio = () => {
  playerHtmlAudio().should((els: JQuery<HTMLAudioElement>) => {
    let isPlaying = false;
    els.each((index: number, el: HTMLAudioElement) => {
      isPlaying = el.duration > 0 && !el.paused && !el.muted;
    });
    expect(isPlaying).to.eq(true);
  });
};

export const resolveApp = () => {
  login();
  cy.server();
  cy.route(
    'GET',
    'https://slack.com/api/conversations.list*',
    'fixture:slack-channels.response.json'
  ).as('channels');

  cy.visit('/', {
    onBeforeLoad(win: Window): void {
      // @ts-ignore
      win.__env = {
        backendUrl: mockConfig.backendUrl,
        externalStream: mockConfig.externalStream
      };
    }
  });
};
