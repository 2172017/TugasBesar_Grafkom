function gbr_titik(imageDataTemp, x, y, r, g, b) {
	if (x >= 0 && x < canvasKita.width && y >= 0 && y < canvasKita.height) {
		const index = 4 * (Math.floor(x) + Math.floor(y) * canvasKita.width);
		imageDataTemp.data[index] = r;
		imageDataTemp.data[index + 1] = g;
		imageDataTemp.data[index + 2] = b;
		imageDataTemp.data[index + 3] = 255;
	}
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	if (Math.abs(dx) > Math.abs(dy)) {
		if (x2 > x1) {
			var y = y1;
			for (var x = x1; x < x2; x++) {
				y += dy / Math.abs(dx);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		} else {
			var y = y1;
			for (var x = x1; x >= x2; x--) {
				y += dy / Math.abs(dx);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		}
	} else {
		if (y2 > y1) {
			var x = x1;
			for (var y = y1; y < y2; y++) {
				x += dx / Math.abs(dy);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		} else {
			var x = x1;
			for (var y = y1; y > y2; y--) {
				x += dx / Math.abs(dy);
				gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
			}
		}
	}
}

function lingkaran_polar(imageDataTemp, xc, yc, radius, r, g, b) {
	for (var theta = 0; theta < Math.PI * 2; theta += 0.02) {
		var x = xc + radius * Math.cos(theta);
		var y = yc + radius * Math.sin(theta);
		gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
	}
}

function polygon(imageData, point_array, r, g, b) {
	var p = point_array[0];
	for (var i = 1; i < point_array.length; i++) {
		var p2 = point_array[i];
		dda_line(imageData, p.x, p.y, p2.x, p2.y, r, g, b);
		p = p2;
	}
	dda_line(imageData, point_array[0].x, point_array[0].y, p.x, p.y, r, g, b);
}

function floodFillStack(imageData, canvas, x, y, toFlood, color) {
	var stack = [{ x: x, y: y }];
	while (stack.length > 0) {
		var t = stack.pop();
		var idx = 4 * (Math.floor(t.x) + Math.floor(t.y) * canvas.width);
		var r1 = imageData.data[idx],
			g1 = imageData.data[idx + 1],
			b1 = imageData.data[idx + 2];
		if (r1 === toFlood.r && g1 === toFlood.g && b1 === toFlood.b) {
			imageData.data[idx] = color.r;
			imageData.data[idx + 1] = color.g;
			imageData.data[idx + 2] = color.b;
			imageData.data[idx + 3] = 255;
			stack.push({ x: t.x + 1, y: t.y });
			stack.push({ x: t.x - 1, y: t.y });
			stack.push({ x: t.x, y: t.y + 1 });
			stack.push({ x: t.x, y: t.y - 1 });
		}
	}
}
