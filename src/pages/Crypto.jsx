import { useEffect, useState } from "react";
import { getCryptoCoinPrices } from "../services/ApiCrypto";
import { formatPrice } from "../utils/formatter";

function Crypto() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCoins = coins.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(coins.length / itemsPerPage);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCryptoCoinPrices();
      setCoins(res.data);
      setLastFetched(new Date());
    } catch (err) {
      console.error("Error fetching coin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <h3>Loading crypto data...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Crypto Prices</h2>
      <button onClick={fetchData}>Refresh</button>

      {lastFetched && (
        <p style={{ fontWeight: "bold" }}>
          Last updated: {lastFetched.toLocaleTimeString()}
        </p>
      )}

      <table style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Coin</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price (INR)</th>
            <th>24h High</th>
            <th>24h Low</th>
            <th>All Time Low</th>
          </tr>
        </thead>

        <tbody>
          {currentCoins.map((c, index) => (
            <tr key={c.id}>
              <td>{firstIndex + index + 1}</td>
              <td>
                <img src={c.image} width="32" alt={c.name} />
              </td>
              <td>{c.name}</td>
              <td>{c.symbol.toUpperCase()}</td>
              <td>{formatPrice(c.current_price)}</td>
              <td>{formatPrice(c.high_24h)}</td>
              <td>{formatPrice(c.low_24h)}</td>
              <td>{formatPrice(c.atl)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Crypto;
