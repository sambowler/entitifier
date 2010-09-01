$(function() {	
	
	var height = $(document).height() - 350;
	$('textarea').css('height', height + 'px');
	
	var val = '';
	$('#submit').click(function() {
		var textarea = $('textarea').val();
		var radioval = $('input[type="radio"]:checked').val();
		if(textarea && radioval && textarea !== val) {
			$.ajax({
				type: 'POST',
				url: '/direct_input',
				ifModified: true,
				data: { html: textarea, text_or_html: radioval },
				success: function(d) {
					if(d) {
						$('textarea').fadeOut('fast', function() {
							$(this).val(d).fadeIn('fast');
							val = d;
						});
						// $('button[disabled="disabled"]').removeAttr('disabled');
					} else {
						return false;
					};
				},
			});
			return false;
		} else if(!textarea || textarea == "Text, omm nom nom") {
			if($('.error').length == 0) {
				$('form').before('<p class="error">I need some text!</p>');
				$('textarea').css('height', $('textarea').height() - 41 + 'px');
			}
		} else if(!radioval) {
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