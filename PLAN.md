# Mercure Portfolio: plano de melhoria e retomada

Atualizado: 2026-10-29 (preparação Vercel Analytics e auditoria pré-DNS)

## Objetivo

Lançar `mercurevideo.com.br` como portfólio profissional de um freelancer, com custo recorrente baixo, contato fácil, trabalhos carregando corretamente e métricas úteis de interesse e conversão. Priorizar confiabilidade e apresentação antes de adicionar serviços pagos ou recursos complexos.

## Estado conhecido

- Hospedagem atual: Vercel. O usuário confirmou `mercurevideo.com.br` como domínio canônico; Cloudflare Pages será usado depois para teste. O PR #2 foi mesclado no GitHub e o deploy de produção está ativo em `https://mercurevideo.vercel.app/`; DNS do domínio personalizado continua separado.
- Implementação publicada em `index.html`: referências atualizadas para `images/icon.svg`, `images/outline.svg` e `images/profile_photo_2.jpg`; incluída abertura do currículo por idioma com `noopener`; corrigido toggle dos Reels no desktop; filtros agora sincronizam estilo/`aria-pressed`, filtragem e expansão; rótulo e `aria-expanded` do toggle acompanham idioma/estado. Menu móvel agora sincroniza `aria-expanded` nos dois botões e `aria-hidden` no menu, e fecha com Escape. Lightbox move o foco para Fechar ao abrir, retorna ao gatilho ao fechar, possui título acessível traduzido e isola as regiões de fundo com `inert`; Tab/Shift+Tab circulam entre Fechar e o iframe. Prévia hover só carrega em dispositivos com hover/pointer preciso e quando movimento reduzido não está ativo. O loop `requestAnimationFrame` do parallax não inicia com `prefers-reduced-motion`; o estado do header usa scroll passivo. CSS também desativa marquee/rolagem suave e reduz duração de transições/animações. Os 28 cards de vídeo são promovidos a controles `role=button` focáveis, recebem nome de `alt` do thumbnail e abrem o modal por Enter/Espaço; itens filtrados usam `display:none` e ficam fora da ordem de foco.
- Marquee de logos: oito marcas agora aparecem no HTML, incluindo os arquivos novos `logos/sesc.png` e `logos/caixa_consorcio.png`. A P&G tinha um retângulo branco opaco dentro do SVG, que ficava branco junto com o filtro dos logos e escondia o símbolo; removido o fundo mantendo a marca branca. O fundo branco embutido da P&G foi removido. Seu `viewBox` atual é `0 45 193 92`, incluindo todo o desenho até y=137 sem cortar a base. A Caixa Consórcio teve as margens transparentes externas recortadas do PNG. Todos os logos compartilham filtro branco; P&G usa caixa de 148×52px e margem lateral de -12px para aproximá-lo dos vizinhos; Santander/TRANSPETRO têm 150px de largura e Caixa 128×42px. Track centraliza verticalmente todas as caixas com `align-items: center`, preservando proporções por `object-fit: contain`; contêiner mantém respiro vertical de 4px. O header desktop e a barra inferior mobile agora usam a exportação raster preenchida `images/infill_white_4x.png` (2049×2049, RGBA com transparência), dimensionada pelo CSS para cada viewport; o SVG inline antigo da barra mobile é ocultado. A barra mobile usa grid com colunas laterais proporcionais e botão de play centralizado para espaçar logo e menu de forma simétrica. O arquivo de logo na raiz mencionado pelo usuário é a marca Mercure do header, não a P&G, e não foi usado no marquee. Os logos mantêm proporção com `object-fit: contain`. Espaçamento do track: 48px; duração do ciclo: 40s. O logo `logos/5era.png` foi adicionado imediatamente após Record News. Duplicatas do loop são clones `aria-hidden`; os logos da área inicial não usam lazy loading.
- Auditoria de teclado: `archiveContainer` e `reelsExpandWrapper` agora iniciam com `inert` quando recolhidos; a propriedade é removida ao expandir/filtrar e sincronizada ao trocar idioma/voltar para Todos, impedindo foco em cards invisíveis. O botão `toggleArchiveBtn` inicia com `aria-expanded="false"` e atualiza ao abrir/fechar e trocar idioma. Scripts inline e 13 referências locais passaram; mudanças locais ainda não publicadas. Corrigidos os textos iniciais em português do slogan e do título Sobre; alinhada a chave de tradução do aftermovie da Escola Eugenio Montale. Filtros de Reels conferidos: 12 cards (4 campanhas, 2 institucionais, 2 internacionais, 4 APAS); seleção mostra a categoria, atualiza `aria-pressed`, expande resultados filtrados e retorna ao estado inicial em Todos. Auditoria final: as 97 chaves de tradução usadas no HTML têm cobertura em PT e EN; `toggleLang()` alterna `currentLang`, atualiza `document.documentElement.lang` e aplica dicionários gerais e de projetos. Hero title agora tem quebra fixa após a primeira frase em PT e EN (`white-space: pre-line`) e tamanho responsivo reduzido para `clamp(1rem, 2.3vw, 1.65rem)`. Script inline passou `node --check`; validação visual no browser ainda pendente.
- Rodada de regressão (2026-10-29, retomada): corrigido o clique em “Ver mais Reels”, que expandia visualmente sem remover `inert`. Adicionado `tests/expansion.test.cjs`, executável com `node --test tests/expansion.test.cjs`, sem dependências npm. O teste falhou antes da correção e os três cenários passaram depois (projetos, Reels e filtro/retorno a Todos). Sintaxe inline e whitespace passaram. São testes dos handlers com DOM simulado, não substituem teste de teclado em navegador; sem commit/push/deploy nesta rodada.
- Rodada de foco mobile (2026-10-29): botão inferior de play agora preserva o próprio gatilho como destino do foco ao fechar o modal, em vez de retornar ao botão desktop oculto. Teste `tests/mobile-play.test.cjs` reproduziu a falha antes da correção; quatro testes de interação e sintaxe inline passaram depois. `git diff --check` detecta whitespace na linha vazia antes de CAMPANHAS TATTOO, fora desta alteração; preservado. Sem commit/push/deploy.
- Rodada de hover (2026-10-29): corrigida corrida em que um timer de preview agendado antes da abertura do modal criava outro iframe atrás do vídeo ativo. O callback agora revalida `isModalOpen`. `tests/hover-preview.test.cjs` reproduziu a falha; sete testes totais passaram após correção, incluindo hover normal e bloqueio por touch/movimento reduzido. Sintaxe inline passou; validação usa handlers/DOM simulado, sem browser. Sem commit/push/deploy.
- Worktree Kilo revisada seletivamente; nenhuma mudança adicional foi importada porque as diferenças relevantes estão acopladas a grandes alterações de layout e inicialização.
- Para comparar leitura do logo sem substituir o atual, foram criadas `images/logo-header-white-fill.svg` (marca branca preenchida) e `images/logo-header-white-outline.svg` (contorno branco com interior transparente), derivadas do `images/outline.svg`, além da página local `logo-header-compare.html`. XML e referências dos assets validados; preview headless não foi gerado, então abrir a página comparativa no navegador para avaliar a aparência final.
- Verificação local e pública recente: 13 referências locais no `index.html` resolvem; anchors internos apontam para IDs existentes; links externos em nova aba usam `rel="noopener"`; metadados OG/Twitter estão completos com URL absoluta; `https://mercurevideo.vercel.app/`, os dois currículos, `images/profile_photo_2.jpg` e `/_vercel/insights/script.js` respondem 200. Revisão visual detalhada e confirmação de coleta no painel ainda pendentes.
- O site atual é estático: `index.html` concentra CSS, conteúdo e JavaScript; `config.js` guarda IDs e URLs Gumlet. Não há pipeline de build identificado.
- Hospedagem atual: Vercel; Cloudflare Pages fica para teste posterior. Domínio canônico confirmado: `mercurevideo.com.br`; DNS/deploy não foram alterados pela assistência.
- Vercel Web Analytics preparado para as páginas estáticas `index.html`, `curriculo.html` e `resume.html`: cada uma tem exatamente um bootstrap `window.va` e loader `/_vercel/insights/script.js` no `<head>`. Não há `package.json` nem build local; a integração vanilla não depende de `@vercel/analytics`. O PR #1 da Vercel no GitHub repete esses snippets e adiciona uma dependência npm não utilizada: não fazer merge junto com a publicação das alterações locais. Ativar Web Analytics no dashboard, publicar e validar a coleta continuam pendentes. Nenhuma visita foi confirmada.
- Há mudanças do usuário no diretório principal. Preservar todas; não reverter nem substituir arquivos com base numa worktree antiga.
- A pasta `.kilo/worktrees/spring-amazonsaurus` contém uma variante anterior, não um plano. Tem alterações em `config.js`, `index.html`, `teste.html` e `logos/`; revisar diferenças pontualmente. Ela inclui uma função de currículo e outra implementação dos filtros, mas também diferenças substanciais de layout e inicialização. Não copiar arquivos inteiros.
- `src/main.html` é apenas um fragmento de hero e não foi encontrado um processo de build que o use.
- Arquivos `mercure.ai`/`mercur.ai` são binários e estão fora do escopo desta auditoria.

