import React from "react";
import { logout } from "../Utilities/firebaseUtilsUpdated";
import { useDataLayerValue } from "../Utilities/OthersUtils";

export const Header = () => {
  const [{ isSignedIn, isHome, isSignInPage }, dispatch] = useDataLayerValue();

  const handleLogout = async () => {
    try {
      await logout().then(() => {
        dispatch({ type: "SIGN_OUT" });
      });
    } catch {
      throw new Error("can not sign out");
    }
  };

  return (
    <>
      <header>
        <div className="container container-header">
          <div
            className={`title ${isSignInPage && "sign-in-title"} ${
              !isSignedIn && "first-page-title"
            }`}
          >
            {isHome ? (
              <h2 className="app-title h2-app-title">Keezy Chat</h2>
            ) : (
              <h1 className="app-title h1-app-title">Keezy Chat</h1>
            )}
          </div>

          {isHome && (
            <div className="page">
              <h3 className="home-title">Home</h3>
            </div>
          )}

          {isSignedIn && (
            <div className={`logout ${isSignInPage && "sign-in-logout"}`}>
              <button onClick={handleLogout} className="sign-out-button">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
