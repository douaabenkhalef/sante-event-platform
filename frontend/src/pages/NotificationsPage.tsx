import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X, Check } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Soumission acceptée',
      content: 'Votre article "Deep Learning for Early Cancer Detection" a été accepté !',
      date: '2026-06-16T10:30:00',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Inscription confirmée',
      content: 'Inscription confirmée pour "International Conference on AI in Healthcare 2026"',
      date: '2026-06-15T14:20:00',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Rappel',
      content: 'La date limite de soumission est dans 3 jours.',
      date: '2026-06-14T09:00:00',
      read: true
    },
  ]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Restez informé de vos activités</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge className="bg-teal-500 text-white border-0">
              {unreadCount} non lues
            </Badge>
          )}
          <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50">
            <Check className="w-4 h-4 mr-2" /> Tout marquer comme lu
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card key={notif.id} className={`border ${getBgColor(notif.type)} ${!notif.read ? 'border-l-4 border-l-teal-500' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{notif.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notif.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notif.date).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notif.id)}
                            className="text-teal-500 hover:bg-teal-50"
                          >
                            Marquer lu
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notif.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
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
