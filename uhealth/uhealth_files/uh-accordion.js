/**
 * @file
 * A JavaScript file for enabling Chosen jquery library on select boxes.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2016 Palantir.net
 */

(function ($) {

  Drupal.behaviors.accordion = {
    attach: function (context, settings) {
      $(document).ready(function () {
          $('.panel').hide();
          $('.accordion-group.open > .panel').show();
      });

      $('.accordion').click(function (e) {
        e.preventDefault();
        $(this).closest('.accordion-group').find('.panel').toggle();
        $(this).closest('.accordion-group').toggleClass('open');
        $(this).toggleClass('open');
      });

        $('.show').click(function (e) {
            //Toggle sibling panels (should only be one)
            $(this).siblings('.panel').slideToggle();
            $(this).siblings('.panel').toggleClass('open');

            //Get text in button and replace first word
            var buttonText = $(this).text().trim().split(' ');
            var showText = $(this).data('show-text') ? $(this).data('show-text') : 'Show';
            var hideText = $(this).data('hide-text') ? $(this).data('hide-text') : 'Hide';

            var firstWord = $(this).siblings('.panel').hasClass('open') ? hideText : showText;
            buttonText[0] = firstWord;

            //Replace text in button with new text
            buttonText = buttonText.join(' ');
            $(this).text(buttonText);
      });
    }
  };

})(jQuery, Drupal);
