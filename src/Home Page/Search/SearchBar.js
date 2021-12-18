import React, { useState } from "react";
import { searchTestUsers } from "../../Utilities/firebaseUtilsUpdated";
import { useDataLayerValue } from "../../Utilities/OthersUtils";

export const SearchBar = ({ currentUserID }) => {
  const [searchItem, setSearchItem] = useState("");
  const [{ isSignedIn }, dispatch] = useDataLayerValue();

  const handleSubmit = (e) => {
    if (isSignedIn) {
      e.preventDefault();
      if (searchItem) {
        searchTestUsers(searchItem, currentUserID)
          .then((results) => {
            dispatch({
              type: "SHOW_RESULTS",
              payload: { data: results, search: searchItem },
            });
          })
          .then(setSearchItem(""));
      }
    }
  };

  return (
    <>
      <div className="search-bar">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="search for a friend here"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <button type="submit" disabled={!searchItem}>
            Search
          </button>
        </form>
      </div>
    </>
  );
};
