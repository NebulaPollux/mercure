const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('logos use smaller WebP with existing PNG fallback and explicit dimensions', () => {
    const pictures = [...html.matchAll(/<picture class="brand-picture">([\s\S]*?)<\/picture>/g)];
    assert.equal(pictures.length, 2);
    for (const [, body] of pictures) {
        assert.match(body, /<source srcset="images\/brand-logo.webp" type="image\/webp">/);
        assert.match(body, /<img onerror="retryPictureImage\(this, event\)" width="320" height="320" decoding="async" src="images\/infill_white_4x.png"/);
    }
    const webp = fs.readFileSync(path.join(root, 'images', 'brand-logo.webp'));
    assert.equal(webp.toString('ascii', 8, 12), 'WEBP');
    assert.ok(webp.length < fs.statSync(path.join(root, 'images', 'infill_white_4x.png')).size / 2);
});

test('below-fold profile defers loading and retains JPG fallback', () => {
    assert.match(html, /<picture class="profile-picture"><source srcset="images\/profile_photo.webp" type="image\/webp"><img src="images\/profile_photo_2.jpg" width="600" height="640" loading="lazy" decoding="async"/);
    const webp = fs.readFileSync(path.join(root, 'images', 'profile_photo.webp'));
    assert.equal(webp.toString('ascii', 8, 12), 'WEBP');
    assert.ok(webp.length < fs.statSync(path.join(root, 'images', 'profile_photo_2.jpg')).size / 5);
});

test('failed WebP source retries original before final image error handling', () => {
    const start = html.indexOf('        function retryPictureImage');
    const end = html.indexOf('    </script>', start);
    const context = {};
    vm.runInNewContext(html.slice(start, end), context);
    let removed = false;
    let stopped = false;
    const image = {
        style: {}, onerror: () => {},
        closest(selector) { return selector === 'picture' ? { querySelectorAll: () => removed ? [] : [{ remove() { removed = true; } }] } : {}; },
        getAttribute: () => 'original.jpg'
    };
    context.retryPictureImage(image, { stopImmediatePropagation() { stopped = true; } });
    assert.equal(removed, true);
    assert.equal(stopped, true);
    assert.equal(image.src, 'original.jpg');
    assert.notEqual(image.style.display, 'none');
    context.retryPictureImage(image, {});
    assert.equal(image.onerror, null);
    assert.equal(image.style.display, 'none');
});
