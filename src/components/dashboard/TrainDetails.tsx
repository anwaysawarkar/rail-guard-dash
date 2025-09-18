import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Train } from '@/types/railway';
import { Clock, MapPin, Zap, Navigation, AlertTriangle, Target } from 'lucide-react';

interface TrainDetailsProps {
  train: Train | null;
  isOpen: boolean;
  onClose: () => void;
}

const TrainDetails: React.FC<TrainDetailsProps> = ({ train, isOpen, onClose }) => {
  if (!train) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-signal-allow text-white';
      case 'delayed': return 'bg-signal-hold text-white';
      case 'diverted': return 'bg-signal-divert text-white';
      case 'held': return 'bg-signal-hold text-white';
      default: return 'bg-muted';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'allow': return 'bg-signal-allow text-white';
      case 'hold': return 'bg-signal-hold text-white';
      case 'divert': return 'bg-signal-divert text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-train-active"></div>
            {train.name}
          </DialogTitle>
          <DialogDescription>
            Train ID: {train.id} • Real-time operational details
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Overview */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Current Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Operational Status</span>
                  <Badge className={getStatusColor(train.status)}>
                    {train.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Signal State</span>
                  <Badge className={getSignalColor(train.signalState)}>
                    {train.signalState}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Speed</span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{train.speed} km/h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Section</span>
                  <span className="font-medium">{train.currentSection}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Section</span>
                  <span className="font-medium">{train.nextSection}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(train.position.x % 25) * 4}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timing Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Schedule Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expected Arrival</span>
                  <span className="font-medium">{train.expectedArrival}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Delay</span>
                  {train.delay > 0 ? (
                    <div className="flex items-center gap-1 text-signal-hold">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">+{train.delay} min</span>
                    </div>
                  ) : (
                    <span className="font-medium text-signal-allow">On Time</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Speed Today</span>
                  <span className="font-medium">{Math.max(45, train.speed - 10)} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Distance Covered</span>
                  <span className="font-medium">{Math.floor(train.position.x * 2.5)} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Efficiency Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          train.status === 'on-time' ? 'bg-signal-allow' : 
                          train.status === 'delayed' ? 'bg-signal-hold' : 'bg-signal-divert'
                        }`}
                        style={{ width: `${train.status === 'on-time' ? 90 : train.status === 'delayed' ? 60 : 75}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {train.status === 'on-time' ? '90%' : train.status === 'delayed' ? '60%' : '75%'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainDetails;