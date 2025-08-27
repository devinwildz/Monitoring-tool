import { Route, Routes, useLocation } from 'react-router-dom'

import Home from './Pages/Home'
import PricingPage from './Pages/PricingPage'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Pages/user/Login'
import Register from './Pages/user/Register'
import UserDashboard from './Pages/user/UserDashboard.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from './Pages/ErrorPage'
import PrivateRoute from './Components/PrivateRoute';
import PublicRoute from './Components/PublicRoute';



const App = () => {

  const location = useLocation();
  const showLayout = ["/", "/pricing", "/login", "/register", '/user/dashboard'].includes(location.pathname);
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      {showLayout && <Navbar />}
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path='/pricing' element={<PricingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path='/user/dashboard' element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<ErrorPage />} />

      </Routes>
      {showLayout && <Footer />}
    </div>
  )
}

export default App