// ===================== PHYSICS-START =====================
const { Engine, Bodies, Body, Composite, Events, Vertices, Sleeping } = Matter;

const WORLD_W = 420;          // world is 420 units wide
const PLATE_Y = 0;            // top surface of the cake stand plate
const PLATE_W = 196;
const UNIT = 60;              // "1 Chog tall"
const FALL_LIMIT = 130;       // below the plate by this much = fell off
const DROP_GAP = 12;          // free-aim mode: Chogs are released this far above the tower
const CLAW_HANG = 85;         // claw mode: the claw releases Chogs this far above the tower
const LANDING_DAMP = 0.25;    // plump bodies soak up most of the impact on first touch
const LANDING_DAMP_X = 0.06;  // ...and nearly all of the sideways swing
const CLAW_AMP = 80;          // how far the claw swings either side of the tower
const CLAW_CARRY = 0.04;      // share of the claw's sideways speed the Chog keeps when released
const STEP = 1000 / 60;

const TIER = { Common: 1, Uncommon: 1.15, Rare: 1.3, Epic: 1.5, Legendary: 1.75 };
const AURAS = {
  none:     { label: 'None',     friction: 0.8,  frictionStatic: 1.3, restitution: 0.02, effect: '' },
  slippery: { label: 'Slippery', friction: 0.04, frictionStatic: 0.08, restitution: 0.02, effect: 'slides off anything' },
  sticky:   { label: 'Sticky',   friction: 1.0,  frictionStatic: 8,   restitution: 0.0,  effect: 'grips whatever it lands on' },
  bouncy:   { label: 'Bouncy',   friction: 0.6,  frictionStatic: 0.8, restitution: 0.55, effect: 'bounces on landing' },
};

// Head trait -> top shape (tuned to the real Genesis head list)
function headShape(head) {
  const s = String(head || '').toLowerCase();
  if (/horn|thorn|crown|wizard hat|diamond|spike|cone|party|unicorn|mohawk|witch|pointy/.test(s)) return 'pointy';
  if (/cap|hat|bucket|beret|visor|plumber/.test(s)) return 'flat';
  return 'round';
}

// 1:1 Legendaries have no Head trait: they get a sturdy flat top
function chogShape(c) { return /1:1/.test((c.traits && c.traits.Base) || '') ? 'flat' : headShape(c.traits && c.traits.Head); }

// Powers: every Chog's Base / Aura / Accessory traits give it real abilities
const POWERS = {
  legend:    { icon: '⭐', name: 'Legend', text: 'sticks where it lands, shrugs off wind and sell-offs, wide PERFECT zone' },
  sticky:    { icon: '☢️', name: 'Radioactive goo', text: 'sticks where it lands' },
  heavy:     { icon: '🦴', name: 'Bone heavy', text: '35% heavier, hard to shove' },
  windproof: { icon: '🌬️', name: 'Windproof', text: 'gusts do not push it' },
  hot:       { icon: '🔥', name: 'Hot', text: 'never iced, melts the ice it lands on' },
  chill:     { icon: '🧊', name: 'Chill', text: 'ignores sell-off shaking' },
  royal:     { icon: '👑', name: 'Royal', text: 'wider PERFECT zone' },
  floaty:    { icon: '☁️', name: 'Floaty', text: 'drifts down slowly, easier to time' },
  soft:      { icon: '🪶', name: 'Soft landing', text: 'lands with no bounce at all' },
  golden:    { icon: '🪙', name: 'Golden', text: 'double crumbs on every drop' },
};
function chogPowers(c) {
  if (c.powers) return c.powers;
  const t = c.traits || {}, out = [];
  const add = (p) => { if (p && !out.includes(p)) out.push(p); };
  const base = `${t.Base || ''} ${t.Form || ''}`;
  if (/1:1/.test(base)) add('legend');
  if (/radioactive/i.test(base)) add('sticky');
  if (/skull/i.test(base)) add('heavy');
  const n = String(c.name || '').toLowerCase();
  if (/midas/.test(n)) add('golden');
  if (/blaze|burning/.test(n)) add('hot');
  if (/grim|skully/.test(n)) add('heavy');
  const au = String(t.Aura || '').toLowerCase();
  if (/wind/.test(au)) add('windproof');
  else if (/burn|fier|fire/.test(au)) add('hot');
  else if (/aqua|cool|mint/.test(au)) add('chill');
  else if (/royal|purple|violet/.test(au)) add('royal');
  else if (/smoke|mist/.test(au)) add('floaty');
  else if (/clean|white|rose/.test(au)) add('soft');
  else if (/yellow|green|electric/.test(au)) add('golden');
  const ac = String(t.Accessory || '').toLowerCase();
  if (/coin|sb/.test(ac)) add('golden');
  else if (/cigar/.test(ac)) add('chill');
  else if (/heart|fwog|pepe/.test(ac)) add('soft');
  else if (/knife/.test(ac)) add('sticky');
  else if (/green candle/.test(ac)) add('floaty');
  else if (/red candle/.test(ac)) add('heavy');
  c.powers = out;
  return out;
}
const hasPower = (b, p) => Boolean(b.plugin && b.plugin.powers && (b.plugin.powers.includes(p) || (b.plugin.powers.includes('legend') && ['sticky', 'windproof', 'chill', 'royal'].includes(p))));

