<script lang="ts">
  import { onMount } from 'svelte';

  interface Theory {
    id: string;
    n: string;
    c: string[];
    x: number;
    y: number;
    lp: string;
    live?: number;
    s: string;
    k: string;
  }

  type EdgeTuple = [string, string, string];

  onMount(() => {
    const COL: Record<string, string> = {
      Learning: '#f4efe6',
      Behaviour: '#e07b62',
      Memory: '#8fa6d0',
      Motivation: '#e0c066',
      Cognition: '#9da597'
    };

    const DIR: Record<string, string> = {
      EXTENDS: 'extends',
      CHALLENGES: 'challenges',
      'APPLIES TO': 'applies to',
      'RELATED TO': 'related to'
    };

    const INV: Record<string, string> = {
      EXTENDS: 'is extended by',
      CHALLENGES: 'is challenged by',
      'APPLIES TO': 'is a lens for',
      'RELATED TO': 'related to'
    };

    const T: Theory[] = [
      {id:'classical', n:'Classical Conditioning', c:['Behaviour'], x:143, y:148, lp:'r', s:'Learning by association between stimuli.', k:'A neutral stimulus paired with a meaningful one comes to trigger the same response.'},
      {id:'dissonance', n:'Cognitive Dissonance', c:['Behaviour'], x:387, y:123, lp:'t', s:'People act to reduce the discomfort of conflicting beliefs.', k:'Inconsistency between attitudes and actions creates tension that motivates change.'},
      {id:'social', n:'Social Learning', c:['Learning','Behaviour'], x:630, y:91, lp:'t', live:1, s:'People learn by observing and imitating others.', k:'Attention, retention, reproduction and motivation decide whether an observed behaviour is adopted.'},
      {id:'operant', n:'Operant Conditioning', c:['Behaviour'], x:207, y:302, lp:'l', live:1, s:'Behaviour is shaped and modified by its immediate consequences.', k:'Actions followed by reinforcement become more likely; those followed by punishment become less likely.'},
      {id:'construct', n:'Constructivism', c:['Learning','Cognition'], x:515, y:257, lp:'l', s:'Learners actively build new meaning and schemas from experience.', k:'Knowledge is constructed by the learner, not transmitted whole from teacher to student.'},
      {id:'connect', n:'Connectivism', c:['Learning'], x:746, y:244, lp:'r', s:'Learning happens across networks of people and information.', k:'Knowing is the ability to navigate and extend connections in a digital age.'},
      {id:'expect', n:'Expectancy-Value Theory', c:['Motivation'], x:938, y:135, lp:'t', s:'Effort depends on expected success and perceived worth.', k:'People engage most when they believe they can succeed and value the outcome.'},
      {id:'maslow', n:"Maslow's Hierarchy", c:['Motivation'], x:1143, y:103, lp:'r', s:'Needs form a ladder from survival to fulfilment.', k:'Basic needs must be reasonably met before higher growth needs drive behaviour.'},
      {id:'sdt', n:'Self-Determination Theory', c:['Motivation'], x:1117, y:264, lp:'r', live:1, s:'Motivation thrives on autonomy, competence and relatedness.', k:'Meeting these three needs supports self-endorsed motivation over controlled effort.'},
      {id:'tpb', n:'Theory of Planned Behaviour', c:['Behaviour'], x:887, y:315, lp:'b', s:'Intentions, shaped by attitudes and norms, predict behaviour.', k:'Attitude, subjective norms and perceived control together form the intention to act.'},
      {id:'experiential', n:'Experiential Learning', c:['Learning'], x:413, y:430, lp:'l', s:'Learning is a cycle of experience and reflection.', k:'Concrete experience, reflection, conceptualisation and experimentation feed one another.'},
      {id:'zpd', n:'Zone of Proximal Dev.', c:['Cognition'], x:630, y:417, lp:'r', s:'Learning is richest just beyond what we can do alone.', k:'With guidance from a more capable other, learners reach tasks they cannot yet manage independently.'},
      {id:'achieve', n:'Achievement Goal Theory', c:['Motivation'], x:1143, y:417, lp:'r', s:'The goals we pursue shape how we approach tasks.', k:'Mastery goals and performance goals lead to different persistence and strategies.'},
      {id:'schema', n:'Schema Theory', c:['Cognition'], x:861, y:456, lp:'r', s:'Knowledge is organised in mental frameworks.', k:'New information is interpreted through, and gradually reshapes, existing schemas.'},
      {id:'multistore', n:'Multi-Store Model', c:['Memory'], x:169, y:494, lp:'l', s:'Memory moves through sensory, short-term and long-term stores.', k:'Rehearsal and attention determine what passes from one store to the next.'},
      {id:'levels', n:'Levels of Processing', c:['Memory'], x:144, y:687, lp:'b', s:'Deeper thinking creates more durable memories.', k:'Meaning-based processing leaves stronger traces than surface features.'},
      {id:'forgetting', n:'Forgetting Curve', c:['Memory'], x:335, y:687, lp:'b', live:1, s:'Memory fades quickly unless it is revisited.', k:'Retention drops steeply soon after learning; spaced review flattens the decline.'},
      {id:'infoproc', n:'Information Processing', c:['Memory'], x:541, y:634, lp:'b', s:'The mind handles information like a processing system.', k:'Input is attended to, encoded, stored and retrieved in stages.'},
      {id:'workmem', n:'Working Memory Model', c:['Memory'], x:746, y:674, lp:'b', s:'A limited workspace holds and manipulates information.', k:'A central executive coordinates verbal, visual and episodic buffers.'},
      {id:'cogload', n:'Cognitive Load Theory', c:['Cognition'], x:938, y:635, lp:'r', live:1, s:'Working memory is limited, so instruction should respect it.', k:'Learning improves when unnecessary processing is reduced and effort goes to the material itself.'},
      {id:'dual', n:'Dual Coding Theory', c:['Cognition'], x:1156, y:622, lp:'r', s:'Words and images travel through separate channels.', k:'Information encoded verbally and visually has two routes for retrieval.'},
      
      /* NEW THEORIES ADDED BELOW */
      {id:'efficacy', n:'Self-Efficacy Theory', c:['Motivation'], x:1040, y:180, lp:'t', live:1, s:'Belief in one’s capability determines performance and resilience.', k:'Personal belief in succeeding at a specific task influences motivation and outcome.'},
      {id:'srl', n:'Self-Regulated Learning', c:['Learning'], x:480, y:340, lp:'t', s:'Learners proactively direct their cognition, motivation, and behavior.', k:'Forethought, performance control, and self-reflection drive successful learning cycles.'},
      {id:'attribution', n:'Attribution Theory', c:['Motivation'], x:1260, y:330, lp:'r', s:'How people explain causes of success and failure affects motivation.', k:'Attributing outcome to internal vs external, stable vs unstable factors shapes future effort.'},
      {id:'flow', n:'Flow Theory', c:['Motivation'], x:1010, y:340, lp:'b', live:1, s:'Deep immersion occurs when high skill meets optimal challenge.', k:'Optimal experience happens in a state of absorbed focus balance.'},
      {id:'elm', n:'Elaboration Likelihood', c:['Behaviour'], x:280, y:200, lp:'t', s:'Persuasion occurs through central or peripheral processing routes.', k:'Central processing leads to durable attitude change, while peripheral relies on surface cues.'},
      {id:'cogflex', n:'Cognitive Flexibility', c:['Cognition'], x:710, y:520, lp:'l', s:'Ability to adapt cognitive processing to changing complex environments.', k:'Prevents oversimplification by presenting information from multiple perspectives.'},
      {id:'scaffold', n:'Scaffolding Theory', c:['Learning'], x:530, y:500, lp:'b', live:1, s:'Temporary support enables learners to reach higher understanding.', k:'Instructional support is gradually removed as learner autonomy increases.'},
      {id:'spacing', n:'Spacing Effect', c:['Memory'], x:360, y:570, lp:'l', live:1, s:'Spaced study sessions produce better long-term retention than cramming.', k:'Repeated exposure over increasing time intervals strengthens memory consolidation.'}
    ];

    const E: EdgeTuple[] = [
      ['operant','EXTENDS','classical'],
      ['dissonance','RELATED TO','operant'],
      ['dissonance','RELATED TO','tpb'],
      ['social','CHALLENGES','operant'],
      ['social','RELATED TO','construct'],
      ['social','RELATED TO','sdt'],
      ['operant','RELATED TO','forgetting'],
      ['classical','RELATED TO','multistore'],
      ['zpd','EXTENDS','construct'],
      ['schema','EXTENDS','construct'],
      ['connect','RELATED TO','experiential'],
      ['experiential','RELATED TO','zpd'],
      ['expect','RELATED TO','sdt'],
      ['expect','RELATED TO','achieve'],
      ['sdt','EXTENDS','maslow'],
      ['tpb','RELATED TO','sdt'],
      ['achieve','RELATED TO','sdt'],
      ['levels','CHALLENGES','multistore'],
      ['multistore','RELATED TO','forgetting'],
      ['forgetting','RELATED TO','infoproc'],
      ['infoproc','RELATED TO','workmem'],
      ['cogload','EXTENDS','workmem'],
      ['schema','RELATED TO','cogload'],
      ['dual','APPLIES TO','cogload'],

      /* NEW EDGE CONNECTIONS */
      ['efficacy','EXTENDS','social'],
      ['efficacy','RELATED TO','expect'],
      ['srl','EXTENDS','construct'],
      ['srl','RELATED TO','efficacy'],
      ['attribution','RELATED TO','expect'],
      ['attribution','RELATED TO','achieve'],
      ['flow','RELATED TO','sdt'],
      ['elm','RELATED TO','dissonance'],
      ['cogflex','EXTENDS','construct'],
      ['cogflex','RELATED TO','schema'],
      ['scaffold','EXTENDS','zpd'],
      ['spacing','EXTENDS','forgetting']
    ];

    const qs = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (t: string, a: Record<string, string | number>, p?: Element | null) => {
      const e = document.createElementNS(NS, t);
      for (const k in a) e.setAttribute(k, String(a[k]));
      if (p) p.appendChild(e);
      return e;
    };

    const byId: Record<string, Theory> = Object.fromEntries(T.map(t => [t.id, t]));
    const svg = qs<SVGSVGElement>('#map')!;
    const world = qs<SVGGElement>('#world')!;
    const panel = qs<HTMLElement>('#panel')!;
    const tip = qs<HTMLElement>('#tip')!;
    const edgesGroup = qs<SVGGElement>('#edges');
    const elabsGroup = qs<SVGGElement>('#elabs');
    const nodesGroup = qs<SVGGElement>('#nodes');
    const pillsGroup = qs<HTMLElement>('#pills')!;
    const ziBtn = qs<HTMLButtonElement>('#zi')!;
    const zoBtn = qs<HTMLButtonElement>('#zo')!;
    const rsBtn = qs<HTMLButtonElement>('#rs')!;
    const qi = qs<HTMLInputElement>('#q')!;
    const res = qs<HTMLUListElement>('#res')!;

    let hov: string | null = null;
    let sel: string | null = null;
    let filt = 'all';
    let q = '';
    let view = { x: 0, y: 0, k: 1 };
    let lastFocus: HTMLElement | SVGElement | null = null;

    const nbrs = (id: string) => E.filter(e => e[0] === id || e[2] === id);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const edgeEls = E.map(([a, ty, b]) => {
      const A = byId[a];
      const B = byId[b];
      const path = el('path', { d: `M${A.x} ${A.y}L${B.x} ${B.y}`, class: 'edge t-' + ty.split(' ')[0] }, edgesGroup);
      const g = el('g', { class: 'elab', transform: `translate(${(A.x + B.x) / 2} ${(A.y + B.y) / 2})` }, elabsGroup);
      const rc = el('rect', { y: -14, height: 28, rx: 14 }, g);
      const tx = el('text', { y: 5 }, g);
      return { path, g, a: A, b: B, ty, rc, tx };
    });

    const nodeEls: Record<string, SVGGElement> = {};
    T.forEach(t => {
      const g = el('g', {
        class: 'node',
        tabindex: 0,
        role: 'button',
        'aria-label': `${t.n}, ${t.c.join(' and ')}. ${nbrs(t.id).length} connections.`,
        transform: `translate(${t.x} ${t.y})`
      }, nodesGroup) as SVGGElement;
      
      const col = COL[t.c[0]] || '#ffffff';
      el('circle', { r: 17, fill: 'transparent' }, g);
      el('circle', { class: 'halo', r: 19, stroke: col }, g);
      el('circle', { class: 'ring', r: 11, stroke: col }, g);
      el('circle', { class: 'dot', r: 3.6, fill: col }, g);

      const posMap: Record<string, [number, number, string]> = {
        r: [18, 5, 'start'],
        l: [-18, 5, 'end'],
        t: [0, -22, 'middle'],
        b: [0, 32, 'middle']
      };
      const P = posMap[t.lp] || [0, 0, 'middle'];
      const tx = el('text', { class: 'nm', x: P[0], y: P[1], 'text-anchor': P[2] }, g);
      tx.textContent = t.n;

      g.onmouseenter = g.onfocus = () => { hov = t.id; render(); };
      g.onmouseleave = g.onblur = () => { hov = null; render(); };
      g.onclick = (e: MouseEvent) => { e.stopPropagation(); lastFocus = g; select(t.id, false); };
      g.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lastFocus = g;
          select(t.id, true);
        }
      };
      g.onpointerdown = (e: PointerEvent) => e.stopPropagation();
      nodeEls[t.id] = g;
    });

    const categories: Array<[string, string, string | null]> = [
      ['all', 'All', null],
      ...Object.keys(COL).map(c => [c.toLowerCase(), c, COL[c]] as [string, string, string])
    ];

    categories.forEach(([f, l, c]) => {
      const b = document.createElement('button');
      b.innerHTML = (c ? `<i style="background:${c}"></i>` : '') + l;
      b.setAttribute('aria-pressed', String(f === 'all'));
      b.onclick = () => {
        filt = f;
        Array.from(pillsGroup.children).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        render();
      };
      pillsGroup.appendChild(b);
    });

    const matches = () => q ? T.filter(t => t.n.toLowerCase().includes(q)) : [];

    function render() {
      const M = matches();
      const single = M.length === 1 ? M[0].id : null;
      const act = hov || sel || single;
      const conn = new Set(act ? [act, ...nbrs(act).flatMap(e => [e[0], e[2]])] : []);

      T.forEach(t => {
        const g = nodeEls[t.id];
        if (!g) return;
        const m = filt !== 'all' && !t.c.some(c => c.toLowerCase() === filt);
        const faded = (act && !conn.has(t.id)) || (q && !act && !M.includes(t));
        g.setAttribute('class', 'node' + (t.id === act ? ' on' : conn.has(t.id) ? ' rel' : '') + (faded ? ' fade' : '') + (m ? ' mute' : ''));
      });

      edgeEls.forEach(e => {
        const hi = act && (e.a.id === act || e.b.id === act);
        const currentClass = e.path.getAttribute('class') || '';
        e.path.setAttribute('class', currentClass.replace(/ (hi|fade)/g, '') + (hi ? ' hi' : act ? ' fade' : ''));
        e.g.setAttribute('class', 'elab' + (hi ? ' hi' : ''));
        if (hi && act) {
          const out = e.a.id === act;
          const txt = out ? DIR[e.ty] : INV[e.ty];
          if (txt) {
            e.tx.textContent = txt;
            const w = txt.length * 7.4 + 28;
            e.rc.setAttribute('x', String(-w / 2));
            e.rc.setAttribute('width', String(w));
          }
        }
      });

      showTip();
    }

    function showTip() {
      if (!hov) {
        tip.style.display = 'none';
        return;
      }
      const t = byId[hov];
      if (!t || !svg) return;
      const W = svg.clientWidth, Hh = svg.clientHeight;
      tip.innerHTML = `<div class="label">${t.c.join(' · ')}</div><h3>${t.n}</h3><p>${t.s}</p><b>Explore theory →</b>`;
      tip.style.display = 'block';

      const th = tip.offsetHeight;
      let x = view.x + t.x * view.k - 60;
      let y = view.y + t.y * view.k + (t.lp === 'b' ? 58 : 34);

      x = Math.max(8, Math.min(x, W - 298));
      if (y + th > Hh - 8) {
        y = view.y + t.y * view.k - th - (t.lp === 't' ? 40 : 24);
      }

      tip.style.left = x + 'px';
      tip.style.top = Math.max(8, y) + 'px';
    }

    function apply(anim?: boolean) {
      if (!world) return;
      world.classList.toggle('anim', !!anim && !reduce);
      world.style.transform = `translate(${view.x}px,${view.y}px) scale(${view.k})`;
    }

    function fit(anim?: boolean) {
      if (!svg) return;
      const W = svg.clientWidth, Hh = svg.clientHeight;
      const mob = W < 700;
      let k = Math.min(W / 1330, Hh / 720);
      k = mob ? Math.max(k, 0.6) : Math.min(k, 1.4);
      view = { k, x: mob ? 8 : W / 2 - 655 * k, y: Hh / 2 - 395 * k };
      apply(anim);
    }

    function center(id: string) {
      const t = byId[id];
      if (!t || !svg) return;
      const W = svg.clientWidth, Hh = svg.clientHeight;
      const off = W > 700 && panel.classList.contains('open') ? -210 : 0;
      view.x = W / 2 + off - t.x * view.k;
      view.y = (W > 700 ? Hh / 2 : Hh * 0.25) - t.y * view.k;
      apply(true);
    }

    function zoom(f: number, cx?: number, cy?: number) {
      if (!svg) return;
      const W = svg.clientWidth, Hh = svg.clientHeight;
      cx = cx ?? W / 2;
      cy = cy ?? Hh / 2;
      const k = Math.min(2.5, Math.max(0.4, view.k * f));
      const r = k / view.k;
      view.x = cx - (cx - view.x) * r;
      view.y = cy - (cy - view.y) * r;
      view.k = k;
      apply(false);
      showTip();
    }

    svg.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const r = svg.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });

    let drag: { x: number; y: number; vx: number; vy: number; moved: boolean } | null = null;
    svg.addEventListener('pointerdown', (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
      svg.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        drag.moved = true;
        svg.classList.add('drag');
      }
      if (drag.moved) {
        view.x = drag.vx + dx;
        view.y = drag.vy + dy;
        apply(false);
        showTip();
      }
    });

    svg.addEventListener('pointerup', () => {
      if (drag && !drag.moved) closePanel();
      drag = null;
      svg.classList.remove('drag');
    });

    ziBtn.onclick = () => zoom(1.25);
    zoBtn.onclick = () => zoom(0.8);
    rsBtn.onclick = () => {
      closePanel();
      q = '';
      qi.value = '';
      fit(true);
      render();
    };

    function select(id: string, focusPanel?: boolean) {
      sel = id;
      const t = byId[id];
      if (!t) return;
      const rel = nbrs(id).map(e => {
        const out = e[0] === id;
        const o = byId[out ? e[2] : e[0]];
        return `<li><button data-id="${o.id}"><b>${o.n}</b><i>${out ? DIR[e[1]] : INV[e[1]]}</i></button></li>`;
      }).join('');

      panel.innerHTML = `<button class="close" aria-label="Close panel">× Close</button>
      <div class="pcat">${t.c.join(' · ')}</div>
      <h2 id="pt">${t.n}</h2>
      <p class="lead">${t.s}</p>
      <div class="sec"><div class="label">Key idea</div><p>${t.k}</p></div>
      <div class="sec"><div class="label">Related theories</div><ul class="rel-list">${rel}</ul></div>
      <div class="sec">${t.live ? `<div class="label">Where to explore</div><div class="btns"><a class="btn p" href="/explore?theory=${t.id}">Explore this theory →</a><a class="btn s" href="/compare?a=${t.id}">Compare →</a></div>` : `<p class="note">An interactive experience isn’t available for this theory yet.</p><a class="ul" href="/compare?a=${t.id}">Compare →</a>`}</div>`;

      panel.classList.add('open');
      panel.scrollTop = 0;
      hov = null;

      const closeBtn = panel.querySelector<HTMLButtonElement>('.close');
      if (closeBtn) closeBtn.onclick = closePanel;
      panel.querySelectorAll<HTMLButtonElement>('.rel-list button').forEach(b => {
        b.onclick = () => {
          if (b.dataset.id) select(b.dataset.id);
        };
      });

      center(id);
      render();
      if (focusPanel && closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function closePanel() {
      if (!panel.classList.contains('open')) return;
      const had = panel.contains(document.activeElement);
      panel.classList.remove('open');
      sel = null;
      render();
      if (had && lastFocus) lastFocus.focus({ preventScroll: true });
    }

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        res.hidden = true;
        closePanel();
      }
    };
    document.addEventListener('keydown', keyHandler);

    qi.oninput = () => {
      q = qi.value.trim().toLowerCase();
      const M = matches();
      res.innerHTML = M.slice(0, 6).map(t => `<li><button data-id="${t.id}">${t.n}</button></li>`).join('');
      res.hidden = !M.length;
      res.querySelectorAll<HTMLButtonElement>('button').forEach(b => {
        b.onclick = () => {
          if (b.dataset.id) {
            qi.value = byId[b.dataset.id].n;
            q = '';
            res.hidden = true;
            select(b.dataset.id);
          }
        };
      });
      if (M.length === 1) center(M[0].id);
      render();
    };

    qi.onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const M = matches();
        if (M.length) {
          q = '';
          qi.value = M[0].n;
          res.hidden = true;
          select(M[0].id);
        }
      }
    };

    qi.onblur = () => setTimeout(() => { res.hidden = true; }, 150);

    const resizeHandler = () => fit(false);
    window.addEventListener('resize', resizeHandler);

    fit(false);
    render();

    return () => {
      document.removeEventListener('keydown', keyHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  });
