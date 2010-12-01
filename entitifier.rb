# coding: utf-8
require 'vendor/sinatra/lib/sinatra.rb'
require 'vendor/hpricot/lib/hpricot.rb'
require 'lib/hpricot_text_gsub.rb'

# FIXME: Accept HTML5 Elements
# FIXME: Ignore <?php ?> <%= %> etc.
# TODO: Typographic quotes toggling

ERB_REGEX = /(?=(<%(?>.*%)>))/m
PHP_REGEX = /(?=(<\?php(?>.*?\?)>))/m

ENTITIES = {
  /&/ => '&amp;',
  /&amp;amp;/ => '&amp;',
  /"/ => '&quot;',
  /</ => '&lt;',
  />/ => '&gt;',
  /¡/ => '&iexcl;',
  /¢/ => '&cent;',
  /£/ => '&pound;',
  /¤/ => '&curren;',
  /¥/ => '&yen;',
  /¦/ => '&brvbar;',
  /§/ => '&sect;',
  /¨/ => '&uml;',
  /©/ => '&copy;',
  /ª/ => '&ordf;',
  /«/ => '&laquo;',
  /¬/ => '&not;',
  /®/ => '&reg;',
  /¯/ => '&macr;',
  /°/ => '&deg;',
  /±/ => '&plusmn;',
  /²/ => '&sup2;',
  /³/ => '&sup3;',
  /´/ => '&acute;',
  /µ/ => '&micro;',
  /¶/ => '&para;',
  /·/ => '&middot;',
  /¸/ => '&cedil;',
  /¹/ => '&sup1;',
  /º/ => '&ordm;',
  /»/ => '&raquo;',
  /¼/ => '&frac14;',
  /½/ => '&frac12;',
  /¾/ => '&frac34;',
  /¿/ => '&iquest;',
  /À/ => '&Agrave;',
  /Á/ => '&Aacute;',
  /Â/ => '&Acirc;',
  /Ã/ => '&Atilde;',
  /Ä/ => '&Auml;',
  /Å/ => '&Aring;',
  /Æ/ => '&AElig;',
  /Ç/ => '&Ccedil;',
  /È/ => '&Egrave;',
  /É/ => '&Eacute;',
  /Ê/ => '&Ecirc;',
  /Ë/ => '&Euml;',
  /Ì/ => '&Igrave;',
  /Í/ => '&Iacute;',
  /Î/ => '&Icirc;',
  /Ï/ => '&Iuml;',
  /Ð/ => '&ETH;',
  /Ñ/ => '&Ntilde;',
  /Ò/ => '&Ograve;',
  /Ó/ => '&Oacute;',
  /Ô/ => '&Ocirc;',
  /Õ/ => '&Otilde;',
  /Ö/ => '&Ouml;',
  /×/ => '&times;',
  /Ø/ => '&Oslash;',
  /Ù/ => '&Ugrave;',
  /Ú/ => '&Uacute;',
  /Û/ => '&Ucirc;',
  /Ü/ => '&Uuml;',
  /Ý/ => '&Yacute;',
  /Þ/ => '&THORN;',
  /ß/ => '&szlig;',
  /à/ => '&agrave;',
  /á/ => '&aacute;',
  /â/ => '&acirc;',
  /ã/ => '&atilde;',
  /ä/ => '&auml;',
  /å/ => '&aring;',
  /æ/ => '&aelig;',
  /ç/ => '&ccedil;',
  /è/ => '&egrave;',
  /é/ => '&eacute;',
  /ê/ => '&ecirc;',
  /ë/ => '&euml;',
  /ì/ => '&igrave;',
  /í/ => '&iacute;',
  /î/ => '&icirc;',
  /ï/ => '&iuml;',
  /ð/ => '&eth;',
  /ñ/ => '&ntilde;',
  /ò/ => '&ograve;',
  /ó/ => '&oacute;',
  /ô/ => '&ocirc;',
  /õ/ => '&otilde;',
  /ö/ => '&ouml;',
  /÷/ => '&divide;',
  /ø/ => '&oslash;',
  /ù/ => '&ugrave;',
  /ú/ => '&uacute;',
  /û/ => '&ucirc;',
  /ü/ => '&uuml;',
  /ý/ => '&yacute;',
  /þ/ => '&thorn;',
  /ÿ/ => '&yuml;',
  /Œ/ => '&OElig;',
  /œ/ => '&oelig;',
  /Š/ => '&Scaron;',
  /š/ => '&scaron;',
  /Ÿ/ => '&Yuml;',
  /ƒ/ => '&fnof;',
  /ˆ/ => '&circ;',
  /˜/ => '&tilde;',
  /Α/ => '&Alpha;',
  /Β/ => '&Beta;',
  /Γ/ => '&Gamma;',
  /Δ/ => '&Delta;',
  /Ε/ => '&Epsilon;',
  /Ζ/ => '&Zeta;',
  /Η/ => '&Eta;',
  /Θ/ => '&Theta;',
  /Ι/ => '&Iota;',
  /Κ/ => '&Kappa;',
  /Λ/ => '&Lambda;',
  /Μ/ => '&Mu;',
  /Ν/ => '&Nu;',
  /Ξ/ => '&Xi;',
  /Ο/ => '&Omicron;',
  /Π/ => '&Pi;',
  /Ρ/ => '&Rho;',
  /Σ/ => '&Sigma;',
  /Τ/ => '&Tau;',
  /Υ/ => '&Upsilon;',
  /Φ/ => '&Phi;',
  /Χ/ => '&Chi;',
  /Ψ/ => '&Psi;',
  /Ω/ => '&Omega;',
  /α/ => '&alpha;',
  /β/ => '&beta;',
  /γ/ => '&gamma;',
  /δ/ => '&delta;',
  /ε/ => '&epsilon;',
  /ζ/ => '&zeta;',
  /η/ => '&eta;',
  /θ/ => '&theta;',
  /ι/ => '&iota;',
  /κ/ => '&kappa;',
  /λ/ => '&lambda;',
  /μ/ => '&mu;',
  /ν/ => '&nu;',
  /ξ/ => '&xi;',
  /ο/ => '&omicron;',
  /π/ => '&pi;',
  /ρ/ => '&rho;',
  /ς/ => '&sigmaf;',
  /σ/ => '&sigma;',
  /τ/ => '&tau;',
  /υ/ => '&upsilon;',
  /φ/ => '&phi;',
  /χ/ => '&chi;',
  /ψ/ => '&psi;',
  /ω/ => '&omega;',
  /ϑ/ => '&thetasym;',
  /ϒ/ => '&upsih;',
  /ϖ/ => '&piv;',
  /–/ => '&ndash;',
  /—/ => '&mdash;',
  /‘/ => '&quot;',
  /’/ => '&quot;',
  /“/ => '&quot;',
  /”/ => '&quot;',
  /‚/ => '&sbquo;',
  /„/ => '&bdquo;',
  /†/ => '&dagger;',
  /‡/ => '&Dagger;',
  /•/ => '&bull;',
  /…/ => '&hellip;',
  /‰/ => '&permil;',
  /′/ => '&prime;',
  /″/ => '&Prime;',
  /‹/ => '&lsaquo;',
  /›/ => '&rsaquo;',
  /‾/ => '&oline;',
  /⁄/ => '&frasl;',
  /€/ => '&euro;',
  /ℑ/ => '&image;',
  /℘/ => '&weierp;',
  /ℜ/ => '&real;',
  /™/ => '&trade;',
  /ℵ/ => '&alefsym;',
  /←/ => '&larr;',
  /↑/ => '&uarr;',
  /→/ => '&rarr;',
  /↓/ => '&darr;',
  /↔/ => '&harr;',
  /↵/ => '&crarr;',
  /⇐/ => '&lArr;',
  /⇑/ => '&uArr;',
  /⇒/ => '&rArr;',
  /⇓/ => '&dArr;',
  /⇔/ => '&hArr;',
  /∀/ => '&forall;',
  /∂/ => '&part;',
  /∃/ => '&exist;',
  /∅/ => '&empty;',
  /∇/ => '&nabla;',
  /∈/ => '&isin;',
  /∉/ => '&notin;',
  /∋/ => '&ni;',
  /∏/ => '&prod;',
  /∑/ => '&sum;',
  /−/ => '&minus;',
  /∗/ => '&lowast;',
  /√/ => '&radic;',
  /∝/ => '&prop;',
  /∞/ => '&infin;',
  /∠/ => '&ang;',
  /∧/ => '&and;',
  /∨/ => '&or;',
  /∩/ => '&cap;',
  /∪/ => '&cup;',
  /∫/ => '&int;',
  /∴/ => '&there4;',
  /∼/ => '&sim;',
  /≅/ => '&cong;',
  /≈/ => '&asymp;',
  /≠/ => '&ne;',
  /≡/ => '&equiv;',
  /≤/ => '&le;',
  /≥/ => '&ge;',
  /⊂/ => '&sub;',
  /⊃/ => '&sup;',
  /⊄/ => '&nsub;',
  /⊆/ => '&sube;',
  /⊇/ => '&supe;',
  /⊕/ => '&oplus;',
  /⊗/ => '&otimes;',
  /⊥/ => '&perp;',
  /⋅/ => '&sdot;',
  /⌈/ => '&lceil;',
  /⌉/ => '&rceil;',
  /⌊/ => '&lfloor;',
  /⌋/ => '&rfloor;',
  /〈/ => '&lang;',
  /〉/ => '&rang;',
  /◊/ => '&loz;',
  /♠/ => '&spades;',
  /♣/ => '&clubs;',
  /♥/ => '&hearts;',
  /♦/ => '&diams;'
}

