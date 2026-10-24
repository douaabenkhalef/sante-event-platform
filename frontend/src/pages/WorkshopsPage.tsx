import React, { useState } from 'react';
import { BookOpen, Users, Calendar, MapPin, User, Plus, Edit, Trash2, Users as UsersIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export default function WorkshopsPage() {
  const [workshops] = useState([
    { id: 1, title: 'Introduction au Deep Learning', date: '2026-07-15', time: '14:00', room: 'Salle C', instructor: 'Dr. Alan Turing', maxParticipants: 30, currentParticipants: 25 },
    { id: 2, title: 'Data Visualization', date: '2026-07-16', time: '10:00', room: 'Salle D', instructor: 'Prof. Marie Curie', maxParticipants: 20, currentParticipants: 18 },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workshops</h1>
          <p className="text-gray-500">Ateliers pratiques et formations</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Créer un workshop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="hover:shadow-lg transition-all hover:-translate-y-1 border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg">{workshop.title}</h3>
                <Badge className="bg-teal-100 text-teal-700 border-0">
                  {workshop.currentParticipants}/{workshop.maxParticipants}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  {new Date(workshop.date).toLocaleDateString('fr-FR')} à {workshop.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  {workshop.room}
                </p>
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-500" />
                  {workshop.instructor}
                </p>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Places disponibles</span>
                  <span className="text-gray-800 font-medium">
                    {workshop.maxParticipants - workshop.currentParticipants}/{workshop.maxParticipants}
                  </span>
                </div>
                <Progress 
                  value={(workshop.currentParticipants / workshop.maxParticipants) * 100} 
                  className="h-2 bg-teal-100" 
                />
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 flex-1">
                  <Edit className="w-4 h-4 mr-1" /> Modifier
                </Button>
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 flex-1">
                  <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                </Button>
                <Button variant="outline" size="sm" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                  <UsersIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
