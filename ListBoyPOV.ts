/**
 * this class declares a "point of view"
 * but it also can be used to describe the object of the verb too...
 */
class POV implements IRenderSelf{
    data: any[]
    constructor(
            // Admittedly this looks transposed in code,
            // but the order is more native to me from language studies
            first_singular: any, second_singluar: any, third_singular: any,
            first_plural: any, second_plural: any, third_plural: any) {
        this.data = [
            [first_singular, first_plural],
            [second_singluar, second_plural],
            [third_singular, third_plural],
        ]
    }

    Render() : HTMLElement {
        let table = document.createElement("table");
        for (const row of this.data) {
            let tableRow = document.createElement("tr");
            table.appendChild(tableRow);
            for (const column of row) {
                let tableData = document.createElement("td");
                tableRow.appendChild(tableData);
                tableData.appendChild(ListBoy.CreateItem(column));
            }
        }
        return table;
    }
}
