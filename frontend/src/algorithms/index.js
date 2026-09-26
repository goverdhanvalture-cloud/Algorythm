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

export function parseCustomTree(text) {
  const trimmed = (text || '').trim();
  if (trimmed === '') return { values: [], error: null };
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  const values = [];
  for (const tok of tokens) {
    if (tok.toLowerCase() === 'null') {
      values.push(null);
    } else {
      if (!/^-?\d+$/.test(tok)) {
        return { values: null, error: `"${tok}" is not valid. Use numbers or "null".` };
      }
      values.push(Number(tok));
    }
  }
  return { values, error: null };
}

export function buildCustomTreeModel(values) {
  if (!values || values.length === 0 || values[0] === null) return { root: null, nodes: {} };
  
  const nodes = {};
  const rootId = values[0];
  
  // To avoid duplicates or track duplicates, we can assign unique string IDs if there are duplicate values.
  // But BFS/DFS visualize IDs, so let's use the index as ID and value for display, or just use value if unique.
  // The simplest is to assume values are unique node IDs as in existing presets.
  // Wait, if values are duplicate, a Set or dict will overwrite. Let's append index to make unique if necessary,
  // or just use values as IDs and warn if duplicate.
  
  const idMap = new Map();
  const getId = (val, idx) => {
    if (idMap.has(val)) {
      return `${val}_${idx}`;
    }
    idMap.set(val, true);
    return val;
  };

  const nodeRefs = [];
  
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== null) {
      const id = getId(values[i], i);
      nodeRefs[i] = id;
      nodes[id] = { id, left: null, right: null, x: 0, y: 0 };
    } else {
      nodeRefs[i] = null;
    }
  }

  // Connect left/right
  for (let i = 0; i < values.length; i++) {
    if (nodeRefs[i] !== null) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      if (leftIdx < values.length && nodeRefs[leftIdx] !== null) {
        nodes[nodeRefs[i]].left = nodeRefs[leftIdx];
      }
      if (rightIdx < values.length && nodeRefs[rightIdx] !== null) {
        nodes[nodeRefs[i]].right = nodeRefs[rightIdx];
      }
    }
  }

  // Assign coordinates (simple layout for max depth 4/5)
  // BFS to assign positions
  const levelOrder = [[nodeRefs[0], 0, 300, 50, 150]]; 
  while (levelOrder.length > 0) {
    const [id, depth, x, y, dx] = levelOrder.shift();
    if (id !== null && nodes[id]) {
      nodes[id].x = x;
      nodes[id].y = y;
      const nextDy = 70;
      if (nodes[id].left !== null) {
        levelOrder.push([nodes[id].left, depth + 1, x - dx, y + nextDy, dx / 2]);
      }
      if (nodes[id].right !== null) {
        levelOrder.push([nodes[id].right, depth + 1, x + dx, y + nextDy, dx / 2]);
      }
    }
  }

  return { root: nodeRefs[0], nodes };
}
