import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { onSnapshot, doc } from "@firebase/firestore";
import { UserInfo } from "./UserInfo";
import { Header } from "../Keezy Chat App/Header";
import { Search } from "./Search/Search";
import { Chats } from "./Chat/Chats";
import { db } from "../Utilities/firebaseUtilsUpdated";

const Home = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "testUsers", id);
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
  }, [id]);

  return (
    <>
      <Header />
      <div className="container container-home">
        {user && (
          <>
            <div className="home-aside">
              <UserInfo currentUser={user} />
              <Search user={user} />
            </div>
            <div className="home-main">
              <Chats currentUser={user} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
