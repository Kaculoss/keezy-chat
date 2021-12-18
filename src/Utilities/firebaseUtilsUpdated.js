import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth";
import {
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  collection,
  getFirestore,
  where,
  query,
  orderBy,
  serverTimestamp,
} from "@firebase/firestore";
import { useEffect, useState } from "react";

// Link on the docs of how i signed in with google
// https://firebase.google.com/docs/auth/web/google-signin

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqPd9wBVYPjKYC4QOXEVUHx72LCX7aMXE",
  authDomain: "keezy-chat-app.firebaseapp.com",
  projectId: "keezy-chat-app",
  storageBucket: "keezy-chat-app.appspot.com",
  messagingSenderId: "148096291324",
  appId: "1:148096291324:web:b1ef7a736dbd3e770ea279",
};

initializeApp(firebaseConfig);

const auth = getAuth();
export const db = getFirestore();

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}

export async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      return user;
    })
    .then((user) => {
      newComer(user.uid, user.displayName, user.photoURL);
      return user;
    });
}

export async function logout() {
  return signOut(auth);
}

export const addNewTestUsers = async (uid, name, photoURL) => {
  const docRef = doc(db, "testUsers", uid);
  const mySnapShot = await getDoc(docRef);
  if (!mySnapShot.exists()) {
    let splitName;
    if (name.includes(" ")) {
      splitName = name.toLowerCase().split(" ");
    } else {
      splitName = name.toLowerCase().split();
    }

    const userDocRef = doc(db, "testUsers", uid);
    const userPayload = {
      id: uid,
      name,
      name_array: [...splitName, name],
      photoURL,
    };
    setDoc(userDocRef, userPayload);
  }
};

export const newCommunityUser = async (uid, name, photoURL) => {
  const docRef = doc(db, "testCommunity/community/participants", uid);
  const mySnapsShot = await getDoc(docRef);
  if (!mySnapsShot.exists()) {
    const docRef = doc(db, "testCommunity/community/participants", uid);
    const payload = { name, photoURL, id: uid };
    setDoc(docRef, payload);
  }
};

export const searchTestUsers = async (searchedName, currentUserID) => {
  const colRef = collection(db, "testUsers");
  const query1 = where(
    "name_array",
    "array-contains",
    searchedName.toLowerCase()
  );
  const query2 = where("id", "!=", currentUserID);
  const q = query(colRef, query1, query2);

  return getDocs(q)
    .then((snapshot) => {
      const results = snapshot.docs.map((doc) => doc.data());
      return results;
    })
    .catch((err) => err);
};

export const addToReqSent = async (userID, receiver) => {
  const docRef = doc(db, `testUsers/${userID}/reqSent`, receiver.id);
  const payload = {
    id: receiver.id,
    name: receiver.name,
    photoURL: receiver.photoURL,
    isDeleted: false,
  };
  setDoc(docRef, payload);
};

export const addToReqRec = async (user, receiver) => {
  const docRef = doc(db, `testUsers/${receiver.id}/reqReceived`, user.id);
  const payload = {
    id: user.id,
    name: user.name,
    photoURL: user.photoURL,
  };
  setDoc(docRef, payload);
};

export const addToUserFriends = async (userID, receiver) => {
  const docRef = doc(db, `testUsers/${userID}/friends`, receiver.id);
  const chatID = userID.slice(0, 15) + receiver.id.slice(15);
  const payload = {
    id: receiver.id,
    name: receiver.name,
    photoURL: receiver.photoURL,
    chatID,
  };
  setDoc(docRef, payload);
  return chatID;
};

export const addToFriendFriends = async (chatID, user, receiver) => {
  const docRef = doc(db, `testUsers/${receiver.id}/friends`, user.id);
  const payload = {
    id: user.id,
    name: user.name,
    photoURL: user.photoURL,
    chatID,
  };
  setDoc(docRef, payload);
  return chatID;
};

export const addToFriendChatroom = async (chatID, user, receiver) => {
  const docRef = doc(db, `testFriendChatrooms`, chatID);
  const payload = {
    id: chatID,
    participantIDs: [user.id, receiver.id],
  };
  setDoc(docRef, payload);
};

export const updateIsDelete = async (receiver, userID) => {
  await updateDoc(doc(db, `testUsers/${receiver.id}/reqSent`, userID), {
    isDeleted: true,
  });
};

export const deleteFromReqRec = async (userID, receiver) => {
  const docRef = doc(db, `testUsers/${userID}/reqReceived`, receiver.id);
  deleteDoc(docRef);
};

export const deleteFromReqSent = async (userID, receiver) => {
  const docRef = doc(db, `testUsers/${receiver.id}/reqSent`, userID);
  deleteDoc(docRef);
};

export const addToSpaceChatRoom = async (admin, name) => {
  const colRef = collection(db, "testSpaceChatrooms");
  const payload = { admin, name };
  const docID = await addDoc(colRef, payload);
  return docID.id;
};

