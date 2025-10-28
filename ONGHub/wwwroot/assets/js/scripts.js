// =======================================================
// APP PRINCIPAL - ORGANIZADO POR MÓDULOS
// =======================================================
const App = (function() {
  // Cache de elementos DOM
  const DOM = {
      // Menu Mobile
      btnMobile: document.getElementById('btn-mobile'),
      headerMenu: document.getElementById('header-menu'),
      
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
      logo: document.querySelector('.logo, .header__logo, [class*="logo"], header img')
  };

  // =======================================================
  // MÓDULO: MENU MOBILE
  // =======================================================
  const MobileMenu = {
      init() {
          if (!DOM.btnMobile || !DOM.headerMenu) return;
          
          DOM.btnMobile.addEventListener('click', this.toggleMenu.bind(this));
      },
      
      toggleMenu() {
          const isNavOpen = DOM.headerMenu.classList.toggle('nav-open');
          
          // Atualiza acessibilidade
          DOM.btnMobile.setAttribute('aria-expanded', isNavOpen);
          DOM.btnMobile.setAttribute('aria-label', isNavOpen ? 'Fechar menu' : 'Abrir menu');
      }
  };

 // =======================================================
// MÓDULO: MODAL E GALERIA COM FOCUS TRAP
// =======================================================
const Modal = {
    currentIndex: 0,
    focusableElements: [],
    firstFocusableElement: null,
    lastFocusableElement: null,
    
    init() {
        if (!DOM.modal) return;
        
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Botões Saiba Mais
        document.querySelectorAll('.btn--saiba-mais').forEach(botao => {
            botao.addEventListener('click', () => this.open(botao));
        });
        
        // Fechar modal
        DOM.modalCloseBtn.addEventListener('click', () => this.close());
        DOM.modal.addEventListener('click', (e) => {
            if (e.target === DOM.modal) this.close();
        });
        
        // Delegação para botões dentro do modal
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

            // ✅ FOCUS TRAP - ABORDAGEM DIRETA
            this.setupFocusTrap();
            
            this.initializeGallery();
            this.setupCustomVideoPlay();
        }
    },
    
    close() {
        // Pausa vídeos
        const video = DOM.modalBody.querySelector('video');
        if (video) video.pause();
        
        // ✅ REMOVE FOCUS TRAP
        this.removeFocusTrap();
        
        DOM.modal.classList.remove('visible');
        DOM.modal.setAttribute('aria-hidden', 'true');
        DOM.modalBody.innerHTML = '';
        document.body.style.overflow = 'auto';
    },
    
    // ✅ FOCUS TRAP SIMPLIFICADO E FUNCIONAL
    setupFocusTrap() {
        // Encontra elementos focáveis
        this.focusableElements = Array.from(DOM.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));

        if (this.focusableElements.length === 0) return;

        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

        // Foca no primeiro elemento
        setTimeout(() => {
            this.firstFocusableElement.focus();
        }, 100);

        // ✅ ADICIONA EVENT LISTENER DIRETAMENTE NO DOCUMENT
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    },
    
    handleKeydown(e) {
        // Só processa se modal estiver aberto
        if (!DOM.modal.classList.contains('visible')) return;
        
        if (e.key === 'Escape') {
            this.close();
            return;
        }
        
        if (e.key !== 'Tab') return;

        // ✅ VERIFICA SE O ELEMENTO ATUAL ESTÁ DENTRO DO MODAL
        const activeElement = document.activeElement;
        const isInModal = DOM.modal.contains(activeElement);

        if (!isInModal) {
            e.preventDefault();
            this.firstFocusableElement.focus();
            return;
        }

        // Shift + Tab (voltar)
        if (e.shiftKey) {
            if (activeElement === this.firstFocusableElement) {
                e.preventDefault();
                this.lastFocusableElement.focus();
            }
        } 
        // Tab (avançar)
        else {
            if (activeElement === this.lastFocusableElement) {
                e.preventDefault();
                this.firstFocusableElement.focus();
            }
        }
    },
    
    removeFocusTrap() {
        // ✅ REMOVE O EVENT LISTENER
        document.removeEventListener('keydown', this.handleKeydown.bind(this));
        this.focusableElements = [];
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;
    },
    
    // ... (mantenha o resto das funções existentes: initializeGallery, showMedia, etc.)
    initializeGallery() {
        const mainView = DOM.modalBody.querySelector('.gallery-main-view');
        const mediaItems = DOM.modalBody.querySelectorAll('.gallery-media-item');
        const thumbnails = DOM.modalBody.querySelectorAll('.gallery-thumb-item');
        const nextBtn = DOM.modalBody.querySelector('.gallery-arrow.next');
        const prevBtn = DOM.modalBody.querySelector('.gallery-arrow.prev');
        const video = DOM.modalBody.querySelector('video');

        if (!mainView || mediaItems.length === 0) return;

        this.currentIndex = 0;

        // Configura thumbnails
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.showMedia(parseInt(thumb.dataset.index), video);
            });
        });

        // Configura setas
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextMedia(mediaItems.length, video));
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevMedia(mediaItems.length, video));
    },
    
    showMedia(index, video) {
        // Pausa vídeo se estiver trocando
        if (this.currentIndex === 0 && index !== 0 && video) {
            video.pause();
        }

        this.currentIndex = index;

        // Remove active de todos
        DOM.modalBody.querySelectorAll('.gallery-media-item, .gallery-thumb-item')
            .forEach(item => item.classList.remove('active'));

        // Adiciona active aos atuais
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
  // INICIALIZAÇÃO DA APLICAÇÃO
  // =======================================================
  return {
      init() {
          MobileMenu.init();
          Modal.init();
          Forms.init();
          Navigation.init();
          
          console.log('🚀 Aplicação inicializada com sucesso!');
      }
  };
})();

