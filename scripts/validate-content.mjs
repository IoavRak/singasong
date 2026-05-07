import { readFileSync } from 'node:fs';

const app = readFileSync('src/main.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const packageJson = readFileSync('package.json', 'utf8');
const requiredMarketplaces = ['AbeBooks', 'Biblio', 'eBay', 'Amazon usados', 'WorldCat', 'Google Books'];
const missing = requiredMarketplaces.filter((name) => !app.includes(name));

if (missing.length > 0) {
  console.error(`Faltan plataformas requeridas: ${missing.join(', ')}`);
  process.exit(1);
}

if (!app.includes('calculatePrecisionScore') || !app.includes('normalizeIsbn')) {
  console.error('Faltan utilidades de precisión para ISBN y puntuación.');
  process.exit(1);
}

if (!html.includes('libros agotados') || !html.includes('Cómo mantener resultados precisos')) {
  console.error('Falta contenido explicativo clave en la interfaz.');
  process.exit(1);
}

if (!html.includes('<script defer src="src/main.js"></script>')) {
  console.error('La app debe poder ejecutarse directamente en el browser sin módulos ni bundler.');
  process.exit(1);
}

if (!packageJson.includes('package-download.mjs')) {
  console.error('Falta el comando para crear el ZIP descargable.');
  process.exit(1);
}

console.log('Contenido validado: plataformas, señales de precisión, guía y ejecución browser presentes.');
