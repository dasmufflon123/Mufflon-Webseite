function renderPDFs(items) {
  const container = document.getElementById("pdf-container");
  if (!container) return;

  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Keine Dokumente gefunden.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "pdf-card";

    const badgeClass = item.typ === "Eventblatt" ? "badge-eventblatt" : "badge-extrablatt";
    
    // Greift auf die passenden Feldernamen deines Datensatzes zu
    const fileName = item.file || item.pdf || item.dateiname || item.link;
    const title = item.titel || item.title || item.name || `Ausgabe ${item.id || ''}`;
    const pdfPath = `./pdf/${encodeURIComponent(fileName)}`;

    card.innerHTML = `
      <span class="badge ${badgeClass}">${item.typ || 'Dokument'}</span>
      <h3>${title}</h3>
      <iframe class="pdf-viewer" src="${pdfPath}"></iframe>
      <div class="pdf-actions">
        <a href="${pdfPath}" target="_blank">PDF öffnen ↗</a>
      </div>
    `;

    container.appendChild(card);
  });
}

// Sucht automatisch nach bekannten Variablennamen aus deiner opfanze-data.js
function getData() {
  if (typeof opfanzePDFs !== 'undefined') return opfanzePDFs;
  if (typeof opfanzeData !== 'undefined') return opfanzeData;
  if (typeof data !== 'undefined') return data;
  if (window.opfanzePDFs) return window.opfanzePDFs;
  if (window.opfanzeData) return window.opfanzeData;
  return [];
}

function filterPDFs(typ) {
  const allData = getData();
  if (typ === 'all') {
    renderPDFs(allData);
  } else {
    const filtered = allData.filter(item => item.typ === typ);
    renderPDFs(filtered);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const allData = getData();
  renderPDFs(allData);
});
