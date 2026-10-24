import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Search, Plus, ChevronRight } from 'lucide-react';
import { getEvents } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(response => {
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter((e: any) =>
        e.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.event_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.event_theme?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter === 'upcoming') {
      filtered = filtered.filter((e: any) => e.status === 'upcoming');
    } else if (filter === 'ongoing') {
      filtered = filtered.filter((e: any) => e.status === 'ongoing');
    } else if (filter === 'archived') {
      filtered = filtered.filter((e: any) => e.status === 'archived');
    }
    
    setFilteredEvents(filtered);
  }, [searchTerm, filter, events]);

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

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Événements scientifiques</h1>
          <p className="text-gray-500">Découvrez et participez aux événements</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/events/create">
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Créer un événement
            </Button>
          </Link>
        )}
      </div>

      {/* Search et Filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher un événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-teal-500 text-white hover:bg-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-400'}
          >
            Tous
          </Button>
          <Button
            onClick={() => setFilter('upcoming')}
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            className={filter === 'upcoming' ? 'bg-teal-500 text-white hover:bg-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-400'}
          >
            À venir
          </Button>
          <Button
            onClick={() => setFilter('ongoing')}
            variant={filter === 'ongoing' ? 'default' : 'outline'}
            className={filter === 'ongoing' ? 'bg-teal-500 text-white hover:bg-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-400'}
          >
            En cours
          </Button>
          <Button
            onClick={() => setFilter('archived')}
            variant={filter === 'archived' ? 'default' : 'outline'}
            className={filter === 'archived' ? 'bg-teal-500 text-white hover:bg-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-400'}
          >
            Archivé
          </Button>
        </div>
      </div>

      {/* Liste des événements */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement des événements...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun événement trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any) => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-gray-100">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-800 text-lg">{event.event_title}</h3>
                    <Badge className={`${getStatusBadge(event.status)} border-0 text-xs`}>
                      {getStatusLabel(event.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{event.event_description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-teal-500" />
                      {event.event_location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-teal-500" />
                      {new Date(event.event_start_date).toLocaleDateString('fr-FR')} - {new Date(event.event_end_date).toLocaleDateString('fr-FR')}
                    </p>
                    {event.event_theme && (
                      <p className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-teal-200 text-teal-600">
                          {event.event_theme}
                        </Badge>
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-teal-500 text-sm font-medium">
                      En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
