import React, { createContext, useContext, useReducer } from "react";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoute = ({ isAuth }) => {
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export const initialState = {
  isSignedIn: false,
  isHome: false,
  isSignInPage: true,
  searchResults: [],
  searchItem: "",
  showResults: false,
  showRequests: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SIGN_OUT":
      return {
        ...state,
        isSignedIn: false,
        isHome: false,
        isSignInPage: true,
        searchResults: [],
        searchItem: "",
        showResults: false,
        showRequests: false,
      };

    case "IS_SIGN_IN_PAGE":
      return { ...state, isHome: false, isSignInPage: true };

    case "SIGN_IN":
      return { ...state, isSignedIn: true };

    case "IS_HOME":
      return { ...state, isHome: true, isSignInPage: false };

    case "SHOW_RESULTS":
      const { data, search } = action.payload;
      return {
        ...state,
        searchResults: data,
        showResults: true,
        searchItem: search,
      };

    case "CLEAR_RESULTS":
      return {
        ...state,
        showResults: false,
        searchItem: "",
        searchResults: [],
      };

    case "SHOW_REQUESTS":
      return { ...state, showRequests: true };

    case "SHOW_FRIENDS":
      return { ...state, showRequests: false };

    case "GO_BACK_HOME":
      return {
        ...state,
        isHome: true,
        isSignInPage: false,
      };

    default:
      return state;
  }
}

export const DataLayerContext = createContext();

export const DataLayer = ({ initialState, reducer, children }) => {
  return (
    <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </DataLayerContext.Provider>
  );
};

export const useDataLayerValue = () => {
  return useContext(DataLayerContext);
};

export const allDifferentButtonFunctions = {
  signInPageButtons: {
    sign_in_with_google:
      "allows a user to sign into the keezy app with a google acount",
    sign_out: "logs a user out of the keezy app",
    go_to_homepage:
      "takes a user to the homepage of the keezy app from sign in page",
  },
  homepageButtons: {
    chat: "opens the friend chatRoom",
    create_new_space:
      "creates a new space with only the current user in it as admin",
    community_space:
      "opens a space where all the users in the user list can chat",
    enter_space: "opens the space chatRoom",
    search: "query through the user collection and displays the results",
    send_request: "sends a request to different user",
    show_all_request:
      "query through the both the recSent and recRec field and displays results",
    accept:
      "add a new friend to the current user list as well as the other friends list",
    reject:
      "removes the friend from the recRec list as well as the recSent list of the other friend",
    clear_results: "clears the search results",
    delete_space: "deletes spaces (Admin Privilege Only)",
  },
  chatRoom: {
    send: "sends text",
    back_to_homepage: "sends the user back to the home page",
    add: "adds a friend to the space (Admin Privilege only)",
    remove: "removes a user from the space (Admin Privilege only)",
    rename: "renames the name of the space (Admin Privilege only)",
  },
};
