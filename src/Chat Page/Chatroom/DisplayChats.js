import React, { memo } from "react";

export const DisplayChats = memo(({ message, user, category }) => {
  const { text, id, photoURL, timestamp, name } = message;

  const messageClass = id === user.uid ? "sent-message" : "received-message";

  const fullTime = timestamp?.toDate().toString().split(" (")[0].split(" G")[0];
  const time = fullTime?.split(" ")[4].split(":").slice(0, 2).join(":");
  const date = fullTime?.split(time)[0].split(" ").slice(0, 3).join(" ");
  const dateTime = `${time} ${date}`;

  return (
    <>
      <div className={`display-chat ${messageClass}`}>
        <img
          src={
            photoURL ||
            "https://lh3.googleusercontent.com/a/AATXAJxiaKdc2jxrKQcRluarByEK2wRhTLCwswVADfEb=s96-c"
          }
          alt="face"
        />
        <div className="text-div">
          {category !== "f" && name && <p className="text-name">{name}</p>}
          <p className="main-text">{text}</p>
          <p className="date-time-text">
            {typeof date !== "undefined" && typeof time !== "undefined"
              ? dateTime
              : ""}
          </p>
        </div>
      </div>
    </>
  );
});
