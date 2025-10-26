function setMode(m) {
	mode = m;
	btnAddNode.style.fontWeight = m === "addnode" ? "700" : "400";
	btnAddEdge.style.fontWeight = m === "addedge" ? "700" : "400";
	btnMove.style.fontWeight = m === "move" ? "700" : "400";
	btnDelete.style.fontWeight = m === "delete" ? "700" : "400";
}

function findEdgeNearPoint(x, y) {
	let best = null;
	let bestd = 999;
	graph.edges.forEach((e) => {
		const a = graph.getNode(e.a),
			b = graph.getNode(e.b);
		const d = pointToSegmentDistance({ x, y }, a, b);
		if (d < 8 && d < bestd) {
			bestd = d;
			best = e;
		}
	});
	return best;
}

function pointToSegmentDistance(p, a, b) {
	const A = p.x - a.x,
		B = p.y - a.y,
		C = b.x - a.x,
		D = b.y - a.y;
	const dot = A * C + B * D;
	const len_sq = C * C + D * D;
	let param = len_sq !== 0 ? dot / len_sq : -1;
	let xx, yy;
	if (param < 0) {
		xx = a.x;
		yy = a.y;
	} else if (param > 1) {
		xx = b.x;
		yy = b.y;
	} else {
		xx = a.x + param * C;
		yy = a.y + param * D;
	}
	const dx = p.x - xx,
		dy = p.y - yy;
	return Math.sqrt(dx * dx + dy * dy);
}

function logMsg(s) {
	log.textContent =
		new Date().toLocaleTimeString() + " — " + s + "\n" + log.textContent;
}

function render(highlightPath) {
	ctx.clearRect(0, 0, canvasKita.width, canvasKita.height);

	if (showHeat.checked && sourceId) {
		const maxd = Math.max(
			...graph.nodes.map((n) =>
				distance(graph.getNode(sourceId) || { x: 0, y: 0 }, n)
			)
		);
		graph.nodes.forEach((n) => {
			const d = distance(graph.getNode(sourceId) || { x: 0, y: 0 }, n);
			const t = Math.min(1, d / maxd);
			ctx.fillStyle = `rgba(${Math.floor(255 * t)},${Math.floor(
				255 * (1 - t)
			)},50,0.12)`;
			ctx.beginPath();
			ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
			ctx.fill();
		});
	}

	graph.edges.forEach((e) => {
		const a = graph.getNode(e.a),
			b = graph.getNode(e.b);
		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#888";
		ctx.stroke();
		const mx = (a.x + b.x) / 2,
			my = (a.y + b.y) / 2;
		ctx.font = "12px sans-serif";
		ctx.fillStyle = "#222";
		ctx.fillText(e.w.toFixed(0), mx + 6, my - 6);
	});

	if (highlightPath && highlightPath.length > 1) {
		ctx.strokeStyle = "#e53935";
		ctx.lineWidth = 4;
		ctx.beginPath();
		for (let i = 0; i < highlightPath.length - 1; i++) {
			const n1 = graph.getNode(highlightPath[i]),
				n2 = graph.getNode(highlightPath[i + 1]);
			ctx.moveTo(n1.x, n1.y);
			ctx.lineTo(n2.x, n2.y);
		}
		ctx.stroke();
	}

	graph.nodes.forEach((n) => {
		ctx.beginPath();
		ctx.arc(n.x, n.y, 12, 0, Math.PI * 2);
		ctx.fillStyle =
			n.id === sourceId ? "#2e7d32" : n.id === targetId ? "#1565c0" : "#fff";
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#222";
		ctx.stroke();
		ctx.fillStyle = "#000";
		ctx.font = "12px sans-serif";
		ctx.fillText(n.id, n.x - 4, n.y + 4);
	});
}

function distance(a, b) {
	const dx = a.x - b.x,
		dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}
