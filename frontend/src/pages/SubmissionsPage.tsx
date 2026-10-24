import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Eye, CheckCircle, XCircle, Clock, UserPlus, Plus } from 'lucide-react';
import { getSubmissions } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissions()
      .then(response => {
        setSubmissions(response.data);
        setFilteredSubmissions(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = submissions;
    
    if (searchTerm) {
      filtered = filtered.filter((s: any) =>
        s.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.resume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.authors?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter !== 'all') {
      filtered = filtered.filter((s: any) => s.statut === filter);
    }
    
    setFilteredSubmissions(filtered);
  }, [searchTerm, filter, submissions]);

  const getStatusBadge = (status: string) => {
    const badges = {
      submitted: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      revised: 'bg-purple-100 text-purple-700'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      submitted: 'Soumis',
      under_review: 'En évaluation',
      accepted: 'Accepté',
      rejected: 'Refusé',
      revised: 'En révision'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Soumissions</h1>
          <p className="text-gray-500">Gestion des propositions scientifiques</p>
        </div>
        <Link to="/submissions/new">
          <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Nouvelle soumission
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher une soumission..."
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
          <option value="submitted">Soumis</option>
          <option value="under_review">En évaluation</option>
          <option value="accepted">Accepté</option>
          <option value="rejected">Refusé</option>
          <option value="revised">En révision</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune soumission trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((submission: any) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow border-gray-100">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{submission.titre}</h4>
                    <p className="text-sm text-gray-500 mt-1">{submission.event_title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs border-teal-200 text-teal-600">
                        {submission.type}
                      </Badge>
                      <Badge className={`text-xs ${getStatusBadge(submission.statut)}`}>
                        {getStatusLabel(submission.statut)}
                      </Badge>
                      {submission.authors && (
                        <span className="text-xs text-gray-400">Auteurs: {submission.authors}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-400">
                      {new Date(submission.date_soumission).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
