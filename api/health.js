export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    platform: 'vercel-serverless',
    node: process.version,
    time: new Date().toISOString()
  }));
}
