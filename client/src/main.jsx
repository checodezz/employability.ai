import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="dev-46ouvvvpqt7o5ovk.us.auth0.com"
        clientId="uC5YIL6246rHPbQzdYWZOP7GYB43e9dQ"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "this is a unique identifier", // Replace with your API Identifier
          scope: "openid profile email", // Standard scopes for user details
        }}
      >
        <App />
      </Auth0Provider>
    </Provider>
  </StrictMode>
);
