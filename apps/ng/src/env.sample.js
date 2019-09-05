(function(window) {
  window.__env = window.__env || {};
  window.__env.backendUrl = '//{{backendUrl}}/';
  window.__env.radioStreamUrl = '//{{radioStreamUrl}}/';
  window.__env.externalStream = '//{{externalStream}}';
  window.__env.slack = {
    clientId: '{{slackClientId}}',
    clientSecret: '{{slackClientSecret}}'
  };
})(this);
