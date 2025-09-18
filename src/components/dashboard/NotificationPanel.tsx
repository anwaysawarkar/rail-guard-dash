import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notification } from '@/types/railway';
import { Bell, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onDismiss 
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-signal-hold" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-signal-divert" />;
      default:
        return <Info className="h-4 w-4 text-signal-allow" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const variants = {
      error: 'bg-signal-hold text-white',
      warning: 'bg-signal-divert text-white',
      info: 'bg-signal-allow text-white'
    };
    return variants[type as keyof typeof variants] || 'bg-muted';
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            System Notifications
            {unreadCount > 0 && (
              <Badge className="bg-signal-hold text-white ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.read 
                    ? 'bg-muted/30 border-border' 
                    : 'bg-white border-primary/20 shadow-control'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${getNotificationBadge(notification.type)}`}>
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDismiss?.(notification.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMarkAsRead?.(notification.id)}
                        className="mt-2 text-xs h-7"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;