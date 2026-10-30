const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const config = fs.readFileSync(path.join(__dirname, '..', 'config.js'), 'utf8');

test('hero uses the selected fixed Gumlet video independently of Play pools', () => {
    assert.match(config, /heroVideoId:\s*'6a489a8fe4e7cc890e357e65'/);
    assert.match(html, /const videoId = isPortrait \? chooseFromPool\(config\.backgroundVideoPoolMobile\) : config\.heroVideoId/);
    assert.match(html, /modalContent\.style\.aspectRatio = "9\/16"/);
    assert.match(html, /modalContent\.style\.aspectRatio = "16\/9"/);
    assert.match(html, /play\.gumlet\.io\/embed\/\$\{videoId\}\?autoplay=true&muted=true&loop=true&background=true/);
});

test('Play picks random horizontal or vertical videos by screen orientation', () => {
    assert.match(html, /const isPortrait = window\.matchMedia\('\(orientation: portrait\)'\)\.matches/);
    assert.match(html, /const playPool = isPortrait \? config\.backgroundVideoPoolMobile : config\.backgroundVideoPool/);
    assert.match(html, /const chooseFromPool = pool => pool\[Math\.floor\(Math\.random\(\) \* pool\.length\)\]/);
    assert.match(html, /const videoIdToOpen = window\.choosePlayVideo \? window\.choosePlayVideo\(\)/);
    assert.match(html, /id="heroShowreelBtn"[^>]+data-translate-key="hero_showreel_cta"/);
    assert.match(html, /heroShowreelBtn\.addEventListener\('click', \(\) => openRandomShowreel\(heroShowreelBtn\)\)/);
});
