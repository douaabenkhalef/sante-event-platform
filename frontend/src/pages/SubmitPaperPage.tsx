import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function SubmitPaperPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Soumettre une proposition</h1>
        <p className="text-gray-500">Partagez vos recherches</p>
      </div>
      <Card className="border-gray-100">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Formulaire de soumission à implémenter</p>
            <Button 
              onClick={() => navigate('/my-submissions')}
              className="mt-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" /> Simuler la soumission
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
