export function clearCanvas() {
    ctx.clearRect(0, 0, canvasKita.width, canvasKita.height);
}

export function drawSquare(imageData, x, y, size, r, g, b, canvas) {
	const half = size / 2;
	const x1 = x - half;
	const y1 = y - half;
	const x2 = x + half;
	const y2 = y + half;

	dda_line(imageData, x1, y1, x2, y1, r, g, b, canvas);
	dda_line(imageData, x2, y1, x2, y2, r, g, b, canvas);
	dda_line(imageData, x2, y2, x1, y2, r, g, b, canvas);
	dda_line(imageData, x1, y2, x1, y1, r, g, b, canvas);
}

export function gbr_titik(imageData, x, y, r, g, b, canvas) {
	if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
		const index = 4 * (Math.floor(x) + Math.floor(y) * canvas.width);
		imageData.data[index] = r;
		imageData.data[index + 1] = g;
		imageData.data[index + 2] = b;
		imageData.data[index + 3] = 255;
	}
}

export function dda_line(imageData, x1, y1, x2, y2, r, g, b, canvas) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (Math.abs(dx) > Math.abs(dy)) {
        let y = y1;
        const step = dy / Math.abs(dx);
        if (x2 > x1) {
            for (let x = x1; x < x2; x++) {
                y += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b, canvas);
            }
        } else {
            for (let x = x1; x >= x2; x--) {
                y += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b, canvas);
            }
        }
    } else {
        let x = x1;
        const step = dx / Math.abs(dy);
        if (y2 > y1) {
            for (let y = y1; y < y2; y++) {
                x += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b, canvas);
            }
        } else {
            for (let y = y1; y > y2; y--) {
                x += step;
                gbr_titik(imageData, Math.ceil(x), Math.ceil(y), r, g, b, canvas);
            }
        }
    }
}
