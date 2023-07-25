# React Dashboards App

This React application interacts with the Express server to fetch data and analytics from the HubSpot API. The application is designed to display analytics and visualizations based on the data received from the server. It provides a user-friendly interface for users to view and interact with the data.

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repo.git
2. Navigate to the project repo : `cd hubspot_dashboard`
3. Install the dependencies using npm : `npm install`
4. Create a `.env` file containing :
   ```bash
   REACT_APP_PROXY_BASE_URL=YOUR_URL_TO_SERVER
   REACT_APP_BASIC_PASSWORD=AN_USER_PASSWORD
   REACT_APP_BASIC_ID=AN_USER_LOGIN
   REACT_APP_ACTIVITY_DASHBOARD_URL=IFRAME_URL_TO_EXTERN_DASHBOARD
   REACT_APP_CAMPAIGNS_DASHBOARD_URL=IFRAME_URL_TO_EXTERN_DASHBOARD
The password and login will be use to give the access to the dashboards. Url to extern dashboard are not needed if you dont need them.
5. Start the development server : `npm start`

## Dependencies

This React application uses the following main dependencies:
- Typescript : A strongly typed programming language that builds on JavaScript
- React - A JavaScript library for building user interfaces.
- axios - A popular HTTP client for making API requests.
- styled-components - A CSS-in-JS library for styling React components.
- recharts - A popular React library used to build charts
- react-router-dom - A library for handling routing in a React application.

## API Interaction

The React application interacts with the Express server to retrieve data and analytics from the HubSpot API. The server endpoints are defined in the Express server README.md file. The application makes HTTP requests to the server using axios.

## Note

- Ensure that the associated server is running when running the app