## Backlog priorizado

### P0: preparar e validar o lançamento

1. URL pública identificada: `https://mercurevideo.vercel.app/` responde 200, mas serve versão anterior (sem snippet Analytics, canonical ou caminhos `images/` usados localmente). Currículos, `config.js`, `outline.svg` e `input_file_8.png` antigos respondem 200; os equivalentes em `images/` respondem 404 até publicação das mudanças locais. O endpoint `/_vercel/insights/script.js` responde 200, o que não comprova coleta. Deploys imutáveis registrados pelo GitHub seguem protegidos por Vercel Authentication (401). Deixar `*.pages.dev` para etapa Cloudflare posterior.
2. Caminhos locais de mídia alinhados a `images/` e validados no workspace; confirmar carregamento dos arquivos no deploy da Vercel antes de conectar o domínio.
3. Domínio canônico já definido como `mercurevideo.com.br`; confirmar sua conexão à Vercel e definir redirecionamento de `www` no painel depois da janela DNS.
4. Após a importação da zona, seguir o fluxo exibido pelo Cloudflare para nameservers/DNS, sem remover registros de e-mail ou outros serviços existentes. Validar DNS, SSL/HTTPS, raiz, `www` e URLs de assets. Nenhuma mudança de DNS é automática neste plano.
5. Não colocar vídeos grandes no Pages; manter streaming e embeds no Gumlet. Verificar fallback quando miniatura/player falhar.

