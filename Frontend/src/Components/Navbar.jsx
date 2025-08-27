import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../Context/authContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth(); // 👈 user & logout auth se

  return (
    <nav className="bg-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-glow"></div>
              <span className="text-white text-xl font-bold">MonitorPro</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white font-semibold"
                >
                  <User className="h-6 w-6 rounded-full bg-green-500 p-1" />
                  <span className="hover:text-green-400 cursor-pointer">Welcome, {user.name.charAt(0).toUpperCase() + user.name.slice(1).split(" ")[0]}</span>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-slate-600 rounded-lg shadow-lg py-2">
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 cursor-pointer text-white hover:bg-gray-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 font-semibold hover:text-green-400 transition-colors"
                >
                  Login
                </Link>
                <Link to="/register">
                  <button className="bg-green-500 hover:bg-green-600 cursor-pointer text-white font-semibold py-2 px-5 rounded-lg transition text-sm sm:text-base">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-card mt-2">
              {user ? (
                <>
                  <div className="text-white px-3 py-2">
                    Welcome, {user.name.split(" ")[0]}
                  </div>
                  <Link
                    to="/profile"
                    className="text-white hover:text-green-400 block px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left w-full text-white hover:text-green-400 block px-3 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-green-400 block px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:text-green-400 block px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
