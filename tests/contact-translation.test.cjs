const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf("document.querySelectorAll('[data-translate-key]').forEach(elem => {");
const end = html.indexOf("document.querySelectorAll('[data-translate-aria-label]')", start);
assert.ok(start >= 0 && end > start, 'Translation loop must exist');

function element(text, children = []) {
    const textNode = { nodeType: 3, textContent: text };
    const label = { textContent: children[0] || '' };
    return {
        childNodes: [textNode],
        children: children.map(() => ({})),
        dataset: {},
        textContent: text,
        querySelector(selector) { return selector === '[data-translate-text]' && children.length ? label : null; },
        getAttribute(name) { return name === 'data-translate-key' ? this.key : null; },
        setAttribute() {},
        key: ''
    };
}

test('language switch translates contact link labels without replacing SVG icons', () => {
    const links = ['contact_whatsapp', 'contact_email', 'contact_linkedin'].map(key => {
        const label = element('', ['']);
        label.key = key;
        label.svgCount = 1;
        return label;
    });
    const labels = {
        pt: { contact_whatsapp: 'WhatsApp', contact_email: 'E-mail', contact_linkedin: 'LinkedIn' },
        en: { contact_whatsapp: 'WhatsApp', contact_email: 'Email', contact_linkedin: 'LinkedIn' }
    };
    vm.runInNewContext(html.slice(start, end), {
        document: { querySelectorAll: selector => selector === '[data-translate-key]' ? links : [] },
        currentLang: 'en',
        translations: labels,
        projectTranslations: { en: {} },
        Node: { TEXT_NODE: 3 },
        Array
    });
    assert.deepEqual(links.map(link => link.querySelector('[data-translate-text]').textContent), ['WhatsApp', 'Email', 'LinkedIn']);
    assert.ok(links.every(link => link.svgCount === 1));
});
