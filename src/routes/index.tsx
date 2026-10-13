import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/event";
import { Frame, Pen, SIGNATURE_PATH } from "@/components/invite/Frame";
import room from "@/assets/room.jpg";
import florals from "@/assets/florals.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `The Signature — Nikkah of ${EVENT.bride} & ${EVENT.groom}` },
      { name: "description", content: `${EVENT.date}, ${EVENT.time} at ${EVENT.venue}, ${EVENT.address}.` },
      { property: "og:title", content: `The Signature — ${EVENT.bride} & ${EVENT.groom}` },
      { property: "og:description", content: "One signature. One lifetime. An interactive Nikkah invitation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

const FLOURISH = "M60 168 C120 158 160 182 200 168 C240 154 280 178 340 168";
const CONNECTOR = "M10 20 C40 4 60 36 90 20 C120 4 140 36 170 20";
const HERO_ORNAMENT = "M4 10 H80 M120 10 H196 M100 3 L107 10 L100 17 L93 10 Z M86 10 C90 6 94 6 93 10 M114 10 C110 6 106 6 107 10";
const EMBLEMS = {
  date: "M8 14 H40 V42 H8 Z M8 22 H40 M16 8 V18 M32 8 V18 M18 30 H22 M26 30 H30 M18 36 H22",
  time: "M24 6 C34 6 42 14 42 24 C42 34 34 42 24 42 C14 42 6 34 6 24 C6 14 14 6 24 6 Z M24 13 V24 L31 29",
  venue: "M8 44 V22 C8 12 16 6 24 6 C32 6 40 12 40 22 V44 M14 44 V24 C14 17 19 12 24 12 C29 12 34 17 34 24 V44 M3 44 H45",
};
const PETALS = [
  [8, 9, 0], [22, 12, 3], [37, 10, 6], [51, 13, 1.5], [64, 11, 4.5], [78, 14, 2], [90, 10, 7], [15, 13, 8], [70, 12, 9.5],
];
// [left %, size px, duration s, delay s, sway px]
const DUST = [
  [6, 4, 14, 0, 30], [14, 3, 11, 3, -20], [23, 5, 16, 6, 24], [31, 3, 12, 1.5, -30], [42, 4, 15, 8, 18],
  [53, 3, 10, 4, -24], [61, 5, 17, 2, 28], [70, 3, 13, 7, -18], [79, 4, 12, 5, 22], [88, 3, 15, 9, -26], [95, 5, 14, 2.5, 16],
];
// Panels inside the one frame, in scroll order.
const PANEL_COUNT = 8;
// How long (in timeline units) the scroll rests on each panel after sliding to it.
const HOLDS = [0, 2.4, 1.6, 1.1, 1.1, 1.1, 1.4, 1.6];

function Divider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" className={`dv h-[6cqw] w-[56cqw] text-brass ${className}`} aria-hidden>
      <path className="draw" pathLength={1} stroke="currentColor" strokeWidth={0.8} d={HERO_ORNAMENT} />
    </svg>
  );
}

