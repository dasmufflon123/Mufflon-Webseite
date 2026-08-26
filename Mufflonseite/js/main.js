// Mobile-Navigation ein-/ausklappen
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // "Mähr"-Dropdown ein-/ausklappen
  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    const dropdown = trigger.closest('.nav-dropdown');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    function positioniereMenu() {
      // Nur auf breiten Screens berechnen — mobil sitzt es sowieso static im Fluss
      if (window.innerWidth <= 720) return;
      const rect = trigger.getBoundingClientRect();
      menu.style.top = (rect.bottom + 10) + 'px';
      menu.style.left = 'auto';
      menu.style.right = (window.innerWidth - rect.right) + 'px';
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) {
        positioniereMenu();
        dropdown.classList.add('open');
      }
    });

    window.addEventListener('resize', () => {
      if (dropdown.classList.contains('open')) positioniereMenu();
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  });

  // ---------- PDF-Lightbox ----------
  // Öffnet PDFs (Klasse "js-pdf-link") in einem Overlay statt einem neuen Tab.
  const pdfOverlay = document.createElement('div');
  pdfOverlay.className = 'pdf-lightbox-overlay';
  pdfOverlay.innerHTML =
    '<div class="pdf-lightbox-box">' +
      '<div class="pdf-lightbox-header">' +
        '<span class="title" id="pdfLightboxTitle"></span>' +
        '<div class="pdf-lightbox-actions">' +
          '<a class="pdf-lightbox-newtab" id="pdfLightboxNewTab" target="_blank" rel="noopener">Neuer Tab ↗</a>' +
          '<button class="pdf-lightbox-close" type="button" aria-label="Schließen">&times;</button>' +
        '</div>' +
      '</div>' +
      '<iframe id="pdfLightboxFrame" title="PDF Vorschau"></iframe>' +
    '</div>';
  document.body.appendChild(pdfOverlay);

  const pdfFrame = pdfOverlay.querySelector('#pdfLightboxFrame');
  const pdfTitleEl = pdfOverlay.querySelector('#pdfLightboxTitle');
  const pdfNewTabLink = pdfOverlay.querySelector('#pdfLightboxNewTab');
  const pdfCloseBtn = pdfOverlay.querySelector('.pdf-lightbox-close');

  function openPdfLightbox(url, title) {
    // #navpanes=0 klappt die Miniaturansichten-Seitenleiste im PDF-Viewer ein,
    // #view=FitH sorgt dafür, dass die Seite auf die volle Breite skaliert wird.
    pdfFrame.src = url + '#navpanes=0&toolbar=1&view=FitH';
    pdfNewTabLink.href = url;
    pdfTitleEl.textContent = title || '';
    pdfOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePdfLightbox() {
    pdfOverlay.classList.remove('open');
    pdfFrame.src = '';
    document.body.style.overflow = '';
  }

  pdfCloseBtn.addEventListener('click', closePdfLightbox);
  pdfOverlay.addEventListener('click', (e) => {
    if (e.target === pdfOverlay) closePdfLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePdfLightbox();
  });
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a.js-pdf-link');
    if (link) {
      e.preventDefault();
      openPdfLightbox(link.getAttribute('href'), link.dataset.pdfTitle || link.textContent.trim());
    }
  });
});
