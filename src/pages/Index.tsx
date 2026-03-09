import { Link } from "react-router-dom";
import farmHero from "@/assets/farm-hero.jpg";
import {
  Droplets,
  TrendingUp,
  Shield,
  MapPin,
  Clock,
  Users,
  Building2,
  Layers,
  ExternalLink,
  ChevronRight,
  Cpu,
  Radio,
  Camera,
  Gauge,
  Map,
  FlaskConical,
  Eye,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

const techTags = ["Python", "Raspberry Pi", "TensorFlow", "React"];

const metrics = [
  { value: "35%", label: "Water Savings", icon: Droplets, color: "text-primary" },
  { value: "18%", label: "Yield Increase", icon: TrendingUp, color: "text-accent" },
  { value: "94%", label: "Disease Detection", icon: Shield, color: "text-primary" },
  { value: "1500ac", label: "Area Covered", icon: MapPin, color: "text-accent" },
];

const projectInfo = [
  { label: "Duration", value: "14 weeks", icon: Clock },
  { label: "Client", value: "FarmWise India", icon: Building2 },
  { label: "Role", value: "IoT & ML Developer", icon: Cpu },
  { label: "Team Size", value: "5 Engineers", icon: Users },
  { label: "Industry", value: "Agriculture Technology", icon: Layers },
];

const designSteps = [
  {
    step: 1,
    title: "Sensor Network Design",
    description:
      "Designed LoRaWAN network topology for 500+ acre coverage. Selected sensors for soil moisture, temperature, NPK levels, and weather.",
    icon: Radio,
  },
  {
    step: 2,
    title: "ML Model Development",
    description:
      "Collected and labeled 10,000+ crop images. Trained CNN model achieving 94% disease detection accuracy.",
    icon: FlaskConical,
  },
  {
    step: 3,
    title: "Edge Computing",
    description:
      "Deployed NVIDIA Jetson for edge inference of drone imagery. Implemented image stitching for field-wide analysis.",
    icon: Cpu,
  },
  {
    step: 4,
    title: "Irrigation Automation",
    description:
      "Integrated with VFD-controlled pumps. Developed rule engine combining sensor data and ET calculations.",
    icon: Droplets,
  },
  {
    step: 5,
    title: "Dashboard Development",
    description:
      "Built GIS-enabled dashboard showing field health maps, sensor data, and irrigation status. Implemented farmer-friendly mobile view.",
    icon: Map,
  },
  {
    step: 6,
    title: "Pilot Deployment",
    description:
      "Deployed on 200-acre pilot farm. Refined system based on agronomist feedback over one crop cycle.",
    icon: Gauge,
  },
];

const keyResults = [
  "Water usage reduced by 35% through precision irrigation",
  "Early pest detection prevented ₹45L crop loss in pilot farm",
  "Yield increased by 18% compared to conventional farming practices",
  "94% accuracy in crop disease detection from drone imagery",
  "Farmer decision time reduced from days to hours for interventions",
  "System scaled to 1,500 acres across 3 farms in first year",
];

const technologies = ["Python", "TensorFlow", "Raspberry Pi", "LoRaWAN", "React", "PostgreSQL", "QGIS"];
const tools = ["VS Code", "Jupyter Notebook", "QGIS", "DJI drone platform", "Grafana"];

const lessons = [
  {
    icon: Cpu,
    title: "Edge Computing Advantage",
    text: "Edge computing enables ML inference in connectivity-limited rural areas",
  },
  {
    icon: Camera,
    title: "Transfer Learning",
    text: "Transfer learning dramatically reduces training data requirements for agriculture ML",
  },
  {
    icon: Eye,
    title: "Domain Expertise",
    text: "Agronomist involvement in system design ensures practical applicability",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <img
          src={farmHero}
          alt="Smart agriculture farm with IoT sensors and precision irrigation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        <div className="relative h-full flex flex-col justify-end pb-16 px-6 md:px-16 max-w-7xl mx-auto">
          {/* Tech Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {techTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-semibold rounded-full border border-primary/40 bg-primary/10 text-primary backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            <span className="gradient-text">Smart Agriculture</span>
            <br />
            <span className="text-foreground/90">System</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-6 max-w-xl">
            AI-powered precision farming with IoT sensors
          </p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-primary">
              <ExternalLink size={15} />
              View Live Project
            </button>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Eye size={14} />2 views
              </span>
              <span className="flex items-center gap-1.5">
                <ThumbsUp size={14} />0 likes
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare size={14} />0 comments
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 space-y-20">
        {/* Metrics Strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(({ value, label, icon: Icon, color }) => (
            <div
              key={label}
              className="card-gradient rounded-2xl border border-border p-6 text-center shadow-[var(--shadow-card)] hover:border-primary/30 transition-colors group"
            >
              <Icon className={`${color} mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity`} size={22} />
              <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </section>

        {/* Project Info + Overview */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Info Panel */}
          <div className="card-gradient rounded-2xl border border-border p-6 shadow-[var(--shadow-card)] space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Project Details</h3>
            {projectInfo.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-sm font-semibold text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Overview */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3 gradient-text">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                Developed an integrated smart agriculture system combining IoT sensors for soil and weather monitoring
                with AI-powered crop health analysis using drone imagery. The system provides automated irrigation
                control, pest detection, and yield prediction for large-scale farming operations.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card-gradient rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
                  The Challenge
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  {[
                    "500+ acres required scalable sensor networks",
                    "ML model needed 90%+ disease detection accuracy",
                    "Integration with existing pump infrastructure",
                    "Work with limited rural internet connectivity",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ChevronRight size={13} className="text-destructive mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-gradient rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  The Solution
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  {[
                    "LoRaWAN sensor network with solar-powered nodes",
                    "CNN model with ResNet transfer learning",
                    "NVIDIA Jetson edge computing gateway",
                    "React dashboard with GIS field mapping",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ChevronRight size={13} className="text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Design Process */}
        <section>
          <h2 className="text-2xl font-bold mb-2 gradient-text">Design Process</h2>
          <p className="text-muted-foreground mb-10 text-sm">From concept to deployment across 6 structured phases</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {designSteps.map(({ step, title, description, icon: Icon }) => (
              <div
                key={step}
                className="card-gradient rounded-2xl border border-border p-6 hover:border-primary/40 transition-all hover:shadow-[var(--glow-primary)] group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 text-7xl font-black text-foreground/[0.03] leading-none pr-4 pt-2 select-none">
                  {step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Step {step}</div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Results */}
        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">Key Results</h2>
            <p className="text-muted-foreground mb-8 text-sm">Measurable outcomes from the pilot and scale-up phase</p>
            <ul className="space-y-3">
              {keyResults.map((result, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-secondary/30 hover:border-primary/30 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-foreground/90">{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lessons Learned */}
          <div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">Lessons Learned</h2>
            <p className="text-muted-foreground mb-8 text-sm">Key engineering insights from the field</p>
            <div className="space-y-4">
              {lessons.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="card-gradient rounded-xl border border-border p-5 flex items-start gap-4 hover:border-accent/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-1">{title}</div>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section>
          <h2 className="text-2xl font-bold mb-8 gradient-text">Technologies & Tools</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card-gradient rounded-2xl border border-border p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-primary/30 bg-primary/10 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="card-gradient rounded-2xl border border-border p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5">
                Tools & Software
              </h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-accent/30 bg-accent/10 text-accent"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            Agri-Tech Portfolio · FarmWise India ·{" "}
            <span className="text-primary">Smart Agriculture System</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
