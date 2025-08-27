Website Monitoring Project

Welcome to my project! This is a full-stack web application with a Node.js backend and a React frontend designed to monitor website uptime and performance.
Table of Contents

Overview
Installation
Usage
Folder Structure
Contributing
License

Overview

This project includes a backend built with Node.js to monitor website uptime and performance metrics, and a React frontend to display the monitoring data in real-time. It aims to check website availability, response times, and alert users if issues are detected.
Installation

Clone the repository:git clone https://github.com/devinwildz/Monitoring-tool


Navigate to the project directory:cd Monitoring-tool


Install backend dependencies:cd Backend
npm install


Install frontend dependencies:cd ../Frontend
npm install


Set up environment variables (create .env files in backend and frontend with required variables, e.g., API keys or monitored website URLs).

Usage

Start the Backend server:cd Backend
npm start


Start the Frontend:cd ../Frontend
npm start


Open your browser and go to http://localhost:3000 (or the port your frontend uses) to view the monitoring dashboard.

Folder Structure

your-repo/
├── backend/
│   ├── src/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md

Contributing
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

