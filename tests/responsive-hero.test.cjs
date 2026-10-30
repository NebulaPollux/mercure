const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('hero chooses the vertical pool on portrait screens', () => {
    assert.match(html, /const videoId = isPortrait \? chooseFromPool\(config\.backgroundVideoPoolMobile\) : config\.heroVideoId/);
});

test('all reels filter reveals the complete expandable collection', () => {
    const start = html.indexOf("const filterBtns = document.querySelectorAll('.filter-btn');");
    const end = html.indexOf('// ---- Botão Play da barra inferior ----', start);
    const handler = html.slice(start, end);
    assert.match(handler, /reelsExpandWrapper\.classList\.add\('expanded'\)/);
    assert.match(handler, /reelsExpandWrapper\.inert = false/);
    assert.match(handler, /toggleReelsBtn\.hidden = false/);
    assert.match(handler, /toggleReelsBtn\.textContent = translations\[currentLang\]\.toggle_reels_less/);
});
