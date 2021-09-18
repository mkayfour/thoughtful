import { auth, firestore, googleAuthProvider } from "../lib/firebase";

import firebase from "firebase/app";

import { useContext, useState, useEffect, useCallback } from "react";

import { UserContext } from "../lib/context";

import debounce from "lodash/debounce";

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  console.log("user details --->", user, username);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log("result ", result);
      })
      .catch((error) => {
        console.log(" err ", error);
      });
  };

  return (
    <>
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={"/google.png"} width="30px" /> Sign in with Google
      </button>
      <button onClick={() => auth.signInAnonymously()}>
        Sign in Anonymously
      </button>
    </>
  );
}

function SignOutButton() {
  return <button onClick={() => firebase.auth().signOut()}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firestore read excuted.");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  return (
    <>
      {!username && (
        <section>
          <h3>Choose username</h3>
          <form onSubmit={onSubmit}>
            <input
              name="username"
              placeholder="username"
              value={formValue}
              onChange={onChange}
            />
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
            />

            <button type="submit" className="btn-green" disabled={!isValid}>
              Choose
            </button>
            <h3>Debug State</h3>
            <div>
              Username: {formValue}
              <br />
              Loading: {loading.toString()}
              <br />
              Username Valid: {isValid.toString()}
            </div>
          </form>
        </section>
      )}
    </>
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking....</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
