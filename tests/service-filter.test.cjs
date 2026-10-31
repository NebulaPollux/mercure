const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const serviceKeys = ['broadcast-corporativo', 'social-performance', 'same-day', 'motion-vfx'];

test('service filters expose four bilingual controls with one selected default', () => {
    assert.equal((html.match(/<button class="service-filter-btn/g) || []).length, 5);
    assert.equal((html.match(/data-service-filter=/g) || []).length, 5);
    assert.equal((html.match(/<button class="service-filter-btn[^>]*data-translate-key="service_filter_[^"]+"/g) || []).length, 5);
    for (const key of ['service_filter_group', 'service_filter_label', 'service_filter_all', 'service_filter_broadcast', 'service_filter_social', 'service_filter_sameday', 'service_filter_motion', 'service_filter_empty']) {
        assert.equal((html.match(new RegExp('"' + key + '":', 'g')) || []).length, 2, `${key} must exist in PT and EN`);
    }
    assert.equal((html.match(/class="service-filter-btn active"/g) || []).length, 1);
    assert.equal((html.match(/data-service-filter="[^"]+"[^>]*aria-pressed="true"/g) || []).length, 1);
});

test('service labels cover selected projects, archive cards, and reels without new video IDs', () => {
    const items = [...html.matchAll(/class="[^"]*service-filter-item[^"]*"[^>]*data-services="([^"]*)"/g)];
    assert.equal(items.length, 28);
    for (const [, services] of items) {
        for (const service of services.split(/\s+/).filter(Boolean)) assert.ok(serviceKeys.includes(service), `unknown service ${service}`);
    }
    assert.match(html, /data-services="broadcast-corporativo motion-vfx"/);
    assert.match(html, /data-services="broadcast-corporativo same-day"/);
    assert.match(html, /data-services="social-performance same-day"/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="">\s+<div class="video-wrapper" data-video-id="6a45be3e18d11bffd50473aa">/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="motion-vfx">\s+<div class="video-wrapper" data-video-id="6a45ba55e81b019c9723e28f">/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="broadcast-corporativo motion-vfx">\s+<div class="video-wrapper" data-video-id="6a45b8a618d11bffd50405b6">/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="motion-vfx">\s+<div class="video-wrapper" data-video-id="6a45ba55e81b019c9723e28f">/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="broadcast-corporativo">\s+<div class="video-wrapper" data-video-id="6a45b89018d11bffd50404a1">/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="social-performance">\s+<div class="video-wrapper" data-video-id="6a45b9a0e81b019c9723d556">/);
    assert.equal((html.match(/data-translate-key="TattooWeek aftermovie"/g) || []).length, 1);
    assert.equal((html.match(/"TattooWeek aftermovie": "Aftermovie"/g) || []).length, 2);
    assert.match(html, /data-translate-key="TattooWeek aftermovie">Aftermovie<\/p>/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="social-performance">\s+<div class="video-wrapper" data-video-id="6a45b9a0e81b019c9723d556">/);
    assert.match(html, /<div class="horizontal-card service-filter-item" data-services="broadcast-corporativo">\s+<div class="video-wrapper" data-video-id="6a45b89018d11bffd50404a1">/);
    for (const match of html.matchAll(/class="[^"]*service-filter-item[^"]*" data-category="campanhas" data-services="([^"]+)"/g)) {
        assert.doesNotMatch(match[1], /motion-vfx/);
    }
    for (const match of html.matchAll(/class="[^"]*service-filter-item[^"]*" data-category="institucionais" data-services="([^"]+)"/g)) {
        assert.doesNotMatch(match[1], /motion-vfx/);
    }
    assert.match(html, /function itemMatchesService\(item\)/);
    assert.match(html, /matchesTheme && matchesService/);
});

test('service filter preserves accessibility and reset behavior in source', () => {
    assert.match(html, /serviceFilterBtns\.forEach\(btn =>/);
    assert.match(html, /filterBtn\.setAttribute\('aria-pressed', String\(isActive\)\)/);
    assert.match(html, /if \(!matches && item\.matches\('details'\)\) item\.open = false;/);
    assert.match(html, /archiveContainer\.inert = !archiveMatches/);
    assert.match(html, /serviceFilterEmpty\.classList\.toggle\('is-visible'/);
    assert.match(html, /reelsFilterEmpty\.classList\.toggle\('is-visible', !hasMatchingReels\)/);
    assert.match(html, /toggleReelsBtn\.hidden = !hasMatchingReels/);
    assert.match(html, /function setReelsExpanded\(isExpanded\)/);
    assert.match(html, /toggleReelsBtn\.setAttribute\('aria-expanded', String\(isExpanded\)\)/);
    assert.match(html, /setReelsExpanded\(reelsMatches\)/);
    assert.match(html, /renderReelCards\(\);/);
    assert.match(html, /setReelsExpanded\(activeReelFilter !== 'all'\)/);
    assert.match(html, /toggleReelsBtn\.hidden = false/);
    assert.match(html, /setReelsExpanded\(hasMatchingReels\)/);
});
