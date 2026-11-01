const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('Portuguese and English resumes align dates, attribution, claims, and approved client display', () => {
    const pt = read('curriculo.html');
    const en = read('resume.html');
    for (const [html, expectedDate, claim] of [[pt, 'abr/2021 – fev/2022', '1,5 milhão de inscritos'], [en, 'Apr/2021 – Feb/2022', '1.5 million subscribers']]) {
        assert.ok(html.includes(expectedDate));
        assert.match(html, /produzido pela 5ERA e exibido na Record News|produced by 5ERA; broadcast on Record News/);
        assert.match(html, new RegExp(claim));
        assert.match(html, /Think Plastic Summit 2025/);
        assert.match(html, /via produtora\/agência|through a production company\/agency/);
        assert.doesNotMatch(html, /Dior|Santander|P&amp;G|P&G/);
        assert.doesNotMatch(html, /0% rework|zero retrabalho|2 editores|2 on-site editors/);
        assert.match(html, /Na Singular Filmes, editei vídeos semanais para o canal Aero|At Singular Filmes, edited weekly videos for Aero/);
    }
});
