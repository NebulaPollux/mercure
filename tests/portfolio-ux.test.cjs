const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('hero presents role and location without the removed identity line', () => {
    const hero = html.slice(html.indexOf('<div class="hero-content"'), html.indexOf('<!-- HEADER COM'));
    assert.doesNotMatch(hero, /class="hero-identity"/);
    assert.match(hero, /Editor de vídeo sênior e motion designer em São Paulo/);
});

test('eight closed bilingual questions follow About and precede the final CTA', () => {
    const start = html.indexOf('<section class="faq-section');
    const end = html.indexOf('</section>', start);
    const faq = html.slice(start, end);
    assert.ok(start > html.indexOf('id="about"'));
    assert.ok(end < html.indexOf('<!-- FOOTER -->'));
    assert.equal((faq.match(/<details class="about-accordion faq-item">/g) || []).length, 8);
    assert.doesNotMatch(faq, /<details[^>]+\bopen\b/);
    const dictStart = html.indexOf('        const translations = {');
    const dictEnd = html.indexOf('        const projectTranslations', dictStart);
    const context = {};
    vm.runInNewContext(html.slice(dictStart, dictEnd) + ';globalThis.dict = translations;', context);
    for (const match of faq.matchAll(/data-translate-key="([^"]+)"/g)) {
        for (const lang of ['pt', 'en']) assert.ok(context.dict[lang][match[1]], `${lang}: ${match[1]}`);
    }
});

const featuredStart = html.indexOf('<div class="project-accordion-list project-accordion-grid">');
const featuredEnd = html.indexOf('<details class="portfolio-collection"', featuredStart);
assert.ok(featuredStart >= 0 && featuredEnd > featuredStart, 'featured accordion grid must exist');
const featured = html.slice(featuredStart, featuredEnd);

test('featured headers retain exactly five existing accordions and video wrappers in editorial order', () => {
    const projects = [...featured.matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/g)].map(([markup]) => ({
        key: markup.match(/<summary data-translate-key="([^"]+)"/)[1],
        videoId: markup.match(/class="video-wrapper" data-video-id="([^"]+)"/)[1],
        services: markup.match(/data-services="([^"]+)"/)[1]
    }));
    assert.deepEqual(projects, [
        { key: 'selected_think_title', videoId: '6a45bf80e4e7cc890ee34095', services: 'broadcast-corporativo motion-vfx' },
        { key: 'selected_caixa_title', videoId: '6ae508c834bee2c4e82840c1', services: 'broadcast-corporativo same-day' },
        { key: 'selected_apas_title', videoId: '6a45ba33e81b019c9723df2b', services: 'broadcast-corporativo same-day social-performance' },
        { key: 'selected_transpetro_title', videoId: '6a45bb7f18d11bffd504439a', services: 'broadcast-corporativo same-day' },
        { key: 'selected_imponderavel_title', videoId: '6a471f53e81b019c974c3eed', services: 'broadcast-corporativo' }
    ]);
    for (const className of ['project-accordion-list project-accordion-grid', 'project-accordion-body', 'video-wrapper', 'project-summary-title']) {
        assert.equal((featured.match(new RegExp('class="' + className + '"', 'g')) || []).length, className.includes('project-accordion-list') ? 1 : 5);
    }
    assert.equal((html.match(/<details class="project-accordion service-filter-item"/g) || []).length, 5);
    assert.equal((featured.match(/<summary\b/g) || []).length, 5);
    assert.doesNotMatch(featured, /<iframe\b|<video\b|class="project-frame-strip"/);
    assert.equal((featured.match(/<span class="project-summary-title" data-translate-text>/g) || []).length, 5);
});

