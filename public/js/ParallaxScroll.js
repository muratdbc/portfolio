/*!
 * The Perfect Parallax Scroller
 * ========================================================================
 *
 * @author:			Tom Dyer
 * @website:		http://www.bespokepixels.co.uk/
 * @version:		1.1
 * @modified:		17-06-2014
 * @requires:		jQuery, some HTML knowledge, coffee and biscuits.
 *
 * @description:	Parallax Scroller class. Adds parallax functionality to
 * 					any div containers that contain the attribute(s):
 *						data-type          : 'background'      (Required)
 *						data-scroll-height : int               (optional)
 *						data-bg-height     : int(px)/percent   (optional)
 *						data-invert        : boolean           (optional)
 *
 * This code doesn't come with any license - copy it, use it, edit it,
 * whatever - but please leave the original author information intact.
 * Credit where credit is due and all that jazz.
 *
 * Visit my website for more useful snippets of code:
 *  - http://www.bespokepixels.co.uk/
 */


// Create the instance of the class on dom ready.
$(document).ready(function(){
	new ParallaxScrollers();
});

/* Create HTML5 elements for IE's sake */
document.createElement("article");
document.createElement("section");

/**
 * The ParallaxScroller class
 */
function ParallaxScrollers(){


	// Variables of usefulness.
	var $window   = $(window);
	var winHeight = $window.height();
	var $doc      = $(document);
	var docHeight = $doc.height() - winHeight;
	var scrollers = [];
	var init      = _init();


	/**
	 * Initiate the script.
	 * - Load all Scroller elements and cache the information ready for the window.scroll event
	 * - Load any images if required (in order to pull height info from it)
	 * - Add the window.scroll event
	 * @return null
	 */
	function _init(){
		updateSizes();
		$window.scroll( updateScroll );
		$window.resize( updateSizes );
	}


	/**
	 * Update cached object(s) for scrollers. Since the window has resized we
	 * need to work out all the differences again so we know how much we can
	 * move the background images.
	 */
	function updateSizes(){
		winHeight = $window.height();
		docHeight = $doc.height() - winHeight;
		scrollers = [];

		$('[data-type="parallax"]').each(function(index){

			// Cache all scroller elements
			var $scroller     = $(this);
			var sInvert       = $scroller.data('invert') == true ? true : false;
			var oHeight       = $scroller.height();
			var oStart        = $scroller.offset().top;
			var oEnd          = oStart + oHeight;
			var bgHeight      = $scroller.data('bg-height') ? $scroller.data('bg-height') : false;
			var oScrollHeight = $scroller.data('scroll-height') ? $scroller.data('scroll-height') : oHeight;

			// Ensure offsets are correct
			if(oStart < winHeight) {
				oStart = 0;
			} else {
				oStart -= winHeight;
			}
			if(oEnd >= docHeight) {
				// console.log('Here?');
				oEnd -= winHeight;
				// oEnd -= (winHeight - oHeight);
			}

			// Create an object for caching.. saves jQuery re-reading the values
			// from the dom element on each scroll event.
			var obj = {
				target       : $scroller,
				invert       : sInvert,
				scrollHeight : oScrollHeight,
				height       : oHeight,
				start        : oStart,
				end          : oEnd,
				sPercent     : oStart / docHeight,
				ePercent     : oEnd / docHeight,
				diff         : oScrollHeight - oHeight
			};
			scrollers[index] = obj;

			if( ! $scroller.data('scroll-height') ) {

				// if bgHeight is set, we need to scale the background image accordingly.
				// And also override the scrollHeight if it's a percentage.
				if(bgHeight){

					// if we're dealing with percentages work it out...
					if( bgHeight.toString().indexOf('%') >= 0 ) {
						var h = (parseInt(bgHeight) / 100) * oHeight;
					} else {
						var h = bgHeight > scrollers[index].scrollHeight ? bgHeight : scrollers[index].scrollHeight;
					}

					// Set the object's sizes and scale the background
					scrollers[index].scrollHeight = h;
					scrollers[index].diff         = h - $scroller.height();
					$scroller.css({
						'background-size' : 'auto ' + h + 'px'
					});

				} else {

					// Otherwsie, load the image and pull the sizes from that.
					var url = $scroller.css('background-image').replace('url(', '').replace(')', '').replace("'", '').replace('"', '');
					getHeightOnLoad( url, function(h) {
						if(!sInvert){
							scrollers[index].scrollHeight = h;
							scrollers[index].diff         = h - $scroller.height();
						} else {
							scrollers[index].scrollHeight = -h;
							scrollers[index].diff         = h - $scroller.height();
						}
					});
				}
			}
		});
	}


	/**
	 * Update position of all Parallax Scroller element backgrounds.
	 * Called on window.scroll event.
	 * @return {null} Nothing returned, all handled internally.
	 */
	function updateScroll(){

		var yScroll   = $window.scrollTop();
		var percent   = yScroll / docHeight;

		for(var i=0,l=scrollers.length; i<l; i++) {
			var o = scrollers[i];
			// Exit if this element isn't in view
			if(yScroll + winHeight < o.start || yScroll > o.end) continue;

			var tPercent = (percent - o.sPercent) / (o.ePercent - o.sPercent);
			if(o.invert) tPercent = 1 - tPercent;
			// console.log(tPercent);
			o.target.css({
				backgroundPosition: '50% ' + -Math.ceil(o.diff * tPercent) + 'px'
			});

		}
	}


	/**
	 * Load background images into the DOM in aid in retrieving the image dimensions
	 *
	 * @param  {string} src       	| The source of the image
	 * @param  {function} callback	| The callback event for the onload method
	 * @return {null}            	| Doesn't return anything, use callback method
	 */
	function getHeightOnLoad( src, callback ){
		// Create an img element so we can listen to the onload method
		if( !callback || typeof callback != 'function' ) callback = function(){ return false; }
		var bgImg = $('<img />');
			bgImg.hide();
			bgImg.bind('load', function() {
				callback( $(this).height() );
				$(this).remove();
				updateScroll();
		});
		$('body').append(bgImg);
		bgImg.attr('src', src);
	}
}














