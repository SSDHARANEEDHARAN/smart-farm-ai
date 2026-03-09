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
  Cloud,
  Wind,
  Plane,
  Camera,
  Eye,
  MapPin,
  Scan,
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

// Generate 7-day weather forecast
const generateWeatherForecast = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const conditions = ["sunny", "cloudy", "rainy", "partly-cloudy"] as const;
  const today = new Date().getDay();
  
  return Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (today + i) % 7;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      day: i === 0 ? "Today" : days[dayIndex],
      condition,
      high: Math.floor(Math.random() * 10) + 28,
      low: Math.floor(Math.random() * 8) + 18,
      humidity: Math.floor(Math.random() * 30) + 50,
      rain: condition === "rainy" ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 20),
      wind: Math.floor(Math.random() * 15) + 5,
    };
  });
};

// Generate drone analysis data
const generateDroneData = () => ({
  lastFlight: new Date(Date.now() - Math.random() * 3600000 * 4).toLocaleTimeString(),
  areaScanned: Math.floor(Math.random() * 200) + 300,
  imagesCapture: Math.floor(Math.random() * 50) + 100,
  batteryLevel: Math.floor(Math.random() * 40) + 60,
  diseaseDetections: [
    { zone: "A-1", disease: "Leaf Blight", confidence: Math.floor(Math.random() * 15) + 85, severity: "moderate" as const, area: Math.floor(Math.random() * 5) + 2 },
    { zone: "B-3", disease: "Powdery Mildew", confidence: Math.floor(Math.random() * 10) + 90, severity: "low" as const, area: Math.floor(Math.random() * 3) + 1 },
    { zone: "C-2", disease: "Rust Fungus", confidence: Math.floor(Math.random() * 12) + 88, severity: "high" as const, area: Math.floor(Math.random() * 8) + 5 },
  ],
  healthyZones: Math.floor(Math.random() * 5) + 12,
  affectedZones: 3,
  ndviScore: (Math.random() * 0.3 + 0.6).toFixed(2),
});

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
      message: `Current moisture at ${sensorData.soilMoisture}%. Recommend immediate irrigation.`,
      action: "Schedule irrigation within 2 hours",
      icon: Droplets,
    });
  } else if (sensorData.soilMoisture > 70) {
    insights.push({
      type: "warning",
      category: "Drainage",
      title: "High Soil Moisture",
      message: `Moisture level at ${sensorData.soilMoisture}%. Risk of root rot.`,
      action: "Pause irrigation, monitor drainage",
      icon: Droplets,
    });
  } else {
    insights.push({
      type: "success",
      category: "Irrigation",
      title: "Optimal Soil Moisture",
      message: `Moisture at ${sensorData.soilMoisture}% - perfect for growth.`,
      action: "Maintain current schedule",
      icon: CheckCircle2,
    });
  }

  // Temperature Analysis
  if (sensorData.temperature > 32) {
    insights.push({
      type: "warning",
      category: "Climate",
      title: "High Temperature Alert",
      message: `Temperature at ${sensorData.temperature}°C. Heat stress risk.`,
      action: "Activate cooling systems",
      icon: Thermometer,
    });
  } else if (sensorData.temperature < 18) {
    insights.push({
      type: "info",
      category: "Climate",
      title: "Low Temperature Warning",
      message: `Temperature at ${sensorData.temperature}°C. Growth may slow.`,
      action: "Monitor frost risk",
      icon: Thermometer,
    });
  } else {
    insights.push({
      type: "success",
      category: "Climate",
      title: "Ideal Temperature",
      message: `Temperature at ${sensorData.temperature}°C is optimal.`,
      action: "No intervention needed",
      icon: CheckCircle2,
    });
  }

  // Pest Risk Analysis
  const pestRisk = sensorData.humidity > 75 && sensorData.temperature > 25;
  insights.push({
    type: pestRisk ? "warning" : "success",
    category: "Pest Management",
    title: pestRisk ? "Elevated Pest Risk" : "Low Pest Risk",
    message: pestRisk 
      ? "Favorable conditions for pests detected."
      : "Conditions unfavorable for pests.",
    action: pestRisk ? "Deploy preventive spraying" : "Continue monitoring",
    icon: Bug,
  });

  // Yield Prediction
  const phVal = parseFloat(sensorData.ph);
  const yieldScore = Math.min(100, Math.round(
    (sensorData.soilMoisture / 70 * 30) +
    (sensorData.nitrogen / 90 * 25) +
    (Math.min(sensorData.temperature, 28) / 28 * 25) +
    (phVal >= 6 && phVal <= 7.5 ? 20 : 10)
  ));
  
  insights.push({
    type: yieldScore > 75 ? "success" : yieldScore > 50 ? "info" : "warning",
    category: "Yield Forecast",
    title: `Yield Potential: ${yieldScore}%`,
    message: `Estimated yield is ${yieldScore > 75 ? 'above' : yieldScore > 50 ? 'at' : 'below'} average.`,
    action: yieldScore > 75 ? "Maintain practices" : "Optimize fertilizer",
    icon: Wheat,
  });

  return insights;
};

