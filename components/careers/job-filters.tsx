import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ALL_VALUE = "all";

interface SelectFilterProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  allLabel: string;
}

function SelectFilter({
  id,
  label,
  value,
  onValueChange,
  options,
  allLabel,
}: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="h-11 w-full min-w-44 text-sm sm:w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface JobFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  jobType: string;
  onJobTypeChange: (value: string) => void;
  workPolicy: string;
  onWorkPolicyChange: (value: string) => void;
  locationOptions: string[];
  jobTypeOptions: string[];
  workPolicyOptions: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function JobFilters({
  search,
  onSearchChange,
  location,
  onLocationChange,
  jobType,
  onJobTypeChange,
  workPolicy,
  onWorkPolicyChange,
  locationOptions,
  jobTypeOptions,
  workPolicyOptions,
  hasActiveFilters,
  onClearFilters,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Label htmlFor="job-search" className="sr-only">
          Search by job title
        </Label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="job-search"
          type="search"
          placeholder="Search by job title"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-12 rounded-lg pl-11 text-base sm:h-13"
        />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <SelectFilter
          id="location-filter"
          label="Location"
          value={location}
          onValueChange={onLocationChange}
          options={locationOptions}
          allLabel="All locations"
        />
        <SelectFilter
          id="job-type-filter"
          label="Job Type"
          value={jobType}
          onValueChange={onJobTypeChange}
          options={jobTypeOptions}
          allLabel="All job types"
        />
        <SelectFilter
          id="work-policy-filter"
          label="Work Policy"
          value={workPolicy}
          onValueChange={onWorkPolicyChange}
          options={workPolicyOptions}
          allLabel="All work policies"
        />

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
