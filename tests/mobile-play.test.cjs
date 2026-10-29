const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('        // ---- Botão Play da barra inferior ----');
const end = html.indexOf('        if (hamburgerMobile)', start);
assert.ok(start >= 0 && end > start);

test('mobile play retains the visible mobile button as modal focus-return target', () => {
    let click;
    const mobile = { addEventListener(name, handler) { if (name === 'click') click = handler; } };
    const desktop = {};
    const context = {
        playBtnMobile: mobile,
        modalTrigger: null,
        document: { getElementById: () => desktop }
    };
    desktop.click = () => { context.modalTrigger = desktop; };
    vm.runInNewContext(html.slice(start, end), context);
    click({ currentTarget: mobile });
    assert.equal(context.modalTrigger, mobile);
});
