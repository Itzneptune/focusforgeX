-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(255),
  duration_minutes INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fitness_sessions table
CREATE TABLE IF NOT EXISTS fitness_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'running', 'cycling', 'gym', 'calisthenics', 'habit'
  activity_name VARCHAR(255),
  duration_minutes INTEGER,
  distance_km DECIMAL(8,2),
  weight_kg DECIMAL(5,2),
  sets INTEGER,
  reps INTEGER,
  points_earned INTEGER DEFAULT 0,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table for tracking overall progress
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  study_streak INTEGER DEFAULT 0,
  fitness_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  last_fitness_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_fitness_sessions_user_date ON fitness_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
