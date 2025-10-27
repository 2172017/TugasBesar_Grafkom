function translasi(titik_lama, T) {
	var x_baru = titik_lama.x + T.x;
	var y_baru = titik_lama.y + T.y;

	return { x: x_baru, y: y_baru };
}

function penskalaan(titik_lama, S) {
	var x_baru = titik_lama.x * S.x;
	var y_baru = titik_lama.y * S.y;

	return { x: x_baru, y: y_baru };
}

function rotasi(titik_lama, sudut) {
	var x_baru = titik_lama.x * Math.cos(sudut) - titik_lama.y * Math.sin(sudut);
	var y_baru = titik_lama.x * Math.sin(sudut) + titik_lama.y * Math.cos(sudut);
	return { x: x_baru, y: y_baru };
}

function rotasi_fp(titik_lama, titik_putar, sudut) {
	var p1 = translasi(titik_lama, { x: -titik_putar.x, y: -titik_putar.y });
	var p2 = rotasi(p1, sudut);
	var p3 = translasi(p2, titik_putar);

	return p3;
}

function skala_fp(titik_lama, titik_putar, S) {
	var p1 = translasi(titik_lama, { x: -titik_putar.x, y: -titik_putar.y });
	var p2 = penskalaan(p1, S);
	var p3 = translasi(p2, titik_putar);

	return p3;
}

function rotasi_array(array_titik, titik_pusat, sudut) {
	var array_hasil = [];
	for (var i = 0; i < array_titik.length; i++) {
		var temp = rotasi_fp(array_titik[i], titik_pusat, sudut);
		array_hasil.push(temp);
	}
	return array_hasil;
}

function skala_array(array_titik, titik_pusat, S) {
	var array_hasil = [];
	for (var i = 0; i < array_titik.length; i++) {
		var temp = skala_fp(array_titik[i], titik_pusat, S);
		array_hasil.push(temp);
	}
	return array_hasil;
}

function translasi_array(array_titik, T) {
	var array_hasil = [];
	for (var i = 0; i < array_titik.length; i++) {
		var temp = translasi(array_titik[i], T);
		array_hasil.push(temp);
	}
	return array_hasil;
}
