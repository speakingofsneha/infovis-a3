# Atmos - Indoor Environmental Quality Dashboard

An elegant interactive analytics dashboard for monitoring indoor environmental quality, built with Astro, React, and React-Plotly. Atmos helps building managers create more equitable and comfortable indoor environments by visualizing temperature, air quality, and comfort metrics across spaces and time periods.

## Features

- **Interactive Dashboard**: Real-time filtering by time range, floor, and zone
- **Advanced Visualizations**: Heatmaps, box plots, trend analysis, and comfort metrics
- **Performance Optimized**: Built with Astro for fast loading and React for interactivity

## Tech Stack

- **Framework**: Astro with React integration
- **Styling**: SCSS with modular component architecture
- **Charts**: React-Plotly for interactive data visualizations
- **Data Processing**: Python pandas scripts

## Installation
All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |

## Project Structure
```
/ App demo
├── src/               
│   ├── components/          # React components for charts and UI
│   │   ├── co2history.jsx      # CO₂ history chart
│   │   ├── co2trends.jsx       # CO₂ trends over time
│   │   ├── uncomfylb.jsx       # Uncomfortable leaderboard table
│   │   ├── AdvancedFilters.jsx # Advanced filter controls
│   │   └── …                   # Other reusable components
│   ├── layouts/             # Astro layout components
│   │   └── sidebar.astro       # Sidebar navigation layout
│   ├── pages/                  # Astro pages (routes)
│   │   ├── index.astro         # Landing page
│   │   ├── analytics.astro     # Analytics dashboard
│   │   ├── alerts.astro        # Alerts page
│   │   └── devlog.astro        # Development log
│   ├── styles/             # SCSS stylesheets
│   │   ├── about.scss          # About/landing page styling
│   │   ├── base.scss           # Global base styles
│   │   ├── devlog.scss         # Dev log styles
│   │   ├── index.scss          # Main index/landing styling
│   │   └── …                   # Other SCSS files
├── public/                 # Static assets and data
│   ├── assets/                 # Images used in the UI
│   │   ├── feature1.png
│   │   └── …   
│   └── favicon.png             # Site favicon
├── data/                   # CSV and other data files for visualizations
└── README.md  
/ Data cleaning   # Script filed used to clean data for charts
```   

## Acknowledgments
This project was created for DECO3100 at the University of Sydney.
- **Tom Parkinson, IEQ Lab at the University of Sydney** - Data collection and IEQ Lab research. The dataset includes temperature, humidity, CO₂, and comfort metrics collected across multiple building zones.
- **Kazjon Grace** - Course instruction and guidance
- **Perplexity, Google AI studio and Chat GPT** - Writing scripts for data cleaning, debugging, writing boilderplate code & moral support. 

