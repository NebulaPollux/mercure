const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('header contact replaces the standalone LinkedIn action and exposes all channels', () => {
    assert.match(html, /id="contactTrigger"[^>]+aria-controls="contactPanel"[^>]+aria-expanded="false"/);
    assert.doesNotMatch(html, /id="contactTrigger"[^>]+title="Contato"/);
    assert.match(html, /id="contactPanel"[^>]+hidden/);
    assert.equal((html.match(/https:\/\/linkedin\.com\/in\/marcos-soares-santos/g) || []).length, 2);
    assert.match(html, /https:\/\/wa\.me\/5511963033573/);
    assert.match(html, /mailto:marcoscpc@outlook\.com/);
});

test('contact control has keyboard and outside-click dismissal logic', () => {
    assert.match(html, /event\.key === 'Escape' && contactTrigger\.getAttribute\('aria-expanded'\) === 'true'/);
    assert.match(html, /setContactOpen\(false, true\)/);
    assert.match(html, /!event\.target\.closest\('\.contact-control'\)/);
    assert.match(html, /menuOverlay\.classList\.add\('active'\)/);
    assert.match(html, /menuOverlay\.classList\.toggle\('active', isOpen \|\| contactTrigger/);
    assert.match(html, /menuOverlay\.addEventListener\('click'/);
});

test('contact labels exist in both languages', () => {
    for (const key of ['contact_button', 'contact_panel_title', 'contact_whatsapp', 'contact_email', 'contact_linkedin']) {
        assert.equal((html.match(new RegExp('"' + key + '":', 'g')) || []).length, 2, `${key} must exist in PT and EN`);
    }
    assert.match(html, /"contact_panel_title": "Fale sobre seu projeto"/);
    assert.match(html, /"contact_panel_title": "Talk about your project"/);
});

test('contact panel is moved outside the isolated header for page-level backdrop blur', () => {
    assert.match(html, /document\.body\.appendChild\(contactPanel\)/);
    assert.match(html, /\.contact-panel\s*\{[\s\S]*?backdrop-filter:\s*blur\(28px\) saturate\(180%\)/);
    assert.match(html, /\.contact-panel a svg\s*\{[\s\S]*?flex: 0 0 21px/);
    assert.match(html, /data-translate-text/);
    assert.match(html, /\.mobile-contact-links a svg/);
    assert.match(html, /white-space: nowrap/);
    assert.match(html, /min-height: 52px/);
    assert.match(html, /event\.target\.closest\('\.contact-panel'\)/);
    assert.match(html, /window\.addEventListener\('resize',[\s\S]*?positionContactPanel\(\)/);
    assert.match(html, /const headerRect = mainHeader\.getBoundingClientRect\(\)/);
    assert.match(html, /headerRect\.bottom \+ 12/);
    assert.match(html, /\.contact-chevron[\s\S]*?transition: transform 0\.4s/);
    assert.match(html, /\.contact-trigger\[aria-expanded="true"\] \.contact-chevron/);
    assert.doesNotMatch(html, /\.contact-panel::before/);
    assert.match(html, /padding: 1rem 0\.75rem 0\.75rem/);
    assert.match(html, /const right = Math\.max\(16, window\.innerWidth - triggerRect\.right\)/);
    assert.match(html, /header-nav > a\[data-translate-key="nav_about"\][\s\S]*?background: rgba\(255, 255, 255, 0\.08\)/);
});
