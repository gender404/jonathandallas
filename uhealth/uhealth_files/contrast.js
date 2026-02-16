/**
 * @file
 * A JavaScript file for the contrast buttons and contrast cookie.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2016 Palantir.net
 */

(function ($) {

  $(document).ready(function() {
    var highContrast = getCookieValue('high-contrast');
    if(highContrast === 'true') {
      $('body').addClass('high-contrast');
    }
  });

  $('.contrast-black').click(function(e) {
    e.preventDefault();

    $('body').addClass('high-contrast');
    document.cookie = 'high-contrast=true';
  });

  $('.contrast-normal').click(function(e) {
    e.preventDefault();

    $('body').removeClass('high-contrast');
    document.cookie = 'high-contrast=false';
  });

  function getCookieValue(name) {
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
      var args = cookies[i].split('=');
      if(args[0] === name) {
        return args[1];
      }
    }

    return undefined;
  }

})(jQuery);
