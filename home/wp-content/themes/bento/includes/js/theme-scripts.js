
// Scripts used by the theme



// Noconflict
var $str = jQuery.noConflict();

// Variables
var $bento_isocontainer = $str('.items-container');
var bento_lastwindowPos = $str(window).scrollTop();
var bento_adminbarHeight = 0;
if ( $str('#wpadminbar').outerHeight(true) > 0 ) {
	bento_adminbarHeight = $str('#wpadminbar').outerHeight(true);
}

// Check if an iOS device
function bentoCheckDevice() {
	var iDevices = [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod',
		'Mac68K',
		'MacPPC',
		'MacIntel'
	];
	if ( !!navigator.platform ) {
		while ( iDevices.length ) {
			if ( navigator.platform === iDevices.pop() ) { 
				return true; 
			}
		}
	}
	return false;
}

// Generate em values
function bentoEmValue(input) {
    var emSize = parseFloat( $str('html').css('font-size') );
    var output = emSize * 1.6 * input;
	return output;
}

// Handle same-page menu links
function bentoOnePage() {
	var headerHeight = 0;
	if ( bentoThemeVars.fixed_menu == 1 ) {
		headerHeight = $str('.site-header').outerHeight(true);
	}
	var menuitems = new Object();
	$str('.primary-menu a').each(function() {
		var itemclasses = 0;
		itemclasses = $str(this).parent('li').attr('class').split(" ");
		var itemid = itemclasses.slice(-1).pop();
		var itemPosition = 0;
		if ( $str(this).attr('href') && $str(this).attr('href').indexOf("#") != -1 ) {
			hash = $str(this).attr('href').substring($str(this).attr('href').indexOf('#')+1);
			if ( $str('#' + hash).length ) {
				itemPosition = $str('#' + hash).offset().top - headerHeight - 10;
				menuitems[itemid] = itemPosition;
			}
		}
	});
	return menuitems;
}

// Set side menu width for boxed layout
function bentoSideMenuWidth() {
	if ( bentoThemeVars.menu_config == 3 ) {
		var $header = $str('.header-side .site-header');
		if ( $str(window).width() < bentoEmValue(48) ) {
			$header.css('width','');
		} else {
			var wrapwidth = $str('.site-wrapper').outerWidth();
			var sidewidth = wrapwidth * 0.2;
			var widthstyle = 'width:'+sidewidth+'px !important;';
			if ( $header.attr('style') ) {
				$header.css('width','');
				$header.attr('style', widthstyle + $header.attr('style'));
			} else {
				$header.attr('style', widthstyle);
			}
		}
	}
}


