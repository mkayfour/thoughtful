import Link from "next/link";

import { useContext } from "react";

import { UserContext } from "../lib/context";

export default function Navbar() {
  //   const { user, username } = {};

  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {/* // signed in user */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}
        {/* // user not signed in */}
        {!username && (
          <>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
}
