const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('mobile brand is in the visible bottom bar, not just the hidden header', () => {
    const bar = html.slice(html.indexOf('<div class="bottom-bar"'), html.indexOf('<!-- ENVELOPADOR'));
    assert.match(bar, /class="bottom-brand-text"[^>]*>MERCURE VÍDEO</);
    assert.match(html, /\.bottom-bar-container\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto auto/);
});

test('video configuration executes before its inline consumers', () => {
    assert.match(html, /<script src="config\.js"><\/script>/);
    assert.ok(html.indexOf('src="config.js"') < html.indexOf('const GUMLET_WORKSPACE_ID'));
});

for (const reduced of [false, true]) {
    test(`hero background respects reduced motion=${reduced}`, () => {
        const start = html.indexOf("                const parallaxVideoContainer = document.getElementById('parallaxVideo');");
        const end = html.indexOf('                // Ativa o Scroll Reveal', start);
        assert.ok(start > 0 && end > start);
        const frames = [];
        const container = { style: {}, appendChild(frame) { frames.push(frame); } };
        vm.runInNewContext(html.slice(start, end), {
            reduceMotion: reduced, videoId: 'example', config: { backgroundPoster: 'poster.png' },
            document: { getElementById: () => container, createElement: () => ({ style: {}, setAttribute() {}, addEventListener() {} }) },
            window: { matchMedia: () => ({ matches: false }) },
            setTimeout() {}, clearTimeout() {}, console
        });
        assert.equal(frames.length, reduced ? 0 : 1);
        if (!reduced) assert.equal(frames[0].style.opacity, '0', 'timeout must observe initial hidden state');
    });
}
