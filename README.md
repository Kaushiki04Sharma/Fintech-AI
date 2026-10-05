💰 Finwise AI

Finwise AI is a full-stack personal finance management platform that helps users manage income, expenses, budgets, and financial goals, while receiving AI-powered financial insights.

Built with React.js, Node.js, Express.js, MongoDB, and the Google Gemini API.

🔗 GitHub Repository: Kaushiki04Sharma/Fintech-AI 🌐 Live Demo: Coming soon after deployment

📑 Table of Contents
Features
Tech Stack
Project Structure
Requirements
Installation & Setup
Running the Complete Project
Environment Variables
API & Database
Troubleshooting
Future Scope
Project Purpose
License
✨ Features
🔐 User Authentication
User registration and login
JWT-based authentication
Protected routes
Secure password hashing using bcrypt
💳 Transaction Management
Add income and expenses
Track financial transactions
Categorize transactions
View transaction history
📊 Financial Dashboard
View total income
View total expenses
View financial summaries
Monitor transactions
🧾 Budget Management
Create and manage budgets
Track spending
Manage financial limits
🎯 Financial Goals
Create financial goals
Track goal progress
Manage financial targets
🤖 AI Financial Assistant
AI-powered financial insights
Personalized financial suggestions
Financial assistance using the Google Gemini API
🛠 Tech Stack
Layer	Technologies
Frontend	React.js, Vite, JavaScript, Tailwind CSS, Axios, React Router
Backend	Node.js, Express.js, REST API, JWT, bcrypt, dotenv
Database	MongoDB
AI	Google Gemini API
Dev Tools	Git, GitHub, Postman, Thunder Client, MongoDB
📁 Project Structure
Fintech-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── mongoClient.js
│   │   └── server.js
│   ├── scripts/
│   ├── tests/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
✅ Requirements

Make sure the following are installed before running the project:

Node.js
npm
MongoDB
Git
🚀 Installation & Setup
1. Clone the repository
bash
git clone https://github.com/Kaushiki04Sharma/Fintech-AI.git
cd Fintech-AI
2. Backend setup
bash
cd backend
npm install

Create a .env file inside the backend directory:

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

⚠️ Never upload the .env file or any secret keys to GitHub.

Start the backend (runs node src/server.js):

bash
npm start

The server runs at http://localhost:5000. A successful startup shows:

Connected to MongoDB
Successfully connected to MongoDB!
Server running on port 5000
3. Frontend setup

Open a new terminal:

bash
cd Fintech-AI/frontend
npm install

If required, create a .env file inside the frontend directory:

env
VITE_API_URL=http://localhost:5000

Start the frontend:

bash
npm run dev

The app runs at http://localhost:5173.

▶️ Running the Complete Project

Run the backend and frontend in separate terminals.

Terminal 1 – Backend

bash
cd Fintech-AI/backend
npm install
npm start

→ Backend: http://localhost:5000

Terminal 2 – Frontend

bash
cd Fintech-AI/frontend
npm install
npm run dev

→ Frontend: http://localhost:5173

Then open http://localhost:5173 in your browser.

To stop either server, press Ctrl + C in its terminal.

🔑 Environment Variables
Location	Variable	Description
Backend	PORT	Port the server runs on
Backend	MONGODB_URI	MongoDB connection string
Backend	JWT_SECRET	Secret used to sign JWT tokens
Backend	GEMINI_API_KEY	Google Gemini API key
Frontend	VITE_API_URL	Backend API base URL

🔒 Never upload real API keys, database passwords, JWT secrets, or .env files to GitHub.

🌐 API & Database

API Server: http://localhost:5000

The backend provides REST APIs for authentication, transactions, budgets, financial goals, and other application functionality.

Database: MongoDB stores all application data. For local development, make sure MongoDB is running before starting the backend. The connection string is set via the MONGODB_URI environment variable.

🧰 Troubleshooting
<details> <summary><b>Backend does not start</b></summary>

Make sure you are inside the backend directory, then reinstall and start:

bash
cd Fintech-AI/backend
npm install
npm start
</details> <details> <summary><b>MongoDB connection error</b></summary>

Make sure MongoDB is running and that the MONGODB_URI value in your .env file is correct.

</details> <details> <summary><b>Frontend does not start</b></summary>

Make sure you are inside the frontend directory, then reinstall and start:

bash
cd Fintech-AI/frontend
npm install
npm run dev
</details> <details> <summary><b>Backend and frontend cannot communicate</b></summary>

Check that the frontend .env points to the correct backend URL:

env
VITE_API_URL=http://localhost:5000
</details>
🔮 Future Scope
Advanced financial analytics
AI-based expense prediction
Automated budget recommendations
Investment insights
Financial report generation
Notifications and reminders
Improved AI-powered financial planning
Mobile application
🎓 Project Purpose

Finwise AI was developed as a full-stack software project to demonstrate practical implementation of frontend development, backend development, database integration, authentication, REST APIs, and AI integration.

📄 License

This project is developed for educational and demonstration purposes.
