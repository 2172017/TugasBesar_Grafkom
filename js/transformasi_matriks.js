function multiplyMatrix(m1, m2) {
	var hasil = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	];
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			for (var k = 0; k < 3; k++) {
				hasil[i][k] += m1[i][j] * m2[j][k];
			}
		}
	}
	return hasil;
}
function createTranslation(Tx, Ty) {
	return [
		[1, 0, Tx],
		[0, 1, Ty],
		[0, 0, 1],
	];
}
function createRotation(theta) {
	return [
		[Math.cos(theta), -Math.sin(theta), 0],
		[Math.sin(theta), Math.cos(theta), 0],
		[0, 0, 1],
	];
}
function rotation_fp(xc, yc, theta) {
	var m1 = createTranslation(-xc, -yc);
	var m2 = createRotation(theta);
	var m3 = createTranslation(xc, yc);
	var hasil = multiplyMatrix(m3, m2);
	hasil = multiplyMatrix(hasil, m1);
	return hasil;
}
function transform_titik(titik_lama, m) {
	var xbaru = m[0][0] * titik_lama.x + m[0][1] * titik_lama.y + m[0][2] * 1;
	var ybaru = m[1][0] * titik_lama.x + m[1][1] * titik_lama.y + m[1][2] * 1;
	return { x: xbaru, y: ybaru };
}
function transform_array(array_titik, m) {
	var hasil = [];
	for (var i = 0; i < array_titik.length; i++) {
		out.push(transform_titik(array_titik[i], m));
	}
	return hasil;
}
