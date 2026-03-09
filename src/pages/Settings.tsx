import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Cpu,
  WifiOff,
  Database,
  Bell,
  BellOff,
  Cloud,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  TestTube,
  Zap,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DeviceConfig {
  enabled: boolean;
  host: string;
  port: string;
  apiKey: string;
  syncInterval: number;
  lastConnected: string | null;
  status: "connected" | "disconnected" | "error";
}

const SettingsPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    enabled: true,
    criticalAlerts: true,
    diseaseDetection: true,
    lowMoisture: true,
    highTemperature: true,
    systemStatus: false,
    sound: true,
  });

  // ESP32 Configuration
  const [esp32Config, setEsp32Config] = useState<DeviceConfig>({
    enabled: false,
    host: "",
    port: "80",
    apiKey: "",
    syncInterval: 5,
    lastConnected: null,
    status: "disconnected",
  });

  // Firebase Configuration
  const [firebaseConfig, setFirebaseConfig] = useState({
    enabled: false,
    projectId: "",
    apiKey: "",
    databaseURL: "",
    authDomain: "",
  });

  // Raspberry Pi Configuration
  const [raspberryPiConfig, setRaspberryPiConfig] = useState<DeviceConfig>({
    enabled: false,
    host: "",
    port: "5000",
    apiKey: "",
    syncInterval: 10,
    lastConnected: null,
    status: "disconnected",
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleTestConnection = async (device: "esp32" | "raspberry" | "firebase") => {
    setIsTesting(device);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // Simulate random success/failure
    
    if (device === "esp32") {
      setEsp32Config((prev) => ({
        ...prev,
        status: success ? "connected" : "error",
        lastConnected: success ? new Date().toLocaleString() : prev.lastConnected,
      }));
    } else if (device === "raspberry") {
      setRaspberryPiConfig((prev) => ({
        ...prev,
        status: success ? "connected" : "error",
        lastConnected: success ? new Date().toLocaleString() : prev.lastConnected,
      }));
    }
    
    setIsTesting(null);
    toast({
      title: success ? "Connection Successful" : "Connection Failed",
      description: success 
        ? `Successfully connected to ${device === "esp32" ? "ESP32" : device === "raspberry" ? "Raspberry Pi" : "Firebase"}`
        : "Failed to establish connection. Please check your settings.",
      variant: success ? "default" : "destructive",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 size={14} className="text-primary" />;
      case "error":
        return <AlertCircle size={14} className="text-destructive" />;
      default:
        return <WifiOff size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-secondary/30 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              Settings
            </h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw size={14} className="animate-spin mr-2" />
            ) : (
              <Save size={14} className="mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Cpu size={14} />
              <span className="hidden sm:inline">Device Sync</span>
              <span className="sm:hidden">Devices</span>
            </TabsTrigger>
            <TabsTrigger value="firebase" className="flex items-center gap-2">
              <Cloud size={14} />
              <span className="hidden sm:inline">Firebase</span>
              <span className="sm:hidden">Cloud</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={14} />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Device Sync Tab */}
          <TabsContent value="devices" className="space-y-6">
            {/* ESP32 Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="card-gradient border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Cpu size={20} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">ESP32 Configuration</CardTitle>
                        <CardDescription className="text-xs">
                          Connect to ESP32 microcontroller for sensor data
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(esp32Config.status)}
                      <Switch
                        checked={esp32Config.enabled}
                        onCheckedChange={(checked) =>
                          setEsp32Config((prev) => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                {esp32Config.enabled && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="esp32-host">Host / IP Address</Label>
                        <Input
                          id="esp32-host"
                          placeholder="192.168.1.100"
                          value={esp32Config.host}
                          onChange={(e) =>
                            setEsp32Config((prev) => ({ ...prev, host: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="esp32-port">Port</Label>
                        <Input
                          id="esp32-port"
                          placeholder="80"
                          value={esp32Config.port}
                          onChange={(e) =>
                            setEsp32Config((prev) => ({ ...prev, port: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="esp32-api">API Key (Optional)</Label>
                      <Input
                        id="esp32-api"
                        type="password"
                        placeholder="Enter API key for authentication"
                        value={esp32Config.apiKey}
                        onChange={(e) =>
                          setEsp32Config((prev) => ({ ...prev, apiKey: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="esp32-interval">Sync Interval (seconds)</Label>
                      <Input
                        id="esp32-interval"
                        type="number"
                        min={1}
                        max={60}
                        value={esp32Config.syncInterval}
                        onChange={(e) =>
                          setEsp32Config((prev) => ({
                            ...prev,
                            syncInterval: parseInt(e.target.value) || 5,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      {esp32Config.lastConnected && (
                        <span className="text-xs text-muted-foreground">
                          Last connected: {esp32Config.lastConnected}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection("esp32")}
                        disabled={isTesting === "esp32" || !esp32Config.host}
                      >
                        {isTesting === "esp32" ? (
                          <RefreshCw size={14} className="animate-spin mr-2" />
                        ) : (
                          <TestTube size={14} className="mr-2" />
                        )}
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Raspberry Pi Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-gradient border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Server size={20} className="text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Raspberry Pi Configuration</CardTitle>
                        <CardDescription className="text-xs">
                          Connect to Raspberry Pi for edge computing & ML inference
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(raspberryPiConfig.status)}
                      <Switch
                        checked={raspberryPiConfig.enabled}
                        onCheckedChange={(checked) =>
                          setRaspberryPiConfig((prev) => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                {raspberryPiConfig.enabled && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rpi-host">Host / IP Address</Label>
                        <Input
                          id="rpi-host"
                          placeholder="192.168.1.101"
                          value={raspberryPiConfig.host}
                          onChange={(e) =>
                            setRaspberryPiConfig((prev) => ({ ...prev, host: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rpi-port">Port</Label>
                        <Input
                          id="rpi-port"
                          placeholder="5000"
                          value={raspberryPiConfig.port}
                          onChange={(e) =>
                            setRaspberryPiConfig((prev) => ({ ...prev, port: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rpi-api">API Key</Label>
                      <Input
                        id="rpi-api"
                        type="password"
                        placeholder="Enter API key"
                        value={raspberryPiConfig.apiKey}
                        onChange={(e) =>
                          setRaspberryPiConfig((prev) => ({ ...prev, apiKey: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rpi-interval">Sync Interval (seconds)</Label>
                      <Input
                        id="rpi-interval"
                        type="number"
                        min={1}
                        max={60}
                        value={raspberryPiConfig.syncInterval}
                        onChange={(e) =>
                          setRaspberryPiConfig((prev) => ({
                            ...prev,
                            syncInterval: parseInt(e.target.value) || 10,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      {raspberryPiConfig.lastConnected && (
                        <span className="text-xs text-muted-foreground">
                          Last connected: {raspberryPiConfig.lastConnected}
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection("raspberry")}
                        disabled={isTesting === "raspberry" || !raspberryPiConfig.host}
                      >
                        {isTesting === "raspberry" ? (
                          <RefreshCw size={14} className="animate-spin mr-2" />
                        ) : (
                          <TestTube size={14} className="mr-2" />
                        )}
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          {/* Firebase Tab */}
          <TabsContent value="firebase" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="card-gradient border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Database size={20} className="text-amber-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Firebase Realtime Database</CardTitle>
                        <CardDescription className="text-xs">
                          Sync sensor data to Firebase for cloud storage & analysis
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={firebaseConfig.enabled}
                      onCheckedChange={(checked) =>
                        setFirebaseConfig((prev) => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>
                </CardHeader>
                {firebaseConfig.enabled && (
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
                      <div className="flex items-start gap-2">
                        <Shield size={14} className="mt-0.5 shrink-0" />
                        <span>
                          Keep your Firebase credentials secure. Never share your API key publicly.
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fb-project">Project ID</Label>
                      <Input
                        id="fb-project"
                        placeholder="your-project-id"
                        value={firebaseConfig.projectId}
                        onChange={(e) =>
                          setFirebaseConfig((prev) => ({ ...prev, projectId: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fb-api">API Key</Label>
                      <Input
                        id="fb-api"
                        type="password"
                        placeholder="AIza..."
                        value={firebaseConfig.apiKey}
                        onChange={(e) =>
                          setFirebaseConfig((prev) => ({ ...prev, apiKey: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fb-database">Database URL</Label>
                      <Input
                        id="fb-database"
                        placeholder="https://your-project.firebaseio.com"
                        value={firebaseConfig.databaseURL}
                        onChange={(e) =>
                          setFirebaseConfig((prev) => ({ ...prev, databaseURL: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fb-auth">Auth Domain (Optional)</Label>
                      <Input
                        id="fb-auth"
                        placeholder="your-project.firebaseapp.com"
                        value={firebaseConfig.authDomain}
                        onChange={(e) =>
                          setFirebaseConfig((prev) => ({ ...prev, authDomain: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection("firebase")}
                        disabled={isTesting === "firebase" || !firebaseConfig.projectId}
                      >
                        {isTesting === "firebase" ? (
                          <RefreshCw size={14} className="animate-spin mr-2" />
                        ) : (
                          <Zap size={14} className="mr-2" />
                        )}
                        Verify Connection
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="card-gradient border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        {notifications.enabled ? (
                          <Bell size={20} className="text-primary" />
                        ) : (
                          <BellOff size={20} className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">Push Notifications</CardTitle>
                        <CardDescription className="text-xs">
                          Configure alerts for critical sensor events
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.enabled}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>
                </CardHeader>
                {notifications.enabled && (
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { key: "criticalAlerts", label: "Critical Alerts", desc: "Immediate notifications for sensor failures" },
                        { key: "diseaseDetection", label: "Disease Detection", desc: "Alerts when crop diseases are detected" },
                        { key: "lowMoisture", label: "Low Soil Moisture", desc: "Warn when moisture drops below threshold" },
                        { key: "highTemperature", label: "High Temperature", desc: "Alert for extreme temperature conditions" },
                        { key: "systemStatus", label: "System Status", desc: "Updates on device connectivity changes" },
                        { key: "sound", label: "Notification Sound", desc: "Play sound for incoming alerts" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                        >
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch
                            checked={notifications[item.key as keyof typeof notifications] as boolean}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
