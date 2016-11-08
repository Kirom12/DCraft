/*
 *	@TODO
 *	
 */

var ENCOUNTER_FORM = $("#form-encounter");
var ENCOUNTER_TYPE = {
	"type" : ["Amuseurs public (Conteur, Chanteur, Musicien, Jongleur, Devin, ...)", "Voyageurs (Marchand, Pélerins, Voleurs, Aventuriers, Locaux)", "Patrouille", "Criminels (Bandits, Esclavagiste, Monstres)"],
	"normalRoad" : {
		"day" : [20, 50 , 20, 20],
		"night" : [5, 10, 20, 65]
	},
	"rareRoad" : {
		"day" : [10, 30 , 20, 40],
		"night" : [3, 5, 10, 82]
	},
	"savageLand" : {
		"day" : [5, 15 , 5, 75],
		"night" : [2, 5, 3, 90]
	}
};

$(function() {
	//EVENTS
	//default 12h
	ENCOUNTER_FORM.submit(function(e) {
		e.preventDefault();

		encounter(12);
	});

	ENCOUNTER_FORM.find("[type=button]").on('click', function() {
		encounter($(this).val());
	});

	//Reset
	$("#refresh-encounter").on('click', function() {
		resetEncounterForm();
	});
});

function encounter(nbrHours) {
	var bonusSurvival = parseInt(ENCOUNTER_FORM.find("input").eq(0).val());
	bonusSurvival = (isNaN(bonusSurvival))? 0 : bonusSurvival;
	var modificatorOther = parseInt(ENCOUNTER_FORM.find("input").eq(1).val());
	modificatorOther = (isNaN(modificatorOther))? 0 : modificatorOther;
	var zone = parseInt($("input[name=opZone]:checked", "#form-encounter").val());
	var zoneRoad = parseInt($("input[name=opRoad]:checked", "#form-encounter").val());
	
	var nbrHours = parseInt(nbrHours);
	var night = $("input[name=night]").is(":checked");
	var roll = 0;
	var time = false;

	//Get all 4 modificators from input
	var modificatorType = [];
	for (var i = 3; i < 7 ; i++) {
		modificatorType.push((isNaN(parseInt(ENCOUNTER_FORM.find("input").eq(i).val())))? 0 : parseInt(ENCOUNTER_FORM.find("input").eq(i).val()));
	}

	//Get roll modificator if needed
	var modificator = 0;
	$("input[type=checkbox]:checked", "#form-encounter modificator").each(function() {
		modificator += parseInt($(this).val());
	});

	percentEncounter = zone + zoneRoad + modificator - modificatorOther - bonusSurvival;

	var zoneRoadName = getZoneRoadName(zoneRoad);
	var percentType = modifyPercentType(modificatorType, zoneRoadName);

	for (var i = 0; i < nbrHours; i++) {
		roll = d100();
		time = (i > 11)? !night : night;

		if (roll >= percentEncounter) {
			var rowClass = "success";
		} else {
			var rowClass = "danger";
		}

		$("#encounter").find("table tbody").prepend('<tr class="'+rowClass+'"><td>'+(i+1)+'</td><td>'+roll+'</td><td>'+percentEncounter+'</td><td>'+getTypeEncounter(percentType, zoneRoadName, time)+'</td><td>'+getND()+'</td></tr>');
	}
}

function getZoneRoadName(zoneRoad) {
	switch(zoneRoad) {
		case 0:
			var zone = "savageLand";
			break;
		case 2:
			var zone = "rareRoad";
			break;
		case 4:
			var zone = "normalRoad";
			break;
		default:
			return "error";
	}

	return zone;
}

function getTypeEncounter(percent, zone, night) {
	var roll = d100();
	var time = (night === true)? "night" : "day";

	console.log(roll);

	if (roll <= percent[time][0]) {
		return ENCOUNTER_TYPE["type"][0];
	} else if (roll <= percent[time][0]+percent[time][1]) {
		return ENCOUNTER_TYPE["type"][1];
	} else if (roll <= percent[time][0]+percent[time][1]+percent[time][2]) {
		return ENCOUNTER_TYPE["type"][2];
	} else {
		return ENCOUNTER_TYPE["type"][3];
	}
}

function getND() {
	var ND = "";

	switch (d6()) {
		case 1:
			ND = "Niv-2";
			break;
		case 2:
			ND = "Niv-1";
			break;
		case 3:
			ND = "Niv";
			break;
		case 4:
			ND = "Niv+1";
			break;
		case 5:
			ND = "Niv+2";
			break;
		case 6:
			ND = "Niv+3";
			break;
	}

	return ND;
}

function modifyPercentType(modif, zone) {
	var modifiedPercent = {"day" : [], "night" : []};

	for (i = 0; i < modif.length; i++) {
		modifiedPercent["day"][i] = ENCOUNTER_TYPE[zone]["day"][i]+modif[i];
		modifiedPercent["night"][i] = ENCOUNTER_TYPE[zone]["night"][i]+modif[i];
	}

	for (i = 0; i < modif.length; i++) {
		for (j = 0; j < modif.length; j++) {
			modifiedPercent["day"][j] = roundNb(modifiedPercent["day"][j]-((modif[i]/100)*ENCOUNTER_TYPE[zone]["day"][j]), 1);
			modifiedPercent["night"][j] = roundNb(modifiedPercent["night"][j]-((modif[i]/100)*ENCOUNTER_TYPE[zone]["night"][j]), 1);
		}
	}

	return modifiedPercent;
}

function resetEncounterForm() {
	$("#encounter").find("table tbody").html("");
}