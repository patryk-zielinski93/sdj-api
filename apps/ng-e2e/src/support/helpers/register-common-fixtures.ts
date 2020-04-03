import { mockConfig } from '../mocks/configs';

export const registerCommonFixtures = () => {
  cy.route(
    'GET',
    'https://slack.com/api/conversations.list*',
    'fixture:slack-channels.response.json'
  ).as('slack-channels');

  cy.route(
    'GET',
    `${mockConfig.apiUrl}/channel*`,
    'fixture:channels.response.json'
  ).as('channels');
};
