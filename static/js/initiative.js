/*
 *	@TODO
 *	Correct when deleting a row
 */

// Global
var FORM_INI = '#form-ini';

var tableIni = [];
var round = 1;
var currentTurn = 0;
var idCreature = 0; // not use for now

var currentHideView = false;
var currentHideColumn = [false, false];

//Use for storage view
var turnStorage = [];

// jQuery
$(function() {
	// ***EVENTS***
	// Form submit
	$('#form-ini').submit(function(e) {
		e.preventDefault();

		initiative();
	});

	$('#refresh-ini').on('click', function() {
		resetIniForm();
		$(document).off('keydown');
	});

	// Turns
	$('#next-turn').on('click', function() {
		currentTurn++;
		setTurn();
	});
	$('#prev-turn').on('click', function() {
		currentTurn--;
		setTurn(true);
	});

	// **SHOW/HIDE**
	$('#display-name').on('click',toggleNameS);

	//Display minimal view
	$('#minimal-view').on('click', toggleMinimalView);

	$('#display-ca').on('click', function() {
		toggleElement(".table-ca", false, 0,this);
	});

	$('#display-note').on('click', function() {
		toggleElement(".table-note", false, 1,this);
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
		var note = '';
		
		var initiative = roll + bonus;

		var numberOccurence = 1;

		for (var i = tableIni.length - 1; i >= 0; i--) {
			if (tableIni[i][1].substring(0, tableIni[i][1].lastIndexOf(' ')) == name) {
				numberOccurence++;
			}
		}
		name += (numberOccurence === 1) ? ' <i>1</i>' : ' '+numberOccurence;

		// Add creature to the list
		tableIni.push([idCreature,name,initiative,ca,maxHp,maxHp, note]);

		//Save in the storage for view event
		saveInStorage("DCraft-tableIni", tableIni);

		// Display the list
		displayTable();

		//Init round 1 and set turn on first player
		setRound();

		idCreature++;

		// Don't reset all the form for adding multiples créatures
		$('#form-ini input').eq(1).val('');
		$('#form-ini input').eq(0).focus();
	}
}

function addFormEvent() {
	setKey();

	$('#initiative select').change(function() {
		modifyOrder(this);
	});

	// When modify HP
	$('.input-hp').change(function() {
		setHP(this);
	});
	// When modify note
	$('.input-note').change(function() {
		setNote(this);
	});
	// When delete a row
	$('.delete-creature').on('click', function() {
		deleteCreature(this);
	});
}

function displayTable() {
	var rowClass;
	var htmlTbody = "";
	var options = "";

	// Sort all the table
	tableIni = tableIni.sort(sortInitiative);

	for (var i = 1; i < tableIni.length+1; i++) {
		options += '<option value="'+i+'">'+i+'</option>';
	}

	for (var i = tableIni.length-1; i >= 0; i--) {
		// Set danger class if hp < 0
		rowClass = (tableIni[i][4] < 0) ? ' class="danger"' : '';
		htmlTbody += '<tr'+rowClass+' data-id="'+(tableIni.length-i)+'">'+
			'<td><select class=""><option value="'+(tableIni.length-i)+'">'+(tableIni.length-i)+'</option>'+options+'</select></td>'+
			'<td>'+tableIni[i][1]+'</td>'+
			'<td>'+tableIni[i][2]+'</td>'+
			'<td class="table-ca">'+tableIni[i][3]+'</td>'+
			'<td class="table-pv"><input type="text" class="input-hp" value="'+tableIni[i][4]+'"></td>'+
			'<td class="table-pv-total">'+tableIni[i][5]+'</td>'+
			'<td class="table-note"><input type="text" class="input-note" value="'+tableIni[i][6]+'"></td>'+
			'<td class="table-second-name">'+tableIni[i][1]+'</td>'+
			'<td class="table-delete"><button type="button" class="delete-creature btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i></button></td></tr>';
	}
	$('#initiative table tbody').html(htmlTbody);

	setTurn();
	addFormEvent();
	updateDisplay();
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

	// Reset round, turn and id
	round = 1;
	currentTurn = 0;
	idCreature = 0;
	setRound();

	$('#form-ini input').eq(0).focus();

	//Update the view
	saveInStorage("DCraft-tableIni", tableIni);
}

/*
 *	Set info class on the current player
 *
 *	@param bool reverse Change the direction
 */
function setTurn(reverse = false) {
	//Save in storage
	turnStorage = [currentTurn, reverse];
	saveInStorage("DCraft-turn", turnStorage);

	var tableRow = $('#initiative table tbody tr');
	var tableRowLength = $(tableRow).length;

	$(tableRow).each(function() {
		$(this).removeClass('info');
	});

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
		round--;
		setRound();
	} else if (currentTurn == tableRowLength) {
		currentTurn = 0;
		round++;
		setRound();
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

function modifyOrder(select) {
	var newPosition = Math.abs(($(select).val())-tableIni.length);
	var oldPosition =  Math.abs($(select).closest("tr").attr("data-id")-tableIni.length);

	//console.log(oldPosition);
	//console.log(newPosition);
	//console.log($(select).val());

	if (newPosition == oldPosition) {
		return;
	}

	for (i = tableIni.length-1; i >= 0; i--) {
		//console.log(tableIni[i][2]);
		if (i == newPosition) {
			if (newPosition <= oldPosition) {
				tableIni[oldPosition][2] = roundNb(tableIni[i][2]-0.1, 1);
			} else {
				tableIni[oldPosition][2] = roundNb(tableIni[i][2]-0.1, 1);
			}
			
			break;
		}
	}
	displayTable();

	//Update the view
	saveInStorage("DCraft-tableIni", tableIni);
}

/*
 *	Update table with input HP and set class danger if < 0
 *
 *	@param input Selected input
 */
function setHP(input) {
	// Get the position in table
	var id = getIdTable(input);
	var hp = $(input).val();

	console.log(hp);
	console.log(id);

	tableIni[id][4] = hp;

	if(parseInt($(input).val()) < 0) {
		$(input).closest('tr').addClass('danger');
	} else {
		$(input).closest('tr').removeClass('danger');
	}
}

/*
 *	Update table with note
 *
 *	@param input Selected input
 */
function setNote(input) {
	var id = getIdTable(input);
	var note = $(input).val();

	tableIni[id][6] = note;
}

function deleteCreature(input) {
	var id = getIdTable(input);
	
	tableIni.splice(id,1);

	displayTable();

	//Update the view
	saveInStorage("DCraft-tableIni", tableIni);
}

/*
 *	Display number of rounds
 */
function setRound() {
	$('#round').children().text(round);
}

/*
 *	Get id of a row from the current input
 *
 *	@param input
 *	@return int id Current row of a the table
 */
function getIdTable(input) {
	var id = $(input).closest("tr").attr("data-id");
	id = tableIni.length-parseInt(id);

	return id;
}

/*
 *	Show/Hide second name col
 *
 */
function toggleNameS(defaultDisplay = false) {
	if ($(this).is(":checked")) {
		$(".table-second-name").show();
	} else {
		$(".table-second-name").hide();
	}
}

/*
 *	Display only name n° and ini and hide form
 */
function toggleMinimalView(defaultDisplay = false) {
	if (defaultDisplay === true || $(this).is(":checked")) {
		currentHideView = true;
		$(FORM_INI).hide();
		$(".table-pv").hide();
		$(".table-pv-total").hide();
		$(".table-delete").hide();

	} else {
		currentHideView = false;
		$(FORM_INI).show();
		$(".table-pv").show();
		$(".table-pv-total").show();
		$(".table-delete").show();
	}
}

/*
 *	Show/Hide a element from intiative table
 *
 *	@param String className
 *	@param Bool defaultDisplay Use for re-check element display when the table is reload
 */
function toggleElement(className, defaultDisplay = false, pos,currentClick = false) {
	if (defaultDisplay === true || $(currentClick).is(":checked")) {
		currentHideColumn[pos] = true;
		$(className).hide();
	} else {
		currentHideColumn[pos] = false;
		$(className).show();
	}
}

/*
 *	Rehide element when recreate the table
 *
 */
function updateDisplay() {
	toggleMinimalView(currentHideView);
	toggleElement(".table-ca", currentHideColumn[0], 0);
	toggleElement(".table-note", currentHideColumn[1], 1);
}