const { html } = require('hono/html');

function layout(c, title, body) {
  return html`
    <!doctype html>
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        <title>${title}</title>
        <link rel="stylesheet" href="/stylesheets/style.css" />
      </head>
      <body>
        ${body}
        <script src="/javascripts/bundle.js"></script>
      </body>
    </html>
  `;
}

module.exports = layout;