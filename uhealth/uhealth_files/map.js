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

    $(document).ready(function () {
      //$('.location-map').css("height", screen.availHeight);
      $('.location-side-panel').hide();
      calculate_results_height();
    });

    $('.location-side-accordion').click(function (e) {
      e.preventDefault();
      $('.location-side-panel').toggle();
      $('.location-side-accordion').toggleClass('open');

      calculate_results_height();
    });

    $(window).resize(function() {
      calculate_results_height();
    });

    function calculate_results_height() {
      var side_bar_height = $('.location-side-bar').height();
      var filters_height = $('.location-side-bar__filters').height();
      $('.location-side-results').css("max-height", side_bar_height - filters_height);
    }

})(jQuery);
