/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 landru29
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

angular.module('UnitsConversion', []);

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 landru29
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

/**
 * @ngdoc service
 * @name UnitsConversion.Polynome
 * @module UnitsConversion
 * @description
 *  Perform basic operations on a polynome, including solve
 */
angular.module('UnitsConversion').service('Polynome', function(){
    'use strict';

    /**
     * @ngdoc method
     * @constructor
     * @name Polynome
     * @methodOf UnitsConversion.Polynome
     * @module UnitsConversion
     * @description
     * Constructor
     * @param {Object} polynomeObj Polynome; ie <pre>
     * {
     *     a0 : 1,
     *     a1 : 5,
     *     a2 : 6,
     *     a3 : 9
     * }</pre>
     **/
    var Polynome = function(polynomeObj) {
        var self = this;
        this.polynomeObj = {};
        var degrees = [0];
        Object.keys(polynomeObj).forEach(function(key) {
            var matcher = key.match(/[a-zA-Z_\.\-]*(\d+)/);
            if (matcher) {
                var degree = parseInt(matcher[1], 10);
                degrees.push(degree);
                self.polynomeObj[degree] = parseFloat(polynomeObj[key]);
            }
        });
        this.size = Math.max.apply(null, degrees) + 1;
    };

    /**
     * @ngdoc method
     * @name solveEq
     * @methodOf UnitsConversion.Polynome
     * @module UnitsConversion
     * @description
     * Solve a polynome equation a3.x^3 + a2.x^2 + a1.x + a0 = value
     * @param {Object} polynomeObj Polynome; ie <pre>
     * {
     *     a0 : 1,
     *     a1 : 5,
     *     a2 : 6,
     *     a3 : 9
     * }</pre>
     * @param  {Float} value       Value in the equation a3.x^3 + a2.x^2 + a1.x + a0 = value
     *
     * @return {Array} Set of solutions
     **/
    Polynome.prototype.solveEq = function(value) {
        switch (this.size) {
            case 1:
                return [];
            case 2:
                return firstDegree(this.polynomeObj, value);
            case 3:
                return secondDegree(this.polynomeObj, value);
            case 4:
                return thirdDegree(this.polynomeObj, value);
            default:
                return [];
        }
    };

    /**
     * @ngdoc method
     * @name invert
     * @methodOf UnitsConversion.Polynome
     * @module UnitsConversion
     * @description
     * Solve the polynome
     * @param   {Integer|float} value Value to pass to the polynome
     * @returns {Float} Solution
     */
    Polynome.prototype.invert = function(value){
        var result = this.solveEq(value);
        return result.length ? result[0] : null;
    };

    /**
     * @ngdoc method
     * @name direct
     * @methodOf UnitsConversion.Polynome
     * @module UnitsConversion
     * @description
     * Inject th value in the polynome
     * @param   {Integer|float} value Value to pass to the polynome
     * @returns {float} Solution
     */
    Polynome.prototype.direct = function(value) {
        var self = this;
        var result = 0;
        Object.keys(this.polynomeObj).forEach(function(degree) {
            result += self.polynomeObj[degree] * Math.pow(value, degree);
        });
        return result;
    };

    /**
     * Solve a first degree polynome
     *
     * @param {Object} polynomeObj Polynome; ie {a0: 1, a1:5}
     * @param  {Float} value       Value in the equation a1.x + a0 = value
     *
     * @return {Array}
     **/
    var firstDegree = function(polynomeObj, value) {
        if (polynomeObj[1]) {
            return [(value - (polynomeObj[0] ? polynomeObj[0] : 0)) / polynomeObj[1]];
        } else {
            return [];
        }
    };

    /**
     * Solve a second degree polynome
     *
     * @param {Object} polynomeObj Polynome; ie {a0: 1, a1:5, a2:6}
     * @param  {Float} value       Value in the equation a2.x^2 + a1.x + a0 = value
     *
     * @return {Array}
     **/
    var secondDegree = function(polynomeObj, value) {
        var delta = Math.pow(polynomeObj[1], 2) - 4 *(polynomeObj[0] - value) * polynomeObj[2];
        if (delta<0) {
            return [];
        }
        if (delta === 0) {
            return [-polynomeObj[1]/(2*polynomeObj[2])];
        }
        if (delta > 0) {
            return [
                (-polynomeObj[1] + Math.sqrt(delta)) / (2 * polynomeObj[2]),
                (-polynomeObj[1] - Math.sqrt(delta)) / (2 * polynomeObj[2])
            ];
        }
    };

    /**
     * Solve a third degree polynome
     *
     * @param {Object} polynomeObj Polynome; ie {a0: 1, a1:5, a2:6, a3:9}
     * @param  {Float} value       Value in the equation a3.x^3 + a2.x^2 + a1.x + a0 = value
     *
     * @return {Array}
     **/
    var thirdDegree = function(polynomeObj, value) {
        if (polynomeObj[3] !== 0) {
            if ((polynomeObj[1] === 0) && (polynomeObj[2] === 0)) {
                sol[0] = 1;
                return [-Math.pow((polynomeObj[0] - value) / polynomeObj[3],1/3)];
            } else {
                var a0 = (polynomeObj[0] - value) / polynomeObj[3];
                var a1 = polynomeObj[1] / polynomeObj[3];
                var a2 = polynomeObj[2] / polynomeObj[3];
                var a3 = a2 / 3;
                var p = a1 - a3 * a2;
                var q = a0 - a1 * a3 + 2 * Math.pow(a3, 3);
                var delta = Math.pow(q / 2, 2) + Math.pow(p / 3, 3);
                if (delta > 0) {
                    var w= Math.pow(-q / 2 + Math.sqrt(delta),1/3);
                    return [w - p / (3 * w) - a3];
                }
                if (delta === 0) {
                    return [
                        3 * q / p - a3,
                        -3 * q / (2 * p) - a3,
                        -3 * q / (2 * p) - a3
                    ];
                }
                if (delta < 0) {
                    var u= 2 * Math.sqrt(-p / 3);
                    var v= -q / (2 * Math.pow(-p / 3, 3 / 2));
                    var t= Math.acos(v) / 3;
                    return [
                        u * Math.cos(t) - a3,
                        u * Math.cos(t + 2 * Math.PI / 3) - a3,
                        u * Math.cos(t + 4 * Math.PI / 3) - a3
                    ];
                }
            }
        } else {
            return secondDegree(equ, value);
        }
    };

    return Polynome;
});

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 landru29
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

