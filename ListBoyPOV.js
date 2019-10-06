/**
 * this class declares a "point of view"
 * but it also can be used to describe the object of the verb too...
 */
var POV = /** @class */ (function () {
    function POV(
    // Admittedly this looks transposed in code,
    // but the order is more native to me from language studies
    first_singular, second_singluar, third_singular, first_plural, second_plural, third_plural) {
        this.data = [
            [first_singular, first_plural],
            [second_singluar, second_plural],
            [third_singular, third_plural],
        ];
    }
    POV.prototype.Render = function () {
        var table = document.createElement("table");
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var row = _a[_i];
            var tableRow = document.createElement("tr");
            table.appendChild(tableRow);
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var column = row_1[_b];
                var tableData = document.createElement("td");
                tableRow.appendChild(tableData);
                tableData.appendChild(ListBoy.CreateItem(column));
            }
        }
        return table;
    };
    return POV;
}());
//# sourceMappingURL=ListBoyPOV.js.map