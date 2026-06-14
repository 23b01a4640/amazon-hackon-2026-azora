import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kwngvmnegpkwurxrwznz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bmd2bW5lZ3Brd3VyeHJ3em56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMTg2NDksImV4cCI6MjA5Njg5NDY0OX0.ZtGR8Pm0HM2Q-T3QpdubyhIe_cSMyXwivaUB4X_4VGw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
