const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('glass collection contains additional projects and all reels, closed initially', () => {
    const start = html.indexOf('<details class="portfolio-collection" id="more-work">');
    const end = html.indexOf('<!-- SEÇÃO 3: SOBRE MIM -->', start);
    const section = html.slice(start, end);
    assert.ok(start > html.indexOf('id="selected-projects"'));
    assert.match(section, /data-translate-key="collection_title"/);
    assert.match(section, /id="more-projects"/);
    assert.match(section, /id="reels"/);
    assert.match(section, /id="toggleReelsBtn"/);
    assert.match(section, /<\/details>\s*$/);
});

test('additional project headers open the shared lightbox without expanding inline', () => {
    assert.equal((html.match(/<details class="project-card-accordion horizontal-card service-filter-item"/g) || []).length, 12);
    assert.doesNotMatch(html, /syncProjectAccordionPlayer|inline-video-lightbox|existingPlayer|showPopover/);
    const summary = {}, wrapper = {};
    const project = {querySelector: selector => selector === 'summary' ? summary : wrapper};
    let prevented = false, opened = -1, focused = false;
    const context = {
        modalTrigger: null, lightboxVideos: [],
        resetLightboxVideos() { context.lightboxVideos = [{wrapper: {}}, {wrapper}]; },
        openPortfolioVideo(index) { opened = index; },
        closeBtn: {focus() { focused = true; }}
    };
    const start = html.indexOf('        function openSelectedProject(');
    const end = html.indexOf("        document.querySelectorAll('.project-card-accordion')", start);
    vm.runInNewContext(html.slice(start, end), context);
    context.openSelectedProject(project, {preventDefault() { prevented = true; }});
    assert.equal(prevented, true);
    assert.equal(opened, 1);
    assert.equal(context.modalTrigger, summary);
    assert.equal(focused, true);
    assert.match(html, /project\.querySelector\('summary'\)\.addEventListener\('click', event => openSelectedProject\(project, event\)\)/);
});
