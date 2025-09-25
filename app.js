const http = require('http');
const video = require('./video');
const PORT = 8080;
const HOST = '127.0.0.1';

http.createServer((req, res) => {
  if (req.url.startsWith('/video')) {
    video.handleVideoRequest(req, res);
    return;
  }
  returnNotFound(res);
}).listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

const returnNotFound = (res) => {
  res.writeHead('404', { 'Content-Type': 'text/plain' });
  res.end('Not found');
}