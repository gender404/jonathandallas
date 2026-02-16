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
      $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeTo(0, 1); 
        } else {
            $('#back-to-top').fadeTo(0, 0);
        }
    });
    
    $('#back-to-top').click(function(e) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})(jQuery);
