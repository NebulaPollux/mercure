# SEO, busca e Analytics — auditoria de 30/10/2026

## Estado verificado em 30/10/2026

- Estado local e publicado: a home contém JSON-LD Person, copy de posicionamento, imagem social raster `images/social-share.png` e nomenclatura Mercure Vídeo.
- A suíte atual cobre 32 testes aprovados; validação visual/browser e previews externos ainda não foram executadas.

- `https://mercurevideo.com.br/` responde 200 e declara canonical sem www. `https://www.mercurevideo.com.br/` responde 308; confirmar o destino exato no painel Vercel caso queira rever o redirect.
- `robots.txt` e `sitemap.xml` respondem 200 no domínio canônico; sitemap lista as três páginas públicas.
- Home, currículos e loader de Analytics respondem 200. Isso não comprova coleta de visitas nem indexação.
- A home contém JSON-LD Person e os textos atuais de perfil. Busca web `site:mercurevideo.com.br` sem resultados não comprova desindexação; consultar cobertura e Inspeção de URL no Search Console.
- A imagem social raster está referenciada pela home; a validação externa de preview no LinkedIn e WhatsApp continua pendente.
- Revisão visual/browser, acessibilidade e impressão ainda precisam de validação dedicada.

## Último loop local

- Currículos PT/EN agora têm layout screen-only até 800px e 480px: folha fluida, habilidades em coluna única, cabeçalhos/datas quebráveis, contatos com quebra de linha e impressão preservada por `@media print`. `tests/resume-layout.test.cjs` deixou de ser skipped; os dois casos passaram.
- `tests/profile-content.test.cjs` agora cobre a chave `about_sesc` PT/EN, além das chaves de perfil existentes. Suíte completa reportou 15 testes aprovados, sem falhas ou skips. Alterações locais não foram publicadas.

## Confirmado no site público

- Home HTTPS retorna 200; título, descrição, idioma pt-BR e canonical estão no HTML inicial.
- HTTP retorna 308 (destino ainda não inspecionado nesta auditoria).
- `www` responde 308; o apex canônico responde 200. Canonical sem www está coerente com o sitemap.
- `robots.txt` e `sitemap.xml` publicados e respondendo 200 no domínio canônico.
- JSON-LD Person está presente na home com informações verificadas; ProfilePage permanece fora do escopo.
- OG/Twitter usam `images/social-share.png`; dimensões e tamanho foram validados localmente. Preview externo ainda pendente.
- Currículos publicados têm descrições e canonicals próprios; conferir nos HTMLs públicos ao mudar metadados.
- Site tem PT/EN por JavaScript na mesma URL: não declarar hreflang para URLs inexistentes. Uma versão inglesa indexável separada seria decisão posterior.

## Prioridade 1 — descoberta e indexação

1. Publicar robots.txt e sitemap.xml junto com os arquivos públicos selecionados (nunca publicar a raiz inteira do repositório).
2. No Google Search Console, criar propriedade de domínio mercurevideo.com.br e verificar com o TXT exato fornecido pelo Google. Não substituir outros TXT/MX.
3. Enviar https://mercurevideo.com.br/sitemap.xml no Search Console após responder 200.
4. Inspecionar a home e solicitar indexação; acompanhar páginas indexadas, erros e consultas. Envio não garante posição nem prazo.
5. Definir www → apex na Vercel; canonical sozinho não é redirecionamento.

## Prioridade 2 — metadados e conteúdo

- [x] Canonical e descrição próprios adicionados localmente aos dois currículos; testes passaram, publicação pendente.
- Adicionar dados estruturados Person/ProfilePage coerentes com o conteúdo visível e LinkedIn existente.
- Revisar imagem social raster e testar compartilhamento; sem geração de arte neste ciclo.
- Melhorar o H1 descritivo ou texto imediatamente próximo com serviços reais (edição de vídeo, motion design, same-day), sem repetição artificial de palavras-chave.
- Avaliar páginas individuais dos principais projetos com contexto e papel desempenhado. São melhoria de conteúdo, não requisito para indexar a home.
- Não adicionar meta keywords: não é prioridade útil de SEO. Não acrescentar tags de rastreamento sem objetivo.

## Analytics — preparado não significa coleta confirmada

- Loader Vercel existe na home e nos currículos e responde 200.
- Ainda falta verificar visitas no painel Web Analytics da Vercel. Abrir o site sem bloqueador, navegar e conferir atualização do painel.
- Vercel Analytics mede tráfego; Search Console mede presença na busca. GA4/GTM não são obrigatórios para começar.
- Eventos úteis futuros: abertura de vídeo, clique em WhatsApp/email e currículo. Definir nomes e disponibilidade do plano antes de instrumentar.
- Nunca enviar email, telefone, mensagem de contato ou outros dados pessoais como propriedades de evento. Rever aviso de privacidade antes de expandir rastreamento.

## Limites desta auditoria

Sem acesso aos painéis Search Console/Vercel; indexação e coleta não confirmadas. Sem teste visual/browser. Nenhum deploy, registro DNS ou configuração externa alterado. A raiz contém arquivos privados e documentos de trabalho: publicar somente a lista selecionada de assets públicos.
