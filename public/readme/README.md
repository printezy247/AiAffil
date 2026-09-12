# HOW TO ADD ANIMATED GIFs FOR GITHUB README
#
# GitHub READMEs strip SVG animations. The SVGs in this folder include SMIL <animate> tags,
# but GitHub will render them as static images. To get motion on GitHub, convert the SVGs
# to animated GIFs and reference those instead (or in addition).
#
# ---------------------------------------------------------------------------
# OPTION A — Automated (recommended)
# ---------------------------------------------------------------------------
# 1. Install dependencies (one time):
#      npm install -g svg2gif-cli
#
# 2. From the repo root, run:
#      node scripts/make-gifs.mjs
#
#    This will:
#      - Find every SVG in public/readme/
#      - Render each at 1200px wide
#      - Capture 24 frames over 3 seconds (8fps, loops forever)
#      - Save .gif versions next to the SVGs
#
# ---------------------------------------------------------------------------
# OPTION B — Manual (if you prefer your own tools)
# ---------------------------------------------------------------------------
# Use any SVG→GIF converter (e.g. https://cloudconvert.com/svg-to-gif, or a
# headless-browser script of your own) and follow these rules:
#
#   Frame size:      1200 × 400  (hero can be 1200 × 600)
#   Frame rate:      8 fps (fast enough to look alive, small file size)
#   Loop:            forever
#   Background:      transparent or #0b1030 (match banner background)
#   Compression:     80–90% quality (GIF artifacts are noticeable on gradients)
#   Naming:           hero.svg  →  hero.gif  (same basename, .gif extension)
#
# Files to create (10 total):
#   public/readme/hero.svg           →  public/readme/hero.gif
#   public/readme/banner-features.svg   →  public/readme/banner-features.gif
#   public/readme/banner-quickstart.svg →  public/readme/banner-quickstart.gif
#   public/readme/banner-config.svg     →  public/readme/banner-config.gif
#   public/readme/banner-affiliate.svg  →  public/readme/banner-affiliate.gif
#   public/readme/banner-business.svg   →  public/readme/banner-business.gif
#   public/readme/banner-deploy.svg     →  public/readme/banner-deploy.gif
#   public/readme/banner-architecture.svg→  public/readme/banner-architecture.gif
#   public/readme/banner-legal.svg      →  public/readme/banner-legal.gif
#   public/readme/banner-fresh.svg      →  public/readme/banner-fresh.gif
#
# ---------------------------------------------------------------------------
# OPTION C — The "set it and forget it" hybrid
# ---------------------------------------------------------------------------
# Keep the SVGs in the README (they look crisp and professional). Add a small
# comment block at the top of README.md like this:
#
#   <!--
#   ANIMATION NOTE: GitHub strips SVG animation. The SVGs below render as static
#   images. To show motion, run `node scripts/make-gifs.mjs` and swap .svg for .gif
#   in the <img src="..."> paths below.
#   -->
#
# This way the README stays clean, and anyone who wants motion can flip a switch.
#