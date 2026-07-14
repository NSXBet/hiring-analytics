import { useEffect, useState } from "react";

const Overview = () => {
  const [result, setResult] = useState<string>("Iniciando...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/jobs?select=*&limit=5`;
        setResult(`URL: ${url}`);
        const response = await fetch(url, {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });
        const text = await response.text();
        setResult((prev) => `${prev}\nStatus: ${response.status}\nBody: ${text.slice(0, 200)}`);
      } catch (err) {
        setResult((prev) => `${prev}\nErro: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Overview Debug</h2>
      <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">{result}</pre>
    </div>
  );
};

export default Overview;
