export type UserRole = 'government' | 'controller';

export type TrainStatus = 'on-time' | 'delayed' | 'diverted' | 'held';

export type SignalState = 'allow' | 'hold' | 'divert';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Train {
  id: string;
  name: string;
  currentSection: string;
  nextSection: string;
  status: TrainStatus;
  speed: number;
  expectedArrival: string;
  delay: number;
  signalState: SignalState;
  position: {
    x: number;
    y: number;
  };
}

export interface Section {
  id: string;
  name: string;
  controller: string;
  trains: string[];
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}