import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Plus, Edit, Trash2, Video } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function SessionsPage() {
  const [sessions] = useState([
    { id: 1, title: 'Opening Keynote', date: '2026-07-15', time: '09:00', room: 'Grand Amphithéâtre', speaker: 'Prof. Marie Curie', status: 'upcoming' },
    { id: 2, title: 'AI Diagnostics', date: '2026-07-15', time: '11:00', room: 'Salle A', speaker: 'Dr. Alan Turing', status: 'upcoming' },
    { id: 3, title: 'Ethics Panel', date: '2026-07-16', time: '14:00', room: 'Salle B', speaker: 'Dr. Ada Lovelace', status: 'upcoming' },
  ]);

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'bg-green-100 text-green-700',
      ongoing: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-500">Programme des sessions</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Créer une session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-all hover:-translate-y-1 border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg">{session.title}</h3>
                <Badge className={getStatusBadge(session.status)}>
                  {session.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  {new Date(session.date).toLocaleDateString('fr-FR')}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-500" />
                  {session.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  {session.room}
                </p>
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-500" />
                  {session.speaker}
                </p>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 flex-1">
                  <Edit className="w-4 h-4 mr-1" /> Modifier
                </Button>
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 flex-1">
                  <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                </Button>
                <Button variant="outline" size="sm" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
