// Pure BFS step generator using a FIFO queue. Handles cycles via a visited set.
export function bfsSteps(graph, start) {
  const { adj } = graph;
  const steps = [];
  const visited = new Set();
  const order = [];
  const queue = [];

  const push = (s) =>
    steps.push({
      id: steps.length,
      visited: [...visited],
      order: [...order],
      queue: [...queue],
      current: s.current == null ? null : s.current,
      exploreEdge: s.exploreEdge || null,
      type: s.type,
      what: s.what,
      why: s.why,
      trace: s.trace || {},
    });

  push({
    type: 'start',
    what: `Start BFS from node ${start}.`,
    why: 'BFS explores the graph level by level using a first-in-first-out queue.',
    trace: { start, queue: '[ ]' },
  });

  queue.push(start);
  visited.add(start);
  push({
    type: 'enqueue',
    current: start,
    what: `Enqueue start node ${start} and mark it visited.`,
    why: 'Nodes are marked visited when they enter the queue so cycles never cause repeats.',
    trace: { queue: `[ ${queue.join(', ')} ]` },
  });

  while (queue.length) {
    const node = queue.shift();
    push({
      type: 'dequeue',
      current: node,
      what: `Dequeue node ${node} to process it.`,
      why: 'FIFO order guarantees nearer nodes are handled before farther ones.',
      trace: { current: node, queue: `[ ${queue.join(', ')} ]` },
    });
    order.push(node);
    push({
      type: 'visit',
      current: node,
      what: `Add node ${node} to the traversal order.`,
      why: 'This node is now fully processed.',
      trace: { order: order.join(' → ') },
    });

    for (const nb of adj[node] || []) {
      const seen = visited.has(nb);
      push({
        type: 'compare',
        current: node,
        exploreEdge: [node, nb],
        what: `Explore edge ${node} → ${nb}.`,
        why: seen
          ? `Node ${nb} is already visited, so we skip it — this is exactly how BFS handles cycles.`
          : `Node ${nb} is new, so we will enqueue it.`,
        trace: { edge: `${node}–${nb}`, neighbourVisited: seen },
      });
      if (!seen) {
        visited.add(nb);
        queue.push(nb);
        push({
          type: 'enqueue',
          current: node,
          exploreEdge: [node, nb],
          what: `Enqueue ${nb} and mark it visited.`,
          why: 'It will be explored later, after everything currently in the queue.',
          trace: { queue: `[ ${queue.join(', ')} ]` },
        });
      }
    }
  }

  push({
    type: 'complete',
    what: `BFS complete. Order: ${order.join(' → ')}.`,
    why: 'The queue is empty, so every reachable node has been visited.',
    trace: { order: order.join(' → ') },
  });
  return steps;
}
