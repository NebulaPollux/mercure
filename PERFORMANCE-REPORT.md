# Desempenho — 31/10/2026

## Escopo e método

Medição exploratória local via Edge headless/CDP, HTTP em loopback, viewport 390×844, deviceScaleFactor 1, cache do navegador desabilitado e janela de observação de 10 segundos. Sem limitação artificial de CPU/rede; origens externas acessíveis. Não é Lighthouse, dado de campo, teste de produção nem comparação estatística.

Foram observados requests, encodedDataLength dos requests concluídos, eventos de navegação, LCP e layout shifts. Vídeos/pôsteres sorteados, caches externos, conexões e iframes variam entre execuções. Os bytes abaixo são amostras, não o tamanho completo de uma sessão de vídeo.

## Correções comprovadas

| Recurso | Original | Novo WebP | Redução do arquivo |
| --- | ---: | ---: | ---: |
| Foto do perfil | 584.535 bytes, 992×1058 JPG | 22.576 bytes, 600×640 WebP | 96,1% |
| Logo | 79.660 bytes, 2049×2049 PNG | 12.240 bytes, 320×320 WebP lossless com alpha | 84,6% |

- `picture/source` seleciona WebP; os arquivos JPG/PNG originais continuam como fallback de formato e são tentados explicitamente em caso de falha de rede/decode do WebP. Review detectou a necessidade de remover a source antes desse retry; correção validada no Edge com as URLs WebP bloqueadas.
- Foto abaixo da dobra usa `loading="lazy"` e `decoding="async"`; dimensões declaradas nas imagens.
- Logo mantém tamanho CSS e transparência; nenhuma mudança no vídeo de fundo, pool aleatório, fontes ou analytics.
- Não foi feita aprovação visual da compressão por comparação humana. Originais permanecem disponíveis.

## Amostras antes/depois

| Cenário | Antes | Depois |
| --- | ---: | ---: |
| Movimento reduzido, requests | 44 | 43 |
| Movimento reduzido, bytes observados | 1.655.479 | 1.003.941 |
| Movimento reduzido, LCP observado | 420 ms | 400 ms |
| Movimento reduzido, CLS observado | 0,001219 | 0,001219 |
| Movimento normal, requests | 24 | 23 |
| Movimento normal, bytes observados | 1.427.097 | 724.073 |

Na amostra com movimento reduzido, redução de aproximadamente 39,4% dos bytes observados. O ganho determinístico é a redução dos dois arquivos e o adiamento da foto. Não atribuir os 20 ms de diferença de LCP à alteração: uma execução por cenário não permite essa conclusão.

No modo normal, a observação de LCP retornou null; load passou de aproximadamente 1,92 s para 2,53 s com recursos externos variáveis. Não há evidência para afirmar melhora de tempo nesse cenário. O tempo até o vídeo estar reproduzindo não foi medido.

## Verificação

- 44 testes Node aprovados, incluindo retry do WebP para o original.
- Edge confirmou seleção de `profile_photo.webp` e `brand-logo.webp`, dimensões naturais e caixa de perfil de 246 px.
- Checagens de layout em 1440×900, 390×844 e 844×390: sem overflow horizontal e cabeçalhos recolhidos com alturas iguais.
- Navegação do lightbox, botão Play desktop/mobile, teclado, traduções e fallback de frames passaram novamente.

## Próximas medições

- Lighthouse mobile em origem HTTP/deploy comparável, com repetição e condições fixas.
- Core Web Vitals reais após publicação; nenhum score ou coleta de campo foi presumido.
- Tempo até o primeiro vídeo reproduzir, incluindo rede lenta e economia de dados.
- Avaliar logo 5era e recursos de marca ocultos, fontes e miniaturas de fundo somente após medir impacto. Evitar remover conteúdo ou alterar a estética sem evidência.
