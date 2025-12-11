import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageContainer from "./components/PageContainer";

import Crypto from "./pages/Crypto";
import Gold from "./pages/Gold";
import Stocks from "./pages/Stocks";
import Forex from "./pages/Forex";
import Commodities from "./pages/Commodities";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />

      <PageContainer>
        <Routes>
          <Route path="/" element={<Crypto />} />
          <Route path="/gold" element={<Gold />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/forex" element={<Forex />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </PageContainer>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
