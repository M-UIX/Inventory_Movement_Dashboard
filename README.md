# Inventory Movement Dashboard Frontend

This React frontend is part of a full-stack inventory movement dashboard built for validating uploaded stock movement JSON files using SHA-256 verification and visualizing the parsed data.

## Project Overview

The application provides a simple, responsive UI for:
- uploading a JSON file
- computing a SHA-256 hash in the browser
- sending the file and hash to the Spring Boot backend for validation
- filtering movement data by date range, movement type, and warehouse
- viewing summary cards and movement visualizations
- browsing movement data in a paginated table

## Main Features

- File upload for stock movement JSON
- SHA-256 hash generation in the frontend
- Filter panel for date range, movement type, and warehouse
- Summary widgets for total, incoming, and outgoing quantities
- Visual placeholders for movement mix and daily trend
- Paginated movement table

## Tech Stack

- React
- Vite
- CSS for styling

## Folder Structure

- src/App.jsx - main dashboard UI
- src/App.css - dashboard layout and styling
- src/index.css - global theme and base styles
- public/ - static assets

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the local Vite URL shown in the terminal.

## Backend Integration

This frontend expects the Spring Boot backend to be running on the local server. The dashboard is designed to connect to the backend endpoints for:
- GET /api/movements
- POST /api/verify-file

## Notes

- The current UI uses a polished mock UI layout and sample movement data for presentation purposes.
- The backend should provide the real dataset once the JSON file is validated successfully.
- This README is intended to document the frontend portion of the project clearly for assessment/demo purposes.
