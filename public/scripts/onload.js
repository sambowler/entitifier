$(function() {	
	
	var height = $(document).height() - 350;
	$('textarea').css('height', height + 'px');
	
	$(window).resize(function() {
		var height = $(document).height() - 350;
		$('textarea').css('height', height + 'px');
	});
	
	var val = '';
	$('#submit').click(function() {
		var textarea = $('textarea').val();
		var checkval = textarea.search('<?php');
		console.log(checkval);
		var radioval = $('input[type="radio"]:checked').val();
		if(textarea && radioval && textarea !== val && checkval !== 2) {
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
			$('#direct').before('<p class="error">I need some text!</p>'); // TODO: Nicer error message presentation.
			$('textarea').css('height', $('textarea').height() - 41 + 'px');
		} else if(!radioval) {
			$('#text').prev().css('backgroundColor', '#FF0'); 
			$('#html').prev().css('backgroundColor', '#FF0');
		}
		return false;
	});
	
	if(!Modernizr.input.placeholder) {
		if($('textarea').attr('placeholder')) { 
			$('textarea').addClass('placeholder'); 
			$('textarea').val($('textarea').attr('placeholder'));
		};

		// Adapted from: http://blog.zachwaugh.com/post/309915069/swapping-input-field-placeholder-text-with-jquery
		var placeholder = $('textarea').attr('placeholder');

		$('textarea').focus(function() { 
			if($(this).val() == placeholder) {
				$(this).val('');
				$(this).removeClass();
			}
		});

		$('textarea').blur(function() {
			if($(this).val() == '') {
				$(this).val(placeholder);
				$(this).addClass('placeholder');
			}
		});
	}
});