/**
 * @ngdoc service
 * @name UnitsConversion.UnitsConversion
 * @module UnitsConversion
 * @description
 *  Units conversions
 */
angular.module('UnitsConversion').service('UnitsConversion',
    ['Polynome', function (Polynome) {
        'use strict';

        var unitDecoder = /(([\w-]+)\.)?(.*)/;

        this.data = {
            temperature: {
                celcius: new Polynome({ // kelvin -> celcius
                    a0: -273.15,
                    a1: 1
                }),
                fahrenheit: new Polynome({ // kelvin -> fahrenheit
                    a0: -459.67,
                    a1: 9 / 5
                }),
                kelvin: new Polynome({ // kelvin -> kelvin
                    a1: 1
                })
            },
            color: {
                ebc: new Polynome({
                    a1: 1
                }),
                srm: new Polynome({
                    a1: 1 / 1.97
                }),
                lovibond: new Polynome({
                    a0: 0.561051,
                    a1: 0.374734
                }),
                mcu: {
                    direct: function (ebc) {
                        if (ebc / 1.97 >= 10) {
                            return (ebc / 1.97 - (50 / 7)) * 3.5;
                        } else {
                            return 10 - Math.sqrt(100.0 - ebc * 5.0761421);
                        }
                    },
                    invert: function (mcu) {
                        if (mcu >= 10) {
                            return 3.94 * (mcu + 25) / 7;
                        } else {
                            return (100 - Math.pow(10 - mcu, 2)) / 5.0761421;
                        }
                    }
                },
                rgb: {
                    direct: function (ebc) {
                        var toHex = function (i) {
                            var s = '00' + i.toString(16);
                            return s.substring(s.length - 2);
                        };
                        var r = Math.round(Math.min(255, Math.max(0, 255 * Math.pow(0.975, ebc / 1.97))));
                        var g = Math.round(Math.min(255, Math.max(0, 245 * Math.pow(0.88, ebc / 1.97))));
                        var b = Math.round(Math.min(255, Math.max(0, 220 * Math.pow(0.7, ebc / 1.97))));
                        return '#' + toHex(r) + toHex(g) + toHex(b);
                    },
                    invert: function (rgb) {
                        /*var color = rgb.match(/#(.{2})(.{2})(.{2})/);
                        if (color.length === 4) {
                            var r = parseInt(color[1], 16);
                            var g = parseInt(color[1], 16);
                            var b = parseInt(color[1], 16);
                        }*/
                        return 0;
                    }
                }
            },
            sugar: {
                plato: new Polynome({ // sg -> plato
                    a3: 135.997,
                    a2: -630.272,
                    a1: 1111.14,
                    a0: -616.868
                }),
                brix: new Polynome({ // sg -> brix
                    a3: 182.4601,
                    a2: -775.6821,
                    a1: 1262.7794,
                    a0: -669.5622
                }),
                alcohol: new Polynome({ // sg -> alcohol
                    a1: 1 / 0.76,
                    a0: -1 / 0.76
                }),
                sg: new Polynome({ // sg -> sg
                    a1: 1
                }),
                gPerLiter: new Polynome({ // sg -> grams per liter
                    a3: 1824.601,
                    a2: -7756.821,
                    a1: 12627.794,
                    a0: -6695.622
                })
            },
            mass: {
                kg: new Polynome({ // kg->kg
                    a1: 1
                }),
                g: new Polynome({ // kg->g
                    a1: 1000
                }),
                t: new Polynome({ // kg->T
                    a1: 0.001
                }),
                mg: new Polynome({ // kg->mg
                    a1: 1000000
                })
            },
            volume: {
                l: new Polynome({ // L -> L
                    a1: 1
                }),
                ml: new Polynome({ // L -> ml
                    a1: 1000
                }),
                dl: new Polynome({ // L -> dl
                    a1: 10
                }),
                cl: new Polynome({ // L -> cl
                    a1: 100
                }),
                'dm3': new Polynome({ // L -> dm3
                    a1: 1
                }),
                'm3': new Polynome({ // L -> m3
                    a1: 0.001
                }),
                'cm3': new Polynome({ // L -> cm3
                    a1: 1000
                }),
                'mm3': new Polynome({ // L -> mm3
                    a1: 1000000
                }),
                'gal-us': new Polynome({ // L -> gal-us
                    a1: 0.220
                }),
                'gal-en': new Polynome({ // L -> gal-en
                    a1: 0.264
                }),
                pinte: new Polynome({ // L -> pinte
                    a1: 1.760
                }),
            }
        };

        /**
         * @ngdoc method
         * @name fromTo
         * @methodOf UnitsConversion.UnitsConversion
         * @module UnitsConversion
         * @description
         * Convert units
         *
         * @param   {Float} value   Value to convert
         * @param  {String} from    Current unit (type.unit)
         * @param  {String} to      Destination unit (type.unit)
         * @param {Object=} options Options (type, precision)
         *
         * @return {Float} Converted value
         **/
        this.fromTo = function (value, from, to, options) {
            var UnitException = function (origin, message) {
                this.origin = origin;
                this.message = message;
            };


            var decodeFrom = this.decodeType(from);
            var decodeTo =  this.decodeType(to);
            var unitTo = decodeTo.name;
            var unitFrom = decodeFrom.name;

            value = ('string' === typeof value) ? parseFloat(value) : value;

            options = angular.extend(
                {
                    type: decodeFrom.family,
                    precision: null
                },
                options
            );

            if (!this.data[options.type]) {
                throw new UnitException('from', 'Type ' + options.type + ' does not exist in the unit conversion system');
            }
            if (!this.data[options.type][unitFrom]) {
                throw new UnitException('from', 'Unit ' + unitFrom + ' does not exist for type ' + options.type + '=> from = ' + from);
            }
            if (!this.data[options.type][unitTo]) {
                throw new UnitException('to', 'Unit ' + unitTo + ' does not exist for type ' + options.type + '=> to = ' + to);
            }
            var siValue = this.data[options.type][unitFrom].invert(value);
            if ('number' !== typeof siValue) {
                throw new UnitException('from', 'Value ' + value + ' is out of bounce in unit ' + unitFrom + ', type ' + options.type);
            }
            var result = this.data[options.type][unitTo].direct(siValue);
            if ((options.precision) && ('number' === typeof result)) {
                var dec = Math.pow(10, options.precision);
                return Math.round(result * dec) / dec;
            } else {
                return result;
            }
        };

        /**
         * @ngdoc method
         * @name decodeType
         * @methodOf UnitsConversion.UnitsConversion
         * @module UnitsConversion
         * @param  {String} type  unitType (ie 'mass.g' or 'mass')
         * @description
         * Decode a unit type
         *
         * @return {Object} decoded unit {type, name}
         **/
        this.decodeType = function(type) {
          if (!type) {
            return {};
          }
          var matcher = type.match(unitDecoder);
          if (!matcher[3]) {
            return {
              family: matcher[2]
            };
          }
          if (matcher[3]) {
            return {
              type: matcher[2] + '.' + matcher[3],
              family: matcher[2],
              name: matcher[3]
            };
          }
        };

        /**
         * @ngdoc method
         * @name getPhysicalUnits
         * @methodOf UnitsConversion.UnitsConversion
         * @module UnitsConversion
         * @param  {String=} type  Optional unitType (ie 'mass.g')
         * @description
         * Get the list of available units
         *
         * @return {Array|Object} Units description array, or the found type
         **/
        this.getPhysicalUnits = function(unitType) {
          var self = this;
          var type = self.decodeType(unitType);

          if (!type.family) {
            return Object.keys(this.data).map(function(type) {
              return {
                type: type,
                units: Object.keys(self.data[type]).map(function(unit) {
                  return {
                    name: unit,
                    type: type + '.' + unit
                  };
                })
              };
            });
          }

          if (!type.name) {
            return Object.keys(self.data[type.family]).map(function(unit) {
              return {
                name: unit,
                type: type.family + '.' + unit
              };
            });
          }

          if (type.name) {
            var result;
            Object.keys(this.data).forEach(function(family) {
              Object.keys(self.data[family]).forEach(function(unit) {
                if (type.type === family + '.' + unit) {
                  result = {
                    name: unit,
                    type: family + '.' + unit
                  };
                }
              });
            });
            return result;
          }
        };

        /**
         * @ngdoc method
         * @name registerConversion
         * @methodOf UnitsConversion.UnitsConversion
         * @module UnitsConversion
         * @description
         * Register a new convertion
         * @param   {Object} polynomeCoef Polynome coeficients
         * @param   {String} unit         Unit (type.unit | unit)
         * @param  {String=} type         Unit type (if not specified in unit)
         **/
        this.registerConversion = function (polynomeCoef, unit, type) {
            var decode = unit.match(unitDecoder);
            if (decode) {
                var thisUnitTo = decode[3];
                type = !type ? decode[2] : type;
                this.prototype.data[type] = angular.extend({}, this.prototype.data[type]);
                this.prototype.data[type][thisUnit] = new Polynome(polynomeCoef);
            }
        };

    }]);
