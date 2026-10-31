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
    const items = [...html.matchAll(/class="[^"]*service-filter-item[^"]*"[^>]*data-services="([^"]+)"/g)];
    assert.equal(items.length, 28);
    for (const [, services] of items) {
        for (const service of services.split(/\s+/)) assert.ok(serviceKeys.includes(service), `unknown service ${service}`);
    }
    assert.match(html, /data-services="broadcast-corporativo motion-vfx"/);
    assert.match(html, /data-services="broadcast-corporativo same-day"/);
    assert.match(html, /data-services="social-performance same-day"/);
    assert.match(html, /function itemMatchesService\(item\)/);
    assert.match(html, /matchesTheme && matchesService/);
});

test('service filter preserves accessibility and reset behavior in source', () => {
    assert.match(html, /serviceFilterBtns\.forEach\(btn =>/);
    assert.match(html, /filterBtn\.setAttribute\('aria-pressed', String\(isActive\)\)/);
    assert.match(html, /if \(!matches && item\.matches\('details'\)\) item\.open = false;/);
    assert.match(html, /archiveContainer\.inert = !archiveMatches/);
    assert.match(html, /reelsExpandWrapper\.inert = false/);
    assert.match(html, /serviceFilterEmpty\.classList\.toggle\('is-visible'/);
});
