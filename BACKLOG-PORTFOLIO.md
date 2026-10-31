# Backlog do portfólio Mercure

Atualizado em 2026-10-31 após a implementação da primeira frente do plano UX.

## Estado atual

- Onda autônoma desta rodada publicada: JSON-LD Person, imagem social raster 1200x630, rótulo factual para o botão de trabalhos, copy de posicionamento, métricas sem contexto removidas, faixa de marcas neutralizada e destaques de projetos com papel e contexto em PT/EN.
- Lighthouse não executado. Edge headless localizado e usado para verificar o novo lightbox em 1440×900, 390×844 e 844×390; reprodução remota Gumlet não foi validada nesse teste.
- Produção publicada em `https://mercurevideo.com.br/`.
- Vercel Analytics, Google Search Console e redirect do domínio já configurados pelo proprietário.
- Hero horizontal fixo e hero portrait com vídeo vertical aleatório.
- Botão Play escolhe vídeos horizontais ou verticais conforme a orientação atual.
- Contato desktop/mobile com WhatsApp, e-mail, LinkedIn, SVGs, tradução PT/EN e painel responsivo.
- Modal vertical usa proporção 9:16; modal horizontal usa 16:9.
- Suíte local atual: 41 testes aprovados; inclui navegação do lightbox, cinco cases selecionados, 28 IDs Gumlet únicos e somente Perfil profissional aberto por padrão.
- Plano UX implementado localmente: navegação global do lightbox, nome no hero, três frames por cabeçalho e oito perguntas frequentes PT/EN. Cabeçalhos recolhidos com altura igual, incluindo APAS. Ainda não publicado; evidências e limites em `PORTFOLIO-UX-PLAN.md`.
- Projetos selecionados: Think Plastic Brazil — Summit 2025, O Imponderável, TRANSPETRO — Jd. Hollywood, Hackathon CAIXA e APAS Show 2024, com contexto, papel e ferramentas em PT/EN quando confirmados.
- Não há revisão visual pendente neste backlog: a versão publicada foi aprovada visualmente.

## Onda 1: maior retorno e baixo risco

### 1. Imagem social raster

**Status:** publicado na home. **Prioridade:** P0

`og:image` e `twitter:image` usam `images/social-share.png` (1200x630, 40 KB) com dimensões e alt. Ainda falta validar previews no LinkedIn Post Inspector e WhatsApp.

Critérios de aceite:

- imagem pública carregando em HTTPS;
- `og:image:width` e `og:image:height` presentes;
- alt coerente;
- preview conferido no LinkedIn e WhatsApp.

### 2. Posicionamento no topo

**Status:** copy aprovada publicada. **Prioridade:** P0

Adicionar perto do nome uma frase objetiva, por exemplo:

> Editor de vídeo sênior e motion designer em São Paulo: broadcast, campanhas e same-day.

Padronizar o uso de:

- nome pessoal: Marcos Soares Santos;
- marca: Mercure Vídeo;
- cargo: Editor de vídeo sênior · Motion graphics · Estrategista de conteúdo.

### 3. Controle Play de trabalhos

**Status:** publicado com rótulo factual em PT/EN e conectado ao fluxo aleatório do Play. **Prioridade:** P0

O controle circular do header abre um trabalho selecionado aleatoriamente conforme a orientação da tela. Um showreel curado permanece fora do escopo até existir um ID Gumlet dedicado.

### 4. Contexto dos números

**Status:** métricas `1.5M+` e `+46%` removidas por falta de contexto verificável. **Prioridade:** P0

Confirmar ou remover:

- `+46% Ticket médio em 6 meses`;
- `1.5M+ Inscritos em canais atendidos`.

Cada número mantido precisa identificar período, contexto e origem. Sem comprovação, remover é preferível a manter uma afirmação ambígua.

### 5. Copy da faixa de marcas

**Status:** chamada neutralizada para `Trabalhos entregues para` e publicada. **Prioridade:** P1

Reavaliar `Marcas que já confiaram na entrega`. Quando não houver endosso direto, usar uma formulação factual, como `Trabalhos entregues para` ou `Projetos realizados para`.

Registrar para cada marca se o trabalho foi direto, via agência ou sob NDA.

## Onda 2: prova de trabalho e conversão

### 6. Bloco de créditos por projeto

**Status:** cinco cases publicados na home com contexto, papel e ferramentas confirmadas em PT/EN: Think Plastic Brazil — Summit 2025, O Imponderável, TRANSPETRO — Jd. Hollywood, Hackathon CAIXA e APAS Show 2024. Créditos de agência, autorização e resultados continuam pendentes quando não há confirmação pública. **Prioridade:** P1

Próximos complementos possíveis, somente com dados autorizados:

- cliente ou agência;
- créditos adicionais;
- resultados verificáveis;
- páginas próprias para cases.

