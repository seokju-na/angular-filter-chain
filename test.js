describe('angular-filter-chain SPEC', function () {
    var chainFilters;

    var testingItems = [
        { id: 0, name: 'a', typeA: 'a', typeB: '4' },
        { id: 1, name: 'b', typeA: 'a', typeB: '2' },
        { id: 2, name: 'c', typeA: 'b', typeB: '3' },
        { id: 3, name: 'd', typeA: 'b', typeB: '3' },
        { id: 4, name: 'e', typeA: 'c', typeB: '2' },
        { id: 5, name: 'f', typeA: 'c', typeB: '3' },
        { id: 6, name: 'g', typeA: 'd', typeB: '4' },
        { id: 7, name: 'h', typeA: 'd', typeB: '1' }
    ];

    beforeEach(function () {
        var filterModule = angular.module('test.filters', []);

        filterModule.filter('TestingFilterA', function () {
            return function (items, typeA) {
                return _.filter(items, { typeA: typeA });
            };
        });

        filterModule.filter('TestingFilterC', function () {
            return function (items, typeAOne, typeATwo) {
                return _.filter(items, function (item) {
                    return item.typeA === typeAOne || item.typeA === typeATwo;
                });
            };
        });
    });

    beforeEach(function () {
        angular.module('test', ['test.filters', 'angular-filter-chain']);
    });

    beforeEach(angular.mock.module('test'));

    beforeEach(function () {
        angular.mock.inject(function (_chainFilters_) {
            chainFilters = _chainFilters_;
        });
    });

    it('applyFilter 호출 시 해당 이름의 filter를 사용할 수 있다.', function () {
        var filteredItems;

        filteredItems =
            chainFilters(testingItems)
                .applyFilter('TestingFilterA', 'a')
                .getItems();

        expect(filteredItems).toEqual([
            { id: 0, name: 'a', typeA: 'a', typeB: '4' },
            { id: 1, name: 'b', typeA: 'a', typeB: '2' }
        ]);
    });

    it("filterMap으로 넘긴 필터 함수 중, 이름이 'items'인 함수가 있는 경우 Error를 발생시킨다.", function () {
        var testingFilter = function (items, typeA) {
            return _.filter(items, { typeA: typeA });
        };

        expect(function () {
            chainFilters(testingItems, {
                items: testingFilter()
            });
        }).toThrow(
            new Error("Filter name 'items' cannot be resolved.")
        );
    });

    it('필터가 함수가 아닌 경우 Error를 발생시킨다.', function () {
        expect(function () {
            chainFilters(testingItems, {
                filterA: null,
                filterB: undefined
            });
        }).toThrow(
            new Error('Filter must be function.')
        );

        expect(function () {
            chainFilters(testingItems, {
                filterA: 1234,
                filterB: '123'
            });
        }).toThrow(
            new Error('Filter must be function.')
        );

        expect(function () {
            chainFilters(testingItems, {
                filterA: { a: function () {} },
                filterB: [1, 3]
            });
        }).toThrow(
            new Error('Filter must be function.')
        );
    });

    it('필터 함수들을 체인하여 필터링 되어진 아이템을 구할 수 있다.', function () {
        var filteredItems;
        var testingFilterB = function (items, typeB) {
            return _.filter(items, { typeB: typeB });
        };

        filteredItems = chainFilters(testingItems, { filterTypeB: testingFilterB })
                .applyFilter('TestingFilterC', 'a', 'c')
                .filterTypeB('2')
                .getItems();

        expect(filteredItems).toEqual([
            { id: 1, name: 'b', typeA: 'a', typeB: '2' },
            { id: 4, name: 'e', typeA: 'c', typeB: '2' }
        ]);
    });
});
