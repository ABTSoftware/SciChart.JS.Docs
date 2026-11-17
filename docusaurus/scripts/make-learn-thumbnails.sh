#!/bin/sh
# Makes the small card images for the "Related guides" cards: static/img/learn/thumbs/<slug>.webp,
# 480 px wide (a few KB each), from each guide's page image static/img/learn/<slug>-og.png.
# Run from the docusaurus folder after adding or changing a guide's page image. Needs cwebp (brew install webp).
set -e
mkdir -p static/img/learn/thumbs
for f in static/img/learn/*-og.png; do
    slug=$(basename "$f" -og.png)
    cwebp -quiet -resize 480 0 -q 72 "$f" -o "static/img/learn/thumbs/$slug.webp"
done
echo "Wrote $(ls static/img/learn/thumbs/*.webp | wc -l | tr -d ' ') thumbnails to static/img/learn/thumbs/"
