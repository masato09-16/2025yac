-- Complete Supabase Schema for YNU Classroom Occupancy System
-- This schema matches the backend models exactly

-- Drop existing tables if they exist (use with caution in production)
-- DROP TABLE IF EXISTS favorites CASCADE;
-- DROP TABLE IF EXISTS search_history CASCADE;
-- DROP TABLE IF EXISTS occupancy_history CASCADE;
-- DROP TABLE IF EXISTS occupancy CASCADE;
-- DROP TABLE IF EXISTS class_schedules CASCADE;
-- DROP TABLE IF EXISTS classrooms CASCADE;
-- DROP TABLE IF EXISTS buildings CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. Buildings table
CREATE TABLE IF NOT EXISTS public.buildings (
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    faculty VARCHAR NOT NULL,
    floors VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT buildings_pkey PRIMARY KEY (id)
);

-- 2. Classrooms table
CREATE TABLE IF NOT EXISTS public.classrooms (
    id VARCHAR NOT NULL,
    room_number VARCHAR NOT NULL,
    building_id VARCHAR NOT NULL,
    faculty VARCHAR NOT NULL,
    floor INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    has_projector BOOLEAN DEFAULT false,
    has_wifi BOOLEAN DEFAULT true,
    has_power_outlets BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT classrooms_pkey PRIMARY KEY (id),
    CONSTRAINT classrooms_building_id_fkey FOREIGN KEY (building_id) REFERENCES public.buildings(id)
);

-- Create indexes for classrooms
CREATE INDEX IF NOT EXISTS idx_classrooms_room_number ON public.classrooms(room_number);
CREATE INDEX IF NOT EXISTS idx_classrooms_faculty ON public.classrooms(faculty);
CREATE INDEX IF NOT EXISTS idx_classrooms_building_id ON public.classrooms(building_id);

-- 3. Class schedules table
CREATE TABLE IF NOT EXISTS public.class_schedules (
    id VARCHAR NOT NULL,
    classroom_id VARCHAR NOT NULL,
    class_name VARCHAR NOT NULL,
    instructor VARCHAR,
    day_of_week INTEGER NOT NULL,
    period INTEGER NOT NULL,
    start_time TIME WITHOUT TIME ZONE NOT NULL,
    end_time TIME WITHOUT TIME ZONE NOT NULL,
    semester VARCHAR,
    course_code VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT class_schedules_pkey PRIMARY KEY (id),
    CONSTRAINT class_schedules_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id)
);

-- Create indexes for class_schedules
CREATE INDEX IF NOT EXISTS idx_class_schedules_classroom_id ON public.class_schedules(classroom_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day_of_week ON public.class_schedules(day_of_week);

-- 4. Occupancy table (current occupancy status)
CREATE TABLE IF NOT EXISTS public.occupancy (
    id VARCHAR NOT NULL,
    classroom_id VARCHAR NOT NULL,
    current_count INTEGER NOT NULL DEFAULT 0,
    detection_confidence DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    camera_id VARCHAR,
    CONSTRAINT occupancy_pkey PRIMARY KEY (id),
    CONSTRAINT occupancy_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id),
    CONSTRAINT occupancy_classroom_id_unique UNIQUE (classroom_id)
);

-- Create indexes for occupancy
CREATE INDEX IF NOT EXISTS idx_occupancy_classroom_id ON public.occupancy(classroom_id);

-- 5. Occupancy history table
CREATE TABLE IF NOT EXISTS public.occupancy_history (
    id VARCHAR NOT NULL,
    classroom_id VARCHAR NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    count INTEGER NOT NULL,
    detection_confidence DOUBLE PRECISION NOT NULL,
    camera_id VARCHAR,
    CONSTRAINT occupancy_history_pkey PRIMARY KEY (id),
    CONSTRAINT occupancy_history_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id)
);

-- Create indexes for occupancy_history
CREATE INDEX IF NOT EXISTS idx_occupancy_history_classroom_id ON public.occupancy_history(classroom_id);
CREATE INDEX IF NOT EXISTS idx_occupancy_history_timestamp ON public.occupancy_history(timestamp);

-- 6. Users table
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    picture VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_unique UNIQUE (email)
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 7. Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    classroom_id VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT favorites_pkey PRIMARY KEY (id),
    CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_classroom_favorite UNIQUE (user_id, classroom_id)
);

-- Create indexes for favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_classroom_id ON public.favorites(classroom_id);

-- 8. Search history table
CREATE TABLE IF NOT EXISTS public.search_history (
    id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    faculty VARCHAR,
    building_id VARCHAR,
    status VARCHAR,
    search_mode VARCHAR NOT NULL,
    target_date VARCHAR,
    target_period INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT search_history_pkey PRIMARY KEY (id),
    CONSTRAINT search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Create indexes for search_history
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.occupancy ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.occupancy_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

