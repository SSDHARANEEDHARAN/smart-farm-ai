import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Generate historical data for charts
const generateHistoricalData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours() + ":00",
      humidity: Math.floor(Math.random() * 25) + 55,
      soilMoisture: Math.floor(Math.random() * 35) + 35,
      temperature: Math.floor(Math.random() * 12) + 20,
      waterLevel: Math.floor(Math.random() * 20) + 70,
    });
  }
  return data;
};

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const gaugeVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(generateSensorData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData());
  const [isConnected] = useState(true);
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
        const newSensorData = generateSensorData();
        setSensorData(newSensorData);
        setLastUpdate(new Date());
        
        // Update historical data with new reading
        setHistoricalData((prev) => {
          const newData = [...prev.slice(1)];
          const now = new Date();
          newData.push({
            time: now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0"),
            humidity: newSensorData.humidity,
            soilMoisture: newSensorData.soilMoisture,
            temperature: newSensorData.temperature,
            waterLevel: newSensorData.waterLevel,
          });
          return newData;
        });
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
      if (value < 50) return "text-amber-500";
      return "text-primary";
    }
    if (type === "temperature") {
      if (value > 35 || value < 15) return "text-destructive";
      if (value > 30 || value < 20) return "text-amber-500";
      return "text-primary";
    }
    return "text-primary";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="border-b border-border bg-secondary/30 backdrop-blur-sm sticky top-0 z-50"
      >
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
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Device Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30"
            >
              <Cpu size={14} className="text-primary" />
              <span className="text-xs font-medium">ESP32 Online</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30"
            >
              <Cpu size={14} className="text-accent" />
              <span className="text-xs font-medium">Raspberry Pi Active</span>
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Sensor Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Humidity */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CloudRain size={16} className="text-primary" />
                  Air Humidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={sensorData.humidity}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-4xl font-bold ${getStatusColor(sensorData.humidity, "humidity")}`}
                >
                  {sensorData.humidity}%
                </motion.div>
                <Progress value={sensorData.humidity} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">Optimal: 60-80%</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soil Moisture */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Droplets size={16} className="text-primary" />
                  Soil Moisture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={sensorData.soilMoisture}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-4xl font-bold ${getStatusColor(sensorData.soilMoisture, "soilMoisture")}`}
                >
                  {sensorData.soilMoisture}%
                </motion.div>
                <Progress value={sensorData.soilMoisture} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">Optimal: 40-70%</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Temperature */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Thermometer size={16} className="text-accent" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={sensorData.temperature}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-4xl font-bold ${getStatusColor(sensorData.temperature, "temperature")}`}
                >
                  {sensorData.temperature}°C
                </motion.div>
                <Progress value={(sensorData.temperature / 45) * 100} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">Optimal: 20-30°C</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Water Level */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Droplets size={16} className="text-accent" />
                  Water Tank Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={sensorData.waterLevel}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl font-bold text-primary"
                >
                  {sensorData.waterLevel}%
                </motion.div>
                <Progress value={sensorData.waterLevel} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">Capacity: 5000L</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Real-time Charts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Temperature & Humidity Chart */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity size={16} className="text-primary" />
                  Temperature & Humidity (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={false}
                      name="Temperature (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soil Moisture Chart */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Droplets size={16} className="text-primary" />
                  Soil Moisture Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <defs>
                      <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="soilMoisture"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#soilGradient)"
                      name="Soil Moisture (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Additional Sensors */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-gradient border-border">
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Sun size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Light Intensity</p>
                    <motion.p
                      key={sensorData.lightIntensity}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-bold"
                    >
                      {sensorData.lightIntensity} lux
                    </motion.p>
                  </div>
                </div>
                <Activity size={24} className="text-muted-foreground/30" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-gradient border-border">
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Leaf size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Soil pH Level</p>
                    <motion.p
                      key={sensorData.ph}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-bold"
                    >
                      {sensorData.ph}
                    </motion.p>
                  </div>
                </div>
                <Activity size={24} className="text-muted-foreground/30" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }}>
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
          </motion.div>
        </motion.section>

        {/* Control Panel & AI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Automation Controls */}
          <motion.div whileHover={{ scale: 1.005 }}>
            <Card className="card-gradient border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Power size={18} className="text-primary" />
                  Automation Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Irrigation */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                >
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
                </motion.div>

                {/* Irrigation Threshold */}
                {autoIrrigation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 space-y-3"
                  >
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
                  </motion.div>
                )}

                {/* Auto Lighting */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      {autoLighting ? (
                        <Sun size={18} className="text-amber-500" />
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
                </motion.div>

                {/* Manual Controls */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={pumpStatus ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-2 w-full"
                      onClick={() => setPumpStatus(!pumpStatus)}
                    >
                      <Droplets size={20} />
                      <span className="text-xs">Water Pump {pumpStatus ? "ON" : "OFF"}</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={fanStatus ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-2 w-full"
                      onClick={() => setFanStatus(!fanStatus)}
                    >
                      <Activity size={20} />
                      <span className="text-xs">Cooling Fan {fanStatus ? "ON" : "OFF"}</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Farmer Analysis */}
          <motion.div whileHover={{ scale: 1.005 }}>
            <Card className="card-gradient border-border h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot size={18} className="text-accent" />
                    AI Farmer Analysis
                  </CardTitle>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className={`p-4 rounded-xl border ${
                      insight.type === "success"
                        ? "bg-primary/5 border-primary/20"
                        : insight.type === "warning"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-accent/5 border-accent/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {insight.type === "success" ? (
                        <CheckCircle2 size={18} className="text-primary mt-0.5" />
                      ) : insight.type === "warning" ? (
                        <AlertTriangle size={18} className="text-amber-500 mt-0.5" />
                      ) : (
                        <Bot size={18} className="text-accent mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Powered by TensorFlow ML Model • Last analysis: {lastUpdate.toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="card-gradient border-border">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                {[
                  { label: "LoRaWAN Gateway: Active", color: "bg-primary" },
                  { label: "Edge Computing: Running", color: "bg-primary" },
                  { label: "Database Sync: Real-time", color: "bg-primary" },
                  { label: "Drone Status: Standby", color: "bg-accent" },
                ].map((status, index) => (
                  <motion.div
                    key={status.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${status.color} animate-pulse`} />
                    <span className="text-muted-foreground">{status.label}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
