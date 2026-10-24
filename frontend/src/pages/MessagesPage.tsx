import React, { useState } from 'react';
import { MessageSquare, Send, User, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Dr. Alan Turing',
      subject: 'Révision de votre article',
      content: 'Bonjour, j\'ai terminé la révision de votre article. Quelques modifications sont nécessaires.',
      date: '2026-06-16T10:30:00',
      read: false
    },
    {
      id: 2,
      from: 'Prof. Marie Curie',
      subject: 'Conférence AI in Healthcare',
      content: 'Nous vous confirmons votre participation à la conférence.',
      date: '2026-06-15T14:20:00',
      read: true
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });

  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newMsg = {
      id: Date.now(),
      from: 'Vous',
      subject: newMessage.subject,
      content: newMessage.content,
      date: new Date().toISOString(),
      read: true
    };
    setMessages([newMsg, ...messages]);
    setNewMessage({ to: '', subject: '', content: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500">Gérez vos échanges</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-gray-100 max-h-[600px] overflow-y-auto">
          <CardContent className="p-4 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  !msg.read ? 'bg-teal-50 border border-teal-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold">
                      {msg.from.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800 truncate">{msg.from}</p>
                      {!msg.read && <span className="w-2 h-2 bg-teal-500 rounded-full" />}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(msg.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun message</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold text-lg">
                      {selectedMessage.from.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedMessage.from}</h3>
                    <p className="text-sm text-gray-500">{selectedMessage.subject}</p>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">{selectedMessage.content}</p>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    className="border-teal-200 text-teal-600 hover:bg-teal-50"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Retour
                  </Button>
                  <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
                    <Send className="w-4 h-4 mr-2" /> Répondre
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Nouveau message</h3>
                <form onSubmit={handleSend} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">Destinataire</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="to"
                        placeholder="Nom du destinataire"
                        value={newMessage.to}
                        onChange={(e) => setNewMessage({...newMessage, to: e.target.value})}
                        className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="subject"
                        placeholder="Sujet du message"
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                        className="pl-10 py-5 rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      placeholder="Votre message..."
                      rows={6}
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                      className="rounded-xl border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-5"
                  >
                    <Send className="w-4 h-4 mr-2" /> Envoyer
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
