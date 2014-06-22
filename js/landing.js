/* TODO: 
- Fill out the Cashflows object to make it rain
- Improve the art (flat + rounded corners for image sprites)
- Add passive animation to the wallet to attract attention there
*/

$(function() {
	var $dragPrompt = $('#drag-prompt');
	var $personWallet = $('#person-wallet');
	var $benjamins = $('#benjamins');
	var $plantPot = $('#plant-pot');
	var $beanstalk = $('#beanstalk');
	var $charity = $('#charity');

	// Defines where the money goes back to if the user doesn't drop it anywhere
	var moneyHomePosition = {
		top: 140,
		left: 30
	};

	$benjamins.draggable({
		// From http://stackoverflow.com/a/5848800
		// Reverts the money to your wallet if you don't drag it into the pot or the charity
		revert: function(event, ui) {
			$(this).data("uiDraggable").originalPosition = moneyHomePosition;
			return !event;
		},
		containment: 'document',
		start: function(event, ui) {
			$(this).removeClass('stationary');
		},
		stop: function(event, ui) {
			$(this).addClass('stationary');
		}
	});
	$plantPot.droppable({
		drop: function(event, ui) {
			$dragPrompt.fadeOut(400, function(){$dragPrompt.remove();});
			moneyHomePosition = {top: 140, left: 300};
			$benjamins.animate({
				top: 140,
				left: 300,
				opacity: 0
			},500,function(){$(benjamins).remove();});
			$beanstalk.grow();
		},
		tolerance: 'touch',
		hoverClass: 'dragover-hover'
	});
	$charity.droppable({
		drop: function(event, ui) {
			moneyHomePosition = {top: 140, left: 600};
			$benjamins.animate(moneyHomePosition);
		},
		tolerance: 'touch',
		hoverClass: 'dragover-hover'
	});

	$beanstalk.grow = function() {
		$beanstalk.addClass('grown');
	};

	function cashflows() {
		
	}
});
