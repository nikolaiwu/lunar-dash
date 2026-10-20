// The shape of a resource's description: what its list shows and how it's
// filtered. The components (DataTable, FilterForm) read it, so a list page
// only passes the description, the data and the URL's state.

export interface Option {
  value: string;
  label: string;
}

// One column of a list
export interface Column<T> {
  // The field it shows, and sorts by
  field: keyof T & string;
  label: string;
  sortable?: boolean;
  // How the value reads: as it is, by default
  format?: "money" | "date" | "number";
  // Text in place of the value, such as a status's label or "#1042"
  text?: (item: T) => string;
  // The cell links to the item's page. The first such column is the row's
  // header: it names the row for screen readers.
  link?: boolean;
}

// One control in a list's filter form. A select filters a field to one
// value, with ?<field>=; dates keep a range of days, with ?from= and ?to=
// (one range per list).
export type Filter =
  | { type: "select"; field: string; label: string; options: Option[] }
  | { type: "dates"; field: string; label: string };

export interface ResourceDescription<T> {
  // In sentences: "3 orders", "Select order #1042"
  singular: string;
  plural: string;
  // The list's path; an item's page is the path and its id
  path: string;
  // What an item is called on its page and in links to it
  title: (item: T) => string;
  columns: Column<T>[];
  filters: Filter[];
  // The search box's label; the data layer decides which fields it searches
  search: string;
}
