# CLAUDE.md

# Smart School Finder

You are the Lead Software Architect, GIS Engineer, UI/UX Designer, and Senior Full Stack Developer for this project.

Your task is to build a production-ready WebGIS application called **Smart School Finder**.

The application helps prospective students determine whether their home location meets the domicile requirements for a selected public high school and recommends alternative schools using GIS spatial analysis.

---

# PROJECT GOAL

Create a modern WebGIS platform that combines:

- GIS Visualization
- Spatial Analysis
- Decision Support System (DSS)
- Modern User Experience

The application must look like a real SaaS GIS product instead of a university assignment.

---

# DESIGN PRINCIPLE

DO NOT create:

- Government website
- Analytics dashboard
- Bootstrap admin template
- AI futuristic dashboard
- Cyberpunk UI
- KPI-heavy interface

Instead create:

- Map-first experience
- Apple Maps inspired
- Google Maps inspired
- ArcGIS Online inspired
- Mapbox inspired

The map is always the primary focus.

---

# APPLICATION LAYOUT

Desktop First

------------------------------------------------

Top Navigation

------------------------------------------------

Logo

Search School

Search Address

User Menu

------------------------------------------------

Main Content

------------------------------------------------

Large Interactive Map

Floating Controls

Floating Bottom Sheet

Floating Search

Floating Legend

------------------------------------------------

No permanent sidebar.

Only floating UI.

---

# MAP

The map occupies approximately 90% of the screen.

Display

- Public High School
- Administrative Boundary
- Roads
- Home Marker
- School Marker

The interface must remain clean.

---

# SCHOOL INTERACTION

When the user clicks a school:

- Zoom to school
- Highlight marker
- Display animated radius
- Open bottom sheet

Only ONE radius should exist at a time.

Previous radius fades out.

New radius expands smoothly.

---

# HOME LOCATION

User can:

- Click on the map
- Search address

A home marker appears.

Draw a straight line from home to school.

Display distance in meters.

---

# SPATIAL ANALYSIS

Use Turf.js

Functions

- turf.distance()
- turf.buffer()
- turf.booleanPointInPolygon()

Distance uses Straight Line Distance.

---

# ELIGIBILITY

IF

distance <= radius simulation

Display

Eligible

Green Badge

Otherwise

Not Eligible

Red Badge

---

# SMART RECOMMENDATION

If user is not eligible.

Automatically:

Calculate distance to every school.

Filter eligible schools.

Sort by nearest distance.

Display Top 3 Recommendations.

Each recommendation has

School Name

Distance

View Button

Selecting a recommendation changes the map focus.

---

# MAP ANIMATION

Smooth Pan

Smooth Zoom

Radius Expand Animation

Marker Bounce

Fade Transition

No excessive animation.

Everything should feel elegant.

---

# UI STYLE

Minimal

Premium

Modern

Clean

Large whitespace

Rounded Corner

Glassmorphism (light)

No glowing borders.

No futuristic UI.

---

# COLOR

Primary

#2563EB

Success

#22C55E

Danger

#EF4444

Warning

#FACC15

Background

#0F172A

Card

rgba(255,255,255,.08)

---

# TYPOGRAPHY

Inter

or

Plus Jakarta Sans

---

# TECH STACK

Frontend

React

TypeScript

Vite

TailwindCSS

Leaflet

Turf.js

React Query

Shadcn UI

Backend

Express.js

TypeScript

Prisma

PostgreSQL + PostGIS

Spatial Data

GeoJSON

QGIS

OpenStreetMap

---

# PROJECT STRUCTURE

frontend/

components/

pages/

layouts/

features/

map/

school/

recommendation/

analysis/

hooks/

services/

types/

utils/

backend/

controllers/

routes/

services/

middlewares/

database/

prisma/

docs/

qgis/

---

# QGIS WORKFLOW

OpenStreetMap

↓

Import to QGIS

↓

Administrative Boundary

↓

School Point

↓

Road Network

↓

Data Cleaning

↓

Join School Attribute

↓

Add Radius Simulation

↓

Export GeoJSON

↓

PostGIS

---

# USER FLOW

Open Website

↓

Search School

↓

Select School

↓

Radius Appears

↓

Choose Home

↓

Distance Calculation

↓

Eligibility Analysis

↓

Eligible?

YES

↓

Green Status

NO

↓

Alternative School Recommendation

↓

Click Recommendation

↓

Repeat Analysis

---

# DEVELOPMENT RULES

Always write reusable components.

Use clean architecture.

Use feature-based folder structure.

Never hardcode UI.

Separate business logic from UI.

Use responsive layout.

Avoid unnecessary libraries.

Use TypeScript strictly.

Write maintainable code.

Generate scalable project architecture suitable for production.

Whenever generating UI, always prioritize usability over visual effects.

---

# AMENDMENT (this build)

Per project owner decision during implementation: the permanent left sidebar
present in the initial Stitch-generated mockup was removed to comply with
the "No permanent sidebar. Only floating UI." rule above. See
`docs/UI_GUIDELINE.md` for the retained visual design tokens (color,
typography, spacing, elevation) from that mockup.
