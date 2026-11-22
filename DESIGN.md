# Kaplun

Kaplun should feel like the Cerebras marketing site: a dark field, one orange action, flat geometry, and Manrope. The 3D stage stays on light paper so parts stay readable. Tokens live in `app/globals.css`.

Observed from https://www.cerebras.ai on 2026-11-20 (Firecrawl branding). Not a copy of their logo or copy.

## Colour

| Token | Dark (default) | Light | Use |
| --- | --- | --- | --- |
| `--bg` | `#121212` | `#ece8e4` | Page. Dark matches the site's color scheme. |
| `--panel` | `#2e2e2e` | `#f7f4f1` | Bars and cards. `#2e2e2e` is the scraped background. |
| `--ink` | `#ffffff` | `#1a1a1a` | Text. Primary button label is `#1a1a1a` on orange. |
| `--accent` | `#f15a27` | `#f15a27` | The one main action. Scraped primary. |
| `--accent-2` / `--hi` | `#ff985c` | `#c2410c` on light | Links and the picked part. Scraped accent. |
| `--accent-soft` | `#4c100b` | `#f6ddd2` | Scraped secondary, used as a tint. |
| Stage | `#dde9ff` | same | Light paper behind the model, both themes. |

## Type

- **Manrope** for headings and body. Scraped heading size is 64px, body 16px. Headings are 650, tight tracking.
- **IBM Plex Mono** for labels and the model chip. Cerebras uses Sometype Mono; that family is not in `next/font`, so Plex Mono is the stand-in.

## Shape

- Radius 4px on cards, 2px on buttons. Scraped primary button radius is 2px. Shadow is none.
- Borders are 1px `--line`, not a thick black stroke.
- Pages are flat bands, not floating tiles with offset shadows.

## Name

The product name in the nav and document title is **Kaplun**. The orange square mark is Kaplun's, not the Cerebras wordmark.
