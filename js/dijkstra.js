function distance(n1, n2) {
	const dx = n1.x - n2.x,
		dy = n1.y - n2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function createPathfinder(graph, sourceId, targetId, mode = "dijkstra") {
	const open = new Map();
	const prev = new Map();
	const closed = new Set();
	const pq = new TinyPQ();

	open.set(sourceId, 0);
	pq.push({ id: sourceId, cost: 0 });

	function heuristic(id) {
		if (mode !== "astar") return 0;
		const n = graph.getNode(id);
		const t = graph.getNode(targetId);
		return distance(n, t);
	}

	return {
		step() {
			if (pq.size() === 0) return { done: true, path: null };

			const cur = pq.pop();
			if (closed.has(cur.id)) return { done: false };

			closed.add(cur.id);

			if (cur.id === targetId) {
				const path = [];
				let u = targetId;
				while (u !== undefined) {
					path.push(u);
					u = prev.get(u);
				}
				path.reverse();
				return { done: true, path };
			}

			const currentCost = open.get(cur.id) ?? Infinity;
			for (const nbr of graph.neighbors(cur.id)) {
				if (closed.has(nbr.id)) continue;
				const tentative = currentCost + nbr.w;

				if (tentative < (open.get(nbr.id) ?? Infinity)) {
					open.set(nbr.id, tentative);
					prev.set(nbr.id, cur.id);
					const priority = tentative + heuristic(nbr.id);
					pq.push({ id: nbr.id, cost: priority });
				}
			}

			return { done: false, visited: Array.from(closed) };
		},
	};
}
