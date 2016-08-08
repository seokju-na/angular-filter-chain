# Angular Filter Chain

[![Build Status](https://travis-ci.org/seokju-na/angular-filter-chain.svg?branch=master)](https://travis-ci.org/seokju-na/angular-filter-chain)

Chaining filters in angular.


## Install

Download ``angular-filter-chain.js``(or minified file ``angular-filter-chain.min,js``) in project folder.

Or bower:

```shell
$ bower install --save angular-chain-filter
```

Or npm:

```npm
$ npm install --save angular-chain-filter
```


## Usage

Include ``angular-filter-chain.js`` to your project and then you can start using the ``angular-filter-chain`` provider.

For example in controllers:

```js
var app = angular.module('myApp', ['angular-filter-chain']);

app.controller('MainCtrl', function ($scope, chainFilters) {
    var peoples = [
        { id: 0, name: 'John', sex: 'male', age: 17, email: 'john@a.com' },
        { id: 1, name: 'Steven', sex: 'male', age: 22, email: 'steven@b.com' },
        { id: 2, name: 'Carly', sex: 'female', age: 18, email: 'carly@a.com' },
        { id: 3, name: 'Tommy', sex: 'male', age: 15, email: 'stark@c.com' },
        { id: 4, name: 'Karen', sex: 'female', age: 23, email: 'MØ@leanon.com' }
    ];
    
    function nameDecorator(items, prefix) {
        // Items are copied from originals.
        // Originals will not change even if you change items in filter. 
        var idx = 0;
        
        for (idx; idx < items.length; idx++) {
            items[idx].name = prefix + items[idx].name;
        }
        
        return items;
    }
    
    $scope.filteredPeoples =
        chainFilters(peoples, {
            nameFilter: nameDecorator
        })
        .nameFilter('o-')    // You can use your own filter when you give filter map on config.
        .applyFilter('orderBy', '-age')   // Or use filters which provided by $filter
        .getItems();
        
    /*
    Results:
    $scope.filteredPeoples =
        { id: 3, name: 'o-Tommy', sex: 'male', age: 15, email: 'stark@c.com' },
        { id: 0, name: 'o-John', sex: 'male', age: 17, email: 'john@a.com' },
        { id: 2, name: 'o-Carly', sex: 'female', age: 18, email: 'carly@a.com' },
        { id: 1, name: 'o-Steven', sex: 'male', age: 22, email: 'steven@b.com' },
        { id: 4, name: 'o-Karen', sex: 'female', age: 23, email: 'MØ@leanon.com' }
    ];
    */ 
});
```


## API

#### ``chainFilters(items[, filterMap])``

*items*
    Collection which used in filters.
    

*filterMap*
    Custom filters map which can be chained. Those filters will receive *items* data on first argument. Define property key as name and value as filter, you can use filter by access key. 
    For example:
    
    function customFilter(items, ...) { ... }
    
    var filteredItems = chainFilters(items, {
        myFilter: customFilter
    })
    .myFilter(...)
    .getItems();
    

#### ``.applyFilter(filterName[, params])``

User filter which provided by ``$filterProvider``.


#### ``.getItems()``

Return filtered items.

Your original items will not change.


## License

MIT Licensed

[See more](https://github.com/seokju-na/angular-filter-chain/blob/master/LICENSE)

