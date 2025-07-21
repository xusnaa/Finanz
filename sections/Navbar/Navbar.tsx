import Logo from './Logo';
import Navlinks from './Navlinks';

import Avatar from './Avatar';
import ThemeToggle from './theme';

const Navbar = () => {
  return (
    <div className="p-6 sm:p-8 flex justify-between items-center w-full">
      <Logo />
      <div>
        <Navlinks />
      </div>

      <div className="flex items-center gap-4">
        <Avatar />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