TYPE_QUOTES = {
  /‘/ => '&lsquo;',
  /’/ => '&rsquo;',
  /“/ => '&ldquo;',
  /”/ => '&rdquo;'
}

def entityReplace(el, typographic_quotes)
  if typographic_quotes
    ENTITIES.merge(TYPE_QUOTES).each do |k, v|
      el.text_gsub! k, v
    end
  else
    ENTITIES.each do |k, v|
      el.text_gsub! k, v
    end
  end
  
  el
end

def textReplace(str, typographic_quotes = nil)
  rep = {}
    while (str =~ ERB_REGEX) || (str =~ PHP_REGEX)
      r = rand
      rep["\0#{r}\0"] = $1
      str.gsub!($1, "\0#{r}\0")
    end

  if typographic_quotes
    ENTITIES.merge(TYPE_QUOTES).each do |k, v|
      str.gsub! k, v
    end
  else
    ENTITIES.each do |k, v|
      str.gsub! k, v
    end
  end
  
  rep.each do |k, v|
    str.gsub!(k, v)
  end

  str
end

def htmlReplace(html, typographic_quotes = nil)
  @html = ''
  h = Hpricot(html)
  # We don't want to replace stuff in the head
  unless h.search("/html/body").empty?
    body = h.search "/html/body"
    body.each do |el|
      entityReplace(el, typographic_quotes)
    end
    html = h
  else
    html = entityReplace(h, typographic_quotes)
  end
  html
end

get '/' do
  erb :home
end

post '/' do
  @javascript = params[:javascript_disabled]
  @html = params[:html]
  if @html
    @content = htmlReplace(@html, params[:typographic_quotes]) if params[:text_or_html] == "html"
    @content = textReplace(@html, params[:typographic_quotes]) if params[:text_or_html] == "text"
  else
    redirect '/', 500
  end
  
  unless @javascript
    erb :display_code, :layout => false
  else
    erb :display_code
  end
end