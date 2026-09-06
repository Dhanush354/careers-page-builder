export function buildCanvasCSS(primaryColor: string): string {
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: ${primaryColor};
      --foreground: #111827;
      --muted: #6B7280;
      --muted-bg: #F9FAFB;
      --background: #ffffff;
      --border: #E5E7EB;
      --card: #ffffff;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--foreground);
      background: var(--background);
      line-height: 1.6;
    }

    h1, h2, h3, h4 { line-height: 1.15; font-weight: 700; }
    p { line-height: 1.7; }
    a { color: var(--primary); text-decoration: none; }

    .section-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    .btn-primary {
      display: inline-block;
      background: var(--primary);
      color: #fff;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      text-decoration: none;
      transition: opacity .15s;
    }
    .btn-primary:hover { opacity: .88; }

    .btn-outline {
      display: inline-block;
      background: transparent;
      color: var(--primary);
      padding: 13px 31px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      border: 2px solid var(--primary);
      cursor: pointer;
      text-decoration: none;
      transition: background .15s;
    }
    .btn-outline:hover { background: var(--primary); color: #fff; }

    /* Grid utilities */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    }
    @media (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
    }

    /* Card */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }

    /* Chip / badge */
    .badge {
      display: inline-block;
      background: color-mix(in srgb, var(--primary) 12%, transparent);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 100px;
      font-size: .75rem;
      font-weight: 600;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    .text-muted { color: var(--muted); }
    .text-center { text-align: center; }
    .section-eyebrow {
      font-size: .75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: var(--primary);
      margin-bottom: 12px;
    }
  `;
}
