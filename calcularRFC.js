/**
 * Represents the year input element for the date of birth.
 */
const yearElement = document.getElementById("ddyears");

/**
 * Sets the maximum year value for the date of birth input element.
 */
yearElement.setAttribute("max", new Date().getFullYear());

/**
 * Represents the result container for the RFC calculation.
 */
const resultElement = document.getElementById("result_rfc");

/**
 * Hide the result element initially.
 */
resultElement.style.opacity = 0;

/**
 * Copies the result of RFC calculation to the clipboard.
 */
async function copyRFCtoClipBoard() {
	const rfcResultElement = document.getElementById("rfc_result");
	if (rfcResultElement) {
		try {
			await navigator.clipboard.writeText(rfcResultElement.innerHTML);
			alert("Resultado copiado al portapapeles");
		} catch (err) {
			alert("Error al copiar texto: ", err);
		}
	} else {
		alert('Elemento con ID "rfc_result" no encontrado');
	}
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
function handleSubmit(event) {
	event.preventDefault();
	calculate();
}

/**
 * Represents the RFC form element.
 * @type {HTMLElement}
 */
var rfc_form = document.getElementById("rfc_form");

/** Attach the event listener to the RFC form. */
rfc_form.addEventListener("submit", function (event) {
	handleSubmit(event);

	/** Enable the repeat button after form submission. */
	repeat_button.disabled = false;
});

/**
 * Represents the repeat button element.
 * @type {HTMLElement}
 * */
var repeat_button = document.getElementById("repeatButton");

/** Initially disable the repeat button. */
repeat_button.setAttribute("disabled", "true");

/** Attach the event listener to the repeat button. */
repeat_button.addEventListener("click", repeat);

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) based on the provided input values.
 * @returns {boolean} Returns false.
 */
function calculate() {
	// Get the input values
	const $lastName1 = document.getElementById("ap_paterno").value.trim();
	const $lastName2 = document.getElementById("ap_materno").value.trim();
	const name = document.getElementById("nombre").value.trim();
	let day = document.getElementById("dddays").value.trim();

	// Add a leading zero to the day if it is less than 2 digits
	if (day.length < 2) {
		day = "0" + day;
	}
	const month = document.getElementById("ddmonths").value.trim();
	const year = yearElement.value.trim();

	// Validate the input values
	const birthday = year.slice(-2) + month + day;

	// Filter the input values
	let filteredLastName1 = RFCFiltraAcentos($lastName1.toLowerCase());
	let filteredLastName2 = RFCFiltraAcentos($lastName2.toLowerCase());
	let filteredName = RFCFiltraAcentos(name.toLowerCase());

	const lastName1_old = filteredLastName1;
	const lastName2_old = filteredLastName2;
	const name_old = filteredName;

	filteredLastName1 = RFCFiltraNombres(filteredLastName1);
	filteredLastName2 = RFCFiltraNombres(filteredLastName2);
	filteredName = RFCFiltraNombres(filteredName);

	// Calculate the RFC
	let rfc = "";
	if (filteredLastName1 && filteredLastName2) {
		rfc =
			filteredLastName1.length < 3
				? RFCApellidoCorto(
						filteredLastName1,
						filteredLastName2,
						filteredName
				  )
				: RFCArmalo(filteredLastName1, filteredLastName2, filteredName);
	}
	if (!filteredLastName1 && filteredLastName2) {
		rfc = RFCUnApellido(filteredName, filteredLastName2);
	}
	if (filteredLastName1 && !filteredLastName2) {
		rfc = RFCUnApellido(filteredName, filteredLastName1);
	}

	rfc = RFCQuitaProhibidas(rfc);
	rfc = (
		rfc +
		birthday +
		homonimia(lastName1_old, lastName2_old, name_old)
	).toUpperCase();
	rfc = RFCDigitoVerificador(rfc);

	// Display the result
	document.getElementById(
		"name_rfc"
	).textContent = `${$lastName1.toUpperCase()} ${$lastName2.toUpperCase()} ${name.toUpperCase()}`;
	document.getElementById("dob_rfc").textContent = `${day}/${month}/${year}`;
	document.getElementById("rfc_result").textContent = rfc;

	// Hide the form and display the result
	fadeInElement("result_rfc");
	fadeOutElement("rfc_form_div");

	// Scroll to the result section on small screens
	if (window.innerWidth < 400) {
		if (resultElement) {
			const targetPosition = targetDiv.offsetTop;
			window.scrollTo({ top: targetPosition, behavior: "smooth" });
		}
	}
	return false;
}

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) digit verifier for a given RFC.
 * @param {string} rfc - The RFC to calculate the digit verifier for.
 * @returns {string} - The RFC with the digit verifier appended.
 */