export const addToSpaceChatParticipants = async (docID, user, bool) => {
  const docRef = doc(db, `testSpaceChatrooms/${docID}/participants`, user.id);
  const payload = {
    id: user.id,
    name: user.name,
    photoURL: user.photoURL,
    isAdmin: bool,
  };
  await setDoc(docRef, payload);
};

export const addToUserSpaces = async (userID, name, bool, docID) => {
  const docRef = doc(db, `testUsers/${userID}/spaces`, docID);
  const payload = { id: docID, name, isAdmin: bool };
  await setDoc(docRef, payload);
};

export const getSpaceParticipantIDs = async (chatID) => {
  const colRef = collection(db, `testSpaceChatrooms/${chatID}/participants`);
  return getDocs(colRef)
    .then((snapshot) => {
      const IDs = snapshot.docs.map((doc) => doc.id);
      return IDs;
    })
    .catch((err) => err);
};

export const deleteSpaceChatroom = async (chatID) => {
  const docRef = doc(db, `testSpaceChatrooms`, chatID);
  deleteDoc(docRef);
};

export const deleteSpaceParticipant = async (chatID, participantID) => {
  const docRef = doc(
    db,
    `testSpaceChatrooms/${chatID}/participants`,
    participantID
  );
  deleteDoc(docRef);
};

export const deleteFromUserSpace = async (userID, chatID) => {
  const docRef = doc(db, `testUsers/${userID}/spaces`, chatID);
  deleteDoc(docRef);
};

export const getUserSpaceAdmin = async (userID, chatID) => {
  const docRef = doc(db, `testUsers/${userID}/spaces`, chatID);
  const mySnapsShot = await getDoc(docRef);
  if (mySnapsShot.exists()) {
    const { isAdmin } = mySnapsShot.data();
    return isAdmin;
  } else {
    return false;
  }
};

export const updateSpaceChatroomName = async (chatID, spaceName) => {
  await updateDoc(doc(db, `testSpaceChatrooms`, chatID), {
    name: spaceName,
  });
};

export const updateUserSpaceName = async (participantID, chatID, spaceName) => {
  await updateDoc(doc(db, `testUsers/${participantID}/spaces`, chatID), {
    name: spaceName,
  });
};

export const sendTextMessage = async (chatID, text, id, photoURL, name) => {
  if (text) {
    const split_chatID = chatID.split("-");
    let colRef;
    if (split_chatID[1] === "c") {
      colRef = collection(db, `testCommunity/community/messages`);
    }
    if (split_chatID[1] === "s") {
      colRef = collection(db, `testSpaceChatrooms/${split_chatID[0]}/messages`);
    }
    if (split_chatID[1] === "f") {
      colRef = collection(
        db,
        `testFriendChatrooms/${split_chatID[0]}/messages`
      );
    }

    const payload = { text, id, photoURL, name, timestamp: serverTimestamp() };
    await addDoc(colRef, payload);
  }
};

// ###################### CALLERS ########################

export const newComer = async (uid, name, photoURL) => {
  try {
    await addNewTestUsers(uid, name, photoURL);
    await newCommunityUser(uid, name, photoURL);
  } catch (err) {
    return err;
  }
};

export const sendTestUserReq = async (user, receiver) => {
  try {
    await addToReqSent(user.id, receiver);
    await addToReqRec(user, receiver);
  } catch (err) {
    return err;
  }
};

export const acceptTestUserReq = async (user, receiver) => {
  try {
    const chatID1 = await addToUserFriends(user.id, receiver);
    const chatID2 = await addToFriendFriends(chatID1, user, receiver);
    await addToFriendChatroom(chatID2, user, receiver);
    await updateIsDelete(receiver, user.id);
    await deleteFromReqRec(user.id, receiver);
    await deleteFromReqSent(user.id, receiver);
  } catch (err) {
    return err;
  }
};

export const rejectTestUserReq = async (userID, receiver) => {
  try {
    await updateIsDelete(receiver, userID);
    await deleteFromReqRec(userID, receiver);
    await deleteFromReqSent(userID, receiver);
  } catch (err) {
    return err;
  }
};

export const creatSpaceChatroom = async (user, spaceName) => {
  try {
    const docID = await addToSpaceChatRoom(user.id, spaceName);
    await addToSpaceChatParticipants(docID, user, true);
    await addToUserSpaces(user.id, spaceName, true, docID);
  } catch (err) {
    return err;
  }
};

export const deleteEntireSpace = async (participantIDs, chatID) => {
  try {
    await deleteSpaceChatroom(chatID);

    participantIDs.forEach((ID) => {
      deleteFromUserSpace(ID, chatID);
    });
  } catch (err) {
    return err;
  }
};

export const removeSpaceParticipant = async (participantIDs, chatID) => {
  try {
    participantIDs.forEach((ID) => {
      deleteSpaceParticipant(chatID, ID);
      deleteFromUserSpace(ID, chatID);
    });
  } catch (err) {
    return err;
  }
};

export const updateSpaceName = async (chatID, spaceName, participantIDs) => {
  try {
    await updateSpaceChatroomName(chatID, spaceName);

    participantIDs.forEach((ID) => {
      updateUserSpaceName(ID, chatID, spaceName);
    });
  } catch (err) {
    return err;
  }
};

