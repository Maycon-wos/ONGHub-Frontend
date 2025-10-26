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
  // MÓDULO: MODAL E GALERIA
  // =======================================================
  const Modal = {
      currentIndex: 0,
      
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

              this.initializeGallery();
              this.setupCustomVideoPlay();
          }
      },
      
      close() {
          // Pausa vídeos
          const video = DOM.modalBody.querySelector('video');
          if (video) video.pause();
          
          DOM.modal.classList.remove('visible');
          DOM.modal.setAttribute('aria-hidden', 'true');
          DOM.modalBody.innerHTML = '';
          document.body.style.overflow = 'auto';
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
  // MÓDULO: FORMULÁRIOS E SIMULAÇÕES
  // =======================================================
  const Forms = {
      init() {
          this.setupLoginButtons();
          this.setupDonationForm();
          this.setupCadastroForm();
          this.setupMascaras();
      },
      
      setupLoginButtons() {
          document.querySelectorAll('.btn--login').forEach(botao => {
              botao.addEventListener('click', (e) => {
                  e.preventDefault();
                  this.showAlert('Sistema de login em desenvolvimento.\n\n(Isso é uma simulação para o projeto da faculdade)');
              });
          });
      },
      
      setupDonationForm() {
          if (!DOM.formDoacao) return;
          
          DOM.formDoacao.addEventListener('submit', (e) => {
              e.preventDefault();
              this.showAlert('Doação recebida com sucesso!\n\nMuito obrigado por sua contribuição.\n(Isso é uma simulação para o projeto da faculdade)');
              DOM.formDoacao.reset();
              if (DOM.selectCausa) DOM.selectCausa.value = 'geral';
          });
      },
      
      setupCadastroForm() {
          if (!DOM.formCadastro) return;
          
          DOM.formCadastro.addEventListener('submit', (e) => {
              e.preventDefault();
              this.showAlert('Cadastro efetuado com sucesso!\n\nEm breve entraremos em contato.\n(Isso é uma simulação para o projeto da faculdade)');
              DOM.formCadastro.reset();
          });
      },
      
      setupMascaras() {
          if (typeof jQuery === 'undefined') return;
          
          jQuery(document).ready(function($) {
              $('#cpf').mask('000.000.000-00', {reverse: true});
              $('#cep').mask('00000-000');
              
              var SPMaskBehavior = function (val) {
                  return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
              };
              
              var spOptions = {
                  onKeyPress: function(val, e, field, options) {
                      field.mask(SPMaskBehavior.apply({}, arguments), options);
                  }
              };
              
              $('#telefone').mask(SPMaskBehavior, spOptions);
          });
      },
      
      showAlert(message) {
          alert(message);
      }
  };

  // =======================================================
  // MÓDULO: NAVEGAÇÃO E SCROLL
  // =======================================================
  const Navigation = {
      init() {
          this.setupLogoClick();
          this.setupBackToTop();
          this.setupDonationButtons();
      },
      
      setupLogoClick() {
          if (!DOM.logo) return;
          
          DOM.logo.style.cursor = 'pointer';
          DOM.logo.addEventListener('click', () => {
              window.location.href = 'index.html';
          });
      },
      
      setupBackToTop() {
          if (!DOM.btnTopo) return;
          
          window.addEventListener('scroll', () => {
              const isVisible = window.scrollY > 300;
              DOM.btnTopo.classList.toggle('visible', isVisible);
          });
          
          DOM.btnTopo.addEventListener('click', () => {
              window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
              });
          });
      },
      
      setupDonationButtons() {
          document.addEventListener('click', (e) => {
              if (e.target.classList.contains('btn--doar-especifico')) {
                  e.preventDefault();
                  this.handleDonationButton(e.target);
              }
          });
      },
      
      handleDonationButton(botao) {
          const causa = botao.dataset.causa;
          if (DOM.selectCausa) {
              DOM.selectCausa.value = causa;
              
              // Fecha modal se estiver aberto
              if (typeof Modal.close === 'function') {
                  Modal.close();
              }
              
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