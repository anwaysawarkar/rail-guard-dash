import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Train, SignalState } from '@/types/railway';
import { Clock, MapPin, Zap, AlertTriangle, Train as TrainIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TrainTableProps {
  trains: Train[];
  onSignalChange?: (trainId: string, signal: SignalState) => void;
  onTrainSelect?: (train: Train) => void;
}

const TrainTable: React.FC<TrainTableProps> = ({ trains, onSignalChange, onTrainSelect }) => {
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    const variants = {
      'on-time': 'bg-signal-allow text-white',
      'delayed': 'bg-signal-hold text-white',
      'diverted': 'bg-signal-divert text-white',
      'held': 'bg-signal-hold text-white'
    };
    return variants[status as keyof typeof variants] || 'bg-muted';
  };


  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrainIcon className="h-5 w-5 text-primary" />
          Active Trains ({trains.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Current Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Speed (km/h)</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Delay (min)</TableHead>
                {user?.role === 'controller' && <TableHead>Signal Control</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trains.map((train) => (
                <TableRow key={train.id} className="hover:bg-section-bg transition-colors">
                  <TableCell className="font-mono font-semibold text-train-active">
                    {train.id}
                  </TableCell>
                  <TableCell className="font-medium">{train.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {train.currentSection}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(train.status)}>
                      {train.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      {train.speed}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {train.expectedArrival}
                    </div>
                  </TableCell>
                  <TableCell>
                    {train.delay > 0 && (
                      <div className="flex items-center gap-1 text-signal-hold">
                        <AlertTriangle className="h-4 w-4" />
                        +{train.delay}
                      </div>
                    )}
                    {train.delay === 0 && (
                      <span className="text-signal-allow">On Time</span>
                    )}
                  </TableCell>
                  {user?.role === 'controller' && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={train.signalState === 'allow' ? 'allow' : 'signal'}
                          onClick={() => onSignalChange?.(train.id, 'allow')}
                        >
                          Allow
                        </Button>
                        <Button
                          size="sm"
                          variant={train.signalState === 'hold' ? 'hold' : 'signal'}
                          onClick={() => onSignalChange?.(train.id, 'hold')}
                        >
                          Hold
                        </Button>
                        <Button
                          size="sm"
                          variant={train.signalState === 'divert' ? 'divert' : 'signal'}
                          onClick={() => onSignalChange?.(train.id, 'divert')}
                        >
                          Divert
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTrainSelect?.(train)}
                      className="hover:bg-primary hover:text-white transition-colors"
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainTable;