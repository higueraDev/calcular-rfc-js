/**
 * Represents the year input element for the date of birth.
 */
const $yearElement = document.getElementById("yearInput");

/**
 * Sets the maximum year value for the date of birth input element.
 */
$yearElement.setAttribute("max", new Date().getFullYear());

/**
 * Represents the element to show the result of the name.
 */
const $nameElement = document.getElementById("nameElement");

/**
 * Represents the element to show the result of the birthday.
 */
const $birthdayElement = document.getElementById("birthdayElement");

/**
 * Represents the element to show the result for the RFC calculation.
 */
const $resultElement = document.getElementById("resultElement");

/**
 * Represents the result container for the RFC calculation.
 */
const $resultWrapper = document.getElementById("resultWrapper");

/**
 * Hide the result section initially.
 */
$resultWrapper.style.opacity = 0;

/**
 * Represents the RFC form element.
 * @type {HTMLElement}
 */
const $dataForm = document.getElementById("dataForm");

/** Attach the event listener to the RFC form. */
$dataForm.addEventListener("submit", handleSubmit);

/**
 * Represents the repeat button element.
 * @type {HTMLElement}
 * */
const $repeatButton = document.getElementById("repeatButton");

/** Attach the event listener to the repeat button. */
$repeatButton.addEventListener("click", repeat);

/**
 * Copies the result of RFC calculation to the clipboard.
 */
