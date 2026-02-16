/**
 * @file
 * A JavaScript file for the Step Form template and component.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2017 Palantir.net
 */

(function ($) {

  $(document).ready(function() {
    $('.step-form__form').validate({
      errorPlacement: function(error, element) {
        if (element.attr("type") === "radio") {
          error.insertBefore(element);
        } else {
          error.insertAfter(element);
        }
      },

      rules: {
        phone: {
          required: true,
          phoneUS: true
        },

        day: {
          required: true,
          min: 01,
          max: 31
        },

        month: {
          required: true,
          min: 01,
          max: 12
        },

        year: {
          required: true,
          min: 1900,
          max: 2017
        },

        zip: {
          required: true,
          zipcodeUS: true
        },
      }
    });
  });

  // Conditional field to appointment form
  $('.field--conditional').click(function() {
    if($('#yes-2').is(':checked')) {
      $(this).parent('fieldset').next('.field--hidden').slideDown().children('input').prop('required', true);
    } else if ($('#no-2').is(':checked')) {
      $(this).parent('fieldset').next('.field--hidden').slideUp().children('input').prop('required', false);
    }
  });

  $('.step-form__nav-next-btn').click(function(e) {
    e.preventDefault();

    if(!$('.step-form__form').valid()) {
      return;
    }

    var active_tab = $('.step-form__tab.active');
    var next_tab_num = parseInt(active_tab.attr('id').match(/\d/)) + 1;
    var next_tab_id = '#tab-' + next_tab_num;
    var content_tab = '.tab-' + next_tab_num + '-content';

    $('.step-form__tab').removeClass('active');
    $(next_tab_id).addClass('active');

    $('.tab-content').removeClass('active');
    $(content_tab).addClass('active');

    handleButtons(next_tab_num);
  });

  $('.step-form__nav-prev-btn').click(function(e) {
    e.preventDefault();

    var active_tab = $('.step-form__tab.active');
    var prev_tab_num = parseInt(active_tab.attr('id').match(/\d/)) - 1;
    var prev_tab_id = '#tab-' + prev_tab_num;
    var content_tab = '.tab-' + prev_tab_num + '-content';

    $('.step-form__tab').removeClass('active');
    $(prev_tab_id).addClass('active');

    $('.tab-content').removeClass('active');
    $(content_tab).addClass('active');

    handleButtons(prev_tab_num);
  });

  //Prevent enter key from submitting form without validating tabs
  $('form.step-form__form').keydown(function(e) {
    if(e.keyCode === 13) {
      e.preventDefault();

      if(!$('.step-form__form').valid()) {
        return;
      }

      if($('.step-form__tab.active').attr('id') === 'tab-6') {
        $('.step-form__submit').click();
      } else {
        $('.step-form__nav-next-btn').click();
      }
    }
  });

  $('.main-nav__dropdown-search .button').click(function(e) {
    e.preventDefault();

    var url = $("select#department-type").val();
    if (url) {
      window.location = url;
    }
    return false;
  });

  function enableButton(b) {
    b.removeClass('button--hidden');
  }

  function disableButton(b) {
    b.addClass('button--hidden');
  }

  function handleButtons(tab_num) {
    if(tab_num === 1) {
      disableButton($('.step-form__nav-prev-btn'));
      enableButton($('.step-form__nav-next-btn'));
      disableButton($('.step-form__submit'));
    } else if(tab_num === 6) {
      enableButton($('.step-form__nav-prev-btn'));
      disableButton($('.step-form__nav-next-btn'));
      enableButton($('.step-form__submit'));
    } else {
      enableButton($('.step-form__nav-prev-btn'));
      enableButton($('.step-form__nav-next-btn'));
      disableButton($('.step-form__submit'));
    }
  }

})(jQuery);
