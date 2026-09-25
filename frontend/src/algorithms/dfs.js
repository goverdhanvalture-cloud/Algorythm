// Pure DFS step generator (recursive) exposing the call stack and backtracking.
export function dfsSteps(graph, start) {
  const { adj } = graph;
  const steps = [];
  const visited = new Set();
  const order = [];
  const stack = []; // current recursion path

  const push = (s) =>
    steps.push({
      id: steps.length,
      visited: [...visited],
      order: [...order],
      stack: [...stack],
      current: s.current == null ? null : s.current,
      exploreEdge: s.exploreEdge || null,
      type: s.type,
      what: s.what,
      why: s.why,
      trace: s.trace || {},
    });

  push({
    type: 'start',
    what: `Start DFS from node ${start}.`,
    why: 'DFS dives as deep as possible along a branch before backtracking, using the call stack.',
    trace: { start, stack: '[ ]' },
  });

  function dfs(node, parent) {
    visited.add(node);
    stack.push(node);
    order.push(node);
    push({
      type: 'visit',
      current: node,
      exploreEdge: parent == null ? null : [parent, node],
      what: `Visit node ${node} and push it onto the stack.`,
      why: 'We go deep first, marking nodes visited so cycles cannot cause infinite loops.',
      trace: { stack: `[ ${stack.join(', ')} ]`, order: order.join(' → ') },
    });

    for (const nb of adj[node] || []) {
      const seen = visited.has(nb);
      push({
        type: 'compare',
        current: node,
        exploreEdge: [node, nb],
        what: `Look at neighbour ${nb} of ${node}.`,
        why: seen
          ? `Node ${nb} is already visited → skip it (prevents looping on cycles).`
          : `Node ${nb} is unvisited → recurse deeper into it.`,
        trace: { edge: `${node}–${nb}`, neighbourVisited: seen },
      });
      if (!seen) {
        dfs(nb, node);
        push({
          type: 'visit',
          current: node,
          what: `Back at node ${node} after exploring ${nb}.`,
          why: 'We backtrack to continue with this node’s remaining neighbours.',
          trace: { stack: `[ ${stack.join(', ')} ]` },
        });
      }
    }

    stack.pop();
    push({
      type: 'dequeue',
      current: stack.length ? stack[stack.length - 1] : null,
      what: `Finished node ${node} — pop it off the stack (backtrack).`,
      why: 'All of its neighbours are explored, so we return to the previous node.',
      trace: { stack: `[ ${stack.join(', ')} ]` },
    });
  }

  dfs(start, null);
  push({
    type: 'complete',
    what: `DFS complete. Order: ${order.join(' → ')}.`,
    why: 'The stack is empty — all reachable nodes have been visited.',
    trace: { order: order.join(' → ') },
  });
  return steps;
}
