const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('professional profile sits below the hero and before the brand bar without duplicated copy', () => {
    const hero = html.indexOf('<section class="parallax-banner"');
    const profile = html.indexOf('<section class="professional-profile container"');
    const main = html.indexOf('<main class="container"');
    assert.ok(hero >= 0 && profile > hero && main > profile);
    assert.match(html, /<div class="profile-content" id="about-profile">/);
    assert.match(html, /<h2 id="professional-profile-title" data-translate-key="about_profile_title"/);
    assert.match(html, /\.professional-profile \.about-text \{ color: #fff; font-size: clamp\(1\.1rem, 1\.3vw, 1\.25rem\); line-height: 1\.7/);
    assert.equal((html.match(/data-translate-key="about_p1"/g) || []).length, 1);
    assert.doesNotMatch(html, /hero-profile-(?:summary|link)|hero_profile_(?:summary|link)/);
    const about = html.slice(html.indexOf('<section class="about-section'));
    assert.doesNotMatch(about, /id="about-profile"/);
    const profileSection = html.slice(profile, main);
    assert.match(profileSection, /class="profile-photo"[\s\S]*?data-translate-key="about_p1"/);
    assert.match(profileSection, /fetchpriority="high" decoding="async"/);
    assert.match(html, /\.professional-profile \.profile-intro \{ display: grid; grid-template-columns: 12rem minmax\(0, 1fr\)/);
    assert.match(html, /@media \(max-width: 700px\)[\s\S]*?\.professional-profile \.profile-intro \{ grid-template-columns: minmax\(0, 1fr\)/);
    assert.match(html, /produzido pela 5ERA e exibido na Record News/);
    assert.doesNotMatch(html, /abertura de 60 segundos do Think Plastic|60-second Think Plastic/);
    assert.match(html, /1,5 milhão de inscritos no período/);
    assert.doesNotMatch(html.slice(0, html.indexOf('"about_p1":')), /marcas como Dior, P&amp;G, Santander/);
});

const vm = require('node:vm');
const dictStart = html.indexOf('        const translations = {');
const dictEnd = html.indexOf('        const projectTranslations', dictStart);
const context = {};
vm.runInNewContext(html.slice(dictStart, dictEnd) + ';globalThis.dict = translations;', context);

test('profile introduces the editor while About explains the workflow in both languages', () => {
    const profile = html.slice(html.indexOf('<section class="professional-profile'), html.indexOf('<main class="container"'));
    const markup = [...profile.matchAll(/<p>(.*?)<\/p>/g)].map(match => match[1]).join('\n\n');
    assert.equal(markup, context.dict.pt.about_p1, 'language initialization must retain the approved initial copy');
    assert.equal(markup.split('\n\n').length, 3);
    assert.doesNotMatch(profile, /<details|<summary|2 editores|two editors/);
    assert.match(profile, /prazos curtos, motion graphics e vídeos para redes sociais/);
    assert.match(profile, /Na Singular Filmes, editei vídeos semanais para o canal Aero/);
    assert.match(profile, /APAS Show 2024[\s\S]*quatro horas após a captação/);
    assert.match(profile, /Think Plastic Brazil[\s\S]*Reels e Shorts para o SESC/);
    for (const lang of ['pt', 'en']) {
        const copy = context.dict[lang];
        assert.ok(copy.about_p1 && copy.about_quote && copy.about_p2);
        assert.match(copy.about_p1, /Think Plastic/);
        assert.match(copy.about_p1, /motion graphics/);
        assert.match(copy.about_p1, /SESC/);
        assert.doesNotMatch(copy.about_p1, /2 editores|two editors|Dior|Santander/);
        assert.doesNotMatch(copy.about_quote, /TRANSPETRO|CAIXA/);
    }
    assert.equal(context.dict.pt.sec3_title, 'COMO TRABALHO');
    assert.equal(context.dict.en.sec3_title, 'HOW I WORK');
    assert.doesNotMatch(html, /stat_years_(?:title|desc)/);
    const about = html.slice(html.indexOf('<section class="about-section'), html.indexOf('<section class="faq-section'));
    assert.equal((about.match(/class="stat-card"/g) || []).length, 2);
    assert.match(html, /grid-template-columns: repeat\(2, minmax\(0, 220px\)\)/);
});

test('featured cases follow the approved editorial order', () => {
    const sectionStart = html.indexOf('<div class="project-accordion-list project-accordion-grid">');
    const sectionEnd = html.indexOf('\n                    </div>\n\n                <div class="section-header', sectionStart);
    const section = html.slice(sectionStart, sectionEnd);
    const keys = [...section.matchAll(/<summary data-translate-key="(selected_[^"]+_title)"/g)].map(match => match[1]);
    assert.deepEqual(keys, [
        'selected_think_title',
        'selected_caixa_title',
        'selected_apas_title',
        'selected_transpetro_title',
        'selected_imponderavel_title'
    ]);
});

test('Think Plastic retains the approved duration, role, event, and tools in both languages', () => {
    for (const lang of ['pt', 'en']) {
        const copy = context.dict[lang];
        assert.match(copy.selected_think_desc, /2min40|2:40/);
        assert.match(copy.selected_think_desc, /World Plastic Connection Summit/);
        assert.match(copy.selected_think_desc, /2025/);
        assert.match(copy.selected_think_case_role, /Motion design (?:e edição|and editing)/);
        assert.match(copy.selected_think_tools, /DaVinci Resolve (?:e|and) Fusion/);
        assert.doesNotMatch(copy.about_p1, /60 segundos|60-second/);
    }
});
