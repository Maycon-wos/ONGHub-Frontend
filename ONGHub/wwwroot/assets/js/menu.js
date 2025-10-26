// Controle simples do menu dropdown
document.addEventListener('DOMContentLoaded', function() {
    const mobileBtn = document.querySelector('.header__btn-mobile');
    const mainMenu = document.getElementById('main-menu');
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    
    // Menu mobile toggle 
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mainMenu.classList.toggle('nav-open');
      });
    }
    
    // Dropdown no mobile
    dropdownItems.forEach(function(item) {
      const link = item.querySelector('.nav__link');
      
      link.addEventListener('click', function(e) {
        // No mobile, toggle do dropdown
        if (window.innerWidth <= 767) {
          e.preventDefault();
          
          // Fecha outros dropdowns
          dropdownItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              otherItem.querySelector('.nav__link').setAttribute('aria-expanded', 'false');
            }
          });
          
          // Toggle do dropdown atual
          const isActive = item.classList.contains('active');
          item.classList.toggle('active');
          link.setAttribute('aria-expanded', !isActive);
        }
        
      });
    });
    
    // Fechar menu ao clicar fora (mobile)
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 767) {
        if (!mainMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
          mainMenu.classList.remove('nav-open');
          mobileBtn.setAttribute('aria-expanded', 'false');
          dropdownItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.nav__link').setAttribute('aria-expanded', 'false');
          });
        }
      }
    });
  });