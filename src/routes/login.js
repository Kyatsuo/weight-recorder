const { Hono } = require('hono');
const { html } = require('hono/html');
const layout = require('../layout');

const app = new Hono();

app.get('/', (c) => {
  const { user } = c.get('session') ?? {};
  return c.html(
    layout(
      c,
      '',
      html`
        <a href="/auth/github">GitHub でログイン</a>
        ${user
          ? html`<p>現在 ${user.login} でログイン中</p>`
          : ''}
      `,
    ),
  );
});

module.exports = app;