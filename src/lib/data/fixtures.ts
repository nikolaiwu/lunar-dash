// The demo's data: Acme Robotics' customers, products and orders, invented
// by a seeded generator so they're the same on every run. Dates count back
// from the start of today, so the last 30 days always have orders.
//
// This file is the demo's database. Replace lib/data's resource functions to
// use your own; nothing outside lib/data imports it.

import { seeded } from "./random";
import type {
  Customer,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  StatusChange,
} from "./types";

const DAY = 24 * 60 * 60 * 1000;

const PRODUCTS: [name: string, category: string, price: number][] = [
  ["Rover X1", "Rovers", 4_200_00],
  ["Rover X2 Heavy", "Rovers", 7_900_00],
  ["Rover Mini", "Rovers", 1_450_00],
  ["Trailrunner", "Rovers", 5_600_00],
  ["Arm Kit", "Arms", 890_00],
  ["Arm Pro 6-Axis", "Arms", 3_400_00],
  ["Gripper Soft", "Arms", 240_00],
  ["Gripper Vacuum", "Arms", 310_00],
  ["Skyline Quad", "Drones", 2_100_00],
  ["Skyline Hex", "Drones", 3_850_00],
  ["Hover Scout", "Drones", 960_00],
  ["Lidar 360", "Sensors", 1_190_00],
  ["Depth Camera", "Sensors", 420_00],
  ["Thermal Eye", "Sensors", 780_00],
  ["IMU Board", "Sensors", 89_00],
  ["Ultrasonic Pack", "Sensors", 49_00],
  ["Battery 48V", "Parts", 520_00],
  ["Charging Dock", "Parts", 680_00],
  ["Wheel Set", "Parts", 190_00],
  ["Track Set", "Parts", 340_00],
  ["Servo 20kg", "Parts", 65_00],
  ["Controller Board", "Parts", 299_00],
  ["Cable Harness", "Parts", 59_00],
  ["Spare Propellers", "Parts", 39_00],
];

const FIRST = [
  "Ada",
  "Ben",
  "Chen",
  "Dana",
  "Emil",
  "Fatima",
  "Goran",
  "Hana",
  "Ivan",
  "Jules",
  "Kofi",
  "Lena",
  "Mateo",
  "Nadia",
  "Oskar",
  "Priya",
  "Quinn",
  "Rosa",
  "Sami",
  "Tess",
];
const LAST = [
  "Novak",
  "Okafor",
  "Lindqvist",
  "Moreau",
  "Petrov",
  "Sato",
  "Silva",
  "Kowalski",
  "Haddad",
  "Brennan",
  "Fischer",
  "Mendes",
  "Ivanova",
  "Larsen",
  "Costa",
];
const COMPANIES = [
  "Northwind Farms",
  "Bluefield Logistics",
  "Orbit Labs",
  "Granite Mining",
  "Harbor Freight Co.",
  "Sunpeak Solar",
  "Meadow Robotics Club",
  "Quarry & Sons",
  "Polar Research",
  "Vineyard Systems",
  "Delta Warehousing",
  "Cobalt University",
];
const COUNTRIES = [
  "Bulgaria",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Spain",
  "Italy",
  "Poland",
  "United Kingdom",
  "Portugal",
];

export interface Fixtures {
  customers: Customer[];
  products: Product[];
  orders: Order[];
}

export function createFixtures(today: Date): Fixtures {
  const random = seeded(2026);
  const at = (daysAgo: number) =>
    new Date(today.getTime() - daysAgo * DAY).toISOString();

  const products: Product[] = PRODUCTS.map(([name, category, price], i) => ({
    id: `p${i + 1}`,
    name,
    sku: `${category.slice(0, 3).toUpperCase()}-${String(101 + i)}`,
    category,
    price,
    // A few run low, so the stock meters and the low-stock count show it
    stock: i % 7 === 3 ? random.int(0, 4) : random.int(8, 120),
  }));

  const customers: Customer[] = Array.from({ length: 50 }, (_, i) => {
    const first = random.pick(FIRST);
    const last = random.pick(LAST);
    return {
      id: `c${i + 1}`,
      name: `${first} ${last}`,
      email: `${first}.${last}@example.com`.toLowerCase(),
      company: random.pick(COMPANIES),
      country: random.pick(COUNTRIES),
      // Some signed up in the last weeks, so "new customers" has a number
      createdAt: at(i < 8 ? random.int(1, 60) : random.int(61, 720)),
    };
  });

  // Orders over the last 90 days, more of them recently. Each one moves
  // through its statuses as time passes; some get cancelled.
  const drafts = Array.from({ length: 200 }, () => {
    const placedAgo = 90 * random.next() ** 1.3 + 0.05;
    const customer = random.pick(customers);
    const items: OrderItem[] = Array.from({ length: random.int(1, 3) }, () => {
      const product = random.pick(products);
      return {
        productId: product.id,
        name: product.name,
        quantity: random.int(1, 3),
        price: product.price,
      };
    });

    const steps: [OrderStatus, number][] = [["pending", placedAgo]];
    if (random.next() < 0.08) {
      steps.push(["cancelled", placedAgo - 0.5]);
    } else {
      const shippedAgo = placedAgo - 1 - random.next();
      steps.push(["paid", placedAgo - 0.02]);
      steps.push(["shipped", shippedAgo]);
      steps.push(["delivered", shippedAgo - 2 - 2 * random.next()]);
    }
    // Only the steps that have happened by now
    const history: StatusChange[] = steps
      .filter(([, ago]) => ago > 0)
      .map(([status, ago]) => ({ status, at: at(ago) }));

    return {
      customerId: customer.id,
      customerName: customer.name,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: history[history.length - 1].status,
      placedAt: history[0].at,
      history,
    };
  });

  // Numbered in the order they were placed
  const orders: Order[] = drafts
    .sort((a, b) => a.placedAt.localeCompare(b.placedAt))
    .map((draft, i) => ({ id: String(1001 + i), number: 1001 + i, ...draft }));

  return { customers, products, orders };
}
