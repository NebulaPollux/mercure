const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

function setup() {
    function el() {
        return { children: [], dataset: {}, style: { setProperty() {} }, handlers: {}, attributes: {}, hidden: false, classList: { contains() { return false; } },
            appendChild(child) { if (child.parentElement) child.parentElement.children = child.parentElement.children.filter(item => item !== child); this.children.push(child); child.parentElement = this; },
            prepend(child) { this.appendChild(child); }, before(child) { this.parentElement.appendChild(child); }, after(...children) { this.parentElement.children.push(...children); children.forEach(child => child.parentElement = this.parentElement); },
            setAttribute(key, value) { this.attributes[key] = value; },
            addEventListener(key, handler) { this.handlers[key] = handler; },
            remove() { this.removed = true; }, removeAttribute(key) { delete this.attributes[key]; }, contains() { return false; }
        };
    }
    const projects = Array.from({length: 5}, (_, i) => {
        const project = el(), summary = el(), body = el(), copy = el(), title = { textContent: `Project ${i}` }, wrapper = { dataset: { videoId: `id-${i}` } };
        body.appendChild(copy); project.id = `project-${i}`;
        project.querySelector = selector => ({ summary, '.project-case-copy': copy, '.project-summary-title': title, '.project-accordion-body': body, '.video-wrapper': wrapper }[selector]);
        project.copy = copy; return project;
    });
    const parent = el(), grid = el(); parent.appendChild(grid); grid.querySelectorAll = () => projects;
    const document = { hidden: false, createElement: el, querySelector: () => grid, querySelectorAll: () => [], addEventListener() {} };
    const window = { matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {} };
    const context = { document, window, currentLang: 'pt', location: { hash: '' }, setTimeout: () => 1, clearTimeout() {}, removeProjectAccordionPlayer() {}, isModalOpen: false };
    const start = html.indexOf('        function initFeaturedStage()');
    const end = html.indexOf('        // --- FALLBACK PARA IMAGENS ---', start);
    vm.runInNewContext(html.slice(start, end), context);
    const wrap = grid.parentElement;
    return { projects, grid, context, wrap };
}

test('stage selection moves existing description, plays only selected video and cleans previous player', () => {
    const {projects, context} = setup();
    const stack = projects[0].copy.parentElement;
    const panel = stack.parentElement;
    assert.equal(panel.children[0].textContent, 'Project 0');
    assert.equal(projects[0].dataset.position, 'active');
    projects[1].querySelector('summary').handlers.click({preventDefault() {}});
    assert.equal(projects[1].copy.parentElement, stack);
    assert.equal(projects[0].copy.parentElement, stack);
    assert.equal(projects[0].copy.inert, true);
    const player = projects[1].children.at(-1);
    assert.match(player.src, /id-1\?autoplay=true&muted=false/);
    projects[2].querySelector('summary').handlers.click({preventDefault() {}});
    assert.equal(player.removed, true);
    assert.equal(panel.children[0].textContent, 'Project 2');
    projects[2].classList.contains = () => true;
    context.window.featuredStage.refresh();
    assert.equal(projects[0].dataset.position, 'active');
    assert.equal(projects[2].children.at(-1).removed, true);
});

test('filtering out the active project synchronizes description to the replacement in both languages', () => {
    const {projects, context, wrap} = setup();
    const stack = projects[0].copy.parentElement;
    const panel = stack.parentElement;
    projects[0].classList.contains = className => className === 'service-filter-hidden';
    context.window.featuredStage.refresh();
    assert.equal(projects[1].dataset.position, 'active');
    assert.equal(projects[1].copy.parentElement, stack);
    assert.equal(projects[0].copy.parentElement, stack);
    context.currentLang = 'en';
    projects[1].querySelector('.project-summary-title').textContent = 'English project title';
    context.window.featuredStage.refresh();
    assert.equal(panel.children[0].textContent, 'English project title');
    const controls = wrap.parentElement.children.find(item => item.className === 'featured-controls');
    assert.equal(controls.children[0].textContent, 'Pause rotation');
    assert.equal(controls.children[2].attributes['aria-label'], 'Select: English project title');
});

test('swipe is not undone by the subsequent summary click', () => {
    const {projects, grid} = setup();
    grid.handlers.pointerdown({clientX: 200});
    grid.handlers.pointerup({clientX: 100});
    assert.equal(projects[1].dataset.position, 'active');
    projects[0].querySelector('summary').handlers.click({preventDefault() {}});
    assert.equal(projects[1].dataset.position, 'active');
});

test('navigation and lightweight styling retain the approved structure', () => {
    assert.equal((html.match(/href="#selected-projects" data-translate-key="nav_projects"/g) || []).length, 2);
    assert.doesNotMatch(html, /interpolate-size|::details-content/);
    const about = html.slice(html.indexOf('<section class="about-section'), html.indexOf('<section class="faq-section'));
    assert.doesNotMatch(about, /class="about-name"|class="about-headline"/);
    assert.match(html, /\.featured-copy-stack > \.project-case-copy \{ grid-area: 1 \/ 1;/);
});

test('stage previews fit their container without clipping or horizontal overflow', () => {
    assert.match(html, /\.featured-wrap \{ container-type: inline-size; overflow: visible;/);
    assert.match(html, /--stage-offset: min\(calc\(var\(--stage-width\) \* \.64\), calc\(\(100cqw - var\(--stage-width\) \* \.7\) \/ 2 - 8px\)\)/);
    assert.match(html, /clamp\(-1, var\(--offset, 0\), 1\) \* var\(--stage-offset\)/);
    assert.match(html, /data-video-id="6a45ba33e81b019c9723df2b" data-portrait="true"/);
    assert.match(html, /aspect-ratio: 9 \/ 16/);
    assert.match(html, /project\.dataset\.portraitPlayer = 'true'/);
    assert.match(html, /project\.dataset\.playerActive = 'true'/);
    assert.doesNotMatch(html, /project-frame-(?:reel|strip)|initProjectFrameCrossfades|is-entering|is-exiting/);
    assert.match(html, /data-player-active="true"\] > summary \{ visibility: hidden; \}/);
    assert.match(html, /removeAttribute\('data-player-active'\)/);
    assert.match(html, /wrapper\.dataset\.portrait === 'true'/);
    for (const width of [304, 375, 560, 768, 1136, 1600]) {
        const slide = width <= 560 ? width * .84 : Math.min(width * .7, 860);
        const offset = Math.min(slide * .64, (width - slide * .7) / 2 - 8);
        const rightEdge = width / 2 + offset + slide * .7 / 2;
        assert.ok(rightEdge <= width - 7.99, `preview fits at ${width}px`);
        assert.ok(width / 2 - offset - slide * .7 / 2 >= 7.99);
    }
});

test('stage retains mockup composition and interaction controls without fabricated video telemetry', () => {
    assert.match(html, /scale\(var\(--scale, 1\)\)/);
    assert.match(html, /'pointerup'/);
    assert.match(html, /'ArrowRight'/);
    assert.match(html, /pause\.addEventListener\('click'/);
    assert.match(html, /prefers-reduced-motion: reduce/);
    assert.match(html, /if \(!paused && !hovering && !focused && !document.hidden && !player/);
});
