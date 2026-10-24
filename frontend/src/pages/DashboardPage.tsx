import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, FileText, Users, Award, CheckCircle, Clock, TrendingUp, 
  Plus, BookOpen, MessageSquare, Bell, Activity, BarChart3, 
  UserPlus, FileCheck, ArrowUpRight, Sparkles, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockEvents, mockSubmissions, mockNotifications } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    events: 0,
    submissions: 0,
    registrations: 0,
    reviews: 0
  });

  useEffect(() => {
    setStats({
      events: mockEvents.length,
      submissions: mockSubmissions.length,
      registrations: 12,
      reviews: 5
    });
  }, []);

  const getRoleContent = () => {
    switch(user?.role) {
      case 'super_admin':
        return {
          title: 'Super Administrateur',
          description: 'Vision globale de la plateforme',
          gradient: 'from-purple-500 to-pink-500'
        };
      case 'admin':
        return {
          title: 'Organisateur d\'Événements',
          description: 'Gérez vos événements et participants',
          gradient: 'from-teal-500 to-cyan-500'
        };
      case 'author':
        return {
          title: 'Auteur / Chercheur',
          description: 'Soumettez et suivez vos articles',
          gradient: 'from-emerald-500 to-teal-500'
        };
      case 'committee':
        return {
          title: 'Membre du Comité',
          description: 'Évaluez les soumissions scientifiques',
          gradient: 'from-orange-500 to-red-500'
        };
      default:
        return {
          title: 'Participant',
          description: 'Participez aux événements scientifiques',
          gradient: 'from-cyan-500 to-blue-500'
        };
    }
  };

  const roleInfo = getRoleContent();
  const recentSubmissions = mockSubmissions.slice(0, 3);
  const upcomingEvents = mockEvents.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue, {user?.username || 'Utilisateur'} !</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/events/create">
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Créer un événement
            </Button>
          </Link>
        )}
      </div>

      {/* Carte de rôle */}
      <div className={`bg-gradient-to-r ${roleInfo.gradient} rounded-2xl p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{roleInfo.title}</h3>
            <p className="text-white/90">{roleInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow border-teal-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Événements</p>
                <p className="text-3xl font-bold text-gray-900">{stats.events}</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-xl">
                <Calendar className="w-6 h-6 text-teal-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Soumissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.submissions}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="text-3xl font-bold text-gray-900">{stats.registrations}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Users className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Évaluations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.reviews}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <Link to="/submissions/new">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-teal-100/50">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Soumettre</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/events">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-blue-100/50">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Événements</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/my-submissions">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-purple-100/50">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Mes articles</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/messages">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-green-100/50">
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Messages</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/profile">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-orange-100/50">
              <CardContent className="p-4 text-center">
                <UserPlus className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Profil</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Soumissions récentes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Soumissions récentes</h3>
            <Link to="/my-submissions" className="text-sm text-teal-500 hover:text-teal-600">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-md transition-shadow border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{submission.titre}</h4>
                      <p className="text-sm text-gray-500 mt-1">{submission.event_title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-teal-200 text-teal-600">
                          {submission.type}
                        </Badge>
                        <Badge className={`text-xs ${
                          submission.statut === 'accepted' ? 'bg-green-100 text-green-700' :
                          submission.statut === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {submission.statut === 'accepted' ? '✅ Accepté' :
                           submission.statut === 'under_review' ? '⏳ En révision' :
                           '📝 Soumis'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(submission.date_soumission).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Événements à venir & Notifications */}
        <div className="space-y-4">
          {/* Événements à venir */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Événements à venir</h3>
              <Link to="/events" className="text-sm text-teal-500 hover:text-teal-600">Voir tout</Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-100">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-800 text-sm">{event.event_title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {new Date(event.event_start_date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-400">📍 {event.event_location}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <Link to="/notifications" className="text-sm text-teal-500 hover:text-teal-600">Voir tout</Link>
            </div>
            <div className="space-y-2">
              {mockNotifications.slice(0, 2).map((notif) => (
                <div key={notif.id} className={`p-3 rounded-xl border ${
                  notif.read_at ? 'bg-white border-gray-100' : 'bg-teal-50 border-teal-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${
                      notif.type === 'success' ? 'bg-green-100' :
                      notif.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <Bell className={`w-3 h-3 ${
                        notif.type === 'success' ? 'text-green-600' :
                        notif.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{notif.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progression */}
      <Card className="border-teal-100/50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Progression du projet</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Soumissions acceptées</span>
                <span className="text-gray-800 font-medium">2/5</span>
              </div>
              <Progress value={40} className="h-2 bg-teal-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Évaluations complétées</span>
                <span className="text-gray-800 font-medium">3/5</span>
              </div>
              <Progress value={60} className="h-2 bg-teal-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Inscriptions</span>
                <span className="text-gray-800 font-medium">12/50</span>
              </div>
              <Progress value={24} className="h-2 bg-teal-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
