/**
 *	Function for forms checking. Color input.
 *
 *	@param form Form to be checked
 *	@param string type Form type (int or string)
 *	@param array inputs Inputs to check
 *	@return bool inputOk Return true if all field are completed
 */
function checkForm(form, type, inputs){
	var inputOk = true;
	var checkInput;

	for (var i = inputs.length-1; i >= 0; i--) {
		var input = $(form).find('input').eq(inputs[i]);

		switch(type) {
			case 'int':
				if (input.val() == "" || isNaN(input.val())) {
					checkInput = false;
				} else {
					checkInput = true;
				}					
				break;
			case 'string':
				if (input.val() == "") {
					checkInput = false;
				} else {
					checkInput = true;
				}
				break
			default:
				return false;
		}

		if (!checkInput) {
			input.parent().addClass('has-error');
			input.focus();
			inputOk = false;
		} else {
			input.parent().removeClass('has-error');
		}

	};

	return inputOk;
}

/*
 *	Get value of inputs in a form
 *
 *	@param form
 *	@param int limit Number of first inputs to check
 *	@return array Array of input values
 */
function getInputValue(form, limit) {
	var inputs = [];

	for (var i = 0; i <= limit; i++) {
		inputs[i] = $(form).find('input').eq(i).val();
	}

	return inputs;
}

/*
 *	Round a number
 *
 *	@param Float value number to round
 *	@param Int decimals
 *	@return float
 */
function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

/*
 *	Return number between 1 and 20
 */
function d20() {
	return round(Math.random()*(20 - 1)+1, 0);
}

/*
 *	Sort a table on the second index
 */
function sortInitiative(a, b) {
	if (a[1] === b[1]) {
    	return 0;
	}
	else {
    	return (a[1] < b[1]) ? -1 : 1;
	}
}