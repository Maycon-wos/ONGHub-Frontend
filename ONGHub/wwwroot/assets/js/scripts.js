// =======================================================
// APP PRINCIPAL - ORGANIZADO POR MÓDULOS 
// =======================================================
const App = (function() {
  // Cache de elementos DOM
  let DOM = {};

  const initDOM = () => {
    DOM = {
      // Menu Mobile
      btnMobile: document.querySelector('.header__btn-mobile'),
      headerMenu: document.getElementById('main-menu'),
      
      // Modal
      modal: document.getElementById('project-modal'),
      modalCloseBtn: document.getElementById('modal-close'),
      modalBody: document.getElementById('modal-body'),
      
      // Formulários
      formDoacao: document.querySelector('.apoie__form'),
      formCadastro: document.querySelector('.cadastro__form'),
      selectCausa: document.getElementById('causa-doacao'),
      
      // Botões
      btnTopo: document.getElementById('btnTopo'),
      logo: document.querySelector('.header__logo img'),
      
      // Sistema de Temas
      themeButtons: document.querySelectorAll('.theme-btn'),
      
      // Navegação
      navLinks: document.querySelectorAll('a[href^="#"]')
    };
  };

  // =======================================================
  // MÓDULO: SISTEMA DE TEMAS
  // =======================================================
  const ThemeManager = {
    init() {
      if (!document.querySelector('.theme-option')) {
        console.warn('⚠ Botões de tema não encontrados');
        return;
      }
      
      this.setupThemeButtons();
      this.loadSavedTheme();
      this.setupDropdown();
      console.log('🎨 Sistema de temas (dropdown) inicializado');
    },

    setupThemeButtons() {
      const themeOptions = document.querySelectorAll('.theme-option');
      
      themeOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const theme = e.currentTarget.dataset.theme;
          this.setTheme(theme);
          this.updateButtonStates(theme);
          this.updateCurrentThemeIcon(theme);
          this.closeDropdown();
        });
      });
    },

    setupDropdown() {
      const dropdown = document.querySelector('.theme-selector-dropdown');
      const dropdownBtn = document.querySelector('.theme-dropdown-btn');
      
      if (!dropdown || !dropdownBtn) return;
      
      // Fechar dropdown ao clicar fora
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          this.closeDropdown();
        }
      });
      
      // Alternar dropdown
      dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
      
      // Teclado: ESC fecha dropdown
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeDropdown();
        }
      });
    },

    toggleDropdown() {
      const dropdownBtn = document.querySelector('.theme-dropdown-btn');
      const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
      dropdownBtn.setAttribute('aria-expanded', !isExpanded);
    },

    closeDropdown() {
      const dropdownBtn = document.querySelector('.theme-dropdown-btn');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    },

    updateCurrentThemeIcon(theme) {
      const currentIcon = document.querySelector('.theme-current-icon');
      const icons = {
        'light': '☀️',
        'dark': '🌙', 
        'high-contrast': '⚫'
      };
      
      if (currentIcon) {
        currentIcon.textContent = icons[theme] || '🎨';
      }
    },

    setTheme(theme) {
      // Remove todos os temas primeiro
      document.documentElement.removeAttribute('data-theme');
      
      // Aplica apenas se não for o tema light padrão
      if (theme !== 'light') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      
      // Salva preferência
      localStorage.setItem('preferred-theme', theme);
    },

    loadSavedTheme() {
      const savedTheme = localStorage.getItem('preferred-theme');
      
      if (savedTheme) {
        this.setTheme(savedTheme);
        this.updateButtonStates(savedTheme);
        this.updateCurrentThemeIcon(savedTheme);
      } else {
        // Define tema padrão como light
        this.setTheme('light');
        this.updateButtonStates('light');
        this.updateCurrentThemeIcon('light');
      }
    },

    updateButtonStates(selectedTheme) {
      const themeOptions = document.querySelectorAll('.theme-option');
      
      themeOptions.forEach(btn => {
        const isSelected = btn.dataset.theme === selectedTheme;
        btn.setAttribute('aria-pressed', isSelected);
      });
    },

    // Método utilitário para debug
    getCurrentTheme() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    // Método para resetar tema
    resetTheme() {
      localStorage.removeItem('preferred-theme');
      this.setTheme('light');
      this.updateButtonStates('light');
      this.updateCurrentThemeIcon('light');
    }
  };

  // =======================================================
  // MÓDULO: NAVEGAÇÃO
  // =======================================================
  const Navigation = {
    init() {
      this.setupSmoothScroll();
      this.setupBackToTop();
      console.log('🧭 Navegação inicializada');
    },
    
    setupSmoothScroll() {
      if (!DOM.navLinks.length) return;
      
      DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    },
    
    setupBackToTop() {
      if (!DOM.btnTopo) return;
      
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          DOM.btnTopo.classList.add('visible');
        } else {
          DOM.btnTopo.classList.remove('visible');
        }
      });
      
      DOM.btnTopo.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // =======================================================
  // MÓDULO: FORMULÁRIOS
  // =======================================================
  const Forms = {
    init() {
      this.setupDonationForm();
      this.setupRegistrationForm();
      console.log('📝 Formulários inicializados');
    },
    
    setupDonationForm() {
      if (!DOM.formDoacao) return;
      
      const valueButtons = DOM.formDoacao.querySelectorAll('.btn--valor');
      const customValueInput = DOM.formDoacao.querySelector('#valor');
      
      valueButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          valueButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (customValueInput) customValueInput.value = '';
        });
      });
      
      if (customValueInput) {
        customValueInput.addEventListener('input', () => {
          valueButtons.forEach(b => b.classList.remove('active'));
        });
      }
    },
    
    setupRegistrationForm() {
      if (!DOM.formCadastro) return;
      
      DOM.formCadastro.addEventListener('submit', (e) => {
        if (!this.validateRegistration()) {
          e.preventDefault();
          this.showFormError('Por favor, preencha todos os campos obrigatórios.');
        }
      });
    },
    
    validateRegistration() {
      const requiredFields = DOM.formCadastro.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--color-accent)';
        } else {
          field.style.borderColor = '';
        }
      });
      
      return isValid;
    },
    
    showFormError(message) {
      alert(message);
    }
  };

