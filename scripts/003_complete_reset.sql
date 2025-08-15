-- Complete database reset and fresh schema with leaderboard support
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS fitness_sessions CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with leaderboard fields
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  study_points INTEGER DEFAULT 0,
  fitness_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create study sessions table
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  session_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fitness sessions table
CREATE TABLE fitness_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  points_earned INTEGER DEFAULT 0,
  session_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user achievements table
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(200) NOT NULL,
  description TEXT,
  points_awarded INTEGER DEFAULT 0,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user sessions table for auth
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_total_points ON users(total_points DESC);
CREATE INDEX idx_study_sessions_user_date ON study_sessions(user_id, session_date);
CREATE INDEX idx_fitness_sessions_user_date ON fitness_sessions(user_id, session_date);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);

-- Insert sample leaderboard data
INSERT INTO users (email, password_hash, username, full_name, total_points, study_points, fitness_points, current_streak, level) VALUES
('demo@focusforge.com', '$2b$10$example', 'demo_user', 'Demo User', 2500, 1500, 1000, 15, 3),
('alex@example.com', '$2b$10$example', 'alex_fit', 'Alex Johnson', 2200, 1200, 1000, 12, 3),
('sarah@example.com', '$2b$10$example', 'sarah_study', 'Sarah Chen', 1800, 1300, 500, 8, 2),
('mike@example.com', '$2b$10$example', 'mike_balance', 'Mike Rodriguez', 1600, 800, 800, 10, 2),
('emma@example.com', '$2b$10$example', 'emma_focus', 'Emma Thompson', 1400, 900, 500, 6, 2);
