const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent"
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// ground
const ground = Bodies.rectangle(
  window.innerWidth/2,
  window.innerHeight,
  window.innerWidth,
  50,
  { isStatic: true }
);

Composite.add(world, [ground]);

// boxes
document.querySelectorAll(".box").forEach((el, i) => {

  const rect = el.getBoundingClientRect();

  const box = Bodies.rectangle(
    rect.left,
    rect.top,
    rect.width,
    rect.height,
    { restitution: 0.7 }
  );

  Composite.add(world, box);
});

// mouse drag
const mouse = Mouse.create(render.canvas);

const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse
});

Composite.add(world, mouseConstraint);