import { Train, Section, Notification } from '@/types/railway';

export const mockTrains: Train[] = [
  {
    id: 'T001',
    name: 'Express Delhi-Mumbai',
    currentSection: 'Section A',
    nextSection: 'Section B',
    status: 'on-time',
    speed: 85,
    expectedArrival: '14:30',
    delay: 0,
    signalState: 'allow',
    position: { x: 10, y: 20 }
  },
  {
    id: 'T002',
    name: 'Rajdhani Express',
    currentSection: 'Section B',
    nextSection: 'Section C',
    status: 'delayed',
    speed: 0,
    expectedArrival: '15:45',
    delay: 15,
    signalState: 'hold',
    position: { x: 30, y: 45 }
  },
  {
    id: 'T003',
    name: 'Shatabdi Express',
    currentSection: 'Section C',
    nextSection: 'Section D',
    status: 'on-time',
    speed: 95,
    expectedArrival: '16:20',
    delay: 0,
    signalState: 'allow',
    position: { x: 60, y: 35 }
  },
  {
    id: 'T004',
    name: 'Freight Express',
    currentSection: 'Section D',
    nextSection: 'Section A',
    status: 'diverted',
    speed: 45,
    expectedArrival: '17:15',
    delay: 5,
    signalState: 'divert',
    position: { x: 80, y: 60 }
  },
  {
    id: 'T005',
    name: 'Local Passenger',
    currentSection: 'Section A',
    nextSection: 'Section B',
    status: 'on-time',
    speed: 65,
    expectedArrival: '18:00',
    delay: 0,
    signalState: 'allow',
    position: { x: 15, y: 75 }
  }
];

export const mockSections: Section[] = [
  {
    id: 'SEC-A',
    name: 'Section A',
    controller: 'Controller North',
    trains: ['T001', 'T005'],
    coordinates: { x: 0, y: 0, width: 200, height: 100 }
  },
  {
    id: 'SEC-B',
    name: 'Section B',
    controller: 'Controller East',
    trains: ['T002'],
    coordinates: { x: 200, y: 0, width: 200, height: 100 }
  },
  {
    id: 'SEC-C',
    name: 'Section C',
    controller: 'Controller South',
    trains: ['T003'],
    coordinates: { x: 400, y: 0, width: 200, height: 100 }
  },
  {
    id: 'SEC-D',
    name: 'Section D',
    controller: 'Controller West',
    trains: ['T004'],
    coordinates: { x: 600, y: 0, width: 200, height: 100 }
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'N001',
    message: 'Train T002 has entered Section B and requires signal clearance',
    type: 'warning',
    timestamp: new Date(Date.now() - 300000),
    read: false
  },
  {
    id: 'N002',
    message: 'Train T001 is running on schedule in Section A',
    type: 'info',
    timestamp: new Date(Date.now() - 600000),
    read: true
  },
  {
    id: 'N003',
    message: 'Emergency signal activated for Train T004 in Section D',
    type: 'error',
    timestamp: new Date(Date.now() - 900000),
    read: false
  }
];