// filter.ts

// Define a type for an object that can hold any key-value pair
interface AnyObj {
    [key: string]: unknown;
}

// GraphQL Filter Interface
export interface Filter {
    key: string; // The key (field) to filter by
    type: "single" | "list"; // The type of filter - single or list
    value: (boolean | string | number)[]; // The values for filtering
    operator?: "ne" | "eq" | "between" | "contains"; // Optional filter operator (default to "eq")
}

// Function to generate a structured GraphQL filter query
export const generateQuery = (input: Filter[]): AnyObj => {
    // Object to hold single value filters
    const singles: AnyObj = {};
    
    // Array to hold list filters
    const lists: any[] = [];

    // Loop through each filter in the input
    input.forEach((filter) => {
        // Proceed only if the filter has values
        if (filter.value.length > 0) {

            // If the filter type is "single", handle it here
            if (filter.type === "single") {
                // Assign the single value filter with the operator (default to "eq")
                singles[filter.key] = { [filter.operator || "eq"]: filter.value[0] };
            } else {
                // If the filter type is "list", handle multiple values
                lists.push(
                    filter.value.map((val) => ({
                        [filter.key]: { [filter.operator || "contains"]: val },
                    }))
                );
            }
        }
    });

    // Merge list filters into a structured AND/OR condition
    // This creates a logical AND for all list filters and OR for each individual list item
    const finalLists = lists.length
        ? lists.reduce((acc, curr) => ({ and: { or: curr, ...acc } }), {})
        : {};

    // Return a combined object of single and list filters
    return { ...singles, ...finalLists };
};

// Example usage with an array of filters
const filters: Filter[] = [
    { key: "name", type: "single", value: ["qwerty"] }, // Single filter for "name"
    { key: "deleted", type: "single", operator: "ne", value: [true] }, // Single filter for "deleted"
    { key: "city", type: "list", operator: "eq", value: ["berlin", "chennai"] }, // List filter for "city"
];

// Call the function with the filters and log the resulting GraphQL query
const query = generateQuery(filters);
console.log(query);

// Example Output:
// {
//   "name": { "eq": "qwerty" },
//   "deleted": { "ne": true },
//   "and": {
//     "or": [
//       { "city": { "eq": "berlin" } },
//       { "city": { "eq": "chennai" } }
//     ]
//   }
// }