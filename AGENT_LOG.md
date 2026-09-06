# AGENT_LOG

Short notes on how I used AI tools while building Career Builder.

- Used Claude Code as a pair-programmer throughout the build — scaffolding features, writing/reviewing Supabase migrations, and reviewing security-sensitive code like RLS policies and auth checks.
- Asked it to add the GrapesJS canvas editor, Cloudinary image upload, and live job injection into the canvas builder. Had to correct the first pass on canvas publish — it saved GrapesJS's raw HTML/CSS output as-is, which wasn't a full valid HTML document, so I asked for it to be wrapped properly before storing.
- Job injection into the canvas page originally matched on CSS class names, which broke when a block was re-styled. Asked for a stable `data-inject="open-roles"` attribute instead.
- Learned from it that GrapesJS's exported HTML has no responsive/media-query styling at all — asked for a fix applied at serve time instead of per-block, so it also fixed pages already published.
- Used it to rename routes and rebrand the app (White Carrot → Career Builder), and asked it to double-check every hardcoded path/revalidate call after the rename rather than trust a plain find-and-replace.
- Used it to analyze the full codebase and generate the project docs (Tech Spec, README, this log) — asked it to verify claims against the actual code first rather than write from assumption.
- General takeaway: asking "why is this broken" before "fix this" usually got a better, more durable answer than asking for a quick fix outright.
