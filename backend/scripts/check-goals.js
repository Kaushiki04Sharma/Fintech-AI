const fetch = require('node-fetch');

const API_HOST = process.env.API_HOST || `http://localhost:${process.env.PORT || 5000}`;
const TOKEN = process.env.TOKEN; // pass TOKEN env var or use printed token from seed script

if (!TOKEN) {
  console.error('Usage: TOKEN=<jwt_token> node scripts/check-goals.js');
  process.exit(1);
}

(async () => {
  try {
    const res = await fetch(`${API_HOST}/api/goals`, {
      headers: {
        Cookie: `token=${TOKEN}`
      }
    });

    console.log('Status:', res.status);
    const body = await res.text();
    try {
      console.log('Body:', JSON.stringify(JSON.parse(body), null, 2));
    } catch (err) {
      console.log('Body:', body);
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
