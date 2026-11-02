CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150),
  resume_text MEDIUMTEXT,          -- paste your resume/summary here
  skills JSON,                     -- ["Angular","Node.js","Keycloak",...]
  target_titles JSON,              -- ["Full Stack Developer","Angular Developer"]
  min_score INT DEFAULT 70
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(50),
  external_id VARCHAR(150),
  title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  is_remote TINYINT(1) DEFAULT 0,
  category ENUM('INDORE','REMOTE') NOT NULL,
  description MEDIUMTEXT,
  url VARCHAR(1000),
  salary VARCHAR(100),
  posted_at DATETIME NULL,
  dedupe_hash CHAR(64) NOT NULL UNIQUE,   -- sha256(title+company+location)
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL UNIQUE,
  profile_id INT NOT NULL,
  score TINYINT,                   -- 0-100
  reason TEXT,
  matched_skills JSON,
  missing_skills JSON,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE user_jobs (          -- your status per job
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL UNIQUE,
  status ENUM('NEW','NOTIFIED','APPLIED','IGNORED') DEFAULT 'NEW',
  notified_at DATETIME NULL,
  applied_at DATETIME NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  channel ENUM('EMAIL','IN_APP') DEFAULT 'EMAIL',
  status ENUM('PENDING','SENT','FAILED') DEFAULT 'PENDING',
  error TEXT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);