-- =============================================================
-- Manobodha Database Schema (v2 — matches production schema)
-- The database already exists with this structure.
-- This file documents what's in place + adds the new evaluation
-- tables if they don't already exist.
--
-- To run on a fresh database:
--   mysql -u root -p < schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS manobodha_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE manobodha_db;

-- ---------------------------------------------------------------
-- Core user accounts
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                      VARCHAR(36)   NOT NULL,
  name                    VARCHAR(255)  NOT NULL,
  email                   VARCHAR(255)  NOT NULL,
  password_hash           VARCHAR(255)  NULL         COMMENT 'NULL for OAuth-only accounts',
  auth_provider           ENUM('local','google') NOT NULL DEFAULT 'local',
  google_id               VARCHAR(255)  NULL,
  -- Audience fields (also mirrored in user_profiles for new registrations)
  academic_background     VARCHAR(100)  NULL,
  psychology_familiarity  VARCHAR(50)   NULL,
  primary_goal            VARCHAR(100)  NULL,
  referral_source         VARCHAR(100)  NULL,
  data_consent            TINYINT(1)    NOT NULL DEFAULT 1,
  is_admin                TINYINT(1)    NOT NULL DEFAULT 0           COMMENT '1 for project creators / administrators',
  created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at           DATETIME      NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email   (email),
  UNIQUE KEY uq_users_google  (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- OAuth accounts
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oauth_accounts (
  provider_id       VARCHAR(50)   NOT NULL,
  provider_user_id  VARCHAR(255)  NOT NULL,
  user_id           VARCHAR(36)   NOT NULL,
  PRIMARY KEY (provider_id, provider_user_id),
  KEY fk_oauth_user (user_id),
  CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Sessions
-- NOTE: sessions.id is the PK, sessions.session_token is the
-- random token stored in the cookie (separate from the row ID).
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id             VARCHAR(36)   NOT NULL,
  user_id        VARCHAR(36)   NOT NULL,
  session_token  VARCHAR(255)  NOT NULL,
  expires_at     DATETIME      NOT NULL,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sessions_token (session_token),
  KEY idx_sessions_user    (user_id),
  KEY idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Audience / profile survey
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id          VARCHAR(36)   NOT NULL,
  user_type        ENUM('school_student','college_student','working_professional','enthusiast','other')
                                 NOT NULL,
  college_year     VARCHAR(20)   NULL,
  school_grade     VARCHAR(20)   NULL,
  institution_name VARCHAR(255)  NULL,
  referral_source  VARCHAR(100)  NULL,
  reason_for_visit TEXT          NULL,
  updated_at       TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Theory sessions
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS theory_sessions (
  id            VARCHAR(36)   NOT NULL,
  user_id       VARCHAR(36)   NOT NULL,
  theory        VARCHAR(100)  NOT NULL,
  started_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at  DATETIME      NULL,
  PRIMARY KEY (id),
  KEY idx_theory_sessions_user   (user_id),
  KEY idx_theory_sessions_theory (theory),
  CONSTRAINT fk_theory_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Concept-check / quiz results
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS concept_check_results (
  id          VARCHAR(36)   NOT NULL,
  user_id     VARCHAR(36)   NOT NULL,
  theory      VARCHAR(100)  NOT NULL,
  session_id  VARCHAR(36)   NULL,
  question_id VARCHAR(100)  NOT NULL,
  answer      VARCHAR(255)  NOT NULL,
  correct     TINYINT(1)    NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ccr_user    (user_id),
  KEY idx_ccr_theory  (theory),
  KEY idx_ccr_session (session_id),
  CONSTRAINT fk_ccr_user    FOREIGN KEY (user_id)    REFERENCES users (id)           ON DELETE CASCADE,
  CONSTRAINT fk_ccr_session FOREIGN KEY (session_id) REFERENCES theory_sessions (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Confidence ratings (1–5 self-assessment)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS confidence_ratings (
  id          VARCHAR(36)   NOT NULL,
  user_id     VARCHAR(36)   NOT NULL,
  theory      VARCHAR(100)  NOT NULL,
  session_id  VARCHAR(36)   NULL,
  rating      INT           NOT NULL COMMENT '1=Not confident at all, 5=Very confident',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cr_user    (user_id),
  KEY idx_cr_session (session_id),
  CONSTRAINT fk_cr_user    FOREIGN KEY (user_id)    REFERENCES users (id)           ON DELETE CASCADE,
  CONSTRAINT fk_cr_session FOREIGN KEY (session_id) REFERENCES theory_sessions (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- Interaction events (coarse-grained, evaluation-focused only)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interaction_events (
  id          VARCHAR(36)   NOT NULL,
  user_id     VARCHAR(36)   NOT NULL,
  theory      VARCHAR(100)  NOT NULL,
  event_type  VARCHAR(100)  NOT NULL,
  metadata    JSON          NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ie_user  (user_id),
  KEY idx_ie_event (event_type),
  CONSTRAINT fk_ie_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
