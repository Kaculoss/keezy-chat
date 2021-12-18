import React, { memo, useState } from "react";
import ReactScrollableFeed from "react-scrollable-feed";
import { useMessages } from "../../Utilities/firebaseUtilsUpdated";
import { DisplayChats } from "./DisplayChats";
import { TextBox } from "./TextBox";

export const Chatroom = memo(({ user, chatID }) => {
  const [isParticipant, setIsParticipant] = useState(true);
  const [chatroom, setChatroom] = useState([]);
  const chatCategory = chatID.split("-")[1];

  useMessages(chatID).then((results) => {
    if (results?.length !== 0) {
      setChatroom(results);
      setIsParticipant(true);
    } else {
      setIsParticipant(false);
    }
  });

  if (!user) {
    return false;
  }

  return (
    <>
      <div className="container-chatroom">
        <div className="chatroom-display-chats">
          <ReactScrollableFeed className="scrollable-feed">
            {isParticipant ? (
              chatroom?.map((message) => (
                <DisplayChats
                  key={message.msgID}
                  message={message}
                  user={user}
                  category={chatCategory}
                />
              ))
            ) : (
              <>
                <div className="no-more-div">
                  <p>You No Longer Have Access To This Chatroom</p>
                </div>
              </>
            )}
          </ReactScrollableFeed>
        </div>
        <div className="chatroom-textbox">
          <TextBox user={user} chatID={chatID} isParticipant={isParticipant} />
        </div>
      </div>
    </>
  );
});
