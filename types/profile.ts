// `type` alias, not `interface` — see the note in types/company.ts.
export type Profile = {
  id: string;
  company_id: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};
