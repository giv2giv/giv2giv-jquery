/* TODO: 
- Fill out the Cashflows object to make it rain
- Improve the art (flat + rounded corners for image sprites)
- Add on hover functionality for responsiveness (e.g. concentric circles for the wallet, pot, and charity)
- Add passive animation (concentric circles) to the wallet to attract attention there
*/

$(function() {
	var $dragPrompt = $('#drag-prompt');
	var $benjamins = $('#benjamins');
	var $plantPot = $('#plant-pot');
	var $charity = $('#charity');
	var $beanstalk = $('#beanstalk');

	// Defines where the money goes back to if the user doesn't drop it anywhere
	var moneyHomePosition = {
		top: 100,
		left: 150
	}

	// From http://stackoverflow.com/a/5848800
	// Reverts the money to your wallet if you don't drag it into the pot or the charity
	$benjamins.draggable({
		revert: function(event, ui) {
			$(this).data("uiDraggable").originalPosition = moneyHomePosition;
			return !event;
		},
		containment: 'document'
	});
	$plantPot.droppable({
		drop: function(event, ui) {
			$dragPrompt.html('Horray!');
			moneyHomePosition = {top: 100, left: 550};
			$benjamins.animate({
				top: 100,
				left: 550,
				opacity: 0
			},500,function(){$(benjamins).remove()});
			$beanstalk.grow();

		}
	});
	$charity.droppable({
		drop: function(event, ui) {
			$dragPrompt.html('Donating directly is great, but what if your charity needs more money? Try giving your money to giv2giv instead.');
			moneyHomePosition = {top: 100, left: 1066};
			$benjamins.animate(moneyHomePosition)
		}
	});

	$beanstalk.grow = function() {
		$beanstalk.addClass('grown')
	}

	function cashflows() {
		
	}
});