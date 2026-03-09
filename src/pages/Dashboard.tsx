import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Droplets,
  Thermometer,
  CloudRain,
  Leaf,
  Power,
  Cpu,
  Wifi,
  WifiOff,
  Bot,
  RefreshCw,
  Sun,
  Moon,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

// Simulated sensor data
const generateSensorData = () => ({
  humidity: Math.floor(Math.random() * 30) + 55,
  soilMoisture: Math.floor(Math.random() * 40) + 30,
  temperature: Math.floor(Math.random() * 15) + 22,
  waterLevel: Math.floor(Math.random() * 30) + 60,
  lightIntensity: Math.floor(Math.random() * 500) + 300,
  ph: (Math.random() * 2 + 5.5).toFixed(1),
});

const aiInsights = [
  {
    type: "success",
    title: "Optimal Growth Conditions",
    message: "Current soil moisture and temperature are ideal for wheat cultivation.",
  },
  {
    type: "warning",
    title: "Irrigation Recommended",
    message: "Sector B-3 shows 15% lower moisture. Schedule irrigation in next 2 hours.",
  },
  {
    type: "info",
    title: "Pest Risk Analysis",
    message: "Low aphid risk detected. Current weather conditions unfavorable for pest breeding.",
  },
  {
    type: "success",
    title: "Yield Prediction",
    message: "Based on current metrics, expected yield increase of 12% compared to last season.",
  },
];

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(generateSensorData());
  const [isConnected, setIsConnected] = useState(true);
  const [autoIrrigation, setAutoIrrigation] = useState(true);
  const [autoLighting, setAutoLighting] = useState(false);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [fanStatus, setFanStatus] = useState(true);
  const [irrigationThreshold, setIrrigationThreshold] = useState([40]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        setSensorData(generateSensorData());
        setLastUpdate(new Date());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleRefresh = () => {
    setSensorData(generateSensorData());
    setLastUpdate(new Date());
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const getStatusColor = (value: number, type: string) => {
    if (type === "humidity" || type === "soilMoisture") {
      if (value < 30) return "text-destructive";
      if (value < 50) return "text-yellow-500";
      return "text-primary";
    }
    if (type === "temperature") {
      if (value > 35 || value < 15) return "text-destructive";
      if (value > 30 || value < 20) return "text-yellow-500";
      return "text-primary";
    }
    return "text-primary";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-secondary/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Back to Portfolio</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-bold gradient-text">Smart Farm Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi size={16} className="text-primary" />
              ) : (
                <WifiOff size={16} className="text-destructive" />
              )}
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw size={14} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Device Status */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <Cpu size={14} className="text-primary" />
              <span className="text-xs font-medium">ESP32 Online</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
              <Cpu size={14} className="text-accent" />
              <span className="text-xs font-medium">Raspberry Pi Active</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        {/* Sensor Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Humidity */}
          <Card className="card-gradient border-border hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CloudRain size={16} className="text-primary" />
                Air Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getStatusColor(sensorData.humidity, "humidity")}`}>
                {sensorData.humidity}%
              </div>
              <Progress value={sensorData.humidity} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">Optimal: 60-80%</p>
            </CardContent>
          </Card>

          {/* Soil Moisture */}
          <Card className="card-gradient border-border hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplets size={16} className="text-primary" />
                Soil Moisture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getStatusColor(sensorData.soilMoisture, "soilMoisture")}`}>
                {sensorData.soilMoisture}%
              </div>
              <Progress value={sensorData.soilMoisture} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">Optimal: 40-70%</p>
            </CardContent>
          </Card>

          {/* Temperature */}
          <Card className="card-gradient border-border hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Thermometer size={16} className="text-accent" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getStatusColor(sensorData.temperature, "temperature")}`}>
                {sensorData.temperature}°C
              </div>
              <Progress value={(sensorData.temperature / 45) * 100} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">Optimal: 20-30°C</p>
            </CardContent>
          </Card>

          {/* Water Level */}
          <Card className="card-gradient border-border hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplets size={16} className="text-accent" />
                Water Tank Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{sensorData.waterLevel}%</div>
              <Progress value={sensorData.waterLevel} className="mt-3 h-2" />
              <p className="text-xs text-muted-foreground mt-2">Capacity: 5000L</p>
            </CardContent>
          </Card>
        </section>

        {/* Additional Sensors */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="card-gradient border-border">
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Sun size={20} className="text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Light Intensity</p>
                  <p className="text-xl font-bold">{sensorData.lightIntensity} lux</p>
                </div>
              </div>
              <Activity size={24} className="text-muted-foreground/30" />
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Leaf size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Soil pH Level</p>
                  <p className="text-xl font-bold">{sensorData.ph}</p>
                </div>
              </div>
              <Activity size={24} className="text-muted-foreground/30" />
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Sprout size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Growth Stage</p>
                  <p className="text-xl font-bold">Vegetative</p>
                </div>
              </div>
              <TrendingUp size={24} className="text-primary/50" />
            </CardContent>
          </Card>
        </section>

        {/* Control Panel & AI Analysis */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Automation Controls */}
          <Card className="card-gradient border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Power size={18} className="text-primary" />
                Automation Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Irrigation */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Droplets size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Auto Irrigation</p>
                    <p className="text-xs text-muted-foreground">ESP32 controlled pump system</p>
                  </div>
                </div>
                <Switch checked={autoIrrigation} onCheckedChange={setAutoIrrigation} />
              </div>

              {/* Irrigation Threshold */}
              {autoIrrigation && (
                <div className="px-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Moisture Threshold</span>
                    <span className="font-medium">{irrigationThreshold[0]}%</span>
                  </div>
                  <Slider
                    value={irrigationThreshold}
                    onValueChange={setIrrigationThreshold}
                    max={80}
                    min={20}
                    step={5}
                  />
                </div>
              )}

              {/* Auto Lighting */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    {autoLighting ? (
                      <Sun size={18} className="text-yellow-500" />
                    ) : (
                      <Moon size={18} className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Auto Lighting</p>
                    <p className="text-xs text-muted-foreground">Time-based grow lights</p>
                  </div>
                </div>
                <Switch checked={autoLighting} onCheckedChange={setAutoLighting} />
              </div>

              {/* Manual Controls */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button
                  variant={pumpStatus ? "default" : "outline"}
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setPumpStatus(!pumpStatus)}
                >
                  <Droplets size={20} />
                  <span className="text-xs">
                    Water Pump {pumpStatus ? "ON" : "OFF"}
                  </span>
                </Button>
                <Button
                  variant={fanStatus ? "default" : "outline"}
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setFanStatus(!fanStatus)}
                >
                  <Activity size={20} />
                  <span className="text-xs">
                    Cooling Fan {fanStatus ? "ON" : "OFF"}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Farmer Analysis */}
          <Card className="card-gradient border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot size={18} className="text-accent" />
                  AI Farmer Analysis
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runAIAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot size={14} />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    insight.type === "success"
                      ? "bg-primary/5 border-primary/20"
                      : insight.type === "warning"
                      ? "bg-yellow-500/5 border-yellow-500/20"
                      : "bg-accent/5 border-accent/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {insight.type === "success" ? (
                      <CheckCircle2 size={18} className="text-primary mt-0.5" />
                    ) : insight.type === "warning" ? (
                      <AlertTriangle size={18} className="text-yellow-500 mt-0.5" />
                    ) : (
                      <Bot size={18} className="text-accent mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Powered by TensorFlow ML Model • Last analysis: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="card-gradient border-border">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">LoRaWAN Gateway: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Edge Computing: Running</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Database Sync: Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-muted-foreground">Drone Status: Standby</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
