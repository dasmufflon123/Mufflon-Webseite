/* ============================================================
   NAVIGATION & DROPDOWN ("MÄHR")
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const dropdownBtn = document.getElementById('maehrDropdownBtn');
  const dropdownMenu = document.getElementById('maehrDropdownMenu');

  // Prüfen, ob die Elemente auf der aktuellen Seite vorhanden sind
  if (!dropdownBtn || !dropdownMenu) return;

  // Hilfsfunktion: Menü schließen
  const closeDropdown = () => {
    dropdownMenu.classList.remove('show');
    dropdownBtn.setAttribute('aria-expanded', 'false');
  };

  // Hilfsfunktion: Menü öffnen/umschalten
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Verhindert, dass das Document-Click-Event sofort auslöst
    const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      closeDropdown();
    } else {
      dropdownMenu.classList.add('show');
      dropdownBtn.setAttribute('aria-expanded', 'true');
    }
  };

  // 1. Klick auf den Button: Dropdown öffnen/schließen
  dropdownBtn.addEventListener('click', toggleDropdown);

  // 2. Klick irgendwo außerhalb: Dropdown automatisch schließen
  document.addEventListener('click', (e) => {
    if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      closeDropdown();
    }
  });

  // 3. Escape-Taste drücken: Dropdown schließen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });
});
