const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
for (const [file, route] of [['index.html', '/'], ['curriculo.html', '/curriculo.html'], ['resume.html', '/resume.html']]) {
    test(`${file}: unique canonical, description and analytics loader`, () => {
        const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
        const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
        assert.equal(canonicals.length, 1);
        assert.equal(canonicals[0][1], `https://mercurevideo.com.br${route}`);
        assert.match(html, /<meta name="description" content="[^"]{30,}"/);
        assert.equal((html.match(/src="\/_vercel\/insights\/script.js"/g) || []).length, 1);
        assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);
    });
}

test('home exposes verified Person structured data', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    assert.match(html, /<script type="application\/ld\+json">[\s\S]*"@type": "Person"/);
    assert.match(html, /"name": "Marcos Soares Santos"/);
    assert.match(html, /"image": "https:\/\/mercurevideo\.com\.br\/images\/profile_photo_2\.jpg"/);
    assert.match(html, /https:\/\/linkedin\.com\/in\/marcos-soares-santos/);
});

test('social sharing metadata uses the approved raster image', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    assert.match(html, /property="og:image" content="https:\/\/mercurevideo\.com\.br\/images\/social-share\.png"/);
    assert.match(html, /name="twitter:image" content="https:\/\/mercurevideo\.com\.br\/images\/social-share\.png"/);
    assert.match(html, /og:image:width" content="1200"/);
    assert.match(html, /og:image:height" content="630"/);
});

test('approved portfolio copy, hidden metrics, and project context are handled', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    assert.match(html, /Senior video editor and motion designer in São Paulo/);
    assert.match(html, /agencies, production companies, and direct clients/);
    assert.doesNotMatch(html, /heroShowreelBtn|hero_showreel_cta|class="hero-cta"/);
    assert.match(html, /Trabalhos entregues para/);
    assert.match(html, /\.trust-bar \{\s*display: none !important;/);
    assert.doesNotMatch(html, /1\.5M\+|\+46%|stat_subs_title|stat_ticket_title/);
    assert.match(html, /selected_caixa_desc/);
    assert.match(html, /selected_imponderavel_desc/);
    assert.match(html, /selected_think_role/);
    assert.match(html, /selected_transpetro_role/);
    assert.match(html, /"selected_imponderavel_title": "The Imponderable — Record News"/);
});

test('service headings preserve semantic hierarchy', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    assert.doesNotMatch(html, /<h[45][^>]*data-translate-key="srv_/);
    assert.equal((html.match(/<h3 data-translate-key="srv_[^"]+_title">[^<]*<\/h3>/g) || []).length, 4);
    assert.equal((html.match(/data-translate-key="srv_[^"]+_title"/g) || []).length, 4);
});

test('robots advertises sitemap and sitemap includes only intended public pages', () => {
    const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.match(read('robots.txt'), /Sitemap: https:\/\/mercurevideo\.com\.br\/sitemap\.xml/);
    const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    assert.deepEqual(urls, ['https://mercurevideo.com.br/', 'https://mercurevideo.com.br/curriculo.html', 'https://mercurevideo.com.br/resume.html']);
});
