const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--window-size=1280,720',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const jsonStr = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9226/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  const pages = JSON.parse(jsonStr);
  const target = pages.find(p => p.url.includes('5173'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 1000));
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Başla'))?.click()`
  });

  await new Promise(r => setTimeout(r, 2500));

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const dbg = window.__debugGame;
          if (!dbg) return { err: 'no dbg' };
          const root = dbg.char.group;
          const items = [];
          root.traverse(c => {
            items.push({
              name: c.name,
              type: c.type,
              visible: c.visible,
              isMesh: !!c.isMesh,
              isSkinned: !!c.isSkinnedMesh,
              pos: { x: c.position.x, y: c.position.y, z: c.position.z },
              scale: { x: c.scale.x, y: c.scale.y, z: c.scale.z },
              parentName: c.parent?.name
            });
          });
          return { itemsCount: items.length, items: items.slice(0, 25) };
        } catch (e) {
          return { err: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('RESULT:', JSON.stringify(evalRes, null, 2));

  ws.close();
  chrome.kill();
}

main().catch(console.error);
