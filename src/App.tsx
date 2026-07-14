import { HashRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Overview from "@/pages/Overview";
import Performance from "@/pages/Performance";
import Recruiters from "@/pages/Recruiters";
import HiringManagers from "@/pages/HiringManagers";
import Geography from "@/pages/Geography";
import Diversity from "@/pages/Diversity";
import Details from "@/pages/Details";
import SecondaryStatus from "@/pages/SecondaryStatus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="performance" element={<Performance />} />
              <Route path="recruiters" element={<Recruiters />} />
              <Route path="hiring-managers" element={<HiringManagers />} />
              <Route path="geography" element={<Geography />} />
              <Route path="diversity" element={<Diversity />} />
              <Route path="details" element={<Details />} />
              <Route path="secondary-status" element={<SecondaryStatus />} />
            </Route>
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
