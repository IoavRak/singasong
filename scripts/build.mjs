import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('dist', { force: true, recursive: true });
mkdirSync('dist/src', { recursive: true });
cpSync('index.html', 'dist/index.html');
cpSync('src/main.js', 'dist/src/main.js');
cpSync('src/styles.css', 'dist/src/styles.css');
console.log('Build estático creado en dist/.');
