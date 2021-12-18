import React, { useEffect, useState } from "react";
import { CheckListModal } from "../../Modals/CheckListModal";
import {
  removeSpaceParticipant,
  useSpaceParticipants,
} from "../../Utilities/firebaseUtilsUpdated";

export const RemoveFromSpace = ({ chatname, chatID, userID }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showFriends, setShowFriends] = useState([]);
  const [participants, setParticipants] = useState([]);
  useSpaceParticipants(chatID).then((results) => {
    setParticipants(results);
  });

  useEffect(() => {
    if (participants) {
      const participantsToShow = participants.filter(
        (participant) => participant.id !== userID
      );
      setShowFriends(participantsToShow);
    } else {
      setShowFriends([]);
    }
  }, [participants, userID]);

  const handleConfirm = (checkedList) => {
    if (checkedList) {
      const participantIDs = checkedList.map((item) => item.id);
      removeSpaceParticipant(participantIDs, chatID.split("-")[0]);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button className="remove" onClick={() => setModalOpen(true)}>
        remove friend
      </button>
      {modalOpen && (
        <CheckListModal
          title={`Select Who You Want To Remove From "${chatname}"`}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          checkList={showFriends}
          confirmText="Remove"
          emptyListText="no other participants to be removed"
        />
      )}
    </>
  );
};
