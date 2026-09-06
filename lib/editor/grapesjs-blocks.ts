import type { Company } from "@/types/company";

// ── SVG thumbnail helpers ─────────────────────────────────────────────────────

function svgThumb(content: string, bg = "#f0f4ff") {
  return `<svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" style="border-radius:6px">
    <rect width="200" height="110" fill="${bg}"/>
    ${content}
  </svg>`;
}

function heroThumb(p: string) {
  const pl = `${p}22`;
  return svgThumb(`
    <rect x="0" y="0" width="200" height="110" fill="${pl}"/>
    <rect x="65" y="8" width="70" height="7" rx="3" fill="${p}"/>
    <rect x="30" y="24" width="140" height="16" rx="4" fill="${p}dd"/>
    <rect x="40" y="46" width="120" height="10" rx="3" fill="${p}55"/>
    <rect x="50" y="62" width="100" height="7" rx="2" fill="${p}33"/>
    <rect x="50" y="82" width="42" height="16" rx="4" fill="${p}"/>
    <rect x="100" y="82" width="50" height="16" rx="4" fill="none" stroke="${p}" stroke-width="1.5"/>
  `, "#fff");
}

function twoColThumb(p: string) {
  return svgThumb(`
    <rect x="10" y="10" width="80" height="90" rx="6" fill="${p}11"/>
    <rect x="18" y="20" width="64" height="10" rx="3" fill="${p}"/>
    <rect x="18" y="36" width="64" height="6" rx="2" fill="${p}44"/>
    <rect x="18" y="48" width="64" height="6" rx="2" fill="${p}44"/>
    <rect x="18" y="60" width="40" height="6" rx="2" fill="${p}44"/>
    <rect x="18" y="78" width="36" height="12" rx="3" fill="${p}"/>
    <rect x="110" y="10" width="80" height="90" rx="6" fill="${p}18"/>
    <rect x="124" y="30" width="52" height="6" rx="2" fill="${p}33"/>
    <text x="154" y="60" font-size="20" text-anchor="middle" fill="${p}44">🖼</text>
  `);
}

function photoGridThumb(p: string) {
  return svgThumb(`
    <rect x="10" y="10" width="84" height="90" rx="6" fill="${p}22"/>
    <rect x="102" y="10" width="44" height="42" rx="4" fill="${p}18"/>
    <rect x="154" y="10" width="36" height="42" rx="4" fill="${p}14"/>
    <rect x="102" y="58" width="44" height="42" rx="4" fill="${p}14"/>
    <rect x="154" y="58" width="36" height="42" rx="4" fill="${p}22"/>
    <text x="52" y="62" font-size="22" text-anchor="middle" fill="${p}55">🖼</text>
  `);
}

function statsThumb(p: string) {
  return svgThumb(`
    <rect x="0" y="0" width="200" height="110" fill="${p}"/>
    ${[0,1,2,3].map(i => `
      <rect x="${16 + i*46}" y="20" width="36" height="14" rx="3" fill="rgba(255,255,255,0.35)"/>
      <rect x="${20 + i*46}" y="50" width="28" height="8" rx="2" fill="rgba(255,255,255,0.6)"/>
      <rect x="${20 + i*46}" y="64" width="28" height="5" rx="2" fill="rgba(255,255,255,0.3)"/>
    `).join("")}
  `);
}

function gridCardsThumb(p: string, rows = 2) {
  const cols = [0, 1, 2];
  const rowArr = rows === 2 ? [0, 1] : [0];
  return svgThumb(`
    ${rowArr.flatMap(r => cols.map(c => `
      <rect x="${10 + c*63}" y="${10 + r*52}" width="56" height="44" rx="5" fill="${p}12" stroke="${p}22" stroke-width="1"/>
      <circle cx="${38 + c*63}" cy="${24 + r*52}" r="7" fill="${p}33"/>
      <rect x="${18 + c*63}" y="${36 + r*52}" width="40" height="5" rx="2" fill="${p}44"/>
      <rect x="${22 + c*63}" y="${44 + r*52}" width="32" height="4" rx="2" fill="${p}22"/>
    `)).join("")}
  `);
}