function chogStats(c) {
  const ov = c.override || {};
  const shape = ov.shape && ov.shape !== 'auto' ? ov.shape : (c.shape || chogShape(c));
  const tierName = ov.tier && ov.tier !== 'auto' ? ov.tier : (c.traits.Tier || 'Common');
  return {
    shape,
    tierName,
    tier: TIER[tierName] || 1,
    side: c.traits.Side === 'Left' ? -1 : 1,
    fat: c.diet ? 0 : (c.fat || 0),
    aura: ov.aura || 'none',
    powers: chogPowers(c),
  };
}

function chogDims(st) {
  return { w: 70 * (1 + 0.14 * st.fat), h: 60 * (1 + 0.035 * st.fat) };
}

function makeChogBody(c, x, y) {
  const st = chogStats(c);
  const { w, h } = chogDims(st);
  const density = 0.0018 * st.tier * (1 + 0.22 * st.fat) * (st.powers.includes('heavy') ? 1.35 : 1);
  let main;
  if (st.shape === 'pointy') {
    const peak = h * 0.32;
    const pts = [
      { x: -w / 2, y: h / 2 }, { x: -w / 2, y: -h * 0.12 }, { x: 0, y: -h / 2 - peak },
      { x: w / 2, y: -h * 0.12 }, { x: w / 2, y: h / 2 },
    ];
    const rounded = Vertices.hull(Vertices.chamfer(pts, [h * 0.15, 9, 5, 9, h * 0.15], -1, 2, 14));
    main = Bodies.fromVertices(x, y, [rounded], { density });
  } else if (st.shape === 'round') {
    main = Bodies.rectangle(x, y, w, h, { density, chamfer: { radius: [h * 0.34, h * 0.34, h * 0.15, h * 0.15] } });
  } else {
    main = Bodies.rectangle(x, y, w, h, { density, chamfer: { radius: [7, 7, h * 0.15, h * 0.15] } });
  }
  // Side trait: a heavy belly-weight on the side the Chog faces, so it leans that way.
  const weight = Bodies.circle(main.position.x + st.side * w * 0.14, main.position.y + h * 0.12, 7, { density: density * 3 });
  const body = Body.create({ parts: [main, weight] });
  body.plugin.powers = st.powers;
  const a = AURAS[st.aura !== 'none' ? st.aura : (hasPower(body, 'sticky') ? 'sticky' : 'none')] || AURAS.none;
  body.friction = a.friction;
  body.frictionStatic = a.frictionStatic;
  body.restitution = a.restitution;
  body.frictionAir = 0.02;
  body.slop = 0.01;
  const local = main.vertices.map((v) => ({ x: v.x - body.position.x, y: v.y - body.position.y }));
  const xs = local.map((p) => p.x), ys = local.map((p) => p.y);
  const bx0 = Math.min(...xs), by0 = Math.min(...ys);
  body.plugin.vis = {
    chog: c, local, bx0, by0, bw: Math.max(...xs) - bx0, bh: Math.max(...ys) - by0,
    squash: 0, guilty: false, shape: st.shape,
  };
  return body;
}

