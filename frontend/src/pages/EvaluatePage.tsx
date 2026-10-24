import React from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function EvaluatePage() {
  const { id } = useParams();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Évaluer la proposition #{id}</h1>
        <p className="text-gray-500">Formulaire d'évaluation</p>
      </div>
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <p className="text-gray-500">Formulaire d'évaluation à implémenter</p>
      </div>
    </div>
  );
}