function RFCDigitoVerificador(rfc) {
	var rfcsuma = [];
	var nv = 0;
	var y = 0;
	for (i = 0; i <= rfc.length; i++) {
		var letra = rfc.substr(i, 1);
		switch (letra) {
			case "0":
				rfcsuma.push("00");
				break;
			case "1":
				rfcsuma.push("01");
				break;
			case "2":
				rfcsuma.push("02");
				break;
			case "3":
				rfcsuma.push("03");
				break;
			case "4":
				rfcsuma.push("04");
				break;
			case "5":
				rfcsuma.push("05");
				break;
			case "6":
				rfcsuma.push("06");
				break;
			case "7":
				rfcsuma.push("07");
				break;
			case "8":
				rfcsuma.push("08");
				break;
			case "9":
				rfcsuma.push("09");
				break;
			case "A":
				rfcsuma.push("10");
				break;
			case "B":
				rfcsuma.push("11");
				break;
			case "C":
				rfcsuma.push("12");
				break;
			case "D":
				rfcsuma.push("13");
				break;
			case "E":
				rfcsuma.push("14");
				break;
			case "F":
				rfcsuma.push("15");
				break;
			case "G":
				rfcsuma.push("16");
				break;
			case "H":
				rfcsuma.push("17");
				break;
			case "I":
				rfcsuma.push("18");
				break;
			case "J":
				rfcsuma.push("19");
				break;
			case "K":
				rfcsuma.push("20");
				break;
			case "L":
				rfcsuma.push("21");
				break;
			case "M":
				rfcsuma.push("22");
				break;
			case "N":
				rfcsuma.push("23");
				break;
			case "&":
				rfcsuma.push("24");
				break;
			case "O":
				rfcsuma.push("25");
				break;
			case "P":
				rfcsuma.push("26");
				break;
			case "Q":
				rfcsuma.push("27");
				break;
			case "R":
				rfcsuma.push("28");
				break;
			case "S":
				rfcsuma.push("29");
				break;
			case "T":
				rfcsuma.push("30");
				break;
			case "U":
				rfcsuma.push("31");
				break;
			case "V":
				rfcsuma.push("32");
				break;
			case "W":
				rfcsuma.push("33");
				break;
			case "X":
				rfcsuma.push("34");
				break;
			case "Y":
				rfcsuma.push("35");
				break;
			case "Z":
				rfcsuma.push("36");
				break;
			case " ":
				rfcsuma.push("37");
				break;
			case "Ã‘":
				rfcsuma.push("38");
				break;
			default:
				rfcsuma.push("00");
		}
	}
	for (i = 13; i > 1; i--) {
		nv = nv + rfcsuma[y] * i;
		y++;
	}
	nv = nv % 11;
	if (nv == 0) {
		rfc = rfc + nv;
	} else if (nv <= 10) {
		nv = 11 - nv;
		if (nv == "10") {
			nv = "A";
		}
		rfc = rfc + nv;
	} else if (nv == "10") {
		nv = "A";
		rfc = rfc + nv;
	}
	return rfc;
}

/**
 * Removes prohibited words from an RFC (Registro Federal de Contribuyentes) string.
 * @param {string} rfc - The RFC string to be processed.
 * @returns {string} - The processed RFC string with prohibited words replaced by "X".
 */
