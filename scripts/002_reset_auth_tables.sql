-- Reset and recreate user authentication tables with proper constraints
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS fitness_sessions CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with proper constraints
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study sessions table
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fitness sessions table
CREATE TABLE fitness_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity VARCHAR(100) NOT NULL,
  duration INTEGER, -- in minutes
  sets INTEGER,
  reps INTEGER,
  weight DECIMAL(5,2),
  distance DECIMAL(8,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user stats table
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_study_time INTEGER DEFAULT 0,
  total_fitness_time INTEGER DEFAULT 0,
  current_study_streak INTEGER DEFAULT 0,
  current_fitness_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  last_fitness_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_fitness_sessions_user_id ON fitness_sessions(user_id);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
