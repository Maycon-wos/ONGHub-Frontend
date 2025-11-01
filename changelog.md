# Changelog

Todos os mudanças significativas neste projeto são documentadas neste arquivo.
O formato segue o **Versionamento Semântico (SemVer)**.

---

## [1.0.0] - 2025-10-27
**Release inicial**
- Aplicação principal concluída
- Todas as páginas e seções principais implementadas
- Layout responsivo pronto
- Navegação interna funcionando
- Estrutura de cards e galeria implementada
- HTML, CSS e JS básicos funcionando

---
## [1.1.0] - 2025-10-27
**Novas funcionalidades**
- Implementado sistema de espaçamento modular (8px, 16px, 24px, 32px, 48px, 64px)
- Implementado sistema de grid customizado (12 colunas)


## [1.2.0] - 2025-10-27
**Novas funcionalidades**
- Implementado sistema de tags e badges para categorização de conteúdo

**Melhorias gerais**
- Ajustes de layout e responsividade para integração com o sistema de grid
## [1.3.0] - 2025-10-27


**Melhorias de Acessibilidade (WCAG)**
- Ajustadas cores para contraste mínimo de 4.5:1
  - Corrige `--color-secondary` para `#66BB6A` (4.8:1)
  - Corrige `--color-azure` para `#1976D2` (5.8:1)
  - Ajusta `--color-gray` para `#5A6268` (6.2:1)
  - Garante contraste mínimo AA em todos os textos

**Navegação por Teclado**
- Adicionado *skip-link* para pular direto ao conteúdo
- Implementados estados `:focus-visible` customizados
- Adicionada navegação por teclado em dropdowns
- Gerenciado foco em modais e componentes interativos

**Suporte a Leitores de Tela**
- Implementadas *roles ARIA* (`banner`, `main`, `contentinfo`)
- Adicionadas *labels* descritivas para *badges* e *tags*
- Estrutura semântica aprimorada com *articles* e *landmarks*
- Atributos `aria-label`, `aria-describedby` e `aria-current` aplicados

## [1.4.0-beta] - 2025-10-27
*(Em fase de testes)*

**Novas funcionalidades**
- Implementado novo sistema de alertas em arquivo JS separado
- Implementado sistema de temas (Theme Mode) com suporte a:
  - Modo escuro (Dark Mode)
  - Modo de alto contraste (High Contrast)
- Ajustadas cores e layout para adaptação automática ao tema selecionado

**Melhorias gerais**
- Organização do código JS em módulos separados para melhor manutenção

**Arquivos removidos**
- `menu.js` (substituído por novo sistema de navegação centralizado)
- `index.min.html`
- `projetos.min.html`
- `cadastro.min.html`
  > *Arquivos `.min.html` foram removidos para padronização e manutenção do fluxo de build e versionamento.*


## [1.5.0] - 2025-10-27
### Adicionado
- Processo de minificação de arquivos CSS e JS para otimização de desempenho
- Compressão de imagens para redução de tamanho e carregamento mais rápido

### Alterado
- Estrutura otimizada para distribuição em produção
- Projeto finalizado e preparado para deploy