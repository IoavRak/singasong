# Outprint

Outprint es un MVP web estático en español para buscar libros agotados, raros o difíciles de encontrar en plataformas de reventa y catálogos bibliográficos.

## Ejecutarlo en el navegador

No necesitas instalar frameworks ni compilar nada para probarlo.

### Opción rápida: abrir el archivo

1. Abre `index.html` directamente con tu navegador.
2. Completa título, autor, ISBN, editorial o año.
3. Usa las tarjetas para abrir la búsqueda precisa en cada plataforma.

### Opción recomendada: servidor local

```bash
npm start
```

Después abre esta URL en tu navegador:

```text
http://localhost:4173
```

Si quieres intentar abrir el navegador automáticamente:

```bash
npm run open
```

## Crear archivo para descargar en PC

Para generar un ZIP que puedas bajar, compartir o subir a un hosting:

```bash
npm run package
```

El archivo queda aquí:

```text
dist/outprint-para-pc.zip
```

Ese ZIP incluye todo lo necesario para usar la app en una PC: `index.html`, estilos, JavaScript, instrucciones y atajos para abrirla en Windows, macOS o Linux. La persona solo debe descomprimirlo y abrir `index.html` en su navegador.

## Comandos disponibles

```bash
npm test
```

Valida que las plataformas recomendadas, las señales de precisión y la guía principal estén presentes.

```bash
npm run build
```

Crea una copia estática en `dist/` lista para publicar en un hosting de archivos estáticos.

```bash
npm run package
```

Crea `dist/outprint-para-pc.zip`, el paquete descargable para usar la app en otra PC.
