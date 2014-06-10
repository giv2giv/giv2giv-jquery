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
			$dragPrompt.html('Awesome :)<br/><span class="secondary-drag-prompt">Your charity will now receive investment income every 90 days, forever.</span>');
			moneyHomePosition = {top: 140, left: 350};
			$benjamins.animate({
				top: 140,
				left: 350,
				opacity: 0
			},500,function(){$(benjamins).remove();});
			$beanstalk.grow();
		},
		tolerance: 'touch',
		hoverClass: 'dragover-hover'
	});
	$charity.droppable({
		drop: function(event, ui) {
			$dragPrompt.html('Donating directly is great, but what if your charity needs more money?<br/><span class="secondary-drag-prompt">Try giving your money to giv2giv instead.</span>');
			moneyHomePosition = {top: 140, left: 566};
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
