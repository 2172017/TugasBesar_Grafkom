function render( //redraw canvas
	graph,
	highlightPath = [],
	visited = [],
	sourceId = null,
	targetId = null
) {
	clearCanvas(); 

	for (const e of graph.edges) {
		const a = graph.getNode(e.a);
		const b = graph.getNode(e.b);

		let color = [120, 120, 120];
		if (highlightPath.includes(e.a) && highlightPath.includes(e.b))
			color = [255, 215, 0];

		drawLine(a.x, a.y, b.x, b.y, color);
	}

	for (const n of graph.nodes) {
		let color = [0, 150, 255];
		if (n.id === sourceId) color = [0, 255, 0];
		else if (n.id === targetId) color = [255, 0, 0];
		else if (visited.includes(n.id)) color = [255, 165, 0];
		else if (highlightPath.includes(n.id)) color = [255, 255, 0];
		drawCircle(n.x, n.y, 5, color);
	}
}

function clearCanvas() { //Hapus isi canvas
	ctx.clearRect(0, 0, canvasKita.width, canvasKita.height);
}

function drawCircle(xc, yc, r, color) {
	let x = 0;
	let y = r;
	let p = 1 - r;
	while (x <= y) {
		plotDot(xc + x, yc + y, color);
		plotDot(xc - x, yc + y, color);
		plotDot(xc + x, yc - y, color);
		plotDot(xc - x, yc - y, color);
		plotDot(xc + y, yc + x, color);
		plotDot(xc - y, yc + x, color);
		plotDot(xc + y, yc - x, color);
		plotDot(xc - y, yc - x, color);

		x++;
		if (p < 0) p += 2 * x + 1;
		else {
			y--;
			p += 2 * (x - y) + 1;
		}
	}
}

function gbr_titik(imageDataTemp, x, y, r, g, b) {
	var index;
	if (x > 0 && x < canvasKita.width && y > 0 && y < canvasKita.height) {
		index = 4 * (x + y * canvasKita.width);
		imageDataTemp.data[index] = r;
		imageDataTemp.data[index + 1] = g;
		imageDataTemp.data[index + 2] = b;
		imageDataTemp.data[index + 3] = 255;
	}
}
function lingkaran_polar(imageDataTemp, xc, yc, radius, r, g, b) {
	for (var theta = 0; theta < Math.PI * 2; theta += 0.01) {
		x = xc + radius * Math.cos(theta);
		y = yc + radius * Math.sin(theta);
		gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
	}
}
function ellipse_polar(imageDataTemp, xc, yc, radiusX, radiusY, r, g, b) {
	for (var theta = 0; theta < Math.PI * 2; theta += 0.01) {
		x = xc + radiusX * Math.cos(theta);
		y = yc + radiusY * Math.sin(theta);
		gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
	}
}
function gbr_lingkaran(imageDataTemp, xc, yc, radius, r, g, b) {
	for (var x = xc - radius; x < xc + radius; x++) {
		var y = yc - Math.sqrt(Math.pow(radius, 2) - Math.pow(x - xc, 2));
		gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
	}
}
function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	if (Math.abs(dx) > Math.abs(dy)) {
		if (x2 > x1) {
			var y = y1;
			for (var x = x1; x < x2; x++) {
				y = y + dy / Math.abs(dx);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		} else {
			var y = y1;
			for (var x = x1; x >= x2; x--) {
				y = y + dy / Math.abs(dx);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		}
	} else {
		if (y2 > y1) {
			var x = x1;
			for (var y = y1; y < y2; y++) {
				x = x + dx / Math.abs(dy);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		} else {
			var x = x1;
			for (var y = y1; y > y2; y--) {
				x = x + dx / Math.abs(dy);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		}
	}
}
function polyline(imageData, point_array, r, g, b) {
	var point = point_array[0];
	for (var i = 1; i < point_array.length; i++) {
		var point_2 = point_array[i];
		dda_line(imageData, point.x, point.y, point_2.x, point_2.y, r, g, b);
		point = point_2;
	}
}
function polygon(imageData, point_array, r, g, b) {
	var point = point_array[0];
	for (var i = 1; i < point_array.length; i++) {
		var point_2 = point_array[i];
		dda_line(imageData, point.x, point.y, point_2.x, point_2.y, r, g, b);
		point = point_2;
	}
	dda_line(
		imageData,
		point_array[0].x,
		point_array[0].y,
		point.x,
		point.y,
		r,
		g,
		b
	);
}
function floodFillNaive(imageData, canvas, x, y, toFlood, color) {
	var index = 4 * (x + y * canvas.width);
	var r1 = imageData.data[index];
	var g1 = imageData.data[index + 1];
	var b1 = imageData.data[index + 2];
	if (r1 == toFlood.r && g1 == toFlood.g && b1 == toFlood.b) {
		imageData.data[index] = color.r;
		imageData.data[index + 1] = color.g;
		imageData.data[index + 2] = color.b;
		imageData.data[index + 3] = 255;
	}
}
function floodFillStack(imageData, canvas, x, y, toFlood, color) {
	var tumpukan = [];
	tumpukan.push({ x: x, y: y });
	while (tumpukan.length > 0) {
		var titik_skrg = tumpukan.pop();
		var index_skrg = 4 * (titik_skrg.x + titik_skrg.y * canvas.width);
		var r1 = imageData.data[index_skrg];
		var g1 = imageData.data[index_skrg + 1];
		var b1 = imageData.data[index_skrg + 2];
		if (r1 == toFlood.r && g1 == toFlood.g && b1 == toFlood.b) {
			imageData.data[index_skrg] = color.r;
			imageData.data[index_skrg + 1] = color.g;
			imageData.data[index_skrg + 2] = color.b;
			imageData.data[index_skrg + 3] = 255;
			tumpukan.push({ x: titik_skrg.x + 1, y: titik_skrg.y });
			tumpukan.push({ x: titik_skrg.x - 1, y: titik_skrg.y });
			tumpukan.push({ x: titik_skrg.x, y: titik_skrg.y + 1 });
			tumpukan.push({ x: titik_skrg.x, y: titik_skrg.y - 1 });
		}
	}
}
