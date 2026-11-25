#!/bin/sh
# Compresses the learning center's PNG page images (static/img/learn/*-og.png) in place, so guides load faster.
# Keeps them as 1200x630 PNGs at the same paths: they're also the share image (og:image), where PNG is safest.
#
# - pngquant reduces each image to a 256-colour palette (lossy, but no visible change on these chart screenshots).
#   An image that can't reach the quality floor is left as it is, never made worse.
# - oxipng then recompresses losslessly and strips metadata.
#
# Safe to run more than once: an image that's already compressed barely changes.
# Run from the docusaurus folder after adding or changing a page image, then run scripts/make-learn-thumbnails.sh.
# Needs pngquant and oxipng: brew install pngquant oxipng
set -e
[ $# -gt 0 ] || set -- static/img/learn/*-og.png
before=0
after=0
for f in "$@"; do
    [ -f "$f" ] || continue
    size=$(wc -c < "$f")
    before=$((before + size))
    # Exit code 98/99: already small enough, or quality would drop below the floor. Keep the original then.
    pngquant --quality=75-92 --speed 1 --strip --skip-if-larger --force --output "$f.tmp" "$f" || true
    if [ -f "$f.tmp" ]; then mv "$f.tmp" "$f"; fi
    oxipng --quiet --opt 4 --strip safe "$f"
    after=$((after + $(wc -c < "$f")))
done
echo "PNG page images: $((before / 1024)) KB -> $((after / 1024)) KB"
