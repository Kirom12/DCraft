/*
 *	@TODO
 *	Add 'dead' button on each line
 *	Add modification pv
 */

// Global
var FORM_INI = '#form-ini';

var tableIni = [];
var currentTurn = 0;

// jQuery
$(function() {
	// EVENTS
	// Form submit
	$('#form-ini').submit(function(e) {
		e.preventDefault();

		initiative();

		$(document).off('keydown').on('keydown', function(e) {
			var focus = $('input').is(':focus');
			if (e.which == 78 && !focus) {
				currentTurn++;
				setTurn();
				console.log('next');
			}
			if (e.which == 66 && !focus) {
				currentTurn--;
				setTurn(true);
			}
		});
	});

	$('#refresh-ini').on('click', function() {
		resetIniForm();
		$(document).off('keydown');
	});

	$('#next-turn').on('click', function() {
		currentTurn++;
		setTurn();
	});
	$('#prev-turn').on('click', function() {
		currentTurn--;
		setTurn(true);
	});
});

/*
 *	Get inputs, calculate initiative, sort and display in a html table
 */
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

		var htmlTbody = '';
		for (var i = tableIni.length-1; i >= 0; i--) {
			htmlTbody += '<tr><td>'+(tableIni.length-i)+'</td><td>'+tableIni[i][0]+'</td><td>'+tableIni[i][1]+'</td><td>'+tableIni[i][2]+'</td><td><input type="text" class="input-hp" value="'+tableIni[i][3]+'"></td><td>'+tableIni[i][3]+'</td></tr>';
		}

		$('#initiative table tbody').html(htmlTbody);

		setTurn();

		// Don't reset all the form for adding multiples créatures
		$('#form-ini input').eq(1).val('');
		$('#form-ini input').eq(0).focus();
	}
}

/*
 *	Set value in roll input
 */
function autoInitiative() {
	$('#form-ini input').eq(1).val(d20());
}

/*
 *	Reset form and table
 */
function resetIniForm() {
	for (var i = 0; i < 5; i++) {
		$('#form-ini input').eq(i).val('');
	}
	$('#initiative table tbody').html('');
	tableIni = [];

	$('#form-ini input').eq(0).focus();
}

function setTurn(reverse = false) {
	var tableColumn = $('#initiative table tbody tr');
	var tableColumnLength = $(tableColumn).length;

	if (reverse) {
		$(tableColumn).eq(currentTurn+1).removeClass('info');
	} else {
		$(tableColumn).eq(currentTurn-1).removeClass('info');
	}

	if (currentTurn == -1) {
		currentTurn = tableColumnLength-1;
	} else if (currentTurn == tableColumnLength) {
		currentTurn = 0;
	}

	$(tableColumn).eq(currentTurn).addClass('info');
}