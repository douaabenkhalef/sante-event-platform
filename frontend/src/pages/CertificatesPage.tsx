import React, { useState } from 'react';
import { Award, Download, Plus, Search, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const certificates = [
    { id: 1, name: 'John Doe', event: 'AI in Healthcare 2026', type: 'participant', date: '2026-07-17', status: 'generated' },
    { id: 2, name: 'Jane Smith', event: 'AI in Healthcare 2026', type: 'speaker', date: '2026-07-17', status: 'generated' },
    { id: 3, name: 'Bob Johnson', event: 'Medical Research Symposium', type: 'participant', date: '2026-08-22', status: 'pending' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificats</h1>
          <p className="text-gray-500">Gestion des attestations</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Générer un certificat
        </Button>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Rechercher un certificat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
        />
      </div>

      <div className="space-y-3">
        {certificates.map((cert) => (
          <Card key={cert.id} className="hover:shadow-md transition-shadow border-gray-100">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-50 rounded-xl">
                    <Award className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                    <p className="text-sm text-gray-500">{cert.event}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-teal-200 text-teal-600 text-xs">
                        {cert.type}
                      </Badge>
                      <Badge className={cert.status === 'generated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {cert.status === 'generated' ? 'Généré' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {new Date(cert.date).toLocaleDateString('fr-FR')}
                  </span>
                  {cert.status === 'generated' ? (
                    <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                      <Download className="w-4 h-4 mr-2" /> Télécharger
                    </Button>
                  ) : (
                    <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" /> Générer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
