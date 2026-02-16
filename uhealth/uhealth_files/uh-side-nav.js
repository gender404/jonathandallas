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

  Drupal.behaviors.side_nav = {
    attach: function (context, settings) {
      $('.side-navigation-toggle').click(function (e) {
        e.preventDefault();

        $('.side-navigation').toggleClass('open-side-nav');
        $('.side-navigation-toggle').toggleClass('open');
      })
    }
  };

})(jQuery, Drupal);