$str(document).ready(function() {
	
	
	// Fixed header
	if ( bentoThemeVars.fixed_menu == 1 && bentoThemeVars.menu_config != 3 && $str(window).width() > bentoEmValue(64) ) {
		var topbar = 0;
		if ( $str('.bnt-topbar').length ) {
			topbar = $str('.bnt-topbar').outerHeight(true);
		}
		if ( $str(window).scrollTop() > topbar ) {
			if ( ! $str('.fixed-header').length ) {
				var $bento_headerClone = $str('.site-header > .bnt-container').clone();
				$str('.site-wrapper').append('<header class="site-header fixed-header"></header>');
				$str('.fixed-header').html($bento_headerClone);
			}
		}
	}
	
	
	// Submenu animations
	if ( bentoThemeVars.menu_config < 2 ) {
		$str('.site-wrapper').on( 'mouseenter mouseleave', '.primary-menu .menu-item-has-children', function(ev) {
			var parentMenu = $str(this);
			var submPos = parentMenu.offset().left;
			var windowWidth = $str(window).width();
			if ( parentMenu.parents('.menu-item-has-children').length ) {
				var subsubOff = submPos + 400; // 200 for each submenu width
				if ( subsubOff > windowWidth ) {
					parentMenu.children('.sub-menu').css({'left':'auto','right':'100%'});
				}
			} else {
				var subsubOff = submPos + 200; // 200 is the submenu width
				if ( subsubOff > windowWidth ) {
					parentMenu.children('.sub-menu').css({'right':'0'});
				}
			}
			if ( ev.type === 'mouseenter' ) {
				$str(this).children('.sub-menu').fadeIn(200);
			} else {
				$str(this).children('.sub-menu').fadeOut(200);
			}	
		});
	} else if ( bentoThemeVars.menu_config == 2 ) {
		$str('.ham-menu-trigger-container').click(function() {
			$str('.header-menu, .ham-menu-close-container').fadeIn(200, function() {
				$str('body').addClass('mobile-menu-open');
			});
			var $menu = $str('#nav-primary');
			var menuHeight = 0;
			if ( $menu.outerHeight(false) > 0 ) {
				menuHeight = $menu.outerHeight(false);
			}
			var menuMargin = ( $str(window).height() - menuHeight ) / 2;
			$menu.css('margin-top',menuMargin+'px');
		});
		$str('.ham-menu-close-container').click(function() {
			$str('.header-menu, .ham-menu-close-container').fadeOut(200, function() {
				$str('body').removeClass('mobile-menu-open');
			});
		});
	} else if ( bentoThemeVars.menu_config == 3 ) {
		$str('.primary-menu .menu-item-has-children > a').toggle(function(e) {
			if ( ! $str(this).hasClass('opened-side-menu') ) {
				$str(this).addClass('opened-side-menu');
			}
			$str(this).siblings('.sub-menu').slideDown(200);
		}, function(e) {
			e.preventDefault();
			if ( $str(this).hasClass('opened-side-menu') ) {
				$str(this).removeClass('opened-side-menu');
			}
			$str(this).siblings('.sub-menu').slideUp(200);
		});
	}
	
	
	// Mobile menu animations
	$str('.mobile-menu-trigger-container').click(function() {	
		var device = bentoCheckDevice();
		if ( device == false ) {
			$str('body').addClass('mobile-menu-open');
		}
		$str('.mobile-menu-shadow').fadeIn(500);
		$str('#nav-mobile').css("left", '0');
	});
	$str('.mobile-menu-close,.mobile-menu-shadow').click(function() {
		if ( $str('body').hasClass('mobile-menu-open') ) {
			$str('body').removeClass('mobile-menu-open');
		}
		$str('.mobile-menu-shadow').fadeOut(500);
		$str('#nav-mobile').css("left", '-100%');
	});
	
	
	// Side menu position on load
	if ( bentoThemeVars.menu_config == 3 ) {
		var bento_headertop = 0;
		if ( $str('#wpadminbar').outerHeight(true) > 0 ) {
			bento_headertop = $str('#wpadminbar').outerHeight(true);
		}
		if ( $str('.bnt-topbar').length ) {
			bento_headertop += $str('.bnt-topbar').outerHeight(true);
		}
		$str('.header-side .site-header').css('top',bento_headertop+'px');
	}
	
	
	// Comment form labels
	$str('.comment-form-field input').focus(function() {
		$str(this).siblings('label').fadeIn(500);
	}).blur(function() {
		if ( ! $str(this).val() ) {
			$str(this).siblings('label').fadeOut(500);
		}
	});
	if ( $str('.comment-form-field input').val() ) {
		$str(this).siblings('label').css('display','block');	
	}
	
	
	// Responsive videos
	$str('.entry-content iframe[src*="youtube.com"],.entry-content iframe[src*="vimeo.com"]').each(function() {
		$str(this).parent().fitVids();
	});
	
	
	// Ajax pagination
	var bento_page = 1;
	if ( bentoThemeVars.paged && bentoThemeVars.paged > 1 ) {
		bento_page = bentoThemeVars.paged;
	}
	if ( bento_page < bentoThemeVars.max_pages ) {
		$str('.ajax-load-more').fadeIn(100).css('display','block');
	}
	$str('.ajax-load-more').click(function () {
		$str('.spinner-ajax').fadeIn(400);
		$str.ajax({
			url: bentoThemeVars.ajaxurl,
			type: 'post',
			data: {
				action: 'ajax_pagination',
				query_vars: bentoThemeVars.query_vars,
				page: bento_page
			},
			success: function (html) {
				var $posts = $str(html).fadeIn(400);
				if ( bentoThemeVars.grid_mode != 'nogrid' ) {
					$str('.grid-container').append($posts);
				} else {
					$str('.site-main').append($posts);	
				}
			}
		});
		bento_page++;
		$str('.spinner-ajax').fadeOut(400);
		if ( bento_page >= bentoThemeVars.max_pages ) {
			$str('.ajax-load-more').remove();
		}
	});

	
	// Scroll to bottom of header with CTA buttons
	$str('.post-header-cta div').click(function() {
		bento_headerHeight = 0;
		if ( bentoThemeVars.fixed_menu == 1 ) {
			bento_headerHeight = $str('.site-header').outerHeight(true);
		}
		var hb = $str('.post-header').position().top + $str('.post-header').outerHeight(true) - bento_headerHeight;
		$str('html, body').animate( { scrollTop: hb }, 1000 );
	});
	
	
	// Display "add to cart" buttons on products
	$str('.products .product').hover(function() {
		$str(this).find('.add_to_cart_button').fadeIn(200);
	}, function() {
		$str(this).find('.add_to_cart_button').fadeOut(200);	
	});
	
	
	// Set side menu width for boxed layout
	bentoSideMenuWidth();
		
		
});