</script>

<svelte:head>
  <title>Theory Map — TheoryLab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

<nav aria-label="Primary">
  <a class="logo" href="/">TheoryLab<i>.</i></a>
  <div class="links">
    <a href="/">Home</a>
    <a href="/explore">Explore</a>
    <a class="cur" href="/map" aria-current="page">Theory Map</a>
    <a href="/compare">Compare</a>
    <a href="/about">About</a>
  </div>
  <a class="cta" href="/explore">Get Started →</a>
</nav>

<section class="zone1" aria-label="Interactive theory map">
  <div class="intro">
    <div class="label">The Theory Map</div>
    <h1>See how ideas connect.</h1>
    <p>Explore the relationships between psychological and learning theories.</p>
  </div>
  
  <div class="bar">
    <div class="search">
      <input id="q" type="search" placeholder="Search theories" aria-label="Search theories" autocomplete="off">
      <ul class="results" id="res" hidden></ul>
    </div>
    <div class="pills" id="pills" role="group" aria-label="Filter by category"></div>
    <div class="tools">
      <button id="zo" aria-label="Zoom out">−</button>
      <button id="zi" aria-label="Zoom in">+</button>
      <button class="rs" id="rs">Reset view</button>
    </div>
  </div>

  <div class="canvas" id="canvas">
    <svg id="map" role="group" aria-label="Network of theories. Tab between theories, Enter to open details.">
      <g id="world">
        <g id="edges"></g>
        <g id="nodes"></g>
        <g id="elabs"></g>
      </g>
    </svg>
    <div class="tip" id="tip"></div>
    <aside id="panel" aria-labelledby="pt"></aside>
  </div>

  <div class="foot">
    <div>
      <span><svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"/></svg>Theory</span>
      <span><svg width="30" height="6"><path d="M0 3H30" stroke="currentColor"/></svg>Relationship</span>
      <span><svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="9" cy="9" r="4.5" fill="currentColor"/></svg>Selected</span>
      <span><svg width="30" height="6"><path d="M0 3H30" stroke="currentColor" stroke-dasharray="6 4"/></svg>Challenges</span>
    </div>
    <em>More ideas will appear here as the library grows.</em>
  </div>