Critério de aceite: deploy temporário e domínio final carregam a página, imagens, estilos e navegação sem erros; HTTPS funciona e a variante de domínio não canônica redireciona corretamente.

### P1: corrigir fluxos quebrados e conteúdo

1. Concluído: botão de currículo escolhe `curriculo.html` em português e `resume.html` em inglês.
2. Concluído: filtros de Reels sincronizam visibilidade, expansão, rótulo e `aria-pressed`; os 12 cards foram contados por categoria.
3. Concluído em nível de conteúdo: 97 chaves visíveis têm cobertura PT/EN; corrigidos textos iniciais do hero/Sobre e chave do aftermovie. Revisão visual de ambos os idiomas ainda pendente.
4. Concluído parcialmente: anchors internos resolvem, links externos em nova aba usam `rel="noopener"`, contatos de e-mail/WhatsApp/LinkedIn estão presentes; confirmar os links no navegador publicado.

Critério de aceite: currículo abre no idioma esperado; toggles e filtros funcionam em desktop/mobile e depois de alternar idiomas; contatos testados.

### P2: acessibilidade, usabilidade e desempenho

1. Tornar cada card de vídeo teclado-operável e semântico, com nome acessível derivado do projeto; não depender de `div` com clique.
2. No modal: foco inicial, contenção/devolução de foco, Escape, fechamento por clique no backdrop, rótulos localizados e remoção do iframe ao fechar.
3. Menu móvel: `aria-expanded`, estado sincronizado entre os dois botões, navegação por teclado e fechamento apropriado.
4. Filtros: estado visual e `aria-pressed`/padrão acessível consistente; garantir que itens ocultos não permaneçam focáveis.
5. Respeitar `prefers-reduced-motion` também para marquee, transições e animação de carregamento. Avaliar o loop contínuo de `requestAnimationFrame` e previews Gumlet em dispositivos touch; carregar preview somente quando trouxer benefício.
6. Rever contraste, foco visível, dimensões responsivas, sobreposição da barra inferior, ordem semântica de títulos e comportamento de zoom/tela estreita.

