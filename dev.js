import { spawn } from 'child_process';
console.log('\n[Antigravity] Redirecionando comando "npx run dev" para "npm run dev"... \n');
spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
