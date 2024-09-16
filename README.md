Inventory Management System
Overview
The Inventory Management System is a full-stack application designed to manage product inventories. It includes a backend built with NestJS and a frontend developed with Next.js. This README provides information on setting up, running, and deploying the application.

Table of Contents
Features
Technology Stack
Installation
Configuration
Running the Application
Testing
Deployment
Contributing
License
Features
Product Management: View and manage a list of products.
Order Management: Create and manage orders.
User Management: Handle user creation and authentication.
Responsive Design: Access the application on various devices with a responsive UI.
Technology Stack
Frontend:

Next.js: React framework for server-rendered applications.
TypeScript: Typed superset of JavaScript.
Axios: HTTP client for making requests.
Jest: Testing framework for React components.
axios-mock-adapter: Mock adapter for axios.
Backend:

NestJS: Framework for building efficient and scalable server-side applications.
TypeORM: ORM for working with databases.
PostgreSQL: Database system used for storing application data.
Installation
Prerequisites
Node.js (>=14.x)
PostgreSQL
npm (or yarn)
Backend Setup
Clone the repository:

  bash
  Copy code
  git clone <repository-url>
  
cd backend
Install dependencies:

  bash
  Copy code
  npm install
  
Configure the environment variables. Create a .env file in the root of the backend directory and add the following:

env
Copy code
DB_HOST=railway-postgres-host
DB_PORT=5432
DB_USERNAME=railway-username
DB_PASSWORD='railway-password'
DB_DATABASE=railway-database
Run migrations:

  bash
  Copy code
  npm run migration:run
  
Start the backend server:

  bash
  Copy code
  npm run start
  
Frontend Setup
Navigate to the frontend directory:

  bash
  Copy code
  cd frontend
  
Install dependencies:

  bash
  Copy code
  npm install
  
Start the frontend development server:

  bash
  Copy code
  npm run dev
  
Configuration
Frontend Configuration: Ensure that the frontend is configured to communicate with the backend API endpoints. Update the API base URL if necessary.
Backend Configuration: The backend configuration can be adjusted via environment variables in the .env file.
Running the Application
To run the application, ensure both the frontend and backend servers are running. You can access the frontend at http://localhost:3000.

Testing
Backend Testing
Run backend tests using:

  bash
  Copy code
  npm run test
  
Frontend Testing
Run frontend tests using:

  bash
  Copy code
  npm run test
  
Deployment
Backend Deployment
Deploy the backend to your preferred hosting provider (e.g., Render, Railway). Ensure that environment variables are correctly configured in the production environment.

Frontend Deployment
Deploy the frontend to Vercel or another hosting provider. Make sure to configure any necessary environment variables and ensure that it connects to the correct backend API.

Contributing
Contributions are welcome! Please follow the standard GitHub workflow for issues and pull requests. Ensure your code adheres to the project's coding standards and includes relevant tests.
