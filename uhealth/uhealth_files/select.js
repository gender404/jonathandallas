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

  $('.chosen-select').on('chosen:ready', function(evt, params) {
    $(this).siblings('.chosen-container').each(function() {
      $(this).find('input.chosen-search-input').attr('aria-label', $.trim($(this).siblings('label').text()));
    });
  });

  //Enable Chosen.js on select elements
  $('.treatment-select__selection').chosen({width: '100%'});
  $('.chosen-select').chosen({width: '100%'});
  $('.location-search__type').chosen({width: '100%'});

  // Online Appointments chosen
  $('.online-app-results').hide();
  $('.online-app-select').chosen({width: '100%'}).change(function() {
    $('.online-app-results').slideDown();
  });

  //Center select element on window
  centerChosenSelect();

  function centerChosenSelect() {
    $('.chosen-container').css("display","block");
    $('.chosen-container').css("margin","0 auto");
  }

})(jQuery);