### 7. Organização por serviço

**Prioridade:** P1 · **Dependência:** seleção de projetos

Criar uma navegação ou filtros mais claros para:

- broadcast e corporativo;
- social e performance;
- same-day;
- motion/VFX.

Manter a curadoria atual e evitar transformar a home em um catálogo indiscriminado.

### 8. Organização Same-day

**Status:** incorporada aos Projetos Selecionados e aos filtros de Reels. **Prioridade:** P1

TRANSPETRO — Jd. Hollywood, Hackathon CAIXA e APAS Show aparecem com contexto same-day na home. HTI, TattooWeek e demais peças continuam no acervo/filtros até receberem contexto equivalente confirmado.

### 9. Cases com URLs próprias

**Status:** não iniciado; os cinco cases atuais vivem na home em acordeões. **Prioridade:** P1 · **Dependência:** autorização e materiais

Publicar de 3 a 4 cases com briefing, papel, decisões de montagem, resultado e vídeo final quando houver autorização e material suficiente.

Candidatos:

- CNP Assurances;
- Hackathon CAIXA Consórcio;
- same-day TRANSPETRO;
- O Imponderável.

Não publicar material protegido ou sob NDA sem autorização.

### 10. Processo e FAQ

**Prioridade:** P2 · **Dependência:** definição comercial

Criar uma página curta ou seção com:

- briefing;
- roteiro e referências;
- montagem;
- motion e finalização;
- rodadas de revisão;
- formatos de entrega;
- funcionamento do same-day;
- FAQ de software, prazos, orçamento e processo.

### 11. Contato com contexto

**Prioridade:** P2 · **Dependência:** aprovação de copy

Avaliar link WhatsApp com mensagem pré-preenchida e um sinal factual de disponibilidade. Não coletar nem enviar dados pessoais em analytics.

## Onda 3: SEO e internacionalização

### 12. Dados estruturados Person

**Prioridade:** P1 · **Dependência:** dados finais do perfil

Adicionar JSON-LD `Person` com nome, cargo, URL, foto real e `sameAs` do LinkedIn atual:

`https://linkedin.com/in/marcos-soares-santos`

Não inventar avaliações, endereço ou relações comerciais.

### 13. Versão EN indexável

**Prioridade:** P2 · **Dependência:** decisão de mercado

Se o público internacional justificar o custo, criar `/en/` estático com `hreflang` bidirecional, `x-default`, canonical próprio e inclusão no sitemap. O toggle JavaScript atual não substitui uma URL indexável.

### 14. Higiene de títulos e conteúdo

**Prioridade:** P2 · **Dependência:** revisão editorial

- corrigir hierarquia de headings;
- padronizar `Same-day`, `Same Day` e `Same-Day`;
- corrigir acentuação de `Cerimônia`;
- encurtar título da aba se necessário;
- revisar textos que misturam marca e nome pessoal.

## Onda 4: desempenho e medição

### 15. Medição de performance

**Status:** pendente. Ambiente atual não possui Lighthouse, Playwright, Puppeteer ou navegador CLI; nenhuma métrica foi inventada. **Prioridade:** P2

Rodar Lighthouse mobile e registrar LCP, peso total e tempo até o primeiro vídeo antes de otimizar.

Pontos candidatos:

- poster/foto em WebP ou AVIF;
- logo raster grande convertido ou substituído;
- fontes externas;
- vídeo de fundo em conexão lenta ou economia de dados;
- poster em vez de vídeo de fundo no mobile, se os dados justificarem.

### 16. Pausa global de movimento

**Prioridade:** P2 · **Dependência:** decisão de UX

Adicionar controle para pausar o marquee e o vídeo de fundo, além do suporte já existente a `prefers-reduced-motion`.

### 17. Eventos de analytics

**Prioridade:** P2 · **Dependência:** disponibilidade do plano e nomenclatura

Instrumentar somente eventos agregados:

- `video_open`;
- `contact_click`;
- `resume_open`;
- `reel_filter`;
- `archive_toggle`.

Não enviar nome, e-mail, telefone, mensagem ou texto livre.

## Verificações externas já resolvidas

- Vercel Analytics: configurado.
- Google Search Console: configurado.
- Redirect do domínio: ajustado.
- Produção: publicada e confirmada via HTTP 200.
- Revisão visual da versão atual: aprovada pelo proprietário.

## Decisões necessárias para continuar

1. Público prioritário: agência/produtora, cliente direto ou TV.
2. Projetos autorizados para virar cases públicos.
3. Autorização para logos e indicação de trabalhos via agência/NDA.
4. Dados reais de `+46%` e `1.5M+`.
5. Necessidade de versão EN em URL própria.
6. Copy final do topo e do CTA do showreel.
