$(function() {	
    // TODO
	$('#javascript_disabled').remove();
	$('textarea').focus();
	
	var height = $(document).height() - 410;
	$('textarea').css('height', height + 'px');
	
	$('#submit').click(function() {
		var textarea = $('textarea').val(),
            radioVal = $('input[type="radio"]:checked').val(),
            typQuotes = ($('#typographic_quotes').is(':checked')) ? true : false;

        console.log(typQuotes);

		if(textarea && radioVal && textarea !== '' && textarea !== "Text, omm nom nom") {
            HTMLParser(textarea, {
                chars: function(text) {
                    var c = new Conversion(text, typQuotes);
                }
            });

            //$.ajax({
				//type: 'POST',
				//url: '/',
				//ifModified: true,
				//data: { html: textarea, text_or_html: radioval, typographic_quotes: typ_quotes },
				//success: function(d) {
					//if(d) {
						//$('textarea').fadeOut('fast', function() {
							//$(this).val(d).fadeIn('fast');
							//val = d;
						//});
						//// $('button[disabled="disabled"]').removeAttr('disabled');
					//} else {
						//return false;
					//};
				//},
			//});

			return false;
		} else if(!textarea || textarea == "Text, omm nom nom") {
			if($('.error').length == 0) {
				$('form').before('<p class="error">I need some text!</p>');
				$('textarea').css('height', $('textarea').height() - 41 + 'px');
			}
		} else if(!radioVal) {
			$('#text').prev().css('backgroundColor', '#FF0'); 
			$('#html').prev().css('backgroundColor', '#FF0');
		}

		return false;
	});
	
	if(!Modernizr.input.placeholder) { // Uses modernizr to check placeholder support
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