// Weather icon component
const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case "sunny":
      return <Sun className="text-amber-500" size={24} />;
    case "cloudy":
      return <Cloud className="text-muted-foreground" size={24} />;
    case "rainy":
      return <CloudRain className="text-primary" size={24} />;
    case "partly-cloudy":
      return <Cloud className="text-amber-400" size={24} />;
    default:
      return <Sun className="text-amber-500" size={24} />;
  }
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(generateSensorData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData());
  const [weatherForecast, setWeatherForecast] = useState(generateWeatherForecast());
  const [droneData, setDroneData] = useState(generateDroneData());
  const [isConnected] = useState(true);
  const [autoIrrigation, setAutoIrrigation] = useState(true);
  const [autoLighting, setAutoLighting] = useState(false);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [fanStatus, setFanStatus] = useState(true);
  const [irrigationThreshold, setIrrigationThreshold] = useState([40]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedAnalyticsTab, setSelectedAnalyticsTab] = useState<"insights" | "forecast" | "health">("insights");
  const [isDroneFlying, setIsDroneFlying] = useState(false);

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

  // Update weather every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherForecast(generateWeatherForecast());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update drone data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDroneFlying) {
        setDroneData(generateDroneData());
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isDroneFlying]);

  const handleRefresh = () => {
    setSensorData(generateSensorData());
    setWeatherForecast(generateWeatherForecast());
    setDroneData(generateDroneData());
    setLastUpdate(new Date());
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setSensorData(generateSensorData());
      setIsAnalyzing(false);
    }, 2000);
  };

  const startDroneFlight = () => {
    setIsDroneFlying(true);
    setTimeout(() => {
      setDroneData(generateDroneData());
      setIsDroneFlying(false);
    }, 5000);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-destructive bg-destructive/10 border-destructive/30";
      case "moderate": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "low": return "text-primary bg-primary/10 border-primary/30";
      default: return "text-muted-foreground bg-secondary border-border";
    }
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
              <span className="text-xs sm:text-sm hidden sm:inline">Back</span>
            </Link>
            <div className="h-4 sm:h-6 w-px bg-border hidden sm:block" />
            <h1 className="text-sm sm:text-lg font-bold gradient-text truncate">Smart Farm Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              {isConnected ? (
                <Wifi size={14} className="text-primary" />
              ) : (
                <WifiOff size={14} className="text-destructive" />
              )}
              <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
                {isConnected ? "Connected" : "Offline"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="h-8 px-2 sm:px-3">
              <RefreshCw size={14} />
              <span className="hidden sm:inline ml-1">Refresh</span>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Device Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between"
        >
          <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/30"
            >
              <Cpu size={12} className="text-primary" />
              <span className="text-[10px] sm:text-xs font-medium">ESP32</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent/10 border border-accent/30"
            >
              <Cpu size={12} className="text-accent" />
              <span className="text-[10px] sm:text-xs font-medium">Raspberry Pi</span>
            </motion.div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Sensor Cards - Responsive Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
        >
          {/* Humidity */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                  <CloudRain size={14} className="text-primary" />
                  <span className="truncate">Air Humidity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <motion.div
                  key={sensorData.humidity}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-2xl sm:text-4xl font-bold ${getStatusColor(sensorData.humidity, "humidity")}`}
                >
                  {sensorData.humidity}%
                </motion.div>
                <Progress value={sensorData.humidity} className="mt-2 sm:mt-3 h-1.5 sm:h-2" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">Optimal: 60-80%</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soil Moisture */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                  <Droplets size={14} className="text-primary" />
                  <span className="truncate">Soil Moisture</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <motion.div
                  key={sensorData.soilMoisture}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-2xl sm:text-4xl font-bold ${getStatusColor(sensorData.soilMoisture, "soilMoisture")}`}
                >
                  {sensorData.soilMoisture}%
                </motion.div>
                <Progress value={sensorData.soilMoisture} className="mt-2 sm:mt-3 h-1.5 sm:h-2" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">Optimal: 40-70%</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Temperature */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                  <Thermometer size={14} className="text-accent" />
                  <span className="truncate">Temperature</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <motion.div
                  key={sensorData.temperature}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-2xl sm:text-4xl font-bold ${getStatusColor(sensorData.temperature, "temperature")}`}
                >
                  {sensorData.temperature}°C
                </motion.div>
                <Progress value={(sensorData.temperature / 45) * 100} className="mt-2 sm:mt-3 h-1.5 sm:h-2" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">Optimal: 20-30°C</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Water Level */}
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="card-gradient border-border hover:border-primary/30 transition-colors h-full">
              <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                  <Droplets size={14} className="text-accent" />
                  <span className="truncate">Water Tank</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <motion.div
                  key={sensorData.waterLevel}
                  variants={gaugeVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-2xl sm:text-4xl font-bold text-primary"
                >
                  {sensorData.waterLevel}%
                </motion.div>
                <Progress value={sensorData.waterLevel} className="mt-2 sm:mt-3 h-1.5 sm:h-2" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">Capacity: 5000L</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Weather Forecast Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-gradient border-border overflow-hidden">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Cloud size={18} className="text-primary" />
                  7-Day Weather Forecast
                </CardTitle>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Auto-updated</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-7 gap-1 sm:gap-3">
                {weatherForecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border text-center ${
                      index === 0 ? "bg-primary/10 border-primary/30" : "bg-secondary/30 border-border"
                    }`}
                  >
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-2">{day.day}</p>
                    <div className="flex justify-center mb-1 sm:mb-2">
                      <WeatherIcon condition={day.condition} />
                    </div>
                    <p className="text-sm sm:text-lg font-bold">{day.high}°</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{day.low}°</p>
                    <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 hidden sm:block">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                        <Droplets size={10} />
                        {day.rain}%
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                        <Wind size={10} />
                        {day.wind}km/h
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Real-time Charts - Responsive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6"
        >
          {/* Temperature & Humidity Chart */}
          <motion.div whileHover={{ scale: 1.005 }}>
            <Card className="card-gradient border-border">
              <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                  <Activity size={14} className="text-primary" />
                  Temperature & Humidity (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="temperature" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Temp (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Humidity (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soil Moisture Chart */}
          <motion.div whileHover={{ scale: 1.005 }}>
            <Card className="card-gradient border-border">
              <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                  <Droplets size={14} className="text-primary" />
                  Soil Moisture Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                      domain={[0, 100]}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <defs>
                      <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="soilMoisture" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#soilGradient)" name="Soil Moisture (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Drone Imagery Analysis Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="card-gradient border-border overflow-hidden">
            <CardHeader className="p-3 sm:p-6 border-b border-border bg-secondary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Plane size={18} className="text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      Drone Imagery Analysis
                      <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-primary/20 text-primary rounded-full">
                        CNN Model
                      </span>
                    </CardTitle>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                      Real-time crop disease detection • 94% accuracy
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={startDroneFlight}
                    disabled={isDroneFlying}
                    size="sm"
                    className="bg-accent hover:bg-accent/90"
                  >
                    {isDroneFlying ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span className="hidden sm:inline">Scanning...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={14} />
                        <span className="hidden sm:inline">Start Scan</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              {/* Drone Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {[
                  { label: "Last Flight", value: droneData.lastFlight, icon: Timer },
                  { label: "Area Scanned", value: `${droneData.areaScanned} acres`, icon: MapPin },
                  { label: "Images", value: droneData.imagesCapture.toString(), icon: Camera },
                  { label: "NDVI Score", value: droneData.ndviScore, icon: Eye },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <stat.icon size={12} className="text-muted-foreground" />
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-sm sm:text-lg font-bold">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Disease Detections */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <Scan size={14} className="text-destructive" />
                    Disease Detections
                  </h4>
                  <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Healthy: {droneData.healthyZones}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      Affected: {droneData.affectedZones}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 sm:gap-3">
                  {droneData.diseaseDetections.map((detection, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${getSeverityColor(detection.severity)}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-background/50 flex items-center justify-center shrink-0">
                            <Bug size={16} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-0.5 sm:mb-1">
                              <span className="font-semibold text-xs sm:text-sm">{detection.disease}</span>
                              <span className="px-1.5 sm:px-2 py-0.5 text-[10px] rounded-full bg-background/50 font-medium">
                                Zone {detection.zone}
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs opacity-80">
                              Affected area: ~{detection.area} acres • Confidence: {detection.confidence}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className={`px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full capitalize ${
                            detection.severity === "high" ? "bg-destructive/20" :
                            detection.severity === "moderate" ? "bg-amber-500/20" : "bg-primary/20"
                          }`}>
                            {detection.severity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* AI Recommendation for diseases */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-accent/5 border border-accent/20"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Bot size={16} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-xs sm:text-sm mb-1">AI Treatment Recommendation</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Priority: Zone C-2 (Rust Fungus) requires immediate fungicide application. 
                        Apply copper-based fungicide within 24h. For zones A-1 and B-3, schedule 
                        treatment within the next 3-5 days using systemic fungicides.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* AI Farmer Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-gradient border-border overflow-hidden">
            <CardHeader className="p-3 sm:p-6 border-b border-border bg-secondary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Bot size={18} className="text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base flex flex-wrap items-center gap-2">
                      AI Farmer Analytics
                      <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-accent/20 text-accent rounded-full">
                        TensorFlow
                      </span>
                    </CardTitle>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                      Real-time agricultural intelligence
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={runAIAnalysis}
                    disabled={isAnalyzing}
                    size="sm"
                    className="bg-accent hover:bg-accent/90"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span className="hidden sm:inline">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} />
                        <span className="hidden sm:inline">Run Analysis</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Analytics Tabs - Scrollable on mobile */}
              <div className="flex gap-1 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1">
                {[
                  { id: "insights", label: "Insights", icon: Lightbulb },
                  { id: "forecast", label: "Forecast", icon: Calendar },
                  { id: "health", label: "Health", icon: ShieldCheck },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnalyticsTab(tab.id as typeof selectedAnalyticsTab)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedAnalyticsTab === tab.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              <AnimatePresence mode="wait">
                {/* Smart Insights Tab */}
                {selectedAnalyticsTab === "insights" && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4"
                  >
                    {aiInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                          insight.type === "success"
                            ? "bg-primary/5 border-primary/20"
                            : insight.type === "warning"
                            ? "bg-amber-500/5 border-amber-500/20"
                            : "bg-accent/5 border-accent/20"
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            insight.type === "success" ? "bg-primary/10" :
                            insight.type === "warning" ? "bg-amber-500/10" : "bg-accent/10"
                          }`}>
                            <insight.icon size={16} className={
                              insight.type === "success" ? "text-primary" :
                              insight.type === "warning" ? "text-amber-500" : "text-accent"
                            } />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                              {insight.category}
                            </span>
                            <p className="font-semibold text-xs sm:text-sm mt-1">{insight.title}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{insight.message}</p>
                            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/50">
                              <Target size={10} className="text-muted-foreground shrink-0" />
                              <span className="text-[10px] sm:text-xs text-primary font-medium truncate">{insight.action}</span>
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
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <TrendingUp size={14} className="text-primary" />
                          <span className="text-xs sm:text-sm font-medium">7-Day Yield</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-primary">+12%</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Above average</p>
                      </div>
                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-accent/5 border border-accent/20">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Droplets size={14} className="text-accent" />
                          <span className="text-xs sm:text-sm font-medium">Water Saved</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-accent">2,450L</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">This week</p>
                      </div>
                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary border border-border">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Timer size={14} />
                          <span className="text-xs sm:text-sm font-medium">Next Harvest</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold">18 Days</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Optimal window</p>
                      </div>
                    </div>

                    <Card className="border-border">
                      <CardHeader className="p-3 sm:p-4 pb-2">
                        <CardTitle className="text-xs sm:text-sm">Weekly Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0">
                        <ResponsiveContainer width="100%" height={150}>
                          <BarChart data={weeklyForecast}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} domain={[0, 100]} width={25} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} />
                            <Bar dataKey="irrigation" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} name="Irrigation" />
                            <Bar dataKey="growth" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} name="Growth" />
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
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {/* Health Score Gauge */}
                    <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-xl bg-secondary/30 border border-border">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">Overall Crop Health</p>
                      <div className="relative">
                        <svg className="w-28 h-28 sm:w-40 sm:h-40 transform -rotate-90">
                          <circle cx="50%" cy="50%" r="45%" stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
                          <motion.circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke={cropHealthScore >= 80 ? "hsl(var(--primary))" : cropHealthScore >= 60 ? "hsl(var(--accent))" : "hsl(var(--destructive))"}
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: cropHealthScore / 100 }}
                            transition={{ duration: 1 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.span
                            key={cropHealthScore}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-2xl sm:text-4xl font-bold"
                          >
                            {cropHealthScore}%
                          </motion.span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm mt-3 sm:mt-4 text-center">
                        {cropHealthScore >= 80 ? (
                          <span className="text-primary flex items-center gap-1 justify-center">
                            <CheckCircle2 size={14} /> Excellent
                          </span>
                        ) : cropHealthScore >= 60 ? (
                          <span className="text-accent flex items-center gap-1 justify-center">
                            <AlertTriangle size={14} /> Good
                          </span>
                        ) : (
                          <span className="text-destructive flex items-center gap-1 justify-center">
                            <AlertTriangle size={14} /> Needs Attention
                          </span>
                        )}
                      </p>
                    </div>

                    {/* NPK Levels */}
                    <div className="space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm font-medium">Soil NPK Levels</p>
                      {[
                        { name: "Nitrogen (N)", value: sensorData.nitrogen, color: "bg-primary" },
                        { name: "Phosphorus (P)", value: sensorData.phosphorus, color: "bg-accent" },
                        { name: "Potassium (K)", value: sensorData.potassium, color: "bg-emerald-500" },
                      ].map((nutrient) => (
                        <motion.div
                          key={nutrient.name}
                          whileHover={{ x: 4 }}
                          className="p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border"
                        >
                          <div className="flex justify-between items-center mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm font-medium">{nutrient.name}</span>
                            <span className="text-xs sm:text-sm font-bold">{nutrient.value} mg/kg</span>
                          </div>
                          <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${nutrient.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${nutrient.value}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </motion.div>
                      ))}

                      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/20 mt-3 sm:mt-4">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Leaf size={14} className="text-primary" />
                          <span className="text-xs sm:text-sm font-medium">AI Recommendation</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Apply NPK fertilizer (10-10-10) at 25kg/acre within 5 days for optimal yield.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex items-center gap-1">
                    <Cpu size={10} /> CNN: 94% accuracy
                  </span>
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <BarChart3 size={10} /> ResNet
                  </span>
                </div>
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Additional Sensors - Responsive */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
        >
          <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-gradient border-border">
              <CardContent className="p-3 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Sun size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Light</p>
                    <motion.p key={sensorData.lightIntensity} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-xl font-bold">
                      {sensorData.lightIntensity} lux
                    </motion.p>
                  </div>
                </div>
                <Activity size={20} className="text-muted-foreground/30 hidden sm:block" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }}>
            <Card className="card-gradient border-border">
              <CardContent className="p-3 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                    <Leaf size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Soil pH</p>
                    <motion.p key={sensorData.ph} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm sm:text-xl font-bold">
                      {sensorData.ph}
                    </motion.p>
                  </div>
                </div>
                <Activity size={20} className="text-muted-foreground/30 hidden sm:block" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} className="col-span-2 sm:col-span-1">
            <Card className="card-gradient border-border">
              <CardContent className="p-3 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                    <Sprout size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Growth Stage</p>
                    <p className="text-sm sm:text-xl font-bold">Vegetative</p>
                  </div>
                </div>
                <TrendingUp size={20} className="text-primary/50 hidden sm:block" />
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Control Panel - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="card-gradient border-border">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <Power size={16} className="text-primary" />
                Automation Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {/* Auto Irrigation */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Droplets size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm">Auto Irrigation</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">ESP32</p>
                    </div>
                  </div>
                  <Switch checked={autoIrrigation} onCheckedChange={setAutoIrrigation} />
                </motion.div>

                {/* Auto Lighting */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      {autoLighting ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm">Auto Lighting</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Grow lights</p>
                    </div>
                  </div>
                  <Switch checked={autoLighting} onCheckedChange={setAutoLighting} />
                </motion.div>

                {/* Manual Pump */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={pumpStatus ? "default" : "outline"}
                    className="h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2 w-full"
                    onClick={() => setPumpStatus(!pumpStatus)}
                  >
                    <Droplets size={18} />
                    <span className="text-[10px] sm:text-xs">Pump {pumpStatus ? "ON" : "OFF"}</span>
                  </Button>
                </motion.div>

                {/* Manual Fan */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={fanStatus ? "default" : "outline"}
                    className="h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2 w-full"
                    onClick={() => setFanStatus(!fanStatus)}
                  >
                    <Activity size={18} />
                    <span className="text-[10px] sm:text-xs">Fan {fanStatus ? "ON" : "OFF"}</span>
                  </Button>
                </motion.div>
              </div>

              {/* Irrigation Threshold */}
              {autoIrrigation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/30 border border-border"
                >
                  <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-3">
                    <span className="text-muted-foreground">Moisture Threshold</span>
                    <span className="font-medium text-primary">{irrigationThreshold[0]}%</span>
                  </div>
                  <Slider value={irrigationThreshold} onValueChange={setIrrigationThreshold} max={80} min={20} step={5} />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status - Responsive */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <Card className="card-gradient border-border">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-sm">
                {[
                  { label: "LoRaWAN", color: "bg-primary" },
                  { label: "Edge Computing", color: "bg-primary" },
                  { label: "Database", color: "bg-primary" },
                  { label: "Drone", color: "bg-accent" },
                  { label: "AI Model", color: "bg-primary" },
                ].map((status, index) => (
                  <motion.div
                    key={status.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-1.5 sm:gap-2"
                  >
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${status.color} animate-pulse`} />
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
