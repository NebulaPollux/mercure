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
  backgroundVideoHls: 'https://video.gumlet.io/6a45b78918d11bffd503ee1a/6a45b9d818d11bffd5041f0a/main.m3u8',
  
  // Imagem de poster (placeholder) do vídeo fixo do hero
  backgroundPoster: 'https://video.gumlet.io/6a45b78918d11bffd503ee1a/6a489a8fe4e7cc890e357e65/thumbnail-1-0.png?time=8&width=1920',
  
  // URL de embed do vídeo de fundo do banner hero
  backgroundEmbed: 'https://play.gumlet.io/embed/6a489a8fe4e7cc890e357e65?autoplay=true&muted=true&loop=true&background=true&preload=true',
  
  // Vídeo fixo usado como fundo do hero
  heroVideoId: '6a489a8fe4e7cc890e357e65',

  // Pool horizontal usado aleatoriamente pelo botão Play
  backgroundVideoPool: [
    "6a471f53e81b019c974c3eed",
    "6a45bf80e4e7cc890ee34095",
    "6a45bef418d11bffd5048073",
    "6a45bbf6e4e7cc890ee300aa",
    "6a45babde81b019c9723eb60",
    "6a45b9d818d11bffd5041f0a",
    "6a45b89018d11bffd50404a1",
    "6a45b92318d11bffd5040e32"
  ],
  
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