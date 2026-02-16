/**
 * @file
 * A JavaScript file for the card flip component.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2019 Palantir.net
 */

(function ($) {
  
  function checkTouchDevice() {
    return 'ontouchstart' in document.documentElement;
  }
  
  // Set variables
  var cards = $('.cards');
  var cardFlip = $('.card-flip');
  var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

  // Set editor view (EE) variable
  const editorView = document.querySelector("body.is-page-editor");

  // Trigger keyboard navigation of cards
  cardFlip.each(function () {
    if (!editorView) {
      // Handle 'space bar' and 'enter' click events,
      // expected behaviour for an actual <button> element
      $(this).on('keydown', function(e) {
        if (e.which === 32 || e.which === 13) {
          e.preventDefault();
  
          // Change aria-flipped state based on what's active
          if ($(this).attr('aria-pressed') == 'false') {
            $(this).attr('aria-pressed', 'true');
          }
          else {
            $(this).attr('aria-pressed', 'false');
          }
        }
      });
      
      if (checkTouchDevice()) {
        $(this).on('click', function(e) {
          e.preventDefault();
  
          // Change aria-flipped state based on what's active
          if ($(this).attr('aria-pressed') == 'false') {
            $(this).attr('aria-pressed', 'true');
            $(this).addClass('is-active');
          }
          else {
            $(this).attr('aria-pressed', 'false');
            $(this).removeClass('is-active');
          }
        });
      } else {
        $(this).on('mouseenter', function(e) {
          e.preventDefault();
          $(this).attr('aria-pressed', 'true');
          $(this).addClass('is-active');
        });
        
        $(this).on('mouseleave', function(e) {
          e.preventDefault();
          $(this).attr('aria-pressed', 'false');
          $(this).removeClass('is-active');
        });
      }
      
      // Flip card back to front when focusout
      $(this).on('focusout', function(e) {
        $(this).attr('aria-pressed', 'false');
        $(this).removeClass('is-active');
      });

      // Set height of card rows
      $(window).on('resize load reload', function() {
        cards.each(function () {
          // Get an array of all element heights
          var $element = $(this);
          var $elementHeights = $element.find('.card-flip__front .card-flip__content').map(function() { 
            var height;

            // IE11 can't handle the outerheight of the content so we're doing some hacky hacks
            if(isIE11){
              var iconHeight = $(this).find(".card-flip__icon").outerHeight() || 0;
              var titleHeight = $(this).find(".card-flip__title").outerHeight() || 0;
              var descHeight = $(this).find(".card-flip__desc").outerHeight() ||0;
              height = iconHeight + titleHeight + descHeight + 140; //adding 120 for the padding
            }else {
              height = $(this).outerHeight();
            }
            return height;
          }).get();

          // Math.max takes a variable number of arguments
          // `apply` is equivalent to passing each height as an argument
          var maxHeight = Math.max.apply(null, $elementHeights);
          // Set each height to the max height
          $element.find('.card-flip').height(maxHeight);
        });
      });
    } else {
      // Remove card styles for better usability in EE
      $(this).css({
        "height": "100%"
      });

      $(this).find(".card-flip__front").css({
        "position": "relative"
      });

      $(this).find(".card-flip__back").css({
        "transform": "none",
        "position": "relative"
      });

      $(this).find(".card-flip__back .card-flip__content").css({
        "opacity": "1"
      });

      // Allows card to be editable in EE
      $(this).find(".container").css({
        "flex-direction": "column"
      })
    }
  });
})(jQuery);
