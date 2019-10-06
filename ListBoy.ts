
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

/** These are the CSS classes that ListBoy emits and recommends get styled by the caller */
enum CSSClasses {
    /** A div rendered from an array */
    Array = "array",
    /** A div rendered from a raw JSON object */
    Dictionary = "dictionary",
    /** A span for a raw string */
    String = "string",
    /** A div for a Dictionary Entry that is just `string: string` */
    SimpleDictionaryEntry = "simple-dictionary-entry",
    /** A div for a Dicionary Entry that is more complex than `string: string` */
    ComplexDictionaryEntry = "complex-dictionary-entry",
    /** A default span for the key of a dictionary, i.e. a name of a JSON member, with a string value */
    SimpleKeyDefault = "simple-key-default",
    /** A default span for the key of a dictionary, i.e. a name of a JSON member, with a complex value */
    ComplexKeyDefault = "complex-key-default",
    /** A div which always contains the header of a complex entry */
    ComplexEntryHeader = "complex-entry-header",
    /** A div which always contains the body of a complex entry */
    ComplexEntryBody = "complex-entry-body",
}

enum MarkdownFormatting {
    Emphasis = "em",
    Strong = "strong",
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
            document.getElementById(targetId).appendChild(this.CreateItem(dataObject));
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
            return this.CreateData(item);
        } else if (typeof(item) == "number") {
            return document.createTextNode(item.toString());
        } else if (typeof(item) == "string") {
            return this.CreateText(item, CSSClasses.String);
        } else if (Array.isArray(item)) {
            return this.CreateArray(item);
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

    private static MarkdownTag(content: string, format: MarkdownFormatting) : HTMLElement | Text {
        if (format === null) {
            return document.createTextNode(content);
        }
        var element = document.createElement(format);
        // Gah, Hack to support <sup> blocks.
        element.innerHTML = content;
        // element.appendChild(document.createTextNode(content));
        return element;
    }

    /**
     * Creates a text Node, potentially inside a span (dealing with pseudo markdown)
     * @param item The string for the span
     * @param defaultClass The class to use (if it isn't markdown)
     */
    private static CreateText(item: string, defaultClass = null) : HTMLElement | Text {
        if (item[0] === "`") {  // This is the indicator for markdown mode
            var pieces = item.substring(1).split("*");
            var format : MarkdownFormatting = null; // presume no formatting
            var container = document.createElement("span");
            for (var piece of pieces) {
                if (piece !== "") {
                    container.appendChild(this.MarkdownTag(piece, format))
                }
                // adjust language state
                if (format === null) { // One star always puts us into italics
                    format = MarkdownFormatting.Emphasis;
                } else {
                    if (piece === "") { // This means two stars
                        // I'm not convinced this works with nested ** and *
                        if (format === MarkdownFormatting.Emphasis) {
                            format = MarkdownFormatting.Strong
                        } else {
                            format = MarkdownFormatting.Emphasis
                        }
                    } else {
                        format = null;
                    }
                }
            }
            return container;
        } else {
            var element = document.createElement("span");
            element.className = defaultClass;

            element.appendChild(document.createTextNode(item));
            // element.innerHTML = item;
            return element
        }
    }

    /**
     * Creates data from an array
     * @param data The array data
     */
    private static CreateArray(data: Array<any>): HTMLDivElement {
        var container = document.createElement("div");
        container.className = CSSClasses.Array;
        for(var item of data) {
            container.appendChild(this.CreateItem(item));
        }
        return container;
    }

    /** Builds as if from a dictionary */
    private static CreateData(data: Object) : HTMLDivElement {
        var container = document.createElement("div");
        container.className = CSSClasses.Dictionary;

        for(let [key, value] of Object.entries(data)) {

            if (typeof(value) === "function") {
                value(container);
            } else {
                var itemContainer = document.createElement("div");
                container.appendChild(itemContainer);
                if (isString(value)) {
                    itemContainer.className = CSSClasses.SimpleDictionaryEntry;
                    itemContainer.appendChild(this.CreateText(key, CSSClasses.SimpleKeyDefault));
                    itemContainer.appendChild(document.createTextNode(" "));  // emspace
                    itemContainer.appendChild(this.CreateItem(value));
                } else {
                    itemContainer.className = CSSClasses.ComplexDictionaryEntry;

                    var entryHeader = document.createElement("div");
                    entryHeader.className = CSSClasses.ComplexEntryHeader;
                    entryHeader.appendChild(this.CreateText(key, CSSClasses.ComplexKeyDefault));
                    itemContainer.appendChild(entryHeader);

                    var entryBody = document.createElement("div");
                    entryBody.className = CSSClasses.ComplexEntryBody;
                    entryBody.appendChild(this.CreateItem(value));
                    itemContainer.appendChild(entryBody);
                }
            }
        }
        return container;
    }
}
