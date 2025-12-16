import { createClient } from '@supabase/supabase-js';

const projectURL = 'https://ijhkrvshwntabxmhruwl.supabase.co';
const projectKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqaGtydnNod250YWJ4bWhydXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTY0MzgsImV4cCI6MjA4MTQ5MjQzOH0.2sgPum0ZLGICmp0bQbZ7OJc3Ak8rJQmAUFC4lCOZFKk';

export const supabase = createClient(projectURL, projectKey);