import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Overview", subtitle: "Visão geral das vagas fechadas e em andamento" },
  "/performance": { title: "Performance por Diretoria", subtitle: "Análise de contratações por área" },
  "/recruiters": { title: "Recruiters", subtitle: "Desempenho dos recrutadores" },
  "/hiring-managers": { title: "Hiring Managers", subtitle: "Análise por gestor de contratação" },
  "/geography": { title: "Geography", subtitle: "Distribuição geográfica das vagas" },
  "/diversity": { title: "Diversity", subtitle: "Métricas de diversidade e inclusão" },
  "/details": { title: "Details", subtitle: "Tabela completa de requisições" },
  "/secondary-status": { title: "Secondary Status", subtitle: "Análise de status secundários" },
};

const Layout = () => {
  const location = useLocation();
  const { title, subtitle } = pageTitles[location.pathname] || { title: "Dashboard", subtitle: "" };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <Header title={`${title} [path=${location.pathname} hash=${location.hash}]`} subtitle={subtitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
