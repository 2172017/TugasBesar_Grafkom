export function render(graph, highlightPath = [], visited = [], sourceId = null, targetId = null) {
    clearCanvas();

    for (const e of graph.edges) {
        const a = graph.getNode(e.a);
        const b = graph.getNode(e.b);

        let color = [120, 120, 120];
        if (highlightPath.includes(e.a) && highlightPath.includes(e.b)) color = [255, 215, 0];

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

export function clearCanvas() {
    ctx.clearRect(0, 0, canvasKita.width, canvasKita.height);
}

export function drawCircle(xc, yc, r, color) {
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

export function gbr_titik(imageDataTemp, x, y, r, g, b) {
    if (x > 0 && x < canvasKita.width && y > 0 && y < canvasKita.height) {
        const index = 4 * (x + y * canvasKita.width);
        imageDataTemp.data[index] = r;
        imageDataTemp.data[index + 1] = g;
        imageDataTemp.data[index + 2] = b;
        imageDataTemp.data[index + 3] = 255;
    }
}

export function lingkaran_polar(imageDataTemp, xc, yc, radius, r, g, b) {
    for (let theta = 0; theta < Math.PI * 2; theta += 0.01) {
        const x = xc + radius * Math.cos(theta);
        const y = yc + radius * Math.sin(theta);
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
    }
}

export function ellipse_polar(imageDataTemp, xc, yc, radiusX, radiusY, r, g, b) {
    for (let theta = 0; theta < Math.PI * 2; theta += 0.01) {
        const x = xc + radiusX * Math.cos(theta);
        const y = yc + radiusY * Math.sin(theta);
        gbr_titik(imageDataTemp, Math.ceil(x), Math.ceil(y), r, g, b);
    }
}

export function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (Math.abs(dx) > Math.abs(dy)) {
        let y = y1;
        const step = dy / Math.abs(dx);
        if (x2 > x1) {
            for (let x = x1; x < x2; x++) {
                y += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        } else {
            for (let x = x1; x >= x2; x--) {
                y += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        }
    } else {
        let x = x1;
        const step = dx / Math.abs(dy);
        if (y2 > y1) {
            for (let y = y1; y < y2; y++) {
                x += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        } else {
            for (let y = y1; y > y2; y--) {
                x += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b);
            }
        }
    }
}

export function polyline(imageData, point_array, r, g, b) {
    let point = point_array[0];
    for (let i = 1; i < point_array.length; i++) {
        const point_2 = point_array[i];
        dda_line(imageData, point.x, point.y, point_2.x, point_2.y, r, g, b);
        point = point_2;
	}
