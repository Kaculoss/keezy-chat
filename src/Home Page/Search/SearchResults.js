import React, { useState } from "react";
import {
  useGetIDs,
  useGetUserSubCollections,
} from "../../Utilities/firebaseUtilsUpdated";
import { useDataLayerValue } from "../../Utilities/OthersUtils";
import { Buttons } from "./Buttons";

export const SearchResults = ({ currentUser }) => {
  const [{ searchResults, searchItem }, dispatch] = useDataLayerValue();
  const handleClearResults = () => {
    dispatch({ type: "CLEAR_RESULTS" });
  };
  const [friends, setFriends] = useState([]);
  const [friendIDs, setFriendIDs] = useState([]);
  const [reqRecIDs, setReqRecIDs] = useState([]);
  const [reqSentIDs, setReqSentIDs] = useState([]);

  useGetIDs(currentUser.id, "friends").then((results) => {
    setFriendIDs(results);
  });

  useGetUserSubCollections(currentUser.id, "friends").then((results) => {
    setFriends(results);
  });

  useGetIDs(currentUser.id, "reqReceived").then((results) => {
    setReqRecIDs(results);
  });

  useGetIDs(currentUser.id, "reqSent").then((results) => {
    setReqSentIDs(results);
  });

  let count = 0;
  return (
    <>
      {currentUser && (
        <div className="search-results">
          <div className="search-results-main-div">
            <div className="scroll-radius scroll-radius-search-results">
              <div className="all-results">
                {searchResults.length !== 0 ? (
                  searchResults.map((result) => {
                    const { id, name, photoURL } = result;
                    const shade = count % 2 !== 0 ? "no-shade" : "shade";
                    count += 1;
                    return (
                      <div key={id} className={`result ${shade}`}>
                        <div className="name-pic-div">
                          <img src={photoURL} alt="friend-face" />
                          <p>{name}</p>
                        </div>
                        <Buttons
                          user={currentUser}
                          searchedResult={result}
                          friendIDs={friendIDs}
                          friends={friends}
                          reqRecIDs={reqRecIDs}
                          reqSentIDs={reqSentIDs}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="no-results">
                    <p>"{searchItem}" not found</p>
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleClearResults} className="clear-results-btn">
              clear results
            </button>
          </div>
        </div>
      )}
    </>
  );
};
