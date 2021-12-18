import React, { memo, useEffect } from "react";
import { useDataLayerValue } from "../../Utilities/OthersUtils";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";

export const Search = memo(({ user }) => {
  const [{ showResults }, dispatch] = useDataLayerValue();

  useEffect(() => {
    dispatch({ type: "IS_HOME" });
  }, [dispatch]);

  return (
    <>
      <div className="container-search">
        <SearchBar currentUserID={user.id} />
        {showResults && <SearchResults currentUser={user} />}
      </div>
    </>
  );
});
