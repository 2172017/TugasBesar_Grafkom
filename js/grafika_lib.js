import { clearCanvas, plotDot, drawLine, drawCircle } from "./grafika_lib.js";

export function render(graph, highlightPath = [], visited = [], sourceId = null, targetId = null) {
    clearCanvas();

    // Gambar edge
    for (const e of graph.edges) {
        const a = graph.getNode(e.a);
        const b = graph.getNode(e.b);

        let color = [120, 120, 120];
        if (highlightPath.includes(e.a) && highlightPath.includes(e.b)) color = [255, 215, 0];

        drawLine(a.x, a.y, b.x, b.y, color);
    }

    // Gambar node
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
