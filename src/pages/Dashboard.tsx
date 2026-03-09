import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Wheat,
  Bug,
  Zap,
  BarChart3,
  Calendar,
  Target,
  ShieldCheck,
  Lightbulb,
  Timer,
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
  BarChart,
  Bar,
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
  nitrogen: Math.floor(Math.random() * 30) + 60,
  phosphorus: Math.floor(Math.random() * 20) + 40,
  potassium: Math.floor(Math.random() * 25) + 50,
});

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

// AI Analysis helper functions
const generateAIInsights = (sensorData: ReturnType<typeof generateSensorData>) => {
  const insights = [];
  
  // Soil Moisture Analysis
  if (sensorData.soilMoisture < 40) {
    insights.push({
      type: "warning",
      category: "Irrigation",
      title: "Low Soil Moisture Detected",
      message: `Current moisture at ${sensorData.soilMoisture}%. Recommend immediate irrigation to prevent crop stress.`,
      action: "Schedule irrigation within 2 hours",
      icon: Droplets,
    });
  } else if (sensorData.soilMoisture > 70) {
    insights.push({
      type: "warning",
      category: "Drainage",
      title: "High Soil Moisture",
      message: `Moisture level at ${sensorData.soilMoisture}%. Risk of root rot. Check drainage systems.`,
      action: "Pause irrigation, monitor drainage",
      icon: Droplets,
    });
  } else {
    insights.push({
      type: "success",
      category: "Irrigation",
      title: "Optimal Soil Moisture",
      message: `Moisture at ${sensorData.soilMoisture}% - perfect for current growth stage.`,
      action: "Maintain current irrigation schedule",
      icon: CheckCircle2,
    });
  }

  // Temperature Analysis
  if (sensorData.temperature > 32) {
    insights.push({
      type: "warning",
      category: "Climate",
      title: "High Temperature Alert",
      message: `Temperature at ${sensorData.temperature}°C exceeds optimal range. Crops may experience heat stress.`,
      action: "Activate cooling, increase irrigation frequency",
      icon: Thermometer,
    });
  } else if (sensorData.temperature < 18) {
    insights.push({
      type: "info",
      category: "Climate",
      title: "Low Temperature Warning",
      message: `Temperature at ${sensorData.temperature}°C. Growth may slow. Consider protective measures.`,
      action: "Monitor frost risk, prepare covers",
      icon: Thermometer,
    });
  } else {
    insights.push({
      type: "success",
      category: "Climate",
      title: "Ideal Temperature Conditions",
      message: `Temperature at ${sensorData.temperature}°C is optimal for crop development.`,
      action: "No intervention needed",
      icon: CheckCircle2,
    });
  }

  // Pest Risk Analysis based on conditions
  const pestRisk = sensorData.humidity > 75 && sensorData.temperature > 25;
  insights.push({
    type: pestRisk ? "warning" : "success",
    category: "Pest Management",
    title: pestRisk ? "Elevated Pest Risk" : "Low Pest Risk",
    message: pestRisk 
      ? "High humidity and temperature create favorable conditions for fungal diseases and pests."
      : "Current conditions are unfavorable for most agricultural pests.",
    action: pestRisk ? "Deploy preventive spraying in next 24h" : "Continue regular monitoring",
    icon: Bug,
  });

  // Yield Prediction
  const yieldScore = Math.min(100, Math.round(
    (sensorData.soilMoisture / 70 * 30) +
    (sensorData.nitrogen / 90 * 25) +
    (Math.min(sensorData.temperature, 28) / 28 * 25) +
    (sensorData.ph >= 6 && sensorData.ph <= 7.5 ? 20 : 10)
  ));
  
  insights.push({
    type: yieldScore > 75 ? "success" : yieldScore > 50 ? "info" : "warning",
    category: "Yield Forecast",
    title: `Yield Potential: ${yieldScore}%`,
    message: `Based on current NPK levels, soil conditions, and climate data, estimated yield is ${yieldScore > 75 ? 'above' : yieldScore > 50 ? 'at' : 'below'} average.`,
    action: yieldScore > 75 ? "Maintain current practices" : "Optimize fertilizer application",
    icon: Wheat,
  });

  return insights;
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
  const [selectedAnalyticsTab, setSelectedAnalyticsTab] = useState<"insights" | "forecast" | "health">("insights");

  // Generate AI insights based on current sensor data
  const aiInsights = useMemo(() => generateAIInsights(sensorData), [sensorData]);

  // Crop health score
  const cropHealthScore = useMemo(() => {
    const moistureScore = sensorData.soilMoisture >= 40 && sensorData.soilMoisture <= 70 ? 25 : 15;
    const tempScore = sensorData.temperature >= 20 && sensorData.temperature <= 30 ? 25 : 15;
    const phValue = parseFloat(sensorData.ph);
    const phScore = phValue >= 6 && phValue <= 7.5 ? 25 : 15;
    const npkScore = (sensorData.nitrogen + sensorData.phosphorus + sensorData.potassium) / 3 > 50 ? 25 : 15;
    return moistureScore + tempScore + phScore + npkScore;
  }, [sensorData]);
    return moistureScore + tempScore + phScore + npkScore;
  }, [sensorData]);

  // NPK data for chart
  const npkData = useMemo(() => [
    { name: "N", value: sensorData.nitrogen, fill: "hsl(var(--primary))" },
    { name: "P", value: sensorData.phosphorus, fill: "hsl(var(--accent))" },
    { name: "K", value: sensorData.potassium, fill: "hsl(142 76% 36%)" },
  ], [sensorData]);

  // Weekly forecast data
  const weeklyForecast = useMemo(() => [
    { day: "Mon", irrigation: 85, growth: 78, health: 92 },
    { day: "Tue", irrigation: 72, growth: 82, health: 88 },
    { day: "Wed", irrigation: 90, growth: 85, health: 95 },
    { day: "Thu", irrigation: 65, growth: 80, health: 85 },
    { day: "Fri", irrigation: 78, growth: 88, health: 90 },
    { day: "Sat", irrigation: 82, growth: 92, health: cropHealthScore },
    { day: "Sun", irrigation: 70, growth: 85, health: 88 },
  ], [cropHealthScore]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        const newSensorData = generateSensorData();
        setSensorData(newSensorData);
        setLastUpdate(new Date());
        
        setHistoricalData((prev) => {
          const newData = prev.slice(1);
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
    setTimeout(() => {
      setSensorData(generateSensorData());
      setIsAnalyzing(false);
    }, 2000);
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

        {/* AI Farmer Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-gradient border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Bot size={20} className="text-accent" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      AI Farmer Analytics
                      <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                        TensorFlow Powered
                      </span>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Real-time agricultural intelligence & monitoring
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={runAIAnalysis}
                    disabled={isAnalyzing}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap size={14} />
                        Run Full Analysis
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Analytics Tabs */}
              <div className="flex gap-2 mt-4">
                {[
                  { id: "insights", label: "Smart Insights", icon: Lightbulb },
                  { id: "forecast", label: "Forecast", icon: Calendar },
                  { id: "health", label: "Crop Health", icon: ShieldCheck },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnalyticsTab(tab.id as typeof selectedAnalyticsTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedAnalyticsTab === tab.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {/* Smart Insights Tab */}
                {selectedAnalyticsTab === "insights" && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {aiInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`p-4 rounded-xl border ${
                          insight.type === "success"
                            ? "bg-primary/5 border-primary/20"
                            : insight.type === "warning"
                            ? "bg-amber-500/5 border-amber-500/20"
                            : "bg-accent/5 border-accent/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            insight.type === "success"
                              ? "bg-primary/10"
                              : insight.type === "warning"
                              ? "bg-amber-500/10"
                              : "bg-accent/10"
                          }`}>
                            <insight.icon size={18} className={
                              insight.type === "success"
                                ? "text-primary"
                                : insight.type === "warning"
                                ? "text-amber-500"
                                : "text-accent"
                            } />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                {insight.category}
                              </span>
                            </div>
                            <p className="font-semibold text-sm">{insight.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                              <Target size={12} className="text-muted-foreground" />
                              <span className="text-xs text-primary font-medium">{insight.action}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Forecast Tab */}
                {selectedAnalyticsTab === "forecast" && (
                  <motion.div
                    key="forecast"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp size={16} className="text-primary" />
                          <span className="text-sm font-medium">7-Day Yield Forecast</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">+12%</p>
                        <p className="text-xs text-muted-foreground">Above seasonal average</p>
                      </div>
                      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplets size={16} className="text-accent" />
                          <span className="text-sm font-medium">Water Savings</span>
                        </div>
                        <p className="text-2xl font-bold text-accent">2,450L</p>
                        <p className="text-xs text-muted-foreground">This week via smart irrigation</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Timer size={16} className="text-foreground" />
                          <span className="text-sm font-medium">Next Harvest</span>
                        </div>
                        <p className="text-2xl font-bold">18 Days</p>
                        <p className="text-xs text-muted-foreground">Estimated optimal window</p>
                      </div>
                    </div>

                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Weekly Performance Forecast</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyForecast}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                              dataKey="day"
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                            />
                            <YAxis
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                              domain={[0, 100]}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="irrigation" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Irrigation Efficiency" />
                            <Bar dataKey="growth" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Growth Rate" />
                            <Bar dataKey="health" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} name="Health Score" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Crop Health Tab */}
                {selectedAnalyticsTab === "health" && (
                  <motion.div
                    key="health"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {/* Health Score Gauge */}
                    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-secondary/30 border border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-4">Overall Crop Health Score</p>
                      <div className="relative">
                        <svg className="w-40 h-40 transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="hsl(var(--border))"
                            strokeWidth="12"
                            fill="none"
                          />
                          <motion.circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke={cropHealthScore >= 80 ? "hsl(var(--primary))" : cropHealthScore >= 60 ? "hsl(var(--accent))" : "hsl(var(--destructive))"}
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 440" }}
                            animate={{ strokeDasharray: `${(cropHealthScore / 100) * 440} 440` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.span
                            key={cropHealthScore}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-bold"
                          >
                            {cropHealthScore}%
                          </motion.span>
                        </div>
                      </div>
                      <p className="text-sm mt-4 text-center">
                        {cropHealthScore >= 80 ? (
                          <span className="text-primary flex items-center gap-1">
                            <CheckCircle2 size={14} /> Excellent condition
                          </span>
                        ) : cropHealthScore >= 60 ? (
                          <span className="text-accent flex items-center gap-1">
                            <AlertTriangle size={14} /> Good with minor concerns
                          </span>
                        ) : (
                          <span className="text-destructive flex items-center gap-1">
                            <AlertTriangle size={14} /> Needs attention
                          </span>
                        )}
                      </p>
                    </div>

                    {/* NPK Levels */}
                    <div className="space-y-4">
                      <p className="text-sm font-medium">Soil Nutrient Levels (NPK)</p>
                      <div className="space-y-4">
                        {[
                          { name: "Nitrogen (N)", value: sensorData.nitrogen, color: "bg-primary", optimal: "60-90 mg/kg" },
                          { name: "Phosphorus (P)", value: sensorData.phosphorus, color: "bg-accent", optimal: "40-60 mg/kg" },
                          { name: "Potassium (K)", value: sensorData.potassium, color: "bg-emerald-500", optimal: "50-75 mg/kg" },
                        ].map((nutrient) => (
                          <motion.div
                            key={nutrient.name}
                            whileHover={{ x: 4 }}
                            className="p-3 rounded-lg bg-secondary/30 border border-border"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">{nutrient.name}</span>
                              <span className="text-sm font-bold">{nutrient.value} mg/kg</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${nutrient.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${nutrient.value}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Optimal: {nutrient.optimal}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf size={16} className="text-primary" />
                          <span className="text-sm font-medium">AI Recommendation</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Based on current NPK levels and growth stage, consider applying balanced NPK fertilizer (10-10-10) at 25kg/acre within the next 5 days for optimal yield.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Cpu size={12} /> CNN Disease Detection: 94% accuracy
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 size={12} /> ResNet Transfer Learning
                  </span>
                </div>
                <span>Last analysis: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </CardContent>
          </Card>
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

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.002 }}>
            <Card className="card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Power size={18} className="text-primary" />
                  Automation Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <p className="text-xs text-muted-foreground">ESP32 pump</p>
                      </div>
                    </div>
                    <Switch checked={autoIrrigation} onCheckedChange={setAutoIrrigation} />
                  </motion.div>

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
                        <p className="text-xs text-muted-foreground">Grow lights</p>
                      </div>
                    </div>
                    <Switch checked={autoLighting} onCheckedChange={setAutoLighting} />
                  </motion.div>

                  {/* Manual Pump */}
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

                  {/* Manual Fan */}
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

                {/* Irrigation Threshold */}
                {autoIrrigation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border"
                  >
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-muted-foreground">Moisture Threshold for Auto-Irrigation</span>
                      <span className="font-medium text-primary">{irrigationThreshold[0]}%</span>
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
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="card-gradient border-border">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                {[
                  { label: "LoRaWAN Gateway: Active", color: "bg-primary" },
                  { label: "Edge Computing: Running", color: "bg-primary" },
                  { label: "Database Sync: Real-time", color: "bg-primary" },
                  { label: "Drone Status: Standby", color: "bg-accent" },
                  { label: "AI Model: Online", color: "bg-primary" },
                ].map((status, index) => (
                  <motion.div
                    key={status.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
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
