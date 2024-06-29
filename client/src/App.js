import './App.css';
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from "axios";
import { UserContextProvider } from './UserContext';
import AccountPage from './pages/AccountPage';
import ListingsPage from './pages/ListingsPage';
import LocationListing from './pages/LocationListing';
import ContactUsPage from './pages/ContactUsPage';
import AboutUsPage from './pages/AboutUsPage';
import ReservationPage from './pages/ReservationPage.js';
import SuccessPage from './pages/SuccessPage.js';
import ErrorPage from './pages/ErrorPage.js';
import Dashboard from './pages/Dashboard.js';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;
function App() {
  
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/account/:subpage?" element={<AccountPage />} />
          <Route path="/account/:subpage/:action" element={<AccountPage />} />
          <Route exact path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:locationId?" element={<LocationListing />} />
          <Route path="/reservation" element={<ReservationPage/>} />
          <Route path="/success" element={<SuccessPage/>} />
          <Route path="/error" element={<ErrorPage/>} />
          <Route path="/admin" element={<Dashboard/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
