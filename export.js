(() => {
  const SCALE = 3;
  const LIB_URL = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js';

  const THEMES = [
    { name: 'Original',  file: 'themes/original.css' },
    { name: 'Summer',    file: 'themes/summer.css' },
    { name: 'Lavender',  file: 'themes/lavender.css' },
    { name: 'Neon',      file: 'themes/neon.css' },
    { name: 'Military',  file: 'themes/military.css' },
    { name: 'Sunset',    file: 'themes/sunset.css' },
    { name: 'Mint',      file: 'themes/mint.css' },
    { name: 'Mono',      file: 'themes/mono.css' },
    { name: 'Royal',     file: 'themes/royal.css' },
    { name: 'Sunny',     file: 'themes/sunny.css' },
  ];

  // ── Toolbar container ──
  const toolbar = document.createElement('div');
  toolbar.id = 'theme-toolbar';
  Object.assign(toolbar.style, {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.5rem',
    fontFamily: "'Space Grotesk', sans-serif",
  });
  document.body.appendChild(toolbar);

  // ── Theme picker (hidden by default) ──
  const picker = document.createElement('div');
  Object.assign(picker.style, {
    display: 'none',
    flexDirection: 'column',
    gap: '0.3rem',
    background: 'var(--bg-alt, #1A1A1A)',
    border: '2px solid var(--border, #333)',
    padding: '0.6rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    maxHeight: '280px',
    overflowY: 'auto',
    width: '100%',
  });
  toolbar.appendChild(picker);

  // Find current theme link
  const themeLink = document.querySelector('link[href^="themes/"]');
  const currentFile = themeLink ? themeLink.getAttribute('href') : '';

  THEMES.forEach((theme) => {
    const item = document.createElement('button');
    item.textContent = theme.file === currentFile ? `● ${theme.name}` : theme.name;
    Object.assign(item.style, {
      padding: '0.4rem 0.8rem',
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: theme.file === currentFile ? '700' : '600',
      fontSize: '0.75rem',
      letterSpacing: '0.04em',
      color: 'var(--text, #fff)',
      background: theme.file === currentFile ? 'var(--accent, #E91E6B)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      whiteSpace: 'nowrap',
    });

    item.addEventListener('mouseenter', () => {
      if (theme.file !== themeLink.getAttribute('href')) {
        item.style.background = 'var(--border, #333)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (theme.file !== themeLink.getAttribute('href')) {
        item.style.background = 'transparent';
      }
    });

    item.addEventListener('click', () => {
      themeLink.setAttribute('href', theme.file);
      // Update active state for all items
      picker.querySelectorAll('button').forEach((b, i) => {
        const t = THEMES[i];
        const isActive = t.file === theme.file;
        b.textContent = isActive ? `● ${t.name}` : t.name;
        b.style.fontWeight = isActive ? '700' : '600';
        b.style.background = isActive ? 'var(--accent, #E91E6B)' : 'transparent';
      });
    });

    picker.appendChild(item);
  });

  // ── Buttons row ──
  const btnRow = document.createElement('div');
  Object.assign(btnRow.style, { display: 'flex', gap: '0.5rem' });
  toolbar.appendChild(btnRow);

  // Shared button style
  const btnStyle = {
    padding: '0.7rem 1.2rem',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: '700',
    fontSize: '0.75rem',
    letterSpacing: '0.06em',
    color: '#fff',
    background: 'var(--accent, #E91E6B)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
  };

  // Theme toggle button
  const themeBtn = document.createElement('button');
  themeBtn.textContent = 'TEMAS';
  Object.assign(themeBtn.style, btnStyle);
  btnRow.appendChild(themeBtn);

  themeBtn.addEventListener('click', () => {
    const isOpen = picker.style.display === 'flex';
    picker.style.display = isOpen ? 'none' : 'flex';
  });

  // Download button
  const dlBtn = document.createElement('button');
  dlBtn.textContent = 'BAIXAR';
  Object.assign(dlBtn.style, btnStyle);
  btnRow.appendChild(dlBtn);

  dlBtn.addEventListener('click', async () => {
    dlBtn.textContent = 'GERANDO...';
    dlBtn.disabled = true;

    if (!window.htmlToImage) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = LIB_URL;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    const target = document.querySelector('.invite-wrapper');
    toolbar.style.display = 'none';

    try {
      const dataUrl = await htmlToImage.toPng(target, {
        pixelRatio: SCALE,
        cacheBust: true,
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'convite-mello-30.png';
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Erro ao gerar imagem. Tente novamente.');
    }

    toolbar.style.display = '';
    dlBtn.textContent = 'BAIXAR';
    dlBtn.disabled = false;
  });
})();
