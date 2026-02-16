/**
 * @file
 * A JavaScript file containing the main menu functionality (small/large screen)
 *
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth


(function ($) {

  // Simple item accordion
  $('.simple-accordion__button').click(function() {
    //UMMSMS-10
  //  $('.simple-accordion__button').removeClass('js-accordion-open');
  //  $('.simple-accordion__button').attr("aria-expanded","false");
  //  $('.simple-accordion__content').slideUp();
    if($(this).next().is(':hidden') == true) {
      $(this).addClass('js-accordion-open');
      $(this).attr("aria-expanded","true");
      $(this).next().slideDown();
    }else{
      $(this).next().slideUp();
      $(this).removeClass('js-accordion-open');
      $(this).attr("aria-expanded","false");
    }

    /* UMMSMS-10
    $('html, body').animate({
      scrollTop: ($(this).offset().top)
    }, 0); */
  });

  // Hide all accordion content on page load
  $('.simple-accordion__content').hide();

  // Show accordion content on page load if aria-expanded equals true
  $('.simple-accordion__button').each(function() {
    if ( $(this).attr('aria-expanded') == 'true' ) {
      $(this).addClass('js-accordion-open');
      $(this).siblings('.simple-accordion__content').show();
    }
  });

})(jQuery);