$str(window).load(function () {
	
	
	// Scroll to the correct position for hash URLs
	if ( window.location.hash ) {
		var bento_cleanhash = window.location.hash.substr(1);
		if ( $str('#' + bento_cleanhash).length ) {
			var bento_headerHeight = 0;
			if ( bentoThemeVars.fixed_menu == 1 ) {
				bento_headerHeight = $str('.site-header').outerHeight(true);
			}
			scrollPosition = $str('#' + bento_cleanhash).offset().top - bento_headerHeight - 10;
			$str('html, body').animate( { scrollTop: scrollPosition }, 1 );
		}
	}
	
	
	// Same-page menu links
	var bento_op_menu = bentoOnePage();
	if ( ! $str.isEmptyObject(bento_op_menu) ) {
		$str('.primary-menu li, .primary-mobile-menu li').removeClass('current-menu-item');
		$str.each( bento_op_menu, function( ind, val ) {
			$str('.'+ind+' > a').click(function(e) {
				if ( $str('body').hasClass('mobile-menu-open') ) {
					$str('body').removeClass('mobile-menu-open');
				}
				e.stopPropagation();
				e.preventDefault();
				$str('html, body').animate( { scrollTop: val }, 500, function() {
					$str('.mobile-menu-shadow').fadeOut(500);
					$str('#nav-mobile').css("left", '-100%');
				});
			});
		});
	}


});


$str(window).resize(function () {
	
	
	// Set overlay menu margin
	if ( bentoThemeVars.menu_config == 2 ) {
		var $bento_menu = $str('#nav-primary');
		var bento_menuHeight = 0;
		if ( $bento_menu.outerHeight(false) > 0 ) {
			bento_menuHeight = $bento_menu.outerHeight(false);
		}
		var bento_menuMargin = ( $str(window).height() - bento_menuHeight ) / 2;
		$bento_menu.css('margin-top',bento_menuMargin+'px');
	}
	
	
	// Set side menu width for boxed layout
	bentoSideMenuWidth();


});


$str(window).scroll(function () {
	
	
	// Side menu on scroll
	if ( bentoThemeVars.menu_config == 3 ) {
		var $bento_header = $str('.header-side .site-header');
		var bento_windowPos = $str(window).scrollTop();
		var bento_headertop = parseInt($bento_header.css('top'),10);
		var bento_windowHeight = $str(window).height();
		var bento_headerHeight = $bento_header.outerHeight(true); 
		var bento_bodyHeight = $str(document).height();
		var bento_coef = 1;
		if ( bento_headerHeight > bento_windowHeight ) {
			var bento_headerDiff = bento_headerHeight - bento_windowHeight;
			if ( bento_headerDiff * 2 < bento_bodyHeight - bento_windowHeight ) {
				bento_coef = 2;
			}
			if ( bento_windowPos > bento_lastwindowPos ) {
				if ( bento_headertop >= -bento_headerDiff ) {
					bento_headertop = bento_headertop - ( ( bento_windowPos - bento_lastwindowPos ) / bento_coef );
				}
				if ( bento_windowHeight + bento_windowPos >= bento_bodyHeight ) {
					bento_headertop = -bento_headerDiff;
				}
			} else {
				if ( bento_windowPos == 0 || bento_headertop >= bento_adminbarHeight ) {
					bento_headertop = bento_adminbarHeight;
				} else {
					bento_headertop = bento_headertop + ( ( bento_lastwindowPos - bento_windowPos ) / bento_coef );
				}
			}	
		}
		$bento_header.css('top',bento_headertop+'px');
		bento_lastwindowPos = bento_windowPos;
	}
	
	
	// Fixed header on scroll
	if ( bentoThemeVars.fixed_menu == 1 && bentoThemeVars.menu_config != 3 && $str(window).width() > bentoEmValue(64) ) {
		var topbar = 0;
		if ( $str('.bnt-topbar').length ) {
			topbar = $str('.bnt-topbar').outerHeight(true);
		}
		if ( $str(window).scrollTop() > topbar ) {
			if ( ! $str('.fixed-header').length ) {
				var $bento_headerClone = $str('.site-header > .bnt-container').clone(true);
				$str('.site-wrapper').append('<header class="site-header fixed-header"></header>');
				$str('.fixed-header').html($bento_headerClone).fadeIn(600);
			}
		} else {
			if ( $str('.fixed-header').length ) {
				$str('.fixed-header').remove();
			}
		}
	}
	
	
	// Same-page menu links on scroll
	var bento_op_menu = bentoOnePage();
	var activeParent = '';
	var activeParentPrev = '';
	if ( ! $str.isEmptyObject(bento_op_menu) ) {
		var currentPosition = $str(window).scrollTop();
		$str.each( bento_op_menu, function( ind, val ) {
			val = val - 10;
			if ( currentPosition >= val ) {
				activeParent = ind;
			}
		});
		if ( activeParent != '' && activeParent != activeParentPrev ) {
			$str('.'+activeParent).addClass('current-menu-item');
			$str('.primary-menu li:not(".'+activeParent+'"),.primary-mobile-menu li:not(".'+activeParent+'")').removeClass('current-menu-item');
			var activeParentPrev = activeParent;
		}
	}
	
	
});