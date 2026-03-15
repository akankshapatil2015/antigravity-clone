const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;

// ── Config ──────────────────────────────────────────────────────────────────
const WORDS = [
  "Hello!", "Physics", "Gravity", "Drag Me", "Matter.js",
  "Woah!", "Fun!", "Bounce", "Anti", "Gravity",
  "Click", "Play", "Oops!", "Zoom!", "Spin",
  "React", "Vite", "Code", "Build", "Create",
];

const COLORS = [
  "#4285F4", "#EA4335", "#FBBC05", "#34A853",
  "#9B59B6", "#E67E22", "#1ABC9C", "#E91E63",
  "#00BCD4", "#FF5722", "#607D8B", "#795548",
];

// ── State ────────────────────────────────────────────────────────────────────
const elements = [];       // { body, text, color, width, height }
let gravityState = "down"; // "down" | "up" | "zero"

// ── Canvas & Context ─────────────────────────────────────────────────────────
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ── Matter.js Engine ─────────────────────────────────────────────────────────
const engine = Engine.create({ gravity: { x: 0, y: 1 } });
const runner  = Runner.create();

function buildWalls() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const opts = { isStatic: true, restitution: 0.6, friction: 0.1 };
  return [
    Bodies.rectangle(W / 2,  H + 25,  W * 2, 50, opts),   // ground
    Bodies.rectangle(W / 2,  -25,     W * 2, 50, opts),   // ceiling
    Bodies.rectangle(-25,    H / 2,   50, H * 2, opts),   // left wall
    Bodies.rectangle(W + 25, H / 2,   50, H * 2, opts),   // right wall
  ];
}
Composite.add(engine.world, buildWalls());

// ── Mouse Drag ───────────────────────────────────────────────────────────────
const mouse           = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2, render: { visible: false } },
});
Composite.add(engine.world, mouseConstraint);

// ── Helpers ───────────────────────────────────────────────────────────────────
function measureText(text) {
  const tmp = document.createElement("canvas");
  const c   = tmp.getContext("2d");
  c.font    = "bold 16px Inter, sans-serif";
  return {
    width:  c.measureText(text).width + 32,
    height: 42,
  };
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addElement(x, y) {
  const text  = randomItem(WORDS);
  const color = randomItem(COLORS);
  const { width, height } = measureText(text);

  const px = x  ?? Math.random() * (window.innerWidth  - width)  + width  / 2;
  const py = y  ?? -50;

  const body = Bodies.rectangle(px, py, width, height, {
    restitution: 0.6,
    friction:    0.1,
    frictionAir: 0.02,
    chamfer:     { radius: height / 2 },
    angle:       (Math.random() - 0.5) * 0.4,
  });

  Composite.add(engine.world, body);
  elements.push({ body, text, color, width, height });
  updateCounter();
}

function clearAll() {
  elements.forEach(el => Composite.remove(engine.world, el.body));
  elements.length = 0;
  updateCounter();
}

function explode() {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  elements.forEach(el => {
    const dx   = el.body.position.x - cx;
    const dy   = el.body.position.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const f    = 0.08 / dist;
    Body.applyForce(el.body, el.body.position, { x: dx * f, y: dy * f });
  });
}

function updateCounter() {
  document.getElementById("counter").textContent =
    `${elements.length} element${elements.length !== 1 ? "s" : ""}`;
}

// ── Gravity toggle ────────────────────────────────────────────────────────────
const btnGravity = document.getElementById("btn-gravity");

function cycleGravity() {
  if (gravityState === "down")  gravityState = "up";
  else if (gravityState === "up") gravityState = "zero";
  else gravityState = "down";

  const labels = { down: "⬇ Gravity Down", up: "⬆ Gravity Up", zero: "⬟ Zero Gravity" };
  btnGravity.textContent = labels[gravityState];
}
btnGravity.addEventListener("click", cycleGravity);

// ── Button bindings ───────────────────────────────────────────────────────────
document.getElementById("btn-explode").addEventListener("click", explode);
document.getElementById("btn-add").addEventListener("click", () => addElement());
document.getElementById("btn-clear").addEventListener("click", clearAll);

// ── Click canvas to spawn ─────────────────────────────────────────────────────
canvas.addEventListener("click", e => {
  if (mouseConstraint.body) return;   // ignore if dragging
  addElement(e.clientX, e.clientY);
});

// ── Seed initial elements ─────────────────────────────────────────────────────
for (let i = 0; i < 12; i++) {
  const text  = WORDS[i % WORDS.length];
  const color = COLORS[i % COLORS.length];
  const { width, height } = measureText(text);
  const x = Math.random() * (window.innerWidth  - width)  + width  / 2;
  const y = Math.random() * (window.innerHeight * 0.6)    + 50;

  const body = Bodies.rectangle(x, y, width, height, {
    restitution: 0.6,
    friction:    0.1,
    frictionAir: 0.02,
    chamfer:     { radius: height / 2 },
    angle:       (Math.random() - 0.5) * 0.6,
  });
  Composite.add(engine.world, body);
  elements.push({ body, text, color, width, height });
}
updateCounter();

// ── Render loop ───────────────────────────────────────────────────────────────
function drawPill(ctx, x, y, angle, w, h, color, text) {
  const r = h / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // pill shape
  ctx.beginPath();
  ctx.moveTo(-w / 2 + r, -h / 2);
  ctx.lineTo( w / 2 - r, -h / 2);
  ctx.arc(    w / 2 - r,  0, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(-w / 2 + r,  h / 2);
  ctx.arc(   -w / 2 + r,  0, r,  Math.PI / 2, 3 * Math.PI / 2);
  ctx.closePath();

  // shadow then fill
  ctx.shadowColor   = "rgba(0,0,0,0.3)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle     = color;
  ctx.fill();

  // label
  ctx.shadowColor = "transparent";
  ctx.font        = "bold 16px Inter, sans-serif";
  ctx.fillStyle   = "#ffffff";
  ctx.textAlign   = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

function render() {
  // sync gravity
  engine.gravity.y = gravityState === "down" ? 1 : gravityState === "up" ? -1 : 0;

  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw each element
  for (const el of elements) {
    const { x, y } = el.body.position;
    drawPill(ctx, x, y, el.body.angle, el.width, el.height, el.color, el.text);
  }

  requestAnimationFrame(render);
}

Runner.run(runner, engine);
render();
