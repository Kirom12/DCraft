// Global
var FORM_INI = '#form-ini';

var tableIni = [];

// jQuery
$(function() {
	// EVENTS
	// Form submit
	$('#form-ini').submit(function(e) {
		e.preventDefault();

		initiative();
	});
});

function initiative() {
	// Require name AND roll OR bonus initiative
	if ((checkForm(FORM_INI, 'string',[0]))) {
		
		// If no roll -> auto-roll
		if ($('#form-ini input').eq(1).val() == "" || isNaN($('#form-ini input').eq(1).val())) {
			autoInitiative();
		}

		var inputsValues = getInputValue(FORM_INI, 4);
		var name = inputsValues[0];
		var roll = parseInt(inputsValues[1]);
		var bonus = (inputsValues[2] == "") ? 0 : parseInt(inputsValues[2]);
		var ca = inputsValues[3];
		var maxHp = inputsValues[4];
		
		var initiative = roll + bonus;

		var numberOccurence = 1;

		for (var i = tableIni.length - 1; i >= 0; i--) {
			if (tableIni[i][0].substring(0, tableIni[i][0].lastIndexOf(' ')) == name) {
				numberOccurence++;
			}
		}
		name += (numberOccurence === 1) ? ' <i>1</i>' : ' '+numberOccurence;

		tableIni.push([name,initiative,ca,maxHp]);

		tableIni = tableIni.sort(sortInitiative);

		//$('#initiative table tbody').prepend('<tr><td>0</td><td>'+name+'</td><td>'+initiative+'</td><td>'+ca+'</td><td>'+maxHp+'</td><td>'+maxHp+'</td></tr>');
		var htmlTbody;
		for (var i = tableIni.length-1; i >= 0; i--) {
			htmlTbody += '<tr><td>'+(i+1)+'</td><td>'+tableIni[i][0]+'</td><td>'+tableIni[i][1]+'</td><td>'+tableIni[i][2]+'</td><td>'+tableIni[i][3]+'</td><td>'+tableIni[i][3]+'</td><tr/>';
		}

		$('#initiative table tbody').html(htmlTbody);

		$('#form-ini input').eq(1).val('');
		$('#form-ini input').eq(1).focus();
	}
}

function autoInitiative() {
	$('#form-ini input').eq(1).val(d20());
}

function sortInitiative(a, b) {
	if (a[1] === b[1]) {
    	return 0;
	}
	else {
    	return (a[1] < b[1]) ? -1 : 1;
	}
}