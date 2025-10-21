import { session, persist } from '../state.js';
import { radiusFromV2, stokesTerminalVelocity } from '../physics/core.js';

const PX_PER_M = 80000; // scale: 1 m = 80,000 px (so 5 mm ~ 400 px)

export class CanvasSim {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'canvas-wrap card';
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'canvas-toolbar';
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'canvas';
    this.container.appendChild(this.toolbar);
    this.container.appendChild(this.canvas);

    // Controls
    this.playBtn = makeBtn('▶ Play');
    this.pauseBtn = makeBtn('⏸ Pause');
    this.resetBtn = makeBtn('⟲ Reset');
    this.voltInput = makeRange('U (V)', 0, 1000, session.params.U, 1);

    this.toolbar.append(
      this.playBtn,
      this.pauseBtn,
      this.resetBtn,
      this.voltInput.wrap
    );

    this.ctx = this.canvas.getContext('2d');
    this.running = false;
    this.time = 0; // seconds simulation time

    this.state = {
      y: 0.6, // meters, from top plate downward
      v: 0.0, // m/s
      r: 2.0e-6, // m default initial radius
    };

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.playBtn.addEventListener('click', () => this.play());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resetBtn.addEventListener('click', () => this.reset());
    this.voltInput.input.addEventListener('input', (e) => {
      const U = Number(e.target.value);
      session.params.U = U;
      this.voltInput.label.textContent = `U (V): ${U.toFixed(0)}`;
      persist();
    });

    this.reset();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = Math.max(640, rect.width);
    this.canvas.height = 420;
  }

  play() {
    if (this.running) return;
    this.running = true;
    this.lastTs = performance.now();
    const loop = (ts) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (ts - this.lastTs) / 1000);
      this.lastTs = ts;
      this.update(dt);
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  pause() { this.running = false; }

  reset() {
    this.running = false;
    this.time = 0;
    // derive r from an example v2 using params if available
    const exampleV2 = 2e-4; // 0.2 mm/s
    const r = radiusFromV2(
      exampleV2,
      session.params.rho_o,
      session.params.rho_a,
      session.params.g,
      session.params.eta
    ) || 2e-6;
    this.state.r = r;
    // start in the middle of plates (0 .. d)
    this.state.y = session.params.d * 0.5;
    this.state.v = 0;
    this.draw();
  }

  update(dt) {
    const { eta, rho_o, rho_a, g, d, U } = session.params;
    const { r } = this.state;

    // Very simplified dynamics: approach terminal velocity instantly (first-order relaxation)
    const v2 = stokesTerminalVelocity(r, rho_o, rho_a, g, eta); // downward terminal
    // Electric force upward if field upward. E = U/d, q unknown; use proxy by matching v1+v2 scaling for demo
    const E = U / Math.max(d, 1e-9);
    // proxy acceleration factor to emulate v1 variance without explicit q: a_elec ~ k * E
    const k = 1e-6; // tunable to get nice speeds on canvas
    const v1_target = -(v2) + k * E; // negative = upward

    // Relax velocity toward v_target depending on sign of E
    const tau = 0.3; // s time constant to smooth motion
    const v_target = E > 0 ? v1_target : v2;
    this.state.v += (v_target - this.state.v) * (dt / tau);

    // Integrate position with bounds between 0 and d
    this.state.y += this.state.v * dt;
    if (this.state.y < 0) {
      this.state.y = 0; this.state.v *= -0.2;
    } else if (this.state.y > d) {
      this.state.y = d; this.state.v *= -0.2;
    }

    this.time += dt;
  }

  drawPlates() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, width, height);

    // Plate positions
    const marginX = 80;
    const topY = 50;
    const bottomY = height - 50;

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(marginX, topY - 10, width - marginX * 2, 10);
    ctx.fillRect(marginX, bottomY, width - marginX * 2, 10);

    // Electric field arrows
    const arrows = 6;
    ctx.strokeStyle = '#94a3b8';
    for (let i = 0; i < arrows; i++) {
      const x = marginX + ((i + 0.5) * (width - marginX * 2)) / arrows;
      drawArrow(ctx, x, topY + 10, x, bottomY, 10);
    }

    return { marginX, topY, bottomY };
  }

  drawDrop(layout) {
    const ctx = this.ctx;
    const { marginX, topY, bottomY } = layout;
    const { d } = session.params;

    const x = (this.canvas.width) / 2;
    const yFrac = this.state.y / Math.max(d, 1e-9);
    const y = topY + (bottomY - topY) * yFrac;

    const pxR = Math.max(2, this.state.r * PX_PER_M);
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(x, y, pxR, 0, Math.PI * 2);
    ctx.fill();

    // velocity indicator
    ctx.fillStyle = '#334155';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`v = ${this.state.v.toExponential(2)} m/s`, x + 16, y - 8);
  }

  draw() {
    const layout = this.drawPlates();
    this.drawDrop(layout);
  }
}

function makeBtn(label) {
  const btn = document.createElement('button');
  btn.className = 'button';
  btn.textContent = label;
  return btn;
}

function makeRange(label, min, max, value, step = 1) {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '10px';

  const lab = document.createElement('span');
  lab.textContent = `${label}: ${value}`;

  const input = document.createElement('input');
  input.type = 'range';
  input.min = min;
  input.max = max;
  input.value = value;
  input.step = step;
  input.style.width = '240px';

  wrap.append(lab, input);
  return { wrap, input, label: lab };
}

function drawArrow(ctx, fromx, fromy, tox, toy, headlen) {
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = '#94a3b8';
  ctx.fill();
}
