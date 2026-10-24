import sqlite3
from flask import g
from werkzeug.security import generate_password_hash
import os

DATABASE = 'database.db'

def get_db_connection():
    """Get database connection with row factory"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def close_db_connection(exception=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize database with all tables"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Users table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            dateofbirth DATE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            institution TEXT,
            research_domain TEXT,
            biography TEXT,
            profile_picture TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    """)
    
    # Events table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_title TEXT NOT NULL,
            event_description TEXT,
            event_start_date DATE NOT NULL,
            event_end_date DATE NOT NULL,
            event_location TEXT,
            event_theme TEXT,
            event_contact TEXT,
            organiser_id INTEGER NOT NULL,
            status TEXT DEFAULT 'upcoming',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_archived BOOLEAN DEFAULT 0,
            FOREIGN KEY (organiser_id) REFERENCES users (id)
        )
    """)
    
    # Propositions table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Proposition (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            resume TEXT,
            keywords TEXT,
            type TEXT NOT NULL,
            file_path TEXT,
            date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
            statut TEXT DEFAULT 'submitted',
            id_user INTEGER NOT NULL,
            id_evenement INTEGER NOT NULL,
            authors TEXT,
            is_withdrawn BOOLEAN DEFAULT 0,
            FOREIGN KEY (id_user) REFERENCES users (id),
            FOREIGN KEY (id_evenement) REFERENCES events (id)
        )
    """)
    
    # Evaluation table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Evaluation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_proposition INTEGER NOT NULL,
            id_evaluateur INTEGER NOT NULL,
            note_pertinence INTEGER,
            note_qualite INTEGER,
            note_originalite INTEGER,
            note_clarte INTEGER,
            commentaires TEXT,
            recommandation TEXT,
            date_evaluation DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_proposition) REFERENCES Proposition (id),
            FOREIGN KEY (id_evaluateur) REFERENCES users (id)
        )
    """)
    
    # Event committee
    cur.execute("""
        CREATE TABLE IF NOT EXISTS event_committee (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            role TEXT DEFAULT 'reviewer',
            FOREIGN KEY (event_id) REFERENCES events (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(event_id, user_id)
        )
    """)
    
    # Speakers
    cur.execute("""
        CREATE TABLE IF NOT EXISTS speakers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            biography TEXT,
            topic TEXT,
            photo TEXT,
            is_invited BOOLEAN DEFAULT 1,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)
    
    # Registrations
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Inscription (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type_inscription TEXT NOT NULL,
            statut_paiement TEXT DEFAULT 'pending',
            date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
            id_user INTEGER NOT NULL,
            id_evenement INTEGER NOT NULL,
            badge_generated BOOLEAN DEFAULT 0,
            badge_code TEXT,
            attendance_confirmed BOOLEAN DEFAULT 0,
            FOREIGN KEY (id_user) REFERENCES users (id),
            FOREIGN KEY (id_evenement) REFERENCES events (id),
            UNIQUE(id_user, id_evenement)
        )
    """)
    
    # Reviewer assignments
    cur.execute("""
        CREATE TABLE IF NOT EXISTS ReviewerAssignment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_proposition INTEGER NOT NULL,
            id_reviewer INTEGER NOT NULL,
            assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed BOOLEAN DEFAULT 0,
            FOREIGN KEY (id_proposition) REFERENCES Proposition (id),
            FOREIGN KEY (id_reviewer) REFERENCES users (id),
            UNIQUE(id_proposition, id_reviewer)
        )
    """)
    
    # Sessions
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            horaire DATETIME,
            salle TEXT,
            description TEXT,
            id_evenement INTEGER NOT NULL,
            responsable INTEGER,
            type TEXT DEFAULT 'plenary',
            FOREIGN KEY (id_evenement) REFERENCES events (id),
            FOREIGN KEY (responsable) REFERENCES users (id)
        )
    """)
    
    # Session propositions
    cur.execute("""
        CREATE TABLE IF NOT EXISTS SessionProposition (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_session INTEGER NOT NULL,
            id_proposition INTEGER NOT NULL,
            order_number INTEGER,
            FOREIGN KEY (id_session) REFERENCES Session (id),
            FOREIGN KEY (id_proposition) REFERENCES Proposition (id),
            UNIQUE(id_session, id_proposition)
        )
    """)
    
    # Workshops
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Workshops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            description TEXT,
            responsable_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            date DATE,
            max_participants INTEGER DEFAULT 50,
            current_participants INTEGER DEFAULT 0,
            materials TEXT,
            FOREIGN KEY (responsable_id) REFERENCES users (id),
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)
    
    # Workshop registrations
    cur.execute("""
        CREATE TABLE IF NOT EXISTS WorkshopRegistration (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workshop_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (workshop_id) REFERENCES Workshops (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(workshop_id, user_id)
        )
    """)
    
    # Questions
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            likes INTEGER DEFAULT 0,
            answered BOOLEAN DEFAULT 0,
            answer TEXT,
            FOREIGN KEY (session_id) REFERENCES Session (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Surveys
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Surveys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)
    
    # Survey responses
    cur.execute("""
        CREATE TABLE IF NOT EXISTS SurveyResponses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            survey_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            response TEXT,
            responded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (survey_id) REFERENCES Surveys (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Certificates
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            file_path TEXT,
            code TEXT UNIQUE,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)
    
    # Messages
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            subject TEXT,
            content TEXT NOT NULL,
            read_at DATETIME,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (receiver_id) REFERENCES users (id)
        )
    """)
    
    # Notifications
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            content TEXT NOT NULL,
            link TEXT,
            read_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    
    # Create admin user
    admin_hash = generate_password_hash('admin123')
    cur.execute("""
        INSERT OR IGNORE INTO users (username, email, password_hash, role) 
        VALUES ('admin', 'admin@example.com', ?, 'super_admin')
    """, (admin_hash,))
    
    conn.commit()
    conn.close()

def setup_database():
    """Setup database with all tables and initial data"""
    # Create database directory if needed
    os.makedirs(os.path.dirname(DATABASE) if os.path.dirname(DATABASE) else '.', exist_ok=True)
    init_db()
    print("Database initialized successfully!")