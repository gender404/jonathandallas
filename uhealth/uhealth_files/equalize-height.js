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

  // Equal height elements
  $('.featured__img, .featured__content').matchHeight();
  $('.story__img, .story__content').matchHeight();
  $('.class-event__info').matchHeight();
  $('.clinical-top__block').matchHeight();
  $('.cta-50-percent').matchHeight();
  $('.testimonials__item').matchHeight();

})(jQuery);
