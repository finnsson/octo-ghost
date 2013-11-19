/**
 * @class TableGroupItem
 */
var TableGroupItem = function () {
};

TableGroupItem.prototype.init = function (data) {
    var self = this;
    this.sorter = ko.observable();
    this.sortInverse = ko.observable(false);
    this.originalDataList = ko.observableArray(data);
    this.dataList = ko.computed(function () {
        var s = self.sorter();
        if (s) {
            self.originalDataList.sort(function (left, right) {
                if (self.sortInverse()) {
                    return -1 * s(left, right);
                } else {
                    return s(left, right);
                }
            });
        }
        return self.originalDataList();
    });
};

TableGroupItem.prototype.setSorter = function (fn) {
    if (this.sorter() === fn) {
        this.sortInverse(!this.sortInverse());
    } else {
        this.sortInverse(false);
        this.sorter(fn);
    }
};


/**
 *
 * @class TableGroup
 */
var TableGroup = function () {
};

TableGroup.prototype.init = function (data) {
    var self = this;
    this.activeFilters = ko.observableArray([]);
    this.originalData = ko.observableArray(data);
    this.filteredData = ko.computed(function () {
        var f = self.activeFilters();
        // apply all filters
        var result = self.originalData();
        // for each filter
        $.each(f, function (tableFilterIndex, tableFilter) {
            // apply the filter
            result = _.filter(result, function (d, i) {
                return tableFilter.filter(d, tableFilter.value());
            });
        });
        return result;
    });

    this.grouping = ko.observable();

    this.groups = ko.computed(function () {
        if (self.grouping()) {
            var g = self.grouping();
            var groups = _.groupBy(self.filteredData(), g);
            var groupItems = $.map(groups, function (value, index) {
                return self.createTableGroupItem(value);
            });
            return groupItems;
        } else {
            return [self.createTableGroupItem(self.filteredData())];
        }
    });

    this.filters = [];


    this.originalData(data);
};

TableGroup.prototype.clearFilter = function () {
    $.each(this.activeFilters(), function (i, f) {
        f.value(null);
    });
    this.activeFilters([]);
};

TableGroup.prototype.createTableGroupItem = function (data) {
    var item = new TableGroupItem();
    item.init(data);
    return item;
};

TableGroup.prototype.applyFilter = function () {
    // calculate which filters are active
    var activeFilters = _.filter(this.filters, function (f) {
        return f.active();
    });
    this.activeFilters(activeFilters);
};

TableGroup.prototype.clearGrouping = function () {
    this.grouping(null);
};

/**
 * @class TableFilter
 */
var TableFilter = function (name, filter) {
    var self = this;
    this.name = name;
    this.filter = filter;
    this.value = ko.observable(null);
    this.active = ko.computed(function () {
        var v = self.value();
        return v != "" && v != null;
    });
};