Critério de aceite: fluxo essencial testável por teclado e toque; sem movimento obrigatório para quem pede movimento reduzido; sem erros de layout nos tamanhos de tela-alvo.

### P3: analytics e aprendizado de negócio

Começar com dados agregados de pageview, origem/campanha, dispositivo e performance. Instrumentar apenas eventos com utilidade de negócio:

- `video_open`: identificador/nome do projeto, formato e categoria.
- `contact_click`: canal (WhatsApp, e-mail, LinkedIn); registrar clique, não conversa nem conteúdo digitado.
- `resume_open`: idioma.
- `reel_filter`: categoria escolhida.
- `archive_toggle`: seção e abrir/fechar.
- `section_view`: seção principal observada.
- `scroll_depth`: marcos 25/50/75/90%, no máximo uma vez por visita.
- `engaged_time`: faixas de tempo ativo, sem coletar texto ou comportamento granular desnecessário.
- Opcional: erros de carregamento de mídia e Core Web Vitals.

Regras: não enviar nome, e-mail, telefone, texto livre ou identificadores diretos nos eventos; excluir visitas de desenvolvimento quando viável; limitar retenção; documentar fornecedor, finalidade e dados processados. Não habilitar heatmap/session replay inicialmente. Revisar política de privacidade e necessidade de consentimento conforme a ferramenta/configuração antes de produção.

Critério de aceite: eventos de teste aparecem no painel com propriedades não identificáveis; conversão de contato e visualização de projetos pode ser analisada por origem/campanha.

### P4: polimento contínuo

- Revisar miniaturas, seleção/ordem dos projetos em destaque e consistência entre categorias e acervo completo.
- Revisar SEO compartilhável: título/descrição, canonical e imagem Open Graph absoluta que exista e carregue. O host canônico foi definido como `https://mercurevideo.com.br`; validar se o domínio raiz está conectado à Vercel e substituir a imagem social por uma capa horizontal adequada quando houver asset escolhido.
- Verificar tamanho de imagens e formato, lazy loading sem atrasar conteúdo principal, fontes externas e comportamento quando serviços de terceiros indisponíveis.
- Considerar formulário somente se houver necessidade real; atualmente e-mail/WhatsApp minimizam custo e coleta de dados.

## Sequência recomendada

1. Inspecionar o deploy Vercel quando a URL for compartilhada e validar o domínio canônico depois da liberação de DNS.
2. Testar Cloudflare Pages posteriormente, após a validação na Vercel, conforme orientação do usuário.
3. Comparar seletivamente a worktree Kilo; não aplicar diferenças cosméticas ou blocos grandes sem revisão visual/funcional.
4. Corrigir currículo, filtros, toggle e troca de idioma.
5. Fazer uma rodada de acessibilidade e responsividade.
6. Instalar analytics básico e eventos; validar em painel com tráfego de teste.
7. Rever política de privacidade e lançar divulgação com UTMs.

## Revisão da worktree Kilo

Caminho: `.kilo/worktrees/spring-amazonsaurus` (branch `spring-amazonsaurus`, criada em 2026-07-04; sessão Kilo registrada como `ses_0d13afb6affeO0iUyU3IhvkVkl`). Não há roadmap escrito nela. O diff mostra, entre outras coisas:

