import React, { useState } from 'react';
import { TrendingUp, Users, FileText, Calendar, Award, BarChart3, PieChart, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function StatisticsPage() {
  const [period, setPeriod] = useState('month');

  const stats = {
    totalUsers: 45,
    totalEvents: 12,
    totalSubmissions: 28,
    totalCertificates: 15,
    submissionsByStatus: [
      { status: 'Accepté', count: 12, color: 'bg-green-500' },
      { status: 'En révision', count: 8, color: 'bg-yellow-500' },
      { status: 'Refusé', count: 5, color: 'bg-red-500' },
      { status: 'Soumis', count: 3, color: 'bg-blue-500' },
    ],
    topInstitutions: [
      { name: 'Université de Paris', count: 8 },
      { name: 'INSERM', count: 6 },
      { name: 'CNRS', count: 5 },
      { name: 'MIT', count: 4 },
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500">Analyse et rapports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 bg-white text-gray-700"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50">
            <Download className="w-4 h-4 mr-2" /> Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-teal-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-xl">
                <Users className="w-6 h-6 text-teal-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Événements</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Soumissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Certificats</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Award className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-teal-500" /> Statut des soumissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.submissionsByStatus.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.status}</span>
                  <span className="text-gray-800 font-medium">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.count / stats.totalSubmissions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-500" /> Top institutions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topInstitutions.map((inst) => (
              <div key={inst.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-gray-700">{inst.name}</span>
                <Badge className="bg-teal-100 text-teal-700 border-0">
                  {inst.count} participants
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