function RFCQuitaProhibidas(rfc) {
	var res;
	rfc = rfc.toUpperCase();
	var strPalabras = "BUEI*BUEY*CACA*CACO*CAGA*CAGO*CAKA*CAKO*COGE*COJA*";
	strPalabras = strPalabras + "KOGE*KOJO*KAKA*KULO*MAME*MAMO*MEAR*";
	strPalabras = strPalabras + "MEAS*MEON*MION*COJE*COJI*COJO*CULO*";
	strPalabras = strPalabras + "FETO*GUEY*JOTO*KACA*KACO*KAGA*KAGO*";
	strPalabras = strPalabras + "MOCO*MULA*PEDA*PEDO*PENE*PUTA*PUTO*";
	strPalabras = strPalabras + "QULO*RATA*RUIN*";
	res = strPalabras.match(rfc);
	if (res != null) {
		rfc = rfc.substr(0, 3) + "X";
		return rfc;
	} else {
		return rfc;
	}
}

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) using the first two letters of the last name and first name.
 * @param {string} nombre - The first name.
 * @param {string} apellido - The last name.
 * @returns {string} The calculated RFC.
 */
function RFCUnApellido(nombre, apellido) {
	var rfc = apellido.substr(0, 2) + nombre.substr(0, 2);
	return rfc;
}

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) based on the given parameters.
 * @param {string} ap_paterno - The paternal last name.
 * @param {string} ap_materno - The maternal last name.
 * @param {string} nombre - The first name.
 * @returns {string} The calculated RFC.
 */
function RFCArmalo(ap_paterno, ap_materno, nombre) {
	var strVocales = "aeiou";
	var strPrimeraVocal = "";
	var i = 0;
	var x = 0;
	var y = 0;
	for (i = 1; i <= ap_paterno.length; i++) {
		if (y == 0) {
			for (x = 0; x <= strVocales.length; x++) {
				if (ap_paterno.substr(i, 1) == strVocales.substr(x, 1)) {
					y = 1;
					strPrimeraVocal = ap_paterno.substr(i, 1);
				}
			}
		}
	}
	var rfc =
		ap_paterno.substr(0, 1) +
		strPrimeraVocal +
		ap_materno.substr(0, 1) +
		nombre.substr(0, 1);
	return rfc;
}

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) using the first character of the paternal and maternal surnames,
 * and the first two characters of the given name.
 * @param {string} ap_paterno - The paternal surname.
 * @param {string} ap_materno - The maternal surname.
 * @param {string} nombre - The given name.
 * @returns {string} The calculated RFC.
 */
function RFCApellidoCorto(ap_paterno, ap_materno, nombre) {
	var rfc =
		ap_paterno.substr(0, 1) + ap_materno.substr(0, 1) + nombre.substr(0, 2);
	return rfc;
}

/**
 * Removes specified words and prefixes from a given text to calculate RFC.
 * @param {string} strTexto - The input text.
 * @returns {string} - The modified text after filtering.
 */
function RFCFiltraNombres(strTexto) {
	var i = 0;
	var strArPalabras = [
		".",
		",",
		"de ",
		"del ",
		"la ",
		"los ",
		"las ",
		"y ",
		"mc ",
		"mac ",
		"von ",
		"van ",
	];
	for (i = 0; i <= strArPalabras.length; i++) {
		strTexto = strTexto.replace(strArPalabras[i], "");
	}
	strArPalabras = ["jose ", "maria ", "j ", "ma "];
	for (i = 0; i <= strArPalabras.length; i++) {
		strTexto = strTexto.replace(strArPalabras[i], "");
	}
	switch (strTexto.substr(0, 2)) {
		case "ch":
			strTexto = strTexto.replace("ch", "c");
			break;
		case "ll":
			strTexto = strTexto.replace("ll", "l");
			break;
	}
	return strTexto;
}

/**
 * Removes accents from a given string.
 * @param {string} strTexto - The input string with accents.
 * @returns {string} - The input string with accents removed.
 */
