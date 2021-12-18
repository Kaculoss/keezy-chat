import React from "react";
import "./index.css";
import {
  DataLayer,
  initialState,
  ProtectedRoute,
  reducer,
} from "../Utilities/OthersUtils";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { SignInPage } from "../Sign In/SignInPage";
import Home from "../Home Page/Home";
import ChatPage from "../Chat Page/ChatPage";
import { useAuth } from "../Utilities/firebaseUtilsUpdated";

const Index = () => {
  const currentUser = useAuth();
  return (
    <>
      <DataLayer initialState={initialState} reducer={reducer}>
        <Router>
          <Routes>
            <Route path="/" exact element={<SignInPage />} />
            <Route
              path="/home/:id"
              element={<ProtectedRoute isAuth={currentUser} />}
            >
              <Route path="/home/:id" element={<Home />} />
            </Route>
            <Route
              path="/chatpage/:chatID"
              element={<ProtectedRoute isAuth={currentUser} />}
            >
              <Route path="/chatpage/:chatID" element={<ChatPage />} />
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </DataLayer>
    </>
  );
};

export function Error() {
  return <Navigate to={"/"} />;
}

export default Index;
