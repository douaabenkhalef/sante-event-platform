import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, FileText, Users, ArrowLeft, AlertCircle } from 'lucide-react';
import { createEvent } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_title: '',
    event_description: '',
    event_start_date: '',
    event_end_date: '',
    event_location: '',
    event_theme: '',
    event_contact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createEvent(formData);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/events')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Créer un événement</h1>
          <p className="text-gray-500">Remplissez les informations pour créer votre événement scientifique</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Card className="border-gray-100">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="event_title">Titre de l'événement *</Label>
              <Input
                id="event_title"
                name="event_title"
                value={formData.event_title}
                onChange={handleChange}
                className="py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                placeholder="Ex: Conférence Internationale sur l'IA"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_description">Description</Label>
              <Textarea
                id="event_description"
                name="event_description"
                value={formData.event_description}
                onChange={handleChange}
                rows={4}
                className="rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                placeholder="Décrivez votre événement..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_start_date">Date de début *</Label>
                <Input
                  id="event_start_date"
                  name="event_start_date"
                  type="date"
                  value={formData.event_start_date}
                  onChange={handleChange}
                  className="py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_end_date">Date de fin *</Label>
                <Input
                  id="event_end_date"
                  name="event_end_date"
                  type="date"
                  value={formData.event_end_date}
                  onChange={handleChange}
                  className="py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_location">Lieu</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="event_location"
                  name="event_location"
                  value={formData.event_location}
                  onChange={handleChange}
                  className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  placeholder="Paris, France"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_theme">Thématique</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="event_theme"
                  name="event_theme"
                  value={formData.event_theme}
                  onChange={handleChange}
                  className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  placeholder="Intelligence Artificielle en Santé"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_contact">Contact</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="event_contact"
                  name="event_contact"
                  type="email"
                  value={formData.event_contact}
                  onChange={handleChange}
                  className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  placeholder="contact@evenement.com"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/events')}
                className="flex-1 py-5 rounded-xl border-gray-200"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-5"
              >
                {loading ? 'Création...' : 'Créer l\'événement'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
