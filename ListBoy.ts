
/**
 * this class declares a "point of view"
 * but it also can be used to describe the object of the verb too...
 */
class POV {
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

    table() {
        var table = document.createElement("table");
        for (const row of this.data) {
            var tableRow = document.createElement("tr");
            table.appendChild(tableRow);
            for (const column of row) {
                var tableData = document.createElement("td");
                tableRow.appendChild(tableData);
                tableData.appendChild(ListBoy.CreateItem(column));
            }
        }
        return table;
    }
}

function isString(data: any): boolean {
    return data.constructor === String;
}

/**
 * The class that knows how to render data objects
 * Usage:
 * ListBoy.Render({}, "main");
 */
class ListBoy {
    /**
     * Renders the data object into the target DOM object
     * @param dataObject The data to render
     * @param targetId The ID of the DOM object to render it into
     */
    static RenderTo(dataObject: any, targetId: string): void {
        document.addEventListener("DOMContentLoaded", event => {
            document.getElementById(targetId).appendChild(ListBoy.CreateItem(dataObject));
        });
    }

    /**
     * Builds a single item (not recommended for external use)
     * @param item The item to build
     */
    static CreateItem(item: any): HTMLElement | Text {
        if (item instanceof POV) {
            return item.table();
        } else if (item.constructor == Object) {  // JSON
            return ListBoy.CreateData(item);
        } else if (typeof(item) == "number") {
            return document.createTextNode(item.toString());
        } else if (typeof(item) == "string") {
            return ListBoy.CreateText(item, "tlhingan");
        } else if (Array.isArray(item)) {
            return ListBoy.CreateArray(item);
        } else if (typeof(item) === "object") {
            if (item.tagName === "SPAN") {
                return item;
            } else {
                alert(`Don't know how to build an object with tag: ${item.tagName}`);
            }
        } else {
            alert(`Don't know how to build a ${typeof item}`);
        }
    }

    /**
     * Creates a text Node, potentially inside a span (dealing with pseudo markdown)
     * @param item The string for the span
     * @param defaultClass The class to use (if it isn't markdown)
     */
    private static CreateText(item: string, defaultClass: string = null) : HTMLElement | Text {
        if (item[0] === "`") {  // This is the indicator for markdown mode
            var pieces = item.substring(1).split("*");
            var language = "descriptive"; // presume no formatting
            var container = document.createElement("span");
            for (var piece of pieces) {
                if (piece !== "") {
                    var span = document.createElement("span");
                    span.classList.add(language);

                    // Gah, Hack to support <sup> blocks.
                    span.innerHTML = piece;
                    // span.appendChild(document.createTextNode(piece));

                    container.appendChild(span);
                }
                // adjust language state
                if (language === "descriptive") { // One star always puts us into italics
                    language = "english";
                } else {
                    if (piece === "") { // This means two stars
                        // I'm not convinced this works with nested ** and *
                        if (language === "english") {
                            language = "tlhingan";
                        } else {
                            language = "english";
                        }
                    } else {
                        language = "descriptive"
                    }
                }
            }
            return container;
        } else {
            var classToSurround = defaultClass;
            if (classToSurround != null) {
                var element = document.createElement("span");
                element.classList.add(defaultClass);

                element.appendChild(document.createTextNode(item));
                // element.innerHTML = item;

                return element
            } else {
                return document.createTextNode(item);
            }
        }
    }

    /**
     * Creates data from an array
     * @param data The array data
     */
    private static CreateArray(data: Array<any>): HTMLDivElement {
        var container = document.createElement("div");
        container.className = "array";
        for(var item of data) {
            container.appendChild(this.CreateItem(item));
        }
        return container;
    }

    /** Builds as if from a dictionary */
    private static CreateData(data: Object) : HTMLDivElement {
        var container = document.createElement("div");
        container.className = "container"

        for(let [key, value] of Object.entries(data)) {

            if (typeof(value) === "function") {
                value(container);
            } else {
                var itemContainer = document.createElement("div");
                container.appendChild(itemContainer);
                if (isString(value)) {
                    itemContainer.appendChild(ListBoy.CreateText(key, "english"));
                    itemContainer.appendChild(document.createTextNode(" "));  // emspace
                    itemContainer.appendChild(ListBoy.CreateItem(value));
                } else {
                    var item = document.createElement("div");
                    item.classList.add("item");
                    var header = document.createElement("div");
                    header.classList.add("itemHeader");
                    header.appendChild(ListBoy.CreateText(key));
                    item.appendChild(header);
                    item.appendChild(ListBoy.CreateItem(value));
                    itemContainer.appendChild(item);
                }
            }
        }
        return container;
    }
}
