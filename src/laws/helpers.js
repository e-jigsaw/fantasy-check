var Tuple3 = require('fantasy-tuples').Tuple3,
    functionLength = require('fantasy-helpers').functionLength,

    Integer = {},
    integerEnv = function(λ) {
        return λ
            .property('Integer', Integer)
            .method('arb',
                function(a) {
                    return Integer === a;
                },
                function(a, b) {
                    var variance = (Math.pow(2, 32) - 1) / this.goal;
                    return this.randomRange(-variance, variance) | 0;
                }
            );
    },
    tuple3Of = function(a, b, c) {
        var self = this.getInstance(this, tuple3Of);
        self.types = Tuple3(a, b, c);
        return self;
    },
    tuple3OfEnv = function(λ) {
        var isTuple3Of = λ.isInstanceOf(tuple3Of);
        return λ
            .property('tuple3Of', tuple3Of)
            .method('arb', isTuple3Of, function(a, b) {
                var types = a.types;
                return Tuple3(
                    this.arb(types._1, b - 1),
                    this.arb(types._2, b - 1),
                    this.arb(types._3, b - 1)
                );
            });
    },

    invoke = function(a) {
        return function(f) {
            var length = functionLength(f);
            return f.apply(null, a.slice(0, length));
        };
    },
    equality = function(a, b) {
        var x = Object.keys(a).sort().map(function(v) {
                return a[v];
            }),
            y = Object.keys(b).sort().map(function(v) {
                return b[v];
            });

        return foldLeft(zipWith(x, y), true, function(a, b) {
            return a && b[0] === b[1];
        });
    },

    // [TODO] - Move these out when we get a fantasy-lists
    foldLeft = function(a, v, f) {
        var i;
        for (i = 0; i < a.length; i++) {
            v = f(v, a[i]);
        }
        return v;
    },
    zipWith = function(a, b) {
        var accum = [],
            total = Math.min(a.length, b.length),
            i;
        for(i = 0; i<total; i++) {
            accum[i] = [a[i], b[i]];
        }
        return accum;
    };

if (typeof module != 'undefined')
    module.exports = {
        integerEnv: integerEnv,
        tuple3OfEnv: tuple3OfEnv,
        equality: equality,
        invoke: invoke,
        foldLeft: foldLeft,
        zipWith: zipWith
    };
