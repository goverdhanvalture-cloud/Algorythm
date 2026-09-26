// Pure BFS step generator for binary trees using a FIFO queue.
export function bfsSteps(tree) {
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

  if (!tree || tree.root == null) return steps;

  push({
    type: 'start',
    what: `Start BFS from root node ${tree.root}.`,
    why: 'BFS explores the tree level by level using a first-in-first-out queue.',
    trace: { start: tree.root, queue: '[ ]' },
  });

  queue.push(tree.root);
  visited.add(tree.root);
  push({
    type: 'enqueue',
    current: tree.root,
    what: `Enqueue root node ${tree.root} and mark it discovered.`,
    why: 'Nodes enter the queue to be processed in order.',
    trace: { queue: `[ ${queue.join(', ')} ]` },
  });

  while (queue.length) {
    const nodeId = queue.shift();
    push({
      type: 'dequeue',
      current: nodeId,
      what: `Dequeue node ${nodeId} to process it.`,
      why: 'FIFO order guarantees nodes at the current level are handled before deeper levels.',
      trace: { current: nodeId, queue: `[ ${queue.join(', ')} ]` },
    });
    
    order.push(nodeId);
    push({
      type: 'visit',
      current: nodeId,
      what: `Add node ${nodeId} to the traversal order.`,
      why: 'This node is now fully processed.',
      trace: { order: order.join(' → ') },
    });

    const node = tree.nodes[nodeId];
    
    for (const childId of [node.left, node.right]) {
      if (childId != null) {
        push({
          type: 'compare',
          current: nodeId,
          exploreEdge: [nodeId, childId],
          what: `Look at child ${childId}.`,
          why: `We will enqueue it for later processing.`,
          trace: { edge: `${nodeId}–${childId}` },
        });
        
        visited.add(childId);
        queue.push(childId);
        push({
          type: 'enqueue',
          current: nodeId,
          exploreEdge: [nodeId, childId],
          what: `Enqueue ${childId}.`,
          why: 'It will be explored later, after everything currently in the queue.',
          trace: { queue: `[ ${queue.join(', ')} ]` },
        });
      }
    }
  }

  push({
    type: 'complete',
    what: `BFS complete. Order: ${order.join(' → ')}.`,
    why: 'The queue is empty, so every reachable node has been visited level by level.',
    trace: { order: order.join(' → ') },
  });
  
  return steps;
}
