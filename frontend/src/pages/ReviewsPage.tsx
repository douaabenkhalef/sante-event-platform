import React from 'react';
import { Award, FileText, Clock } from 'lucide-react';

export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Évaluations</h1>
        <p className="text-gray-500">Articles à évaluer</p>
      </div>
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
        <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Aucune évaluation en attente</p>
      </div>
    </div>
  );
}
