import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Award, ChevronRight, Sparkles, BookOpen, MessageSquare, Heart, Star, Menu, X, Shield, TrendingUp } from 'lucide-react';
import { mockEvents } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

// Image locale (URL externe)
const conferenceBanner = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeSection, setActiveSection] = useState('accueil');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const sections = {
    accueil: useRef<HTMLDivElement>(null),
    evenements: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    aPropos: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null)
  };

  useEffect(() => {
    setUpcomingEvents(mockEvents);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const [key, ref] of Object.entries(sections)) {
        if (ref.current) {
          const element = ref.current;
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionKey: string) => {
    const ref = sections[sectionKey as keyof typeof sections];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { key: 'accueil', label: 'Accueil' },
    { key: 'evenements', label: 'Événements' },
    { key: 'services', label: 'Services' },
    { key: 'aPropos', label: 'À propos' },
    { key: 'contact', label: 'Contact' }
  ];

  const features = [
    { icon: Calendar, label: "Gestion d'Événements", desc: "Créez et gérez des événements scientifiques en santé" },
    { icon: FileText, label: "Soumission d'Articles", desc: "Soumettez et suivez vos recherches médicales" },
    { icon: Users, label: "Collaboration", desc: "Connectez-vous avec chercheurs et évaluateurs" },
    { icon: Award, label: "Certificats", desc: "Générez des attestations de participation" },
    { icon: BookOpen, label: "Programme", desc: "Consultez le programme détaillé des sessions" },
    { icon: MessageSquare, label: "Communication", desc: "Échangez avec les participants en temps réel" }
  ];

  const stats = [
    { value: "50+", label: "Événements organisés", color: "text-teal-500" },
    { value: "200+", label: "Communications soumises", color: "text-blue-500" },
    { value: "500+", label: "Participants", color: "text-purple-500" },
    { value: "30+", label: "Pays représentés", color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: "linear-gradient(160deg, #d6f3f7 0%, #e8f9fb 40%, #f0fbfc 100%)" }}>
      
      {/* Navbar */}
      <nav className="w-full px-6 md:px-12 py-4 flex items-center justify-between fixed top-0 z-50" style={{ 
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", 
        borderBottom: "1px solid rgba(45,181,196,0.15)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2db5c4, #1a9aaa)" }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <rect x="10" y="4" width="4" height="16" rx="2" fill="white" />
              <rect x="4" y="10" width="16" height="4" rx="2" fill="white" />
              <circle cx="12" cy="12" r="2" fill="white" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="font-bold text-base tracking-wide text-gray-800">MedSConnect</div>
            <div className="text-[10px] tracking-widest text-gray-500 font-medium uppercase -mt-0.5">Santé • Recherche • Innovation</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollToSection(link.key)}
              className={`text-sm font-medium transition-all duration-300 relative ${
                activeSection === link.key 
                  ? 'text-teal-600' 
                  : 'text-gray-600 hover:text-teal-500'
              }`}
            >
              {link.label}
              {activeSection === link.key && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-teal-500 rounded-full hidden md:flex">Se connecter</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full px-6 hidden md:flex">S'inscrire</Button>
          </Link>
          
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-40 bg-white/98 backdrop-blur-sm border-b border-gray-100 shadow-lg md:hidden animate-fade-in">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollToSection(link.key)}
                className={`text-left px-4 py-2.5 rounded-xl transition-all ${
                  activeSection === link.key 
                    ? 'bg-teal-50 text-teal-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl">Se connecter</Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl">S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Accueil */}
      <div ref={sections.accueil} className="pt-20">
        {/* Hero */}
        <section className="w-full px-6 md:px-12 py-8">
          <div className="relative rounded-3xl overflow-hidden w-full" style={{ minHeight: "480px", background: "linear-gradient(135deg, #c8eef3 0%, #d9f4f7 60%, #b8e8ef 100%)" }}>
            <img 
              src={conferenceBanner} 
              alt="Conférence médicale" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/90 to-teal-600/80 md:from-teal-500/70 md:to-teal-600/40" />
            
            <div className="relative z-10 px-8 md:px-16 py-16 md:py-20 max-w-3xl">
              <Badge className="bg-white/90 text-teal-600 border-0 mb-4 px-4 py-1.5 text-sm">
                <Star className="w-3 h-3 mr-1.5" /> Plateforme scientifique en santé
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                Connectez-vous<br />à la Recherche<br />en Santé
              </h1>
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Découvrez, Partagez et Avancez la Recherche Médicale et Scientifique
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="bg-white text-teal-600 hover:bg-gray-100 rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-black/20">
                    Commencer <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="outline" className="border-white/50 text-white hover:bg-white/20 rounded-full px-8 py-6 text-base">
                    Voir les événements <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="w-full px-6 md:px-12 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-teal-100/30">
                <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Section 2: Événements */}
      <div ref={sections.evenements}>
        <section className="w-full px-6 md:px-12 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Événements à venir</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Découvrez les prochains congrès et symposiums en santé</p>
          </div>
          <div className="flex items-center justify-end mb-8">
            <Link to="/events">
              <Button variant="ghost" className="text-teal-500 hover:text-teal-600 hover:bg-teal-50">
                Voir tout <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {upcomingEvents.slice(0, 3).map((event: any) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-teal-100/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-gray-800">{event.event_title}</CardTitle>
                      <Badge className="bg-teal-100 text-teal-700 border-0 text-xs">À venir</Badge>
                    </div>
                    <CardDescription className="text-teal-600">{event.event_theme}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.event_description}</p>
                    <div className="space-y-1.5 text-sm text-gray-500">
                      <p className="flex items-center gap-2">📍 <span>{event.event_location}</span></p>
                      <p className="flex items-center gap-2">📅 <span>{new Date(event.event_start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                    </div>
                    <div className="mt-4 flex items-center text-teal-500 text-sm font-medium">
                      En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Section 3: Services */}
      <div ref={sections.services}>
        <section className="w-full px-6 md:px-12 py-16 bg-white/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nos Services</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Des solutions complètes pour vos événements scientifiques</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {features.map((feat, i) => (
              <Card key={i} className="hover:shadow-lg transition-all hover:-translate-y-1 border-teal-100/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center mx-auto mb-4">
                    <feat.icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feat.label}</h3>
                  <p className="text-sm text-gray-500">{feat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Section 4: À propos */}
      <div ref={sections.aPropos}>
        <section className="w-full px-6 md:px-12 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">À propos de MedSConnect</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Une plateforme dédiée à la recherche en santé</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg text-center mb-10">
              MedSConnect connecte les chercheurs, les professionnels de santé et les institutions pour partager et faire avancer la science.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-teal-500" />
                </div>
                <h4 className="font-semibold text-gray-800">Sécurité</h4>
                <p className="text-sm text-gray-500">Données sécurisées et confidentielles</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="font-semibold text-gray-800">Innovation</h4>
                <p className="text-sm text-gray-500">Technologies de pointe</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <h4 className="font-semibold text-gray-800">Collaboration</h4>
                <p className="text-sm text-gray-500">Réseau de chercheurs</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 5: Contact */}
      <div ref={sections.contact}>
        <section className="w-full px-6 md:px-12 py-16 bg-white/50">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Prêt à commencer ?</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Rejoignez la communauté MedSConnect dès aujourd'hui</p>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-teal-500/25">
                  Créer un compte <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="rounded-full px-8 py-6 text-base border-gray-300 hover:border-teal-400 hover:text-teal-500">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-12 bg-white/80 backdrop-blur-sm border-t border-teal-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2db5c4, #1a9aaa)" }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <rect x="10" y="4" width="4" height="16" rx="2" fill="white" />
                <rect x="4" y="10" width="16" height="4" rx="2" fill="white" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800">MedSConnect</p>
              <p className="text-[10px] text-gray-400 -mt-0.5">Santé • Recherche • Innovation</p>
            </div>
            <Heart className="w-4 h-4 text-teal-400 ml-2" />
          </div>
          <div className="flex gap-6 text-sm">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollToSection(link.key)}
                className="text-gray-500 hover:text-teal-500 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">© 2026 MedSConnect. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
