import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Thermometer,
  Wifi,
  Bug,
  MapPin,
  Sprout,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// Field grid zones (5 cols x 3 rows = 15 zones)
const GRID_COLS = 5;
const GRID_ROWS = 3;
const ZONE_LABELS = ["A", "B", "C"];

interface SensorNode {
  id: string;
  zone: string;
  x: number;
  y: number;
  type: "moisture" | "temperature" | "weather";
  value: string;
  status: "normal" | "warning" | "critical";
}

interface DiseaseZone {
  zone: string;
  disease: string;
  severity: "low" | "moderate" | "high";
  confidence: number;
  area: number;
}

interface FieldMapProps {
  sensorData: {
    humidity: number;
    soilMoisture: number;
    temperature: number;
    waterLevel: number;
  };
  droneDetections: DiseaseZone[];
}

const FieldMap = ({ sensorData, droneDetections }: FieldMapProps) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate sensor positions spread across the field
  const sensorNodes: SensorNode[] = useMemo(() => [
    { id: "S1", zone: "A-1", x: 12, y: 18, type: "moisture", value: `${sensorData.soilMoisture}%`, status: sensorData.soilMoisture < 40 ? "warning" : "normal" },
    { id: "S2", zone: "A-3", x: 52, y: 15, type: "temperature", value: `${sensorData.temperature}°C`, status: sensorData.temperature > 32 ? "critical" : "normal" },
    { id: "S3", zone: "A-5", x: 88, y: 20, type: "moisture", value: `${Math.max(20, sensorData.soilMoisture - 8)}%`, status: "normal" },
    { id: "S4", zone: "B-1", x: 15, y: 50, type: "weather", value: `${sensorData.humidity}%`, status: sensorData.humidity > 80 ? "warning" : "normal" },
    { id: "S5", zone: "B-3", x: 50, y: 52, type: "temperature", value: `${sensorData.temperature + 1}°C`, status: "normal" },
    { id: "S6", zone: "B-5", x: 85, y: 48, type: "moisture", value: `${Math.min(90, sensorData.soilMoisture + 5)}%`, status: "normal" },
    { id: "S7", zone: "C-1", x: 10, y: 82, type: "moisture", value: `${Math.max(25, sensorData.soilMoisture - 12)}%`, status: sensorData.soilMoisture < 45 ? "warning" : "normal" },
    { id: "S8", zone: "C-3", x: 48, y: 85, type: "temperature", value: `${sensorData.temperature - 1}°C`, status: "normal" },
    { id: "S9", zone: "C-5", x: 90, y: 80, type: "weather", value: `${sensorData.humidity - 3}%`, status: "normal" },
  ], [sensorData]);

  // Build zone health map from disease data
  const zoneHealth = useMemo(() => {
    const map: Record<string, { severity: string; disease: string; confidence: number }> = {};
    droneDetections.forEach((d) => {
      map[d.zone] = { severity: d.severity, disease: d.disease, confidence: d.confidence };
    });
    return map;
  }, [droneDetections]);

  const getZoneColor = (zone: string) => {
    const health = zoneHealth[zone];
    if (health) {
      switch (health.severity) {
        case "high": return "rgba(239,68,68,0.35)";
        case "moderate": return "rgba(245,158,11,0.3)";
        case "low": return "rgba(245,158,11,0.15)";
      }
    }
    return "rgba(34,197,94,0.15)";
  };

  const getZoneBorder = (zone: string) => {
    const health = zoneHealth[zone];
    if (health) {
      switch (health.severity) {
        case "high": return "rgba(239,68,68,0.6)";
        case "moderate": return "rgba(245,158,11,0.5)";
        case "low": return "rgba(245,158,11,0.3)";
      }
    }
    return "rgba(34,197,94,0.3)";
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "moisture": return Droplets;
      case "temperature": return Thermometer;
      case "weather": return Wifi;
      default: return MapPin;
    }
  };

  const selectedZoneData = selectedZone ? {
    health: zoneHealth[selectedZone],
    sensors: sensorNodes.filter((s) => s.zone === selectedZone),
  } : null;

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsPanning(true);
      setPanStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && zoom > 1 && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Legend and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
          <span className="font-medium text-muted-foreground">Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(34,197,94,0.3)" }} /> Healthy</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(245,158,11,0.35)" }} /> At Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(239,68,68,0.45)" }} /> Diseased</span>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5} className="h-7 w-7 p-0">
            <ZoomOut size={14} />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3} className="h-7 w-7 p-0">
            <ZoomIn size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="h-7 w-7 p-0 ml-1">
            <Maximize2 size={14} />
          </Button>
          {zoom > 1 && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-2">
              <Move size={10} /> Drag to pan
            </span>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-border bg-secondary/20"
        style={{ cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* SVG Field Map */}
        <svg
          viewBox="0 0 100 100"
          className="w-full transition-transform duration-200"
          style={{
            maxHeight: "420px",
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Background grid pattern */}
          <defs>
            <pattern id="fieldPattern" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="hsl(var(--border))" strokeWidth="0.15" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#fieldPattern)" rx="2" />

          {/* Zone grid */}
          {Array.from({ length: GRID_ROWS }, (_, row) =>
            Array.from({ length: GRID_COLS }, (_, col) => {
              const zone = `${ZONE_LABELS[row]}-${col + 1}`;
              const x = (col / GRID_COLS) * 100 + 1;
              const y = (row / GRID_ROWS) * 100 + 1;
              const w = 100 / GRID_COLS - 2;
              const h = 100 / GRID_ROWS - 2;
              const isHovered = hoveredZone === zone;
              const isSelected = selectedZone === zone;

              return (
                <g key={zone}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="1.5"
                    fill={getZoneColor(zone)}
                    stroke={isSelected ? "hsl(var(--primary))" : isHovered ? "hsl(var(--accent))" : getZoneBorder(zone)}
                    strokeWidth={isSelected ? "0.8" : isHovered ? "0.6" : "0.3"}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredZone(zone)}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedZone(selectedZone === zone ? null : zone);
                    }}
                    style={{ transition: "all 0.2s" }}
                  />
                  {/* Zone label */}
                  <text
                    x={x + w / 2}
                    y={y + 4}
                    textAnchor="middle"
                    className="fill-muted-foreground pointer-events-none select-none"
                    fontSize="2.5"
                    fontWeight="600"
                    opacity={0.6}
                  >
                    {zone}
                  </text>

                  {/* Disease indicator */}
                  {zoneHealth[zone] && (
                    <g>
                      <circle
                        cx={x + w / 2}
                        cy={y + h / 2}
                        r={zoneHealth[zone].severity === "high" ? 4 : 3}
                        fill="none"
                        stroke={zoneHealth[zone].severity === "high" ? "rgba(239,68,68,0.7)" : "rgba(245,158,11,0.6)"}
                        strokeWidth="0.4"
                        strokeDasharray="1.5 1"
                      >
                        <animate attributeName="r" values={zoneHealth[zone].severity === "high" ? "3;5;3" : "2.5;4;2.5"} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text
                        x={x + w / 2}
                        y={y + h / 2 + 1}
                        textAnchor="middle"
                        fontSize="2"
                        className="pointer-events-none select-none"
                        fill={zoneHealth[zone].severity === "high" ? "rgba(239,68,68,0.9)" : "rgba(245,158,11,0.8)"}
                      >
                        ⚠
                      </text>
                    </g>
                  )}

                  {/* Crop rows visualization */}
                  {!zoneHealth[zone] && (
                    <g opacity="0.15">
                      {Array.from({ length: 4 }, (_, i) => (
                        <line
                          key={i}
                          x1={x + 2}
                          y1={y + 8 + i * (h - 12) / 3}
                          x2={x + w - 2}
                          y2={y + 8 + i * (h - 12) / 3}
                          stroke="hsl(var(--primary))"
                          strokeWidth="0.3"
                        />
                      ))}
                    </g>
                  )}
                </g>
              );
            })
          )}

          {/* Sensor nodes */}
          {sensorNodes.map((sensor) => {
            const statusColor = sensor.status === "critical" ? "rgba(239,68,68,1)" :
              sensor.status === "warning" ? "rgba(245,158,11,1)" : "hsl(var(--primary))";
            
            return (
              <g key={sensor.id}>
                {/* Sensor pulse */}
                <circle cx={sensor.x} cy={sensor.y} r="2" fill={statusColor} opacity="0.3">
                  <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
                {/* Sensor dot */}
                <circle
                  cx={sensor.x}
                  cy={sensor.y}
                  r="1.8"
                  fill="hsl(var(--card))"
                  stroke={statusColor}
                  strokeWidth="0.5"
                />
                {/* Sensor icon placeholder */}
                <text
                  x={sensor.x}
                  y={sensor.y + 0.7}
                  textAnchor="middle"
                  fontSize="1.8"
                  fill={statusColor}
                  className="pointer-events-none select-none"
                >
                  {sensor.type === "moisture" ? "💧" : sensor.type === "temperature" ? "🌡" : "📡"}
                </text>
                {/* Value label */}
                <rect
                  x={sensor.x - 4}
                  y={sensor.y - 6}
                  width="8"
                  height="3"
                  rx="0.8"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.2"
                  opacity="0.9"
                />
                <text
                  x={sensor.x}
                  y={sensor.y - 4}
                  textAnchor="middle"
                  fontSize="1.8"
                  fontWeight="600"
                  className="pointer-events-none select-none"
                  fill="hsl(var(--foreground))"
                >
                  {sensor.value}
                </text>
              </g>
            );
          })}

          {/* Irrigation paths */}
          <path
            d="M 5 5 L 95 5 M 5 50 L 95 50 M 5 95 L 95 95"
            stroke="hsl(var(--primary))"
            strokeWidth="0.15"
            strokeDasharray="2 2"
            opacity="0.3"
          />
          {/* Field boundary */}
          <rect x="0.5" y="0.5" width="99" height="99" rx="2" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" />
        </svg>

        {/* Zone detail popup */}
        <AnimatePresence>
          {selectedZone && selectedZoneData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-72 p-3 sm:p-4 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg z-10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span className="font-bold text-sm">Zone {selectedZone}</span>
                  {selectedZoneData.health ? (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${
                      selectedZoneData.health.severity === "high" ? "bg-destructive/20 text-destructive" :
                      selectedZoneData.health.severity === "moderate" ? "bg-amber-500/20 text-amber-500" : "bg-primary/20 text-primary"
                    }`}>
                      {selectedZoneData.health.severity}
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full font-medium bg-primary/20 text-primary">healthy</span>
                  )}
                </div>
                <button onClick={() => setSelectedZone(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>

              {selectedZoneData.health ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bug size={12} className="text-destructive" />
                    <span className="text-xs font-medium">{selectedZoneData.health.disease}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Confidence: {selectedZoneData.health.confidence}%</span>
                  </div>
                  <Progress value={selectedZoneData.health.confidence} className="h-1.5" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sprout size={12} className="text-primary" />
                  <span>No diseases detected. Crop growth normal.</span>
                </div>
              )}

              {selectedZoneData.sensors.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border space-y-1.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Active Sensors</span>
                  {selectedZoneData.sensors.map((s) => {
                    const Icon = getSensorIcon(s.type);
                    return (
                      <div key={s.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Icon size={10} className={s.status === "normal" ? "text-primary" : "text-amber-500"} />
                          <span className="capitalize">{s.type}</span>
                        </div>
                        <span className="font-medium">{s.value}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FieldMap;
