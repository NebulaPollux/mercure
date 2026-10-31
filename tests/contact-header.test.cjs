const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('header contact replaces the standalone LinkedIn action and exposes all channels', () => {
    assert.match(html, /id="contactTrigger"[^>]+aria-controls="contactPanel"[^>]+aria-expanded="false"/);
    assert.doesNotMatch(html, /id="contactTrigger"[^>]+title="Contato"/);
    assert.match(html, /id="contactPanel"[^>]+hidden/);
    const visibleHtml = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
    assert.equal((visibleHtml.match(/href="https:\/\/linkedin\.com\/in\/marcos-soares-santos"/g) || []).length, 2);
    assert.match(html, /"sameAs": \["https:\/\/linkedin\.com\/in\/marcos-soares-santos"\]/);
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
    assert.match(html, /\.trust-bar \{\s*display: none !important;/);
    assert.match(html, /\.about-stats \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 220px\)\)[\s\S]*?justify-content: center/);
    assert.equal((html.match(/class="stat-card"/g) || []).length, 3);
    assert.equal((html.match(/data-video-id=/g) || []).length, 28);
    assert.doesNotMatch(html, /data-video-id="6a45b87be81b019c9723bc54"/);
    assert.match(html, /data-video-id="6a45ba33e81b019c9723df2b"/);
    assert.equal((html.match(/class="project-accordion"/g) || []).length, 5);
    assert.match(html, /data-video-id="6a45bf80e4e7cc890ee34095"/);
    assert.match(html, /data-video-id="6a471f53e81b019c974c3eed"/);
    assert.match(html, /data-video-id="6a45bb7f18d11bffd504439a"/);
    assert.equal((html.match(/data-translate-key="case_imponderavel_title"/g) || []).length, 0);
    assert.match(html, /id="selected-projects"/);
    assert.equal((html.match(/class="project-accordion"/g) || []).length, 5);
    assert.match(html, /selected_caixa_desc/);
    assert.equal((html.match(/<details[^>]*\sopen(?:\s|>)/g) || []).length, 1);
    assert.match(html, /<details class="about-accordion" open>\s*<summary data-translate-key="about_profile_title"/);
    assert.doesNotMatch(html, /<details class="project-accordion"[^>]*\sopen/);
    assert.equal((html.match(/class="project-case-copy"/g) || []).length, 5);
    assert.match(html, /<div class="project-accordion-list project-accordion-grid">/);
    assert.equal((html.match(/<div class="project-case-copy">/g) || []).length, 5);
    assert.equal((html.match(/<div class="video-wrapper" data-video-id=/g) || []).length, 28);
});
