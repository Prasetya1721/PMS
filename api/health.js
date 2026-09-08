// Minimal health check — CommonJS
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, node: process.version, time: new Date().toISOString() }));
};
