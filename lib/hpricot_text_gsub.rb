# Hpricot Text GSub 0.1.5
# http://termos.vemod.net/hpricot-text-gsub
#
# See the tests at the bottom for usage examples.
#
# Released into the public domain.
#
# Please send bug reports and improvements to
# christoffer.sawicki@gmail.com.
#
# Thanks to Tim Fletcher for telling me how to make the code simpler.

require "hpricot"

module HpricotTextGSub
  module NodeWithChildrenExtension
    def text_gsub!(*args, &block)
      children.each { |x| x.text_gsub!(*args, &block) }
    end
  end
  
  module TextNodeExtension
    def text_gsub!(*args, &block)
      content.gsub!(*args, &block)
    end
  end
end

Hpricot::Doc.send(:include,  HpricotTextGSub::NodeWithChildrenExtension)
Hpricot::Elem.send(:include, HpricotTextGSub::NodeWithChildrenExtension)
Hpricot::Text.send(:include, HpricotTextGSub::TextNodeExtension)