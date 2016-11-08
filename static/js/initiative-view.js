var h = 0;
var turnInfo = [];

$(function() {
	if (window.addEventListener) {
		window.addEventListener("storage", handleStorage, false);
	} else {
		window.attachEvent("onstorage", handleStorage);
	};
});

function handleStorage(e) {
	if (localStorage.getItem("DCraft-tableIni") !== null) {
			tableIni = JSON.parse(localStorage.getItem("DCraft-tableIni"));

			displayTable();
			h = 0;
	} else if ((localStorage.getItem("DCraft-turn") !== null)) {
		turnInfo = JSON.parse(localStorage.getItem("DCraft-turn"));
		currentTurn = turnInfo[0];
		setTurn(turnInfo[1]);
	}

	console.log('handleStorage');

	localStorage.removeItem("DCraft-tableIni");
	localStorage.removeItem("DCraft-turn");
}