import type { Project, ProjectAddon, ProjectComponent } from "./types";

const now = new Date().toISOString();

export const MOCK_PROJECTS: Project[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "smart-irrigation-system-iot",
    title: "Smart Irrigation System (IoT)",
    short_description:
      "Soil-moisture driven drip control with live phone alerts and a solar-ready controller board.",
    full_description:
      "Build an end-to-end IoT irrigation kit: capacitive soil sensors, ESP32 controller, solenoid valves, and a mobile dashboard. Ideal for ECE / IoT final-year demos with a clear hardware story and polished report template.",
    category: "final_year",
    target_year: 4,
    branch_tags: ["ECE", "EEE"],
    domain_tags: ["IoT", "Embedded"],
    cover_image_url:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    ],
    status: "published",
    starting_from: 6500,
    features: [
      "Auto watering based on soil moisture thresholds",
      "WhatsApp / app push alerts",
      "Battery + solar charging option",
      "Complete wiring diagram + report",
    ],
    tech_stack: ["ESP32", "MQTT", "Firebase", "C++"],
    demo_video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    deliverables: ["Working kit", "Source code", "Report PDF", "PPT", "Demo video guidance"],
    timeline_days: 14,
    featured: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "gesture-controlled-robotic-arm",
    title: "Gesture-Controlled Robotic Arm",
    short_description:
      "Glove sensors map hand motion to a 4-DOF arm — crowd-pleaser for robotics viva demos.",
    full_description:
      "A wearable IMU glove streams gestures over Bluetooth to a servo-driven arm. Includes calibration UI, safety limits, and a ready-made demo script for lab presentations.",
    category: "final_year",
    target_year: 4,
    branch_tags: ["ECE", "Mechanical"],
    domain_tags: ["Robotics", "Embedded"],
    cover_image_url:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
    ],
    status: "published",
    starting_from: 9800,
    features: ["4-DOF servo arm", "Bluetooth glove", "Position memory poses", "Safety stop"],
    tech_stack: ["Arduino", "MPU6050", "Servos", "Python"],
    demo_video_url: null,
    deliverables: ["Assembled arm", "Glove kit", "Code", "Report", "PPT"],
    timeline_days: 21,
    featured: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "campus-lost-found-web-app",
    title: "Campus Lost & Found Web App",
    short_description:
      "Responsive web app for posting lost items, matching claims, and admin verification.",
    full_description:
      "A full-stack campus utility: students post lost/found items with photos, admins verify claims, and email alerts notify matches. Perfect CSE / Web minor or major depending on depth.",
    category: "minor",
    target_year: 3,
    branch_tags: ["CSE"],
    domain_tags: ["Web/App Dev"],
    cover_image_url:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    gallery: [],
    status: "published",
    starting_from: 4500,
    features: ["Auth + roles", "Image uploads", "Claim workflow", "Admin dashboard"],
    tech_stack: ["Next.js", "Supabase", "Tailwind"],
    demo_video_url: null,
    deliverables: ["Deployed app", "Source repo", "Report", "PPT"],
    timeline_days: 10,
    featured: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "ml-plant-disease-detector",
    title: "ML Plant Disease Detector",
    short_description:
      "CNN classifier for leaf disease detection with a simple phone-camera capture flow.",
    full_description:
      "Train and deploy a compact CNN that classifies common crop leaf diseases. Includes dataset prep notes, TensorFlow Lite export, and a Flutter/web capture UI for viva demos.",
    category: "final_year",
    target_year: 4,
    branch_tags: ["CSE", "ECE"],
    domain_tags: ["ML/AI"],
    cover_image_url:
      "https://images.unsplash.com/photo-1466692476866-aef1dfb1e735?w=1200&q=80",
    gallery: [],
    status: "published",
    starting_from: 7200,
    features: ["CNN model", "On-device inference option", "Result explanation cards"],
    tech_stack: ["Python", "TensorFlow", "OpenCV"],
    demo_video_url: null,
    deliverables: ["Model + notebook", "UI", "Report", "PPT"],
    timeline_days: 18,
    featured: false,
    created_at: now,
    updated_at: now,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    slug: "home-energy-monitor",
    title: "Home Energy Monitor",
    short_description:
      "Current-sensor based usage dashboard with daily cost estimates for apartments.",
    full_description:
      "Clamp CT sensors feed an ESP8266 logger that graphs kWh and rupee estimates. Includes PCB layout and enclosure notes for a clean hardware demo.",
    category: "minor",
    target_year: 2,
    branch_tags: ["EEE", "ECE"],
    domain_tags: ["IoT", "Embedded"],
    cover_image_url:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80",
    gallery: [],
    status: "published",
    starting_from: 5200,
    features: ["Live wattage chart", "Daily cost estimate", "Threshold alerts"],
    tech_stack: ["ESP8266", "Influx-ready logs", "Chart.js"],
    demo_video_url: null,
    deliverables: ["Hardware kit", "Firmware", "Report"],
    timeline_days: 12,
    featured: false,
    created_at: now,
    updated_at: now,
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    slug: "voice-assistant-for-visually-impaired",
    title: "Voice Assistant for Visually Impaired",
    short_description:
      "Offline-leaning voice navigation helper with obstacle beeps and phone companion.",
    full_description:
      "Ultrasonic + voice prompts guide the user around obstacles. Includes training script for demo day and accessibility-focused documentation.",
    category: "final_year",
    target_year: 4,
    branch_tags: ["ECE", "CSE"],
    domain_tags: ["Embedded", "ML/AI"],
    cover_image_url:
      "https://images.unsplash.com/photo-1589254065878-42c0da2b1b4b?w=1200&q=80",
    gallery: [],
    status: "published",
    starting_from: 8800,
    features: ["Obstacle beeps", "Voice prompts", "Companion app hooks"],
    tech_stack: ["Raspberry Pi", "Python", "TTS"],
    demo_video_url: null,
    deliverables: ["Prototype", "Code", "Report", "PPT"],
    timeline_days: 20,
    featured: false,
    created_at: now,
    updated_at: now,
  },
];

export const MOCK_COMPONENTS: Record<string, ProjectComponent[]> = {
  "11111111-1111-4111-8111-111111111111": [
    { id: "c1", project_id: "11111111-1111-4111-8111-111111111111", name: "ESP32 DevKit", quantity: 1, unit_cost: 450 },
    { id: "c2", project_id: "11111111-1111-4111-8111-111111111111", name: "Soil moisture sensors", quantity: 3, unit_cost: 150 },
    { id: "c3", project_id: "11111111-1111-4111-8111-111111111111", name: "Solenoid valve + driver", quantity: 1, unit_cost: 800 },
    { id: "c4", project_id: "11111111-1111-4111-8111-111111111111", name: "Enclosure / casing", quantity: 1, unit_cost: 300 },
  ],
};

export const MOCK_ADDONS: Record<string, ProjectAddon[]> = {
  "11111111-1111-4111-8111-111111111111": [
    { id: "a1", project_id: "11111111-1111-4111-8111-111111111111", name: "Development / labor", type: "percent", value: 20 },
    { id: "a2", project_id: "11111111-1111-4111-8111-111111111111", name: "Documentation & report", type: "flat", value: 500 },
    { id: "a3", project_id: "11111111-1111-4111-8111-111111111111", name: "Testing & demo", type: "flat", value: 400 },
  ],
};
