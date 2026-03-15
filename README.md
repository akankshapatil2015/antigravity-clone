# Antigravity Physics

An interactive physics simulation inspired by Google's Antigravity experiment. Elements fall, bounce, and can be dragged around the screen using realistic physics.

## Demo

Open `index.html` in any browser — no build step or server required.

## Features

- Click anywhere on the screen to spawn a new element
- Drag and throw elements around
- Toggle gravity: Down → Up → Zero-G
- Explode all elements outward from the center
- Clear the canvas

## Tech Stack

- **HTML / CSS / JavaScript** — vanilla, no frameworks
- **Matter.js** — 2D physics engine (loaded via CDN)
- **Canvas API** — custom rendering of pill-shaped elements

## Files

```
antigravity/
├── index.html   # Page structure, loads Matter.js from CDN
├── style.css    # Dark background, glassmorphism buttons, layout
└── script.js    # Physics engine, render loop, controls
```

### `index.html`
The structure. Loads Matter.js from CDN, links the CSS and JS, and contains the canvas, title overlay, and control buttons.

### `style.css`
All the styling. Dark gradient background, pill button styles with glassmorphism effect, title glow, counter position — everything visual except the physics elements themselves (those are drawn on canvas).

### `script.js`
All the logic:

- Sets up the Matter.js engine, walls, and mouse drag
- `addElement(x, y)` — creates a physics body + stores its text/color
- `drawPill()` — draws each element on the canvas every frame using the Canvas 2D API
- `cycleGravity()` — toggles between down / up / zero-g
- `explode()` — blasts all elements outward from center
- `render()` — the main loop that syncs physics → canvas each frame

## How It Works

Matter.js runs a physics simulation in the background — each word element is a rigid body with bounce and friction. Every frame, a `requestAnimationFrame` loop reads each body's position and angle, then draws a pill shape with a text label onto an HTML canvas. Mouse dragging is handled natively by Matter.js's `MouseConstraint`.

## JavaScript Functionality (script.js)

`script.js` handles **everything** in this project — physics, rendering, and all interactions.

### Setup (runs once on page load)

| What | Why |
|---|---|
| Creates the physics `Engine` | The brain that calculates all movement |
| Creates the `Runner` | Keeps the engine ticking every millisecond |
| Builds 4 invisible walls | So elements bounce off edges |
| Sets up `MouseConstraint` | Lets you click and drag elements |
| Spawns 12 starter elements | So the page isn't empty on load |

### Functions

**`addElement(x, y)`**
Picks a random word and color, measures how wide the text is, creates a physics body (rectangle) at that position, and stores it in the `elements` array.

**`drawPill(ctx, x, y, angle, ...)`**
Draws one element on the canvas — a rounded pill shape with white text in the center. Called every frame for every element.

**`clearAll()`**
Loops through every element, removes it from the physics world, then empties the array.

**`explode()`**
Calculates the distance from each element to the screen center, then pushes it outward with a force — further elements get less force, closer ones get more.

**`cycleGravity()`**
Changes `engine.gravity.y` between `1` (down), `-1` (up), and `0` (zero-g). Also updates the button label.

**`render()`**
Runs 60 times per second via `requestAnimationFrame`. Clears the canvas, then loops through all elements and calls `drawPill()` for each one using its current physics position and angle.

**`measureText(text)`**
Uses a hidden canvas to calculate how wide a word is — so the pill is always the right size for its text.

### Event Listeners

| Event | What happens |
|---|---|
| Canvas click | Calls `addElement()` at mouse position |
| Gravity button | Calls `cycleGravity()` |
| Explode button | Calls `explode()` |
| Add button | Calls `addElement()` from top |
| Clear button | Calls `clearAll()` |

> HTML gives the structure, CSS gives the look — but JavaScript IS the entire application.

## Usage

```bash
# Just open the file
open index.html
```

Or deploy to any static host (Vercel, Netlify, GitHub Pages) — no server needed.

## License

MIT
