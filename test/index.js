
/**
 *
 * @class AccountTableGroup
 */
var AccountTableGroup = function () {
};

AccountTableGroup.prototype = new TableGroup();

AccountTableGroup.prototype.init = function (data) {
    TableGroup.prototype.init.call(this, data);

    this.balanceFilter = new TableFilter('balance', function (data, value) {
        var v = parseFloat(value);
        return data.balance > v;
    });

    this.filters = [this.balanceFilter];
};


AccountTableGroup.prototype.groupByType = function () {
    this.grouping('type');
};
AccountTableGroup.prototype.groupByOwner = function () {
    this.grouping('owner');
};

AccountTableGroup.prototype.createTableGroupItem = function (data) {
    var item = new AccountTableGroupItem();
    item.init(data);
    return item;
};


/**
 *
 * @class AccountTableGroupItem
 */
var AccountTableGroupItem = function () {
};

AccountTableGroupItem.prototype = new TableGroupItem();

AccountTableGroupItem.prototype.balanceSorter = function (left, right) {
    return left.balance - right.balance;
};

AccountTableGroupItem.prototype.typeSorter = function (left, right) {
    return left.type === right.type ? 0 : (left.type > right.type ? 1 : -1)
};
AccountTableGroupItem.prototype.ownerSorter = function (left, right) {
    return left.owner === right.owner ? 0 : (left.owner > right.owner ? 1 : -1)
};

AccountTableGroupItem.prototype.sortByBalance = function () {
    this.setSorter(this.balanceSorter);
};

AccountTableGroupItem.prototype.sortByType = function () {
    this.setSorter(this.typeSorter);
};
AccountTableGroupItem.prototype.sortByOwner = function () {
    this.setSorter(this.ownerSorter);
};

var testData = [
    {
        name: "Konto 1",
        balance: 123546,
        type: "Allkonto",
        owner: "Pelle"
    },
    {
        name: "Konto 2",
        balance: 23098,
        type: "Allkonto",
        owner: "Arne"
    },
    {
        name: "Mitt konto",
        balance: 382,
        type: "Bra konto",
        owner: "Pelle"
    },
    {
        name: "Konto 2",
        balance: 847388222,
        type: "Bra konto",
        owner: "Arne"
    }
];

var myAccountTableGroup = new AccountTableGroup();
myAccountTableGroup.init(testData);

var vm = {
    accounts: myAccountTableGroup
};

$(function () {
    ko.applyBindings(vm);
});