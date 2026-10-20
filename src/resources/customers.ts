// What the interface says about customers: the list's columns and filters.

import type { Customer } from "@/lib/data";
import type { ResourceDescription } from "@/resources/types";

export const countries = [
  "Bulgaria",
  "France",
  "Germany",
  "Italy",
  "Netherlands",
  "Poland",
  "Portugal",
  "Spain",
  "Sweden",
  "United Kingdom",
].map((country) => ({ value: country, label: country }));

export const customersResource: ResourceDescription<Customer> = {
  singular: "customer",
  plural: "customers",
  path: "/customers",
  title: (customer) => customer.name,
  columns: [
    { field: "name", label: "Name", sortable: true, link: true },
    { field: "company", label: "Company", sortable: true },
    { field: "country", label: "Country", sortable: true },
    { field: "email", label: "Email" },
    {
      field: "createdAt",
      label: "Customer since",
      sortable: true,
      format: "date",
    },
  ],
  filters: [
    { type: "select", field: "country", label: "Country", options: countries },
    // Read as "Joined from", "Joined to"
    { type: "dates", field: "createdAt", label: "Joined" },
  ],
  search: "Name, email or company",
};
