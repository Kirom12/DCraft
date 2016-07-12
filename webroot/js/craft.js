//Variables'global'
var count = 0;
var durationHours = 0;
// Can be less for faster !
var modifierNb = 10;

//jQuery
$(function() {
	$('form').submit(false);

	// Form submit
	$('#form-craft').submit(function(e){
		e.preventDefault();

		craft();
	});

	// Reset form
	$('#refresh').on('click', function() {
		reset();
	});
});

//Function crafting
function craft(){
	if(checkForm('#form-craft')) {
		var dice = parseInt($('#form-craft input').eq(0).val());
		var dd = parseInt($('#form-craft input').eq(1).val());
		var progress = parseFloat($('#form-craft input').eq(2).val());
		var price = parseInt($('#form-craft input').eq(3).val());
		var time = $('input[name=opTime]:checked', '#form-craft').val();
		var multiplicator = parseFloat($('#form-craft select').val());
		var modifier;

		console.log(multiplicator);

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

		if (dice >= dd) {
			// Success
			// Calcul progression
			var progressStep = round(((dice*dd)/modifier)*multiplicator, 2);
			var progressTotal = round(progress+progressStep, 2);
			$('#form-craft input').eq(2).val(progressTotal);

			var rowClass = 'success';
		}
		else {
			// Fail
			var progressTotal = progress;
			var progressStep = 0;
			
			var rowClass = 'danger';
		}
		// Insert result in the table
		$('#craft table tbody').prepend('<tr class="'+rowClass+'"><th scope="row">'+count+'</th><td>'+time+'</td><td>'+dice+'</td><td>'+dd+'</td><td>'+progressStep+'</td><td>'+progressTotal+'</td></tr>');
		
		// Calculation of the duration time in Week, day, hours.
		// And insert duration
		if (progressTotal >= price) {
			// Display in Alert
			$('#craft .duration').html('<div class="alert alert-success" alert="alert"><b>Craft terminée ! </b>'+Math.floor(durationHours/56)+' semaine(s) '+Math.floor((durationHours%56)/8)+' jour(s) '+Math.floor((durationHours%56)%8)+' heure(s)</div>');
		} else {
			$('#craft .duration').html('<b>Durée : </b>'+Math.floor(durationHours/56)+' semaine(s) '+Math.floor((durationHours%56)/8)+' jour(s) '+Math.floor((durationHours%56)%8)+' heure(s)');
		}


		$('#form-craft input').eq(0).val('');
		$('#form-craft input').eq(0).focus();
	}
}

function reset() {
	for (var i = 4 - 1; i >= 0; i--) {
		$('#form-craft input').eq(i).val('');
	}
	$('#form-craft input').eq(2).val('0');

	$('#craft table tbody').html('');
	$('#craft .duration').html('');
	$('#form-craft select').val('1');

	$('#form-craft input').eq(0).focus();
}

/**
 *	Function for forms checking. Color input.
 *
 *	@param form Form who need to be check
 *	@return bool inputOk return true if all field are completed
 */
function checkForm(form){
	var inputOk = true;

	for (var i = 4; i >= 0; i--) {
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