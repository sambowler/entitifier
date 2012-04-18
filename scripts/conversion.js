function Conversion(text, typographicQuotes) {
    var tests = [],
        results = [],
        d = new DOMParser();

    // Construct an array of tests
    // If there isn't any valid HTML, the DOM is automatically constructed
    var doc = d.parseFromString(text, 'text/html');

    // http://stackoverflow.com/a/2084614
    $(doc).contents().each(function processNodes() {
        if(this.nodeType == 3 && this.parentNode.nodeName.toLowerCase() != 'script') {
            var trimmed = $.trim(this.textContent);

            if(trimmed.length != 0) {
                tests.push($(this).text());
            }
        } else {
            $(this).contents().each(processNodes);
        }
    });

    var results = this.generateResults(tests, typographicQuotes);
    this.newString = this.replaceOriginals(text, tests, results);
}

Conversion.prototype.getNewString = function() {
    return this.newString;
}

Conversion.prototype.generateResults = function(tests, typographicQuotes) {
    var ret = [];

    for(i = 0, len = tests.length; i < len; i++) {
        var result = tests[i];

        if(typographicQuotes) {
            for(var e in this.typographicQuotesLibrary) {
                if(result.indexOf(e) !== -1) result = this.replaceEntity(result, e, this.typographicQuotesLibrary[e]);
            }
        }

        for(var e in this.entities) {
            if(result.indexOf(e) !== -1) result = this.replaceEntity(result, e, this.entities[e]);
        }

        // Don't replace the & in entities i.e &#8001; becoming &#38;#8801;
        result = result.replace(/&#38;(\#\w+;)/g, function(a, b) { return '&' + b; });

        ret.push(result);
    }

    return ret;
}

Conversion.prototype.replaceOriginals = function(originalStr, tests, results) {
    // Loop through tests
    // Find each test in original string
    // Replace test with new content
    var ret = originalStr;

    for(i = 0, len = tests.length; i < len; i++) {
        ret = ret.replace(tests[i], results[i]);
    }

    return ret;
}

Conversion.prototype.replaceEntity = function(str, original, escaped) {
    var re = new RegExp(original, 'g');

    return str.replace(re, escaped);
}

// TODO: Switch to entity numbers instead of names (better browser support)
Conversion.prototype.entities = {
    '&': '&#38;',
    '<': '&#60;',
    '>': '&#62;',
    '¡': '&#161;',
    '¢': '&#162;',
    '£': '&#163;',
    '¤': '&#164;',
    '¥': '&#165;',
    '¦': '&#166;',
    '§': '&#167;',
    '¨': '&#168;',
    '©': '&#169;',
    'ª': '&#170;',
    '«': '&#171;',
    '¬': '&#172;',
    '®': '&#174;',
    '¯': '&#175;',
    '°': '&#176;',
    '±': '&#177;',
    '²': '&#178;',
    '³': '&#179;',
    '´': '&#180;',
    'µ': '&#181;',
    '¶': '&#182;',
    '·': '&#183;',
    '¸': '&#184;',
    '¹': '&#185;',
    'º': '&#186;',
    '»': '&#187;',
    '¼': '&#188;',
    '½': '&#189;',
    '¾': '&#190;',
    '¿': '&#191;',
    'À': '&#192;',
    'Á': '&#193;',
    'Â': '&#194;',
    'Ã': '&#195;',
    'Ä': '&#196;',
    'Å': '&#197;',
    'Æ': '&#198;',
    'Ç': '&#199;',
    'È': '&#200;',
    'É': '&#201;',
    'Ê': '&#202;',
    'Ë': '&#203;',
    'Ì': '&#204;',
    'Í': '&#205;',
    'Î': '&#206;',
    'Ï': '&#207;',
    'Ð': '&#208;',
    'Ñ': '&#209;',
    'Ò': '&#210;',
    'Ó': '&#211;',
    'Ô': '&#212;',
    'Õ': '&#213;',
    'Ö': '&#214;',
    '×': '&#215;',
    'Ø': '&#216;',
    'Ù': '&#217;',
    'Ú': '&#218;',
    'Û': '&#219;',
    'Ü': '&#220;',
    'Ý': '&#221;',
    'Þ': '&#222;',
    'ß': '&#223;',
    'à': '&#224;',
    'á': '&#225;',
    'â': '&#226;',
    'ã': '&#227;',
    'ä': '&#228;',
    'å': '&#229;',
    'æ': '&#230;',
    'ç': '&#231;',
    'è': '&#232;',
    'é': '&#233;',
    'ê': '&#234;',
    'ë': '&#235;',
    'ì': '&#236;',
    'í': '&#237;',
    'î': '&#238;',
    'ï': '&#239;',
    'ð': '&#240;',
    'ñ': '&#241;',
    'ò': '&#242;',
    'ó': '&#243;',
    'ô': '&#244;',
    'õ': '&#245;',
    'ö': '&#246;',
    '÷': '&#247;',
    'ø': '&#248;',
    'ù': '&#249;',
    'ú': '&#250;',
    'û': '&#251;',
    'ü': '&#252;',
    'ý': '&#253;',
    'þ': '&#254;',
    'ÿ': '&#255;',
    'Œ': '&#338;',
    'œ': '&#339;',
    'Š': '&#352;',
    'š': '&#353;',
    'Ÿ': '&#376;',
    'ƒ': '&#402;',
    'ˆ': '&#710;',
    '˜': '&#732;',
    'Α': '&#913;',
    'Β': '&#914;',
    'Γ': '&#915;',
    'Δ': '&#916;',
    'Ε': '&#917;',
    'Ζ': '&#918;',
    'Η': '&#919;',
    'Θ': '&#920;',
    'Ι': '&#921;',
    'Κ': '&#922;',
    'Λ': '&#923;',
    'Μ': '&#924;',
    'Ν': '&#925;',
    'Ξ': '&#926;',
    'Ο': '&#927;',
    'Π': '&#928;',
    'Ρ': '&#929;',
    'Σ': '&#930;',
    'Τ': '&#931;',
    'Υ': '&#933;',
    'Φ': '&#934;',
    'Χ': '&#935;',
    'Ψ': '&#936;',
    'Ω': '&#937;',
    'α': '&#945;',
    'β': '&#946;',
    'γ': '&#947;',
    'δ': '&#948;',
    'ε': '&#949;',
    'ζ': '&#950;',
    'η': '&#951;',
    'θ': '&#952;',
    'ι': '&#953;',
    'κ': '&#954;',
    'λ': '&#955;',
    'μ': '&#956;',
    'ν': '&#957;',
    'ξ': '&#958;',
    'ο': '&#959;',
    'π': '&#960;',
    'ρ': '&#961;',
    'ς': '&#962;',
    'σ': '&#963;',
    'τ': '&#964;',
    'υ': '&#965;',
    'φ': '&#966;',
    'χ': '&#967;',
    'ψ': '&#968;',
    'ω': '&#969;',
    'ϑ': '&#977;',
    'ϒ': '&#978;',
    'ϖ': '&#982;',
    '—': '&#8212;',
    '‘': '\'',
    '’': '\'',
    '“': '"',
    '”': '"',
    '‚': '&#8218;',
    '„': '&#8222;',
    '†': '&#8224;',
    '‡': '&#8225;',
    '•': '&#8226;',
    '…': '&#8230;',
    '‰': '&#8240;',
    '′': '&#8242;',
    '″': '&#8243;',
    '‹': '&#8249;',
    '›': '&#8250;',
    '‾': '&#8254;',
    '⁄': '&#8260;',
    '€': '&#8364;',
    'ℑ': '&#8465;',
    '℘': '&#8472;',
    'ℜ': '&#8476;',
    '™': '&#8482;',
    'ℵ': '&#8501;',
    '←': '&#8592;',
    '↑': '&#8593;',
    '→': '&#8594;',
    '↓': '&#8595;',
    '↔': '&#8596;',
    '↵': '&#8629;',
    '⇐': '&#8656;',
    '⇑': '&#8657;',
    '⇒': '&#8658;',
    '⇓': '&#8659;',
    '⇔': '&#8660;',
    '∀': '&#8704;',
    '∂': '&#8706;',
    '∃': '&#8707;',
    '∅': '&#8709;',
    '∇': '&#8711;',
    '∈': '&#8712;',
    '∉': '&#8713;',
    '∋': '&#8715;',
    '∏': '&#8719;',
    '∑': '&#8721;',
    '−': '&#8722;',
    '∗': '&#8727;',
    '√': '&#8730;',
    '∝': '&#8733;',
    '∞': '&#8734;',
    '∠': '&#8736;',
    '∧': '&#8743;',
    '∨': '&#8744;',
    '∩': '&#8745;',
    '∪': '&#8746;',
    '∫': '&#8747;',
    '∴': '&#8756;',
    '∼': '&#8764;',
    '≅': '&#8773;',
    '≈': '&#8776;',
    '≠': '&#8800;',
    '≡': '&#8801;',
    '≤': '&#8804;',
    '≥': '&#8805;',
    '⊂': '&#8834;',
    '⊃': '&#8835;',
    '⊄': '&#8836;',
    '⊆': '&#8838;',
    '⊇': '&#8839;',
    '⊕': '&#8853;',
    '⊗': '&#8855;',
    '⊥': '&#8869;',
    '⋅': '&#8901;',
    '⌈': '&#8968;',
    '⌉': '&#8969;',
    '⌊': '&#8970;',
    '⌋': '&#8971;',
    '〈': '&#9001;',
    '〉': '&#9002;',
    '◊': '&#9674;',
    '♠': '&#9824;',
    '♣': '&#9827;',
    '♥': '&#9829;',
    '♦': '&#9830;'
}

Conversion.prototype.typographicQuotesLibrary = {
  '‘': '&#8216;',
  '’': '&#8217;',
  '“': '&#8220;',
  '”': '&#8221;',
}
