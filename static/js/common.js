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
 *	Save a value in the local storage. Remove for trigger the storage event
 *
 *	@param String name
 *	@param Array value
 */
function saveInStorage(name, value) {
	localStorage.removeItem(name);
	localStorage.setItem(name, JSON.stringify(value));
}

/*
 *	Round a number
 *
 *	@param Float value number to round
 *	@param Int decimals
 *	@return float
 */
function roundNb(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

/*
 *	Return random number
 */
 function d6() {
	return Math.round(Math.random()*(6 - 1)+1);
}
function d20() {
	return Math.round(Math.random()*(20 - 1)+1);
}
function d100() {
	return Math.round(Math.random()*(100 - 1)+1);
}

/*
 *	Sort a table on the second index
 */
function sortInitiative(a, b) {
	if (a[2] === b[2]) {
    	return 0;
	}
	else {
    	return (a[2] < b[2]) ? -1 : 1;
	}
}