function makeWorld(opts = {}) {
  const engine = Engine.create({ enableSleeping: true });
  engine.positionIterations = 20;
  engine.velocityIterations = 16;
  const w = opts.plateW || PLATE_W;
  const plate = Bodies.rectangle(WORLD_W / 2, PLATE_Y + 9, w, 18, {
    isStatic: true, friction: 0.9, frictionStatic: 1.2, chamfer: { radius: 8 },
  });
  plate.plugin.w = w;
  Composite.add(engine.world, plate);
  return { engine, plate };
}

// First contact after a drop: the plump body squishes and soaks up the impact.
function dampLanding(pairs) {
  for (const p of pairs) for (const [part, other] of [[p.bodyA, p.bodyB], [p.bodyB, p.bodyA]]) {
    const b = part.parent;
    if (b.plugin && b.plugin.fresh) {
      b.plugin.fresh = false;
      const soft = hasPower(b, 'soft');
      Body.setVelocity(b, { x: b.velocity.x * (soft ? 0.02 : LANDING_DAMP_X), y: b.velocity.y * (soft ? 0.1 : LANDING_DAMP) });
      Body.setAngularVelocity(b, b.angularVelocity * (soft ? 0.1 : 0.3));
      b.frictionAir = 0.02;
      if (hasPower(b, 'hot')) { melt(b); melt(other.parent); b.plugin.melted = (b.plugin.melted || 0) + 1; }
    }
  }
}
// Market weather: random sideways shoves (sell pressure). Chill Chogs ignore it.
function tremor(bodies, mag, rnd = Math.random) {
  for (const b of bodies) {
    if (b.isStatic) continue;
    Sleeping.set(b, false);
    if (hasPower(b, 'chill')) continue;
    Body.applyForce(b, b.position, { x: (rnd() - 0.5) * 2 * mag * b.mass, y: 0 });
  }
}
// Rug pull / wonky table: the plate gets tipped (angle in radians), everything wakes up
function tipPlate(plate, bodies, angle) {
  const d = angle - plate.angle;
  Body.setAngle(plate, angle);
  if (d) for (const b of bodies) if (b.plugin.baked) Body.rotate(b, d, plate.position);   // the settled base tips with the plate
  for (const b of bodies) if (!b.isStatic) Sleeping.set(b, false);
}
const RUG_TILT = 0.025;       // max plate tilt during a rug pull (~1.4 degrees: ~half of tall towers survive)
const RUG_STEPS = 48;         // how long the tilt lasts (0.8s)
const SELL_FORCE = 0.0006;    // strength of sell-pressure shoves
const WIND_FORCE = 0.00012;   // sideways push during a gust (skinny ~40% win, fed ~100%)
const FUD_FORCE = 0.00018;    // FUD storm (market event): one big gust
const FREEZE_STEPS = 300;     // a liquidity freeze lasts 5 seconds
const ICE = { friction: 0.05, frictionStatic: 0.1 };   // everything slides
const FREEZE_ICE = { friction: 0.12, frictionStatic: 0.25 };   // a market freeze is a bit less slippery than a frozen level
function setIce(body, ice = ICE) {
  if (body.plugin && body.plugin.powers && body.plugin.powers.includes('hot')) return;  // hot Chogs never freeze
  body.plugin.dry = body.plugin.dry || { f: body.friction, fs: body.frictionStatic };
  body.plugin.icy = true;
  body.friction = ice.friction; body.frictionStatic = ice.frictionStatic;
}
function melt(body) {
  if (!body || !body.plugin || !body.plugin.icy) return;
  body.plugin.icy = false;
  body.friction = body.plugin.dry.f; body.frictionStatic = body.plugin.dry.fs;
}
// Settled Chogs squish into the one below: once a block has sat still in the tower it grips harder and resists tipping.
// Without this a 15-20 tall tower slowly slides apart on its own.
const GRIP = { inertia: 3, f: 1.0, fs: 2.2 };
function gripTower(bodies, except) {
  for (const b of bodies) {
    if (b.isStatic || b === except || b.plugin.gripped || b.position.y > PLATE_Y + 40) continue;
    b.plugin.gripped = true;
    Body.setInertia(b, b.inertia * GRIP.inertia);
    if (b.plugin.dry) { b.plugin.dry.f = Math.max(b.plugin.dry.f, GRIP.f); b.plugin.dry.fs = Math.max(b.plugin.dry.fs, GRIP.fs); }
    if (!b.plugin.icy) { b.friction = Math.max(b.friction, GRIP.f); b.frictionStatic = Math.max(b.frictionStatic, GRIP.fs); }
  }
}
// Tall towers: only the top LIVE_TOP Chogs stay loose. Everything under them has settled into a solid base (it still rides
// the moving plate and tips with rug pulls), so a 20-tall tower can only lose its top, never fold from the bottom up.
const LIVE_TOP = 6;
function bakeTower(bodies) {
  const tower = bodies.filter((b) => !b.isStatic && b.position.y < PLATE_Y + 40).concat(bodies.filter((b) => b.plugin.baked))
    .sort((a, b) => a.position.y - b.position.y);   // top first
  for (let i = LIVE_TOP; i < tower.length; i++) { const b = tower[i]; if (!b.isStatic) { Body.setStatic(b, true); b.plugin.baked = true; } }
}
// Liquidity freeze (market event): the plate and the whole tower turn to ice for a while. Hot Chogs stay dry.
function freezeAll(plate, bodies) { setIce(plate, FREEZE_ICE); for (const b of bodies) if (!b.isStatic) { setIce(b, FREEZE_ICE); Sleeping.set(b, false); } }
function thawAll(plate, bodies) { melt(plate); for (const b of bodies) melt(b); }
// Wind blows in cycles of 270 steps: calm, a 20-step warning, then a 70-step gust. Windproof Chogs ignore it.
const WIND_CYCLE = 270;
function windPhase(t) { const c = t % WIND_CYCLE; return c >= 30 && c < 50 ? 'warn' : c >= 50 && c < 120 ? 'gust' : 'calm'; }
function gust(bodies, dir, mag = WIND_FORCE) {
  for (const b of bodies) {
    if (b.isStatic) continue;
    Sleeping.set(b, false);
    if (hasPower(b, 'windproof')) continue;
    Body.applyForce(b, b.position, { x: dir * mag * b.mass, y: 0 });
  }
}
// Sky Waiter: the plate slides side to side and carries the tower with it
function platePos(t, amp, period) { return WORLD_W / 2 + amp * Math.sin((2 * Math.PI * t) / period); }
function movePlate(plate, bodies, x) {
  const dx = x - plate.position.x;
  Body.setPosition(plate, { x, y: plate.position.y });
  Body.setVelocity(plate, { x: dx, y: 0 });
  for (const b of bodies) {
    if (b.plugin.baked) { Body.setPosition(b, { x: b.position.x + dx, y: b.position.y }); Body.setVelocity(b, { x: dx, y: 0 }); }   // the settled base rides along
    else if (!b.isStatic && b.isSleeping) Body.setPosition(b, { x: b.position.x + dx, y: b.position.y });   // resting Chogs are carried, still asleep (waking them every frame made tall towers jitter apart)
  }
}
// The Bear takes a bite: the plate gets narrower
function resizePlate(plate, bodies, w) {
  const k = w / plate.plugin.w;
  if (Math.abs(k - 1) < 0.001) return;
  const ang = plate.angle;
  Body.setAngle(plate, 0);
  Body.scale(plate, k, 1);
  Body.setAngle(plate, ang);
  plate.plugin.w = w;
  for (const b of bodies) if (!b.isStatic) Sleeping.set(b, false);
}
function isCalm(bodies, vx = 0) {   // vx: the plate's own speed, so a tower riding a moving plate still counts as calm
  return bodies.every((b) => b.isSleeping || (Math.hypot(b.velocity.x - vx, b.velocity.y) < 0.12 && b.angularSpeed < 0.004));
}
function anyFell(bodies) {
  return bodies.some((b) => b.position.y > PLATE_Y + FALL_LIMIT);
}
function towerTop(bodies) {
  let top = PLATE_Y;
  for (const b of bodies) if (b.position.y < PLATE_Y + 40) top = Math.min(top, b.bounds.min.y);
  return top;
}
// ===================== PHYSICS-END =====================