// Sistema de roteamento simples
class SimpleSPA {
    constructor() {
      this.routes = {
        '/': 'home.html',
        '/projetos': 'projetos.html', 
        '/cadastro': 'cadastro.html'
      };
      this.init();
    }
    
    async navigate(path) {
      // Carrega conteúdo dinamicamente
      const content = await this.loadPage(path);
      document.getElementById('main-content').innerHTML = content;
      window.history.pushState({}, path, window.location.origin + path);
    }
  }
  // Template engine simples
class TemplateSystem {
    static render(templateId, data) {
      const template = document.getElementById(templateId);
      let html = template.innerHTML;
      
      // Substitui {{var}} por dados
      Object.keys(data).forEach(key => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
      });
      
      return html;
    }
  }
  
  // Uso:
  // TemplateSystem.render('causa-template', { titulo: 'Educação', descricao: '...' });
  class FormValidator {
    constructor(formId) {
      this.form = document.getElementById(formId);
      this.errors = {};
      this.init();
    }
    
    init() {
      this.form.addEventListener('submit', (e) => {
        if (!this.validate()) {
          e.preventDefault();
          this.showErrors();
        }
      });
    }
    
    validate() {
      // Validações customizadas
      this.validateCPF();
      this.validateDataNascimento();
      this.validateEmail();
      return Object.keys(this.errors).length === 0;
    }
    
    showErrors() {
      // Mostra errors específicos para cada campo
      this.showAlert('Por favor, corrija os erros destacados em vermelho.');
    }
  }

// =======================================================
// INICIALIZAR APLICAÇÃO QUANDO DOM ESTIVER PRONTO
// =======================================================
document.addEventListener('DOMContentLoaded', App.init);

// acessibilidade.js
class Acessibilidade {
    constructor() {
      this.init();
    }
  
    init() {
      this.manageFocus();
      this.addAriaLabels();
      this.keyboardNavigation();
    }
  
    // Gerenciamento de foco em modais
    manageFocus() {
      const modals = document.querySelectorAll('.modal-overlay');
      
      modals.forEach(modal => {
        modal.addEventListener('show', () => {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        });
      });
    }
  
    // Navegação por teclado nos dropdowns
    keyboardNavigation() {
      const dropdowns = document.querySelectorAll('.nav__item--dropdown');
      
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav__link');
        const submenu = dropdown.querySelector('.submenu');
        
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleDropdown(dropdown);
          } else if (e.key === 'Escape') {
            this.closeDropdown(dropdown);
          }
        });
      });
    }
  
    toggleDropdown(dropdown) {
      const isExpanded = dropdown.classList.contains('active');
      
      // Fecha outros dropdowns
      document.querySelectorAll('.nav__item--dropdown.active').forEach(item => {
        if (item !== dropdown) this.closeDropdown(item);
      });
      
      if (!isExpanded) {
        dropdown.classList.add('active');
        dropdown.querySelector('.nav__link').setAttribute('aria-expanded', 'true');
      } else {
        this.closeDropdown(dropdown);
      }
    }
  
    closeDropdown(dropdown) {
      dropdown.classList.remove('active');
      dropdown.querySelector('.nav__link').setAttribute('aria-expanded', 'false');
    }
  
    // Adiciona labels ARIA dinamicamente
    addAriaLabels() {
      // Labels para badges
      document.querySelectorAll('.badge').forEach(badge => {
        if (!badge.getAttribute('aria-label')) {
          const text = badge.textContent;
          badge.setAttribute('aria-label', `Categoria: ${text}`);
        }
      });
  
      // Labels para tags
      document.querySelectorAll('.tag').forEach(tag => {
        if (!tag.getAttribute('aria-label')) {
          const text = tag.textContent;
          tag.setAttribute('aria-label', `Tag: ${text}`);
        }
      });
    }
  }
  
  // Inicializar quando DOM estiver pronto
  document.addEventListener('DOMContentLoaded', () => {
    new Acessibilidade();
  });