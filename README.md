# DustMeasuringDashboard

DustMeasuringDashboard is a web-based application designed to monitor and visualize dust particle concentrations in real-time, providing users with insights into air quality levels.

## Features

- **Real-Time Monitoring**: Continuously tracks dust particle concentrations.
- **Interactive Dashboard**: Visualizes data through dynamic charts and graphs.
- **Historical Data Analysis**: Allows users to review and analyze past air quality data.
- **Alerts and Notifications**: Notifies users when dust levels exceed predefined thresholds.

## Technologies Used

- **Frontend**: TypeScript, JavaScript, HTML
- **Backend**: *(Specify the backend technologies used, e.g., Node.js, Express.js)*
- **Data Visualization**: *(Specify any libraries or frameworks used for data visualization, e.g., D3.js, Chart.js)*
- **Database**: *(Specify the database used, e.g., MongoDB, PostgreSQL)*

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/JaySorawit/DustMeasuringDashboard.git
2. **Navigate to the Project Directory:**
   ```bash
   cd DustMeasuringDashboard
3. **Install Dependencies:**
  - Frontend:
  ```bash
    cd client
    npm install
  - Backend:
  ```bash
    cd server
    npm install```
4. **Configure Environment Variables: Create a .env file in the server directory and specify the necessary environment variables:**
env
```bash
   DB_HOST=your_database_host
   DB_PORT=your_database_port_number
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_DIALECT=your_database_dialect
   PORT=your_port_number```

5. **Run the Application:**
Backend:
```cd server
    npm start```
Frontend:
```
cd client
npm start
```
6. **Access the Dashboard: Open your browser and navigate to http://localhost:your_port_number to view the application.**

## Usage

Upon accessing the dashboard, users can:
- View Real-Time Data: Observe current dust particle concentrations.
- Analyze Historical Trends: Select date ranges to review past data.
- Set Alerts: Configure notifications for specific dust level thresholds.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository.**
2. **Create a New Branch:**
``` git checkout -b feature/YourFeatureName```
3. **Commit Your Changes:**
``` git commit -m 'Add some feature'```
4. **Push to the Branch:**
``git push origin feature/DustMeasuringDashboard```
5. **Open a Pull Request.**
