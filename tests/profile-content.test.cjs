const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const site = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pt = fs.readFileSync(path.join(root, 'curriculo.html'), 'utf8');
const en = fs.readFileSync(path.join(root, 'resume.html'), 'utf8');

test('about section has distinct Portuguese and English translations for every paragraph', () => {
    const expectedKeys = ['about_p1', 'about_p2', 'about_quote', 'about_profile_title', 'about_sameday_title', 'about_tools_title'];
    const keys = [...site.matchAll(/data-translate-key="(about_(?:p1|p2|quote|profile_title|sameday_title|tools_title))"/g)].map(m => m[1]);
    assert.deepEqual([...new Set(keys)].sort(), expectedKeys.sort());
    for (const key of expectedKeys) {
        assert.equal((site.match(new RegExp('"' + key + '":', 'g')) || []).length, 2, `${key} must exist in PT and EN dictionaries`);
    }
});

test('Portuguese and English resumes describe SESC, same-day hackathon, and CNP handoff accurately', () => {
    for (const html of [pt, en]) {
        assert.match(html, /SESC Brasil/);
        assert.match(html, /Same-Day Video Editor|Editor de Vídeo Same-Day/);
        assert.match(html, /CAIXA Consórcio Hackathon|Hackathon CAIXA Consórcio/);
        assert.match(html, /CNP Assurances/);
        assert.match(html, /motion graphics/);
        assert.match(html, /awaiting publication|aguardando publicação/);
        assert.doesNotMatch(html, /Cinema Criativo/);
    }
    assert.match(pt, /equipe de cobertura audiovisual/);
    assert.doesNotMatch(pt.match(/Hackathon CAIXA Consórcio[\s\S]{0,500}/)?.[0] || '', /coordenei|coordenação/);
});
