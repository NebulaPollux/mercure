# Plano: Navegação e apresentação do portfólio

## Objetivo

Aprimorar o portfólio de vídeo com quatro referências: perfil do editor apresentado logo no início (UWE Bristol Showcase), navegação anterior/próximo entre vídeos (Cut+Run), rolo de frames nos cabeçalhos dos acordeões (Stanley Payne) e uma seção de perguntas e respostas para potenciais clientes.

**Estado:** navegação do lightbox concluída em branch de trabalho; as demais frentes continuam planejadas.

## Escopo e critérios de sucesso

- Identidade e especialidade do editor ficam claras no primeiro viewport.
- Um vídeo aberto no lightbox pode ser trocado pelo anterior ou próximo sem fechar o player.
- Cada projeto selecionado ganha uma prévia visual de frames no cabeçalho do acordeão.
- O Q&A responde dúvidas comerciais comuns de forma curta e precisa.
- Todas as novas interações e textos funcionam em português e inglês, em desktop e mobile.
- Recursos existentes do site, como embeds Gumlet, foco do lightbox, acordeões e troca de idioma, continuam funcionando.

## 1. Perfil do editor no primeiro viewport

- Reorganizar o hero para apresentar o nome, função, localização e uma frase curta de posicionamento profissional.
- Reaproveitar informações existentes na seção Sobre, sem duplicar conteúdo longo nem inventar credenciais.
- Manter o vídeo de fundo e os CTAs de portfólio/reel, ajustando a hierarquia para o perfil ser percebido de imediato.
- Garantir contraste e legibilidade em telas pequenas e sobre o vídeo de fundo.
- Incluir traduções PT/EN para todo texto novo.

## 2. Navegação entre vídeos no lightbox

**Implementado em 31/10/2026:**

- Lista global dos 28 wrappers na ordem do documento, incluindo blocos recolhidos; sem recriar players nos cards.
- Anterior/próximo com nomes acessíveis PT/EN e estados desabilitados nos extremos.
- Título visível no topo, alinhado à esquerda, atualizado a cada troca.
- Troca do iframe dentro do mesmo modal, com proporção horizontal/vertical e controles abaixo do vídeo.
- Play aleatório do header e da barra mobile entram na mesma sequência a partir do vídeo sorteado.
- Vídeo sorteado sem card é mantido no início daquela sessão, com título factual genérico `Vídeo em destaque` / `Featured video`.
- Escape, setas esquerda/direita, ciclo de foco e retorno ao gatilho original preservados; atalhos do documento não interceptam o teclado dentro do iframe Gumlet de outra origem.

Critérios originais:

- Criar uma lista ordenada dos vídeos navegáveis, mantendo a ordem visual do portfólio.
- Registrar para o vídeo ativo seu ID Gumlet, título, orientação e elemento que abriu o modal.
- Adicionar controles iconográficos de anterior e próximo ao lightbox, com nomes acessíveis traduzidos e estados visuais claros.
- Trocar o iframe e atualizar título e proporção dentro do modal, sem fechá-lo.
- Desabilitar anterior no primeiro vídeo e próximo no último, evitando saltos inesperados.
- Suportar teclas esquerda/direita quando o modal estiver aberto; preservar Escape, foco inicial e retorno do foco ao fechar.
- Posicionar controles para que não cubram o player ou seus controles, especialmente em vídeos verticais e mobile.

## 3. Rolo de frames nos acordeões

- Adicionar uma faixa de thumbnails de momentos diferentes do vídeo a cada cabeçalho dos projetos selecionados.
- Manter o cabeçalho como o único gatilho de abrir/fechar; o vídeo permanece interativo dentro do conteúdo do acordeão.
- Usar imagens Gumlet com tempos definidos por projeto e texto alternativo adequado; prever fallback para frames indisponíveis.
- Preservar as informações atuais dos cases, como contexto, papel, ferramentas e vídeo.
- Fazer a faixa caber em telas estreitas, com rolagem horizontal ou redução controlada, sem overflow da página.
- Respeitar foco por teclado e preferência por movimento reduzido.

## 4. Seção Q&A

- Incluir a seção depois da apresentação/perfil e antes do CTA final.
- Usar acordeões semânticos consistentes com o padrão existente no site.
- Priorizar perguntas úteis para contratação: tipos de trabalho, disponibilidade para same-day, materiais necessários, prazos, formatos de entrega, revisões, ferramentas e pedido de orçamento.
- Manter respostas curtas, claras e compatíveis com serviços e capacidades já apresentados no portfólio.
- Não publicar preços, prazos universais ou promessas não confirmadas.
- Traduzir perguntas e respostas para inglês e português.

## 5. Organização técnica

- Concentrar a implementação em `index.html`, que hoje reúne estrutura, estilos, conteúdo e scripts do site.
- Reutilizar a integração Gumlet, o lightbox, as traduções e os componentes `<details>` existentes.
- Evitar dependências novas ou reestruturação ampla do projeto.
- Evitar duplicar IDs de vídeo e metadados em lugares diferentes; usar uma fonte de dados clara para navegação e frames quando fizer sentido.
- Preservar mudanças preexistentes do workspace e limitar a edição ao escopo desta proposta.

## 6. Validação

**Concluído nesta frente:**

- 36 testes Node passaram, incluindo quatro testes dedicados de navegação, títulos, limites, sequência aleatória e acessibilidade textual.
- Scripts inline passaram por `node --check`.
- Edge headless validou desktop 1440×900, mobile retrato 390×844 e mobile paisagem 844×390: título acima do vídeo, alinhamento à esquerda, stage dentro da viewport, controles abaixo do player e um iframe ativo por vez.
- Play aleatório do header foi validado com troca anterior/próximo e retorno de foco ao botão original. O botão mobile foi validado com vídeo vertical e retorno de foco; eventos reais de teclado confirmaram seta direita e Escape.
- Os testes Edge bloquearam as origens externas de vídeo e verificaram o DOM e o layout local. Não comprovam carregamento/reprodução Gumlet nem atalhos dentro do iframe remoto.
- Review técnico e revisão cética independentes concluídos sem defeitos concretos. A revisão cética executou os quatro testes novos com sucesso. As rotas externas iniciais não entregaram parecer e foram substituídas por revisores internos; nenhum resultado incompleto foi usado como aprovação.

Pendências das demais frentes:

- Verificar IDs e seletores, cobertura de traduções PT/EN e estados de acessibilidade.
- Testar abertura, navegação anterior/próximo, limites da lista, fechamento, retorno do foco, Escape e teclas de seta.
- Testar acordeões e faixa de frames em desktop e mobile, incluindo imagens indisponíveis.
- Testar Q&A com teclado, toque e mudança de idioma.
- Verificar vídeos horizontais e verticais, carregamento lento do iframe e ausência de overflow ou sobreposição.
- Confirmar respeito a `prefers-reduced-motion`.
- Rodar testes existentes, se aplicáveis, e fazer inspeção visual nas larguras desktop e mobile disponíveis.

## Premissas

- O rolo de frames será composto por thumbnails do próprio vídeo, servidas pelo Gumlet, sem exigir novos arquivos de mídia inicialmente.
- A navegação anterior/próximo será global entre os vídeos jogáveis, na ordem visual atual, com controles desabilitados nos extremos.
- O Q&A será informativo; formulário e lógica de orçamento não fazem parte deste escopo.
- Este documento registra o plano. Nenhuma implementação é autorizada por este arquivo por si só.
