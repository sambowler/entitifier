// TODO: Logo
// TODO: JavaScript Disabled (still provide content)
// TODO: Strings to ignore (e.g. <%= %> etc.)
// TODO: Option to choose named and unicode entities
$(function() {	
	$('textarea').focus();
	
	var height = $(document).height() - 425;
	$('textarea').css('height', height + 'px');

    $('#about').hide();

    $('#more').click(function() { 
        var $mol = $('#more-or-less'),
            molCurr = $mol.text(),
            molNew = (molCurr == 'more') ? 'less' : 'more';

        $mol.text(molNew);
        $('#about').slideToggle(); 

        return false;
    });
	
	$('#submit').click(function() {
		var string = $('textarea').val(),
            typQuotes = ($('#typographic_quotes').is(':checked')) ? true : false;

		if(string && string !== '' && string !== "Text, omm nom nom") {
            var c = new Conversion(string, typQuotes);

            $('.error').remove();

            $('textarea') .fadeOut(function() {
                $(this).val(c.getNewString()).fadeIn();
            });

            _gaq.push(['_trackEvent', 'Entitify', 'Click']);

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
