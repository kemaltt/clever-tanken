const https = require('https');
const fs = require('fs');
const path = require('path');

// Read .env manually since we can't rely on dotenv being installed/configured for this standalone script easily
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/TANKERKOENIG_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;

if (!apiKey) {
  console.error("API Key not found in .env");
  process.exit(1);
}

// First get a station ID from list
const listUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=52.5200&lng=13.4050&rad=5&sort=dist&type=all&apikey=${apiKey}`;

https.get(listUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (!json.stations || json.stations.length === 0) {
      console.error("No stations found to test detail");
      return;
    }
    const stationId = json.stations[0].id;
    console.log("Testing detail for station:", stationId);

    // Now fetch detail
    const detailUrl = `https://creativecommons.tankerkoenig.de/json/detail.php?id=${stationId}&apikey=${apiKey}`;
    https.get(detailUrl, (res2) => {
      let data2 = '';
      res2.on('data', (chunk) => data2 += chunk);
      res2.on('end', () => {
        console.log("Detail Response:", data2);
      });
    });
  });
});
