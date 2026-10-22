import { ActivityFeed } from "@/components/ActivityFeed";
import { BarChart } from "@/components/BarChart";
import { CardGrid } from "@/components/CardGrid";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { RecentOrders } from "@/components/RecentOrders";
import { Split } from "@/components/Split";
import { StatCard } from "@/components/StatCard";
import { StatusBreakdown } from "@/components/StatusBreakdown";
import { metrics, orders } from "@/lib/data";
import {
  formatChange,
  formatDate,
  formatMoney,
  formatNumber,
} from "@/lib/format";
import { orderStatuses } from "@/resources/orders";
import { LOW_STOCK } from "@/resources/products";

const DAYS = 30;

// The overview is the app's home page. It shares the root layout's segment, so
// the layout's title template doesn't reach it: it keeps the default title,
// the app's name.
export default async function OverviewPage() {
  const [{ current, previous }, revenue, byStatus, lowStock, recent, events] =
    await Promise.all([
      metrics.summary(DAYS),
      metrics.revenueByDay(DAYS),
      metrics.ordersByStatus(DAYS),
      metrics.lowStock(LOW_STOCK),
      orders.list({ pageSize: 5 }),
      metrics.activity(8),
    ]);

  const compared = `on the previous ${DAYS} days`;
  const best = revenue.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  const statusTotal = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader
        title="Overview"
        description={`The last ${DAYS} days, compared with the ${DAYS} before.`}
      />

      <CardGrid>
        <StatCard
          label="Revenue"
          value={current.revenue}
          display={formatMoney(current.revenue, { whole: true })}
          note={`${formatChange(current.revenue, previous.revenue)} ${compared}`}
        />
        <StatCard
          label="Orders"
          value={current.orders}
          display={formatNumber(current.orders)}
          note={`${formatChange(current.orders, previous.orders)} ${compared}`}
        />
        <StatCard
          label="New customers"
          value={current.newCustomers}
          note={`${formatChange(current.newCustomers, previous.newCustomers)} ${compared}`}
        />
        <StatCard
          label="Low stock"
          value={lowStock}
          note={`Products with ${LOW_STOCK} or fewer left`}
        />
      </CardGrid>

      <Split>
        <div>
          <section>
            <h2>Revenue per day</h2>
            {best.revenue === 0 ? (
              <EmptyState message={`No revenue in the last ${DAYS} days.`} />
            ) : (
              <BarChart
                points={revenue.map((day) => ({
                  label: formatDate(day.date),
                  value: day.revenue,
                }))}
                format={(cents) => formatMoney(cents, { whole: true })}
                summary={`Revenue per day over the last ${DAYS} days. Highest: ${formatMoney(best.revenue, { whole: true })} on ${formatDate(best.date)}.`}
                caption={`${formatDate(revenue[0].date)} to ${formatDate(revenue[revenue.length - 1].date)}, cancelled orders left out`}
              />
            )}
          </section>
          <section>
            <h2>Recent orders</h2>
            {recent.items.length > 0 ? (
              <RecentOrders orders={recent.items} />
            ) : (
              <EmptyState message="No orders yet." />
            )}
          </section>
        </div>
        <div>
          <section>
            <h2>Orders by status</h2>
            <StatusBreakdown
              parts={orderStatuses.map((status) => ({
                id: status.value,
                label: status.label,
                count: byStatus[status.value],
              }))}
              total={statusTotal}
            />
          </section>
          <section>
            <h2>Activity</h2>
            {events.length > 0 ? (
              <ActivityFeed events={events} />
            ) : (
              <EmptyState message="Nothing has happened yet." />
            )}
          </section>
        </div>
      </Split>
    </>
  );
}
