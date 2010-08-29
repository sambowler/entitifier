$(function() {	
	
	var height = $(document).height() - 330;
	$('textarea').css('height', height + 'px');
	
	var val = '';
	$('#submit').click(function() {
		var self = $('#direct textarea');
		var radioval = $('input[type="radio"]:checked').val();
		if(self.val() && radioval && self.val() !== val) {
			$.ajax({
				type: 'POST',
				url: '/direct_input',
				ifModified: true,
				data: { html: self.val(), text_or_html: radioval },
				success: function(d) {
					if(d) {
						self.fadeOut('fast', function() {
							$(this).val(d).fadeIn('fast');
							val = d;
						});
						$('button[disabled="disabled"]').removeAttr('disabled');
					} else {
						return false;
					};
				},
			});
		} else {
			alert('You seem to be missing something...');
		}
		return false;
	});
	
	$('input').each(function() {
		if($(this).attr('placeholder')) { 
			$(this).addClass('placeholder'); 
			$(this).val($(this).attr('placeholder'));
		};
	});

	// Adapted from: http://blog.zachwaugh.com/post/309915069/swapping-input-field-placeholder-text-with-jquery
	$('input').each(function() {
		var placeholder = $(this).attr('placeholder');

		$(this).focus(function() { 
			if($(this).val() == placeholder) {
				$(this).val('');
				$(this).removeClass();
			}
		});

		$(this).blur(function() {
			if($(this).val() == '') {
				$(this).val(placeholder);
				$(this).addClass('placeholder');
			}
		});
	});
});