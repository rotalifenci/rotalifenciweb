const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  console.log('Launched Chrome...');
  await new Promise(r => setTimeout(r, 2000));

  // Get WebSocket debugger URL
  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const pages = JSON.parse(data);
        console.log('Pages found:', pages.map(p => ({ title: p.title, url: p.url, ws: p.webSocketDebuggerUrl })));
      } catch (e) {
        console.error('Failed to parse pages JSON', e);
      }
      chrome.kill();
    });
  }).on('error', err => {
    console.error('HTTP GET error:', err);
    chrome.kill();
  });
}

main();