function numberedListThumb(p: string) {
  return svgThumb(`
    ${[0,1,2,3].map(i => `
      <circle cx="24" cy="${20 + i*22}" r="9" fill="${p}"/>
      <rect x="42" y="${15 + i*22}" width="110" height="7" rx="3" fill="${p}55"/>
      <rect x="42" y="${25 + i*22}" width="80" height="5" rx="2" fill="${p}22"/>
    `).join("")}
  `);
}

function quotesThumb(p: string) {
  return svgThumb(`
    ${[0,1,2].map(c => `
      <rect x="${8 + c*64}" y="8" width="56" height="68" rx="6" fill="${p}10" stroke="${p}20" stroke-width="1"/>
      <text x="${36 + c*64}" y="28" font-size="16" text-anchor="middle" fill="${p}44">"</text>
      <rect x="${14 + c*64}" y="32" width="44" height="5" rx="2" fill="${p}33"/>
      <rect x="${14 + c*64}" y="41" width="44" height="5" rx="2" fill="${p}33"/>
      <rect x="${14 + c*64}" y="50" width="30" height="5" rx="2" fill="${p}22"/>
      <circle cx="${20 + c*64}" cy="86" r="7" fill="${p}33"/>
      <rect x="${32 + c*64}" y="82" width="28" height="5" rx="2" fill="${p}44"/>
      <rect x="${32 + c*64}" y="90" width="22" height="4" rx="2" fill="${p}22"/>
    `).join("")}
  `);
}

function stepsThumb(p: string) {
  return svgThumb(`
    ${[0,1,2,3].map(i => `
      ${i < 3 ? `<rect x="${36 + i*44}" y="30" width="32" height="2" rx="1" fill="${p}33"/>` : ""}
      <circle cx="${18 + i*44}" cy="31" r="12" fill="${p}"/>
      <rect x="${6 + i*44}" y="52" width="24" height="6" rx="2" fill="${p}55"/>
      <rect x="${6 + i*44}" y="62" width="24" height="5" rx="2" fill="${p}22"/>
      <rect x="${6 + i*44}" y="71" width="24" height="5" rx="2" fill="${p}22"/>
    `).join("")}
  `);
}

function ctaThumb(p: string) {
  return svgThumb(`
    <rect x="0" y="0" width="200" height="110" fill="#111827"/>
    <rect x="40" y="20" width="120" height="14" rx="4" fill="rgba(255,255,255,0.85)"/>
    <rect x="60" y="42" width="80" height="8" rx="3" fill="rgba(255,255,255,0.4)"/>
    <rect x="60" y="56" width="80" height="8" rx="3" fill="rgba(255,255,255,0.25)"/>
    <rect x="72" y="76" width="56" height="18" rx="5" fill="${p}"/>
  `);
}

function faqThumb(p: string) {
  return svgThumb(`
    <rect x="10" y="14" width="180" height="20" rx="5" fill="${p}10" stroke="${p}22" stroke-width="1"/>
    <rect x="10" y="40" width="180" height="20" rx="5" fill="${p}10" stroke="${p}22" stroke-width="1"/>
    <rect x="10" y="66" width="180" height="20" rx="5" fill="${p}10" stroke="${p}22" stroke-width="1"/>
    <rect x="10" y="92" width="180" height="4"  rx="2" fill="${p}10"/>
    <rect x="18" y="20" width="100" height="6" rx="2" fill="${p}44"/>
    <rect x="18" y="46" width="120" height="6" rx="2" fill="${p}44"/>
    <rect x="18" y="72" width="90"  height="6" rx="2" fill="${p}44"/>
    <rect x="174" y="21" width="8" height="4" rx="1" fill="${p}55"/>
    <rect x="174" y="47" width="8" height="4" rx="1" fill="${p}55"/>
    <rect x="174" y="73" width="8" height="4" rx="1" fill="${p}55"/>
  `);
}

