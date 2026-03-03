import { useEffect, useState } from "react";
import { getPriceBySymbol } from "../services/ApiGold";
import { formatPrice } from "../utils/formatter";

function Gold() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const instruments = [
    { name: "Silver", symbol: "XAG" },
    { name: "Gold", symbol: "XAU" },
    { name: "Palladium", symbol: "XPD" },
    { name: "Copper", symbol: "HG" },
    { name: "Platinum", symbol: "XPT" }
  ];
  const fetchedData = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all(
        instruments.map(item => getPriceBySymbol(item.symbol))
      );
      const formattedData = responses.map((res, index) => ({
        ...res.data, name: instruments[index].name
      }))
      setData(formattedData);
      setLastFetched(new Date());
    } catch (error) {
      console.error("Error fetching gold price data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  if (loading) return <div><h3>Page Loading....</h3></div>;

  return (
    <div id="gold-item">
      <h2>Gold Price Dashboard</h2>
      <button onClick={fetchedData}>Refresh</button>

      {lastFetched && (
        <p style={{ fontWeight: "bold" }}>
          Last updated: {lastFetched.toLocaleTimeString()}
        </p>
      )}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Price(per Grams)</th>
            <th>Price(per Tola)</th>
            <th>Price(per KG)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const gramPrice = item.price
              ? (item.price / 31.1035) * 92.17
              : 0;

            return (
              <tr key={item.symbol}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{formatPrice(gramPrice)}</td>
                <td>{formatPrice(gramPrice * 10)}</td>
                <td>{formatPrice(gramPrice * 1000)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Gold;