const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('hero identifies the editor alongside existing role and location', () => {
    const hero = html.slice(html.indexOf('<div class="hero-content"'), html.indexOf('<!-- HEADER COM'));
    assert.match(hero, /Marcos Soares Santos · Mercure Vídeo/);
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

function setupFrames() {
    function element() {
        return { children: [], style: {}, handlers: {}, dataset: {},
            setAttribute(name, value) { this[name] = value; },
            addEventListener(name, handler) { this.handlers[name] = handler; },
            appendChild(child) { this.children.push(child); }
        };
    }
    const keys = ['think', 'imponderavel', 'transpetro', 'caixa', 'apas'];
    const summaries = keys.map(key => {
        const summary = element();
        summary.dataset.translateKey = `selected_${key}_title`;
        summary.querySelector = () => summary.children.find(child => child.className === 'project-frame-strip');
        return summary;
    });
    const projects = summaries.map((summary, index) => ({
        querySelector: selector => selector === 'summary' ? summary : { dataset: { videoId: `id-${index}` } }
    }));
    const context = { GUMLET_WORKSPACE_ID: 'workspace', document: {
        querySelectorAll: () => projects, createElement: element
    } };
    const start = html.indexOf('        function initProjectFrames()');
    const end = html.indexOf('        function equalizeClosedProjectHeaders()', start);
    assert.ok(start > 0 && end > start);
    vm.runInNewContext(html.slice(start, end), context);
    return { summaries, context };
}

test('five decorative strips use existing video IDs and three requested frame times', () => {
    const { summaries, context } = setupFrames();
    summaries.forEach((summary, index) => {
        const strip = summary.children[0];
        assert.equal(strip['aria-hidden'], 'true');
        assert.equal(strip.children.length, 3);
        assert.equal(new Set(strip.children.map(frame => frame.src)).size, 3);
        strip.children.forEach(frame => {
            assert.match(frame.src, new RegExp('/id-' + index + '/'));
            assert.equal(frame.alt, '');
            assert.equal(frame.loading, 'lazy');
        });
    });
    context.initProjectFrames();
    summaries.forEach(summary => assert.equal(summary.children.length, 1));
});

test('unavailable frames collapse without breaking the accordion trigger', () => {
    const { summaries } = setupFrames();
    const strip = summaries[0].children[0];
    strip.children[0].handlers.error();
    assert.equal(strip.children[0].hidden, true);
    assert.notEqual(strip.style.display, 'none');
    strip.children.slice(1).forEach(frame => frame.handlers.error());
    assert.equal(strip.style.display, 'none');
    assert.match(html, /if \(img\.closest\('\.project-frame-strip'\)\) return;/);
    assert.match(html, /\.project-accordion\[open\] \.project-frame-strip \{ display: none; \}/);
});

test('only closed headers share the tallest natural height and recalculate after resize', () => {
    const style = { value: null, removeProperty() { this.value = null; }, setProperty(key, value) { this.value = value; } };
    let heights = [110, 128, 110, 110, 94];
    const grid = { style, querySelectorAll(selector) {
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
