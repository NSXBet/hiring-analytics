import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { YearProvider } from "@/contexts/YearContext";
import Layout from "@/components/layout/Layout";
import Overview from "@/pages/Overview";
import Performance from "@/pages/Performance";
import Recruiters from "@/pages/Recruiters";
import HiringManagers from "@/pages/HiringManagers";
import Geography from "@/pages/Geography";
import Diversity from "@/pages/Diversity";
import Details from "@/pages/Details";
import SecondaryStatus from "@/pages/SecondaryStatus";
import Levels from "@/pages/Levels";
import Contracts from "@/pages/Contracts";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <YearProvider>
        <BrowserRouter basename="/hiring-analytics">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="performance" element={<Performance />} />
              <Route path="recruiters" element={<Recruiters />} />
              <Route path="hiring-managers" element={<HiringManagers />} />
              <Route path="geography" element={<Geography />} />
              <Route path="diversity" element={<Diversity />} />
              <Route path="levels" element={<Levels />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="details" element={<Details />} />
              <Route path="secondary-status" element={<SecondaryStatus />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </YearProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
