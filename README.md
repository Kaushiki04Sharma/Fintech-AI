# Finwise AI

Finwise AI is a full-stack personal finance management platform that helps users manage their income, expenses, budgets, financial goals, and receive AI-powered financial insights.

The project is built using React.js for the frontend, Node.js and Express.js for the backend, and MongoDB for database management.

## Features

### User Authentication

- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing using bcrypt

### Transaction Management

- Add income and expenses
- Track financial transactions
- Categorize transactions
- View transaction history

### Financial Dashboard

- View total income
- View total expenses
- View financial summaries
- Monitor transactions

### Budget Management

- Create budgets
- Track spending
- Manage financial limits

### Financial Goals

- Create financial goals
- Track goal progress
- Manage financial targets

### AI Financial Assistant

- AI-powered financial insights
- Personalized financial suggestions
- Financial assistance using Google Gemini API

## Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcrypt
- dotenv

### Database

- MongoDB

### AI

- Google Gemini API

### Tools

- Git
- GitHub
- Postman
- Thunder Client

## Project Structure

```text
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

## Running the Project
The backend and frontend should be run in separate terminals.

#Backend
Open the first terminal and run:
-cd Fintech-AI/backend
-npm install
-npm start
The backend starts using:
-node src/server.js
Backend server:
http://localhost:5000

#Frontend
Open a second terminal and run:
-cd Fintech-AI/frontend
-npm install
-npm run dev
Frontend application:
http://localhost:5173
Open http://localhost:5173 in your browser.

## API Server
The backend API server runs at:
http://localhost:5000
The backend provides REST APIs for:
•	User authentication
•	User registration and login
•	Transaction management
•	Income and expense management
•	Budget management
•	Financial goals
•	AI-powered financial insights
The frontend communicates with the backend using the configured:
VITE_API_URL=http://localhost:5000


## Future Scope
- Advanced financial analytics
- AI-based expense prediction
- Automated budget recommendations
- Investment insights
- Financial report generation
- Notifications and reminders
- Improved AI-powered financial planning
- Mobile application

## Project Purpose
Finwise AI was developed as a full-stack software project to demonstrate practical implementation of frontend development, backend development,
database integration, authentication, REST APIs, and AI integration.

## License
This project is developed for educational and demonstration purposes.
