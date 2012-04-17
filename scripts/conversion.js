// TODO: Abstract libraries out so not created on object instantiation
function Conversion(text, html, typographicQuotes) {
    var ret = text,
        tests = [],
        results = [],
        d = new DOMParser();

    // Construct an array of tests
    // TODO: Automatically detect HTML
    if(html) {
        var doc = d.parseFromString(text, 'text/html');

        // http://stackoverflow.com/a/2084614
        $(doc).contents().each(function processNodes() {
            if(this.nodeType == 3) {
                // FIXME: Shouldn't entitify characters in <script> tags
                var trimmed = $.trim(this.textContent);

                if(trimmed.length != 0) {
                    tests.push($(this).text());
                }
            } else {
                $(this).contents().each(processNodes);
            }
        });
    } else {
        tests.push(text);
    }

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

        // Don't replace the & in entities i.e &quot; becoming &amp;quot;
        result = result.replace(/&amp;(\w+;)/g, function(a, b) { return '&' + b; });

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
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '¡': '&iexcl;',
    '¢': '&cent;',
    '£': '&pound;',
    '¤': '&curren;',
    '¥': '&yen;',
    '¦': '&brvbar;',
    '§': '&sect;',
    '¨': '&uml;',
    '©': '&copy;',
    'ª': '&ordf;',
    '«': '&laquo;',
    '¬': '&not;',
    '®': '&reg;',
    '¯': '&macr;',
    '°': '&deg;',
    '±': '&plusmn;',
    '²': '&sup2;',
    '³': '&sup3;',
    '´': '&acute;',
    'µ': '&micro;',
    '¶': '&para;',
    '·': '&middot;',
    '¸': '&cedil;',
    '¹': '&sup1;',
    'º': '&ordm;',
    '»': '&raquo;',
    '¼': '&frac14;',
    '½': '&frac12;',
    '¾': '&frac34;',
    '¿': '&iquest;',
    'À': '&Agrave;',
    'Á': '&Aacute;',
    'Â': '&Acirc;',
    'Ã': '&Atilde;',
    'Ä': '&Auml;',
    'Å': '&Aring;',
    'Æ': '&AElig;',
    'Ç': '&Ccedil;',
    'È': '&Egrave;',
    'É': '&Eacute;',
    'Ê': '&Ecirc;',
    'Ë': '&Euml;',
    'Ì': '&Igrave;',
    'Í': '&Iacute;',
    'Î': '&Icirc;',
    'Ï': '&Iuml;',
    'Ð': '&ETH;',
    'Ñ': '&Ntilde;',
    'Ò': '&Ograve;',
    'Ó': '&Oacute;',
    'Ô': '&Ocirc;',
    'Õ': '&Otilde;',
    'Ö': '&Ouml;',
    '×': '&times;',
    'Ø': '&Oslash;',
    'Ù': '&Ugrave;',
    'Ú': '&Uacute;',
    'Û': '&Ucirc;',
    'Ü': '&Uuml;',
    'Ý': '&Yacute;',
    'Þ': '&THORN;',
    'ß': '&szlig;',
    'à': '&agrave;',
    'á': '&aacute;',
    'â': '&acirc;',
    'ã': '&atilde;',
    'ä': '&auml;',
    'å': '&aring;',
    'æ': '&aelig;',
    'ç': '&ccedil;',
    'è': '&egrave;',
    'é': '&eacute;',
    'ê': '&ecirc;',
    'ë': '&euml;',
    'ì': '&igrave;',
    'í': '&iacute;',
    'î': '&icirc;',
    'ï': '&iuml;',
    'ð': '&eth;',
    'ñ': '&ntilde;',
    'ò': '&ograve;',
    'ó': '&oacute;',
    'ô': '&ocirc;',
    'õ': '&otilde;',
    'ö': '&ouml;',
    '÷': '&divide;',
    'ø': '&oslash;',
    'ù': '&ugrave;',
    'ú': '&uacute;',
    'û': '&ucirc;',
    'ü': '&uuml;',
    'ý': '&yacute;',
    'þ': '&thorn;',
    'ÿ': '&yuml;',
    'Œ': '&OElig;',
    'œ': '&oelig;',
    'Š': '&Scaron;',
    'š': '&scaron;',
    'Ÿ': '&Yuml;',
    'ƒ': '&fnof;',
    'ˆ': '&circ;',
    '˜': '&tilde;',
    'Α': '&Alpha;',
    'Β': '&Beta;',
    'Γ': '&Gamma;',
    'Δ': '&Delta;',
    'Ε': '&Epsilon;',
    'Ζ': '&Zeta;',
    'Η': '&Eta;',
    'Θ': '&Theta;',
    'Ι': '&Iota;',
    'Κ': '&Kappa;',
    'Λ': '&Lambda;',
    'Μ': '&Mu;',
    'Ν': '&Nu;',
    'Ξ': '&Xi;',
    'Ο': '&Omicron;',
    'Π': '&Pi;',
    'Ρ': '&Rho;',
    'Σ': '&Sigma;',
    'Τ': '&Tau;',
    'Υ': '&Upsilon;',
    'Φ': '&Phi;',
    'Χ': '&Chi;',
    'Ψ': '&Psi;',
    'Ω': '&Omega;',
    'α': '&alpha;',
    'β': '&beta;',
    'γ': '&gamma;',
    'δ': '&delta;',
    'ε': '&epsilon;',
    'ζ': '&zeta;',
    'η': '&eta;',
    'θ': '&theta;',
    'ι': '&iota;',
    'κ': '&kappa;',
    'λ': '&lambda;',
    'μ': '&mu;',
    'ν': '&nu;',
    'ξ': '&xi;',
    'ο': '&omicron;',
    'π': '&pi;',
    'ρ': '&rho;',
    'ς': '&sigmaf;',
    'σ': '&sigma;',
    'τ': '&tau;',
    'υ': '&upsilon;',
    'φ': '&phi;',
    'χ': '&chi;',
    'ψ': '&psi;',
    'ω': '&omega;',
    'ϑ': '&thetasym;',
    'ϒ': '&upsih;',
    'ϖ': '&piv;',
    '–': '&ndash;',
    '—': '&mdash;',
    '‘': '\'',
    '’': '\'',
    '“': '"',
    '”': '"',
    '‚': '&sbquo;',
    '„': '&bdquo;',
    '†': '&dagger;',
    '‡': '&Dagger;',
    '•': '&bull;',
    '…': '&hellip;',
    '‰': '&permil;',
    '′': '&prime;',
    '″': '&Prime;',
    '‹': '&lsaquo;',
    '›': '&rsaquo;',
    '‾': '&oline;',
    '⁄': '&frasl;',
    '€': '&euro;',
    'ℑ': '&image;',
    '℘': '&weierp;',
    'ℜ': '&real;',
    '™': '&trade;',
    'ℵ': '&alefsym;',
    '←': '&larr;',
    '↑': '&uarr;',
    '→': '&rarr;',
    '↓': '&darr;',
    '↔': '&harr;',
    '↵': '&crarr;',
    '⇐': '&lArr;',
    '⇑': '&uArr;',
    '⇒': '&rArr;',
    '⇓': '&dArr;',
    '⇔': '&hArr;',
    '∀': '&forall;',
    '∂': '&part;',
    '∃': '&exist;',
    '∅': '&empty;',
    '∇': '&nabla;',
    '∈': '&isin;',
    '∉': '&notin;',
    '∋': '&ni;',
    '∏': '&prod;',
    '∑': '&sum;',
    '−': '&minus;',
    '∗': '&lowast;',
    '√': '&radic;',
    '∝': '&prop;',
    '∞': '&infin;',
    '∠': '&ang;',
    '∧': '&and;',
    '∨': '&or;',
    '∩': '&cap;',
    '∪': '&cup;',
    '∫': '&int;',
    '∴': '&there4;',
    '∼': '&sim;',
    '≅': '&cong;',
    '≈': '&asymp;',
    '≠': '&ne;',
    '≡': '&equiv;',
    '≤': '&le;',
    '≥': '&ge;',
    '⊂': '&sub;',
    '⊃': '&sup;',
    '⊄': '&nsub;',
    '⊆': '&sube;',
    '⊇': '&supe;',
    '⊕': '&oplus;',
    '⊗': '&otimes;',
    '⊥': '&perp;',
    '⋅': '&sdot;',
    '⌈': '&lceil;',
    '⌉': '&rceil;',
    '⌊': '&lfloor;',
    '⌋': '&rfloor;',
    '〈': '&lang;',
    '〉': '&rang;',
    '◊': '&loz;',
    '♠': '&spades;',
    '♣': '&clubs;',
    '♥': '&hearts;',
    '♦': '&diams;'
}

Conversion.prototype.typographicQuotesLibrary = {
  '‘': '&lsquo;',
  '’': '&rsquo;',
  '“': '&ldquo;',
  '”': '&rdquo;'
}
