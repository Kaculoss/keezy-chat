import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  logout,
  useSpaceChatroomName,
} from "../../Utilities/firebaseUtilsUpdated";
import { useDataLayerValue } from "../../Utilities/OthersUtils";

export const NormalHeader = memo(({ userID, chatID }) => {
  const [{ isSignedIn }, dispatch] = useDataLayerValue();
  const [chatname, setChatname] = useState("");

  useSpaceChatroomName(chatID, userID).then((results) => setChatname(results));

  const handleLogout = async () => {
    try {
      await logout().then(() => {
        dispatch({ type: "SIGN_OUT" });
      });
    } catch {
      throw new Error("can not sign out");
    }
  };

  const handleBackToHome = () => {
    if (isSignedIn) {
      dispatch({ type: "GO_BACK_HOME" });
    }
  };

  return (
    <>
      <header className="chatpage-header">
        <div className="container-normalheader">
          <div className="normal-header-title">
            <p>Keezy Chat</p>
            <Link
              to={`/home/${userID}`}
              onClick={handleBackToHome}
              className="link"
            >
              Back Home
            </Link>
          </div>
          <div className="normal-header-chat-name">
            <h3>{chatname}</h3>
          </div>
          <div className="logout normal-header-logout">
            <button onClick={handleLogout} className="sign-out-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>
    </>
  );
});
