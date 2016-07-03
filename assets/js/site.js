(function($) {"use strict";
	var isMobile;
	$(document).ready(function() {
		$('.collapse').collapse();
		if ($('.parallax').length) {
			$('.parallax').each(function() {
				parallax($(this), 0.1);
			});
		}

		$(window).scroll(function() {
			if ($('.parallax').length) {
				$('.parallax').each(function() {
					parallax($(this), 0.1);
				});
			}
		});
		if ($(".select").length) {
			$(".select").selectbox();
		}
		if ($("#owl-demo").length) {
			$("#owl-demo").owlCarousel({
				navigation : false,
				slideSpeed : 300,
				paginationSpeed : 400,
				singleItem : true
			});
		}
		if ($("#owl-demo-new").length) {
			$("#owl-demo-new").owlCarousel({
				navigation : true,
				pagination : false,
				items : 4,
				itemsDesktop : [1199, 4],
				itemsDesktopSmall : [979, 3],
				itemsTablet : [768, 2],
				itemsMobile : [479, 1],
				slideSpeed : 300,
				paginationSpeed : 400,
				singleItem : false
			});
		}
		if ($("#news-owl-demo").length) {
			$("#news-owl-demo").owlCarousel({
				navigation : true,
				pagination : false,
				items : 3,
				itemsDesktop : [1199, 3],
				itemsDesktopSmall : [979, 3],
				itemsTablet : [768, 2],
				itemsMobile : [479, 1],
				slideSpeed : 300,
				paginationSpeed : 400,
				singleItem : false
			});
		}
		if ($("#banner-owl-demo").length) {
			$("#banner-owl-demo").owlCarousel({
				navigation : true,
				pagination : false,
				items : 4,
				itemsDesktop : [1199, 4],
				itemsDesktopSmall : [979, 3],
				itemsTablet : [768, 2],
				itemsMobile : [479, 1],
				slideSpeed : 300,
				paginationSpeed : 400,
				singleItem : false
			});
		}
		if ($("#product-section").length) {
			$("#product-section").owlCarousel({
				navigation : true,
				pagination : false,
				items : 4,
				itemsDesktop : [1199, 4],
				itemsDesktopSmall : [979,4],
				itemsTablet : 	[768,4],
				itemsTabletSmall : [767,2],
				itemsMobile : [479,1],
				singleItem : false
			});
		}
		if ($('#slider1').length) {
			jQuery("#slider1").revolution({
				sliderType : "standard",
				sliderLayout : "auto",
				responsiveLevels : [4096, 1024, 778, 480],
				gridwidth : [1920, 1900, 750, 400],
				gridheight : [900, 800, 600, 600],
				delay : 9000,
				navigation : {
					arrows : {
						enable : true
					},
					bullets : {
						enable : true,
						h_align : "center",
						v_align : "bottom",
						space : 10,
					}
				},
				// gridwidth : 1920,
				// gridheight : 900

			});
		}

		/* This is basic - uses default settings */
		if ($('a.single_image').length) {
			$("a.single_image").fancybox();
		}

		/* Using custom settings */
		if ($('a#inline').length) {
			$("a#inline").fancybox({
				'hideOnContentClick' : true
			});
		}

		/* Apply fancybox to multiple items */
		if ($('a.group').length) {
			$("a.group").fancybox({
				'transitionIn' : 'elastic',
				'transitionOut' : 'elastic',
				'speedIn' : 600,
				'speedOut' : 200,
				'overlayShow' : false
			});
		}

		// Svg implement
		jQuery('img.svg').each(function() {
			var $img = jQuery(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			jQuery.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = jQuery(data).find('svg');

				// Add replaced image's ID to the new SVG
				if ( typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if ( typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass + ' replaced-svg');
				}

				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');

				// Replace image with new SVG
				$img.replaceWith($svg);

			}, 'xml');
		});
		if ($('#accordion_2').length) {
			$('#accordion_2').conventAccordion({
				autoPlay : false,
				startSlide : 1,
				slideInterval : 4000,
				pauseOnHover : true,
				actOnHover : false,
				continuous : true,
				easing : 'easeInOutQuart'
			});

			$(window).resize(function() {

				$('#accordion_2').conventAccordion({
					autoPlay : false,
					startSlide : 1,
					slideInterval : 4000,
					pauseOnHover : true,
					actOnHover : false,
					continuous : true,
					easing : 'easeInOutQuart'
				});

			});
		}

		$('.main-menu').on('click', function() {
			$('.menu-links').slideToggle();
		});
		$('.mmenu').on('click', function() {
			$(this).next().slideToggle();
		});		$('body').on('click', function() {
			
			$('.item-block').slideUp();
		});
		$('.item-block').on('click',function(e){
			e.stopPropagation();
		});
		$('body').on('click', '.open-cart', function(e) {
			e.stopPropagation();
			$('.item-block').slideToggle();
		});
		$('.menu-section').on('click', function() {
			$(this).find('.fa').toggleClass('fa-bars').toggleClass('fa-times');
			$('.navigation').slideToggle();
		});
		if (jQuery("#countdown").length) {
			//==========countdown=======
			jQuery("#countdown").countdown({
				//Time set = Year, Month,Date
				until : new Date(2015, 12, 19)
			});
		}

		// Filltering.................
		$('#project-terms li:first ').addClass('active')

		function showProjectsbyCat(cat) {
			var owl = $("#product-section").data('owlCarousel');

			owl.addItem('<div/>', 0);

			var nb = owl.itemsAmount;
			for (var i = 0; i < (nb - 1); i++) {
				owl.removeItem(1);
			}

			if (cat == 'all') {
				$('#projects-copy .main-item').each(function() {
					owl.addItem($(this).clone().fadeIn(2000));

				});
			} else {
				$('#projects-copy .main-item.' + cat).each(function() {
					owl.addItem($(this).clone().fadeIn(2000));

				});
			}
			owl.removeItem(0);
		}


		$('#product-section .main-item').clone().appendTo($('#projects-copy'));
		$('#project-terms li').on('click', function(e) {
			e.preventDefault();
			$('#project-terms li ').removeClass('active');

			var cat = $(this).attr('ID');
			$(this).addClass('active');
			showProjectsbyCat(cat);
		});		if ($('#slider-meter').length) {
			$("#slider-meter").slider({
				range : true,
				min : 16,
				max : 200,
				values : [16, 200],
				slide : function(event, ui) {
					$("#amount2").text("$" + ui.values[0] );
					$("#amount1").text("$" + ui.values[1]);
				}
			});

			$("#amount2").text("$" + $("#slider-meter").slider("values", 0) );

			$("#amount1").text("$" + $("#slider-meter").slider("values", 1));

		}

		$('.size-selection ul li a').on('click', function(e) {
			e.preventDefault();
			$('.size-selection ul li a').removeClass('active');
			$(this).addClass('active');
		});

		$('.color-selection ul li a').on('click', function(e) {
			e.preventDefault();
			$('.color-selection ul li a').parent('.color-selection ul li').removeClass('active');
			$(this).parent('.color-selection ul li').addClass('active');
		});

		$('.filter-btn a').on('click', function(e) {
			e.preventDefault();
			$('.mobile-view').slideToggle();
		});
		if ($('#map-box').length) {
			var map = new GMaps({
				div : '#map-box',
				lat : 39.676521,
				lng : -104.962289,

				disableDefaultUI : true,
				zoom : 11,
				scrollwheel : false,
				styles : [{
					"featureType" : "all",
					"elementType" : "all",
					"stylers" : [{
						"saturation" : -100
					}, {
						"gamma" : 1
					}]
				}]
			});
			map.drawOverlay({
				lat : map.getCenter().lat(),
				lng : map.getCenter().lng(),
				content : '<a href="#" class="mapmarker"></a>',
				verticalAlign : 'top',
				horizontalAlign : 'center'

			});

			if ($(window).width() >= 1200) {
				map.setOptions({

					center : new google.maps.LatLng(39.676521, -104.962289),
				});
			} else if ($(window).width() >= 992) {
				map.setOptions({

					center : new google.maps.LatLng(39.676521, -104.962289),
				});
			} else if ($(window).width() >= 768) {
				map.setOptions({

					center : new google.maps.LatLng(39.676521, -104.962289),
				});
			} else {
				map.setOptions({

					center : new google.maps.LatLng(39.676521, -104.962289),
				});
			}
		}

		$('.blog-pagination').find("li").on('click', function() {
			$('.blog-pagination').find('li').removeClass('active');
			$(this).addClass('active');
		});

		$('.categories-shop-pagging').find("li").on('click', function() {
			$('.categories-shop-pagging').find('li').removeClass('active');
			$(this).addClass('active');
		});

		$('#minus-sign').on('click', function() {
			var value_id = $('#value-id').val();
			if (value_id > 0) {--value_id;
				$('#value-id').val(value_id);

			}
		});
		$('#plus-sign').on('click', function() {
			var value_id = $('#value-id').val();
			if (value_id < 1000) {++value_id;
				$('#value-id').val(value_id);

			}
		});
	});
	var parallax = function(id, val) {
		if ($(window).scrollTop() > id.offset().top - $(window).height() && $(window).scrollTop() < id.offset().top + id.outerHeight()) {
			var px = parseInt($(window).scrollTop() - (id.offset().top - $(window).height()))
			px *= -val;
			id.css({
				'background-position' : 'left ' + px + 'px'
			});
		}
	}
	
	$(window).load(function(){
		$('#loading').fadeOut(500);
	});
		
	
})(jQuery);
