import "../src/styles/global.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageContainer from "./components/PageContainer";

import Crypto from "./pages/Crypto";
import Gold from "./pages/Gold";
import Commodities from "./pages/Commodities";
import MutualFunds from "./pages/MutualFunds";
import News from "./pages/News";
import Stocks from "./pages/Stocks";
import BseMostActive from "./pages/BseMostActive";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />

      <PageContainer>
        <Routes>
          <Route path="/" element={<Navigate to="/crypto" replace />} />
          <Route path="/crypto" element={<Crypto />} />
          <Route path="/metals" element={<Gold />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/BSE_most_active" element={<BseMostActive />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/mutualFunds" element={<MutualFunds />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </PageContainer>

      <Footer />
    </BrowserRouter>
  );
}

export default App;