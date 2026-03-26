import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jtyytfkirveugxxuvxjl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0eXl0ZmtpcnZldWd4eHV2eGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzkyMTIsImV4cCI6MjA4OTU1NTIxMn0.qSoogGam0_P0mMYgqitk0MgMS3ZRNf2sIEdzNfZXXE0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
