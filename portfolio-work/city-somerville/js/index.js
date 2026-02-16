(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(window, document, $, undefined){
	"use strict";

	var mapContainerClass = "js-google-map",
		latlngCityHall = "",
		latlngDPW = "",
		latlngParking = "",
		latlngSafety = "",
		googleMap,
		currentInfoWindow,
		zoom = 13;

	function setZoom() {
		if($('.breakpoint-m-min').width() <= window.innerWidth){
			zoom = 14;
		}
	}

	function setLocations(){
		latlngCityHall = new google.maps.LatLng(42.387206, -71.098169);
		latlngDPW = new google.maps.LatLng(42.396894, -71.107441);
		latlngParking = new google.maps.LatLng(42.400127, -71.125263);
		latlngSafety = new google.maps.LatLng(42.379218, -71.092590);
	}

	function createMap(){
		var mapContainer = $('.' + mapContainerClass)[0];

		var mapOptions = {
			scrollwheel: false,
			zoom: zoom,
			center: latlngCityHall
		};

		googleMap = new google.maps.Map(mapContainer,mapOptions);
	}

	function createMarkers(){
		createMarker("City Hall",latlngCityHall);
		createMarker("DPW",latlngDPW);
		createMarker("Parking and Traffic",latlngParking);
		createMarker("Public Safety",latlngSafety);
	}
	function createMarker(title, position){
		var infoWindow = new google.maps.InfoWindow({
			content: '<div class="info-window">' + title + '</div>'
		});

		var marker = new google.maps.Marker({
			position: position,
			title:title
		});

		marker.setMap(googleMap);

		google.maps.event.addListener(marker, 'click', function() {
			if (currentInfoWindow) {
				currentInfoWindow.close();
			}
			currentInfoWindow = infoWindow;
			infoWindow.open(googleMap,marker);
		});
	}

	function init(){
		//wait for dom ready
		$(function(){
			if($('.' + mapContainerClass).length) {
				setZoom();
				setLocations();
				createMap();
				createMarkers();
			}
		});

	}
	return {
		init:init
	}

}(window,document,jQuery);
},{}],2:[function(require,module,exports){
var Somerville = Somerville || {};

Somerville.Main = function(window, document, $, undefined) {
	"use strict"

	var breakPointLargeMin = 831;
	
	// load modules 
	var showHides = require("./show-hide.js"),
		mediaGallery = require("./media-gallery.js"),
		googleMap = require("./google-map.js"),
		sidebarNav = require("./sidebar-nav.js"),
		responsiveTables = require("./responsive-tables.js");

	function initBreakPoints() {
		breakPointLargeMin = $('.breakpoint-l-min').length ? $('.breakpoint-l-min').width() : breakPointLargeMin;
	}
	
	function decoratedHeadings() {
		// find all decorated headings
		$('.heading-decorated').each(function(){
			// if it has a decorated-inner span tag
			if($(this).find('.heading-decorated__inner').length){
				// do nothing
				return;
			} else { // otherwise
				// wrap the content in a decorated-inner tag
				$(this).wrapInner("<span class='heading-decorated__inner'></span>");
			}
		});
	}

	function customSelectBox() {
		$('.js-custom-select').each(function(){
			$(this).select2({
				minimumResultsForSearch: Infinity
			});
		});
	}

	function initSiteAlert() {
		$('.js-alert-message').each(function(){
			var $el = $(this);
			// get the unique id of the alert
			var saID = $el.data('alert-id');
			// attempt to get the id from the site alert cookie
			var saCookie = getCookie("alertMessage" + saID);
			// if successful and cookies' id and alerts ids match
			if(saCookie !== "" && parseInt(saCookie) === saID) {
				// do nothing
				return;
			}
			// show the alert message
			$el.addClass('is-visible');
			
			// if the user closes the alert message
			$el.click(function(e) {
				e.preventDefault();
				// hide the alert message
				$(this).removeClass('is-visible');
				// set a site alert cookie with the alerts' id value.
				setCookie("alertMessage" + saID, saID, 365);
			});
		});
	}
	
	function initContactSidebar(){
		$('.js-contact-sb').each(function(){
			var $el = $(this),
				isMobile = false,
				resizeTimeout;
			
			$el.find('.js-accordion-link').click(function(e){
				if(window.innerWidth < breakPointLargeMin) {
					e.preventDefault();
					// toggle the expanded state
					$el.toggleClass('is-expanded').find('.js-accordion-content').stop(true,true).slideToggle();
				}
			});

			$(window).resize(function() {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(function() {
					if (window.innerWidth < breakPointLargeMin) {
						if (!isMobile) {
							$el.removeClass('is-expanded').find('.js-accordion-content').stop(true,true).slideUp();
							isMobile = true;
						}
					}
					else if (window.innerWidth >= breakPointLargeMin) {
						if (isMobile) {
							$el.addClass('is-expanded').find('.js-accordion-content').stop(true,true).slideDown();
							isMobile = false;
						}
					}
				}, 200);
			});
		});
	}

	function initAccordions(){
		$('.js-accordion-module').each(function(){
			var $el = $(this);
			// Add click event to the controls
			$el.find('.js-accordion-link').click(function(e){
				e.preventDefault();
				// if it is the contact side bar

				// toggle the expanded state
				$el.toggleClass('is-expanded').find('.js-accordion-content').stop(true,true).slideToggle();
			});
		});
	}
	function initClickable(){
		$('.js-clickable').each(function(){
			// if the this is clicked
			$(this).click(function(event){
				event.preventDefault();

				var $el = $(this).find('.js-clickable-link').first();
				// find the destination
				var dest = $el.attr("href");
				// if the target attribute exists
				if("_blank" === $el.attr("target")) {
					// launch new tab/window
					window.open(dest);
				} else {
					// otherwise redirect to a new page 
					window.location = dest;
				}
			});
		});
	}

	function initMatchHeight(){
		$('.js-equal-height').matchHeight();
	}

	function initFeedback(){
		$('.js-leave-feedback-link').click(function(){
			$(this).parent().toggleClass('is-visible');
		});

	}
	function initGlobalNav(){
		$('.js-global-nav-link').keydown(function( event ) {
			// 37 left, 38 up, 39 right, 40 down
			switch(event.keyCode) {
			    case 37:
			    	$(this).parent().removeClass('is-expanded');
			    	$(this).parent().prev().addClass('is-expanded').find('.js-global-nav-link').focus();
			        break;
			    case 38:
				    $(this).parent().removeClass('is-expanded');
			        break;
		        case 39:
		        	$(this).parent().removeClass('is-expanded');
		        	$(this).parent().next().addClass('is-expanded').find('.js-global-nav-link').focus();
		            break;
		        case 40:
			        if($(this).hasClass('is-expanded')){
			        	$(this).parent().removeClass('is-expanded');
			        } else {
			        	$('.js-global-nav-link').parent().removeClass('is-expanded');				
			        	$(this).parent().addClass('is-expanded');
			        }
		            break;
			}
		});
	}

	function setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
	}

	function getCookie(name) {
	  var value = "; " + document.cookie;
	  var parts = value.split("; " + name + "=");
	  if (parts.length == 2) return parts.pop().split(";").shift();
	}

	function textResizer(){
	    $('.js-text-resizer__item').on('click', function() {
	        $('.is-active').removeClass('is-active')
	        $(this).addClass('is-active');
	        var size = $(this).data('size');
	        $('html').attr('class', function(i, c){
            	return c.replace(/(^|\s)font-\S+/g, '');
			}).addClass('font-' + size);
	    });
	}

	function init() {
		google.maps.event.addDomListener(window, 'load', googleMap.init());
		//wait for the DOM to be ready
		$(function(){
			mediaGallery.init();
			showHides.init();
			sidebarNav.init();
			// initialize breakpoint values
			initBreakPoints();
			//style the decorated headings.
			decoratedHeadings();
			// setup custom select boxes
			customSelectBox();
			// show alert message
			initSiteAlert();
			// setup accordion module
			initAccordions();
			// collapse Contact Sidebar
			initContactSidebar();
			// initialize clickable componets
			initClickable();
			// initailize text resizer tool
			textResizer();
			// match Height elements
			initMatchHeight();
			// feedback module
			initFeedback();

			initGlobalNav();
		});
	}

	return {
		init:init
	};


}(window, document, jQuery);

Somerville.Main.init();


/* async loading of Gmaps
var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=googleMap.init';
  document.body.appendChild(script);
*/
},{"./google-map.js":1,"./media-gallery.js":3,"./responsive-tables.js":4,"./show-hide.js":5,"./sidebar-nav.js":6}],3:[function(require,module,exports){
module.exports = function(window, document, $, undefined){
	"use strict";

	var mediaGalleryClass = "js-media-gallery-carousel",
		mediumBreakpoint,
		narrowView = true,
		carousels = new Array();

	function initSlider($el){
		var slider;
		// if the browser is narrow 
		if(window.innerWidth < mediumBreakpoint){
			// create the slider
			slider = createSlider($el);
		} else {
			// otherwise record the browser is wide
			narrowView = false;
		}
		$( window ).resize(function() {
			// if we cross into the narrow view
			if(!narrowView && window.innerWidth < mediumBreakpoint){
				// create the slider
				slider = createSlider($el);
				// otherwise record the browser is narrow
				narrowView = true;
			} 
			// if we cross into the wide view
			if(narrowView && window.innerWidth >= mediumBreakpoint){
				// destroy the slider
				slider.destroySlider();
				// otherwise record the browser is wide
				narrowView = false;
			}

		});

		//$el.data('carousel-index',carousels.length);
		//carousels.push(temp);
	}
	function createSlider($el) {
		return $el.bxSlider({
				pager:false
				//slideWidth:300,
				//maxSlides:3
			});
	}
	function destorySlider(index) {
		carousels[index].destorySlider();
	}

	function init() {
		//wait for the DOM to be ready
		$(function(){
			// set the medium break point value
			mediumBreakpoint = $('.breakpoint-m-min').width();
			// for each media gallery on the page
			$('.' + mediaGalleryClass).each(function(){
				var $el = $(this);
				initSlider($el);
			});
		});
	}

	return {
		init:init
	};

}(window, document, jQuery);

},{}],4:[function(require,module,exports){
/**
 * This file was customized. The following changes were made:
 * 1. Added custom breakpoint
 * 2. Replace ($(window).width() with window.innerWidth
 * 3. Commented out setCellHeights() function
 *     This was causing the tables' cell heights to not match
 */

$(document).ready(function() {
  var switched = false;
  var updateTables = function() {
    var breakpoint = $('.breakpoint-xxl-min').width() - 1;
    
    if ((window.innerWidth < breakpoint) && !switched ){
      switched = true;
      $("table.responsive").each(function(i, element) {
        splitTable($(element));
      });
      return true;
    }
    else if (switched && (window.innerWidth > breakpoint)) {
      switched = false;
      $("table.responsive").each(function(i, element) {
        unsplitTable($(element));
      });
    }
  };
   
  $(window).load(updateTables);
  $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
  $(window).on("resize", updateTables);
   
	
	function splitTable(original)
	{
		original.wrap("<div class='table-wrapper' />");
		
		var copy = original.clone();
		copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
		copy.removeClass("responsive");
		
		original.closest(".table-wrapper").append(copy);
		copy.wrap("<div class='pinned' />");
		original.wrap("<div class='scrollable' />");

    //setCellHeights(original, copy);
	}
	
	function unsplitTable(original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
	}

  function setCellHeights(original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];

    tr.each(function (index) {
      var self = $(this),
          tx = self.find('th, td');

      tx.each(function () {
        var height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });

    });

    tr_copy.each(function (index) {
      $(this).height(heights[index]);
    });
  }

});

},{}],5:[function(require,module,exports){

module.exports = function (window,document,$,undefined) {
	'use strict';

	var debug = false;

	function showHideMore() {
		var classes = {
			parent  : "js-has-more",
			trigger : "js-has-more--trigger",
			active  : "show-all is-expanded",
			fadeIn  : "fade-in"
		};

		if(debug) {
			console.log("The 'showHideMore()' function has been called.");
		}

		if ($('.' + classes.parent)) {
			$('.' + classes.parent).on('click', '.' + classes.trigger, function(event) {
				event.preventDefault();
				var $parent = $(this).parents('.' + classes.parent);
				
				if ($parent.hasClass(classes.active)) {
					// 'more' is already showing, so fade out and hide
					$parent.toggleClass(classes.fadeIn);

					setTimeout(function() {
						// Wait for the fade (css), then hide the items
						$parent.toggleClass(classes.active);
					}, 300);
				} else {
					// time to show more things!
					$parent.toggleClass(classes.active);

					setTimeout(function() {
						$parent.toggleClass(classes.fadeIn);
					}, 100);
				}
			});
		}
	} // functionShowHideMore

    function init() {
    	// Call whatever you want to run at page load, here
    	if(debug) {
			console.log('Greetings, from show-hide.js!');
		}

		showHideMore();

    } // function init()

    return {
    	init: init
    };
}(window,document,jQuery);

},{}],6:[function(require,module,exports){
module.exports = function(window, document, $, undefined){
	'use strict';
	
	var resizeTimeout,
		extraLargeBreakpoint = 1260,
		isNavOpen = false, // flag to indicate whether the sidebar nav is open
		sidebarTargetClass = 'global-nav',
		sidebarClass = 'sidebar-nav__open',
		subnavClass = 'global-nav__sub-nav',
		sidebarTrigger = 'js-global-nav-menu-link',
		primaryNavItem = 'global-nav__main-items',
		sidebarNavCloseClass = 'js-sidebar-nav-close',
		sidebarNavBack = 'js-sidebar-nav-back',
		subnavSelectedClass = 'subnav-selected',
		globalNavItem = 'global-nav__main-items-link';

	/**
	 * Open the sidebar navigation. Toggles appropriate classes.
	 * @return {[void]}
	 */
	function openPrimaryNav() {
		// add to body the sidebarClass
		$('body').addClass(sidebarClass);

		// add to target the sidebarClass
		$('.' + sidebarTargetClass).addClass(sidebarClass);

		// Add top level nav item to sub-nav list in order to navigate
		// to the top level item via click.
		$('.' + subnavClass).each(function() {
			// Create a new sub nav item with the link and text from the top level
			// nav item
			var $navClone = $(this).parent().clone().removeClass()
							.addClass('global-nav__sub-nav-items');

			// remove duplicate subnav, add and remove appropriate classes to
			// match other sub-nav items
			$navClone.children('.global-nav__sub-nav').remove();
			$navClone.children('.global-nav__main-items-link')
				.addClass('global-nav__sub-nav-link')
				.removeClass('global-nav__main-items-link');
			$(this).children('.global-nav__sub-nav-items:first-child').after($navClone);
		});

		isNavOpen = true;
	}

	/**
	 * Open the secondary nav item that corresponds to the clicked primary nav item
	 * @param  {[Object]} 	The primary nav element that has been clicked. Passed as 
	 * 						a jQuery object.
	 * @return {[void]}
	 */
	function openSecondaryNav($selected) {
		$selected.addClass(subnavSelectedClass);
	}

	/**
	 * Close the navigation when clicking the Menu icon,
	 * clicking the close icon, or when resizing the 
	 * window. This function toggles the appropriate classes.
	 * @return {[void]}
	 */
	function closeNav() {
		// remove from body the sidebarClass
		$('body').removeClass(sidebarClass);

		// remove from target the sidebarClass;
		$('.' + sidebarTargetClass).removeClass(sidebarClass);

		// remove secondary nav open classes
		$('.' + subnavClass).removeClass(subnavSelectedClass);

		// Remove the duplicate top level nav item
		$('.global-nav__sub-nav-items:nth-child(2)').remove();

		// set sidebar nav flag
		isNavOpen = false
	}

	/**
	 * Check if the navigation is open; if it is, close it.
	 * @return
	 */
	function windowResized() {
		if ((window.innerWidth >= extraLargeBreakpoint) && (isNavOpen == true)) {
			closeNav();
		}
	}

	function init() {
		$(function() {
			// set the XL Break point
			extraLargeBreakpoint = $('.breakpoint-xxl-min').width() - 1;

			if ($('.' + sidebarTrigger).length) {
				$('.' + sidebarTrigger).click(function(e) {
					e.preventDefault();

					if ($('.' + sidebarClass).length) {
						closeNav();
					} else {
						openPrimaryNav();
					}
				});
			}

			if ($('.' + sidebarNavCloseClass).length) {
				$('.' + sidebarNavCloseClass).click(function() {
					closeNav();
				});
			}

			if ($('.' + sidebarNavBack).length) {
				$('.' + sidebarNavBack).click(function() {
					$(this).parents('.' + subnavClass).removeClass(subnavSelectedClass);
				});
			}

			// Secondary Navigation opening controls
			if ($('.' + primaryNavItem).length) {
				// Add class to each primary nav item that has a subnav
				$('.' + subnavClass).each(function() {
					$(this).parents('.' + primaryNavItem).addClass('has-sub-nav');
				});
				
				// select the anchor tag so that you do not prevent default of
				// secondary nav items
				$('.' + primaryNavItem + ".has-sub-nav").children('a').click(function(e) {
					// only prevent the user from being navigated away if the  
					// sidebar navigation is being used
					if (window.innerWidth <= extraLargeBreakpoint) {
						e.preventDefault();
						openSecondaryNav($(this).siblings('.' + subnavClass));
					}
				});
			}

			$(window).resize(function() {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(function() {
					windowResized();
				}, 200);
			});
		});
	}

	return {
		init: init
	};

}(window, document, jQuery);

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXGFwcFxcanNcXGZpbGVzXFxnb29nbGUtbWFwLmpzIiwiLi5cXGFwcFxcanNcXGZpbGVzXFxpbmRleC5qcyIsIi4uXFxhcHBcXGpzXFxmaWxlc1xcbWVkaWEtZ2FsbGVyeS5qcyIsIi4uXFxhcHBcXGpzXFxmaWxlc1xccmVzcG9uc2l2ZS10YWJsZXMuanMiLCIuLlxcYXBwXFxqc1xcZmlsZXNcXHNob3ctaGlkZS5qcyIsIi4uXFxhcHBcXGpzXFxmaWxlc1xcc2lkZWJhci1uYXYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdHZhciBtYXBDb250YWluZXJDbGFzcyA9IFwianMtZ29vZ2xlLW1hcFwiLFxyXG5cdFx0bGF0bG5nQ2l0eUhhbGwgPSBcIlwiLFxyXG5cdFx0bGF0bG5nRFBXID0gXCJcIixcclxuXHRcdGxhdGxuZ1BhcmtpbmcgPSBcIlwiLFxyXG5cdFx0bGF0bG5nU2FmZXR5ID0gXCJcIixcclxuXHRcdGdvb2dsZU1hcCxcclxuXHRcdGN1cnJlbnRJbmZvV2luZG93LFxyXG5cdFx0em9vbSA9IDEzO1xyXG5cclxuXHRmdW5jdGlvbiBzZXRab29tKCkge1xyXG5cdFx0aWYoJCgnLmJyZWFrcG9pbnQtbS1taW4nKS53aWR0aCgpIDw9IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuXHRcdFx0em9vbSA9IDE0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0TG9jYXRpb25zKCl7XHJcblx0XHRsYXRsbmdDaXR5SGFsbCA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDIuMzg3MjA2LCAtNzEuMDk4MTY5KTtcclxuXHRcdGxhdGxuZ0RQVyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDIuMzk2ODk0LCAtNzEuMTA3NDQxKTtcclxuXHRcdGxhdGxuZ1BhcmtpbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDQyLjQwMDEyNywgLTcxLjEyNTI2Myk7XHJcblx0XHRsYXRsbmdTYWZldHkgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDQyLjM3OTIxOCwgLTcxLjA5MjU5MCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjcmVhdGVNYXAoKXtcclxuXHRcdHZhciBtYXBDb250YWluZXIgPSAkKCcuJyArIG1hcENvbnRhaW5lckNsYXNzKVswXTtcclxuXHJcblx0XHR2YXIgbWFwT3B0aW9ucyA9IHtcclxuXHRcdFx0c2Nyb2xsd2hlZWw6IGZhbHNlLFxyXG5cdFx0XHR6b29tOiB6b29tLFxyXG5cdFx0XHRjZW50ZXI6IGxhdGxuZ0NpdHlIYWxsXHJcblx0XHR9O1xyXG5cclxuXHRcdGdvb2dsZU1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwQ29udGFpbmVyLG1hcE9wdGlvbnMpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY3JlYXRlTWFya2Vycygpe1xyXG5cdFx0Y3JlYXRlTWFya2VyKFwiQ2l0eSBIYWxsXCIsbGF0bG5nQ2l0eUhhbGwpO1xyXG5cdFx0Y3JlYXRlTWFya2VyKFwiRFBXXCIsbGF0bG5nRFBXKTtcclxuXHRcdGNyZWF0ZU1hcmtlcihcIlBhcmtpbmcgYW5kIFRyYWZmaWNcIixsYXRsbmdQYXJraW5nKTtcclxuXHRcdGNyZWF0ZU1hcmtlcihcIlB1YmxpYyBTYWZldHlcIixsYXRsbmdTYWZldHkpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBjcmVhdGVNYXJrZXIodGl0bGUsIHBvc2l0aW9uKXtcclxuXHRcdHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG5cdFx0XHRjb250ZW50OiAnPGRpdiBjbGFzcz1cImluZm8td2luZG93XCI+JyArIHRpdGxlICsgJzwvZGl2PidcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuXHRcdFx0cG9zaXRpb246IHBvc2l0aW9uLFxyXG5cdFx0XHR0aXRsZTp0aXRsZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0bWFya2VyLnNldE1hcChnb29nbGVNYXApO1xyXG5cclxuXHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChjdXJyZW50SW5mb1dpbmRvdykge1xyXG5cdFx0XHRcdGN1cnJlbnRJbmZvV2luZG93LmNsb3NlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y3VycmVudEluZm9XaW5kb3cgPSBpbmZvV2luZG93O1xyXG5cdFx0XHRpbmZvV2luZG93Lm9wZW4oZ29vZ2xlTWFwLG1hcmtlcik7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQoKXtcclxuXHRcdC8vd2FpdCBmb3IgZG9tIHJlYWR5XHJcblx0XHQkKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCQoJy4nICsgbWFwQ29udGFpbmVyQ2xhc3MpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHNldFpvb20oKTtcclxuXHRcdFx0XHRzZXRMb2NhdGlvbnMoKTtcclxuXHRcdFx0XHRjcmVhdGVNYXAoKTtcclxuXHRcdFx0XHRjcmVhdGVNYXJrZXJzKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6aW5pdFxyXG5cdH1cclxuXHJcbn0od2luZG93LGRvY3VtZW50LGpRdWVyeSk7IiwidmFyIFNvbWVydmlsbGUgPSBTb21lcnZpbGxlIHx8IHt9O1xuXG5Tb21lcnZpbGxlLk1haW4gPSBmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpIHtcblx0XCJ1c2Ugc3RyaWN0XCJcblxuXHR2YXIgYnJlYWtQb2ludExhcmdlTWluID0gODMxO1xuXHRcblx0Ly8gbG9hZCBtb2R1bGVzIFxuXHR2YXIgc2hvd0hpZGVzID0gcmVxdWlyZShcIi4vc2hvdy1oaWRlLmpzXCIpLFxuXHRcdG1lZGlhR2FsbGVyeSA9IHJlcXVpcmUoXCIuL21lZGlhLWdhbGxlcnkuanNcIiksXG5cdFx0Z29vZ2xlTWFwID0gcmVxdWlyZShcIi4vZ29vZ2xlLW1hcC5qc1wiKSxcblx0XHRzaWRlYmFyTmF2ID0gcmVxdWlyZShcIi4vc2lkZWJhci1uYXYuanNcIiksXG5cdFx0cmVzcG9uc2l2ZVRhYmxlcyA9IHJlcXVpcmUoXCIuL3Jlc3BvbnNpdmUtdGFibGVzLmpzXCIpO1xuXG5cdGZ1bmN0aW9uIGluaXRCcmVha1BvaW50cygpIHtcblx0XHRicmVha1BvaW50TGFyZ2VNaW4gPSAkKCcuYnJlYWtwb2ludC1sLW1pbicpLmxlbmd0aCA/ICQoJy5icmVha3BvaW50LWwtbWluJykud2lkdGgoKSA6IGJyZWFrUG9pbnRMYXJnZU1pbjtcblx0fVxuXHRcblx0ZnVuY3Rpb24gZGVjb3JhdGVkSGVhZGluZ3MoKSB7XG5cdFx0Ly8gZmluZCBhbGwgZGVjb3JhdGVkIGhlYWRpbmdzXG5cdFx0JCgnLmhlYWRpbmctZGVjb3JhdGVkJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gaWYgaXQgaGFzIGEgZGVjb3JhdGVkLWlubmVyIHNwYW4gdGFnXG5cdFx0XHRpZigkKHRoaXMpLmZpbmQoJy5oZWFkaW5nLWRlY29yYXRlZF9faW5uZXInKS5sZW5ndGgpe1xuXHRcdFx0XHQvLyBkbyBub3RoaW5nXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7IC8vIG90aGVyd2lzZVxuXHRcdFx0XHQvLyB3cmFwIHRoZSBjb250ZW50IGluIGEgZGVjb3JhdGVkLWlubmVyIHRhZ1xuXHRcdFx0XHQkKHRoaXMpLndyYXBJbm5lcihcIjxzcGFuIGNsYXNzPSdoZWFkaW5nLWRlY29yYXRlZF9faW5uZXInPjwvc3Bhbj5cIik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBjdXN0b21TZWxlY3RCb3goKSB7XG5cdFx0JCgnLmpzLWN1c3RvbS1zZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQkKHRoaXMpLnNlbGVjdDIoe1xuXHRcdFx0XHRtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdFNpdGVBbGVydCgpIHtcblx0XHQkKCcuanMtYWxlcnQtbWVzc2FnZScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xuXHRcdFx0Ly8gZ2V0IHRoZSB1bmlxdWUgaWQgb2YgdGhlIGFsZXJ0XG5cdFx0XHR2YXIgc2FJRCA9ICRlbC5kYXRhKCdhbGVydC1pZCcpO1xuXHRcdFx0Ly8gYXR0ZW1wdCB0byBnZXQgdGhlIGlkIGZyb20gdGhlIHNpdGUgYWxlcnQgY29va2llXG5cdFx0XHR2YXIgc2FDb29raWUgPSBnZXRDb29raWUoXCJhbGVydE1lc3NhZ2VcIiArIHNhSUQpO1xuXHRcdFx0Ly8gaWYgc3VjY2Vzc2Z1bCBhbmQgY29va2llcycgaWQgYW5kIGFsZXJ0cyBpZHMgbWF0Y2hcblx0XHRcdGlmKHNhQ29va2llICE9PSBcIlwiICYmIHBhcnNlSW50KHNhQ29va2llKSA9PT0gc2FJRCkge1xuXHRcdFx0XHQvLyBkbyBub3RoaW5nXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8vIHNob3cgdGhlIGFsZXJ0IG1lc3NhZ2Vcblx0XHRcdCRlbC5hZGRDbGFzcygnaXMtdmlzaWJsZScpO1xuXHRcdFx0XG5cdFx0XHQvLyBpZiB0aGUgdXNlciBjbG9zZXMgdGhlIGFsZXJ0IG1lc3NhZ2Vcblx0XHRcdCRlbC5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0Ly8gaGlkZSB0aGUgYWxlcnQgbWVzc2FnZVxuXHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy12aXNpYmxlJyk7XG5cdFx0XHRcdC8vIHNldCBhIHNpdGUgYWxlcnQgY29va2llIHdpdGggdGhlIGFsZXJ0cycgaWQgdmFsdWUuXG5cdFx0XHRcdHNldENvb2tpZShcImFsZXJ0TWVzc2FnZVwiICsgc2FJRCwgc2FJRCwgMzY1KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBpbml0Q29udGFjdFNpZGViYXIoKXtcblx0XHQkKCcuanMtY29udGFjdC1zYicpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkZWwgPSAkKHRoaXMpLFxuXHRcdFx0XHRpc01vYmlsZSA9IGZhbHNlLFxuXHRcdFx0XHRyZXNpemVUaW1lb3V0O1xuXHRcdFx0XG5cdFx0XHQkZWwuZmluZCgnLmpzLWFjY29yZGlvbi1saW5rJykuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgYnJlYWtQb2ludExhcmdlTWluKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdC8vIHRvZ2dsZSB0aGUgZXhwYW5kZWQgc3RhdGVcblx0XHRcdFx0XHQkZWwudG9nZ2xlQ2xhc3MoJ2lzLWV4cGFuZGVkJykuZmluZCgnLmpzLWFjY29yZGlvbi1jb250ZW50Jykuc3RvcCh0cnVlLHRydWUpLnNsaWRlVG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQocmVzaXplVGltZW91dCk7XG5cdFx0XHRcdHJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IGJyZWFrUG9pbnRMYXJnZU1pbikge1xuXHRcdFx0XHRcdFx0aWYgKCFpc01vYmlsZSkge1xuXHRcdFx0XHRcdFx0XHQkZWwucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJykuZmluZCgnLmpzLWFjY29yZGlvbi1jb250ZW50Jykuc3RvcCh0cnVlLHRydWUpLnNsaWRlVXAoKTtcblx0XHRcdFx0XHRcdFx0aXNNb2JpbGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBicmVha1BvaW50TGFyZ2VNaW4pIHtcblx0XHRcdFx0XHRcdGlmIChpc01vYmlsZSkge1xuXHRcdFx0XHRcdFx0XHQkZWwuYWRkQ2xhc3MoJ2lzLWV4cGFuZGVkJykuZmluZCgnLmpzLWFjY29yZGlvbi1jb250ZW50Jykuc3RvcCh0cnVlLHRydWUpLnNsaWRlRG93bigpO1xuXHRcdFx0XHRcdFx0XHRpc01vYmlsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgMjAwKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdEFjY29yZGlvbnMoKXtcblx0XHQkKCcuanMtYWNjb3JkaW9uLW1vZHVsZScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xuXHRcdFx0Ly8gQWRkIGNsaWNrIGV2ZW50IHRvIHRoZSBjb250cm9sc1xuXHRcdFx0JGVsLmZpbmQoJy5qcy1hY2NvcmRpb24tbGluaycpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdC8vIGlmIGl0IGlzIHRoZSBjb250YWN0IHNpZGUgYmFyXG5cblx0XHRcdFx0Ly8gdG9nZ2xlIHRoZSBleHBhbmRlZCBzdGF0ZVxuXHRcdFx0XHQkZWwudG9nZ2xlQ2xhc3MoJ2lzLWV4cGFuZGVkJykuZmluZCgnLmpzLWFjY29yZGlvbi1jb250ZW50Jykuc3RvcCh0cnVlLHRydWUpLnNsaWRlVG9nZ2xlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXHRmdW5jdGlvbiBpbml0Q2xpY2thYmxlKCl7XG5cdFx0JCgnLmpzLWNsaWNrYWJsZScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdC8vIGlmIHRoZSB0aGlzIGlzIGNsaWNrZWRcblx0XHRcdCQodGhpcykuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHZhciAkZWwgPSAkKHRoaXMpLmZpbmQoJy5qcy1jbGlja2FibGUtbGluaycpLmZpcnN0KCk7XG5cdFx0XHRcdC8vIGZpbmQgdGhlIGRlc3RpbmF0aW9uXG5cdFx0XHRcdHZhciBkZXN0ID0gJGVsLmF0dHIoXCJocmVmXCIpO1xuXHRcdFx0XHQvLyBpZiB0aGUgdGFyZ2V0IGF0dHJpYnV0ZSBleGlzdHNcblx0XHRcdFx0aWYoXCJfYmxhbmtcIiA9PT0gJGVsLmF0dHIoXCJ0YXJnZXRcIikpIHtcblx0XHRcdFx0XHQvLyBsYXVuY2ggbmV3IHRhYi93aW5kb3dcblx0XHRcdFx0XHR3aW5kb3cub3BlbihkZXN0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBvdGhlcndpc2UgcmVkaXJlY3QgdG8gYSBuZXcgcGFnZSBcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSBkZXN0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXRNYXRjaEhlaWdodCgpe1xuXHRcdCQoJy5qcy1lcXVhbC1oZWlnaHQnKS5tYXRjaEhlaWdodCgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdEZlZWRiYWNrKCl7XG5cdFx0JCgnLmpzLWxlYXZlLWZlZWRiYWNrLWxpbmsnKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcygnaXMtdmlzaWJsZScpO1xuXHRcdH0pO1xuXG5cdH1cblx0ZnVuY3Rpb24gaW5pdEdsb2JhbE5hdigpe1xuXHRcdCQoJy5qcy1nbG9iYWwtbmF2LWxpbmsnKS5rZXlkb3duKGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdC8vIDM3IGxlZnQsIDM4IHVwLCAzOSByaWdodCwgNDAgZG93blxuXHRcdFx0c3dpdGNoKGV2ZW50LmtleUNvZGUpIHtcblx0XHRcdCAgICBjYXNlIDM3OlxuXHRcdFx0ICAgIFx0JCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcblx0XHRcdCAgICBcdCQodGhpcykucGFyZW50KCkucHJldigpLmFkZENsYXNzKCdpcy1leHBhbmRlZCcpLmZpbmQoJy5qcy1nbG9iYWwtbmF2LWxpbmsnKS5mb2N1cygpO1xuXHRcdFx0ICAgICAgICBicmVhaztcblx0XHRcdCAgICBjYXNlIDM4OlxuXHRcdFx0XHQgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcblx0XHRcdCAgICAgICAgYnJlYWs7XG5cdFx0ICAgICAgICBjYXNlIDM5OlxuXHRcdCAgICAgICAgXHQkKHRoaXMpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1xuXHRcdCAgICAgICAgXHQkKHRoaXMpLnBhcmVudCgpLm5leHQoKS5hZGRDbGFzcygnaXMtZXhwYW5kZWQnKS5maW5kKCcuanMtZ2xvYmFsLW5hdi1saW5rJykuZm9jdXMoKTtcblx0XHQgICAgICAgICAgICBicmVhaztcblx0XHQgICAgICAgIGNhc2UgNDA6XG5cdFx0XHQgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ2lzLWV4cGFuZGVkJykpe1xuXHRcdFx0ICAgICAgICBcdCQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG5cdFx0XHQgICAgICAgIH0gZWxzZSB7XG5cdFx0XHQgICAgICAgIFx0JCgnLmpzLWdsb2JhbC1uYXYtbGluaycpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1x0XHRcdFx0XG5cdFx0XHQgICAgICAgIFx0JCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnaXMtZXhwYW5kZWQnKTtcblx0XHRcdCAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xuXHQgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuXHQgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XG5cdCAgICB2YXIgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIitkLnRvVVRDU3RyaW5nKCk7XG5cdCAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArIFwiPVwiICsgY3ZhbHVlICsgXCI7IFwiICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG5cdCAgdmFyIHZhbHVlID0gXCI7IFwiICsgZG9jdW1lbnQuY29va2llO1xuXHQgIHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiOyBcIiArIG5hbWUgKyBcIj1cIik7XG5cdCAgaWYgKHBhcnRzLmxlbmd0aCA9PSAyKSByZXR1cm4gcGFydHMucG9wKCkuc3BsaXQoXCI7XCIpLnNoaWZ0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0ZXh0UmVzaXplcigpe1xuXHQgICAgJCgnLmpzLXRleHQtcmVzaXplcl9faXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICQoJy5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJylcblx0ICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0ICAgICAgICB2YXIgc2l6ZSA9ICQodGhpcykuZGF0YSgnc2l6ZScpO1xuXHQgICAgICAgICQoJ2h0bWwnKS5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uKGksIGMpe1xuICAgICAgICAgICAgXHRyZXR1cm4gYy5yZXBsYWNlKC8oXnxcXHMpZm9udC1cXFMrL2csICcnKTtcblx0XHRcdH0pLmFkZENsYXNzKCdmb250LScgKyBzaXplKTtcblx0ICAgIH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdsb2FkJywgZ29vZ2xlTWFwLmluaXQoKSk7XG5cdFx0Ly93YWl0IGZvciB0aGUgRE9NIHRvIGJlIHJlYWR5XG5cdFx0JChmdW5jdGlvbigpe1xuXHRcdFx0bWVkaWFHYWxsZXJ5LmluaXQoKTtcblx0XHRcdHNob3dIaWRlcy5pbml0KCk7XG5cdFx0XHRzaWRlYmFyTmF2LmluaXQoKTtcblx0XHRcdC8vIGluaXRpYWxpemUgYnJlYWtwb2ludCB2YWx1ZXNcblx0XHRcdGluaXRCcmVha1BvaW50cygpO1xuXHRcdFx0Ly9zdHlsZSB0aGUgZGVjb3JhdGVkIGhlYWRpbmdzLlxuXHRcdFx0ZGVjb3JhdGVkSGVhZGluZ3MoKTtcblx0XHRcdC8vIHNldHVwIGN1c3RvbSBzZWxlY3QgYm94ZXNcblx0XHRcdGN1c3RvbVNlbGVjdEJveCgpO1xuXHRcdFx0Ly8gc2hvdyBhbGVydCBtZXNzYWdlXG5cdFx0XHRpbml0U2l0ZUFsZXJ0KCk7XG5cdFx0XHQvLyBzZXR1cCBhY2NvcmRpb24gbW9kdWxlXG5cdFx0XHRpbml0QWNjb3JkaW9ucygpO1xuXHRcdFx0Ly8gY29sbGFwc2UgQ29udGFjdCBTaWRlYmFyXG5cdFx0XHRpbml0Q29udGFjdFNpZGViYXIoKTtcblx0XHRcdC8vIGluaXRpYWxpemUgY2xpY2thYmxlIGNvbXBvbmV0c1xuXHRcdFx0aW5pdENsaWNrYWJsZSgpO1xuXHRcdFx0Ly8gaW5pdGFpbGl6ZSB0ZXh0IHJlc2l6ZXIgdG9vbFxuXHRcdFx0dGV4dFJlc2l6ZXIoKTtcblx0XHRcdC8vIG1hdGNoIEhlaWdodCBlbGVtZW50c1xuXHRcdFx0aW5pdE1hdGNoSGVpZ2h0KCk7XG5cdFx0XHQvLyBmZWVkYmFjayBtb2R1bGVcblx0XHRcdGluaXRGZWVkYmFjaygpO1xuXG5cdFx0XHRpbml0R2xvYmFsTmF2KCk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6aW5pdFxuXHR9O1xuXG5cbn0od2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KTtcblxuU29tZXJ2aWxsZS5NYWluLmluaXQoKTtcblxuXG4vKiBhc3luYyBsb2FkaW5nIG9mIEdtYXBzXG52YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gIHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP3Y9My5leHAnICtcbiAgICAgICcmc2lnbmVkX2luPXRydWUmY2FsbGJhY2s9Z29vZ2xlTWFwLmluaXQnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4qLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0dmFyIG1lZGlhR2FsbGVyeUNsYXNzID0gXCJqcy1tZWRpYS1nYWxsZXJ5LWNhcm91c2VsXCIsXHJcblx0XHRtZWRpdW1CcmVha3BvaW50LFxyXG5cdFx0bmFycm93VmlldyA9IHRydWUsXHJcblx0XHRjYXJvdXNlbHMgPSBuZXcgQXJyYXkoKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdFNsaWRlcigkZWwpe1xyXG5cdFx0dmFyIHNsaWRlcjtcclxuXHRcdC8vIGlmIHRoZSBicm93c2VyIGlzIG5hcnJvdyBcclxuXHRcdGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgbWVkaXVtQnJlYWtwb2ludCl7XHJcblx0XHRcdC8vIGNyZWF0ZSB0aGUgc2xpZGVyXHJcblx0XHRcdHNsaWRlciA9IGNyZWF0ZVNsaWRlcigkZWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gb3RoZXJ3aXNlIHJlY29yZCB0aGUgYnJvd3NlciBpcyB3aWRlXHJcblx0XHRcdG5hcnJvd1ZpZXcgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdCQoIHdpbmRvdyApLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gaWYgd2UgY3Jvc3MgaW50byB0aGUgbmFycm93IHZpZXdcclxuXHRcdFx0aWYoIW5hcnJvd1ZpZXcgJiYgd2luZG93LmlubmVyV2lkdGggPCBtZWRpdW1CcmVha3BvaW50KXtcclxuXHRcdFx0XHQvLyBjcmVhdGUgdGhlIHNsaWRlclxyXG5cdFx0XHRcdHNsaWRlciA9IGNyZWF0ZVNsaWRlcigkZWwpO1xyXG5cdFx0XHRcdC8vIG90aGVyd2lzZSByZWNvcmQgdGhlIGJyb3dzZXIgaXMgbmFycm93XHJcblx0XHRcdFx0bmFycm93VmlldyA9IHRydWU7XHJcblx0XHRcdH0gXHJcblx0XHRcdC8vIGlmIHdlIGNyb3NzIGludG8gdGhlIHdpZGUgdmlld1xyXG5cdFx0XHRpZihuYXJyb3dWaWV3ICYmIHdpbmRvdy5pbm5lcldpZHRoID49IG1lZGl1bUJyZWFrcG9pbnQpe1xyXG5cdFx0XHRcdC8vIGRlc3Ryb3kgdGhlIHNsaWRlclxyXG5cdFx0XHRcdHNsaWRlci5kZXN0cm95U2xpZGVyKCk7XHJcblx0XHRcdFx0Ly8gb3RoZXJ3aXNlIHJlY29yZCB0aGUgYnJvd3NlciBpcyB3aWRlXHJcblx0XHRcdFx0bmFycm93VmlldyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8kZWwuZGF0YSgnY2Fyb3VzZWwtaW5kZXgnLGNhcm91c2Vscy5sZW5ndGgpO1xyXG5cdFx0Ly9jYXJvdXNlbHMucHVzaCh0ZW1wKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gY3JlYXRlU2xpZGVyKCRlbCkge1xyXG5cdFx0cmV0dXJuICRlbC5ieFNsaWRlcih7XHJcblx0XHRcdFx0cGFnZXI6ZmFsc2VcclxuXHRcdFx0XHQvL3NsaWRlV2lkdGg6MzAwLFxyXG5cdFx0XHRcdC8vbWF4U2xpZGVzOjNcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGRlc3RvcnlTbGlkZXIoaW5kZXgpIHtcclxuXHRcdGNhcm91c2Vsc1tpbmRleF0uZGVzdG9yeVNsaWRlcigpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdC8vd2FpdCBmb3IgdGhlIERPTSB0byBiZSByZWFkeVxyXG5cdFx0JChmdW5jdGlvbigpe1xyXG5cdFx0XHQvLyBzZXQgdGhlIG1lZGl1bSBicmVhayBwb2ludCB2YWx1ZVxyXG5cdFx0XHRtZWRpdW1CcmVha3BvaW50ID0gJCgnLmJyZWFrcG9pbnQtbS1taW4nKS53aWR0aCgpO1xyXG5cdFx0XHQvLyBmb3IgZWFjaCBtZWRpYSBnYWxsZXJ5IG9uIHRoZSBwYWdlXHJcblx0XHRcdCQoJy4nICsgbWVkaWFHYWxsZXJ5Q2xhc3MpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgJGVsID0gJCh0aGlzKTtcclxuXHRcdFx0XHRpbml0U2xpZGVyKCRlbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDppbml0XHJcblx0fTtcclxuXHJcbn0od2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KTtcclxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgd2FzIGN1c3RvbWl6ZWQuIFRoZSBmb2xsb3dpbmcgY2hhbmdlcyB3ZXJlIG1hZGU6XG4gKiAxLiBBZGRlZCBjdXN0b20gYnJlYWtwb2ludFxuICogMi4gUmVwbGFjZSAoJCh3aW5kb3cpLndpZHRoKCkgd2l0aCB3aW5kb3cuaW5uZXJXaWR0aFxuICogMy4gQ29tbWVudGVkIG91dCBzZXRDZWxsSGVpZ2h0cygpIGZ1bmN0aW9uXG4gKiAgICAgVGhpcyB3YXMgY2F1c2luZyB0aGUgdGFibGVzJyBjZWxsIGhlaWdodHMgdG8gbm90IG1hdGNoXG4gKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIHZhciBzd2l0Y2hlZCA9IGZhbHNlO1xuICB2YXIgdXBkYXRlVGFibGVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJyZWFrcG9pbnQgPSAkKCcuYnJlYWtwb2ludC14eGwtbWluJykud2lkdGgoKSAtIDE7XG4gICAgXG4gICAgaWYgKCh3aW5kb3cuaW5uZXJXaWR0aCA8IGJyZWFrcG9pbnQpICYmICFzd2l0Y2hlZCApe1xuICAgICAgc3dpdGNoZWQgPSB0cnVlO1xuICAgICAgJChcInRhYmxlLnJlc3BvbnNpdmVcIikuZWFjaChmdW5jdGlvbihpLCBlbGVtZW50KSB7XG4gICAgICAgIHNwbGl0VGFibGUoJChlbGVtZW50KSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChzd2l0Y2hlZCAmJiAod2luZG93LmlubmVyV2lkdGggPiBicmVha3BvaW50KSkge1xuICAgICAgc3dpdGNoZWQgPSBmYWxzZTtcbiAgICAgICQoXCJ0YWJsZS5yZXNwb25zaXZlXCIpLmVhY2goZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuICAgICAgICB1bnNwbGl0VGFibGUoJChlbGVtZW50KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gICBcbiAgJCh3aW5kb3cpLmxvYWQodXBkYXRlVGFibGVzKTtcbiAgJCh3aW5kb3cpLm9uKFwicmVkcmF3XCIsZnVuY3Rpb24oKXtzd2l0Y2hlZD1mYWxzZTt1cGRhdGVUYWJsZXMoKTt9KTsgLy8gQW4gZXZlbnQgdG8gbGlzdGVuIGZvclxuICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgdXBkYXRlVGFibGVzKTtcbiAgIFxuXHRcblx0ZnVuY3Rpb24gc3BsaXRUYWJsZShvcmlnaW5hbClcblx0e1xuXHRcdG9yaWdpbmFsLndyYXAoXCI8ZGl2IGNsYXNzPSd0YWJsZS13cmFwcGVyJyAvPlwiKTtcblx0XHRcblx0XHR2YXIgY29weSA9IG9yaWdpbmFsLmNsb25lKCk7XG5cdFx0Y29weS5maW5kKFwidGQ6bm90KDpmaXJzdC1jaGlsZCksIHRoOm5vdCg6Zmlyc3QtY2hpbGQpXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHRcdGNvcHkucmVtb3ZlQ2xhc3MoXCJyZXNwb25zaXZlXCIpO1xuXHRcdFxuXHRcdG9yaWdpbmFsLmNsb3Nlc3QoXCIudGFibGUtd3JhcHBlclwiKS5hcHBlbmQoY29weSk7XG5cdFx0Y29weS53cmFwKFwiPGRpdiBjbGFzcz0ncGlubmVkJyAvPlwiKTtcblx0XHRvcmlnaW5hbC53cmFwKFwiPGRpdiBjbGFzcz0nc2Nyb2xsYWJsZScgLz5cIik7XG5cbiAgICAvL3NldENlbGxIZWlnaHRzKG9yaWdpbmFsLCBjb3B5KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gdW5zcGxpdFRhYmxlKG9yaWdpbmFsKSB7XG4gICAgb3JpZ2luYWwuY2xvc2VzdChcIi50YWJsZS13cmFwcGVyXCIpLmZpbmQoXCIucGlubmVkXCIpLnJlbW92ZSgpO1xuICAgIG9yaWdpbmFsLnVud3JhcCgpO1xuICAgIG9yaWdpbmFsLnVud3JhcCgpO1xuXHR9XG5cbiAgZnVuY3Rpb24gc2V0Q2VsbEhlaWdodHMob3JpZ2luYWwsIGNvcHkpIHtcbiAgICB2YXIgdHIgPSBvcmlnaW5hbC5maW5kKCd0cicpLFxuICAgICAgICB0cl9jb3B5ID0gY29weS5maW5kKCd0cicpLFxuICAgICAgICBoZWlnaHRzID0gW107XG5cbiAgICB0ci5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgdmFyIHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgIHR4ID0gc2VsZi5maW5kKCd0aCwgdGQnKTtcblxuICAgICAgdHguZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSAkKHRoaXMpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICBoZWlnaHRzW2luZGV4XSA9IGhlaWdodHNbaW5kZXhdIHx8IDA7XG4gICAgICAgIGlmIChoZWlnaHQgPiBoZWlnaHRzW2luZGV4XSkgaGVpZ2h0c1tpbmRleF0gPSBoZWlnaHQ7XG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdHJfY29weS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgJCh0aGlzKS5oZWlnaHQoaGVpZ2h0c1tpbmRleF0pO1xuICAgIH0pO1xuICB9XG5cbn0pO1xuIiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHdpbmRvdyxkb2N1bWVudCwkLHVuZGVmaW5lZCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIGRlYnVnID0gZmFsc2U7XHJcblxyXG5cdGZ1bmN0aW9uIHNob3dIaWRlTW9yZSgpIHtcclxuXHRcdHZhciBjbGFzc2VzID0ge1xyXG5cdFx0XHRwYXJlbnQgIDogXCJqcy1oYXMtbW9yZVwiLFxyXG5cdFx0XHR0cmlnZ2VyIDogXCJqcy1oYXMtbW9yZS0tdHJpZ2dlclwiLFxyXG5cdFx0XHRhY3RpdmUgIDogXCJzaG93LWFsbCBpcy1leHBhbmRlZFwiLFxyXG5cdFx0XHRmYWRlSW4gIDogXCJmYWRlLWluXCJcclxuXHRcdH07XHJcblxyXG5cdFx0aWYoZGVidWcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUaGUgJ3Nob3dIaWRlTW9yZSgpJyBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQuXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgkKCcuJyArIGNsYXNzZXMucGFyZW50KSkge1xyXG5cdFx0XHQkKCcuJyArIGNsYXNzZXMucGFyZW50KS5vbignY2xpY2snLCAnLicgKyBjbGFzc2VzLnRyaWdnZXIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR2YXIgJHBhcmVudCA9ICQodGhpcykucGFyZW50cygnLicgKyBjbGFzc2VzLnBhcmVudCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKCRwYXJlbnQuaGFzQ2xhc3MoY2xhc3Nlcy5hY3RpdmUpKSB7XHJcblx0XHRcdFx0XHQvLyAnbW9yZScgaXMgYWxyZWFkeSBzaG93aW5nLCBzbyBmYWRlIG91dCBhbmQgaGlkZVxyXG5cdFx0XHRcdFx0JHBhcmVudC50b2dnbGVDbGFzcyhjbGFzc2VzLmZhZGVJbik7XHJcblxyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0Ly8gV2FpdCBmb3IgdGhlIGZhZGUgKGNzcyksIHRoZW4gaGlkZSB0aGUgaXRlbXNcclxuXHRcdFx0XHRcdFx0JHBhcmVudC50b2dnbGVDbGFzcyhjbGFzc2VzLmFjdGl2ZSk7XHJcblx0XHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyB0aW1lIHRvIHNob3cgbW9yZSB0aGluZ3MhXHJcblx0XHRcdFx0XHQkcGFyZW50LnRvZ2dsZUNsYXNzKGNsYXNzZXMuYWN0aXZlKTtcclxuXHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQkcGFyZW50LnRvZ2dsZUNsYXNzKGNsYXNzZXMuZmFkZUluKTtcclxuXHRcdFx0XHRcdH0sIDEwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9IC8vIGZ1bmN0aW9uU2hvd0hpZGVNb3JlXHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIFx0Ly8gQ2FsbCB3aGF0ZXZlciB5b3Ugd2FudCB0byBydW4gYXQgcGFnZSBsb2FkLCBoZXJlXHJcbiAgICBcdGlmKGRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdHcmVldGluZ3MsIGZyb20gc2hvdy1oaWRlLmpzIScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNob3dIaWRlTW9yZSgpO1xyXG5cclxuICAgIH0gLy8gZnVuY3Rpb24gaW5pdCgpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgIFx0aW5pdDogaW5pdFxyXG4gICAgfTtcclxufSh3aW5kb3csZG9jdW1lbnQsalF1ZXJ5KTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xuXHQndXNlIHN0cmljdCc7XG5cdFxuXHR2YXIgcmVzaXplVGltZW91dCxcblx0XHRleHRyYUxhcmdlQnJlYWtwb2ludCA9IDEyNjAsXG5cdFx0aXNOYXZPcGVuID0gZmFsc2UsIC8vIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciB0aGUgc2lkZWJhciBuYXYgaXMgb3BlblxuXHRcdHNpZGViYXJUYXJnZXRDbGFzcyA9ICdnbG9iYWwtbmF2Jyxcblx0XHRzaWRlYmFyQ2xhc3MgPSAnc2lkZWJhci1uYXZfX29wZW4nLFxuXHRcdHN1Ym5hdkNsYXNzID0gJ2dsb2JhbC1uYXZfX3N1Yi1uYXYnLFxuXHRcdHNpZGViYXJUcmlnZ2VyID0gJ2pzLWdsb2JhbC1uYXYtbWVudS1saW5rJyxcblx0XHRwcmltYXJ5TmF2SXRlbSA9ICdnbG9iYWwtbmF2X19tYWluLWl0ZW1zJyxcblx0XHRzaWRlYmFyTmF2Q2xvc2VDbGFzcyA9ICdqcy1zaWRlYmFyLW5hdi1jbG9zZScsXG5cdFx0c2lkZWJhck5hdkJhY2sgPSAnanMtc2lkZWJhci1uYXYtYmFjaycsXG5cdFx0c3VibmF2U2VsZWN0ZWRDbGFzcyA9ICdzdWJuYXYtc2VsZWN0ZWQnLFxuXHRcdGdsb2JhbE5hdkl0ZW0gPSAnZ2xvYmFsLW5hdl9fbWFpbi1pdGVtcy1saW5rJztcblxuXHQvKipcblx0ICogT3BlbiB0aGUgc2lkZWJhciBuYXZpZ2F0aW9uLiBUb2dnbGVzIGFwcHJvcHJpYXRlIGNsYXNzZXMuXG5cdCAqIEByZXR1cm4ge1t2b2lkXX1cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5QcmltYXJ5TmF2KCkge1xuXHRcdC8vIGFkZCB0byBib2R5IHRoZSBzaWRlYmFyQ2xhc3Ncblx0XHQkKCdib2R5JykuYWRkQ2xhc3Moc2lkZWJhckNsYXNzKTtcblxuXHRcdC8vIGFkZCB0byB0YXJnZXQgdGhlIHNpZGViYXJDbGFzc1xuXHRcdCQoJy4nICsgc2lkZWJhclRhcmdldENsYXNzKS5hZGRDbGFzcyhzaWRlYmFyQ2xhc3MpO1xuXG5cdFx0Ly8gQWRkIHRvcCBsZXZlbCBuYXYgaXRlbSB0byBzdWItbmF2IGxpc3QgaW4gb3JkZXIgdG8gbmF2aWdhdGVcblx0XHQvLyB0byB0aGUgdG9wIGxldmVsIGl0ZW0gdmlhIGNsaWNrLlxuXHRcdCQoJy4nICsgc3VibmF2Q2xhc3MpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBDcmVhdGUgYSBuZXcgc3ViIG5hdiBpdGVtIHdpdGggdGhlIGxpbmsgYW5kIHRleHQgZnJvbSB0aGUgdG9wIGxldmVsXG5cdFx0XHQvLyBuYXYgaXRlbVxuXHRcdFx0dmFyICRuYXZDbG9uZSA9ICQodGhpcykucGFyZW50KCkuY2xvbmUoKS5yZW1vdmVDbGFzcygpXG5cdFx0XHRcdFx0XHRcdC5hZGRDbGFzcygnZ2xvYmFsLW5hdl9fc3ViLW5hdi1pdGVtcycpO1xuXG5cdFx0XHQvLyByZW1vdmUgZHVwbGljYXRlIHN1Ym5hdiwgYWRkIGFuZCByZW1vdmUgYXBwcm9wcmlhdGUgY2xhc3NlcyB0b1xuXHRcdFx0Ly8gbWF0Y2ggb3RoZXIgc3ViLW5hdiBpdGVtc1xuXHRcdFx0JG5hdkNsb25lLmNoaWxkcmVuKCcuZ2xvYmFsLW5hdl9fc3ViLW5hdicpLnJlbW92ZSgpO1xuXHRcdFx0JG5hdkNsb25lLmNoaWxkcmVuKCcuZ2xvYmFsLW5hdl9fbWFpbi1pdGVtcy1saW5rJylcblx0XHRcdFx0LmFkZENsYXNzKCdnbG9iYWwtbmF2X19zdWItbmF2LWxpbmsnKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2dsb2JhbC1uYXZfX21haW4taXRlbXMtbGluaycpO1xuXHRcdFx0JCh0aGlzKS5jaGlsZHJlbignLmdsb2JhbC1uYXZfX3N1Yi1uYXYtaXRlbXM6Zmlyc3QtY2hpbGQnKS5hZnRlcigkbmF2Q2xvbmUpO1xuXHRcdH0pO1xuXG5cdFx0aXNOYXZPcGVuID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVuIHRoZSBzZWNvbmRhcnkgbmF2IGl0ZW0gdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgY2xpY2tlZCBwcmltYXJ5IG5hdiBpdGVtXG5cdCAqIEBwYXJhbSAge1tPYmplY3RdfSBcdFRoZSBwcmltYXJ5IG5hdiBlbGVtZW50IHRoYXQgaGFzIGJlZW4gY2xpY2tlZC4gUGFzc2VkIGFzIFxuXHQgKiBcdFx0XHRcdFx0XHRhIGpRdWVyeSBvYmplY3QuXG5cdCAqIEByZXR1cm4ge1t2b2lkXX1cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5TZWNvbmRhcnlOYXYoJHNlbGVjdGVkKSB7XG5cdFx0JHNlbGVjdGVkLmFkZENsYXNzKHN1Ym5hdlNlbGVjdGVkQ2xhc3MpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlIHRoZSBuYXZpZ2F0aW9uIHdoZW4gY2xpY2tpbmcgdGhlIE1lbnUgaWNvbixcblx0ICogY2xpY2tpbmcgdGhlIGNsb3NlIGljb24sIG9yIHdoZW4gcmVzaXppbmcgdGhlIFxuXHQgKiB3aW5kb3cuIFRoaXMgZnVuY3Rpb24gdG9nZ2xlcyB0aGUgYXBwcm9wcmlhdGUgY2xhc3Nlcy5cblx0ICogQHJldHVybiB7W3ZvaWRdfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2xvc2VOYXYoKSB7XG5cdFx0Ly8gcmVtb3ZlIGZyb20gYm9keSB0aGUgc2lkZWJhckNsYXNzXG5cdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKHNpZGViYXJDbGFzcyk7XG5cblx0XHQvLyByZW1vdmUgZnJvbSB0YXJnZXQgdGhlIHNpZGViYXJDbGFzcztcblx0XHQkKCcuJyArIHNpZGViYXJUYXJnZXRDbGFzcykucmVtb3ZlQ2xhc3Moc2lkZWJhckNsYXNzKTtcblxuXHRcdC8vIHJlbW92ZSBzZWNvbmRhcnkgbmF2IG9wZW4gY2xhc3Nlc1xuXHRcdCQoJy4nICsgc3VibmF2Q2xhc3MpLnJlbW92ZUNsYXNzKHN1Ym5hdlNlbGVjdGVkQ2xhc3MpO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBkdXBsaWNhdGUgdG9wIGxldmVsIG5hdiBpdGVtXG5cdFx0JCgnLmdsb2JhbC1uYXZfX3N1Yi1uYXYtaXRlbXM6bnRoLWNoaWxkKDIpJykucmVtb3ZlKCk7XG5cblx0XHQvLyBzZXQgc2lkZWJhciBuYXYgZmxhZ1xuXHRcdGlzTmF2T3BlbiA9IGZhbHNlXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhlIG5hdmlnYXRpb24gaXMgb3BlbjsgaWYgaXQgaXMsIGNsb3NlIGl0LlxuXHQgKiBAcmV0dXJuXG5cdCAqL1xuXHRmdW5jdGlvbiB3aW5kb3dSZXNpemVkKCkge1xuXHRcdGlmICgod2luZG93LmlubmVyV2lkdGggPj0gZXh0cmFMYXJnZUJyZWFrcG9pbnQpICYmIChpc05hdk9wZW4gPT0gdHJ1ZSkpIHtcblx0XHRcdGNsb3NlTmF2KCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQkKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gc2V0IHRoZSBYTCBCcmVhayBwb2ludFxuXHRcdFx0ZXh0cmFMYXJnZUJyZWFrcG9pbnQgPSAkKCcuYnJlYWtwb2ludC14eGwtbWluJykud2lkdGgoKSAtIDE7XG5cblx0XHRcdGlmICgkKCcuJyArIHNpZGViYXJUcmlnZ2VyKS5sZW5ndGgpIHtcblx0XHRcdFx0JCgnLicgKyBzaWRlYmFyVHJpZ2dlcikuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdGlmICgkKCcuJyArIHNpZGViYXJDbGFzcykubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRjbG9zZU5hdigpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvcGVuUHJpbWFyeU5hdigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkKCcuJyArIHNpZGViYXJOYXZDbG9zZUNsYXNzKS5sZW5ndGgpIHtcblx0XHRcdFx0JCgnLicgKyBzaWRlYmFyTmF2Q2xvc2VDbGFzcykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y2xvc2VOYXYoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkKCcuJyArIHNpZGViYXJOYXZCYWNrKS5sZW5ndGgpIHtcblx0XHRcdFx0JCgnLicgKyBzaWRlYmFyTmF2QmFjaykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuJyArIHN1Ym5hdkNsYXNzKS5yZW1vdmVDbGFzcyhzdWJuYXZTZWxlY3RlZENsYXNzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNlY29uZGFyeSBOYXZpZ2F0aW9uIG9wZW5pbmcgY29udHJvbHNcblx0XHRcdGlmICgkKCcuJyArIHByaW1hcnlOYXZJdGVtKS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gQWRkIGNsYXNzIHRvIGVhY2ggcHJpbWFyeSBuYXYgaXRlbSB0aGF0IGhhcyBhIHN1Ym5hdlxuXHRcdFx0XHQkKCcuJyArIHN1Ym5hdkNsYXNzKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykucGFyZW50cygnLicgKyBwcmltYXJ5TmF2SXRlbSkuYWRkQ2xhc3MoJ2hhcy1zdWItbmF2Jyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gc2VsZWN0IHRoZSBhbmNob3IgdGFnIHNvIHRoYXQgeW91IGRvIG5vdCBwcmV2ZW50IGRlZmF1bHQgb2Zcblx0XHRcdFx0Ly8gc2Vjb25kYXJ5IG5hdiBpdGVtc1xuXHRcdFx0XHQkKCcuJyArIHByaW1hcnlOYXZJdGVtICsgXCIuaGFzLXN1Yi1uYXZcIikuY2hpbGRyZW4oJ2EnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0Ly8gb25seSBwcmV2ZW50IHRoZSB1c2VyIGZyb20gYmVpbmcgbmF2aWdhdGVkIGF3YXkgaWYgdGhlICBcblx0XHRcdFx0XHQvLyBzaWRlYmFyIG5hdmlnYXRpb24gaXMgYmVpbmcgdXNlZFxuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBleHRyYUxhcmdlQnJlYWtwb2ludCkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0b3BlblNlY29uZGFyeU5hdigkKHRoaXMpLnNpYmxpbmdzKCcuJyArIHN1Ym5hdkNsYXNzKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVvdXQpO1xuXHRcdFx0XHRyZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR3aW5kb3dSZXNpemVkKCk7XG5cdFx0XHRcdH0sIDIwMCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59KHdpbmRvdywgZG9jdW1lbnQsIGpRdWVyeSk7XG4iXX0=
