import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import SeatSelection from './pages/SeatSelection';
import UserTickets from './pages/UserTickets';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Personalization from './pages/Personalization';
import UserInvoices from './pages/UserInvoices';
import PrintInvoice from './pages/PrintInvoice';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:movieId/:showtimeId" element={<SeatSelection />} />
          <Route path="/tickets" element={<UserTickets />} />
          <Route path="/invoices" element={<UserInvoices />} />
          <Route path="/invoice/:id/print" element={<PrintInvoice />} />
          <Route path="/foryou" element={<Personalization />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
