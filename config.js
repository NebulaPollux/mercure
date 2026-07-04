// ============================================================
// CONFIGURAÇÃO CENTRAL DE VÍDEOS E MÍDIAS - MERCURE PORTFOLIO
// ============================================================
const VIDEO_CONFIG = {
  // ID do Workspace no Gumlet (para geração automatizada de capas de cards)
  gumletWorkspaceId: '6a45b78918d11bffd503ee1a',

  // URL direta do vídeo MP4 que roda em loop silencioso no fundo do Hero (Showcase)
  // Deixe em branco: este plano do Gumlet não expõe um .mp4 progressivo, só HLS/DASH (ver abaixo).
  backgroundVideoMp4: '',

  // Stream HLS (.m3u8) do Gumlet usado no fundo do Hero — tocado via hls.js (ou nativo no Safari/iOS)
  backgroundVideoHls: 'https://video.gumlet.io/6a45b78918d11bffd503ee1a/6a45bf80e4e7cc890ee34095/main.m3u8',
  
  // Imagem de poster (placeholder) mostrada enquanto o vídeo de fundo carrega (Capturado no 8º frame)
  backgroundPoster: 'https://video.gumlet.io/6a45b78918d11bffd503ee1a/6a45bf80e4e7cc890ee34095/thumbnail-1-0.png?time=8&width=1920',
  
  // URL de embed do Showreel principal aberto no Lightbox pelo botão "Assistir Reel"
  reelEmbed: 'https://play.gumlet.io/embed/6a45bf80e4e7cc890ee34095?autoplay=true',
  
  // URLs customizadas opcionais para as thumbnails dos cards de Case (Substitui a geração automática se definido)
  caseThumbs: {
    aviacao: '',
    record: '',
    dior: '',
    sameDay: ''
  }
};