function Emblem({ d, cls }: { d: string; cls: string }) {
  return (
    <svg viewBox="0 0 48 48" className="mb-[4cqw] h-[16cqw] w-[16cqw] text-olive" aria-hidden>
      <path className={`draw ${cls}`} pathLength={1} d={d} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Connector({ cls }: { cls: string }) {
  return (
    <svg viewBox="0 0 180 40" className="mb-[3cqw] h-[7cqw] w-[40cqw] text-ink" aria-hidden>
      <path className={`draw ${cls}`} pathLength={1} d={CONNECTOR} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

// One fixed backdrop for the entire page — it never scrolls, so there is no "new scene" cut.
function Backdrop() {
  return (
    <>
      <img src={room} alt="" width={1024} height={1536} className="room-fixed" />
      <div className="room-veil-fixed" />
    </>
  );
}

function useSound() {
  const [on, setOn] = useState(false);
  const ctx = useRef<{ ac: AudioContext; gain: GainNode } | null>(null);
  const toggle = () => {
    if (!ctx.current) {
      const ac = new AudioContext();
      const gain = ac.createGain();
      gain.gain.value = 0;
      gain.connect(ac.destination);
      [146.83, 220, 277.18, 329.63].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        const g = ac.createGain();
        g.gain.value = 0.05 / (i + 1);
        const lfo = ac.createOscillator();
        lfo.frequency.value = 0.08 + i * 0.03;
        const lg = ac.createGain();
        lg.gain.value = 0.02 / (i + 1);
        lfo.connect(lg).connect(g.gain);
        o.connect(g).connect(gain);
        o.start();
        lfo.start();
      });
      ctx.current = { ac, gain };
    }
    const { ac, gain } = ctx.current;
    const next = !on;
    if (next) void ac.resume();
    gain.gain.cancelScheduledValues(ac.currentTime);
    gain.gain.linearRampToValueAtTime(next ? 0.6 : 0, ac.currentTime + 1.2);
    setOn(next);
  };
  return { on, toggle };
}

function SigStrokes({ main = 2.4, shadow = 4.2 }: { main?: number; shadow?: number }) {
  return (
    <>
      <path className="draw sig sig-main" pathLength={1} d={SIGNATURE_PATH} stroke="var(--ink)" strokeWidth={main} strokeLinecap="round" />
      <path className="draw sig" pathLength={1} d={SIGNATURE_PATH} stroke="var(--ink)" strokeWidth={shadow} strokeLinecap="round" opacity={0.35} transform="translate(0.8 1.2)" />
    </>
  );
}

function Invitation() {
  const root = useRef<HTMLDivElement>(null);
  const sound = useSound();
  const brideFirst = EVENT.bride.split(" ")[0];
  const groomFirst = EVENT.groom.split(" ")[0];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.09 });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.stop();

      const follow = (pen: Element, path: SVGPathElement, p: number) => {
        const pt = path.getPointAtLength(p * path.getTotalLength());
        pen.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      };
      const draw = (t: gsap.TweenTarget, vars: gsap.TweenVars = {}) =>
        gsap.fromTo(t, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "power2.inOut", ...vars });

      const ctx = gsap.context(() => {
        const sel = gsap.utils.selector(root);
        const q = (s: string) => sel(s) as unknown as Element[];

        // ───────── 1 — HERO (plays on load) ─────────
        const hSig = q(".hero .sig-main")[0] as unknown as SVGPathElement;
        const hFlo = q(".hero .flo")[0] as unknown as SVGPathElement;
        const hPen = q(".hero .pen")[0]!;
        const pp = { s: 0, f: 0 };
        follow(hPen, hSig, 0);
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero .hero-floral", { opacity: 0, scale: 0.8, duration: 1.8, stagger: 0.25, ease: "power2.out" }, 0)
          .from(".hero .h-bis", { opacity: 0, y: -12, duration: 1.1 }, 0.2)
          .add(draw(".hero .h-orn .draw", { duration: 1.3 }), 0.5)
          .from(".hero .h-kicker", { opacity: 0, letterSpacing: "0.7em", duration: 1.1 }, 0.7)
          .from(".hero .h-name", { yPercent: 115, duration: 1.2, stagger: 0.2, ease: "expo.out" }, 0.9)
          .from(".hero .h-amp", { opacity: 0, scale: 0.5, rotate: -20, duration: 0.9, ease: "back.out(2)" }, 1.35)
          .from(".hero .pen", { opacity: 0, duration: 0.3 }, 1.7)
          .to(pp, { s: 1, duration: 1.8, ease: "power1.inOut", onUpdate: () => follow(hPen, hSig, pp.s) }, 1.8)
          .add(draw(".hero .sig", { duration: 1.8, ease: "power1.inOut" }), 1.8)
          .to(pp, { f: 1, duration: 0.7, ease: "power2.inOut", onUpdate: () => follow(hPen, hFlo, pp.f) }, 3.6)
          .add(draw(hFlo, { duration: 0.7 }), 3.6)
          .to(hPen, { opacity: 0, duration: 0.4 }, 4.3)
          .from(".hero .h-tag span", { yPercent: 115, duration: 0.9, stagger: 0.15, ease: "expo.out" }, 3.9)
          .from(".hero .cue", { opacity: 0, y: 10, duration: 0.8 }, 4.4)
          .add(() => lenis.start(), 3.8);

        // Hero fades away as you scroll — the frame stage takes over on the same backdrop.
        gsap.to(".hero .hero-fade", {
          opacity: 0, y: -70, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });

        // ───────── 2 — THE ONE FRAME ─────────
        // The stage is pinned once. The frame appears, then stays put while its content slides inside it.
        const track = q(".stage .track")[0]!;
        const sSig = q(".stage .p1 .sig-main")[0] as unknown as SVGPathElement;
        const sPen = q(".stage .p1 .pen")[0]!;
        const sp = { s: 0 };
        follow(sPen, sSig, 0);

        const stage = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: ".stage", start: "top top", end: `+=${PANEL_COUNT * 95}%`, scrub: 1, pin: true, anticipatePin: 1 },
        });

        // Frame reveal (once)
        stage
          .fromTo(".stage .frame", { scale: 0.62, rotateX: 28, y: 60, opacity: 0 }, { scale: 1, rotateX: 0, y: 0, opacity: 1, ease: "power2.out", duration: 1.6 }, 0)
          .fromTo(".stage .frame-moulding", { clipPath: "inset(48% 48% 48% 48%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3 }, 0)
          .add(draw(".stage .border-line", { duration: 1.1 }), 0.3)
          .add(draw(".stage .corner", { duration: 1.1, stagger: 0.1 }), 0.6)
          .fromTo(".stage .frame-paper", { opacity: 0 }, { opacity: 1, duration: 0.9 }, 0.2)
          .to(".stage .frame .light-sweep", { x: "120%", duration: 1.6, ease: "none" }, 1.2)
          .from(".stage .floral", { opacity: 0, scale: 0.7, rotate: (i) => (i ? 160 : -20), duration: 0.9, stagger: 0.3 }, 1.2)
          .from(".stage .p0 .a", { opacity: 0, y: 18, duration: 0.8, stagger: 0.2 }, 1.3);

        // Content slides inside the frame, panel by panel
        const panelIn = (i: number): gsap.core.Timeline => {
          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          const p = `.stage .p${i}`;
          switch (i) {
            case 1:
              tl.from(`${p} .pen`, { opacity: 0, duration: 0.2 }, 0)
                .to(sp, { s: 1, duration: 1.4, ease: "power1.inOut", onUpdate: () => follow(sPen, sSig, sp.s) }, 0)
                .add(draw(`${p} .sig`, { duration: 1.4, ease: "power1.inOut" }), 0)
                .to(`${p} .pen`, { opacity: 0, duration: 0.3 }, 1.5)
                .from(`${p} .l1`, { opacity: 0, y: 18, duration: 0.7 }, 1.5)
                .from(`${p} .l2`, { opacity: 0, y: 18, duration: 0.7 }, 2);
              break;
            case 2:
              tl.add(draw(`${p} .dv .draw`, { duration: 0.8, stagger: 0.1 }), 0)
                .from(`${p} .nm`, { opacity: 0, y: 14, filter: "blur(4px)", stagger: 0.25, duration: 0.6 }, 0.2)
                .from(`${p} .rq`, { opacity: 0, stagger: 0.25, duration: 0.5 }, 1)
                .add(draw(`${p} .sl`, { duration: 0.7, stagger: 0.25 }), 1.4);
              break;
            case 3:
            case 4:
            case 5:
              tl.add(draw(`${p} .dc`, { duration: 0.5 }), 0)
                .add(draw(`${p} .de`, { duration: 0.8 }), 0.15)
                .from(`${p} .dt`, { opacity: 0, y: 12, stagger: 0.15, duration: 0.5 }, 0.5);
              break;
            case 6:
              tl.from(`${p} .ml`, { opacity: 0, y: 16, filter: "blur(3px)", stagger: 0.4, duration: 0.6 }, 0)
                .add(draw(`${p} .dv .draw`, { duration: 0.8 }), 1.1)
                .from(`${p} .mf`, { opacity: 0, duration: 0.8 }, 1.4);
              break;
            case 7:
              tl.add(draw(`${p} .dv .draw`, { duration: 0.6 }), 0.2)
                .from(`${p} .fi`, { opacity: 0, y: 10, stagger: 0.07, duration: 0.5 }, 0)
                .add(draw(`${p} .sigf`, { duration: 1 }), 0.5)
                .fromTo(".stage .frame .light-sweep", { x: "-120%" }, { x: "120%", duration: 1.4, ease: "none", immediateRender: false }, 0.2)
                .from(".stage .petals", { opacity: 0, duration: 1 }, 0.4)
                .from(".stage .outro", { opacity: 0, y: 12, duration: 0.8 }, 0.8);
              break;
          }
          return tl;
        };

        let t = 2.6; // resting time on panel 0 after the reveal
        for (let i = 1; i < PANEL_COUNT; i++) {
          stage.to(track, { yPercent: (-100 * i) / PANEL_COUNT, duration: 1.2, ease: "power2.inOut" }, t);
          stage.add(panelIn(i), t + 0.55);
          t += 1.2 + HOLDS[i]!;
        }
        stage.to({}, { duration: 0.4 }, t); // small rest at the very end
      }, root);

      // Fonts/images change layout — make sure pin distances are measured after they load.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());

      cleanup = () => {
        ctx.revert();
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={root} className="overflow-x-clip">
      <Backdrop />

      <button
        onClick={sound.toggle}
        aria-pressed={sound.on}
        aria-label={sound.on ? "Turn sound off" : "Turn sound on"}
        className="caps fixed right-4 top-4 z-50 rounded-full border border-brass/60 bg-ivory/80 px-4 py-2 text-[10px] text-ink backdrop-blur"
      >
        Sound {sound.on ? "On" : "Off"}
      </button>

      {/* 1 — HERO */}
      <section className="hero scene">
        <img src={florals} alt="" width={1024} height={1024} className="hero-floral hero-floral-tl" />
        <img src={florals} alt="" width={1024} height={1024} className="hero-floral hero-floral-br" />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {DUST.map(([l, s, d, delay, sway], i) => (
            <span key={i} className="dust" style={{ left: `${l}%`, width: s, height: s, animationDuration: `${d}s`, animationDelay: `${delay}s`, ["--sway" as string]: `${sway}px` }} />
          ))}
        </div>

        <div className="hero-fade relative z-10 flex w-full flex-col items-center px-6 text-center">
          <p className="h-bis urdu text-[clamp(1rem,3.4vw,1.35rem)] leading-loose" style={{ color: "var(--brass-deep)" }}>
            بسم اللہ الرحمٰن الرحیم
          </p>
          <svg viewBox="0 0 200 20" className="h-orn h-[18px] w-[150px] text-brass" aria-hidden>
            <path className="draw" pathLength={1} stroke="currentColor" strokeWidth={0.9} d={HERO_ORNAMENT} />
          </svg>

          <p className="h-kicker caps mt-5 text-[10px] text-olive sm:text-xs">The Nikkah of</p>

          <h1 className="mt-2 flex flex-col items-center leading-none">
            <span className="block overflow-hidden px-[0.2em] pb-[0.12em] pt-[0.05em]">
              <span className="h-name script gold-text block text-[clamp(2.8rem,min(15vw,11svh),6.5rem)] leading-[1.05]">{brideFirst}</span>
            </span>
            <span className="h-amp script block text-[clamp(1.6rem,min(7vw,5svh),2.8rem)] leading-none" style={{ color: "var(--brass-deep)" }}>&amp;</span>
            <span className="block overflow-hidden px-[0.2em] pb-[0.12em] pt-[0.05em]">
              <span className="h-name script gold-text block text-[clamp(2.8rem,min(15vw,11svh),6.5rem)] leading-[1.05]">{groomFirst}</span>
            </span>
          </h1>

          <svg viewBox="0 30 400 160" className="mt-1 w-[min(74vw,340px)] overflow-visible" aria-hidden>
            <SigStrokes main={2.6} shadow={4.4} />
            <path className="draw flo" pathLength={1} d={FLOURISH} stroke="var(--brass-deep)" strokeWidth={1.4} strokeLinecap="round" />
            <Pen className="pen" />
          </svg>

          <div className="h-tag mt-3 text-center text-ink">
            <p className="overflow-hidden"><span className="caps block whitespace-nowrap text-[clamp(0.9rem,3.6vw,1.5rem)] font-medium">One Signature.</span></p>
            <p className="overflow-hidden"><span className="caps block whitespace-nowrap text-[clamp(0.9rem,3.6vw,1.5rem)] font-medium" style={{ color: "var(--brass-deep)" }}>One Lifetime.</span></p>
          </div>

          <div className="cue mt-6 flex flex-col items-center gap-2">
            <p className="caps text-[10px] text-muted-foreground">Scroll to open</p>
            <span className="cue-line" />
          </div>
        </div>
      </section>

      {/* 2 — THE ONE FRAME: pinned once, content slides inside it */}
      <section className="stage scene">
        <Frame>
          <div className="viewport">
            <div className="track">
              {/* 0 — Title */}
              <div className="panel p0">
                <p className="a caps text-[5.4cqw] leading-relaxed text-ink">The Art<br />of a Promise</p>
                <p className="a script mt-[4cqw] text-[16cqw] leading-[1.05] text-ink">The Signature</p>
                <p className="a caps mt-[5cqw] text-[3cqw] text-olive">A Nikkah Invitation</p>
              </div>

              {/* 1 — The signature */}
              <div className="panel p1">
                <svg viewBox="0 30 400 160" className="w-full overflow-visible" aria-hidden>
                  <SigStrokes main={3.4} shadow={5.6} />
                  <Pen className="pen" />
                </svg>
                <p className="l1 mt-[5cqw] text-[5.2cqw] italic leading-snug text-ink">Some moments deserve to be remembered forever.</p>
                <p className="l2 mt-[3cqw] text-[4.2cqw] leading-snug text-olive">And some promises begin a lifetime.</p>
              </div>

              {/* 2 — Nikkah Nama */}
              <div className="panel p2">
                <p className="nm urdu text-[8cqw] leading-[1.6]" style={{ color: "var(--brass-deep)" }}>{EVENT.urduTitle}</p>
                <p className="nm caps text-[2.8cqw] text-olive">Nikkah Nama</p>
                <Divider className="my-[2.5cqw]" />
                <p className="nm caps text-[5.6cqw] leading-tight text-ink">{EVENT.bride}</p>
                <p className="nm script my-[0.5cqw] text-[10cqw] leading-none" style={{ color: "var(--brass-deep)" }}>&amp;</p>
                <p className="nm caps text-[5.6cqw] leading-tight text-ink">{EVENT.groom}</p>
                <Divider className="my-[2.5cqw]" />
                <p className="rq caps text-[2.7cqw] leading-relaxed text-ink">Request the honour of your presence</p>
                <p className="rq caps text-[2.7cqw] leading-relaxed text-olive">at their Nikkah Ceremony</p>
                <div className="mt-[4cqw] grid w-full grid-cols-2 gap-[6cqw]">
                  {["Bride", "Groom"].map((l, i) => (
                    <div key={l}>
                      <svg viewBox="0 0 100 30" className="w-full" aria-hidden>
                        <path className="draw sl" pathLength={1} stroke="var(--ink)" strokeWidth={1.2} strokeLinecap="round"
                          d={i ? "M8 22 C20 4 28 4 30 16 C32 26 44 8 54 14 C64 20 70 10 90 12" : "M10 20 C18 6 26 6 28 18 C30 26 40 6 52 14 C62 20 74 8 92 14"} />
                        <line x1="4" y1="27" x2="96" y2="27" stroke="var(--brass)" strokeWidth={0.6} />
                      </svg>
                      <p className="caps mt-[1cqw] text-[2.4cqw] text-muted-foreground">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3,4,5 — Date, Time, Venue */}
              {[
                { i: 3, e: EMBLEMS.date, label: "The Date", lines: [EVENT.date] },
                { i: 4, e: EMBLEMS.time, label: "The Time", lines: [EVENT.time] },
                { i: 5, e: EMBLEMS.venue, label: "The Venue", lines: [EVENT.venue, EVENT.address] },
              ].map((d) => (
                <div key={d.i} className={`panel p${d.i}`}>
                  <Connector cls="dc" />
                  <Emblem d={d.e} cls="de" />
                  <p className="dt caps text-[2.8cqw] text-olive">{d.label}</p>
                  <p className="dt caps mt-[3cqw] text-[5.6cqw] leading-snug text-ink">{d.lines[0]}</p>
                  {d.lines[1] && <p className="dt caps mt-[2cqw] text-[3cqw] leading-relaxed text-muted-foreground">{d.lines[1]}</p>}
                </div>
              ))}

              {/* 6 — The emotional moment */}
              <div className="panel p6">
                <p className="ml caps text-[5.4cqw] leading-loose text-ink">Two Families.</p>
                <p className="ml caps text-[5.4cqw] leading-loose text-ink">Two Hearts.</p>
                <p className="ml caps text-[5.4cqw] leading-loose" style={{ color: "var(--brass-deep)" }}>One Beautiful Beginning.</p>
                <Divider className="my-[6cqw]" />
                <p className="mf text-[5cqw] italic leading-snug text-olive">Your presence will make this moment even more special.</p>
              </div>

              {/* 7 — Grand finale */}
              <div className="panel p7">
                <p className="fi caps text-[5cqw] leading-tight text-ink">{EVENT.bride}</p>
                <p className="fi script text-[8cqw] leading-none" style={{ color: "var(--brass-deep)" }}>&amp;</p>
                <p className="fi caps text-[5cqw] leading-tight text-ink">{EVENT.groom}</p>
                <Divider className="my-[2.5cqw]" />
                <p className="fi caps text-[3.4cqw] text-olive">{EVENT.event}</p>
                <p className="fi caps mt-[3cqw] text-[3.2cqw] text-ink">{EVENT.date}</p>
                <p className="fi caps mt-[1cqw] text-[3.2cqw] text-ink">{EVENT.time}</p>
                <p className="fi caps mt-[3cqw] text-[3.4cqw] text-ink">{EVENT.venue}</p>
                <p className="fi caps mt-[1cqw] text-[2.5cqw] leading-relaxed text-muted-foreground">{EVENT.address}</p>
                <svg viewBox="0 30 400 160" className="fi mt-[1cqw] w-[32cqw]" aria-hidden>
                  <path className="draw sigf" pathLength={1} d={SIGNATURE_PATH} stroke="var(--ink)" strokeWidth={4.5} strokeLinecap="round" />
                </svg>
                <p className="fi caps text-[2.4cqw] text-olive">Hosted by {EVENT.host}</p>
              </div>
            </div>
          </div>
        </Frame>

        <div className="petals" aria-hidden>
          {PETALS.map(([l, d, delay], i) => (
            <span key={i} className="petal" style={{ left: `${l}%`, animationDuration: `${d}s`, animationDelay: `${delay}s`, ["--drift" as string]: `${i % 2 ? -50 : 50}px` }} />
          ))}
        </div>

        <p className="outro caps absolute bottom-4 z-10 max-w-sm px-6 text-center text-[10px] leading-loose text-ink">
          A promise written today.<br />A lifetime to cherish.
        </p>
      </section>
    </div>
  );
}
