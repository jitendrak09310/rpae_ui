import "../src/styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageContainer from "./components/PageContainer";

import Crypto from "./pages/Crypto";
import Gold from "./pages/Gold";
import Commodities from "./pages/Commodities";
import MutualFunds from "./pages/MutualFunds";
import Announcements from "./pages/Announcements";
import News from "./pages/News";
import Stocks from "./pages/Stocks";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />

      <PageContainer>
        <Routes>
          <Route path="/crypto" element={<Crypto />} />
          <Route path="/metals" element={<Gold />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/mutualFunds" element={<MutualFunds />} />
          <Route path="/news" element={<News />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stocks/search" element={<Stocks section="search" />} />
          <Route path="/stocks/stock" element={<Stocks section="stock" />} />
          <Route path="/stocks/industry_search" element={<Stocks section="industry_search" />} />
          <Route path="/stocks/mutual_fund_search" element={<Stocks section="mutual_fund_search" />} />
          <Route path="/stocks/trending" element={<Stocks section="trending" />} />
          <Route path="/stocks/fetch_52_week_high_low_data" element={<Stocks section="fetch_52_week" />} />
          <Route path="/stocks/NSE_most_active" element={<Stocks section="nse_most_active" />} />
          <Route path="/stocks/BSE_most_active" element={<Stocks section="bse_most_active" />} />
          <Route path="/stocks/mutual_funds" element={<Stocks section="mutual_funds" />} />
          <Route path="/stocks/mutual_funds_details" element={<Stocks section="mutual_funds_details" />} />
          <Route path="/stocks/ipo" element={<Stocks section="ipo" />} />
          <Route path="/stocks/news" element={<Stocks section="news" />} />
          <Route path="/stocks/corporate_actions" element={<Stocks section="corporate_actions" />} />
          <Route path="/stocks/price_shockers" element={<Stocks section="price_shockers" />} />
          <Route path="/stocks/historical_data" element={<Stocks section="historical_data" />} />
          <Route path="/stocks/historical_stats" element={<Stocks section="historical_stats" />} />
          <Route path="/stocks/statement" element={<Stocks section="statement" />} />
          <Route path="/stocks/stock_forecasts" element={<Stocks section="stock_forecasts" />} />
          <Route path="/stocks/stock_target_price" element={<Stocks section="stock_target_price" />} />
          <Route path="/stocks/recent_announcements" element={<Stocks section="recent_announcements" />} />
          <Route path="/stocks/commodities" element={<Stocks section="commodities" />} />
        </Routes>
      </PageContainer>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
