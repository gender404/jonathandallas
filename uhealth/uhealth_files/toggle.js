/**
 * @file
 * A JavaScript file for the site.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2016 Palantir.net
 */

(function ($) {

    $('.button--toggle').click(function (e) {
      e.preventDefault();

      if(!$(this).hasClass('active-view')) {
        $('.button--toggle').toggleClass('active-view');
      }
    });

    $('.side-filters').hide();

    $('.side-filters-toggle').click(function(e) {
      e.preventDefault();

      $(this).toggleClass('open');
      $(this).siblings('.side-filters').slideToggle();
    });

})(jQuery);
