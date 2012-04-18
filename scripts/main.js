// TODO: Logo
// TODO: JavaScript Disabled (still provide content)
// TODO: GA for entitify button clicked
// TODO: Convert to numerical entities
$(function() {	
    // TODO
	$('textarea').focus();
	
	var height = $(document).height() - 420;
	$('textarea').css('height', height + 'px');

    $('#about').hide();

    // Show ads if the screen is wide enough
    if(window.matchMedia('(min-width: 720px)').matches) {
        var s = document.createElement('script');
        s.src = 'http://pagead2.googlesyndication.com/pagead/show_ads.js';

        $('#main').after(s);
    }

    $('#more').click(function() { 
        $('#about').slideToggle(); 

        return false;
    });
	
	$('#submit').click(function() {
		var string = $('textarea').val(),
            typQuotes = ($('#typographic_quotes').is(':checked')) ? true : false;

		if(string && string !== '' && string !== "Text, omm nom nom") {
            var c = new Conversion(string, typQuotes);

            $('textarea').fadeOut('fast', function() {
                $(this).val(c.getNewString()).fadeIn('fast');
            });

			return false;
		} else if(!string || string == "Text, omm nom nom") {
			if($('.error').length == 0) {
				$('form').before('<p class="error">I need some text!</p>');
				$('textarea').css('height', $('textarea').height() - 41 + 'px');
			}
		}

		return false;
	});
	
	if(!'placeholder' in $('<input>')[0]) { // Check for native support
		var el = $('textarea');
		var placeholder = el.attr('placeholder');
		
		if(el.attr('placeholder')) { el.addClass('placeholder'); el.val(placeholder); };

		// Adapted from: http://blog.zachwaugh.com/post/309915069/swapping-input-field-placeholder-text-with-jquery
		el.focus(function() { 
			if($(this).val() == placeholder) {
				$(this).val('');
				$(this).removeClass();
			}
		});

		el.blur(function() {
			if($(this).val() == '') {
				$(this).val(placeholder);
				$(this).addClass('placeholder');
			}
		});
	}
});