export const addSpaceParticipants = async (chatID, parts_Arr, spaceName) => {
  try {
    parts_Arr.forEach((participant) => {
      addToSpaceChatParticipants(chatID, participant, false);
      addToUserSpaces(participant.id, spaceName, false, chatID);
    });
  } catch (err) {
    return err;
  }
};

// ####################### SUBSCRIPTIONS ########################

export const useGetUserSubCollections = async (userID, subCol) => {
  const [intel, setIntel] = useState([]);

  useEffect(() => {
    const myColRef = collection(db, `testUsers/${userID}/${subCol}`);
    const unsub = onSnapshot(
      myColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) => doc.data());
          setIntel(data);
        } else {
          setIntel([]);
        }
      },
      (err) => {
        setIntel([]);
        return err;
      }
    );
    return unsub;
  }, [userID, subCol]);

  return intel;
};

export const useGetIDs = async (userID, collectionName) => {
  const [IDs, setIDs] = useState([]);

  useEffect(() => {
    const colRef = collection(db, `testUsers/${userID}/${collectionName}`);
    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const results = snapshot.docs.map((doc) => doc.id);
          setIDs(results);
        } else {
          setIDs([]);
        }
      },
      (err) => {
        setIDs([]);
        return err;
      }
    );
    return unsub;
  }, [userID, collectionName]);

  return IDs;
};

export const useSpaceChatroomName = async (chatID, userID) => {
  const [chatname, setChatname] = useState("");

  useEffect(() => {
    const split_chatID = chatID.split("-");
    if (split_chatID[1] === "c") {
      const docRef = doc(db, `testCommunity`, "community");
      const unsub = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            setChatname(doc.data().name);
          } else {
            setChatname("");
          }
        },
        (err) => {
          setChatname("Invalid Community");
          return err;
        }
      );
      return unsub;
    }

    if (split_chatID[1] === "s") {
      const docRef = doc(db, `testSpaceChatrooms`, split_chatID[0]);
      const unsub = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            setChatname(doc.data().name);
          } else {
            setChatname("");
          }
        },
        (err) => {
          setChatname("Invalid Space");
          return err;
        }
      );
      return unsub;
    }

    if (split_chatID[1] === "f") {
      const colRef = collection(db, `testUsers/${userID}/friends`);
      const query1 = where("chatID", "==", split_chatID[0]);
      const q = query(colRef, query1);

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map((doc) => doc.data().name);
            setChatname(data[0]);
          } else {
            setChatname("");
          }
        },
        (err) => {
          setChatname("Invalid Chatroom");
          return err;
        }
      );
      return unsub;
    }
  }, [chatID, userID]);
  return chatname;
};

export const useSpaceParticipants = async (chatID) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const split_chatID = chatID.split("-");
    if (split_chatID[1] === "s") {
      const colRef = collection(
        db,
        `testSpaceChatrooms/${split_chatID[0]}/participants`
      );
      const unsub = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const results = snapshot.docs.map((doc) => doc.data());
            setParticipants(results);
          } else {
            setParticipants([]);
          }
        },
        (err) => {
          setParticipants([]);
          return err;
        }
      );
      return unsub;
    }
    if (split_chatID[1] === "c") {
      const colRef = collection(db, `testCommunity/community/participants`);
      const unsub = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const results = snapshot.docs.map((doc) => doc.data());
            setParticipants(results);
          } else {
            setParticipants([]);
          }
        },
        (err) => {
          setParticipants([]);
          return err;
        }
      );
      return unsub;
    }
    if (split_chatID[1] === "f") {
      const docRef = doc(db, `testFriendChatrooms`, split_chatID[0]);
      const unsub = onSnapshot(
        docRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const results = snapshot.data();
            setParticipants(results);
          } else {
            setParticipants([]);
          }
        },
        (err) => {
          setParticipants([]);
          return err;
        }
      );
      return unsub;
    }
  }, [chatID]);

  return participants;
};

export const useMessages = async (chatID) => {
  const [messages, setMessages] = useState();

  useEffect(() => {
    const split_chatID = chatID.split("-");
    let colRef;
    if (split_chatID[1] === "c") {
      colRef = collection(db, `testCommunity/community/messages`);
    }
    if (split_chatID[1] === "s") {
      colRef = collection(db, `testSpaceChatrooms/${split_chatID[0]}/messages`);
    }
    if (split_chatID[1] === "f") {
      colRef = collection(
        db,
        `testFriendChatrooms/${split_chatID[0]}/messages`
      );
    }

    if (colRef) {
      const query1 = orderBy("timestamp", "asc");
      const q = query(colRef, query1);
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const msg = snapshot.docs.map((doc) => ({
              ...doc.data(),
              msgID: doc.id,
            }));
            setMessages(msg);
          }
        },
        (err) => {
          setMessages([]);
          return err;
        }
      );

      return unsub;
    } else {
      setMessages([]);
    }
  }, [chatID]);
  return messages;
};
