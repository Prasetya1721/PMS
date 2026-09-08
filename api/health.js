// Absolute minimum serverless function — tests if Vercel can run ANY function
export default function handler(req, res) {
  res.end('{"ok":true}');
}