// =======================================================
// MÓDULO: MENU MOBILE 
// =======================================================
const MobileMenu = {
  init() {
    this.menuButton = document.querySelector('.header__btn-mobile');
    this.menu = document.querySelector('.header__menu');
    
    if (!this.menuButton || !this.menu) {
      console.warn('⚠ Elementos do menu mobile não encontrados');
      return;
    }
    
    this.setupEventListeners();
    console.log('📱 Menu mobile inicializado');
  },

  setupEventListeners() {
    // Botão hamburger
    this.menuButton.addEventListener('click', () => this.toggleMenu());
    
    // Event listener para lidar com todos os cliques DENTRO do menu
    this.menu.addEventListener('click', (e) => this.handleMenuClicks(e));
    
    // Fechar menu ao redimensionar para desktop (usando 768px como breakpoint)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        this.closeMenu();
      }
    });
  },

// =======================================================
// MÉTODO handleMenuClicks 
// =======================================================
handleMenuClicks(e) {
  const link = e.target.closest('a');
  
  
  if (!link) return; 

  const parentDropdownLi = link.closest('li.nav__item--dropdown');
  
  // 1. Lógica do Dropdown
  if (parentDropdownLi && link.classList.contains('nav__link')) {
      
     
      const isMobileScreen = window.innerWidth <= 767; 

      if (isMobileScreen) {
          
          e.preventDefault();
          this.toggleDropdown(parentDropdownLi, link);
      }
      
      
  } else if (link.classList.contains('submenu__link')) {
      // 2. Links internos do Submenu
      this.closeMenu();
      
  } else if (link.getAttribute('href') && !parentDropdownLi && !link.closest('.theme-selector-dropdown')) {
      // 3. Links normais 
      this.closeMenu();
  }
  
  
},
  
  toggleDropdown(liElement, linkElement) {
      const isCurrentlyOpen = liElement.classList.contains('dropdown-open');

      // Se estiver aberto, fecha. Se estiver fechado, abre.
      if (isCurrentlyOpen) {
          liElement.classList.remove('dropdown-open');
          linkElement.setAttribute('aria-expanded', 'false');
      } else {
          // Fecha todos os outros dropdowns para evitar múltiplos abertos
          this.menu.querySelectorAll('li.nav__item--dropdown.dropdown-open').forEach(openLi => {
              openLi.classList.remove('dropdown-open');
              const openLink = openLi.querySelector('.nav__link');
              if (openLink) openLink.setAttribute('aria-expanded', 'false');
          });
          
          // Abre o dropdown atual
          liElement.classList.add('dropdown-open');
          linkElement.setAttribute('aria-expanded', 'true');
      }
  },

  toggleMenu() {
    const isExpanded = this.menuButton.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },

  openMenu() {
    this.menuButton.setAttribute('aria-expanded', 'true');
    this.menu.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
  },

  closeMenu() {
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.menu.classList.remove('nav-open');
    document.body.style.overflow = '';
    
    // Fecha todos os dropdowns abertos ao fechar o menu principal
    this.menu.querySelectorAll('li.nav__item--dropdown.dropdown-open').forEach(li => {
      li.classList.remove('dropdown-open');
      const link = li.querySelector('.nav__link');
      if (link) link.setAttribute('aria-expanded', 'false');
    });
  }
};

  // =======================================================
  // MÓDULO: MODAL E GALERIA
  // =======================================================
  const Modal = {
    currentIndex: 0,
    focusableElements: [],
    firstFocusableElement: null,
    lastFocusableElement: null,
    
    init() {
      if (!DOM.modal) {
        console.log('ℹ️ Modal não encontrado - provavelmente não está nesta página');
        return;
      }
      
      const saibaMaisButtons = document.querySelectorAll('.btn--saiba-mais');
      if (saibaMaisButtons.length === 0) {
        console.log('ℹ️ Nenhum botão "Saiba Mais" encontrado');
        return;
      }
      
      this.setupEventListeners();
      console.log('🖼️ Modal inicializado com', saibaMaisButtons.length, 'botões');
    },
    
    setupEventListeners() {
      document.querySelectorAll('.btn--saiba-mais').forEach(botao => {
        botao.addEventListener('click', () => this.open(botao));
      });
      
      DOM.modalCloseBtn.addEventListener('click', () => this.close());
      DOM.modal.addEventListener('click', (e) => {
        if (e.target === DOM.modal) this.close();
      });
      
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn--doar-especifico') && 
            DOM.modal.contains(e.target)) {
          this.handleDonationClick(e.target);
        }
      });
    },
    
    open(botao) {
      const contentId = botao.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const card = botao.closest('.causa-card');
      const title = card.querySelector('h3').innerHTML;

      if (content) {
        DOM.modalBody.innerHTML = '<h3>' + title + '</h3>' + content.innerHTML;
        DOM.modal.classList.add('visible');
        DOM.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        this.setupFocusTrap();
        this.initializeGallery();
        this.setupCustomVideoPlay();
      }
    },
    
    close() {
      const video = DOM.modalBody.querySelector('video');
      if (video) video.pause();
      
      this.removeFocusTrap();
      DOM.modal.classList.remove('visible');
      DOM.modal.setAttribute('aria-hidden', 'true');
      DOM.modalBody.innerHTML = '';
      document.body.style.overflow = 'auto';
    },
    
    setupFocusTrap() {
      this.focusableElements = Array.from(DOM.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ));

      if (this.focusableElements.length === 0) return;

      this.firstFocusableElement = this.focusableElements[0];
      this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

      setTimeout(() => {
        this.firstFocusableElement.focus();
      }, 100);

      document.addEventListener('keydown', this.handleKeydown.bind(this));
    },
    
    handleKeydown(e) {
      if (!DOM.modal.classList.contains('visible')) return;
      
      if (e.key === 'Escape') {
        this.close();
        return;
      }
      
      if (e.key !== 'Tab') return;

      const activeElement = document.activeElement;
      const isInModal = DOM.modal.contains(activeElement);

      if (!isInModal) {
        e.preventDefault();
        this.firstFocusableElement.focus();
        return;
      }

      if (e.shiftKey) {
        if (activeElement === this.firstFocusableElement) {
          e.preventDefault();
          this.lastFocusableElement.focus();
        }
      } else {
        if (activeElement === this.lastFocusableElement) {
          e.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    },
    
    removeFocusTrap() {
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
      this.focusableElements = [];
      this.firstFocusableElement = null;
      this.lastFocusableElement = null;
    },
    
    initializeGallery() {
      const mainView = DOM.modalBody.querySelector('.gallery-main-view');
      const mediaItems = DOM.modalBody.querySelectorAll('.gallery-media-item');
      const thumbnails = DOM.modalBody.querySelectorAll('.gallery-thumb-item');
      const nextBtn = DOM.modalBody.querySelector('.gallery-arrow.next');
      const prevBtn = DOM.modalBody.querySelector('.gallery-arrow.prev');
      const video = DOM.modalBody.querySelector('video');

      if (!mainView || mediaItems.length === 0) return;

      this.currentIndex = 0;

      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
          this.showMedia(parseInt(thumb.dataset.index), video);
        });
      });

      if (nextBtn) nextBtn.addEventListener('click', () => this.nextMedia(mediaItems.length, video));
      if (prevBtn) prevBtn.addEventListener('click', () => this.prevMedia(mediaItems.length, video));
    },
    
    showMedia(index, video) {
      if (this.currentIndex === 0 && index !== 0 && video) {
        video.pause();
      }

      this.currentIndex = index;

      DOM.modalBody.querySelectorAll('.gallery-media-item, .gallery-thumb-item')
        .forEach(item => item.classList.remove('active'));

      const currentMedia = DOM.modalBody.querySelector(`.gallery-media-item[data-index="${index}"]`);
      const currentThumb = DOM.modalBody.querySelector(`.gallery-thumb-item[data-index="${index}"]`);
      
      if (currentMedia) currentMedia.classList.add('active');
      if (currentThumb) currentThumb.classList.add('active');
    },
    
    nextMedia(totalItems, video) {
      let nextIndex = this.currentIndex + 1;
      if (nextIndex >= totalItems) nextIndex = 0;
      this.showMedia(nextIndex, video);
    },
    
    prevMedia(totalItems, video) {
      let prevIndex = this.currentIndex - 1;
      if (prevIndex < 0) prevIndex = totalItems - 1;
      this.showMedia(prevIndex, video);
    },
    
    setupCustomVideoPlay() {
      const playOverlays = DOM.modalBody.querySelectorAll('.custom-play-overlay');

      playOverlays.forEach(overlay => {
        const videoElement = overlay.closest('.gallery-media-item').querySelector('video');
        const playButton = overlay.querySelector('.play-button');

        if (videoElement && playButton) {
          playButton.addEventListener('click', () => {
            videoElement.play();
            overlay.classList.add('hidden');
          });
          
          videoElement.addEventListener('ended', () => {
            overlay.classList.remove('hidden');
          });

          videoElement.addEventListener('pause', () => {
            if (!videoElement.ended) overlay.classList.remove('hidden');
          });

          videoElement.addEventListener('play', () => {
            overlay.classList.add('hidden');
          });
        }
      });
    },
    
    handleDonationClick(botao) {
      const causa = botao.dataset.causa;
      if (DOM.selectCausa) {
        DOM.selectCausa.value = causa;
        this.close();
        this.scrollToDonation();
      }
    },
    
    scrollToDonation() {
      const doacaoSection = document.getElementById('doar-agora');
      if (doacaoSection) {
        setTimeout(() => {
          doacaoSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      }
    }
  };

  // =======================================================
  // MÓDULO: SISTEMA DE ALERTAS E FEEDBACK
  // =======================================================
  const Alerts = {
    init() {
      this.setupLoginAlert();
      this.setupDonationAlert();
      this.setupRegistrationAlert();
      console.log('💬 Sistema de alertas inicializado');
    },
    
    setupLoginAlert() {
      const loginBtn = document.querySelector('.btn--login');
      if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showAlert('Sistema de login em desenvolvimento! <br> Em breve você poderá fazer login na plataforma.', 'info');
        });
      }
    },
    
    setupDonationAlert() {
      const donationForm = document.querySelector('.apoie__form');
      if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const causaSelect = document.getElementById('causa-doacao');
          const valorInput = document.getElementById('valor') || document.querySelector('.btn--valor.active');
          
          let causa = causaSelect ? causaSelect.options[causaSelect.selectedIndex].text : 'Geral';
          let valor = '0,00';
          
          if (valorInput) {
            if (valorInput.value) {
              valor = parseFloat(valorInput.value).toFixed(2);
            } else if (valorInput.textContent) {
              valor = valorInput.textContent.replace('R$ ', '');
            }
          }
          
          this.showAlert(
            `👍 Obrigado pela sua doação!<br><br>
            <strong>Causa:</strong> ${causa}<br>
            Em um ambiente real, você seria redirecionado para o pagamento.`,
            'success'
          );
          
          // Limpa o formulário
          donationForm.reset();
          document.querySelectorAll('.btn--valor').forEach(btn => btn.classList.remove('active'));
        });
      }
    },
    
    setupRegistrationAlert() {
      const registrationForm = document.querySelector('.cadastro__form');
      if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          if (this.validateRegistrationForm()) {
            this.showAlert(
              `🎉 Cadastro realizado com sucesso!<br><br>
              <strong>Em breve entraremos em contato</strong> para conversarmos sobre as oportunidades de voluntariado.<br><br>
              Obrigado por querer fazer a diferença!`,
              'success'
            );
            
            registrationForm.reset();
          }
        });
      }
    },
    
    validateRegistrationForm() {
      const requiredFields = document.querySelectorAll('.cadastro__form [required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--color-accent)';
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (!isValid) {
        this.showAlert('Por favor, preencha todos os campos obrigatórios marcados em vermelho.', 'error');
      }
      
      return isValid;
    },
    
    showAlert(message, type = 'info') {
      // Remove alerta anterior se existir
      const existingAlert = document.querySelector('.custom-alert');
      if (existingAlert) {
        existingAlert.remove();
      }
      
      // Cria o alerta
      const alert = document.createElement('div');
      alert.className = `custom-alert alert--${type}`;
      alert.innerHTML = `
        <div class="alert-content">
          <span class="alert-message">${message}</span>
          <button class="alert-close" aria-label="Fechar mensagem">×</button>
        </div>
      `;
      
      // Adiciona ao DOM
      document.body.appendChild(alert);
      
      
      setTimeout(() => alert.classList.add('show'), 100);
      
      
      alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
      });
      
      
      if (type === 'success' || type === 'info') {
        setTimeout(() => {
          if (alert.parentElement) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
          }
        }, 8000);
      }
    }
  };

  // =======================================================
  // INICIALIZAÇÃO DA APLICAÇÃO
  // =======================================================
  return {
    init() {
      initDOM();
      
      console.log('🔍 Elementos encontrados:', {
        btnMobile: !!DOM.btnMobile,
        headerMenu: !!DOM.headerMenu,
        modal: !!DOM.modal,
        btnTopo: !!DOM.btnTopo,
        themeButtons: DOM.themeButtons.length,
        navLinks: DOM.navLinks.length
      });
      
      ThemeManager.init();
      MobileMenu.init();
      Modal.init();
      Forms.init();
      Navigation.init();
      Alerts.init();
      
      console.log('🚀 Aplicação ONGHub inicializada com sucesso!');
    }
  };
  
})();

// =======================================================
// AUTO-COMPLET FORMULÁRIO PATTERN
// =======================================================

const telInput = document.getElementById('telefone');
// Verifica se o elemento existe antes de adicionar o listener
if (telInput) {
    telInput.addEventListener('input', function (e) {
        //  código de formatação do telefone
        let value = e.target.value.replace(/\D/g, ''); 
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1)$2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1)$2');
        } else {
            value = value.replace(/^(\d*)/, '($1');
        }
        e.target.value = value;
    });
}

const cpfInput = document.getElementById('cpf');
// Verifica se o elemento existe antes de adicionar o listener
if (cpfInput) {
    cpfInput.addEventListener('input', function (e) {
        //  código de formatação do CPF
        let value = e.target.value.replace(/\D/g, ''); 
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
        }
        e.target.value = value;
    });
}

const nascInput = document.getElementById('nascimento');
if (nascInput) {
    nascInput.addEventListener('input', function (e) {
        //  código de formatação da data de nascimento
        let value = e.target.value.replace(/\D/g, ''); 
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) {
            value = value.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1/$2/$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
        }
        e.target.value = value;
    });
}
// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando aplicação ONGHub...');
  App.init();
});