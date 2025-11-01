// =======================================================
// SISTEMA DE VALIDAÇÃO INTEGRADO - ONGHub
// =======================================================

const ONGHubValidator = {
    // Configurações
    config: {
      animateErrors: true,
      scrollToError: true,
      showSuccessIcon: true
    },
  
    // Inicializa o sistema
    init() {
      this.setupCadastroForm();
      this.setupDoacaoForm();
      console.log('✅ Validação ONGHub inicializada');
    },
  
    // =======================================================
    // FORMULÁRIO DE CADASTRO
    // =======================================================
    setupCadastroForm() {
      const form = document.querySelector('.cadastro__form');
      if (!form) return;
  
      // Configura máscaras automáticas
      this.setupMasks(form);
  
      // Validação em tempo real
      this.setupRealTimeValidation(form);
  
      // Validação no submit
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (this.validateCadastroForm(form)) {
          this.onCadastroSuccess(form);
        } else {
          this.onFormError(form);
        }
      });
  
      console.log('📝 Formulário de cadastro configurado');
    },
  
    // Configura máscaras automáticas
    setupMasks(form) {
      // CPF
      const cpfInput = form.querySelector('#cpf');
      if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
          e.target.value = value;
        });
      }
  
      // Telefone
      const telefoneInput = form.querySelector('#telefone');
      if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length <= 10) {
            value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1)$2-$3');
          } else {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1)$2-$3');
          }
          e.target.value = value;
        });
      }
  
      // CEP
      const cepInput = form.querySelector('#cep');
      if (cepInput) {
        cepInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          value = value.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
          e.target.value = value;
          
          // Busca CEP automaticamente quando completo
          if (value.length === 9) {
            this.buscarCEP(value, form);
          }
        });
      }
  
      // Data de Nascimento
      const nascimentoInput = form.querySelector('#nascimento');
      if (nascimentoInput) {
        nascimentoInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          value = value.replace(/^(\d{2})(\d{2})(\d{4}).*/, '$1/$2/$3');
          e.target.value = value;
        });
      }
    },
  
    // Validação em tempo real (ao sair do campo)
    setupRealTimeValidation(form) {
      const inputs = form.querySelectorAll('input[required], select[required]');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
  
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    },
  
    // Valida formulário de cadastro completo
    validateCadastroForm(form) {
      let isValid = true;
      let firstErrorField = null;
  
      // Limpa erros anteriores
      this.clearAllErrors(form);
  
      // Nome
      const nome = form.querySelector('#nome');
      if (!this.validateNome(nome)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = nome;
      }
  
      // Email
      const email = form.querySelector('#email');
      if (!this.validateEmail(email)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = email;
      }
  
      // Data de Nascimento
      const nascimento = form.querySelector('#nascimento');
      if (!this.validateNascimento(nascimento)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = nascimento;
      }
  
      // CPF
      const cpf = form.querySelector('#cpf');
      if (!this.validateCPF(cpf)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = cpf;
      }
  
      // Telefone
      const telefone = form.querySelector('#telefone');
      if (!this.validateTelefone(telefone)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = telefone;
      }
  
      // CEP
      const cep = form.querySelector('#cep');
      if (!this.validateCEP(cep)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = cep;
      }
  
      // Endereço
      const endereco = form.querySelector('#endereco');
      if (!this.validateEndereco(endereco)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = endereco;
      }
  
      // Cidade
      const cidade = form.querySelector('#cidade');
      if (!this.validateCidade(cidade)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = cidade;
      }
  
      // Estado
      const estado = form.querySelector('#estado');
      if (!this.validateEstado(estado)) {
        isValid = false;
        if (!firstErrorField) firstErrorField = estado;
      }
  
      // Scroll para o primeiro erro
      if (!isValid && firstErrorField && this.config.scrollToError) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
  
      return isValid;
    },
  
    // =======================================================
    // VALIDAÇÕES INDIVIDUAIS
    // =======================================================
  
    validateField(field) {
      const fieldId = field.id;
      
      switch(fieldId) {
        case 'nome':
          return this.validateNome(field);
        case 'email':
          return this.validateEmail(field);
        case 'nascimento':
          return this.validateNascimento(field);
        case 'cpf':
          return this.validateCPF(field);
        case 'telefone':
          return this.validateTelefone(field);
        case 'cep':
          return this.validateCEP(field);
        case 'endereco':
          return this.validateEndereco(field);
        case 'cidade':
          return this.validateCidade(field);
        case 'estado':
          return this.validateEstado(field);
        default:
          return this.validateRequired(field);
      }
    },
  
    validateNome(input) {
      if (!input) return true;
      const value = input.value.trim();
      
      if (value === '') {
        this.showError(input, 'Por favor, digite seu nome completo');
        return false;
      }
      
      if (value.length < 3) {
        this.showError(input, 'Nome deve ter pelo menos 3 caracteres');
        return false;
      }
  
      if (!value.includes(' ')) {
        this.showError(input, 'Por favor, digite nome e sobrenome');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateEmail(input) {
      if (!input) return true;
      const value = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (value === '') {
        this.showError(input, 'Por favor, digite seu e-mail');
        return false;
      }
      
      if (!emailRegex.test(value)) {
        this.showError(input, 'E-mail inválido. Use o formato: seu@email.com');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateNascimento(input) {
      if (!input) return true;
      const value = input.value.trim();
      
      if (value === '') {
        this.showError(input, 'Por favor, informe sua data de nascimento');
        return false;
      }
  
      // Valida formato DD/MM/AAAA
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(value)) {
        this.showError(input, 'Data inválida. Use o formato: DD/MM/AAAA');
        return false;
      }
  
      // Valida se é uma data válida
      const [, day, month, year] = value.match(dateRegex);
      const date = new Date(year, month - 1, day);
      
      if (date.getDate() != day || date.getMonth() + 1 != month || date.getFullYear() != year) {
        this.showError(input, 'Data de nascimento inválida');
        return false;
      }
  
      // Valida idade mínima (16 anos)
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      
      if (age < 16 || (age === 16 && monthDiff < 0)) {
        this.showError(input, 'Você precisa ter pelo menos 16 anos');
        return false;
      }
  
      // Valida se não é uma data futura
      if (date > today) {
        this.showError(input, 'Data de nascimento não pode ser no futuro');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateCPF(input) {
      if (!input) return true;
      const value = input.value.replace(/\D/g, '');
      
      if (value === '') {
        this.showError(input, 'Por favor, digite seu CPF');
        return false;
      }
  
      if (value.length !== 11) {
        this.showError(input, 'CPF incompleto');
        return false;
      }
  
      // Valida CPF
      if (/^(\d)\1+$/.test(value)) {
        this.showError(input, 'CPF inválido');
        return false;
      }
  
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(value.charAt(i)) * (10 - i);
      }
      let digit = 11 - (sum % 11);
      if (digit >= 10) digit = 0;
      if (digit !== parseInt(value.charAt(9))) {
        this.showError(input, 'CPF inválido');
        return false;
      }
  
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(value.charAt(i)) * (11 - i);
      }
      digit = 11 - (sum % 11);
      if (digit >= 10) digit = 0;
      if (digit !== parseInt(value.charAt(10))) {
        this.showError(input, 'CPF inválido');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateTelefone(input) {
      if (!input) return true;
      const value = input.value.replace(/\D/g, '');
      
      if (value === '') {
        this.showError(input, 'Por favor, digite seu telefone');
        return false;
      }
  
      if (value.length < 10) {
        this.showError(input, 'Telefone incompleto');
        return false;
      }
  
      if (value.length === 10 && value.charAt(2) !== '9') {
        this.showError(input, 'Para fixo, use 10 dígitos. Para celular, use 11 dígitos');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateCEP(input) {
      if (!input) return true;
      const value = input.value.replace(/\D/g, '');
      
      if (value === '') {
        this.showError(input, 'Por favor, digite seu CEP');
        return false;
      }
  
      if (value.length !== 8) {
        this.showError(input, 'CEP incompleto');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateEndereco(input) {
      if (!input) return true;
      const value = input.value.trim();
      
      if (value === '') {
        this.showError(input, 'Por favor, digite seu endereço');
        return false;
      }
  
      if (value.length < 5) {
        this.showError(input, 'Endereço muito curto');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateCidade(input) {
      if (!input) return true;
      const value = input.value.trim();
      
      if (value === '') {
        this.showError(input, 'Por favor, digite sua cidade');
        return false;
      }
  
      if (value.length < 3) {
        this.showError(input, 'Nome de cidade inválido');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateEstado(input) {
      if (!input) return true;
      const value = input.value;
      
      if (value === '' || value === null) {
        this.showError(input, 'Por favor, selecione seu estado');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    validateRequired(input) {
      if (!input) return true;
      const value = input.value.trim();
      
      if (value === '') {
        this.showError(input, 'Este campo é obrigatório');
        return false;
      }
  
      this.showSuccess(input);
      return true;
    },
  
    // =======================================================
    // BUSCA CEP (VIA VIACEP)
    // =======================================================
    buscarCEP(cep, form) {
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) return;
  
      const enderecoInput = form.querySelector('#endereco');
      const cidadeInput = form.querySelector('#cidade');
      const estadoInput = form.querySelector('#estado');
  
      // Mostra loading
      const cepInput = form.querySelector('#cep');
      const container = cepInput.closest('.form-group');
      container.classList.add('loading');
  
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(response => response.json())
        .then(data => {
          container.classList.remove('loading');
  
          if (data.erro) {
            this.showError(cepInput, 'CEP não encontrado');
            return;
          }
  
          // Preenche os campos
          if (enderecoInput && data.logradouro) {
            enderecoInput.value = `${data.logradouro}${data.complemento ? ', ' + data.complemento : ''}`;
          }
          if (cidadeInput && data.localidade) {
            cidadeInput.value = data.localidade;
          }
          if (estadoInput && data.uf) {
            estadoInput.value = data.uf;
          }
  
          // Foca no campo de número
          if (enderecoInput) {
            enderecoInput.focus();
            enderecoInput.setSelectionRange(enderecoInput.value.length, enderecoInput.value.length);
          }
  
          this.showSuccess(cepInput);
        })
        .catch(() => {
          container.classList.remove('loading');
          this.showError(cepInput, 'Erro ao buscar CEP. Tente novamente');
        });
    },
  
    // =======================================================
    // FORMULÁRIO DE DOAÇÃO
    // =======================================================
    setupDoacaoForm() {
      const form = document.querySelector('.apoie__form');
      if (!form) return;
  
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (this.validateDoacaoForm(form)) {
          this.onDoacaoSuccess(form);
        }
      });
  
      console.log('💰 Formulário de doação configurado');
    },
  
    validateDoacaoForm(form) {
      const causaSelect = form.querySelector('#causa-doacao');
      const valorInput = form.querySelector('#valor');
      const valorButtons = form.querySelectorAll('.btn--valor');
      
      let isValid = true;
  
      // Valida causa
      if (!causaSelect || !causaSelect.value) {
        this.showAlert('Por favor, selecione uma causa para doar', 'error');
        isValid = false;
      }
  
      // Valida valor
      const valorSelecionado = Array.from(valorButtons).some(btn => btn.classList.contains('active'));
      const valorCustom = valorInput && valorInput.value;
      
      if (!valorSelecionado && !valorCustom) {
        this.showAlert('Por favor, selecione ou digite um valor para doar', 'error');
        isValid = false;
      }
  
      return isValid;
    },
  
    // =======================================================
    // FEEDBACK VISUAL
    // =======================================================
  
    showError(input, message) {
      const container = input.closest('.form-group');
      if (!container) return;
  
      // Remove erros anteriores
      this.clearFieldError(input);
  
      // Adiciona classe de erro
      container.classList.add('form-error');
      container.classList.remove('form-success');
  
      // Cria mensagem de erro
      const errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      errorElement.setAttribute('role', 'alert');
      
      container.appendChild(errorElement);
  
      // Animação shake
      if (this.config.animateErrors) {
        input.style.animation = 'shake 0.3s';
        setTimeout(() => { input.style.animation = ''; }, 300);
      }
    },
  
    showSuccess(input) {
      if (!this.config.showSuccessIcon) return;
      
      const container = input.closest('.form-group');
      if (!container) return;
  
      container.classList.remove('form-error');
      container.classList.add('form-success');
    },
  
    clearFieldError(input) {
      const container = input.closest('.form-group');
      if (!container) return;
  
      const errorElement = container.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
      
      container.classList.remove('form-error');
    },
  
    clearAllErrors(form) {
      const errorMessages = form.querySelectorAll('.error-message');
      errorMessages.forEach(msg => msg.remove());
  
      const errorContainers = form.querySelectorAll('.form-error');
      errorContainers.forEach(container => {
        container.classList.remove('form-error', 'form-success');
      });
    },
  
    // =======================================================
    // CALLBACKS DE SUCESSO
    // =======================================================
  
    onCadastroSuccess(form) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      console.log('✅ Cadastro válido:', data);
  
      this.showAlert(
        `🎉 Cadastro realizado com sucesso!<br><br>
        <strong>Em breve entraremos em contato</strong> para conversarmos sobre as oportunidades de voluntariado.<br><br>
        Obrigado por querer fazer a diferença!`,
        'success'
      );
  
      // Limpa o formulário
      setTimeout(() => {
        form.reset();
        this.clearAllErrors(form);
      }, 2000);
    },
  
    onDoacaoSuccess(form) {
      const causaSelect = form.querySelector('#causa-doacao');
      const causa = causaSelect ? causaSelect.options[causaSelect.selectedIndex].text : 'Geral';
      
      this.showAlert(
        `👍 Obrigado pela sua doação!<br><br>
        <strong>Causa:</strong> ${causa}<br>
        Em um ambiente real, você seria redirecionado para o pagamento.`,
        'success'
      );
  
      form.reset();
      document.querySelectorAll('.btn--valor').forEach(btn => btn.classList.remove('active'));
    },
  
    onFormError(form) {
      this.showAlert('❌ Por favor, corrija os erros no formulário', 'error');
    },
  
    // =======================================================
    // SISTEMA DE ALERTAS
    // =======================================================
  
    showAlert(message, type = 'info') {
      // Reutiliza o sistema existente se disponível
      if (window.Alerts && window.Alerts.showAlert) {
        window.Alerts.showAlert(message, type);
        return;
      }
  
      // Fallback
      const alert = document.createElement('div');
      alert.className = `custom-alert alert--${type} show`;
      alert.innerHTML = `
        <div class="alert-content">
          <span class="alert-message">${message}</span>
          <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `;
      document.body.appendChild(alert);
  
      setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
      }, type === 'success' ? 8000 : 5000);
    }
  };
  
  // =======================================================
  // INICIALIZAÇÃO AUTOMÁTICA
  // =======================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ONGHubValidator.init());
  } else {
    ONGHubValidator.init();
  }
  
  // Exporta para uso global
  window.ONGHubValidator = ONGHubValidator;