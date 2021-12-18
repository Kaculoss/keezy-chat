import React, { memo, useEffect, useState } from "react";
import { sendTextMessage } from "../../Utilities/firebaseUtilsUpdated";

export const TextBox = memo(({ user, chatID, isParticipant }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      sendTextMessage(chatID, text, user.uid, user.photoURL, user.displayName);
      setText("");
    } else {
      setText("");
    }
  };

  useEffect(() => {
    if (!isParticipant) {
      setText("");
    }
  }, [isParticipant]);

  return (
    <>
      {isParticipant ? (
        <div className="textbox">
          <form className="textbox-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="say something nice"
              value={text || ""}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" disabled={!text}>
              send
            </button>
          </form>
        </div>
      ) : (
        <div className="textbox">
          <form className="textbox-form">
            <input
              type="text"
              value={text || ""}
              onChange={(e) => setText(e.target.value)}
              placeholder="you have been removed from this chat"
              disabled={!isParticipant}
            />
            <button type="submit" disabled={!isParticipant}>
              send
            </button>
          </form>
        </div>
      )}
    </>
  );
});
