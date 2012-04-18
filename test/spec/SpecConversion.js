describe('Conversion', function() {
    it('Should return a string', function() {
        var str = 'foo',
            c = new Conversion(str);

        expect(c.getNewString()).toEqual(str);
    });

    it('Should return the HTML escaped string for each entity', function() {
        for(var e in Conversion.prototype.entities) {
            var c = new Conversion(e);

            expect(c.getNewString()).toEqual(Conversion.prototype.entities[e]);
        }

        var str = 'hello $$ hello',
            c = new Conversion(str);

        expect(c.getNewString()).toEqual(str);

        var str = 'hello $\' hello',
            c = new Conversion(str);

        expect(c.getNewString()).toEqual(str);

        var c = new Conversion('$£');

        expect(c.getNewString()).toEqual('$&#163;');
    });

    it('Should not replace ampersands that are already part of an entity', function() {
        var str = 'Foo &#38; Bar',
            c = new Conversion(str);

        expect(c.getNewString()).toEqual(str);
    });

    it('Should allow the user to use typographic quotes', function() {
        var c = new Conversion('“Foo”', true);

        expect(c.getNewString()).toEqual('&#8220;Foo&#8221;');
    });

    it('Should return valid HTML if specified by the user', function() {
        var c = new Conversion('<header><p>Foo & Bar</p></header>');

        expect(c.getNewString()).toEqual('<header><p>Foo &#38; Bar</p></header>');
    });

    it('Should ignore entities in attributes', function() {
        var str = '<head><script src = "http://foo.bar?test=foo&test=bar"></script></head>';
            c = new Conversion(str);

        expect(c.getNewString()).toEqual(str);
    });

    it('Should not replace entities within <script> tags', function() {
        var str = '<script>var s && t;</script>',
            c = new Conversion(str);

        expect(c.getNewString()).toEqual(str);
    });
});
