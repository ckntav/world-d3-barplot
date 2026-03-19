# World D3 Barplot

An animated bar chart built with React and D3 showing the geographic distribution of students in the first cohort of the [D3 + React dataviz course](https://www.react-graph-gallery.com/react-d3-dataviz-course).

![hero](src/assets/hero.png)

## Features

- Animated bars with a cubic ease-out entrance on load
- Hover tooltips showing each country's percentage of the cohort
- Highlighted bar for Canada with a callout annotation
- Confetti burst when the animation completes
- Summary badges showing total student count and number of countries represented

## Tech stack

- [React 19](https://react.dev) for rendering
- [D3 7](https://d3js.org) for scales
- [Vite 8](https://vite.dev) for bundling and dev server

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and deploy to GitHub Pages |
