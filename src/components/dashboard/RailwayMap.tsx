import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, Section } from '@/types/railway';
import { MapPin, Navigation } from 'lucide-react';

interface RailwayMapProps {
  trains: Train[];
  sections: Section[];
  onTrainClick?: (train: Train) => void;
}

const RailwayMap: React.FC<RailwayMapProps> = ({ trains, sections, onTrainClick }) => {
  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Railway Network Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-section-bg rounded-lg p-6 min-h-[400px] overflow-hidden">
          {/* Railway Track Visualization */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
            {/* Main Railway Lines */}
            <defs>
              <pattern id="railTrack" patternUnits="userSpaceOnUse" width="20" height="4">
                <rect width="20" height="2" fill="#6B7280" />
                <rect y="2" width="20" height="2" fill="transparent" />
              </pattern>
            </defs>
            
            {/* Horizontal Main Line */}
            <line x1="50" y1="200" x2="750" y2="200" stroke="url(#railTrack)" strokeWidth="8" />
            
            {/* Section Dividers */}
            {sections.map((section, index) => (
              <g key={section.id}>
                <line 
                  x1={50 + (index * 175)} 
                  y1="150" 
                  x2={50 + (index * 175)} 
                  y2="250" 
                  stroke="#94A3B8" 
                  strokeWidth="2" 
                  strokeDasharray="5,5"
                />
                <text 
                  x={50 + (index * 175) + 87} 
                  y="140" 
                  textAnchor="middle" 
                  className="fill-muted-foreground text-sm font-medium"
                >
                  {section.name}
                </text>
              </g>
            ))}

            {/* Station Markers */}
            {[100, 275, 450, 625].map((x, index) => (
              <g key={index}>
                <circle cx={x} cy="200" r="8" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                <text x={x} y="230" textAnchor="middle" className="fill-foreground text-xs">
                  Station {index + 1}
                </text>
              </g>
            ))}
          </svg>

          {/* Train Positions */}
          {trains.map((train) => {
            const xPos = 50 + (train.position.x * 7); // Scale position to map width
            const yPos = 180 + (train.position.y * 0.4); // Scale position to map height
            
            return (
              <div
                key={train.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                  train.status === 'on-time' ? 'animate-train-move' : ''
                }`}
                style={{ left: `${xPos}px`, top: `${yPos}px` }}
                onClick={() => onTrainClick?.(train)}
              >
                <div className="relative group">
                  {/* Train Icon */}
                  <div 
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125 ${
                      train.signalState === 'allow' ? 'bg-signal-allow animate-pulse-signal' :
                      train.signalState === 'hold' ? 'bg-signal-hold' :
                      'bg-signal-divert'
                    }`}
                  >
                    <div className="absolute inset-1 bg-white rounded-full opacity-60"></div>
                  </div>
                  
                  {/* Train Info Tooltip */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-white rounded-lg shadow-elegant p-3 min-w-[200px] border">
                      <div className="text-sm font-semibold text-foreground">{train.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {train.id}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`text-xs ${
                            train.status === 'on-time' ? 'bg-signal-allow' :
                            train.status === 'delayed' ? 'bg-signal-hold' :
                            'bg-signal-divert'
                          } text-white`}
                        >
                          {train.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{train.speed} km/h</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{train.currentSection}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-elegant p-3 border">
            <div className="text-sm font-semibold mb-2">Signal Status</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-signal-allow"></div>
                <span className="text-xs">Allow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-signal-hold"></div>
                <span className="text-xs">Hold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-signal-divert"></div>
                <span className="text-xs">Divert</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RailwayMap;