- função `openResume()` que escolhe o currículo PT/EN;
- estado visual ativo para filtros e lógica diferente de expansão;
- mudanças de estilo/layout e alterações na inicialização/controle de iframe;
- logos com caminhos absolutos iniciados por `/`, que podem ser inadequados se o deploy usar subpath.

Na retomada, revisar as partes funcionais específicas contra o `index.html` atual e testar antes de aproveitar. A worktree também tem alterações não commitadas; não limpar ou remover sem autorização.

## Checklist para retomar

- [x] URL pública atual validada: `https://mercurevideo.vercel.app/` (200) serve o merge do PR #2, incluindo `images/profile_photo_2.jpg`, novos logos, currículos e loader do Analytics. Domínio próprio `https://mercurevideo.com.br/` confirmado ativo via HTTPS (200) em 2026-10-29; foto, currículos PT/EN e script Analytics também respondem 200. `www` responde 200 após seguir redirecionamentos; destino canônico exato ainda não inspecionado.
- [ ] Depois do teste da Vercel, compartilhar/confirmar URL `pages.dev` para teste comparativo no Cloudflare.
- [ ] No GitHub, fechar o PR #1 sem merge para evitar duplicar os snippets e introduzir `@vercel/analytics` não usado. Não foi fechado pela assistência.
- [x] Branch `mercure-publish-analytics` enviada com commits `a6eacc0`, `1c46105` e `926aac5`; PR #2 mesclado pelo usuário no commit `8d2f2fb`. Vercel marcou o deploy de produção como concluído e a URL pública já serve as mudanças. Somente arquivos públicos foram enviados; vídeos, logs, `recovery-codes.txt` e arquivos de trabalho ficaram fora.
- [ ] Confirmar no painel Vercel que `mercurevideo.com.br` está conectado, habilitar Web Analytics e publicar para validar a coleta em `/_vercel/insights/script.js` e no painel.
- [ ] Verificar `git status` e ler o conteúdo atual dos arquivos antes de qualquer edição; preservar mudanças locais.
- [ ] Revisar mudanças da worktree Kilo pontualmente, sem checkout/cópia total.
- [ ] Executar a etapa 1 do backlog e validar a URL após refresh.

## Auditoria SEO e busca

- Ver `SEO-CHECKLIST.md`: diagnóstico público e próximos passos Search Console/Vercel. `robots.txt` e `sitemap.xml` preparados localmente; XML validado com três URLs. Não publicados. www ainda serve 200 sem redirecionar; loader Analytics presente, coleta não confirmada. Sete testes passaram e dois de responsividade estão explicitamente skipped.

- Fechamento do ciclo local: descrições e canonicals próprios adicionados aos currículos PT/EN, ainda não publicados. Suite final: 11 testes passaram e 2 de responsividade adiados/skipped; XML do sitemap e sintaxe inline dos três HTMLs passaram. Diff dos currículos sem erros de whitespace; whitespace isolado anteriormente encontrado na home continua preservado. Próximas etapas estão em `SEO-CHECKLIST.md`; revisão visual, Search Console e coleta Analytics continuam sem comprovação. Nenhuma mudança externa realizada.

## Pendência responsiva adiada

- Currículos PT/EN ainda usam folha fixa de 210mm em tela; melhoria mobile não implementada após mudança de prioridade para SEO. `tests/resume-layout.test.cjs` está explicitamente skipped como especificação pendente, não como teste aprovado.

## Decisões ainda abertas

- Hospedagem imediata: Vercel; Cloudflare Pages será testado posteriormente.
- Analytics: loader publicado e endpoint respondendo 200; confirmação de visitas no painel Vercel ainda pendente. Resposta HTTP do script não comprova coleta.
- Texto e política de privacidade compatíveis com o fornecedor e a configuração selecionados.
- Quais projetos devem ser os destaques principais do portfólio.