function RFCFiltraAcentos(strTexto) {
	strTexto = strTexto.replace("Ã¡", "a");
	strTexto = strTexto.replace("Ã©", "e");
	strTexto = strTexto.replace("Ã­", "i");
	strTexto = strTexto.replace("Ã³", "o");
	strTexto = strTexto.replace("Ãº", "u");
	return strTexto;
}

/**
 * Calculates the homonimia value based on the given last name, middle name, and first name.
 *
 * @param {string} ap_paterno - The last name.
 * @param {string} ap_materno - The middle name.
 * @param {string} nombre - The first name.
 * @returns {string} The homonimia value.
 */
function homonimia(ap_paterno, ap_materno, nombre) {
	var nombre_completo =
		ap_paterno.trim() + " " + ap_materno.trim() + " " + nombre.trim();
	var numero = "0";
	var letra;
	var numero1;
	var numero2;
	var numeroSuma = 0;
	for (i = 0; i <= nombre_completo.length; i++) {
		letra = nombre_completo.substr(i, 1);
		switch (letra) {
			case "Ã±":
				numero = numero + "10";
				break;
			case "Ã¼":
				numero = numero + "10";
				break;
			case "a":
				numero = numero + "11";
				break;
			case "b":
				numero = numero + "12";
				break;
			case "c":
				numero = numero + "13";
				break;
			case "d":
				numero = numero + "14";
				break;
			case "e":
				numero = numero + "15";
				break;
			case "f":
				numero = numero + "16";
				break;
			case "g":
				numero = numero + "17";
				break;
			case "h":
				numero = numero + "18";
				break;
			case "i":
				numero = numero + "19";
				break;
			case "j":
				numero = numero + "21";
				break;
			case "k":
				numero = numero + "22";
				break;
			case "l":
				numero = numero + "23";
				break;
			case "m":
				numero = numero + "24";
				break;
			case "n":
				numero = numero + "25";
				break;
			case "Ã±":
				numero = numero + "40";
				break;
			case "o":
				numero = numero + "26";
				break;
			case "p":
				numero = numero + "27";
				break;
			case "q":
				numero = numero + "28";
				break;
			case "r":
				numero = numero + "29";
				break;
			case "s":
				numero = numero + "32";
				break;
			case "t":
				numero = numero + "33";
				break;
			case "u":
				numero = numero + "34";
				break;
			case "v":
				numero = numero + "35";
				break;
			case "w":
				numero = numero + "36";
				break;
			case "x":
				numero = numero + "37";
				break;
			case "y":
				numero = numero + "38";
				break;
			case "z":
				numero = numero + "39";
				break;
			case " ":
				numero = numero + "00";
				break;
		}
	}
	for (i = 0; i <= numero.length + 1; i++) {
		numero1 = numero.substr(i, 2);
		numero2 = numero.substr(i + 1, 1);
		numeroSuma = numeroSuma + numero1 * numero2;
	}
	var numero3 = numeroSuma % 1000;
	var numero4 = numero3 / 34;
	var numero5 = numero4.toString().split(".")[0];
	var numero6 = numero3 % 34;
	var homonimio = "";

	switch (numero5) {
		case "0":
			homonimio = "1";
			break;
		case "1":
			homonimio = "2";
			break;
		case "2":
			homonimio = "3";
			break;
		case "3":
			homonimio = "4";
			break;
		case "4":
			homonimio = "5";
			break;
		case "5":
			homonimio = "6";
			break;
		case "6":
			homonimio = "7";
			break;
		case "7":
			homonimio = "8";
			break;
		case "8":
			homonimio = "9";
			break;
		case "9":
			homonimio = "A";
			break;
		case "10":
			homonimio = "B";
			break;
		case "11":
			homonimio = "C";
			break;
		case "12":
			homonimio = "D";
			break;
		case "13":
			homonimio = "E";
			break;
		case "14":
			homonimio = "F";
			break;
		case "15":
			homonimio = "G";
			break;
		case "16":
			homonimio = "H";
			break;
		case "17":
			homonimio = "I";
			break;
		case "18":
			homonimio = "J";
			break;
		case "19":
			homonimio = "K";
			break;
		case "20":
			homonimio = "L";
			break;
		case "21":
			homonimio = "M";
			break;
		case "22":
			homonimio = "N";
			break;
		case "23":
			homonimio = "P";
			break;
		case "24":
			homonimio = "Q";
			break;
		case "25":
			homonimio = "R";
			break;
		case "26":
			homonimio = "S";
			break;
		case "27":
			homonimio = "T";
			break;
		case "28":
			homonimio = "U";
			break;
		case "29":
			homonimio = "V";
			break;
		case "30":
			homonimio = "W";
			break;
		case "31":
			homonimio = "X";
			break;
		case "32":
			homonimio = "Y";
			break;
		case "33":
			homonimio = "Z";
			break;
	}
	switch (numero6.toString()) {
		case "0":
			homonimio = homonimio + "1";
			break;
		case "1":
			homonimio = homonimio + "2";
			break;
		case "2":
			homonimio = homonimio + "3";
			break;
		case "3":
			homonimio = homonimio + "4";
			break;
		case "4":
			homonimio = homonimio + "5";
			break;
		case "5":
			homonimio = homonimio + "6";
			break;
		case "6":
			homonimio = homonimio + "7";
			break;
		case "7":
			homonimio = homonimio + "8";
			break;
		case "8":
			homonimio = homonimio + "9";
			break;
		case "9":
			homonimio = homonimio + "A";
			break;
		case "10":
			homonimio = homonimio + "B";
			break;
		case "11":
			homonimio = homonimio + "C";
			break;
		case "12":
			homonimio = homonimio + "D";
			break;
		case "13":
			homonimio = homonimio + "E";
			break;
		case "14":
			homonimio = homonimio + "F";
			break;
		case "15":
			homonimio = homonimio + "G";
			break;
		case "16":
			homonimio = homonimio + "H";
			break;
		case "17":
			homonimio = homonimio + "I";
			break;
		case "18":
			homonimio = homonimio + "J";
			break;
		case "19":
			homonimio = homonimio + "K";
			break;
		case "20":
			homonimio = homonimio + "L";
			break;
		case "21":
			homonimio = homonimio + "M";
			break;
		case "22":
			homonimio = homonimio + "N";
			break;
		case "23":
			homonimio = homonimio + "P";
			break;
		case "24":
			homonimio = homonimio + "Q";
			break;
		case "25":
			homonimio = homonimio + "R";
			break;
		case "26":
			homonimio = homonimio + "S";
			break;
		case "27":
			homonimio = homonimio + "T";
			break;
		case "28":
			homonimio = homonimio + "U";
			break;
		case "29":
			homonimio = homonimio + "V";
			break;
		case "30":
			homonimio = homonimio + "W";
			break;
		case "31":
			homonimio = homonimio + "X";
			break;
		case "32":
			homonimio = homonimio + "Y";
			break;
		case "33":
			homonimio = homonimio + "Z";
			break;
	}
	return homonimio;
}

/**
 * Resets the form and clears the result elements for RFC calculation.
 */
function repeat() {
	document.getElementById("name_rfc").innerHTML = "---";
	document.getElementById("dob_rfc").innerHTML = "---";
	document.getElementById("rfc_result").textContent = "---";
	var rfc_form = document.getElementById("rfc_form");
	rfc_form.reset();
	fadeInElement("rfc_form_div");
	fadeOutElement("result_rfc");
}

/**
 * Fades in an element by changing its display and opacity properties.
 * @param {string} id - The id of the element to fade in.
 */
function fadeInElement(id) {
	var element = document.getElementById(id);
	element.style.display = "block";
	setTimeout(function () {
		element.style.opacity = 1;
	}, 10);
}

/**
 * Fades out an HTML element by changing its opacity and display property.
 * @param {string} id - The ID of the element to fade out.
 */
function fadeOutElement(id) {
	var element = document.getElementById(id);
	element.style.opacity = 0;
	element.style.display = "none";
}
