const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('            let hoverTimeout;');
const end = html.indexOf("            wrapper.addEventListener('mouseleave'", start);
assert.ok(start >= 0 && end > start);

function setup({ allowed = true, open = false } = {}) {
    let enter;
    let timer;
    const players = [];
    const wrapper = {
        classList: { add() {}, remove() {} },
        querySelector: () => players[0],
        addEventListener(name, callback) { if (name === 'mouseenter') enter = callback; },
        appendChild(player) { players.push(player); }
    };
    const context = {
        wrapper, canHoverPreview: allowed, isModalOpen: open, videoId: 'test-video',
        setTimeout(callback) { timer = callback; },
        document: {
            querySelectorAll: () => [],
            createElement: () => ({ style: {}, setAttribute() {}, addEventListener() {} })
        }
    };
    vm.runInNewContext(html.slice(start, end), context);
    return { context, players, enter: () => enter(), fire: () => timer?.() };
}

test('pending hover must not load a player after the modal opens', () => {
    const state = setup();
    state.enter();
    state.context.isModalOpen = true;
    state.fire();
    assert.equal(state.players.length, 0);
});

test('ordinary hover loads a single preview', () => {
    const state = setup();
    state.enter();
    state.fire();
    state.enter();
    state.fire();
    assert.equal(state.players.length, 1);
});

test('touch/reduced-motion or an already-open modal skips previews', () => {
    for (const settings of [{ allowed: false }, { open: true }]) {
        const state = setup(settings);
        state.enter();
        state.fire();
        assert.equal(state.players.length, 0);
    }
});
