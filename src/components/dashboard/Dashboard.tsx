import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Train, SignalState, Notification } from '@/types/railway';
import { mockTrains, mockSections, mockNotifications } from '@/data/mockData';
import { LogOut, RefreshCw, Activity, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TrainTable from './TrainTable';
import RailwayMap from './RailwayMap';
import NotificationPanel from './NotificationPanel';
import TrainDetails from './TrainDetails';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          position: {
            ...train.position,
            x: train.signalState === 'allow' && train.status === 'on-time' 
              ? (train.position.x + Math.random() * 2) % 100
              : train.position.x
          },
          speed: train.signalState === 'hold' ? 0 : 
                 train.signalState === 'allow' ? Math.max(60, train.speed + (Math.random() - 0.5) * 10) :
                 Math.max(30, train.speed * 0.8)
        }))
      );
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSignalChange = (trainId: string, signal: SignalState) => {
    if (user?.role !== 'controller') return;

    setTrains(prevTrains =>
      prevTrains.map(train =>
        train.id === trainId
          ? {
              ...train,
              signalState: signal,
              status: signal === 'hold' ? 'held' : 
                     signal === 'divert' ? 'diverted' : 'on-time'
            }
          : train
      )
    );

    // Add notification
    const newNotification: Notification = {
      id: `signal-${Date.now()}`,
      message: `Signal changed to ${signal.toUpperCase()} for train ${trainId}`,
      type: signal === 'hold' ? 'warning' : 'info',
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    toast({
      title: "Signal Updated",
      description: `Train ${trainId} signal set to ${signal}`,
      variant: signal === 'hold' ? 'destructive' : 'default',
    });
  };

  const handleTrainSelect = (train: Train) => {
    setSelectedTrain(train);
    setIsDetailsOpen(true);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getStatusCounts = () => {
    const onTime = trains.filter(t => t.status === 'on-time').length;
    const delayed = trains.filter(t => t.status === 'delayed' || t.status === 'held').length;
    const diverted = trains.filter(t => t.status === 'diverted').length;
    return { onTime, delayed, diverted };
  };

  const { onTime, delayed, diverted } = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Railway Control Center</h1>
              <p className="text-muted-foreground">
                Welcome, {user?.name} • {user?.role === 'government' ? 'Government Official' : 'Section Controller'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Last Updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLastUpdate(new Date())}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Trains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">{trains.length}</span>
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-signal-allow">{onTime}</span>
                <div className="h-5 w-5 rounded-full bg-signal-allow"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delayed/Held</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-signal-hold">{delayed}</span>
                <AlertTriangle className="h-5 w-5 text-signal-hold" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Diverted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-signal-divert">{diverted}</span>
                <div className="h-5 w-5 rounded-full bg-signal-divert"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map and Table */}
          <div className="xl:col-span-2 space-y-6">
            <RailwayMap 
              trains={trains} 
              sections={mockSections}
              onTrainClick={handleTrainSelect}
            />
            <TrainTable 
              trains={trains}
              onSignalChange={user?.role === 'controller' ? handleSignalChange : undefined}
              onTrainSelect={handleTrainSelect}
            />
          </div>

          {/* Notifications Sidebar */}
          <div className="space-y-6">
            <NotificationPanel
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismissNotification}
            />
          </div>
        </div>
      </div>

      {/* Train Details Modal */}
      <TrainDetails
        train={selectedTrain}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTrain(null);
        }}
      />
    </div>
  );
};

export default Dashboard;