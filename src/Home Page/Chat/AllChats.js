import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmModal } from "../../Modals/ConfirmModal";
import {
  deleteEntireSpace,
  getSpaceParticipantIDs,
  removeSpaceParticipant,
} from "../../Utilities/firebaseUtilsUpdated";

export const AllChats = memo(({ chats, category, userID }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen_exit, setModalOpen_exit] = useState(false);
  const [state, setState] = useState({ chatID: "", name: "" });

  const handleDeleteBtn = (chatID, name) => {
    setState({ chatID, name });
    setModalOpen(true);
  };

  const handleDeleteSpace = async () => {
    if (state.chatID) {
      getSpaceParticipantIDs(state.chatID)
        .then((results) => {
          deleteEntireSpace(results, state.chatID);
        })
        .then(handleCancel());
    }
    handleCancel();
  };

  const handleExitBtn = (chatID, name) => {
    setState({ chatID, name });
    setModalOpen_exit(true);
  };

  const handleExitSpace = async () => {
    if (state.chatID) {
      removeSpaceParticipant([userID], state.chatID).then(handleCancel());
    }
    handleCancel();
  };

  const handleCancel = () => {
    setModalOpen(false);
    setModalOpen_exit(false);
    setState({ chatID: "", name: "" });
  };

  let count = 0;
  return (
    <>
      <div className={`scroll-radius scroll-radius-${category}`}>
        <div className={`allchats allchats-${category}`}>
          {chats &&
            chats?.map((chat) => {
              const { name, chatID, isAdmin, photoURL, id } = chat;
              const shade = count % 2 !== 0 ? "no-shade" : "shade";
              count += 1;
              return (
                <div key={id} className={`chat ${shade} chat-${category}`}>
                  {category === "space" ? (
                    <p>{name}</p>
                  ) : (
                    <div className="name-pic-div">
                      <img src={photoURL} alt="friend-face" />
                      <p>{name}</p>
                    </div>
                  )}
                  {category === "space" && isAdmin ? (
                    <div className="chat-admin-space">
                      <button
                        className="delete-space-btn"
                        onClick={() => handleDeleteBtn(id, name)}
                      >
                        delete space
                      </button>
                      <Link to={`/chatpage/${id}-s`} className="link">
                        enter space
                      </Link>
                    </div>
                  ) : (
                    <>
                      {category === "space" ? (
                        <div className="chat-admin-space exit-space">
                          <button
                            className="exit-space-btn"
                            onClick={() => handleExitBtn(id, name)}
                          >
                            exit space
                          </button>
                          <Link to={`/chatpage/${id}-s`} className="link">
                            enter space
                          </Link>
                        </div>
                      ) : (
                        <Link to={`/chatpage/${chatID}-f`} className="link">
                          chat
                        </Link>
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      {modalOpen && (
        <ConfirmModal
          handleConfirm={handleDeleteSpace}
          handleCancel={handleCancel}
          title={`Are You Sure You Want To Delete "${state.name}" Space?`}
        />
      )}
      {modalOpen_exit && (
        <ConfirmModal
          handleConfirm={handleExitSpace}
          handleCancel={handleCancel}
          title={`Are You Sure You Want To Leave "${state.name}" Space?`}
        />
      )}
    </>
  );
});
