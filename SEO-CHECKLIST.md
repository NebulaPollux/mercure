# SEO, busca e Analytics — auditoria de 29/10/2026

## Confirmado no site público

- Home HTTPS retorna 200; título, descrição, idioma pt-BR e canonical estão no HTML inicial.
- HTTP retorna 308 (destino ainda não inspecionado nesta auditoria).
- www retorna 200 mantendo www: configurar redirecionamento permanente para https://mercurevideo.com.br/ no painel Vercel, preservando caminhos.
- robots.txt e sitemap.xml retornam 404. Arquivos agora preparados localmente; ainda precisam de publicação.
- Não há JSON-LD na home. Adicionar Person/ProfilePage apenas com informações verificadas; não inventar avaliações/endereço.
- OG/Twitter usam images/icon.svg: preferir PNG/JPEG existente apropriado ou exportação fornecida pelo usuário. Não foi criada imagem.
- Currículos têm títulos distintos, mas faltam descrição e canonical próprios.
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
