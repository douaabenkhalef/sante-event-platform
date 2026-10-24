import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, FileText, Clock, ArrowLeft, Edit, Trash2, UserPlus, Plus, CheckCircle, XCircle } from 'lucide-react';
import { getEvent, deleteEvent, registerForEvent, getEventRegistrations } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrationType, setRegistrationType] = useState('standard');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await getEvent(Number(id));
      setEvent(response.data);
      
      if (user) {
        const regResponse = await getEventRegistrations(Number(id));
        const userReg = regResponse.data.find((r: any) => r.id_user === user.id);
        setIsRegistered(!!userReg);
        setRegistrations(regResponse.data);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await registerForEvent(Number(id), registrationType);
      setIsRegistered(true);
      setShowRegisterModal(false);
      fetchEventDetails();
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteEvent(Number(id));
        navigate('/events');
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'bg-green-100 text-green-700',
      ongoing: 'bg-blue-100 text-blue-700',
      archived: 'bg-gray-100 text-gray-700'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      upcoming: 'À venir',
      ongoing: 'En cours',
      archived: 'Archivé'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Chargement...</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Événement non trouvé</p>
        <Link to="/events" className="text-teal-500 hover:text-teal-600 mt-4 inline-block">
          Retour aux événements
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/events" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{event.event_title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Badge className={getStatusBadge(event.status)}>
              {getStatusLabel(event.status)}
            </Badge>
            <span className="text-sm text-gray-500">Organisé par {event.organiser_name}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {!isRegistered && event.status !== 'archived' && (
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white" onClick={() => setShowRegisterModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" /> S'inscrire
            </Button>
          )}
          {isRegistered && (
            <Badge className="bg-green-100 text-green-700 border-0 py-2 px-4">
              <CheckCircle className="w-4 h-4 mr-2" /> Inscrit
            </Badge>
          )}
        </div>
      </div>

      <Card className="border-gray-100">
        <CardContent className="p-6">
          <p className="text-gray-600 text-lg mb-6">{event.event_description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-teal-500" />
              <div>
                <p className="text-sm text-gray-500">Dates</p>
                <p className="font-medium text-gray-800">
                  {new Date(event.event_start_date).toLocaleDateString('fr-FR')} - {new Date(event.event_end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-teal-500" />
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p className="font-medium text-gray-800">{event.event_location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-teal-500" />
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium text-gray-800">{registrations.length} inscrits</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-500" /> Programme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.sessions && event.sessions.length > 0 ? (
              event.sessions.map((session: any) => (
                <div key={session.id} className="border-l-4 border-teal-400 pl-4 py-2">
                  <h4 className="font-medium text-gray-800">{session.titre}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(session.horaire).toLocaleString('fr-FR')} • Salle {session.salle || 'Non spécifiée'}
                  </p>
                  {session.responsable_name && (
                    <p className="text-sm text-gray-500">Président: {session.responsable_name}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aucune session programmée</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-500" /> Intervenants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.speakers && event.speakers.length > 0 ? (
                event.speakers.map((speaker: any) => (
                  <div key={speaker.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold">
                        {speaker.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-800">{speaker.name}</h4>
                      <p className="text-sm text-gray-500">{speaker.topic}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Aucun intervenant</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-500" /> Comité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.committee && event.committee.length > 0 ? (
                event.committee.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-semibold">
                        {member.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{member.username}</p>
                      <p className="text-xs text-gray-500">{member.institution || 'Membre'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Aucun membre du comité</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
