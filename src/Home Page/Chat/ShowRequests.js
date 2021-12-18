import React, { useState } from "react";
import { ConfirmModal } from "../../Modals/ConfirmModal";
import {
  acceptTestUserReq,
  useGetUserSubCollections,
  rejectTestUserReq,
} from "../../Utilities/firebaseUtilsUpdated";

export const ShowRequests = ({ currentUser }) => {
  const [state, setState] = useState({ request: [], modalOpen: false });
  const [reqSent, setReqSent] = useState([]);
  const [reqRec, setReqRec] = useState([]);

  useGetUserSubCollections(currentUser.id, "reqSent").then((results) => {
    setReqSent(results);
  });

  useGetUserSubCollections(currentUser.id, "reqReceived").then((results) => {
    setReqRec(results);
  });

  const handleResponse = (request) => {
    setState({ request, modalOpen: true });
  };

  const handleCancel = () => {
    setState({ ...state, modalOpen: false, request: [] });
  };

  const handleReject = () => {
    if (state.request) {
      rejectTestUserReq(currentUser.id, state.request).then(() => {
        handleCancel();
      });
    }
  };

  const handleConfirm = () => {
    if (state.request) {
      acceptTestUserReq(currentUser, state.request).then(() => {
        handleCancel();
      });
    }
  };

  let recCount = 0;
  let sentCount = 0;
  return (
    <>
      <div className="show-requests">
        <div className="show-requests-rec">
          <h4>Recieved Requests</h4>
          <div className="scroll-radius scroll-radius-requests">
            <div className="show-all-requests show-requests-allrec">
              {reqRec &&
                reqRec.map((request) => {
                  const { id, name, photoURL } = request;
                  const shade = recCount % 2 !== 0 ? "no-shade" : "shade";
                  recCount += 1;
                  return (
                    <div className={`request ${shade}`} key={id}>
                      <div className="name-pic-div">
                        <img src={photoURL} alt="friend-face" />
                        <p>{name}</p>
                      </div>
                      <button
                        className="respond-to-request"
                        onClick={() => handleResponse(request)}
                      >
                        respond
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="show-requests-sent">
          <h4>Sent Requests</h4>
          <div className="scroll-radius scroll-radius-requests">
            <div className="show-all-requests show-requests-allsent">
              {reqSent &&
                reqSent.map((request) => {
                  const { id, name, photoURL } = request;
                  const shade = sentCount % 2 !== 0 ? "no-shade" : "shade";
                  sentCount += 1;
                  return (
                    <div className={`request ${shade}`} key={id}>
                      <div className="name-pic-div">
                        <img src={photoURL} alt="friend-face" />
                        <p>{name}</p>
                      </div>
                      <div className="pending">
                        <p>pending...</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {state.modalOpen && (
        <ConfirmModal
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          handleReject={handleReject}
          confirmText="accept"
          rejectText="reject"
          title={`Response To "${state.request?.name}" Friend Request`}
        />
      )}
    </>
  );
};
