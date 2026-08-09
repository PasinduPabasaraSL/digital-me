#!/usr/bin/env bash
# Generates WebP derivatives for every source JPEG under public/assets.
# Uses ImageMagick rather than a node dependency so the pipeline works
# without installing native modules. Derivatives are committed, so this
# only needs re-running when a source image is added or replaced.
set -euo pipefail

cd "$(dirname "$0")/.."
ASSETS="public/assets"

THUMB_WIDTH=640
FULL_WIDTH=1600
THUMB_QUALITY=72
FULL_QUALITY=80

shopt -s nullglob nocaseglob

total_before=0
total_after=0

for src in "$ASSETS"/*.jpg "$ASSETS"/*.jpeg "$ASSETS"/*/*.jpg "$ASSETS"/*/*.jpeg; do
  base="${src%.*}"
  before=$(stat -c%s "$src")
  total_before=$((total_before + before))

  convert "$src" -auto-orient -strip \
    -resize "${THUMB_WIDTH}x${THUMB_WIDTH}>" \
    -quality "$THUMB_QUALITY" -define webp:method=6 \
    "${base}-thumb.webp"

  convert "$src" -auto-orient -strip \
    -resize "${FULL_WIDTH}x${FULL_WIDTH}>" \
    -quality "$FULL_QUALITY" -define webp:method=6 \
    "${base}-full.webp"

  thumb_size=$(stat -c%s "${base}-thumb.webp")
  full_size=$(stat -c%s "${base}-full.webp")
  total_after=$((total_after + thumb_size + full_size))

  printf '%-46s %7s KB -> thumb %5s KB / full %6s KB\n' \
    "${src#public/assets/}" \
    "$((before / 1024))" "$((thumb_size / 1024))" "$((full_size / 1024))"
done

echo
printf 'source total:     %s KB\n' "$((total_before / 1024))"
printf 'derivative total: %s KB\n' "$((total_after / 1024))"
