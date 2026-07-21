  <script src="js/Opfanze-data.js"></script>
  <script src="js/main.js"></script>
  <script>
    // ============================================================
    // OPFANZE KIOSK — JavaScript (KORRIGIERT)
    // ============================================================

    // Sortierung: nach Nummer (höchste zuerst)
    // Die Nummer ist z.B. "112026" – wir sortieren nach der gesamten Zahl
    function sortByNumber(arr) {
      return [...arr].sort((a, b) => {
        const numA = parseInt(a.nummer, 10);
        const numB = parseInt(b.nummer, 10);
        return numB - numA;
      });
    }

    function getAllAusgaben() {
      return sortByNumber(OPFANZE_AUSGABEN);
    }

    // ---- DOM-Elemente ----
    const grid = document.getElementById('kioskGrid');
    const featuredContainer = document.getElementById('featuredContainer');
    const searchInput = document.getElementById('kioskSearch');
    const filterButtons = document.querySelectorAll('#filterTabs button');

    let currentFilter = 'alle';
    let currentSearch = '';

    // ---- Render-Funktion ----
    function render() {
      const alle = getAllAusgaben();
      
      // Filtern
      let gefiltert = alle.filter(ausgabe => {
        if (currentFilter === 'alle') return true;
        return ausgabe.typ === currentFilter;
      });

      // Suche
      if (currentSearch.trim()) {
        const query = currentSearch.toLowerCase().trim();
        gefiltert = gefiltert.filter(ausgabe => {
          const nummerMatch = ausgabe.nummer && ausgabe.nummer.includes(query);
          const titelMatch = ausgabe.titel && ausgabe.titel.toLowerCase().includes(query);
          const typMatch = ausgabe.typ && ausgabe.typ.toLowerCase().includes(query);
          return nummerMatch || titelMatch || typMatch;
        });
      }

      // Hervorgehobene Ausgabe: erste (neueste) aus der gefilterten Liste
      let featured = null;
      let rest = [];
      if (gefiltert.length > 0) {
        featured = gefiltert[0];
        rest = gefiltert.slice(1);
      }

      // Featured rendern
      renderFeatured(featured);

      // Grid rendern
      renderGrid(rest);
    }

    // ---- Featured rendern ----
    function renderFeatured(ausgabe) {
      if (!ausgabe) {
        featuredContainer.innerHTML = `
          <div style="text-align:center; padding:20px; color:var(--text-soft);">
            <p style="font-family:'Patrick Hand',cursive; font-size:1.1rem;">Keine Ausgabe gefunden 🌿</p>
          </div>
        `;
        return;
      }

      // Nur die ersten 2 Ziffern der Nummer für die Anzeige (z.B. "11" aus "112026")
      const anzeigeNummer = ausgabe.nummer.slice(0, 2);
      const typLabel = ausgabe.typ;
      const typClass = ausgabe.typ === 'Eventblatt' ? 'event' : '';
      const datumFormatiert = ausgabe.datum ? formatiereDatum(ausgabe.datum) : '';

      featuredContainer.innerHTML = `
        <a href="${ausgabe.pfad}" target="_blank" rel="noopener" class="featured-card" style="text-decoration:none; color:inherit; display:flex;">
          <span class="featured-badge">⭐ Neueste Ausgabe</span>
          <div class="featured-info">
            <span class="typ-badge ${typClass}">${typLabel}</span>
            <h2>Ausgabe ${anzeigeNummer}</h2>
            <p style="font-size:1.1rem; font-weight:600; color:var(--text); margin:0 0 2px;">${ausgabe.titel}</p>
            <p class="meta">${datumFormatiert}</p>
            <span class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Jetzt lesen
            </span>
          </div>
          <div class="featured-number">#${anzeigeNummer}</div>
        </a>
      `;
    }

    // ---- Grid rendern ----
    function renderGrid(ausgaben) {
      if (ausgaben.length === 0) {
        grid.innerHTML = `<div class="kiosk-empty">Keine Ausgaben gefunden 🌿</div>`;
        return;
      }

      let html = '';
      ausgaben.forEach(ausgabe => {
        // Nur die ersten 2 Ziffern der Nummer für die Anzeige
        const anzeigeNummer = ausgabe.nummer.slice(0, 2);
        const typLabel = ausgabe.typ;
        const typClass = ausgabe.typ === 'Eventblatt' ? 'event' : '';
        const datumFormatiert = ausgabe.datum ? formatiereDatum(ausgabe.datum) : '';

        html += `
          <a href="${ausgabe.pfad}" target="_blank" rel="noopener" class="kiosk-card">
            <span class="card-typ ${typClass}">${typLabel}</span>
            <div class="card-nummer">#${anzeigeNummer}</div>
            <div class="card-titel">${ausgabe.titel}</div>
            <div class="card-datum">${datumFormatiert}</div>
          </a>
        `;
      });

      grid.innerHTML = html;
    }

    // ---- Event-Listener ----
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      render();
    });

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
      });
    });

    // ---- Initialer Render ----
    render();
  </script>
