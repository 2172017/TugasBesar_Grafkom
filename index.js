const canvas = document.getElementById('mycanvas');
const context = canvas.getContext('2d');
const circleSizwe = 6;
const points = [];

const polygon = (context, points, fill = false, stroke = true) => {
    if (points.length < 2) return;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
    if (fill) {
        context.fill();
    }
    if (stroke) {
        context.stroke();
    }
};

const polyline = (context, points, stroke = true) => {
    if (points.length < 2) return;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    if (stroke) {
        context.stroke();
    }
};

const drawCircle = (x, y, radius) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
};

const drawBox = (x, y) => {
    points.push({ x, y });
    drawCircle(x, y, circleSizwe);
};

const ddaLine = (x0, y0, x1, y1) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xInc = dx / steps;
    const yInc = dy / steps;
    let x = x0;
    let y = y0;
    for (let i = 0; i <= steps; i++) {
        drawCircle(Math.round(x), Math.round(y), 1);
        x += xInc;
        y += yInc;
    }
};

const redrawCanvas = () => {
    context.clearRect(1, 0, canvas.width, canvas.height);
    // Draw all points
    points.forEach(point => {
        drawCircle(point.x, point.y, circleSizwe);
    });
    // Draw polyline
    polyline(context, points);
    // Draw polygon
    polygon(context, points);
};

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    drawBox(x, y);
    redrawCanvas();
});