const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('        // --- NAVEGAÇÃO DO LIGHTBOX ---');
const end = html.indexOf('        let glassEggBuffer', start);
assert.ok(start > 0 && end > start);

function setup() {
    const document = { activeElement: null };
    function element() {
        return { style: {}, handlers: {}, hidden: false, disabled: false, isConnected: true,
            setAttribute(name, value) { this[name] = value; },
            addEventListener(name, handler) { this.handlers[name] = handler; },
            focus() { document.activeElement = this; }
        };
    }
    const modal = element();
    const closeBtn = element();
    const lightboxPrev = element();
    const lightboxNext = element();
    const headerPlayBtn = element();
    const title = element();
    const stage = element();
    let player = null;
    const modalContent = element();
    modalContent.appendChild = child => { player = child; };
    Object.defineProperty(modalContent, 'innerHTML', { set() { player = null; } });
    const wrappers = ['First', 'Middle', 'Last'].map((name, index) => ({
        ...element(),
        getAttribute: () => `video-${index}`,
        closest(selector) {
            if (selector === '.reels-grid') return index === 2 ? {} : null;
            if (selector === '.project-accordion') return { querySelector: () => ({ textContent: name }) };
            return null;
        }
    }));
    const elements = { modalTitle: title, lightboxStage: stage, headerPlayBtn };
    document.getElementById = id => id === 'activeGumletPlayer' ? player : elements[id];
    document.querySelectorAll = () => [];
    document.createElement = () => ({ ...element(), remove() { player = null; } });
    const context = { document, wrappers, modal, modalContent, closeBtn, lightboxPrev, lightboxNext,
        backgroundRegions: [{}], currentLang: 'pt', isModalOpen: false, modalTrigger: null,
        activeVideoIndex: -1, activeVideoWrapper: null, lightboxVideos: [],
        GUMLET_PLAYER_ORIGIN: 'https://play.gumlet.io',
        translations: { pt: { modal_title: 'Vídeo em destaque', modal_player_title: 'Player' } },
        window: { matchMedia: () => ({ matches: false }), choosePlayVideo: () => 'video-1' }
    };
    vm.createContext(context);
    vm.runInContext(html.slice(start, end), context);
    context.resetLightboxVideos();
    return { context, document, wrappers, modal, modalContent, closeBtn, lightboxPrev, lightboxNext,
        headerPlayBtn, title, stage, player: () => player };
}

test('navigation replaces the player and title, preserves trigger, and stops at both ends', () => {
    const s = setup();
    s.context.modalTrigger = s.wrappers[0];
    s.context.openPortfolioVideo(0);
    const first = s.player();
    assert.equal(s.title.textContent, 'First');
    assert.equal(s.lightboxPrev.disabled, true);
    assert.equal(s.lightboxNext.disabled, false);
    s.lightboxNext.handlers.click();
    assert.notEqual(s.player(), first);
    assert.match(s.player().src, /video-1\?/);
    assert.equal(s.title.textContent, 'Middle');
    assert.equal(s.context.modalTrigger, s.wrappers[0]);
    s.lightboxNext.focus();
    s.lightboxNext.handlers.click();
    assert.equal(s.title.textContent, 'Last');
    assert.equal(s.modalContent.style.aspectRatio, '9/16');
    assert.equal(s.lightboxNext.disabled, true);
    assert.equal(s.document.activeElement, s.lightboxPrev);
    s.context.navigateLightbox(1);
    assert.equal(s.title.textContent, 'Last');
    s.context.navigateLightbox(-1);
    s.context.navigateLightbox(-1);
    s.context.navigateLightbox(-1);
    assert.equal(s.title.textContent, 'First');
    s.context.closeVideoModal();
    assert.equal(s.document.activeElement, s.wrappers[0]);
    assert.equal(s.player(), null);
    assert.equal(s.context.backgroundRegions[0].inert, false);
});

test('random header Play joins the global sequence at the selected video', () => {
    const s = setup();
    s.context.openRandomShowreel(s.headerPlayBtn);
    assert.equal(s.title.textContent, 'Middle');
    assert.equal(s.lightboxPrev.disabled, false);
    assert.equal(s.lightboxNext.disabled, false);
    s.lightboxPrev.handlers.click();
    assert.equal(s.title.textContent, 'First');
    assert.equal(s.context.modalTrigger, s.headerPlayBtn);
    s.context.closeVideoModal();
    assert.equal(s.document.activeElement, s.headerPlayBtn);
});

test('a random video without a card is retained with fallback title and working next', () => {
    const s = setup();
    s.context.window.choosePlayVideo = () => 'extra-video';
    s.context.window.matchMedia = () => ({ matches: true });
    s.context.openRandomShowreel(s.headerPlayBtn);
    assert.match(s.player().src, /extra-video/);
    assert.equal(s.title.textContent, 'Vídeo em destaque');
    assert.equal(s.modalContent.style.aspectRatio, '9/16');
    s.lightboxNext.handlers.click();
    assert.equal(s.title.textContent, 'First');
    s.lightboxPrev.handlers.click();
    assert.match(s.player().src, /extra-video/);
});

test('title sits visibly above player and controls have PT/EN names', () => {
    assert.match(html, /<h2 id="modalTitle" class="lightbox-title" aria-live="polite">/);
    assert.match(html, /\.lightbox-title\s*\{[^}]*text-align: left/);
    for (const key of ['previous_video', 'next_video']) {
        assert.equal((html.match(new RegExp('"' + key + '":', 'g')) || []).length, 2);
    }
    assert.match(html, /navigateLightbox\(e.key === 'ArrowLeft' \? -1 : 1\)/);
    assert.match(html, /\[closeBtn, lightboxPrev, lightboxNext, player\]/);
});
