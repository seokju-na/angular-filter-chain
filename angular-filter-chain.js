(function () {
    'use strict';

    /**
     * AngularFilterChain - Chaining filters
     * @version v0.1.0
     * @link https://github.com/seokju-na/angular-filter-chain
     * @author Seokju Na <seokmaTD@gmail.com>
     * @license MIT License, http://www.opensource.org/licenses/MIT
     */

    var toString = Object.prototype.toString;

    var isFunction = function (value) {
        return !!value &&
            (typeof value === 'object' || typeof value === 'function') &&
            (
                toString.call(value) === '[object Function]' ||
                toString.call(value) === '[object GeneratorFunction]'
            );
    };

    var getFuncWhichItemsAreBind = function (func, that) {
        if (!isFunction(func)) {
            throw new Error('Filter must be function.');
        }

        return function () {
            var args = Array.prototype.slice.call(arguments);
            this.items = func.apply(null, [angular.copy(that.items)].concat(args));
            return this;
        }.bind(that);
    };

    var FilterChain = (function () {
        function FilterChainConstructor(items, filterMap) {
            var prop;

            this.items = angular.copy(items);

            for (prop in filterMap) {
                if ({}.hasOwnProperty.call(filterMap, prop)) {
                    if (prop === 'items') {
                        throw new Error("Filter name 'items' cannot be resolved.");
                    }
                    this[prop] = getFuncWhichItemsAreBind(filterMap[prop], this);
                }
            }
        }

        FilterChainConstructor.prototype.getItems = function () {
            return this.items;
        };

        return FilterChainConstructor;
    })();


    var angularModule = angular.module('angular-filter-chaining', []);

    angularModule.factory('chainFilters', function () {
        return function (items, filterMap) {
            return new FilterChain(items, filterMap);
        };
    });
})();