test('project cards use one static high-resolution thumbnail and masked lower vignette', () => {
    assert.doesNotMatch(html, /project-frame-(?:reel|strip)/);
    assert.doesNotMatch(html, /projectCardFrameFade|projectCardFramePan|initProjectFrameCrossfades/);
    assert.match(html, /thumbnail-1-0\.png\?time=8&width=\$\{/);
    assert.match(html, /#more-projects \.project-card-accordion > summary::after \{ display: none; \}/);
    assert.match(html, /#more-projects \.project-card-accordion > summary \.card-caption \{ position: absolute; inset: auto 0 0; z-index: 3/);
    assert.match(html, /#more-projects \.project-card-accordion > summary \.card-caption[\s\S]*?backdrop-filter: blur\(10px\)/);
    assert.match(html, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(html, /time=8&width=\$\{project\.classList/);
    assert.match(html, /#more-projects \.project-card-accordion > summary \{[\s\S]*?aspect-ratio: 1 \/ 1;/);
    assert.match(html, /#more-projects \.project-card-accordion > summary::before[\s\S]*?background: var\(--project-thumb/);
    assert.match(html, /#more-projects \.project-card-accordion > summary::after[\s\S]*?z-index: 2/);
    assert.match(html, /#more-projects \.project-card-accordion > summary \.card-caption \{ position: relative; z-index: 3/);
    assert.match(html, /#reelsGrid \.vertical-card \{[\s\S]*?aspect-ratio: 9 \/ 16;/);
    assert.match(html, /#reelsGrid \.vertical-card \.video-wrapper::after \{ display: none; \}/);
    assert.match(html, /#reelsGrid \.vertical-card \.card-caption[\s\S]*?backdrop-filter: blur\(10px\)/);
    assert.match(html, /@media \(prefers-reduced-motion: reduce\)/);
});

test('the twelve selected horizontal videos retain captions, services, order, and IDs in accordions', () => {
    const sectionStart = html.indexOf('<h3 class="section-title" data-translate-key="other_projects"');
    const sectionEnd = html.indexOf('<!-- Botão Ver Mais -->', sectionStart);
    const section = html.slice(sectionStart, sectionEnd);
    const projects = [...section.matchAll(/<details class="project-card-accordion horizontal-card service-filter-item"([^>]*)>([\s\S]*?)<\/details>/g)];
    assert.equal(projects.length, 12);
    assert.equal((section.match(/<div class="project-accordion-body"/g) || []).length, 0);
    assert.doesNotMatch(section, /project-frame-(?:reel|strip)/);
    for (const [, attrs, body] of projects) {
        assert.match(attrs, /data-services="[^"]*"/);
        assert.equal((body.match(/<summary\b/g) || []).length, 1);
        assert.equal((body.match(/class="card-caption"/g) || []).length, 1);
        assert.equal((body.match(/<h3 data-translate-key=/g) || []).length, 1);
        assert.equal((body.match(/<p data-translate-key=/g) || []).length, 1);
        assert.equal((body.match(/class="video-wrapper" data-video-id="[^"]+"/g) || []).length, 1);
        assert.match(body, /class="project-card-accordion-body"/);
    }
    assert.match(section, /id="archiveContainer" inert/);
    assert.match(html, /id="toggleArchiveBtn"/);
});

function setupFrames() {
    function element() {
        return { children: [], style: { setProperty() {} }, handlers: {}, dataset: {},
            setAttribute(name, value) { this[name] = value; },
            addEventListener(name, handler) { this.handlers[name] = handler; },
            appendChild(child) { this.children.push(child); }
        };
    }
    const keys = ['think', 'caixa', 'apas', 'transpetro', 'imponderavel'];
    const summaries = keys.map(key => {
        const summary = element();
        summary.dataset.translateKey = `selected_${key}_title`;
        summary.querySelector = () => null;
        return summary;
    });
    const cards = [...html.matchAll(/<details class="project-card-accordion[^>]*>([\s\S]*?)<\/details>/g)].map(([, markup]) => ({
        key: markup.match(/<h3 data-translate-key="([^"]+)"/)[1],
        videoId: markup.match(/data-video-id="([^"]+)"/)[1]
    }));
    assert.equal(cards.length, 12);
    const cardSummaries = cards.map(({ key }) => {
        const summary = element();
        summary.querySelector = selector => selector === '[data-translate-key]'
            ? { dataset: { translateKey: key } }
            : null;
        return summary;
    });
    const videoIds = [...summaries.map((_, index) => `id-${index}`), ...cards.map(card => card.videoId)];
    const projects = [...summaries, ...cardSummaries].map((summary, index) => ({
        classList: { contains: name => index >= 5 && name === 'project-card-accordion' },
        querySelector: selector => selector === 'summary' ? summary : { dataset: { videoId: videoIds[index] } }
    }));
    const context = { GUMLET_WORKSPACE_ID: 'workspace', document: {
        querySelectorAll: selector => selector === '.project-accordion, .project-card-accordion, #reelsGrid .vertical-card' ? projects : [], createElement: element
    } };
    const start = html.indexOf('        function initProjectFrames()');
    const end = html.indexOf('        function equalizeClosedProjectHeaders()', start);
    assert.ok(start > 0 && end > start);
    vm.runInNewContext(html.slice(start, end), context);
    return { summaries: [...summaries, ...cardSummaries], videoIds, context };
}

test('project cards keep one static high-resolution thumbnail', () => {
    assert.doesNotMatch(html, /projectCardFrameFade|projectCardFramePan|initProjectFrameCrossfades|project-frame-(?:reel|strip)/);
    assert.match(html, /thumbnail-1-0\.png\?time=8&width=\$\{/);
    assert.match(html, /#reelsGrid \.vertical-card \.video-wrapper::after \{ display: none; \}/);
    assert.match(html, /#reelsGrid \.vertical-card \.card-caption[\s\S]*?backdrop-filter: blur\(10px\)/);
});

test('only closed headers share the tallest natural height and recalculate after resize', () => {
    const style = { value: null, removeProperty() { this.value = null; }, setProperty(key, value) { this.value = value; } };
    let heights = [110, 128, 110, 110, 94];
    const grid = { style, closest() { return null; }, querySelectorAll(selector) {
        assert.equal(selector, '.project-accordion:not([open]) > summary');
        assert.equal(style.value, null, 'clear previous minimum before measuring');
        return heights.map(height => ({ getBoundingClientRect: () => ({ height }) }));
    } };
    const context = { document: { querySelector: () => grid } };
    const start = html.indexOf('        function equalizeClosedProjectHeaders()');
    const end = html.indexOf('        equalizeClosedProjectHeaders();', start);
    vm.runInNewContext(html.slice(start, end), context);
    context.equalizeClosedProjectHeaders();
    assert.equal(style.value, '128px');
    heights = [94, 94, 94, 94, 94];
    context.equalizeClosedProjectHeaders();
    assert.equal(style.value, '94px');
    assert.match(html, /\.project-accordion:not\(\[open\]\) summary \{ min-height: var\(--project-closed-height, 0px\); \}/);
});
