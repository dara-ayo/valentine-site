const $ = (sel) => document.querySelector(sel);

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal-on-scroll");
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("in");
  }
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Reveal interaction
const revealBtn = $("#revealBtn");
const revealBox = $("#revealBox");
const responseLine = $("#responseLine");

if (revealBtn) {
  revealBtn.addEventListener("click", () => {
    revealBox?.classList.add("show");
    revealBox?.setAttribute("aria-hidden", "false");
    launchConfetti(900);
  });
}

$("#yesBtn")?.addEventListener("click", () => {
  if (responseLine) responseLine.textContent = "Best answer. I’m smiling like crazy right now.";
  launchConfetti(1200);
});

$("#noBtn")?.addEventListener("click", () => {
  if (responseLine) responseLine.textContent = "That button is shy. Try ‘Yes’ again.";
  revealBox?.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
    { duration: 260, iterations: 1 }
  );
});

$("#sparkBtn")?.addEventListener("click", () => launchConfetti(650));

// Tiny confetti (no libs)
const canvas = $("#confetti");
const ctx = canvas?.getContext?.("2d");

function fitCanvas(){
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize", fitCanvas);

let confettiPieces = [];
let raf = null;

function launchConfetti(ms = 900){
  if (!canvas || !ctx) return;
  canvas.classList.add("show");
  fitCanvas();

  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  const colors = ["#d61f69", "#7c3aed", "#ff7aa2", "#ffcf5a", "#2dd4bf"];
  const count = Math.min(120, Math.floor(w / 4));

  confettiPieces = Array.from({ length: count }).map(() => ({
    x: Math.random() * w,
    y: -10 - Math.random() * h * 0.3,
    r: 2 + Math.random() * 4,
    vx: -1.2 + Math.random() * 2.4,
    vy: 2.2 + Math.random() * 3.8,
    rot: Math.random() * Math.PI,
    vr: -0.1 + Math.random() * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 0.9
  }));

  const start = performance.now();
  if (raf) cancelAnimationFrame(raf);

  const tick = (t) => {
    const elapsed = t - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of confettiPieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy += 0.02;
      p.alpha = Math.max(0, p.alpha - 0.003);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.6);
      ctx.restore();
    }

    if (elapsed < ms) {
      raf = requestAnimationFrame(tick);
    } else {
      canvas.classList.remove("show");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  raf = requestAnimationFrame(tick);
}
