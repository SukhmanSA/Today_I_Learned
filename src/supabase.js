import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://fnqkvrrofttgumtlqfsx.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucWt2cnJvZnR0Z3VtdGxxZnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcyMTgyMjMsImV4cCI6MjAzMjc5NDIyM30.adVXRYm49-3jSg2RyvBIcPL5_0LFKbe4edm8QCQtR-M"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase