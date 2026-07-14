import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <div className="p-10 text-2xl font-bold text-primary">Hello inside Layout</div>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
