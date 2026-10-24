from datetime import datetime
from typing import Optional, List
import sqlite3

class User:
    def __init__(self, id: int, username: str, email: str, password_hash: str, 
                 role: str, institution: Optional[str] = None, 
                 research_domain: Optional[str] = None, 
                 biography: Optional[str] = None,
                 dateofbirth: Optional[str] = None):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.institution = institution
        self.research_domain = research_domain
        self.biography = biography
        self.dateofbirth = dateofbirth

class Event:
    def __init__(self, id: int, event_title: str, event_description: str,
                 event_start_date: str, event_end_date: str, event_location: str,
                 event_theme: str, organiser_id: int, status: str = 'upcoming'):
        self.id = id
        self.event_title = event_title
        self.event_description = event_description
        self.event_start_date = event_start_date
        self.event_end_date = event_end_date
        self.event_location = event_location
        self.event_theme = event_theme
        self.organiser_id = organiser_id
        self.status = status

class Proposition:
    def __init__(self, id: int, titre: str, resume: str, type: str,
                 id_user: int, id_evenement: int, statut: str = 'submitted',
                 keywords: Optional[str] = None, file_path: Optional[str] = None):
        self.id = id
        self.titre = titre
        self.resume = resume
        self.type = type
        self.id_user = id_user
        self.id_evenement = id_evenement
        self.statut = statut
        self.keywords = keywords
        self.file_path = file_path

class Evaluation:
    def __init__(self, id: int, id_proposition: int, id_evaluateur: int,
                 note_pertinence: int, note_qualite: int, note_originalite: int,
                 recommandation: str, commentaires: Optional[str] = None):
        self.id = id
        self.id_proposition = id_proposition
        self.id_evaluateur = id_evaluateur
        self.note_pertinence = note_pertinence
        self.note_qualite = note_qualite
        self.note_originalite = note_originalite
        self.recommandation = recommandation
        self.commentaires = commentaires