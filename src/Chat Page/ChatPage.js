import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUserSpaceAdmin, useAuth } from "../Utilities/firebaseUtilsUpdated";
import { NormalHeader } from "./ChatPage Headers/NormalHeader";
import { SpaceAdminHeader } from "./ChatPage Headers/SpaceAdminHeader";
import { Chatroom } from "./Chatroom/Chatroom";

const ChatPage = () => {
  const { chatID } = useParams();
  const currentUser = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const split_chatID = chatID.split("-");

      if (split_chatID[1] === "s") {
        getUserSpaceAdmin(currentUser?.uid, split_chatID[0]).then((result) => {
          if (result) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        });
      }
    }
  }, [currentUser, chatID]);

  return (
    <>
      {currentUser && (
        <>
          {isAdmin ? (
            <SpaceAdminHeader userID={currentUser?.uid} chatID={chatID} />
          ) : (
            <NormalHeader chatID={chatID} userID={currentUser?.uid} />
          )}
          <Chatroom user={currentUser} chatID={chatID} />
        </>
      )}
    </>
  );
};

export default ChatPage;
