import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

const FilterBar = ({ search, onSearchChange, placeholder = "Buscar...", children }: FilterBarProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="relative w-full sm:max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
    <div className="flex items-center gap-2">
      {children}
      <Button variant="outline" size="sm" className="gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </Button>
    </div>
  </div>
);

export default FilterBar;
