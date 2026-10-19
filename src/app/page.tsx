// The overview is the app's home page. It shares the root layout's segment, so
// the layout's title template doesn't reach it: it keeps the default title,
// the app's name.
export default function OverviewPage() {
  return (
    <>
      <h1>Overview</h1>
      <p>Sales, orders and stock at a glance.</p>
    </>
  );
}
