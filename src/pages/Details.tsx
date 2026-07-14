import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Table2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/FilterBar";
import StatusBadge from "@/components/StatusBadge";
import DataTable from "@/components/DataTable";
import { useJobs } from "@/hooks/useJobs";
import { useSelectedYear } from "@/contexts/YearContext";
import { formatDate } from "@/lib/metrics";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types";

const PAGE_SIZE = 10;

const Details = () => {
  const { selectedYear } = useSelectedYear();
  const { data: jobs, isLoading } = useJobs(selectedYear);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    const term = search.toLowerCase();
    return jobs.filter(
      (job) =>
        job.role.toLowerCase().includes(term) ||
        job.recruiter.toLowerCase().includes(term) ||
        job.hiring_manager.toLowerCase().includes(term) ||
        job.director.toLowerCase().includes(term) ||
        job.country.toLowerCase().includes(term) ||
        job.status.toLowerCase().includes(term)
    );
  }, [jobs, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const exportCsv = () => {
    if (!jobs) return;
    const headers = ["COD", "Role", "Status", "Recruiter", "Hiring Manager", "Director", "Country", "Level", "Opening", "Closing"];
    const rows = filtered.map((j) =>
      [j.cod, j.role, j.status, j.recruiter, j.hiring_manager, j.director, j.country, j.level || "", j.opening_date || "", j.closing_date || ""].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hiring-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !jobs) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Table2 className="h-6 w-6 text-primary" />
          Details
        </h2>
        <p className="text-muted-foreground">Complete requisitions table with search and export.</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <FilterBar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by role, recruiter, manager, directorate...">
          <Button variant="outline" size="sm" className="gap-2" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </FilterBar>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Requisitions ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={paginated}
              keyExtractor={(row) => row.id}
              columns={[
                { key: "cod", header: "COD" },
                { key: "role", header: "Role" },
                { key: "status", header: "Status", render: (row: Job) => <StatusBadge status={row.status} /> },
                { key: "recruiter", header: "Recruiter" },
                { key: "hiring_manager", header: "Hiring Manager" },
                { key: "director", header: "Directorate" },
                { key: "country", header: "Country" },
                { key: "level", header: "Level" },
                { key: "opening_date", header: "Opening", render: (row: Job) => formatDate(row.opening_date) },
                { key: "closing_date", header: "Closing", render: (row: Job) => formatDate(row.closing_date) },
              ]}
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Details;
