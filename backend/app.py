from flask import Flask, render_template, request, url_for, redirect, jsonify, send_file
from flask_cors import CORS
import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash
from flask import session
import os
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import uuid
import random
import secrets
from functools import wraps
import logging
import json
from io import BytesIO
import qrcode
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
import pandas as pd

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)
app.secret_key = secrets.token_hex(32)

# Configuration
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

UPLOAD_FOLDER = 'upload/proposals'
CERTIFICATE_FOLDER = 'upload/certificates'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CERTIFICATE_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CERTIFICATE_FOLDER'] = CERTIFICATE_FOLDER

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('app.log'), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Decorators
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Login required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'role' not in session or session['role'] not in roles:
                return jsonify({'error': 'Unauthorized'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def setup_database():
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
    
    # Create admin user with pbkdf2:sha256
    admin_hash = generate_password_hash('admin123', method='pbkdf2:sha256')
    cur.execute("""
        INSERT OR IGNORE INTO users (username, email, password_hash, role) 
        VALUES ('admin', 'admin@example.com', ?, 'super_admin')
    """, (admin_hash,))
    
    conn.commit()
    conn.close()

# ============ ROUTES ============

# Auth routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cur.fetchone()
    conn.close()
    
    if user and check_password_hash(user['password_hash'], password):
        session.permanent = True
        session['user_id'] = user['id']
        session['email'] = user['email']
        session['role'] = user['role']
        session['username'] = user['username']
        
        return jsonify({
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'role': user['role'],
            'institution': user['institution']
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'participant')
    institution = data.get('institution', '')
    dateofbirth = data.get('dateofbirth', '')
    
    if not username or not email or not password:
        return jsonify({'error': 'All fields required'}), 400
    
    # Utiliser pbkdf2:sha256 pour la compatibilité avec Python 3.9
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (username, email, password_hash, role, institution, dateofbirth)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (username, email, hashed_password, role, institution, dateofbirth))
        conn.commit()
        conn.close()
        logger.info(f"User registered: {username} ({email})")
        return jsonify({'message': 'Registration successful'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 400

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200

@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, role, institution, research_domain, biography, dateofbirth FROM users WHERE id=?", (session['user_id'],))
    user = cur.fetchone()
    conn.close()
    
    if user:
        return jsonify(dict(user)), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/auth/update-profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    
    updates = []
    params = []
    for field in ['username', 'institution', 'research_domain', 'biography', 'dateofbirth']:
        if field in data:
            updates.append(f"{field} = ?")
            params.append(data[field])
    
    if updates:
        params.append(session['user_id'])
        cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE id=?", params)
        conn.commit()
    
    conn.close()
    return jsonify({'message': 'Profile updated'}), 200

# Events routes
@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT e.*, u.username as organiser_name 
        FROM events e
        JOIN users u ON e.organiser_id = u.id
        WHERE e.is_archived = 0
        ORDER BY e.event_start_date
    """)
    events = cur.fetchall()
    conn.close()
    return jsonify([dict(event) for event in events]), 200

@app.route('/api/events/upcoming', methods=['GET'])
def get_upcoming_events():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT e.*, u.username as organiser_name 
        FROM events e
        JOIN users u ON e.organiser_id = u.id
        WHERE e.status = 'upcoming' AND e.is_archived = 0
        ORDER BY e.event_start_date
    """)
    events = cur.fetchall()
    conn.close()
    return jsonify([dict(event) for event in events]), 200

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT e.*, u.username as organiser_name 
        FROM events e
        JOIN users u ON e.organiser_id = u.id
        WHERE e.id = ?
    """, (event_id,))
    event = cur.fetchone()
    
    if not event:
        conn.close()
        return jsonify({'error': 'Event not found'}), 404
    
    # Get speakers
    cur.execute("SELECT * FROM speakers WHERE event_id=?", (event_id,))
    speakers = cur.fetchall()
    
    # Get committee
    cur.execute("""
        SELECT u.id, u.username, u.email, u.institution, ec.role
        FROM event_committee ec
        JOIN users u ON ec.user_id = u.id
        WHERE ec.event_id=?
    """, (event_id,))
    committee = cur.fetchall()
    
    # Get sessions
    cur.execute("""
        SELECT s.*, u.username as responsable_name
        FROM Session s
        LEFT JOIN users u ON s.responsable = u.id
        WHERE s.id_evenement=?
        ORDER BY s.horaire
    """, (event_id,))
    sessions = cur.fetchall()
    
    conn.close()
    
    return jsonify({
        'event': dict(event),
        'speakers': [dict(s) for s in speakers],
        'committee': [dict(c) for c in committee],
        'sessions': [dict(s) for s in sessions]
    }), 200

@app.route('/api/events', methods=['POST'])
@login_required
@role_required('admin', 'super_admin')
def create_event():
    data = request.get_json()
    
    required = ['event_title', 'event_start_date', 'event_end_date']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO events 
        (event_title, event_description, event_start_date, event_end_date, 
         event_location, event_theme, event_contact, organiser_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data['event_title'],
        data.get('event_description', ''),
        data['event_start_date'],
        data['event_end_date'],
        data.get('event_location', ''),
        data.get('event_theme', ''),
        data.get('event_contact', ''),
        session['user_id']
    ))
    
    event_id = cur.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': event_id, 'message': 'Event created'}), 201

@app.route('/api/events/<int:event_id>', methods=['PUT'])
@login_required
@role_required('admin', 'super_admin')
def update_event(event_id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check ownership
    cur.execute("SELECT organiser_id FROM events WHERE id=?", (event_id,))
    event = cur.fetchone()
    if not event:
        conn.close()
        return jsonify({'error': 'Event not found'}), 404
    
    if event['organiser_id'] != session['user_id'] and session['role'] != 'super_admin':
        conn.close()
        return jsonify({'error': 'Unauthorized'}), 403
    
    updates = []
    params = []
    for field in ['event_title', 'event_description', 'event_start_date', 'event_end_date', 
                  'event_location', 'event_theme', 'event_contact', 'status']:
        if field in data:
            updates.append(f"{field} = ?")
            params.append(data[field])
    
    if updates:
        params.append(event_id)
        cur.execute(f"UPDATE events SET {', '.join(updates)} WHERE id=?", params)
        conn.commit()
    
    conn.close()
    return jsonify({'message': 'Event updated'}), 200

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@login_required
@role_required('admin', 'super_admin')
def delete_event(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT organiser_id FROM events WHERE id=?", (event_id,))
    event = cur.fetchone()
    if not event:
        conn.close()
        return jsonify({'error': 'Event not found'}), 404
    
    if event['organiser_id'] != session['user_id'] and session['role'] != 'super_admin':
        conn.close()
        return jsonify({'error': 'Unauthorized'}), 403
    
    cur.execute("UPDATE events SET is_archived = 1 WHERE id=?", (event_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Event archived'}), 200

# Submissions routes
@app.route('/api/submissions', methods=['GET'])
@login_required
def get_submissions():
    conn = get_db_connection()
    cur = conn.cursor()
    
    if session['role'] in ['admin', 'super_admin']:
        cur.execute("""
            SELECT p.*, u.username, e.event_title 
            FROM Proposition p
            JOIN users u ON p.id_user = u.id
            JOIN events e ON p.id_evenement = e.id
            WHERE p.is_withdrawn = 0
            ORDER BY p.date_soumission DESC
        """)
    else:
        cur.execute("""
            SELECT p.*, e.event_title 
            FROM Proposition p
            JOIN events e ON p.id_evenement = e.id
            WHERE p.id_user = ? AND p.is_withdrawn = 0
            ORDER BY p.date_soumission DESC
        """, (session['user_id'],))
    
    submissions = cur.fetchall()
    conn.close()
    return jsonify([dict(s) for s in submissions]), 200

@app.route('/api/submissions', methods=['POST'])
@login_required
@role_required('author', 'admin')
def create_submission():
    data = request.form
    titre = data.get('titre')
    type_prop = data.get('type')
    keywords = data.get('keywords', '')
    event_id = data.get('event_id')
    authors = data.get('authors', '')
    
    if not all([titre, type_prop, event_id]):
        return jsonify({'error': 'Required fields missing'}), 400
    
    # Handle file upload
    file_path = None
    if 'resume_file' in request.files:
        file = request.files['resume_file']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{session['user_id']}_{event_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
            full_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(full_path)
            file_path = unique_filename
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Proposition 
        (titre, resume, keywords, type, file_path, id_user, id_evenement, authors, statut)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        titre,
        data.get('resume', ''),
        keywords,
        type_prop,
        file_path,
        session['user_id'],
        event_id,
        authors,
        'submitted'
    ))
    
    prop_id = cur.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': prop_id, 'message': 'Submission created'}), 201

@app.route('/api/submissions/<int:submission_id>', methods=['PUT'])
@login_required
def update_submission(submission_id):
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT id_user, statut FROM Proposition WHERE id=?", (submission_id,))
    sub = cur.fetchone()
    if not sub:
        conn.close()
        return jsonify({'error': 'Submission not found'}), 404
    
    if sub['id_user'] != session['user_id'] and session['role'] not in ['admin', 'super_admin']:
        conn.close()
        return jsonify({'error': 'Unauthorized'}), 403
    
    if sub['statut'] == 'accepted':
        conn.close()
        return jsonify({'error': 'Cannot modify accepted submission'}), 400
    
    updates = []
    params = []
    for field in ['titre', 'resume', 'keywords', 'type', 'authors']:
        if field in data:
            updates.append(f"{field} = ?")
            params.append(data[field])
    
    if updates:
        params.append(submission_id)
        cur.execute(f"UPDATE Proposition SET {', '.join(updates)} WHERE id=?", params)
        conn.commit()
    
    conn.close()
    return jsonify({'message': 'Submission updated'}), 200

@app.route('/api/submissions/<int:submission_id>', methods=['DELETE'])
@login_required
def withdraw_submission(submission_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT id_user FROM Proposition WHERE id=?", (submission_id,))
    sub = cur.fetchone()
    if not sub:
        conn.close()
        return jsonify({'error': 'Submission not found'}), 404
    
    if sub['id_user'] != session['user_id'] and session['role'] not in ['admin', 'super_admin']:
        conn.close()
        return jsonify({'error': 'Unauthorized'}), 403
    
    cur.execute("UPDATE Proposition SET is_withdrawn = 1 WHERE id=?", (submission_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Submission withdrawn'}), 200

# Evaluations routes
@app.route('/api/evaluations/assign', methods=['POST'])
@login_required
@role_required('admin', 'super_admin')
def assign_reviewers():
    data = request.get_json()
    prop_id = data.get('proposition_id')
    reviewers = data.get('reviewer_ids', [])
    
    if not prop_id or not reviewers:
        return jsonify({'error': 'Proposition ID and reviewers required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    for reviewer_id in reviewers:
        try:
            cur.execute("""
                INSERT INTO ReviewerAssignment (id_proposition, id_reviewer)
                VALUES (?, ?)
            """, (prop_id, reviewer_id))
        except sqlite3.IntegrityError:
            continue
    
    conn.commit()
    conn.close()
    return jsonify({'message': 'Reviewers assigned'}), 200

@app.route('/api/evaluations/my', methods=['GET'])
@login_required
@role_required('committee')
def get_my_reviews():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT p.id, p.titre, p.resume, p.type, p.keywords, p.statut,
               ra.assigned_at, ra.completed
        FROM Proposition p
        JOIN ReviewerAssignment ra ON p.id = ra.id_proposition
        WHERE ra.id_reviewer = ? AND ra.completed = 0
    """, (session['user_id'],))
    reviews = cur.fetchall()
    conn.close()
    return jsonify([dict(r) for r in reviews]), 200

@app.route('/api/evaluations', methods=['POST'])
@login_required
@role_required('committee')
def submit_evaluation():
    data = request.get_json()
    prop_id = data.get('proposition_id')
    
    if not prop_id:
        return jsonify({'error': 'Proposition ID required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if already evaluated
    cur.execute("""
        SELECT 1 FROM Evaluation 
        WHERE id_proposition = ? AND id_evaluateur = ?
    """, (prop_id, session['user_id']))
    if cur.fetchone():
        conn.close()
        return jsonify({'error': 'Already evaluated'}), 400
    
    cur.execute("""
        INSERT INTO Evaluation 
        (id_proposition, id_evaluateur, note_pertinence, note_qualite, 
         note_originalite, note_clarte, commentaires, recommandation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        prop_id,
        session['user_id'],
        data.get('note_pertinence'),
        data.get('note_qualite'),
        data.get('note_originalite'),
        data.get('note_clarte'),
        data.get('commentaires'),
        data.get('recommandation')
    ))
    
    # Mark as completed
    cur.execute("""
        UPDATE ReviewerAssignment 
        SET completed = 1 
        WHERE id_proposition = ? AND id_reviewer = ?
    """, (prop_id, session['user_id']))
    
    conn.commit()
    conn.close()
    return jsonify({'message': 'Evaluation submitted'}), 201

@app.route('/api/evaluations/report/<int:prop_id>', methods=['GET'])
@login_required
def get_evaluation_report(prop_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check permission
    cur.execute("SELECT id_user FROM Proposition WHERE id=?", (prop_id,))
    prop = cur.fetchone()
    if not prop:
        conn.close()
        return jsonify({'error': 'Proposition not found'}), 404
    
    if prop['id_user'] != session['user_id'] and session['role'] not in ['admin', 'super_admin']:
        conn.close()
        return jsonify({'error': 'Unauthorized'}), 403
    
    cur.execute("""
        SELECT u.username, u.institution, e.*
        FROM Evaluation e
        JOIN users u ON e.id_evaluateur = u.id
        WHERE e.id_proposition = ?
    """, (prop_id,))
    evaluations = cur.fetchall()
    conn.close()
    return jsonify([dict(e) for e in evaluations]), 200

# Registrations routes
@app.route('/api/registrations', methods=['POST'])
@login_required
def register_for_event():
    data = request.get_json()
    event_id = data.get('event_id')
    type_inscription = data.get('type_inscription', 'standard')
    
    if not event_id:
        return jsonify({'error': 'Event ID required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            INSERT INTO Inscription (id_evenement, id_user, type_inscription)
            VALUES (?, ?, ?)
        """, (event_id, session['user_id'], type_inscription))
        insc_id = cur.lastrowid
        conn.commit()
        
        # Generate badge code
        badge_code = str(uuid.uuid4())[:8]
        cur.execute("""
            UPDATE Inscription 
            SET badge_code = ? 
            WHERE id = ?
        """, (badge_code, insc_id))
        conn.commit()
        
        conn.close()
        return jsonify({'id': insc_id, 'badge_code': badge_code, 'message': 'Registration successful'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Already registered for this event'}), 400

@app.route('/api/registrations/my-events', methods=['GET'])
@login_required
def get_my_registrations():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT i.*, e.event_title, e.event_start_date, e.event_end_date, e.event_location
        FROM Inscription i
        JOIN events e ON i.id_evenement = e.id
        WHERE i.id_user = ?
        ORDER BY i.date_inscription DESC
    """, (session['user_id'],))
    registrations = cur.fetchall()
    conn.close()
    return jsonify([dict(r) for r in registrations]), 200

@app.route('/api/registrations/event/<int:event_id>', methods=['GET'])
@login_required
@role_required('admin', 'super_admin')
def get_event_registrations(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT i.*, u.username, u.email, u.institution
        FROM Inscription i
        JOIN users u ON i.id_user = u.id
        WHERE i.id_evenement = ?
        ORDER BY i.date_inscription DESC
    """, (event_id,))
    registrations = cur.fetchall()
    conn.close()
    return jsonify([dict(r) for r in registrations]), 200

@app.route('/api/registrations/<int:registration_id>/payment', methods=['PUT'])
@login_required
@role_required('admin', 'super_admin')
def update_payment_status(registration_id):
    data = request.get_json()
    status = data.get('status')
    
    if not status:
        return jsonify({'error': 'Status required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE Inscription 
        SET statut_paiement = ? 
        WHERE id = ?
    """, (status, registration_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Payment status updated'}), 200

@app.route('/api/registrations/<int:registration_id>/badge', methods=['GET'])
@login_required
def get_badge(registration_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT i.*, u.username, u.institution, e.event_title, e.event_start_date, e.event_end_date
        FROM Inscription i
        JOIN users u ON i.id_user = u.id
        JOIN events e ON i.id_evenement = e.id
        WHERE i.id = ? AND i.id_user = ?
    """, (registration_id, session['user_id']))
    
    reg = cur.fetchone()
    conn.close()
    
    if not reg:
        return jsonify({'error': 'Registration not found'}), 404
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(reg['badge_code'])
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png')

# Sessions routes
@app.route('/api/sessions', methods=['POST'])
@login_required
@role_required('admin', 'super_admin')
def create_session():
    data = request.get_json()
    
    required = ['titre', 'horaire', 'id_evenement']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Session (titre, horaire, salle, description, id_evenement, responsable, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data['titre'],
        data['horaire'],
        data.get('salle', ''),
        data.get('description', ''),
        data['id_evenement'],
        data.get('responsable'),
        data.get('type', 'plenary')
    ))
    
    session_id = cur.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'id': session_id, 'message': 'Session created'}), 201

@app.route('/api/sessions/<int:session_id>/assign', methods=['POST'])
@login_required
@role_required('admin', 'super_admin')
def assign_proposition_to_session(session_id):
    data = request.get_json()
    prop_id = data.get('proposition_id')
    order = data.get('order', 0)
    
    if not prop_id:
        return jsonify({'error': 'Proposition ID required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if proposition is accepted
    cur.execute("SELECT statut FROM Proposition WHERE id=?", (prop_id,))
    prop = cur.fetchone()
    if not prop or prop['statut'] != 'accepted':
        conn.close()
        return jsonify({'error': 'Only accepted propositions can be assigned'}), 400
    
    try:
        cur.execute("""
            INSERT INTO SessionProposition (id_session, id_proposition, order_number)
            VALUES (?, ?, ?)
        """, (session_id, prop_id, order))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Proposition assigned to session'}), 200
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Already assigned'}), 400

@app.route('/api/sessions/event/<int:event_id>', methods=['GET'])
@login_required
def get_event_sessions(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT s.*, u.username as responsable_name,
               GROUP_CONCAT(p.titre) as propositions
        FROM Session s
        LEFT JOIN users u ON s.responsable = u.id
        LEFT JOIN SessionProposition sp ON s.id = sp.id_session
        LEFT JOIN Proposition p ON sp.id_proposition = p.id
        WHERE s.id_evenement = ?
        GROUP BY s.id
        ORDER BY s.horaire
    """, (event_id,))
    sessions = cur.fetchall()
    conn.close()
    return jsonify([dict(s) for s in sessions]), 200

# Workshops routes
@app.route('/api/workshops', methods=['POST'])
@login_required
@role_required('admin', 'super_admin')
def create_workshop():
    data = request.get_json()
    
    required = ['titre', 'event_id', 'date']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Workshops 
        (titre, description, responsable_id, event_id, date, max_participants, materials)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data['titre'],
        data.get('description', ''),
        data.get('responsable_id', session['user_id']),
        data['event_id'],
        data['date'],
        data.get('max_participants', 50),
        data.get('materials', '')
    ))
    
    workshop_id = cur.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'id': workshop_id, 'message': 'Workshop created'}), 201

@app.route('/api/workshops/<int:workshop_id>/register', methods=['POST'])
@login_required
def register_for_workshop(workshop_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check capacity
    cur.execute("SELECT max_participants, current_participants FROM Workshops WHERE id=?", (workshop_id,))
    workshop = cur.fetchone()
    if not workshop:
        conn.close()
        return jsonify({'error': 'Workshop not found'}), 404
    
    if workshop['current_participants'] >= workshop['max_participants']:
        conn.close()
        return jsonify({'error': 'Workshop is full'}), 400
    
    try:
        cur.execute("""
            INSERT INTO WorkshopRegistration (workshop_id, user_id)
            VALUES (?, ?)
        """, (workshop_id, session['user_id']))
        
        cur.execute("""
            UPDATE Workshops 
            SET current_participants = current_participants + 1 
            WHERE id = ?
        """, (workshop_id,))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Registered for workshop'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Already registered'}), 400

@app.route('/api/workshops/event/<int:event_id>', methods=['GET'])
@login_required
def get_event_workshops(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT w.*, u.username as responsable_name
        FROM Workshops w
        JOIN users u ON w.responsable_id = u.id
        WHERE w.event_id = ?
        ORDER BY w.date
    """, (event_id,))
    workshops = cur.fetchall()
    conn.close()
    return jsonify([dict(w) for w in workshops]), 200

# Questions routes
@app.route('/api/questions', methods=['POST'])
@login_required
def ask_question():
    data = request.get_json()
    
    if not data.get('session_id') or not data.get('question'):
        return jsonify({'error': 'Session ID and question required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Questions (session_id, user_id, question)
        VALUES (?, ?, ?)
    """, (data['session_id'], session['user_id'], data['question']))
    
    question_id = cur.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'id': question_id, 'message': 'Question submitted'}), 201

@app.route('/api/questions/<int:question_id>/like', methods=['POST'])
@login_required
def like_question(question_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE Questions SET likes = likes + 1 WHERE id=?", (question_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Question liked'}), 200

@app.route('/api/questions/session/<int:session_id>', methods=['GET'])
@login_required
def get_session_questions(session_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT q.*, u.username
        FROM Questions q
        JOIN users u ON q.user_id = u.id
        WHERE q.session_id = ?
        ORDER BY q.likes DESC, q.created_at ASC
    """, (session_id,))
    questions = cur.fetchall()
    conn.close()
    return jsonify([dict(q) for q in questions]), 200

# Surveys routes
@app.route('/api/surveys', methods=['POST'])
@login_required
@role_required('admin', 'super_admin')
def create_survey():
    data = request.get_json()
    
    if not data.get('event_id') or not data.get('title'):
        return jsonify({'error': 'Event ID and title required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Surveys (event_id, title)
        VALUES (?, ?)
    """, (data['event_id'], data['title']))
    
    survey_id = cur.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'id': survey_id, 'message': 'Survey created'}), 201

@app.route('/api/surveys/<int:survey_id>/response', methods=['POST'])
@login_required
def submit_survey_response(survey_id):
    data = request.get_json()
    
    if not data.get('responses'):
        return jsonify({'error': 'Responses required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    for response in data['responses']:
        cur.execute("""
            INSERT INTO SurveyResponses (survey_id, user_id, question, response)
            VALUES (?, ?, ?, ?)
        """, (survey_id, session['user_id'], response['question'], response['answer']))
    
    conn.commit()
    conn.close()
    return jsonify({'message': 'Survey responses submitted'}), 201

# Certificates routes
@app.route('/api/certificates/generate', methods=['POST'])
@login_required
@role_required('admin', 'super_admin')
def generate_certificate():
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')
    cert_type = data.get('type', 'participant')
    
    if not user_id or not event_id:
        return jsonify({'error': 'User ID and Event ID required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Generate unique code
    code = str(uuid.uuid4())[:8].upper()
    
    # Create certificate
    cur.execute("""
        INSERT INTO Certificates (user_id, event_id, type, code)
        VALUES (?, ?, ?, ?)
    """, (user_id, event_id, cert_type, code))
    
    cert_id = cur.lastrowid
    conn.commit()
    
    # Generate PDF
    filename = f"certificate_{cert_id}_{code}.pdf"
    filepath = os.path.join(app.config['CERTIFICATE_FOLDER'], filename)
    
    # Get user and event info
    cur.execute("SELECT username FROM users WHERE id=?", (user_id,))
    user = cur.fetchone()
    cur.execute("SELECT event_title FROM events WHERE id=?", (event_id,))
    event = cur.fetchone()
    
    # Generate PDF with reportlab
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4
    
    # Border
    c.setStrokeColorRGB(0.1, 0.6, 0.7)
    c.setLineWidth(4)
    c.rect(20*mm, 20*mm, width-40*mm, height-40*mm)
    
    # Title
    c.setFillColorRGB(0.1, 0.6, 0.7)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height-60*mm, "CERTIFICATE OF PARTICIPATION")
    
    # Text
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height-80*mm, f"This certifies that")
    
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width/2, height-95*mm, user['username'])
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height-115*mm, f"has participated in the {cert_type} program of")
    
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, height-130*mm, event['event_title'])
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(width/2, 30*mm, f"Certificate Code: {code}")
    
    c.save()
    
    # Update file path
    cur.execute("UPDATE Certificates SET file_path = ? WHERE id = ?", (filename, cert_id))
    conn.commit()
    conn.close()
    
    return jsonify({'code': code, 'file': filename}), 201

@app.route('/api/certificates/user', methods=['GET'])
@login_required
def get_user_certificates():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT c.*, e.event_title
        FROM Certificates c
        JOIN events e ON c.event_id = e.id
        WHERE c.user_id = ?
        ORDER BY c.generated_at DESC
    """, (session['user_id'],))
    certificates = cur.fetchall()
    conn.close()
    return jsonify([dict(c) for c in certificates]), 200

@app.route('/api/certificates/<int:cert_id>/download', methods=['GET'])
@login_required
def download_certificate(cert_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT user_id, file_path FROM Certificates WHERE id=?", (cert_id,))
    cert = cur.fetchone()
    conn.close()
    
    if not cert:
        return jsonify({'error': 'Certificate not found'}), 404
    
    if cert['user_id'] != session['user_id'] and session['role'] not in ['admin', 'super_admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    filepath = os.path.join(app.config['CERTIFICATE_FOLDER'], cert['file_path'])
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    
    return jsonify({'error': 'File not found'}), 404

# Statistics routes
@app.route('/api/statistics/event/<int:event_id>', methods=['GET'])
@login_required
def get_event_statistics(event_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    stats = {}
    
    # Submissions count
    cur.execute("SELECT COUNT(*) as count, statut FROM Proposition WHERE id_evenement=? GROUP BY statut", (event_id,))
    stats['submissions'] = cur.fetchall()
    
    # Registrations count
    cur.execute("SELECT COUNT(*) as count, type_inscription FROM Inscription WHERE id_evenement=? GROUP BY type_inscription", (event_id,))
    stats['registrations'] = cur.fetchall()
    
    # Evaluations
    cur.execute("""
        SELECT COUNT(DISTINCT id_proposition) as evaluated_count
        FROM Evaluation
        WHERE id_proposition IN (SELECT id FROM Proposition WHERE id_evenement=?)
    """, (event_id,))
    stats['evaluations'] = cur.fetchone()
    
    # Participants by institution
    cur.execute("""
        SELECT u.institution, COUNT(*) as count
        FROM Inscription i
        JOIN users u ON i.id_user = u.id
        WHERE i.id_evenement = ?
        GROUP BY u.institution
        ORDER BY count DESC
    """, (event_id,))
    stats['institutions'] = cur.fetchall()
    
    conn.close()
    return jsonify(stats), 200

@app.route('/api/statistics/platform', methods=['GET'])
@login_required
@role_required('super_admin')
def get_platform_statistics():
    conn = get_db_connection()
    cur = conn.cursor()
    
    stats = {}
    
    # Total users
    cur.execute("SELECT COUNT(*) as total FROM users")
    stats['total_users'] = cur.fetchone()['total']
    
    # Users by role
    cur.execute("SELECT role, COUNT(*) as count FROM users GROUP BY role")
    stats['users_by_role'] = cur.fetchall()
    
    # Total events
    cur.execute("SELECT COUNT(*) as total FROM events")
    stats['total_events'] = cur.fetchone()['total']
    
    # Total submissions
    cur.execute("SELECT COUNT(*) as total FROM Proposition")
    stats['total_submissions'] = cur.fetchone()['total']
    
    conn.close()
    return jsonify(stats), 200

# Messages routes
@app.route('/api/messages', methods=['POST'])
@login_required
def send_message():
    data = request.get_json()
    
    if not data.get('receiver_id') or not data.get('content'):
        return jsonify({'error': 'Receiver and content required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Messages (sender_id, receiver_id, subject, content)
        VALUES (?, ?, ?, ?)
    """, (
        session['user_id'],
        data['receiver_id'],
        data.get('subject', ''),
        data['content']
    ))
    
    msg_id = cur.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'id': msg_id, 'message': 'Message sent'}), 201

@app.route('/api/messages/inbox', methods=['GET'])
@login_required
def get_inbox():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT m.*, u.username as sender_name
        FROM Messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.receiver_id = ?
        ORDER BY m.sent_at DESC
    """, (session['user_id'],))
    messages = cur.fetchall()
    conn.close()
    return jsonify([dict(m) for m in messages]), 200

@app.route('/api/messages/<int:message_id>/read', methods=['PUT'])
@login_required
def mark_message_read(message_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE Messages 
        SET read_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND receiver_id = ?
    """, (message_id, session['user_id']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Message marked as read'}), 200

# Notifications routes
@app.route('/api/notifications', methods=['GET'])
@login_required
def get_notifications():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM Notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    """, (session['user_id'],))
    notifications = cur.fetchall()
    conn.close()
    return jsonify([dict(n) for n in notifications]), 200

@app.route('/api/notifications/<int:notif_id>/read', methods=['PUT'])
@login_required
def mark_notification_read(notif_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE Notifications 
        SET read_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND user_id = ?
    """, (notif_id, session['user_id']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Notification marked as read'}), 200

# ============ RUN APP ============
if __name__ == '__main__':
    setup_database()
    app.run(debug=True, host='0.0.0.0', port=5001)
