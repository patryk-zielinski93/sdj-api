import { RTMClient, WebClient } from '@slack/client';
import { appConfig } from '../config';

export class SlackService {
  private static instance: SlackService;
  private readonly _rtm: RTMClient;
  private readonly _web: WebClient;

  get rtm(): RTMClient {
    return this._rtm;
  }

  get web(): WebClient {
    return this._web;
  }

  static getInstance(): SlackService {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
    this._rtm = new RTMClient(appConfig.slack.token);
    this._web = new WebClient(appConfig.slack.token);
    this._rtm.start({});
  }
}
