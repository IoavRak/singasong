import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const distDir = resolve('dist');
const appDir = join(distDir, 'outprint-para-pc');
const zipPath = join(distDir, 'outprint-para-pc.zip');

rmSync(appDir, { force: true, recursive: true });
rmSync(zipPath, { force: true });
mkdirSync(join(appDir, 'src'), { recursive: true });

cpSync('index.html', join(appDir, 'index.html'));
cpSync('src/main.js', join(appDir, 'src/main.js'));
cpSync('src/styles.css', join(appDir, 'src/styles.css'));

writeFileSync(
  join(appDir, 'INSTRUCCIONES.txt'),
  `OUTPRINT - BUSCADOR DE LIBROS DIFÍCILES\n\n` +
    `Cómo usar la app en tu PC:\n` +
    `1. Descomprime outprint-para-pc.zip.\n` +
    `2. Entra a la carpeta outprint-para-pc.\n` +
    `3. Abre index.html con Chrome, Edge, Firefox o Safari.\n\n` +
    `Atajos incluidos:\n` +
    `- Windows: doble clic en abrir-outprint-windows.bat\n` +
    `- macOS/Linux: ejecuta ./abrir-outprint-mac-linux.sh\n\n` +
    `La app no instala nada y no necesita internet para abrir.\n` +
    `Los botones de búsqueda sí abren sitios externos como AbeBooks, eBay, Amazon, WorldCat y Google Books.\n`,
);

writeFileSync(
  join(appDir, 'abrir-outprint-windows.bat'),
  `@echo off\nstart "" "%~dp0index.html"\n`,
);

writeFileSync(
  join(appDir, 'abrir-outprint-mac-linux.sh'),
  `#!/usr/bin/env sh\nDIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"\n` +
    `if command -v xdg-open >/dev/null 2>&1; then\n` +
    `  xdg-open "$DIR/index.html"\n` +
    `elif command -v open >/dev/null 2>&1; then\n` +
    `  open "$DIR/index.html"\n` +
    `else\n` +
    `  echo "Abre este archivo en tu navegador: $DIR/index.html"\n` +
    `fi\n`,
  { mode: 0o755 },
);

execFileSync('zip', ['-qr', zipPath, 'outprint-para-pc'], { cwd: distDir });

if (!existsSync(zipPath)) {
  console.error('No se pudo crear el archivo descargable.');
  process.exit(1);
}

console.log(`App lista para descargar: ${zipPath}`);
console.log('Entrega ese ZIP o súbelo a tu hosting para que otras personas lo bajen a su PC.');