function openRolesThumb(p: string) {
  return svgThumb(`
    <rect x="10" y="10" width="180" height="28" rx="5" fill="${p}10" stroke="${p}22" stroke-width="1"/>
    <rect x="10" y="44" width="180" height="28" rx="5" fill="${p}10" stroke="${p}22" stroke-width="1"/>
    <rect x="10" y="78" width="180" height="28" rx="5" fill="${p}10" stroke="${p}22" stroke-width="1"/>
    <rect x="20" y="19" width="70" height="7" rx="2" fill="${p}55"/>
    <rect x="20" y="29" width="44" height="5" rx="2" fill="${p}22"/>
    <rect x="20" y="53" width="80" height="7" rx="2" fill="${p}55"/>
    <rect x="20" y="63" width="44" height="5" rx="2" fill="${p}22"/>
    <rect x="20" y="87" width="60" height="7" rx="2" fill="${p}55"/>
    <rect x="20" y="97" width="44" height="5" rx="2" fill="${p}22"/>
    <rect x="160" y="17" width="22" height="11" rx="3" fill="${p}"/>
    <rect x="160" y="51" width="22" height="11" rx="3" fill="${p}"/>
    <rect x="160" y="85" width="22" height="11" rx="3" fill="${p}"/>
  `);
}

function footerThumb(p: string) {
  return svgThumb(`
    <rect x="0" y="0" width="200" height="110" fill="#111827"/>
    <rect x="80" y="18" width="40" height="9" rx="3" fill="rgba(255,255,255,0.85)"/>
    <rect x="60" y="34" width="80" height="5" rx="2" fill="rgba(255,255,255,0.3)"/>
    <rect x="60" y="44" width="80" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>
    <circle cx="84" cy="68" r="7" fill="rgba(255,255,255,0.18)"/>
    <circle cx="100" cy="68" r="7" fill="rgba(255,255,255,0.18)"/>
    <circle cx="116" cy="68" r="7" fill="rgba(255,255,255,0.18)"/>
    <rect x="20" y="88" width="160" height="1" fill="rgba(255,255,255,0.08)"/>
    <rect x="60" y="96" width="80" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>
  `);
}

function simpleThumb(emoji: string, p: string) {
  return svgThumb(`
    <text x="100" y="52" font-size="28" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <rect x="55" y="68" width="90" height="6" rx="2" fill="${p}33"/>
    <rect x="70" y="78" width="60" height="5" rx="2" fill="${p}1a"/>
  `);
}

function colThumb(cols: number, p: string) {
  const w = Math.floor(168 / cols);
  return svgThumb(
    Array.from({ length: cols }, (_, i) =>
      `<rect x="${16 + i * (w + 6)}" y="14" width="${w}" height="82" rx="5" fill="${p}12" stroke="${p}22" stroke-width="1"/>`
    ).join("")
  );
}

