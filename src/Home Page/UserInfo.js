import React, { useState } from "react";
import { useGetIDs } from "../Utilities/firebaseUtilsUpdated";

export const UserInfo = ({ currentUser }) => {
  const [friends, setFriends] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [reqReceived, setReqReceived] = useState([]);
  const [reqSent, setReqSent] = useState([]);

  useGetIDs(currentUser.id, "friends").then((results) => {
    setFriends(results);
  });

  useGetIDs(currentUser.id, "spaces").then((results) => {
    setSpaces(results);
  });

  useGetIDs(currentUser.id, "reqReceived").then((results) => {
    setReqReceived(results);
  });

  useGetIDs(currentUser.id, "reqSent").then((results) => {
    setReqSent(results);
  });

  return (
    <>
      <div className="user-info">
        <div className="user-info-sec-1">
          <div className="user-info-image">
            <img src={currentUser.photoURL} alt="my face" />
          </div>
          <div className="user-info-name">
            <p>{currentUser.name}</p>
          </div>
        </div>

        <div className="user-info-sec-2">
          <div className="user-info-friends">
            <p>
              <span>{friends?.length}</span> friends
            </p>
          </div>
          <div className="user-info-spaces">
            <p>
              <span>{spaces?.length}</span> spaces
            </p>
          </div>
        </div>

        <div className="user-info-sec-3">
          <div className="user-info-reqRec">
            <p>
              <span>{reqReceived?.length}</span> request(s) received
            </p>
          </div>
          <div className="user-info-reqSent">
            <p>
              <span>{reqSent?.length}</span> request(s) sent
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
