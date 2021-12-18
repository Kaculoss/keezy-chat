import React, { useState } from "react";
import { PromptModal } from "../../Modals/PromptModal";
import { useDataLayerValue } from "../../Utilities/OthersUtils";
import { AddToSpace } from "./AddToSpace";
import { RemoveFromSpace } from "./RemoveFromSpace";
import { Link } from "react-router-dom";
import {
  getSpaceParticipantIDs,
  logout,
  updateSpaceName,
  useGetUserSubCollections,
  useSpaceChatroomName,
} from "../../Utilities/firebaseUtilsUpdated";

export const SpaceAdminHeader = ({ userID, chatID }) => {
  const [adminUtils, setAdminUtils] = useState({
    modalOpen: false,
    text: "",
  });
  const [{ isSignedIn }, dispatch] = useDataLayerValue();
  const split_chatID = chatID.split("-");
  const [chatname, setChatname] = useState("");
  const [friends, setFriends] = useState([]);

  useSpaceChatroomName(chatID, userID).then((results) => setChatname(results));

  useGetUserSubCollections(userID, "friends").then((results) =>
    setFriends(results)
  );

  const handleRenameSpace = () => {
    if (adminUtils.text) {
      getSpaceParticipantIDs(split_chatID[0])
        .then((results) => {
          updateSpaceName(split_chatID[0], adminUtils.text, results);
        })
        .then(handleCancel());
    }
    handleCancel();
  };

  const handleCancel = () => {
    setAdminUtils({ ...adminUtils, modalOpen: false, text: "" });
  };

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
        <div className="container-adminheader">
          <div className="admin-header-title">
            <p>Keezy Chat</p>
            <Link
              to={`/home/${userID}`}
              onClick={handleBackToHome}
              className="link"
            >
              Back Home
            </Link>
          </div>
          <div className="admin-header-chat-name">
            <h4>{chatname}</h4>
            <div className="admin-header-btns">
              <button
                className="rename"
                onClick={() => {
                  setAdminUtils({ ...adminUtils, modalOpen: true });
                }}
              >
                rename space
              </button>
              <AddToSpace
                chatname={chatname}
                friends={friends}
                chatID={chatID}
              />
              <RemoveFromSpace
                chatname={chatname}
                chatID={chatID}
                userID={userID}
              />
            </div>
          </div>
          <div className="logout admin-header-logout">
            <button onClick={handleLogout} className="sign-out-button">
              Sign Out
            </button>
          </div>
        </div>
        {adminUtils.modalOpen && (
          <PromptModal
            handleConfirm={handleRenameSpace}
            handleCancel={handleCancel}
            stateText={adminUtils}
            setStateText={setAdminUtils}
            title="Change Space Name"
          />
        )}
      </header>
    </>
  );
};
