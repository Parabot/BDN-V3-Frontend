var tpj = jQuery;
var revapi14;
tpj(document).ready(function() {
	if (tpj("#slider1").revolution == undefined) {
		revslider_showDoubleJqueryError("#slider1");
	} else {
		revapi14 = tpj("#slider1").show().revolution({
			sliderType : "standard",
			jsFileLocation : "assets/",
			sliderLayout : "boxed",
			dottedOverlay : "none",
			delay : 5000,
			navigation : {
				keyboardNavigation : "off",
				keyboard_direction : "horizontal",
				mouseScrollNavigation : "off",
				onHoverStop : "on",
				touch : {
					touchenabled : "on",
					swipe_threshold : 75,
					swipe_min_touches : 50,
					swipe_direction : "horizontal",
					drag_block_vertical : false
				},

				bullets : {
					style : "",
					enable : true,
					hide_onmobile : true,
					hide_onleave : true,
					hide_delay : 200,
					hide_delay_mobile : 1200,
					hide_under : 0,
					hide_over : 9999,
					tmp : '<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>',
					direction : "horizontal",
					space : 15,
					h_align : "center",
					v_align : "bottom",
					h_offset : 0,
					v_offset : 0
				},

				arrows : {
					style : "",
					enable : true,
					hide_onmobile : false,
					hide_onleave : true,
					hide_delay : 200,
					hide_delay_mobile : 1200,
					hide_under : 0,
					hide_over : 9999,
					tmp : '',
					left : {
						h_align : "left",
						v_align : "center",
						h_offset : 20,
						v_offset : 0
					},
					right : {
						h_align : "right",
						v_align : "center",
						h_offset : 20,
						v_offset : 0
					}
				}

			},
			responsiveLevels : [1240, 1024, 778, 480],
			gridwidth : [1240, 1024, 778, 480],
			gridheight : [742, 742, 742, 700],
			lazyType : "none",
			shadow : 0,
			spinner : "off",
			stopLoop : "off",
			stopAfterLoops : 0,
			stopAtSlide : .0,
			shuffle : "off",
			autoHeight : "off",
			fullScreenAlignForce : "off",
			fullScreenOffsetContainer : "",
			fullScreenOffset : "",
			disableProgressBar : "on",
			hideThumbsOnMobile : "off",
			hideSliderAtLimit : 0,
			hideCaptionAtLimit : 0,
			hideAllCaptionAtLilmit : 0,
			debugMode : false,
			fallbacks : {
				simplifyAll : "off",
				nextSlideOnWindowFocus : "off",
				disableFocusListener : false,
			}
		});
	}
});
/*ready*/

