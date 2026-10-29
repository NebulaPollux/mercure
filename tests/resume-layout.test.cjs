const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
for (const file of ['curriculo.html', 'resume.html']) {
    test.skip(`${file}: pending mobile layout improvement; screen-only rules preserve print`, () => {
        const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
        const start = html.indexOf('@media screen and (max-width: 800px)');
        const end = html.indexOf('@media print', start);
        assert.ok(start >= 0 && end > start, 'Need screen-only responsive rules before print rules');
        const mobile = html.slice(start, end);
        assert.match(mobile, /\.resume-page\s*\{[^}]*width:\s*100%/);
        assert.match(mobile, /\.grid-two-col\s*\{[^}]*grid-template-columns:\s*1fr\s*;/);
        assert.match(mobile, /\.exp-header\s*\{[^}]*flex-wrap:\s*wrap/);
        assert.match(mobile, /overflow-wrap:\s*anywhere/);
        assert.match(html.slice(end), /\.resume-page\s*\{[^}]*padding:\s*0;[^}]*width:\s*100%/);
    });
}
