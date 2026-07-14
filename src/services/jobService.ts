import { supabase } from "@/lib/supabase";
import { Job, JobStatus } from "@/types";

export const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as Job[];
};

export const fetchJobsByStatus = async (status: JobStatus): Promise<Job[]> => {
  const { data, error } = await supabase.from("jobs").select("*").eq("status", status);
  if (error) throw new Error(error.message);
  return (data || []) as Job[];
};

export const fetchJobsByDirector = async (director: string): Promise<Job[]> => {
  const { data, error } = await supabase.from("jobs").select("*").eq("director", director);
  if (error) throw new Error(error.message);
  return (data || []) as Job[];
};
