Finwise AI
Finwise AI is a full-stack personal finance management platform that helps users manage income, expenses, budgets, financial goals, and receive AI-powered financial insights.
The application is built using React.js for the frontend, Node.js and Express.js for the backend, MongoDB for database management, and Google Gemini API for AI-powered financial assistance.
Features
User Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing using bcrypt
Transaction Management
- Add income and expenses
- Track financial transactions
- Categorize transactions
- View transaction history
Financial Dashboard
- View total income
- View total expenses
- View financial summaries
- Monitor transactions
Budget Management
- Create and manage budgets
- Track spending
- Manage financial limits
Financial Goals
- Create financial goals
- Track goal progress
- Manage financial targets
AI Financial Assistant
- AI-powered financial insights
- Personalized financial suggestions
- Financial assistance using Google Gemini API
Technologies Used
Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router
Backend
- Node.js
- Express.js
- REST API
- JWT
- bcrypt
- dotenv
Database
- MongoDB
AI
- Google Gemini API
Development Tools
- Git
- GitHub
- Postman
- Thunder Client
- MongoDB
Project Structure
Fintech-AI/
|
|-- frontend/
|   |-- src/
|   |-- public/
|   |-- package.json
|   `-- ...
|
|-- backend/
|   |-- src/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- mongoClient.js
|   |   `-- server.js
|   |-- scripts/
|   |-- tests/
|   |-- package.json
|   `-- ...
|
|-- .gitignore
`-- README.md

Requirements
Before running the project, make sure the following are installed:
- Node.js
- npm
- MongoDB
- Git
Installation
Clone the repository:
git clone https://github.com/Kaushiki04Sharma/Fintech-AI.git

Move into the project directory:
cd Fintech-AI

Backend Setup
Move into the backend directory:
cd backend

Install backend dependencies:
npm install

Create a .env file inside the backend directory and add:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Do not upload the .env file or any secret keys to GitHub.
Start the Backend
Run the following command from the backend directory:
npm start

The backend uses:
node src/server.js

The backend server will run on:
http://localhost:5000

A successful backend startup should display:
Connected to MongoDB
Successfully connected to MongoDB!
Server running on port 5000

Frontend Setup
Open a new terminal and move into the frontend directory:
cd Fintech-AI/frontend

Install frontend dependencies:
npm install

If required, create a .env file inside the frontend directory and add:
VITE_API_URL=http://localhost:5000

Start the Frontend
Run:
npm run dev

The frontend will normally run on:
http://localhost:5173

Open the application in your browser:
http://localhost:5173

Running the Complete Project
The backend and frontend should be run in separate terminals.
Terminal 1 - Backend
cd Fintech-AI/backend
npm install
npm start

Backend:
http://localhost:5000

Terminal 2 - Frontend
cd Fintech-AI/frontend
npm install
npm run dev

Frontend:
http://localhost:5173

Open the application:
http://localhost:5173

Environment Variables
Backend
PORT
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY

Frontend
VITE_API_URL

Never upload real API keys, database passwords, JWT secrets, or .env files to GitHub.
API Server
The backend API server runs on:
http://localhost:5000

The backend provides REST APIs for authentication, transactions, budgets, financial goals, and other application functionality.
Database
The application uses MongoDB for storing application data.
For local development, MongoDB should be running before starting the backend.
The MongoDB connection string is configured using the MONGODB_URI environment variable.
Live Demo
The live demo will be added after deployment.
GitHub Repository
https://github.com/Kaushiki04Sharma/Fintech-AI
How to Stop the Application
To stop the frontend or backend server, press:
Ctrl + C

in the respective terminal.
Troubleshooting
Backend Does Not Start
Make sure you are inside the backend directory:
cd Fintech-AI/backend

Then run:
npm install
npm start

MongoDB Connection Error
Make sure MongoDB is running and that the MONGODB_URI value in the .env file is correct.
Frontend Does Not Start
Make sure you are inside the frontend directory:
cd Fintech-AI/frontend

Then run:
npm install
npm run dev

Backend and Frontend Cannot Communicate
Check that the frontend environment variable points to the correct backend URL:
VITE_API_URL=http://localhost:5000

Future Scope
- Advanced financial analytics
- AI-based expense prediction
- Automated budget recommendations
- Investment insights
- Financial report generation
- Notifications and reminders
- Improved AI-powered financial planning
- Mobile application
Project Purpose
Finwise AI was developed as a full-stack software project to demonstrate practical implementation of frontend development, backend development, database integration, authentication, REST APIs, and AI integration.
License
This project is developed for educational and demonstration purposes.
