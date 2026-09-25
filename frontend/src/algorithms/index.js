// Input parsing + validation. Kept separate from UI and from algorithm logic.

export function parseArray(text) {
  const trimmed = (text || '').trim();
  if (trimmed === '') return { values: [], error: null };
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  const values = [];
  for (const tok of tokens) {
    if (!/^-?\d+$/.test(tok)) {
      return { values: null, error: `"${tok}" is not a valid integer. Use whole numbers separated by commas or spaces.` };
    }
    const num = Number(tok);
    if (!Number.isSafeInteger(num)) {
      return { values: null, error: `"${tok}" is out of the supported range.` };
    }
    values.push(num);
  }
  return { values, error: null };
}

export function isSorted(values) {
  for (let i = 1; i < values.length; i += 1) {
    if (values[i - 1] > values[i]) return false;
  }
  return true;
}

export function randomArray(size = 8) {
  const n = size || 8;
  return Array.from({ length: n }, () => Math.floor(Math.random() * 99) + 1);
}

// Parse an undirected edge list like "0-1, 1-2, 2-0".
export function parseGraph(text) {
  const trimmed = (text || '').trim();
  if (trimmed === '') return { edges: null, error: 'Enter at least one edge, e.g. 0-1, 1-2.' };
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  const edges = [];
  for (const tok of tokens) {
    const m = tok.match(/^(\d+)[-:>](\d+)$/);
    if (!m) {
      return { edges: null, error: `"${tok}" is not a valid edge. Use the form a-b, e.g. 0-1.` };
    }
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === b) {
      return { edges: null, error: `Self-loop "${tok}" is not supported. Use two different nodes.` };
    }
    edges.push([a, b]);
  }
  return { edges, error: null };
}

export function buildGraphModel(edges, presetPositions) {
  const nodeSet = new Set();
  edges.forEach(([a, b]) => {
    nodeSet.add(a);
    nodeSet.add(b);
  });
  const nodes = [...nodeSet].sort((x, y) => x - y);
  const adj = {};
  nodes.forEach((nd) => {
    adj[nd] = [];
  });
  edges.forEach(([a, b]) => {
    if (!adj[a].includes(b)) adj[a].push(b);
    if (!adj[b].includes(a)) adj[b].push(a);
  });
  Object.values(adj).forEach((list) => list.sort((x, y) => x - y));

  const positions = {};
  const cx = 300;
  const cy = 190;
  const r = 140;
  nodes.forEach((nd, i) => {
    if (presetPositions && presetPositions[nd]) {
      positions[nd] = presetPositions[nd];
    } else {
      const ang = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
      positions[nd] = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
    }
  });

  return { nodes, adj, edges, positions };
}
