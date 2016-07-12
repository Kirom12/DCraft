//Variables'global'
var count = 0;
var time;
// Can be less for faster !
var modifierNb = 10;

//jQuery
$(function() {
	$('form').submit(false);

	$('#form-craft').submit(function(e){
		e.preventDefault();

		craft();
	});
});

//Function crafting
function craft(){
	if(checkForm('#form-craft')) {
		var dice = parseInt($('#form-craft').find('input').eq(0).val());
		var dd = parseInt($('#form-craft').find('input').eq(1).val());
		var progress = parseFloat($('#form-craft').find('input').eq(2).val());
		var price = parseInt($('#form-craft').find('input').eq(3).val());
		var time = $('input[name=opTime]:checked', '#form-craft').val();
		var modifier;

		count++;

		switch(parseInt(time)) {
			case 1:
				modifier = modifierNb;
				time = 'Semaines';
				break;
			case 2:
				modifier = modifierNb*10;
				time = 'Jours'
				break;
			case 3:
				modifier = (modifierNb*10)*8;
				time = 'Heures';
				break;
			default:
		}

		if (dice >= dd) {
			// Success
			// Calcul progression
			var progressStep = round((dice*dd)/modifier, 2);
			var progressTotal = round(progress+progressStep, 2);
			$('#form-craft').find('input').eq(2).val(progressTotal);

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

		$('#form-craft').find('input').eq(0).val('');
		$('#form-craft').find('input').eq(0).focus();
	}
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