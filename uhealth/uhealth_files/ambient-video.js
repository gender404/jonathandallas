/**
 * @file
 * A JavaScript file for ambient video.
 *
 * Our JavaScript must be wrapped in a closure.
 * @see https://drupal.org/node/1446420
 * @see http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * @copyright Copyright 2018 Palantir.net
 */

(function ($) {

  var youTubeInit = 0;

  $(window).on('resize', function () {
    initPlayers();
  });

  window.onYouTubeIframeAPIReady = function() {
    youTubeInit = 2;
    initPlayers();
  };

  /**
   * Initializes YouTube player script as needed.
   */
  function initYouTube() {
    if (youTubeInit != 0) {
      return;
    }

    youTubeInit = 1;
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  /**
   * Initializes players.
   */
  function initPlayers () {
    if ($(window).width() < 600) {
      return;
    }

    $('.ambient-video:not(.ambient-video-initialized), .ambient-video-vimeo:not(.ambient-video-initialized)').each(function () {
      switch (this.dataset.ambientVideoProvider) {
        case 'youtube':
          if (youTubeInit != 2) {
            initYouTube();
            return;
          }
          addYouTubePlayer(this, this.dataset.ambientVideoId);
          break;

        case 'vimeo':
          addVimeoPlayer(this, this.dataset.ambientVideoId);
          break;

        default:
          addDefaultVideoPlayer(this);
      }

      $(this).addClass('ambient-video-initialized');
    });
  }

  /**
   * Add a YouTube player.
   */
  function addYouTubePlayer(el, id) {
    player = new YT.Player(el, {
      width: '100%',
      height: '100%',
      // Pass video id
      videoId: id,
      playerVars: {
        autoplay: 1,        // Auto-play the video on load
		mute: 1,			// to enable autoplay
        controls: 0,        // Show pause/play buttons in player
        showinfo: 0,        // Hide the video title
        modestbranding: 1,  // Hide the Youtube Logo
        loop: 1,           //  Run the video in a loop
        fs: 0,              // Hide the full screen button
        cc_load_policy: 0, // Hide closed captions
        iv_load_policy: 3,  // Hide the Video Annotations
        autohide: 0,         // Hide video controls when playing
        volume: 0,
        // Pass video id
        playlist: id,
        rel: 0
      },
      events: {
        'onReady': youtubePlayerReady
      }
    });
  }

  /**
   * YouTube player ready callback.
   */
  function youtubePlayerReady(event) {
    var player = event.target;
    
    player.playVideo().setVolume(0);

    var playButton = $(player.getIframe()).parents().find('.hero-video-play'); 
    var pauseButton = $(player.getIframe()).parents().find('.hero-video-pause');

    // Bind events.
    playButton.click(function() {
      player.playVideo();
      $(this).toggleClass('is-active', false).siblings().toggleClass('is-active', true);
    });

    pauseButton.click(function() {
      player.pauseVideo();
      $(this).toggleClass('is-active', false).siblings().toggleClass('is-active', true);
    });
  }

  /**
   * Add a Vimeo player.
   */
  function addVimeoPlayer(el, id) {
    var vimeoOptions = {
      id: id,
      width: '100%',
      height: '100%',
      autoplay: true,
      loop: true,
      background: true
    };

    var vimeoPlayer = new Vimeo.Player(el, vimeoOptions);

    vimeoPlayer.setVolume(0);
    vimeoPlayer.disableTextTrack();

    // Play/Pause Controls For Vimeo.
    var playButton = $(el).parents().find('.hero-video-play');
    var pauseButton = $(el).parents().find('.hero-video-pause');

    playButton.click(function () {
      vimeoPlayer.play();
      $(this).toggleClass('is-active', false).siblings().toggleClass('is-active', true);
    }).click();

    pauseButton.click(function () {
      vimeoPlayer.pause();
      $(this).toggleClass('is-active', false).siblings().toggleClass('is-active', true);
    });
  }

  /**
   * Add a HTML5 player.
   */
  function addDefaultVideoPlayer(el) {
     // Play/Pause Controls For HTML5 video.
     var playButton = $(el).parents().find('.hero-video-play');
     var pauseButton = $(el).parents().find('.hero-video-pause');

     playButton.click(function () {
       el.play();
       $(this).toggleClass('is-active', false).siblings().toggleClass('is-active', true);
     }).click();
 
     pauseButton.click(function () {
       el.pause();
       $(this).toggleClass('is-active', false).siblings().toggleClass('is-active', true);
     });
  }

  initPlayers();

})(jQuery);
