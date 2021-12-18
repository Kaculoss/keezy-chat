import React, { useState } from "react";
import { useDataLayerValue } from "../../Utilities/OthersUtils";
import { ShowRequests } from "./ShowRequests";
import { Link } from "react-router-dom";
import { PromptModal } from "../../Modals/PromptModal";
import { AllChats } from "./AllChats";
import {
  creatSpaceChatroom,
  useGetUserSubCollections,
} from "../../Utilities/firebaseUtilsUpdated";

export const Chats = ({ currentUser }) => {
  const [state, setState] = useState({ modalOpen: false, text: "" });
  const [friends, setFriends] = useState([]);
  const [spaces, setSpaces] = useState([]);

  useGetUserSubCollections(currentUser.id, "friends").then((results) => {
    setFriends(results);
  });

  useGetUserSubCollections(currentUser.id, "spaces").then((results) => {
    setSpaces(results);
  });

  const [{ showRequests }, dispatch] = useDataLayerValue();

  const handleSpaceName = () => {
    if (state.text) {
      creatSpaceChatroom(currentUser, state.text).then(handleCancel());
    }
    handleCancel();
  };

  const handleCancel = () => {
    setState({ ...state, modalOpen: false, text: "" });
  };

  const handleViewRequests = () => {
    dispatch({ type: "SHOW_REQUESTS" });
  };

  const handleViewFriends = () => {
    dispatch({ type: "SHOW_FRIENDS" });
  };

  return (
    <>
      <div className="container-chats">
        <div className={`${showRequests ? "all-requests" : "chat-friends"}`}>
          {showRequests ? (
            <>
              <div className="chat-friends-header">
                <h3>Requests</h3>
                <button onClick={handleViewFriends}>view friends</button>
              </div>
              <ShowRequests currentUser={currentUser} />
            </>
          ) : (
            <>
              <div className="chat-friends-header">
                <h3>Friends</h3>
                <button onClick={handleViewRequests}>view all requests</button>
              </div>
              <AllChats
                chats={friends}
                category="friend"
                userID={currentUser.id}
              />
            </>
          )}
        </div>

        {!showRequests && (
          <div className="chat-spaces">
            <div className="chat-spaces-header">
              <h3>Spaces</h3>
              <button onClick={() => setState({ ...state, modalOpen: true })}>
                Create New Space
              </button>
              <Link to={`/chatpage/community-c`} className="link">
                Community Space
              </Link>
            </div>
            <AllChats chats={spaces} category="space" userID={currentUser.id} />
          </div>
        )}
        {state.modalOpen && (
          <PromptModal
            handleConfirm={handleSpaceName}
            handleCancel={handleCancel}
            stateText={state}
            setStateText={setState}
            title="Enter The New Space Name"
          />
        )}
      </div>
    </>
  );
};
