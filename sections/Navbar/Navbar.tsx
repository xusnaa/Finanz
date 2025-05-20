import React from "react";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
import Theme from "./theme";
import Avatar from "./Avatar";

const Navbar = () => {
  return (
    <div className="p-8 flex justify-between">
      <Logo />
      <Navlinks />
      <div className="flex justify-between items-center">
        <Avatar />

        {/* Theme toggle (always visible) */}
        <Theme />
      </div>
    </div>
  );
};
export default Navbar;