// Generates a placeholder image data-URI that GrapeJS treats as a real <img>
// (double-click opens the URL/asset dialog). The # in the hex color must be
// percent-encoded for the data: URI to be valid in an HTML attribute.
function phSrc(p: string) {
  const c = p.replace(/#/g, "%23");
  return (
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
    `width='800' height='600'%3E` +
    `%3Crect width='800' height='600' fill='${c}18'/%3E` +
    `%3Crect x='340' y='270' width='120' height='90' rx='8' stroke='${c}' stroke-width='3' fill='none'/%3E` +
    `%3Ccircle cx='400' cy='315' r='22' stroke='${c}' stroke-width='3' fill='none'/%3E` +
    `%3Crect x='356' y='258' width='32' height='16' rx='4' fill='${c}' opacity='.6'/%3E` +
    `%3Ctext x='400' y='410' font-family='sans-serif' font-size='22' ` +
    `text-anchor='middle' fill='${c}' opacity='.6'%3EDouble-click to add image%3C/text%3E` +
    `%3C/svg%3E`
  );
}

// ── Block definitions ─────────────────────────────────────────────────────────

export function buildCareerBlocks(company: Company) {
  const p  = company.theme?.primaryColor ?? "#6366f1";
  const name = company.name;

  return [
    // ── Career Sections ────────────────────────────────────────────────────

    {
      id: "gjs-hero",
      label: "Hero Banner",
      category: "Career Sections",
      media: heroThumb(p),
      content: `
        <section style="background:linear-gradient(135deg,${p}15,${p}05);padding:96px 24px;text-align:center;">
          <div style="max-width:720px;margin:0 auto;">
            <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:16px;">We're Hiring</p>
            <h1 style="font-size:3.25rem;font-weight:800;color:#111827;line-height:1.1;margin-bottom:24px;">Build What Matters<br/>at ${name}</h1>
            <p style="font-size:1.2rem;color:#6B7280;margin-bottom:40px;">We're looking for passionate people ready to solve hard problems and make a real impact.</p>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
              <a href="#open-roles" style="display:inline-block;background:${p};color:#fff;padding:14px 32px;border-radius:8px;font-weight:600;font-size:1rem;text-decoration:none;">See Open Roles</a>
              <a href="#about" style="display:inline-block;background:transparent;color:${p};padding:13px 31px;border-radius:8px;font-weight:600;font-size:1rem;border:2px solid ${p};text-decoration:none;">Learn About Us</a>
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-about",
      label: "About Us",
      category: "Career Sections",
      media: twoColThumb(p),
      content: `
        <section id="about" style="padding:80px 24px;background:#fff;">
          <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
            <div>
              <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">About Us</p>
              <h2 style="font-size:2.25rem;font-weight:700;color:#111827;margin-bottom:20px;">Who We Are</h2>
              <p style="font-size:1.05rem;color:#6B7280;line-height:1.8;margin-bottom:16px;">
                ${name} was founded with a single mission: to solve problems that matter. We're a team of builders, thinkers, and creators.
              </p>
              <p style="font-size:1.05rem;color:#6B7280;line-height:1.8;">
                Our team spans the globe, united by shared values and a commitment to excellence.
              </p>
            </div>
            <img src="${phSrc(p)}" alt="Team photo" style="width:100%;border-radius:16px;display:block;object-fit:cover;aspect-ratio:4/3;"/>
          </div>
        </section>`,
    },

    {
      id: "gjs-life",
      label: "Life at Company",
      category: "Career Sections",
      media: photoGridThumb(p),
      content: `
        <section style="padding:80px 24px;background:#F9FAFB;">
          <div style="max-width:1100px;margin:0 auto;text-align:center;margin-bottom:56px;">
            <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">Life Here</p>
            <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Life at ${name}</h2>
          </div>
          <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
            <div style="border-radius:12px;grid-row:span 2;overflow:hidden;">
              <img src="${phSrc(p)}" alt="Photo 1" style="width:100%;height:100%;object-fit:cover;display:block;"/>
            </div>
            <div style="border-radius:12px;overflow:hidden;aspect-ratio:4/3;">
              <img src="${phSrc(p)}" alt="Photo 2" style="width:100%;height:100%;object-fit:cover;display:block;"/>
            </div>
            <div style="border-radius:12px;overflow:hidden;aspect-ratio:4/3;">
              <img src="${phSrc(p)}" alt="Photo 3" style="width:100%;height:100%;object-fit:cover;display:block;"/>
            </div>
            <div style="border-radius:12px;overflow:hidden;aspect-ratio:4/3;">
              <img src="${phSrc(p)}" alt="Photo 4" style="width:100%;height:100%;object-fit:cover;display:block;"/>
            </div>
            <div style="border-radius:12px;overflow:hidden;aspect-ratio:4/3;">
              <img src="${phSrc(p)}" alt="Photo 5" style="width:100%;height:100%;object-fit:cover;display:block;"/>
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-stats",
      label: "Stats Row",
      category: "Career Sections",
      media: statsThumb(p),
      content: `
        <section style="padding:64px 24px;background:${p};">
          <div style="max-width:960px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center;">
            <div><p style="font-size:2.75rem;font-weight:800;color:#fff;margin-bottom:8px;">500+</p><p style="font-size:.95rem;color:rgba(255,255,255,.75);">Employees</p></div>
            <div><p style="font-size:2.75rem;font-weight:800;color:#fff;margin-bottom:8px;">20+</p><p style="font-size:.95rem;color:rgba(255,255,255,.75);">Countries</p></div>
            <div><p style="font-size:2.75rem;font-weight:800;color:#fff;margin-bottom:8px;">10M+</p><p style="font-size:.95rem;color:rgba(255,255,255,.75);">Users served</p></div>
            <div><p style="font-size:2.75rem;font-weight:800;color:#fff;margin-bottom:8px;">2018</p><p style="font-size:.95rem;color:rgba(255,255,255,.75);">Founded</p></div>
          </div>
        </section>`,
    },

    {
      id: "gjs-benefits",
      label: "Benefits & Perks",
      category: "Career Sections",
      media: gridCardsThumb(p, 2),
      content: `
        <section style="padding:80px 24px;background:#fff;">
          <div style="max-width:1100px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:56px;">
              <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">Why Join Us</p>
              <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Benefits &amp; Perks</h2>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
              ${[["🏥","Health & Wellness","Comprehensive medical, dental, and vision coverage."],["🌴","Unlimited PTO","Take the time you need. We trust you."],["🏠","Remote-First","Work from anywhere in the world."],["📚","Learning Budget","$2,000/year for courses and books."],["💰","Equity","Everyone gets a stake in what we build."],["🍼","Parental Leave","16 weeks fully paid for all new parents."]].map(([e,t,d])=>`<div style="border:1px solid #E5E7EB;border-radius:12px;padding:24px;"><div style="font-size:2rem;margin-bottom:12px;">${e}</div><h3 style="font-size:1rem;font-weight:700;color:#111827;margin-bottom:8px;">${t}</h3><p style="font-size:.9rem;color:#6B7280;line-height:1.6;">${d}</p></div>`).join("")}
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-values",
      label: "Our Values",
      category: "Career Sections",
      media: numberedListThumb(p),
      content: `
        <section style="padding:80px 24px;background:#F9FAFB;">
          <div style="max-width:800px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:56px;">
              <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">What We Believe</p>
              <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Our Values</h2>
            </div>
            <div style="display:flex;flex-direction:column;gap:24px;">
              ${[["01","Move with purpose","We ship fast, learn faster."],["02","Radical ownership","No blame, no excuses — just solutions."],["03","Default to open","Transparency builds trust and better decisions."],["04","Grow together","Your growth is our growth."]].map(([n,t,d])=>`<div style="display:flex;gap:24px;align-items:flex-start;background:#fff;border-radius:12px;padding:24px;border:1px solid #E5E7EB;"><span style="font-size:1.5rem;font-weight:800;color:${p};min-width:40px;">${n}</span><div><h3 style="font-size:1.05rem;font-weight:700;color:#111827;margin-bottom:6px;">${t}</h3><p style="font-size:.9rem;color:#6B7280;line-height:1.6;">${d}</p></div></div>`).join("")}
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-testimonials",
      label: "Testimonials",
      category: "Career Sections",
      media: quotesThumb(p),
      content: `
        <section style="padding:80px 24px;background:#fff;">
          <div style="max-width:1100px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:56px;">
              <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">Our Team</p>
              <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Hear from our people</h2>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
              ${[["SL","Sarah L.","Senior Engineer","This is the best team I've worked on. Everyone is smart and humble."],["MR","Marcus R.","Product Designer","The flexibility and trust I get here is unmatched."],["PP","Priya P.","Engineering Manager","I joined as an IC and became a manager in 18 months."]].map(([i,n,r,q])=>`<div style="border:1px solid #E5E7EB;border-radius:12px;padding:28px;display:flex;flex-direction:column;gap:20px;"><p style="font-size:.95rem;color:#374151;line-height:1.7;flex:1;">&ldquo;${q}&rdquo;</p><div style="display:flex;align-items:center;gap:12px;"><div style="width:40px;height:40px;border-radius:50%;background:${p}18;color:${p};font-weight:700;font-size:.85rem;display:flex;align-items:center;justify-content:center;">${i}</div><div><p style="font-weight:600;font-size:.9rem;color:#111827;">${n}</p><p style="font-size:.8rem;color:#6B7280;">${r}</p></div></div></div>`).join("")}
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-hiring-process",
      label: "Hiring Process",
      category: "Career Sections",
      media: stepsThumb(p),
      content: `
        <section style="padding:80px 24px;background:#F9FAFB;">
          <div style="max-width:960px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:56px;">
              <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">What to Expect</p>
              <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Our Hiring Process</h2>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
              ${[["01","Apply Online","5 min","Submit your application."],["02","Intro Call","30 min","Chat with our recruiter."],["03","Interview","1–2 hrs","A practical role-relevant assessment."],["04","Offer","1–2 days","A fast, competitive offer."]].map(([s,t,d,desc])=>`<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #E5E7EB;text-align:center;"><div style="width:48px;height:48px;border-radius:50%;background:${p};color:#fff;font-weight:800;font-size:1.1rem;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">${s}</div><h3 style="font-size:.95rem;font-weight:700;color:#111827;margin-bottom:4px;">${t}</h3><p style="font-size:.75rem;font-weight:600;color:${p};margin-bottom:8px;">${d}</p><p style="font-size:.85rem;color:#6B7280;line-height:1.5;">${desc}</p></div>`).join("")}
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-cta",
      label: "CTA Banner",
      category: "Career Sections",
      media: ctaThumb(p),
      content: `
        <section style="padding:80px 24px;background:${p};">
          <div style="max-width:720px;margin:0 auto;text-align:center;">
            <h2 style="font-size:2.5rem;font-weight:800;color:#fff;margin-bottom:16px;">Ready to do great work?</h2>
            <p style="font-size:1.1rem;color:rgba(255,255,255,.8);margin-bottom:40px;">Join a team that ships, learns, and grows together.</p>
            <a href="#open-roles" style="display:inline-block;background:#fff;color:${p};padding:16px 40px;border-radius:8px;font-weight:700;font-size:1.1rem;text-decoration:none;">Browse Open Roles</a>
          </div>
        </section>`,
    },

    {
      id: "gjs-faq",
      label: "FAQ",
      category: "Career Sections",
      media: faqThumb(p),
      content: `
        <section style="padding:80px 24px;background:#fff;">
          <div style="max-width:720px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:56px;">
              <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">Got Questions?</p>
              <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Frequently Asked Questions</h2>
            </div>
            <div style="display:flex;flex-direction:column;gap:16px;">
              ${[["Do you offer remote work?","Yes — we're remote-first."],["How long does hiring take?","Typically 2–3 weeks from application to offer."],["Do you sponsor visas?","We can only hire in countries where we have an entity."],["What's the interview process like?","Real work samples — no whiteboard puzzles."]].map(([q,a])=>`<div style="border:1px solid #E5E7EB;border-radius:10px;padding:20px 24px;"><p style="font-weight:700;color:#111827;margin-bottom:8px;">${q}</p><p style="color:#6B7280;font-size:.95rem;line-height:1.6;">${a}</p></div>`).join("")}
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-open-roles",
      label: "Open Roles",
      category: "Career Sections",
      media: openRolesThumb(p),
      content: `
        <section id="open-roles" data-inject="open-roles" style="padding:80px 24px;background:#F9FAFB;">
          <div style="max-width:960px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:48px;">
              <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p};margin-bottom:12px;">Join Us</p>
              <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Open Roles</h2>
            </div>
            <div style="border:2px dashed ${p};border-radius:12px;padding:48px 32px;text-align:center;">
              <div style="font-size:2.5rem;margin-bottom:16px;">💼</div>
              <h3 style="font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:8px;">Live job listings will appear here</h3>
              <p style="color:#6B7280;">Your active job postings will show to candidates on the published page.</p>
            </div>
          </div>
        </section>`,
    },

    {
      id: "gjs-footer",
      label: "Footer",
      category: "Career Sections",
      media: footerThumb(p),
      content: `
        <footer style="background:#111827;padding:48px 24px;text-align:center;">
          <div style="max-width:960px;margin:0 auto;">
            <p style="font-size:1.25rem;font-weight:800;color:#fff;margin-bottom:8px;">${name}</p>
            <p style="color:#9CA3AF;font-size:.9rem;margin-bottom:24px;">We're building something worth joining.</p>
            <div style="height:1px;background:rgba(255,255,255,.08);margin-bottom:24px;"></div>
            <p style="color:#6B7280;font-size:.8rem;">© ${new Date().getFullYear()} ${name}. All rights reserved.</p>
          </div>
        </footer>`,
    },

    // ── Elements ───────────────────────────────────────────────────────────

    {
      id: "gjs-text",
      label: "Text",
      category: "Elements",
      media: simpleThumb("📝", p),
      content: `<div style="padding:16px;"><p style="color:#374151;line-height:1.7;">Start typing your content here...</p></div>`,
    },

    {
      id: "gjs-heading",
      label: "Heading",
      category: "Elements",
      media: simpleThumb("H", p),
      content: `<h2 style="font-size:2rem;font-weight:700;color:#111827;padding:16px;">Section Heading</h2>`,
    },

    {
      id: "gjs-button",
      label: "Button",
      category: "Elements",
      media: simpleThumb("▶", p),
      content: `<a href="#" style="display:inline-block;background:${p};color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none;margin:8px;">Click Here</a>`,
    },

    {
      id: "gjs-image",
      label: "Image",
      category: "Elements",
      media: simpleThumb("🖼", p),
      // Real <img> so GrapeJS opens the URL/asset dialog on double-click
      content: `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f0f4ff'/%3E%3Ctext x='400' y='225' font-size='48' text-anchor='middle' dominant-baseline='middle' fill='%23a5b4fc'%3E🖼%3C/text%3E%3C/svg%3E" alt="Image" style="width:100%;border-radius:12px;display:block;"/>`,
    },

    {
      id: "gjs-divider",
      label: "Divider",
      category: "Elements",
      media: simpleThumb("—", p),
      content: `<hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;" />`,
    },

    // ── Layout ─────────────────────────────────────────────────────────────

    {
      id: "gjs-two-col",
      label: "2 Columns",
      category: "Layout",
      media: colThumb(2, p),
      content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px;"><div style="background:#F9FAFB;border-radius:8px;padding:24px;min-height:120px;"><p style="color:#6B7280;">Column 1</p></div><div style="background:#F9FAFB;border-radius:8px;padding:24px;min-height:120px;"><p style="color:#6B7280;">Column 2</p></div></div>`,
    },

    {
      id: "gjs-three-col",
      label: "3 Columns",
      category: "Layout",
      media: colThumb(3, p),
      content: `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;padding:24px;"><div style="background:#F9FAFB;border-radius:8px;padding:24px;min-height:120px;"><p style="color:#6B7280;">Column 1</p></div><div style="background:#F9FAFB;border-radius:8px;padding:24px;min-height:120px;"><p style="color:#6B7280;">Column 2</p></div><div style="background:#F9FAFB;border-radius:8px;padding:24px;min-height:120px;"><p style="color:#6B7280;">Column 3</p></div></div>`,
    },
  ];
}
