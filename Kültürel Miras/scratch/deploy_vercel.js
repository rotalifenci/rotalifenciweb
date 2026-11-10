const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const authFile = path.join(os.homedir(), 'AppData/Roaming/com.vercel.cli/Data/auth.json');
const auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));

if (!auth.token) {
  console.error('No token in auth.json');
  process.exit(1);
}

console.log('Deploying with token...');
const proc = spawn('npx.cmd', ['vercel', '--prod', '--yes', '--token', auth.token], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

proc.on('close', (code) => {
  console.log('Deploy process finished with code:', code);
  process.exit(code);
});
