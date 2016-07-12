//Variables'global'
var count = 0;
var durationHours = 0;
// Can be less for faster !
var modifierNb = 10;

//jQuery
$(function() {
	// EVENTS
	// Form submit
	$('#form-craft').submit(function(e){
		e.preventDefault();

		craft();
	});

	// Reset form
	$('#refresh').on('click', function() {
		reset();
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

//Function crafting
function craft(){
	if(checkForm('#form-craft')) {
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
				modifier = modifierNb;
				time = 'Semaine';
				durationHours += 56;
				break;
			case 2:
				modifier = modifierNb*10;
				time = 'Jour'
				durationHours += 8;
				break;
			case 3:
				modifier = (modifierNb*10)*8;
				time = 'Heure';
				durationHours += 1;
				break;
			default:
		}

		if (result >= dd) {
			// Success
			// Calcul progression
			var progressStep = round(((result*dd)/modifier)*multiplicator, 2);
			var progressTotal = round(progress+progressStep, 2);
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

function autoCraft(fullAuto = true) {
	var craftFinish = false;

	do {
		var d20 = round(Math.random()*(20 - 1)+1, 0);

		$('#form-craft input').eq(0).val(d20);

		craftFinish = craft();
	} while (!craftFinish && fullAuto);
}

function reset() {
	$('#form-craft input').eq(0).val('');
	$('#form-craft input').eq(3).val('0');
	$('#form-craft select').val('1');

	$('#craft table tbody').html('');
	$('#craft .duration').html('');

	$('#form-craft input').eq(0).focus();

	durationHours = 0;
	count = 0;
}

/**
 *	Function for forms checking. Color input.
 *
 *	@param form Form who need to be check
 *	@return bool inputOk return true if all field are completed
 */
function checkForm(form){
	var inputOk = true;

	for (var i = 5; i >= 0; i--) {
		var input = $(form).find('input').eq(i);

		if (input.val() == "" || isNaN(input.val()))
		{
			input.parent().addClass('has-error');
			input.focus();
			inputOk = false;
		}
		else
		{
			input.parent().removeClass('has-error');
		}

	};

	return inputOk;
}

/*
 *	Round a number
 */
function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}