</section>

<section class="band">
  <div class="wrap two">
    <div>
      <div class="label">Reading the map</div>
      <h2>Relationships matter as much as definitions.</h2>
      <p class="sub">Seeing theories next to one another makes it easier to notice what they share, where they differ, and what questions each one is designed to address.</p>
    </div>
    <div class="rows">
      <div><b>EXTENDS</b><span>One theory builds on an existing idea.</span></div>
      <div><b>CHALLENGES</b><span>One perspective questions or reframes another.</span></div>
      <div><b>APPLIES TO</b><span>A theory offers a useful lens for a particular problem.</span></div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="label">Explore</div>
    <h2>Start with a theory.<br>Follow where it leads.</h2>
    <div class="steps">
      <div><em>01</em><p>Choose a theory</p></div>
      <div><em>02</em><p>Follow its connections</p></div>
      <div><em>03</em><p>Explore it in depth</p></div>
    </div>
  </div>
</section>

<section class="band final">
  <div class="wrap">
    <div class="label">Next</div>
    <h2>Found something you want to explore?</h2>
    <div class="btns">
      <a class="btn p" href="/explore">Explore this theory →</a>
      <a class="btn s" href="/compare">Compare theories →</a>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">TheoryLab. An academic atlas of psychological and learning theories.</div>
