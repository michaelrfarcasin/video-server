const path = require('path');
const fs = require('fs');
const url = require('url');

const handleVideoRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const videoId = parsedUrl.query?.id;
  if (!videoId) {
    res.writeHead('404', { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
  const range = req.headers.range;
  if (!range) {
    handleFullVideoRequest(res, videoId);
    return;
  }
  handleVideoRangeRequest(res, videoId, range);
}

const handleFullVideoRequest = (res, id) => {
  const videoPath = getVideoPath(id);
  const fileSize = fs.statSync(videoPath).size;
  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  }
  res.writeHead(200, head);
  fs.createReadStream(videoPath).pipe(res);
}

const getVideoPath = (id) => {
  return path.join(__dirname, 'media', `${id}.mp4`);
}

const handleVideoRangeRequest = (res, id, range) => {
  const videoPath = getVideoPath(id);
  const fileSize = fs.statSync(videoPath).size;
  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = (end - start) + 1;
  const head = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  }
  res.writeHead(206, head);
  fs.createReadStream(videoPath, { start, end }).pipe(res);
}

module.exports = {
  handleVideoRequest
}