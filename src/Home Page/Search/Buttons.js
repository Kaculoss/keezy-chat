import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmModal } from "../../Modals/ConfirmModal";
import {
  acceptTestUserReq,
  rejectTestUserReq,
  sendTestUserReq,
} from "../../Utilities/firebaseUtilsUpdated";

export const Buttons = ({
  user,
  searchedResult,
  friendIDs,
  friends,
  reqRecIDs,
  reqSentIDs,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleReject = () => {
    rejectTestUserReq(user.id, searchedResult).then(() => {
      setModalOpen(false);
    });
  };

  const handleConfirm = () => {
    acceptTestUserReq(user, searchedResult).then(() => {
      setModalOpen(false);
    });
  };

  const handleSendRequest = (user, searchedResult) => {
    sendTestUserReq(user, searchedResult);
  };

  if (friendIDs?.includes(searchedResult.id)) {
    if (friends.length !== 0) {
      const myFriend = friends?.filter(
        (friend) => friend.id === searchedResult.id
      );
      if (myFriend.length !== 0) {
        const { chatID } = myFriend[0];
        return (
          <Link to={`/chatpage/${chatID}-f`} className="link">
            chat
          </Link>
        );
      }
    }
  }

  if (reqSentIDs.includes(searchedResult.id)) {
    return (
      <div className="pending">
        <p>request sent</p>
      </div>
    );
  }

  if (reqRecIDs.includes(searchedResult.id)) {
    return (
      <>
        <button
          className="respond-to-request"
          onClick={() => setModalOpen(true)}
        >
          respond
        </button>
        {modalOpen && (
          <ConfirmModal
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            handleReject={handleReject}
            confirmText="accept"
            rejectText="reject"
            title={`Response To "${searchedResult.name}" Friend Request`}
          />
        )}
      </>
    );
  }

  return (
    <button onClick={() => handleSendRequest(user, searchedResult)}>
      send request
    </button>
  );
};
