const { spawn } = require('child_process');

// Фильтруем только dev и turbopack
const args = ['dev', '--turbopack'];

// Получаем порт и hostname из argv (с конца)
const portArgIndex = process.argv.findIndex(arg => /^\d+$/.test(arg));
const port = portArgIndex !== -1 ? process.argv[portArgIndex] : process.env.PORT || '9002';
const hostname = process.argv[portArgIndex + 1] || process.env.HOSTNAME || '0.0.0.0';

if (port) {
  args.push('--port', port);
}
if (hostname) {
  args.push('--hostname', hostname);
}

console.log('Launching Next.js with:', args);

const next = spawn('npx', ['next', ...args], { stdio: 'inherit' });

next.on('close', code => process.exit(code));
