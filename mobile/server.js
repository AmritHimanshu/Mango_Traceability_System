// mobile/server.js
const { createServer } = require('http');
const next = require('next');

const port = 3000;
const app = next({ dev: false, dir: '../client' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> Ready on http://192.168.4.52:${port}`);
  });
});
