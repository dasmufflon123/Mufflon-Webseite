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
});
