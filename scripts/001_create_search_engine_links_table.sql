CREATE TABLE public.search_engine_links (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type text NOT NULL,
    country text NOT NULL,
    source_name text NOT NULL,
    source_url text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    active boolean DEFAULT true NOT NULL,
    description text,
    state_codes text[] DEFAULT '{}'::text[],
    priority integer DEFAULT 5 NOT NULL,
    is_free boolean DEFAULT false NOT NULL,
    features text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.search_engine_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.search_engine_links FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.search_engine_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.search_engine_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.search_engine_links FOR DELETE USING (auth.role() = 'authenticated');
