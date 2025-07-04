// start-next.js
const { spawn } = require('child_process');

// Фильтруем лишние параметры, чтобы запускался только next dev --turbopack ...
const args = ['dev', '--turbopack'];

// Прокидываем переменные окружения, если заданы
if (process.env.PORT) {
  args.push('--port', process.env.PORT);
}
if (process.env.HOSTNAME) {
  args.push('--hostname', process.env.HOSTNAME);
}

const next = spawn('npx', ['next', ...args], { stdio: 'inherit' });

next.on('close', code => process.exit(code));
