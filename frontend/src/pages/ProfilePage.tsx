import React, { useState } from 'react';
import { User, Mail, Building, Calendar, Save, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    institution: user?.institution || '',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-gray-100">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-bold">
                  {getInitials(user?.username || '')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-200 hover:border-teal-400 transition-colors">
                <Camera className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-4">{user?.username}</h3>
            <p className="text-sm text-gray-500">{user?.role}</p>
            <p className="text-sm text-gray-500 mt-1">{user?.institution || 'Aucune institution'}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Badge className="bg-teal-100 text-teal-700 border-0">Membre depuis 2024</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Informations personnelles</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'border-teal-500 text-teal-600' : 'border-gray-200'}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 disabled:bg-gray-50"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              {isEditing && (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-5"
                >
                  <Save className="w-4 h-4 mr-2" /> Enregistrer les modifications
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
