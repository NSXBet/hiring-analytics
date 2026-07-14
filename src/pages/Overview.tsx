const Overview = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Overview Debug</h2>
      <p>URL: {url || "undefined"}</p>
      <p>Key: {key ? "configured" : "undefined"}</p>
    </div>
  );
};

export default Overview;
