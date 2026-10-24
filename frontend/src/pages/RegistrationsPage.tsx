import React, { useState } from 'react';
import { Users, UserPlus, Search, CheckCircle, XCircle, Clock, Download, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const registrations = [
    { id: 1, name: 'John Doe', email: 'john@example.com', institution: 'MIT', type: 'standard', status: 'paid', date: '2026-06-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', institution: 'Stanford', type: 'vip', status: 'pending', date: '2026-06-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', institution: 'Oxford', type: 'standard', status: 'paid', date: '2026-06-13' },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      paid: 'Payé',
      pending: 'En attente',
      cancelled: 'Annulé'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inscriptions</h1>
          <p className="text-gray-500">Gérez les participants inscrits</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" /> Ajouter un participant
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher un participant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 bg-white text-gray-700"
        >
          <option value="all">Tous les statuts</option>
          <option value="paid">Payé</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <div className="space-y-3">
        {registrations.map((reg) => (
          <Card key={reg.id} className="hover:shadow-md transition-shadow border-gray-100">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold">
                      {reg.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-800">{reg.name}</h4>
                    <p className="text-sm text-gray-500">{reg.email}</p>
                    <p className="text-sm text-gray-500">{reg.institution}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="border-teal-200 text-teal-600">
                    {reg.type}
                  </Badge>
                  <Badge className={getStatusBadge(reg.status)}>
                    {getStatusLabel(reg.status)}
                  </Badge>
                  <span className="text-sm text-gray-400">
                    {new Date(reg.date).toLocaleDateString('fr-FR')}
                  </span>
                  <Button variant="outline" size="sm" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
