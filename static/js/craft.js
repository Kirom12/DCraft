/*
 *	@TODO
 *	Save every craft (in local storage)
 */

//Variables'global'
var MODIFIER_NB = 10;
var FORM_CRAFT = '#form-craft';
var INPUT_CHECK_CRAFT = [0, 1, 2, 3, 4];

var count = 0;
var durationHours = 0;

//jQuery
$(function() {
	// EVENTS
	// Form submit
	$('#form-craft').submit(function(e){
		e.preventDefault();

		craft();
	});

	// Reset form
	$('#refresh-craft').on('click', function() {
		resetCraftForm();
	});

	// Automatic craft
	$('#auto').on('click', function() {
		autoCraft();
	});

	// Semi-Automatic craft
	$('#semi-auto').on('click', function() {
		autoCraft(false);
	});
});

/*
 *	Get inputs and calcul progression and add line in html table
 *
 *	@return bool Craft finish
 */
function craft() {
	if(checkForm(FORM_CRAFT, 'int', INPUT_CHECK_CRAFT)) {
		var dice = parseInt($('#form-craft input').eq(0).val());
		var bonus = parseInt($('#form-craft input').eq(1).val());
		var dd = parseInt($('#form-craft input').eq(2).val());
		var progress = parseFloat($('#form-craft input').eq(3).val());
		var price = parseInt($('#form-craft input').eq(4).val());
		var time = $('input[name=opTime]:checked', '#form-craft').val();
		var multiplicator = parseFloat($('#form-craft select').val());
		var result = dice + bonus;
		var modifier;

		count++;

		switch(parseInt(time)) {
			case 1:
				modifier = MODIFIER_NB;
				time = 'Semaine';
				durationHours += 56;
				break;
			case 2:
				modifier = MODIFIER_NB*10;
				time = 'Jour'
				durationHours += 8;
				break;
			case 3:
				modifier = (MODIFIER_NB*10)*8;
				time = 'Heure';
				durationHours += 1;
				break;
			default:
		}

		if (result >= dd) {
			// Success
			// Calcul progression
			var progressStep = roundNb(((result*dd)/modifier)*multiplicator, 2);
			var progressTotal = roundNb(progress+progressStep, 2);
			$('#form-craft input').eq(3).val(progressTotal);

			var rowClass = 'success';
		}
		else {
			// Fail
			var progressTotal = progress;
			var progressStep = 0;
			
			var rowClass = 'danger';
		}
		// Insert result in the table
		$('#craft table tbody').prepend('<tr class="'+rowClass+'"><th scope="row">'+count+'</th><td>'+time+'</td><td>'+result+'</td><td>'+dd+'</td><td>'+progressStep+'</td><td>'+progressTotal+'</td></tr>');
		
		$('#form-craft input').eq(0).val('');
		$('#form-craft input').eq(0).focus();

		// Calculation of the duration time in Week, day, hours.
		// And insert duration
		if (progressTotal >= price) {
			// Craft finished
			// Display in Alert
			$('#craft .duration').html('<div class="alert alert-success" alert="alert"><b>Craft terminée ! </b>'+Math.floor(durationHours/56)+' semaine(s) '+Math.floor((durationHours%56)/8)+' jour(s) '+Math.floor((durationHours%56)%8)+' heure(s)</div>');

			return true;
		} else {
			$('#craft .duration').html('<b>Durée : </b>'+Math.floor(durationHours/56)+' semaine(s) '+Math.floor((durationHours%56)/8)+' jour(s) '+Math.floor((durationHours%56)%8)+' heure(s)');

			return false;
		}
	}
}

/*
 *	Call craft function until the craft ends
 *
 *	@param bool fullauto Call craft() once or until the craft ends
 */
function autoCraft(fullAuto = true) {
	var craftFinish = false;

	if (checkForm(FORM_CRAFT, 'int',[1, 2, 3, 4])) {
		do {
			$('#form-craft input').eq(0).val(d20());

			craftFinish = craft();
		} while (!craftFinish && fullAuto);
	}
}

/*
 *	Reset craft form
 */
function resetCraftForm() {
	$('#form-craft input').eq(0).val('');
	$('#form-craft input').eq(3).val('0');
	$('#form-craft select').val('1');

	$('#craft table tbody').html('');
	$('#craft .duration').html('');

	$('#form-craft input').eq(0).focus();

	durationHours = 0;
	count = 0;
}