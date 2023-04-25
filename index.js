if (!navigator.serviceWorker.controller) {
	navigator.serviceWorker.register("/sw.js").then(function(reg) {
		console.log("Service worker has been registered for scope: " + reg.scope);
	});
}

// Checking local storage


const theme = localStorage.getItem("theme");
const font_size = localStorage.getItem("font-size");
const font_family = localStorage.getItem("font-family");
///////////////////////

const textarea = document.getElementById("notes");
const body = document.getElementById("body");

const theme_select = document.getElementById("theme-select");
const font_style_select = document.getElementById("font-style-select");
const font_size_select = document.getElementById("font-size-select");

let notes = localStorage.getItem("notes");
textarea.value = notes;

const menu = document.getElementById("menu");

let rotated = false;

function toggle() {
	if (rotated == false) {
		document.getElementById("menu-icon").style.animationName =
			"rotate-open";
		rotated = true;
	} else {
		document.getElementById("menu-icon").style.animationName =
			"rotate-close";
		rotated = false;
	}

	if (menu.style.display == "none" || menu.style.display == "") {
		menu.style.display = "inline-block";
	} else {
		menu.style.display = "none";
	}
}

function syncNotes() {
	notes = document.getElementById("notes").value;
	localStorage.setItem("notes", notes);
}

//////////////////////////////////////
// Handling themes
//////////////////////////////////////

function themeChange() {
	if (theme_select.value == "dark") {
		body.className = "body-dark";
		textarea.className = "textarea-dark";
		localStorage.setItem("theme", "dark");
	} else if (theme_select.value == "light") {
		body.className = "body-light";
		textarea.className = "textarea-light";
		localStorage.setItem("theme", "light");
	}
}

// Setting theme according to local storage
if (theme) {
	body.className = "body-" + theme;
	textarea.className = "textarea-" + theme;
	theme_select.value = theme;
}

//////////////////////////////////////////

// Handling font families

function fontFamilyChange() {
	body.style.fontFamily = font_style_select.value;
	textarea.style.fontFamily = font_style_select.value;
	localStorage.setItem("font-family", font_style_select.value);
}

if (font_family) {
	body.style.fontFamily = font_family;
	textarea.style.fontFamily = font_family;
	font_style_select.value = font_family;
}

////////////////////////////

// Handling font sizes

function fontSizeChange() {
	body.style.fontSize = font_size_select.value;
	textarea.style.fontSize = font_size_select.value;
	localStorage.setItem("font-size", font_size_select.value);
}

if (font_size) {
	body.style.fontSize = font_size;
	textarea.style.fontSize = font_size;
	font_size_select.value = font_size;
}

///////////////////////////
