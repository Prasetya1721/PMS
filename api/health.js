// Health check endpoint
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    ok: true,
    platform: 'vercel-serverless',
    node: process.version,
    time: new Date().toISOString()
  });
}