async function copyRFCtoClipBoard() {
	if ($resultElement) {
		try {
			await navigator.clipboard.writeText($resultElement.innerHTML);
			alert("Resultado copiado al portapapeles");
		} catch (err) {
			alert("Error al copiar texto: ", err);
		}
	} else {
		alert('Elemento con ID "resultElement" no encontrado');
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
 * Calculates the RFC (Registro Federal de Contribuyentes) based on the provided input values.
 * @returns {boolean} Returns false.
 */
function calculate() {
	// Get the input values
	const $lastName1 = document.getElementById("lastName1Input").value.trim();
	const $lastName2 = document.getElementById("lastName2Input").value.trim();
	const $name = document.getElementById("nameInput").value.trim();
	let $day = document.getElementById("dayInput").value.trim();

	// Add a leading zero to the day if it is less than 2 digits
	if ($day.length < 2) {
		$day = "0" + $day;
	}
	const $month = document.getElementById("monthInput").value.trim();
	const year = $yearElement.value.trim();

	// Validate the input values
	const birthday = year.slice(-2) + $month + $day;

	// Filter the input values
	let filteredLastName1 = filterSpecialCharacters($lastName1.toLowerCase());
	let filteredLastName2 = filterSpecialCharacters($lastName2.toLowerCase());
	let filteredName = filterSpecialCharacters($name.toLowerCase());

	const lastName1_old = filteredLastName1;
	const lastName2_old = filteredLastName2;
	const name_old = filteredName;

	filteredLastName1 = filterName(filteredLastName1);
	filteredLastName2 = filterName(filteredLastName2);
	filteredName = filterName(filteredName);

	// Calculate the RFC
	let rfc = "";
	if (filteredLastName1 && filteredLastName2) {
		rfc =
			filteredLastName1.length < 3
				? shortLastName(
						filteredLastName1,
						filteredLastName2,
						filteredName
				  )
				: buildRFC(filteredLastName1, filteredLastName2, filteredName);
	}
	if (!filteredLastName1 && filteredLastName2) {
		rfc = uniqueLastName(filteredName, filteredLastName2);
	}
	if (filteredLastName1 && !filteredLastName2) {
		rfc = uniqueLastName(filteredName, filteredLastName1);
	}

	rfc = removeSwearWords(rfc);
	rfc = (
		rfc +
		birthday +
		getHomoClave(lastName1_old, lastName2_old, name_old)
	).toUpperCase();
	rfc = VerifierDigit(rfc);

	// Display the result
	$nameElement.textContent = `${$lastName1.toUpperCase()} ${$lastName2.toUpperCase()} ${$name.toUpperCase()}`;
	$birthdayElement.textContent = `${$day}/${$month}/${year}`;
	$resultElement.textContent = rfc;

	// Hide the form and display the result
	fadeInElement("resultWrapper");
	fadeOutElement("dataFormWrapper");

	// Scroll to the result section on small screens
	if (window.innerWidth < 400) {
		if ($resultWrapper) {
			const targetPosition = $resultWrapper.offsetTop;
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
function VerifierDigit(rfc) {
	let sum = [];
	let nv = 0;
	let y = 0;
	for (i = 0; i <= rfc.length; i++) {
		let letter = rfc.substr(i, 1);
		switch (letter) {
			case "0":
				sum.push("00");
				break;
			case "1":
				sum.push("01");
				break;
			case "2":
				sum.push("02");
				break;
			case "3":
				sum.push("03");
				break;
			case "4":
				sum.push("04");
				break;
			case "5":
				sum.push("05");
				break;
			case "6":
				sum.push("06");
				break;
			case "7":
				sum.push("07");
				break;
			case "8":
				sum.push("08");
				break;
			case "9":
				sum.push("09");
				break;
			case "A":
				sum.push("10");
				break;
			case "B":
				sum.push("11");
				break;
			case "C":
				sum.push("12");
				break;
			case "D":
				sum.push("13");
				break;
			case "E":
				sum.push("14");
				break;
			case "F":
				sum.push("15");
				break;
			case "G":
				sum.push("16");
				break;
			case "H":
				sum.push("17");
				break;
			case "I":
				sum.push("18");
				break;
			case "J":
				sum.push("19");
				break;
			case "K":
				sum.push("20");
				break;
			case "L":
				sum.push("21");
				break;
			case "M":
				sum.push("22");
				break;
			case "N":
				sum.push("23");
				break;
			case "&":
				sum.push("24");
				break;
			case "O":
				sum.push("25");
				break;
			case "P":
				sum.push("26");
				break;
			case "Q":
				sum.push("27");
				break;
			case "R":
				sum.push("28");
				break;
			case "S":
				sum.push("29");
				break;
			case "T":
				sum.push("30");
				break;
			case "U":
				sum.push("31");
				break;
			case "V":
				sum.push("32");
				break;
			case "W":
				sum.push("33");
				break;
			case "X":
				sum.push("34");
				break;
			case "Y":
				sum.push("35");
				break;
			case "Z":
				sum.push("36");
				break;
			case " ":
				sum.push("37");
				break;
			case "Ã‘":
				sum.push("38");
				break;
			default:
				sum.push("00");
		}
	}
	for (i = 13; i > 1; i--) {
		nv = nv + sum[y] * i;
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
function removeSwearWords(rfc) {
	let res;
	rfc = rfc.toUpperCase();
	let strWords = "BUEI*BUEY*CACA*CACO*CAGA*CAGO*CAKA*CAKO*COGE*COJA*";
	strWords = strWords + "KOGE*KOJO*KAKA*KULO*MAME*MAMO*MEAR*";
	strWords = strWords + "MEAS*MEON*MION*COJE*COJI*COJO*CULO*";
	strWords = strWords + "FETO*GUEY*JOTO*KACA*KACO*KAGA*KAGO*";
	strWords = strWords + "MOCO*MULA*PEDA*PEDO*PENE*PUTA*PUTO*";
	strWords = strWords + "QULO*RATA*RUIN*";
	res = strWords.match(rfc);
	if (res != null) {
		rfc = rfc.substr(0, 3) + "X";
		return rfc;
	} else {
		return rfc;
	}
}

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) using the first two letters of the last name and first name.
 * @param {string} name - The first name.
 * @param {string} lastName - The last name.
 * @returns {string} The calculated RFC.
 */
function uniqueLastName(name, lastName) {
	let rfc = lastName.substr(0, 2) + name.substr(0, 2);
	return rfc;
}

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) based on the given parameters.
 * @param {string} lastName1 - The paternal last name.
 * @param {string} lastName2 - The maternal last name.
 * @param {string} name - The first name.
 * @returns {string} The calculated RFC.
 */
function buildRFC(lastName1, lastName2, name) {
	let strVowels = "aeiou";
	let strFirstVowel = "";
	let i = 0;
	let x = 0;
	let y = 0;
	for (i = 1; i <= lastName1.length; i++) {
		if (y == 0) {
			for (x = 0; x <= strVowels.length; x++) {
				if (lastName1.substr(i, 1) == strVowels.substr(x, 1)) {
					y = 1;
					strFirstVowel = lastName1.substr(i, 1);
				}
			}
		}
	}
	let rfc =
		lastName1.substr(0, 1) +
		strFirstVowel +
		lastName2.substr(0, 1) +
		name.substr(0, 1);
	return rfc;
}

/**
 * Calculates the RFC (Registro Federal de Contribuyentes) using the first character of the paternal and maternal surnames,
 * and the first two characters of the given name.
 * @param {string} lastName1 - The paternal surname.
 * @param {string} lastName2 - The maternal surname.
 * @param {string} name - The given name.
 * @returns {string} The calculated RFC.
 */
function shortLastName(lastName1, lastName2, name) {
	let rfc =
		lastName1.substr(0, 1) + lastName2.substr(0, 1) + name.substr(0, 2);
	return rfc;
}

/**
 * Removes specified words and prefixes from a given text to calculate RFC.
 * @param {string} text - The input text.
 * @returns {string} - The modified text after filtering.
 */
function filterName(text) {
	let i = 0;
	let words = [
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
	for (i = 0; i <= words.length; i++) {
		text = text.replace(words[i], "");
	}
	words = ["jose ", "maria ", "j ", "ma "];
	for (i = 0; i <= words.length; i++) {
		text = text.replace(words[i], "");
	}
	switch (text.substr(0, 2)) {
		case "ch":
			text = text.replace("ch", "c");
			break;
		case "ll":
			text = text.replace("ll", "l");
			break;
	}
	return text;
}

/**
 * Removes accents from a given string.
 * @param {string} text - The input string with accents.
 * @returns {string} - The input string with accents removed.
 */
function filterSpecialCharacters(text) {
	text = text.replace("Ã¡", "a");
	text = text.replace("Ã©", "e");
	text = text.replace("Ã­", "i");
	text = text.replace("Ã³", "o");
	text = text.replace("Ãº", "u");
	return text;
}

/**
 * Calculates the homoclave value based on the given last name, middle name, and first name.
 *
 * @param {string} lastName1 - The last name.
 * @param {string} lastName2 - The middle name.
 * @param {string} name - The first name.
 * @returns {string} The homoclave value.
 */
function getHomoClave(lastName1, lastName2, name) {
	let fullName =
		lastName1.trim() + " " + lastName2.trim() + " " + name.trim();
	let number = "0";
	let letter;
	let number1;
	let number2;
	let sum = 0;
	for (i = 0; i <= fullName.length; i++) {
		letter = fullName.substr(i, 1);
		switch (letter) {
			case "Ã±":
				number = number + "10";
				break;
			case "Ã¼":
				number = number + "10";
				break;
			case "a":
				number = number + "11";
				break;
			case "b":
				number = number + "12";
				break;
			case "c":
				number = number + "13";
				break;
			case "d":
				number = number + "14";
				break;
			case "e":
				number = number + "15";
				break;
			case "f":
				number = number + "16";
				break;
			case "g":
				number = number + "17";
				break;
			case "h":
				number = number + "18";
				break;
			case "i":
				number = number + "19";
				break;
			case "j":
				number = number + "21";
				break;
			case "k":
				number = number + "22";
				break;
			case "l":
				number = number + "23";
				break;
			case "m":
				number = number + "24";
				break;
			case "n":
				number = number + "25";
				break;
			case "Ã±":
				number = number + "40";
				break;
			case "o":
				number = number + "26";
				break;
			case "p":
				number = number + "27";
				break;
			case "q":
				number = number + "28";
				break;
			case "r":
				number = number + "29";
				break;
			case "s":
				number = number + "32";
				break;
			case "t":
				number = number + "33";
				break;
			case "u":
				number = number + "34";
				break;
			case "v":
				number = number + "35";
				break;
			case "w":
				number = number + "36";
				break;
			case "x":
				number = number + "37";
				break;
			case "y":
				number = number + "38";
				break;
			case "z":
				number = number + "39";
				break;
			case " ":
				number = number + "00";
				break;
		}
	}
	for (i = 0; i <= number.length + 1; i++) {
		number1 = number.substr(i, 2);
		number2 = number.substr(i + 1, 1);
		sum = sum + number1 * number2;
	}
	let number3 = sum % 1000;
	let number4 = number3 / 34;
	let number5 = number4.toString().split(".")[0];
	let number6 = number3 % 34;
	let homoclave = "";

	switch (number5) {
		case "0":
			homoclave = "1";
			break;
		case "1":
			homoclave = "2";
			break;
		case "2":
			homoclave = "3";
			break;
		case "3":
			homoclave = "4";
			break;
		case "4":
			homoclave = "5";
			break;
		case "5":
			homoclave = "6";
			break;
		case "6":
			homoclave = "7";
			break;
		case "7":
			homoclave = "8";
			break;
		case "8":
			homoclave = "9";
			break;
		case "9":
			homoclave = "A";
			break;
		case "10":
			homoclave = "B";
			break;
		case "11":
			homoclave = "C";
			break;
		case "12":
			homoclave = "D";
			break;
		case "13":
			homoclave = "E";
			break;
		case "14":
			homoclave = "F";
			break;
		case "15":
			homoclave = "G";
			break;
		case "16":
			homoclave = "H";
			break;
		case "17":
			homoclave = "I";
			break;
		case "18":
			homoclave = "J";
			break;
		case "19":
			homoclave = "K";
			break;
		case "20":
			homoclave = "L";
			break;
		case "21":
			homoclave = "M";
			break;
		case "22":
			homoclave = "N";
			break;
		case "23":
			homoclave = "P";
			break;
		case "24":
			homoclave = "Q";
			break;
		case "25":
			homoclave = "R";
			break;
		case "26":
			homoclave = "S";
			break;
		case "27":
			homoclave = "T";
			break;
		case "28":
			homoclave = "U";
			break;
		case "29":
			homoclave = "V";
			break;
		case "30":
			homoclave = "W";
			break;
		case "31":
			homoclave = "X";
			break;
		case "32":
			homoclave = "Y";
			break;
		case "33":
			homoclave = "Z";
			break;
	}
	switch (number6.toString()) {
		case "0":
			homoclave = homoclave + "1";
			break;
		case "1":
			homoclave = homoclave + "2";
			break;
		case "2":
			homoclave = homoclave + "3";
			break;
		case "3":
			homoclave = homoclave + "4";
			break;
		case "4":
			homoclave = homoclave + "5";
			break;
		case "5":
			homoclave = homoclave + "6";
			break;
		case "6":
			homoclave = homoclave + "7";
			break;
		case "7":
			homoclave = homoclave + "8";
			break;
		case "8":
			homoclave = homoclave + "9";
			break;
		case "9":
			homoclave = homoclave + "A";
			break;
		case "10":
			homoclave = homoclave + "B";
			break;
		case "11":
			homoclave = homoclave + "C";
			break;
		case "12":
			homoclave = homoclave + "D";
			break;
		case "13":
			homoclave = homoclave + "E";
			break;
		case "14":
			homoclave = homoclave + "F";
			break;
		case "15":
			homoclave = homoclave + "G";
			break;
		case "16":
			homoclave = homoclave + "H";
			break;
		case "17":
			homoclave = homoclave + "I";
			break;
		case "18":
			homoclave = homoclave + "J";
			break;
		case "19":
			homoclave = homoclave + "K";
			break;
		case "20":
			homoclave = homoclave + "L";
			break;
		case "21":
			homoclave = homoclave + "M";
			break;
		case "22":
			homoclave = homoclave + "N";
			break;
		case "23":
			homoclave = homoclave + "P";
			break;
		case "24":
			homoclave = homoclave + "Q";
			break;
		case "25":
			homoclave = homoclave + "R";
			break;
		case "26":
			homoclave = homoclave + "S";
			break;
		case "27":
			homoclave = homoclave + "T";
			break;
		case "28":
			homoclave = homoclave + "U";
			break;
		case "29":
			homoclave = homoclave + "V";
			break;
		case "30":
			homoclave = homoclave + "W";
			break;
		case "31":
			homoclave = homoclave + "X";
			break;
		case "32":
			homoclave = homoclave + "Y";
			break;
		case "33":
			homoclave = homoclave + "Z";
			break;
	}
	return homoclave;
}

/**
 * Resets the form and clears the result elements for RFC calculation.
 */
function repeat() {
	$nameElement.innerHTML = "---";
	$birthdayElement.innerHTML = "---";
	$resultElement.innerHTML = "---";
	dataForm.reset();
	fadeInElement("dataFormWrapper");
	fadeOutElement("resultWrapper");
}

/**
 * Fades in an element by changing its display and opacity properties.
 * @param {string} id - The id of the element to fade in.
 */
function fadeInElement(id) {
	let element = document.getElementById(id);
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
	let element = document.getElementById(id);
	element.style.opacity = 0;
	element.style.display = "none";
}
