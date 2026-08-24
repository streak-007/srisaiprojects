-- Seed sample projects (run after 001_initial.sql)

insert into public.projects (
  id, slug, title, short_description, full_description, category, target_year,
  branch_tags, domain_tags, cover_image_url, gallery, status, starting_from,
  features, tech_stack, deliverables, timeline_days, featured
) values
(
  '11111111-1111-4111-8111-111111111111',
  'smart-irrigation-system-iot',
  'Smart Irrigation System (IoT)',
  'Soil-moisture driven drip control with live phone alerts and a solar-ready controller board.',
  'Build an end-to-end IoT irrigation kit: capacitive soil sensors, ESP32 controller, solenoid valves, and a mobile dashboard.',
  'final_year', 4,
  array['ECE','EEE'], array['IoT','Embedded'],
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
  array['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80'],
  'published', 6500,
  array['Auto watering','Phone alerts','Solar-ready'],
  array['ESP32','MQTT','Firebase'],
  array['Working kit','Source code','Report PDF','PPT'],
  14, true
),
(
  '22222222-2222-4222-8222-222222222222',
  'gesture-controlled-robotic-arm',
  'Gesture-Controlled Robotic Arm',
  'Glove sensors map hand motion to a 4-DOF arm — crowd-pleaser for robotics viva demos.',
  'A wearable IMU glove streams gestures over Bluetooth to a servo-driven arm.',
  'final_year', 4,
  array['ECE','Mechanical'], array['Robotics','Embedded'],
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
  '{}', 'published', 9800,
  array['4-DOF servo arm','Bluetooth glove'],
  array['Arduino','MPU6050','Servos'],
  array['Assembled arm','Glove kit','Code','Report'],
  21, true
),
(
  '33333333-3333-4333-8333-333333333333',
  'campus-lost-found-web-app',
  'Campus Lost & Found Web App',
  'Responsive web app for posting lost items, matching claims, and admin verification.',
  'Full-stack campus utility with auth, image uploads, and admin claim workflow.',
  'minor', 3,
  array['CSE'], array['Web/App Dev'],
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
  '{}', 'published', 4500,
  array['Auth + roles','Claim workflow'],
  array['Next.js','Supabase','Tailwind'],
  array['Deployed app','Source repo','Report'],
  10, true
),
(
  '44444444-4444-4444-8444-444444444444',
  'ml-plant-disease-detector',
  'ML Plant Disease Detector',
  'CNN classifier for leaf disease detection with a simple phone-camera capture flow.',
  'Train and deploy a compact CNN that classifies common crop leaf diseases.',
  'final_year', 4,
  array['CSE','ECE'], array['ML/AI'],
  'https://images.unsplash.com/photo-1466692476866-aef1dfb1e735?w=1200&q=80',
  '{}', 'published', 7200,
  array['CNN model','On-device option'],
  array['Python','TensorFlow','OpenCV'],
  array['Model + notebook','UI','Report'],
  18, false
),
(
  '55555555-5555-4555-8555-555555555555',
  'home-energy-monitor',
  'Home Energy Monitor',
  'Current-sensor based usage dashboard with daily cost estimates for apartments.',
  'Clamp CT sensors feed an ESP8266 logger that graphs kWh and rupee estimates.',
  'minor', 2,
  array['EEE','ECE'], array['IoT','Embedded'],
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
  '{}', 'published', 5200,
  array['Live wattage chart','Daily cost estimate'],
  array['ESP8266','Chart.js'],
  array['Hardware kit','Firmware','Report'],
  12, false
),
(
  '66666666-6666-4666-8666-666666666666',
  'voice-assistant-for-visually-impaired',
  'Voice Assistant for Visually Impaired',
  'Offline-leaning voice navigation helper with obstacle beeps and phone companion.',
  'Ultrasonic + voice prompts guide the user around obstacles.',
  'final_year', 4,
  array['ECE','CSE'], array['Embedded','ML/AI'],
  'https://images.unsplash.com/photo-1589254065878-42c0da2b1b4b?w=1200&q=80',
  '{}', 'published', 8800,
  array['Obstacle beeps','Voice prompts'],
  array['Raspberry Pi','Python','TTS'],
  array['Prototype','Code','Report','PPT'],
  20, false
)
on conflict (id) do nothing;

insert into public.project_components (project_id, name, quantity, unit_cost) values
  ('11111111-1111-4111-8111-111111111111', 'ESP32 DevKit', 1, 450),
  ('11111111-1111-4111-8111-111111111111', 'Soil moisture sensors', 3, 150),
  ('11111111-1111-4111-8111-111111111111', 'Solenoid valve + driver', 1, 800),
  ('11111111-1111-4111-8111-111111111111', 'Enclosure / casing', 1, 300);

insert into public.project_addons (project_id, name, type, value) values
  ('11111111-1111-4111-8111-111111111111', 'Development / labor', 'percent', 20),
  ('11111111-1111-4111-8111-111111111111', 'Documentation & report', 'flat', 500),
  ('11111111-1111-4111-8111-111111111111', 'Testing & demo', 'flat', 400);

insert into public.testimonials (student_name, college, quote, project_title, published) values
  ('Ananya R.', 'JNTU affiliated college', 'Got a clear estimate upfront and the report matched exactly what our guide asked for.', 'Smart Irrigation System (IoT)', true),
  ('Karthik M.', 'Private engineering college, Hyderabad', 'The robotic arm demo was the highlight of our batch.', 'Gesture-Controlled Robotic Arm', true),
  ('Sneha P.', 'Autonomous college, Telangana', 'Loved the private details link — booking on WhatsApp was smooth.', 'Campus Lost & Found Web App', true);
