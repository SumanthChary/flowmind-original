/*
  # Create workflow management tables

  1. New Tables
    - `workflows`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `data` (text) - compressed workflow data
      - `status` (text)
      - `size` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references auth.users)
    
    - `workflow_versions`
      - `id` (text, primary key)
      - `workflow_id` (text, references workflows)
      - `version` (integer)
      - `data` (text)
      - `message` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)
    
    - `collaboration_sessions`
      - `workflow_id` (text, references workflows)
      - `user_id` (uuid, references auth.users)
      - `user_name` (text)
      - `last_seen` (timestamp)
      - `cursor` (jsonb)
      - `selection` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  data text NOT NULL,
  status text DEFAULT 'draft',
  size integer DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Workflow versions table
CREATE TABLE IF NOT EXISTS public.workflow_versions (
  id text PRIMARY KEY,
  workflow_id text REFERENCES public.workflows(id) ON DELETE CASCADE,
  version integer NOT NULL,
  data text NOT NULL,
  message text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(workflow_id, version)
);

ALTER TABLE public.workflow_versions ENABLE ROW LEVEL SECURITY;

-- Collaboration sessions table
CREATE TABLE IF NOT EXISTS public.collaboration_sessions (
  workflow_id text REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  last_seen timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  cursor jsonb,
  selection jsonb,
  PRIMARY KEY (workflow_id, user_id)
);

ALTER TABLE public.collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflows
CREATE POLICY "Users can read own workflows"
  ON public.workflows
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create workflows"
  ON public.workflows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own workflows"
  ON public.workflows
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own workflows"
  ON public.workflows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for workflow versions
CREATE POLICY "Users can read versions of own workflows"
  ON public.workflow_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows 
      WHERE id = workflow_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create versions of own workflows"
  ON public.workflow_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workflows 
      WHERE id = workflow_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for collaboration sessions
CREATE POLICY "Users can read collaboration sessions for accessible workflows"
  ON public.collaboration_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows 
      WHERE id = workflow_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own collaboration sessions"
  ON public.collaboration_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON public.workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_workflows_updated_at ON public.workflows(updated_at);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_versions_workflow_id ON public.workflow_versions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_versions_version ON public.workflow_versions(workflow_id, version);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_workflow_id ON public.collaboration_sessions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_last_seen ON public.collaboration_sessions(last_seen);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Function to clean up old collaboration sessions
CREATE OR REPLACE FUNCTION cleanup_old_collaboration_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.collaboration_sessions 
  WHERE last_seen < timezone('utc'::text, now()) - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old sessions (if pg_cron is available)
-- SELECT cron.schedule('cleanup-collaboration-sessions', '*/15 * * * *', 'SELECT cleanup_old_collaboration_sessions();');