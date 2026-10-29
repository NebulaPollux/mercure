const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf("        toggleArchiveBtn.addEventListener('click'");
const end = html.indexOf('        // ---- Botão Play da barra inferior ----', start);
assert.ok(start >= 0 && end > start, 'Expansion handlers must exist');

function element() {
    const classes = new Set();
    const listeners = {};
    return {
        inert: true,
        hidden: false,
        style: {},
        dataset: {},
        attributes: {},
        classList: {
            contains: name => classes.has(name),
            toggle(name, force) {
                const enabled = force === undefined ? !classes.has(name) : force;
                if (enabled) classes.add(name); else classes.delete(name);
                return enabled;
            }
        },
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener(name, callback) { listeners[name] = callback; },
        click() { listeners.click(); }
    };
}

function setup() {
    const archiveContainer = element();
    const reelsExpandWrapper = element();
    const toggleArchiveBtn = element();
    const toggleReelsBtn = element();
    const filters = ['all', 'campanhas', 'apas'].map(category => {
        const button = element();
        button.dataset.filter = category;
        return button;
    });
    const cards = ['campanhas', 'apas'].map(category => {
        const card = element();
        card.dataset.category = category;
        return card;
    });
    vm.runInNewContext(html.slice(start, end), {
        archiveContainer, reelsExpandWrapper, toggleArchiveBtn, toggleReelsBtn,
        currentLang: 'pt',
        translations: { pt: { toggle_more: 'Mais', toggle_less: 'Menos', toggle_reels_more: 'Mais Reels', toggle_reels_less: 'Menos Reels' } },
        document: { querySelectorAll: selector => selector === '.filter-btn' ? filters : cards }
    });
    return { archiveContainer, reelsExpandWrapper, toggleArchiveBtn, toggleReelsBtn, filters, cards };
}

for (const [label, container, button] of [
    ['projects', 'archiveContainer', 'toggleArchiveBtn'],
    ['reels', 'reelsExpandWrapper', 'toggleReelsBtn']
]) {
    test(`${label}: expanding enables interaction; collapsing disables it`, () => {
        const state = setup();
        assert.equal(state[container].inert, true);
        state[button].click();
        assert.equal(state[container].classList.contains('expanded'), true);
        assert.equal(state[container].inert, false);
        assert.equal(state[button].attributes['aria-expanded'], 'true');
        state[button].click();
        assert.equal(state[container].inert, true);
        assert.equal(state[button].attributes['aria-expanded'], 'false');
    });
}

test('filtering enables matching reels and All restores collapsed state', () => {
    const state = setup();
    state.filters[1].click();
    assert.equal(state.reelsExpandWrapper.inert, false);
    assert.equal(state.toggleReelsBtn.hidden, true);
    assert.equal(state.cards[0].style.display, '');
    assert.equal(state.cards[1].style.display, 'none');
    assert.equal(state.filters[1].attributes['aria-pressed'], 'true');
    state.filters[0].click();
    assert.equal(state.reelsExpandWrapper.inert, true);
    assert.equal(state.toggleReelsBtn.hidden, false);
    assert.equal(state.toggleReelsBtn.attributes['aria-expanded'], 'false');
    assert.ok(state.cards.every(card => card.style.display === ''));
});
