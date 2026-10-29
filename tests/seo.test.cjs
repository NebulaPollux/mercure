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

test('robots advertises sitemap and sitemap includes only intended public pages', () => {
    const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.match(read('robots.txt'), /Sitemap: https:\/\/mercurevideo\.com\.br\/sitemap\.xml/);
    const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    assert.deepEqual(urls, ['https://mercurevideo.com.br/', 'https://mercurevideo.com.br/curriculo.html', 'https://mercurevideo.com.br/resume.html']);
});
