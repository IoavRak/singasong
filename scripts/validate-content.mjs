import { readFileSync } from 'node:fs';

const app = readFileSync('src/main.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
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

if (!app.includes('buildBrowserSearchUrl')) {
  console.error('Falta la búsqueda principal en el browser.');
  process.exit(1);
}

if (!html.includes('Buscar en el navegador') || !html.includes('Comparar en sitios recomendados')) {
  console.error('La interfaz debe estar enfocada en buscar desde el browser.');
  process.exit(1);
}

if (!html.includes('<script defer src="src/main.js"></script>')) {
  console.error('La app debe poder abrirse directamente en el browser sin módulos ni bundler.');
  process.exit(1);
}

if (!html.includes('primary-search-button') || !app.includes('executePrimarySearch')) {
  console.error('Falta el botón principal que ejecuta la búsqueda.');
  process.exit(1);
}

console.log('Contenido validado: app enfocada en búsqueda desde browser.');
