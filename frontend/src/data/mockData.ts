export const mockEvents = [
  {
    id: 1,
    event_title: "International Conference on AI in Healthcare 2026",
    event_description: "Une conférence internationale sur l'intelligence artificielle dans le domaine de la santé.",
    event_start_date: "2026-07-15",
    event_end_date: "2026-07-17",
    event_location: "Paris, France",
    event_theme: "Intelligence Artificielle & Santé",
    status: "upcoming",
    organiser_name: "Dr. Jean Martin",
  },
  {
    id: 2,
    event_title: "Medical Research Symposium 2026",
    event_description: "Symposium annuel sur les dernières avancées en recherche médicale.",
    event_start_date: "2026-08-20",
    event_end_date: "2026-08-22",
    event_location: "London, UK",
    event_theme: "Médecine de Précision",
    status: "upcoming",
    organiser_name: "Dr. Sarah Johnson",
  },
  {
    id: 3,
    event_title: "Digital Health Innovation Summit",
    event_description: "Un sommet dédié aux innovations en santé numérique.",
    event_start_date: "2026-09-10",
    event_end_date: "2026-09-12",
    event_location: "Berlin, Germany",
    event_theme: "Santé Numérique",
    status: "upcoming",
    organiser_name: "Dr. Elena Schmidt",
  },
];

export const mockSubmissions = [
  {
    id: 1,
    titre: "Deep Learning for Early Cancer Detection",
    type: "orale",
    statut: "accepted",
    date_soumission: "2026-06-10",
    authors: "Dr. Marie Curie",
    event_title: "International Conference on AI in Healthcare 2026"
  },
  {
    id: 2,
    titre: "AI-Powered Drug Discovery Platform",
    type: "affichee",
    statut: "under_review",
    date_soumission: "2026-06-12",
    authors: "Dr. Rosalind Franklin",
    event_title: "International Conference on AI in Healthcare 2026"
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "success",
    content: "✅ Votre soumission a été acceptée !",
    created_at: "2026-06-16T10:30:00",
    read_at: null
  },
  {
    id: 2,
    type: "info",
    content: "📩 Nouveau message de Dr. Alan Turing",
    created_at: "2026-06-15T14:20:00",
    read_at: null
  },
];

export const mockMessages = [
  {
    id: 1,
    from: "Dr. Alan Turing",
    subject: "Révision de votre article",
    content: "J'ai terminé la révision de votre article.",
    date: "2026-06-16T10:30:00",
    read: false
  },
];
