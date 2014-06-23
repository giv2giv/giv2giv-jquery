/* TODO: 
- Add passive animation to the drag arrow to attract attention there
*/

$(function() {
	var $benjamins;
	var moneyHomePosition;
	var $dragArrow = $('#drag-arrow');
	var $resultArrow = $('#result-arrow');
	var $personWallet = $('#person-wallet');
	var $tree = $('#tree');
	var $charity = $('#charity');

	function createNewBenjamins() {
		// Initialize the benjamins on page load
		// Create a new dollar bill once the old one disappears
		$personWallet.before('<div class="interactive-target stationary" id="benjamins"></div>');
		$benjamins = $('#benjamins');
		
		// Defines where the money goes back to if the user doesn't drop it anywhere
		moneyHomePosition = {
			top: 108,
			left: 22,
			opacity: 0
		};

		$benjamins.draggable({
			// From http://stackoverflow.com/a/5848800
			// Reverts the money to your wallet if you don't drag it into the pot or the charity
			revert: function(event, ui) {
				disappearIntoPosition(moneyHomePosition, 500);
				return !event;
			},
			containment: 'document',
			start: function(event, ui) {
				$(this).removeClass('stationary');
			}
		});
	}

	$tree.droppable({
		drop: function(event, ui) {
			$dragArrow.fadeOut(400, function(){$dragArrow.remove();});
			moneyHomePosition = {top: 108, left: 295, opacity: 0};
			disappearIntoPosition(moneyHomePosition, 500);
			$tree.grow();
			$resultArrow.delay(400).fadeIn(400, function(){
				makeItRain();
			});
		},
		tolerance: 'touch',
		hoverClass: 'dragover-hover'
	});
	$tree.grow = function() {
		$tree.addClass('grown');
	};

	$charity.droppable({
		drop: function(event, ui) {
			moneyHomePosition = {top: 108, left: 570, opacity: 0};
			disappearIntoPosition(moneyHomePosition, 500);
		},
		tolerance: 'touch',
		hoverClass: 'dragover-hover'
	});

	function disappearIntoPosition(position, speed) {
		$benjamins.animate(position, speed, function(){
			$benjamins.remove();
			createNewBenjamins();
		});
	}

	function makeItRain() {
		$benjamins.removeClass('stationary');
		$benjamins.css({top: 108, left: 295, opacity:1});
		$benjamins.show(800, function() {
		// $benjamins.animate({top: 108, left: 295, height: '100px', width: '100px'}, function() {
			disappearIntoPosition({top: 108, left: 570, opacity: 0}, 1000);
			setTimeout(function(){console.log('again');makeItRain();}, 3000);
		});
	}

	createNewBenjamins();

});
