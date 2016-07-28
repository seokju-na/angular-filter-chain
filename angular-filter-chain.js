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

    var isUndefined = function (value) {
        return value === (void 0);
    };

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


    function FilterChain(items, $filter, filterMap) {
        var prop;

        this.$$filter = $filter;
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
    FilterChain.prototype.applyFilter = function (filterName) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();

        this.items = this.$$filter(filterName).apply(null, [angular.copy(this.items)].concat(args));

        return this;
    };
    FilterChain.prototype.getItems = function () {
        return this.items;
    };


    var angularModule = angular.module('angular-filter-chain', []);

    angularModule.factory('chainFilters', ['$filter', function ($filter) {
        return function (items, filterMap) {
            if (isUndefined(filterMap)) {
                filterMap = {};
            }

            return new FilterChain(items, $filter, filterMap);
        };
    }]);
})();
