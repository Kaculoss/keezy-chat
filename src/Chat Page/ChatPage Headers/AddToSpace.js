import React, { memo, useEffect, useState } from "react";
import { CheckListModal } from "../../Modals/CheckListModal";
import {
  addSpaceParticipants,
  useSpaceParticipants,
} from "../../Utilities/firebaseUtilsUpdated";

export const AddToSpace = memo(({ chatname, friends, chatID }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showFriends, setShowFriends] = useState([]);
  const [participants, setParticipants] = useState([]);

  useSpaceParticipants(chatID).then((results) => {
    setParticipants(results);
  });

  useEffect(() => {
    if (participants) {
      if (friends.length !== 0) {
        let participantsID = [];
        for (let i = 0; i < friends.length; i++) {
          for (let j = 0; j < participants.length; j++) {
            if (friends[i].id === participants[j].id) {
              participantsID.push(friends[i].id);
            }
          }
        }
        const friendsToShow = friends.filter(
          (friend) => !participantsID.includes(friend.id)
        );
        setShowFriends(friendsToShow);
      } else {
        setShowFriends([]);
      }
    }
  }, [friends, participants]);

  const handleConfirm = (checkedList) => {
    if (checkedList) {
      addSpaceParticipants(chatID.split("-")[0], checkedList, chatname);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button className="add" onClick={() => setModalOpen(true)}>
        add friend
      </button>
      {modalOpen && (
        <CheckListModal
          title={`Select Who You Want To Add To "${chatname}" From Your Friends`}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          checkList={showFriends}
          confirmText="Add"
          emptyListText="you have no friends to be added in this space. please get some friends first."
        />
      )}
    </>
  );
});
