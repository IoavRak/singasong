const MARKETPLACES = [
  {
    name: 'AbeBooks',
    focus: 'Librerías independientes y ediciones descatalogadas',
    buildUrl: ({ title, author, isbn }) => {
      const params = new URLSearchParams({ cm_sp: 'SearchF-_-Advtab1-_-Results' });
      if (title) params.set('tn', title);
      if (author) params.set('an', author);
      if (isbn) params.set('isbn', isbn);
      return `https://www.abebooks.com/servlet/SearchResults?${params.toString()}`;
    },
  },
  {
    name: 'Biblio',
    focus: 'Inventario de librerías usadas y raras',
    buildUrl: ({ title, author, isbn, exactQuery }) => {
      const query = isbn || exactQuery || [title, author].filter(Boolean).join(' ');
      return `https://www.biblio.com/search.php?stage=1&keyisbn=${encodeURIComponent(query)}`;
    },
  },
  {
    name: 'eBay',
    focus: 'Subastas y revendedores particulares',
    buildUrl: ({ exactQuery, isbn }) => {
      const query = isbn || exactQuery;
      return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&_sacat=267`;
    },
  },
  {
    name: 'Amazon usados',
    focus: 'Ofertas de terceros y copias de segunda mano',
    buildUrl: ({ exactQuery, isbn }) => {
      const query = isbn || exactQuery;
      return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&i=stripbooks`;
    },
  },
  {
    name: 'WorldCat',
    focus: 'Bibliotecas para confirmar datos bibliográficos',
    buildUrl: ({ exactQuery, isbn }) => {
      const query = isbn || exactQuery;
      return `https://search.worldcat.org/search?q=${encodeURIComponent(query)}`;
    },
  },
  {
    name: 'Google Books',
    focus: 'Verificación de título, autor, edición e ISBN',
    buildUrl: ({ exactQuery, isbn }) => {
      const query = isbn || exactQuery;
      return `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(query)}`;
    },
  },
];

const form = document.querySelector('#book-form');
const scoreLabel = document.querySelector('#precision-score');
const queryPreview = document.querySelector('#query-preview');
const marketplaceGrid = document.querySelector('#marketplace-grid');
const searchFeedback = document.querySelector('#search-feedback');
const primarySearchButton = document.querySelector('#primary-search-button');

const normalizeIsbn = (value) => value.replace(/[^0-9Xx]/g, '').toUpperCase();

const getFormValue = (name) => form.elements[name].value.trim();

const buildSearchModel = () => {
  const title = getFormValue('title');
  const author = getFormValue('author');
  const publisher = getFormValue('publisher');
  const year = getFormValue('year');
  const isbn = normalizeIsbn(getFormValue('isbn'));
  const quotedTitle = title ? `"${title}"` : '';
  const exactQuery = [quotedTitle, author, publisher, year].filter(Boolean).join(' ').trim();
  const broadQuery = [title, author, publisher, year].filter(Boolean).join(' ').trim();

  return { title, author, publisher, year, isbn, exactQuery: exactQuery || broadQuery || isbn, broadQuery };
};

const buildBrowserSearchUrl = (search) => {
  const siteFilters = ['abebooks.com', 'biblio.com', 'ebay.com', 'amazon.com', 'worldcat.org', 'google.com/books']
    .map((site) => `site:${site}`)
    .join(' OR ');
  const query = `${search.isbn || search.exactQuery} (${siteFilters}) used book out of print rare`;

  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};

const calculatePrecisionScore = ({ title, author, publisher, year, isbn }) => {
  let score = 0;
  if (isbn.length === 10 || isbn.length === 13) score += 45;
  if (title) score += 25;
  if (author) score += 15;
  if (publisher) score += 8;
  if (/^\d{4}$/.test(year)) score += 7;
  return Math.min(score, 100);
};

const hasSearchInput = (search) => Boolean(search.exactQuery || search.isbn);

const renderMarketplaces = (search) => {
  const hasSearch = hasSearchInput(search);
  marketplaceGrid.innerHTML = MARKETPLACES.map((marketplace) => {
    const href = hasSearch ? marketplace.buildUrl(search) : '#';
    const disabledClass = hasSearch ? '' : ' disabled';
    const ariaDisabled = hasSearch ? 'false' : 'true';

    return `
      <article class="marketplace-card">
        <div class="marketplace-icon">📚</div>
        <div>
          <h3>${marketplace.name}</h3>
          <p>${marketplace.focus}</p>
        </div>
        <a class="search-link${disabledClass}" href="${href}" target="_blank" rel="noreferrer" aria-disabled="${ariaDisabled}">
          Buscar ↗
        </a>
      </article>
    `;
  }).join('');
};

const updateSearch = () => {
  const search = buildSearchModel();
  const score = calculatePrecisionScore(search);
  const hasSearch = hasSearchInput(search);

  scoreLabel.textContent = `${score}% precisión estimada`;
  queryPreview.textContent = hasSearch ? search.isbn || search.exactQuery : 'Completa al menos título, autor o ISBN.';
  primarySearchButton.disabled = !hasSearch;
  renderMarketplaces(search);
};

const executePrimarySearch = () => {
  const search = buildSearchModel();

  if (!hasSearchInput(search)) {
    searchFeedback.textContent = 'Escribe al menos el título, autor o ISBN para ejecutar la búsqueda.';
    form.elements.title.focus();
    updateSearch();
    return;
  }

  const url = buildBrowserSearchUrl(search);
  searchFeedback.textContent = 'Abriendo búsqueda web precisa en tu navegador...';

  const openedWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (!openedWindow) {
    window.location.href = url;
  }
};

form.addEventListener('input', updateSearch);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  executePrimarySearch();
});
updateSearch();