</footer>

<style>
  :global(:root) {
    --bg: #121826;
    --bg2: #1a2234;
    --ink: #f1ece2;
    --mute: #8e97a8;
    --line: #2a3345;
    --line2: #5b6477;
    --terra: #e07b62;
    --panel: #121826;
    box-sizing: border-box;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  :global(html) {
    scroll-padding-top: env(safe-area-inset-top, 0px);
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font: 400 15px/1.55 "DM Sans", system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    font-family: Newsreader, Georgia, serif;
    font-weight: 400;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .label {
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--terra);
    font-weight: 500;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  nav {
    position: sticky;
    top: env(safe-area-inset-top, 0px);
    z-index: 20;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(16px, 3vw, 40px);
    background: var(--bg);
    border-bottom: 1px solid var(--line);
  }

  .logo {
    font-family: Newsreader, Georgia, serif;
    font-size: 21px;
  }

  .logo i {
    color: var(--terra);
    font-style: normal;
  }

  .links {
    display: flex;
    gap: clamp(12px, 2vw, 28px);
    font-size: 13.5px;
    color: var(--mute);
  }

  .links a {
    padding: 4px 0;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }

  .links a.cur {
    color: var(--ink);
    border-color: var(--terra);
  }

  .links a:hover {
    color: var(--ink);
  }

  .cta {
    font-size: 13px;
    border: 1px solid var(--ink);
    padding: 7px 14px;
    border-radius: 2px;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }

  .cta:hover {
    background: var(--ink);
    color: var(--bg);
  }

  @media (max-width: 700px) {
    .links a:not(.cur) {
      display: none;
    }
    .links {
      flex: 1;
      justify-content: center;
    }
  }

  .zone1 {
    height: calc(100vh - 56px);
    min-height: 600px;
    display: flex;
    flex-direction: column;
    padding: 0 clamp(16px, 3vw, 40px);
  }

  .intro {
    padding: 16px 0 10px;
    display: flex;
    align-items: baseline;
    gap: clamp(12px, 3vw, 40px);
    flex-wrap: wrap;
  }

  .intro h1 {
    font-size: clamp(26px, 3.2vw, 38px);
    line-height: 1.1;
  }

  .intro p {
    margin: 0;
    color: var(--mute);
    font-size: 14px;
    flex: 1;
    min-width: 220px;
  }

  .intro .label {
    width: 100%;
    margin-bottom: -4px;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 28px);
    padding: 10px 0 12px;
    border-top: 1px solid var(--line);
    flex-wrap: wrap;
  }

  .search {
    position: relative;
  }

  .search input {
    width: 240px;
    font: inherit;
    font-size: 16px;
    color: var(--ink);
    background: none;
    border: 0;
    border-bottom: 1px solid var(--ink);
    padding: 8px 2px;
    border-radius: 0;
  }

  .search input::placeholder {
    color: var(--mute);
  }

  .search input:focus {
    outline: none;
    border-bottom-width: 2px;
  }

  .results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
    background: var(--bg2);
    border: 1px solid var(--line2);
    z-index: 8;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }

  :global(.results button) {
    display: block;
    width: 100%;
    text-align: left;
    font: inherit;
    font-size: 14px;
    color: var(--ink);
    background: none;
    border: 0;
    padding: 8px 10px;
    cursor: pointer;
  }

  :global(.results button:hover),
  :global(.results button:focus-visible) {
    background: var(--line);
    outline: none;
  }

  .pills {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    max-width: 100%;
    scrollbar-width: none;
  }

  .pills::-webkit-scrollbar {
    display: none;
  }

  :global(.pills button) {
    font: inherit;
    font-size: 15px;
    color: var(--mute);
    background: none;
    border: 1px solid transparent;
    border-radius: 2px;
    padding: 7px 12px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s, border-color 0.2s;
  }

  :global(.pills button i) {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
  }

  :global(.pills button:hover) {
    color: var(--ink);
  }

  :global(.pills button[aria-pressed="true"]) {
    color: var(--ink);
    border-color: var(--ink);
  }

  .tools {
    margin-left: auto;
    display: flex;
    gap: 18px;
    align-items: center;
  }

  .tools button {
    font: inherit;
    font-size: 15px;
    color: var(--ink);
    background: none;
    border: 0;
    cursor: pointer;
    padding: 4px 2px;
  }

  .tools .rs {
    border-bottom: 1px solid var(--ink);
  }

  button:focus-visible {
    outline: 2px solid var(--terra);
    outline-offset: 2px;
  }

  .canvas {
    position: relative;
    flex: 1;
    min-height: 0;
    border-top: 1px solid var(--line);
    overflow: hidden;
  }

  svg#map {
    width: 100%;
    height: 100%;
    display: block;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  :global(svg#map.drag) {
    cursor: grabbing;
  }

  :global(#world.anim) {
    transition: transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  :global(.edge) {
    stroke: var(--line2);
    stroke-width: 1.1;
    fill: none;
    opacity: 0.75;
    transition: opacity 0.2s, stroke 0.2s, stroke-width 0.2s;
  }

  :global(.edge.t-CHALLENGES) {
    stroke-dasharray: 6 4;
  }

  :global(.edge.t-APPLIES) {
    stroke-dasharray: 1.5 4;
    stroke-linecap: round;
  }

  :global(.edge.hi) {
    stroke: #ffffff;
    stroke-width: 2.4;
    opacity: 1;
  }

  :global(.edge.fade) {
    opacity: 0.18;
  }

  :global(.elab) {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  :global(.elab.hi) {
    opacity: 1;
  }

  :global(.elab rect) {
    fill: var(--bg);
    stroke: #ffffff;
    stroke-width: 1.3;
  }

  :global(.elab text) {
    font: italic 400 15px Newsreader, Georgia, serif;
    fill: #ffffff;
    text-anchor: middle;
  }

  :global(.node) {
    cursor: pointer;
    transition: opacity 0.2s;
    outline: none;
  }

  :global(.node .ring) {
    fill: var(--bg);
    stroke-width: 2.2;
  }

  :global(.node .halo) {
    fill: none;
    stroke-width: 1;
    opacity: 0;
    transition: opacity 0.2s;
  }

  :global(.node .nm) {
    font: 400 15px "DM Sans", sans-serif;
    fill: #d9d4ca;
    paint-order: stroke;
    stroke: var(--bg);
    stroke-width: 5px;
    stroke-linejoin: round;
    transition: fill 0.2s;
  }

  :global(.node.rel .nm) {
    fill: #ffffff;
  }

  :global(.node.on .nm) {
    fill: #ffffff;
    font-weight: 500;
  }

  :global(.node.on .ring) {
    stroke-width: 3.2;
  }

  :global(.node.on .halo) {
    opacity: 0.55;
  }

  :global(.node.on .dot) {
    r: 5;
  }

  :global(.node:focus-visible .halo) {
    opacity: 1;
    stroke: var(--terra);
    stroke-width: 2;
  }

  :global(.node.fade),
  :global(.node.mute) {
    opacity: 0.28;
  }

  :global(.node.mute.on),
  :global(.node.mute.rel) {
    opacity: 0.7;
  }

  .tip {
    position: absolute;
    width: 290px;
    background: var(--bg);
    border: 1px solid var(--ink);
    padding: 20px 22px;
    z-index: 5;
    pointer-events: none;
    display: none;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  }

  :global(.tip .label) {
    color: var(--terra);
    font-size: 11px;
  }

  :global(.tip h3) {
    font-size: 30px;
    line-height: 1.1;
    margin: 10px 0 8px;
  }

  :global(.tip p) {
    margin: 0 0 14px;
    color: #c9c4ba;
    font-size: 16px;
    line-height: 1.45;
  }

  :global(.tip b) {
    color: var(--terra);
    font-weight: 500;
  }

  #panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(420px, 100%);
    background: var(--bg);
    border-left: 1px solid var(--line);
    padding: 26px 34px;
    overflow-y: auto;
    transform: translateX(102%);
    transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
    z-index: 6;
    visibility: hidden;
    box-shadow: -12px 0 32px rgba(0,0,0,0.3);
  }

  :global(#panel.open) {
    transform: none;
    visibility: visible;
  }

  :global(#panel h2) {
    font-size: clamp(34px, 3.4vw, 48px);
    line-height: 1.05;
    margin: 12px 0 14px;
  }

  :global(.close) {
    position: absolute;
    top: 12px;
    right: 14px;
    font: inherit;
    font-size: 12px;
    color: var(--mute);
    background: none;
    border: 0;
    cursor: pointer;
    padding: 4px;
    transition: color 0.2s;
  }

  :global(.close:hover) {
    color: var(--ink);
  }

  :global(.pcat) {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mute);
    padding-right: 60px;
  }

  :global(.lead) {
    font-size: 19px;
    line-height: 1.5;
    color: #c9c4ba;
    margin: 0;
  }

  :global(.sec) {
    border-top: 1px solid var(--line);
    padding-top: 16px;
    margin-top: 22px;
  }

  :global(.sec .label) {
    color: var(--mute);
    margin-bottom: 8px;
  }

  :global(.sec p) {
    margin: 0;
    font-size: 15px;
    color: #c9c4ba;
  }

  :global(.rel-list) {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  :global(.rel-list button) {
    width: 100%;
    font: inherit;
    background: none;
    border: 0;
    border-bottom: 1px solid var(--line);
    padding: 13px 0;
    cursor: pointer;
    color: var(--ink);
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: baseline;
    text-align: left;
  }

  :global(.rel-list b) {
    font-weight: 700;
    font-size: 16px;
  }

  :global(.rel-list i) {
    font: italic 400 16px Newsreader, Georgia, serif;
    color: var(--mute);
    white-space: nowrap;
  }

  :global(.rel-list button:hover b) {
    text-decoration: underline;
  }

  :global(.note) {
    color: var(--mute);
    margin: 18px 0 6px;
  }

  :global(.btns) {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  :global(.btn) {
    display: inline-block;
    font: inherit;
    font-size: 15px;
    padding: 10px 18px;
    border: 1px solid var(--ink);
    border-radius: 2px;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }

  :global(.btn.p) {
    background: var(--ink);
    color: var(--bg);
  }

  :global(.btn.p:hover) {
    background: var(--terra);
    border-color: var(--terra);
    color: var(--ink);
  }

  :global(.btn.s:hover) {
    background: var(--bg2);
  }

  :global(.ul) {
    font-weight: 700;
    font-size: 20px;
    border-bottom: 2px solid var(--terra);
    padding-bottom: 3px;
    display: inline-block;
    margin-top: 6px;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    border-top: 1px solid var(--line);
    padding: 12px 0 14px;
    font-size: 14px;
    color: var(--mute);
    flex-wrap: wrap;
  }

  .foot span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-right: 26px;
  }

  .foot em {
    font: italic 400 17px Newsreader, Georgia, serif;
  }

  @media (max-width: 700px) {
    .foot em {
      display: none;
    }
    .search input {
      width: 150px;
    }
    .tools {
      margin-left: 0;
    }
    .tip {
      display: none !important;
    }
    #panel {
      top: auto;
      width: 100%;
      height: 58%;
      border-left: 0;
      border-top: 1px solid var(--line2);
      transform: translateY(102%);
    }
    :global(#panel.open) {
      transform: none;
    }
  }

  .wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 40px);
  }

  .band {
    padding: clamp(64px, 10vw, 120px) 0;
    border-top: 1px solid var(--line);
  }

  .two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(32px, 6vw, 96px);
    align-items: start;
  }

  .band h2 {
    font-size: clamp(30px, 4vw, 48px);
    line-height: 1.1;
    margin: 12px 0 18px;
  }

  .band p.sub {
    color: var(--mute);
    max-width: 46ch;
    margin: 0;
  }

  .rows > div {
    border-top: 1px solid var(--line);
    padding: 22px 0;
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 16px;
    align-items: baseline;
  }

  .rows > div:last-child {
    border-bottom: 1px solid var(--line);
  }

  .rows b {
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.14em;
  }

  .rows span {
    font-family: Newsreader, Georgia, serif;
    font-size: 19px;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(20px, 4vw, 56px);
    margin-top: 48px;
  }

  .steps div {
    border-top: 1px solid var(--ink);
    padding-top: 14px;
  }

  .steps em {
    font: 400 13px system-ui, -apple-system, sans-serif;
    font-style: normal;
    color: var(--terra);
    letter-spacing: 0.1em;
  }

  .steps p {
    font-family: Newsreader, Georgia, serif;
    font-size: 24px;
    margin: 8px 0 0;
    line-height: 1.2;
  }

  .final {
    text-align: center;
  }

  .final h2 {
    max-width: 16ch;
    margin: 12px auto 30px;
  }

  .final .btns {
    justify-content: center;
  }

  footer {
    border-top: 1px solid var(--line);
    padding: 24px 0;
    font-size: 12.5px;
    color: var(--mute);
  }

  @media (max-width: 760px) {
    .two, .steps {
      grid-template-columns: 1fr;
    }
    .rows > div {
      grid-template-columns: 1fr;
      gap: 6px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      transition: none !important;
    }
  }
</style>