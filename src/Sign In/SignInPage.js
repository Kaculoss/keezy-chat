import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../Keezy Chat App/Header";
import { db, googleSignIn, useAuth } from "../Utilities/firebaseUtilsUpdated";
import { useDataLayerValue } from "../Utilities/OthersUtils";
import { doc, onSnapshot } from "@firebase/firestore";

export const SignInPage = () => {
  const currentUser = useAuth();
  const [{ isSignInPage }, dispatch] = useDataLayerValue();
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState("no");
  const [user, setUser] = useState([]);

  const handleSignIn = async () => {
    googleSignIn().catch((error) => {
      setClicked("no");
      return error.message;
    });
  };

  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, "testUsers", currentUser?.uid);
      const unsub = onSnapshot(
        docRef,
        (snapshot) => {
          setUser(snapshot.data());
        },
        (err) => {
          setUser([]);
          return err;
        }
      );
      return unsub;
    }
  }, [currentUser]);

  useEffect(() => {
    if (clicked === "yes") {
      setIsLoading(true);
      handleSignIn();
    } else {
      setIsLoading(false);
    }
  }, [clicked]);

  useEffect(() => {
    dispatch({ type: "IS_SIGN_IN_PAGE" });
    if (currentUser && user) {
      dispatch({ type: "SIGN_IN" });
      setClicked("no");
    }
  }, [dispatch, currentUser, user]);

  return (
    <>
      <Header />
      <div className="container container-signinpage">
        <div className="signinpage">
          {currentUser && user && isSignInPage ? (
            <>
              <Link
                to={`/home/${currentUser?.uid}`}
                id="signinpage-go-home"
                className="link"
              >
                Go To Home Page
              </Link>
              <p>You have signed in successfully!</p>
            </>
          ) : (
            <>
              {isLoading ? (
                <button
                  className="link, loader"
                  id="signinpage-go-home"
                  disabled={true}
                >
                  <span className="loading__amin"></span> Go To Home Page
                </button>
              ) : (
                <>
                  <button onClick={() => setClicked("yes")}>
                    Sign in with Google
                  </button>
                  <p className="welcome-text">Sign In!</p>
                  <p className="welcome-text">Make Friends!</p>
                  <p className="welcome-text">Create Spaces!</p>
                  <p className="welcome-text">Add Friends To Spaces!</p>
                  <p className="welcome-text">Enjoy Your Chat!!!</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
