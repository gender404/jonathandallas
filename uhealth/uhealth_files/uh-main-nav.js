/**
 * @file
 * A JavaScript file for the main nav.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2016 Palantir.net
 */

(function ($) {

    // Set breakpoint variable
    var $bpMain = 1200,
        $menuCloseDrawer = $('.main-nav__close-drawer'),
        $navClickAllowed = $(window).width() > $bpMain;

    // Main nav dropdown
    $('.main-nav__link').click(function (e) {
        if ($navClickAllowed) {
            // If nav element has dropdown content as a sibling
            if ($(this).siblings('.main-nav__dropdown').length) {
                // If clicked item is active, remove classes
                if ($(this).hasClass('js-active-dropdown')) {
                    $(this).removeClass('js-active-dropdown');
                    $(this).siblings('.main-nav__dropdown').hide();
                    $('.global-header__dept').show();
                    $('.overlay').removeClass('js-active-overlay');
                } else {
                    // If clicked item not active, add classes
                    $('.main-nav__link').removeClass('js-active-dropdown');
                    $('.main-nav__dropdown').hide();
                    $(this).addClass('js-active-dropdown');
                    $(this).siblings('.main-nav__dropdown').show();
                    $('.global-header__dept').hide();
                    $('.overlay').addClass('js-active-overlay');

                }
                e.preventDefault();
            }
        } else {
            // If has mobile nav dropdown, toggle the display of mobile dropdown
            if ($(this).siblings('.mobile-nav__dropdown').length) {
                $(this).toggleClass('active-mobile');
                $(this).siblings('.mobile-nav__dropdown').toggle();
                e.preventDefault();
            }
        }
    });

    function onLoad() {
        // Hide menu on page load
        $('.mobile-nav__dropdown').hide();
    };

    function onResize() {
        // If viewport is larger than $bpMain
        if ($(window).width() > $bpMain) {
            $navClickAllowed = true;
        } else {
            $navClickAllowed = false;
        }
    };

    // Execute on load and resize
    $(window).on('load', onLoad);
    $(window).on('resize', onResize);


    // Menu nav drawer close button trigger
    $menuCloseDrawer.click(function () {
        $('.main-nav__link').removeClass('js-active-dropdown');
        $('.main-nav__dropdown').hide();
        $('.global-header__dept').show();
        $('.overlay').removeClass('js-active-overlay');
    });

    // Hide dropdown when last list item is out of focus
    $menuCloseDrawer.focusout(function () {
        $('.main-nav__link').removeClass('js-active-dropdown');
        $('.main-nav__dropdown').hide();
        $('.overlay').removeClass('js-active-overlay');
    });

    // Main nav search button
    $('.main-nav__search-trigger, .system-triggers__search').click(function (e) {
        closeMainNavDropdowns();
        $('.global-header__search').addClass('js-open-search');
        $('.main-nav').addClass('js-hide-main-nav');
        $('.global-header__dept').show();

        if ($('.global-search-results').is(':visible')) {
            $('.overlay').addClass('js-active-overlay');
        }
        e.preventDefault();

        // Focus cursor inside search field
        setTimeout(function () {
            $('.global-search-input').focus();
        }, 1000);
    });

    // Close search field on click
    $('.global-search-close').click(function () {
        $('.global-header__search').removeClass('js-open-search');
        $('.main-nav').removeClass('js-hide-main-nav');
        $('.overlay').removeClass('js-active-overlay');
        $('.global-header__dept').show();
    });

    // DISABLING TPYEAHEAD DISPLAY

    //If search input is not empty show search results dropdown
    // $('.global-search-input').keydown(function(e) {
    //   if($(this).val() && $(window).width() > $bpMain) {
    //     if(e.which === 40) {
    //       e.preventDefault();
    //       $(this).blur();
    //       $('.global-search-result__link').first().focus();
    //     }
    //
    //     if(e.which === 38) {
    //       e.preventDefault();
    //       $(this).blur();
    //       $('.global-search-result__link').last().focus();
    //     }
    //
    //     $('.global-search-results').show();
    //     $('.overlay').addClass('js-active-overlay');
    //     $('.global-header__dept').hide();
    //   } else {
    //     $('.global-search-results').hide();
    //     $('.overlay').removeClass('js-active-overlay');
    //   }
    // });

    // $('.global-search-result').keydown(function(e) {
    //   if(e.which === 40 || e.which === 38) {
    //     e.preventDefault();
    //   }
    //
    //   if(e.which === 40) {
    //     $(this).blur();
    //
    //     if($(this).next()[0]) {
    //       $(this).next().find('.global-search-result__link').focus();
    //     } else {
    //       $('.global-search-input').focus();
    //     }
    //   } else if(e.which === 38) {
    //     $(this).blur();
    //
    //     if($(this).prev()[0]) {
    //       $(this).prev().find('.global-search-result__link').focus();
    //     } else {
    //       $('.global-search-input').focus();
    //     }
    //   }
    // });

    $(".global-search-result__link").mouseover(function (e) {
        $(".global-search-result__link").blur();
        $(".global-search-input").focus();
    });

    // Patient portal toggle
    $(".utility__item--mychart > a").click(function (e) {
        $(this)
            .siblings(".mychart-dropdown")
            .toggleClass("js-open-mychart");
        e.preventDefault();
    });

    //Close the nav dropdowns if clicking on overlay
    $(".overlay").click(function (e) {
        closeMainNavDropdowns();

        $(".global-header__search").removeClass("js-open-search");
        $(".main-nav").removeClass("js-hide-main-nav");
        $(".global-header__dept").show();
    });

    //Close the Patient portal Dropdown if clicking anywhere outside of it
    $(document).click(function (e) {
        var $myChartDropdown = $(".mychart-dropdown");
        if ($myChartDropdown.hasClass("js-open-mychart")) {
            if (!e.target.closest(".utility__item--mychart")) {
                $myChartDropdown.toggleClass("js-open-mychart");
            }
        }
    });

    function closeMainNavDropdowns() {
        $(".main-nav__link").removeClass("js-active-dropdown");
        $(".main-nav__dropdown").hide();
        $(".overlay").removeClass("js-active-overlay");
    }
})(jQuery);
