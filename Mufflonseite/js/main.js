// Mobile-Navigation ein-/ausklappen
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
});
// Dropdown Menü - Klick zum Öffnen/Schließen
document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.getElementById('mahrDropdown');
  const btn = document.getElementById('mahrBtn');

  if (dropdown && btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Dropdown schließen, wenn man außerhalb klickt
    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });
  }
});
