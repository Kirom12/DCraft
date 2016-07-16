/*
 *	@TODO
 *	Add notes
 *	Add second time name
 */

// Global
var FORM_INI = '#form-ini';

var tableIni = [];
var currentTurn = 0;
var idCreature = 0;

// jQuery
$(function() {
	// EVENTS
	// Form submit
	$('#form-ini').submit(function(e) {
		e.preventDefault();

		initiative();
		setKey();

		$('.input-hp').change(function() {
			setHP(this);
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
			if (tableIni[i][1].substring(0, tableIni[i][1].lastIndexOf(' ')) == name) {
				numberOccurence++;
			}
		}
		name += (numberOccurence === 1) ? ' <i>1</i>' : ' '+numberOccurence;

		// Add creature to the list
		tableIni.push([idCreature,name,initiative,ca,maxHp,maxHp]);

		// Sort all the table
		tableIni = tableIni.sort(sortInitiative);

		// Display the list
		var rowClass;
		var htmlTbody = '';
		for (var i = tableIni.length-1; i >= 0; i--) {
			// Set danger class if hp < 0
			rowClass = (tableIni[i][4] < 0) ? ' class="danger"' : '';
			htmlTbody += '<tr'+rowClass+'><td>'+(tableIni.length-i)+'</td><td>'+tableIni[i][1]+'</td><td>'+tableIni[i][2]+'</td><td>'+tableIni[i][3]+'</td><td><input type="text" class="input-hp" value="'+tableIni[i][4]+'"></td><td>'+tableIni[i][5]+'</td></tr>';
		}
		$('#initiative table tbody').html(htmlTbody);

		setTurn();

		idCreature++;

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

	currentTurn = 0;
	idCreature = 0;

	$('#form-ini input').eq(0).focus();
}

/*
 *	Set info class on the current player
 *
 *	@param bool reverse Change the direction
 */
function setTurn(reverse = false) {
	var tableRow = $('#initiative table tbody tr');
	var tableRowLength = $(tableRow).length;

	if (reverse) {
		$(tableRow).eq(currentTurn+1).removeClass('info');
	} else {
		$(tableRow).eq(currentTurn-1).removeClass('info');
	}

	// Skip turn if character is down
	while($(tableRow).eq(currentTurn).find('.input-hp').val() < 0) {
		if (reverse) {
			currentTurn--;
		} else {
			currentTurn++;
		}
	}

	// If round is over
	if (currentTurn == -1) {
		currentTurn = tableRowLength-1;
	} else if (currentTurn == tableRowLength) {
		currentTurn = 0;
	}

	$(tableRow).eq(currentTurn).addClass('info');
}

/*
 *	Set key for previous and next turn (B and N)
 */
function setKey() {
	$(document).off('keydown').on('keydown', function(e) {
		var focus = $('input').is(':focus');
		if (e.which == 78 && !focus) {
			currentTurn++;
			setTurn();
		}
		if (e.which == 66 && !focus) {
			currentTurn--;
			setTurn(true);
		}
	});
}

function setHP(input) {
	// Get the position in table
	var id = $(input).closest('tr').find('td').eq(0).text();
	id = tableIni.length-id;
	var hp = $(input).val();

	tableIni[id][4] = hp;

	if(parseInt($(input).val()) < 0) {
		$(input).closest('tr').addClass('danger');
	} else {
		$(input).closest('tr').removeClass('danger');
	}
}