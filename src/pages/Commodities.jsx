import React, { useEffect, useState } from 'react';
import { getMarketData } from '../services/ApiCommodities';
import '../styles/commodities.css';

function Commodities() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = data.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getMarketData();
            console.log("First item:", res.data[0]); // debug - remove later
            setData(res.data);
            setLastFetched(new Date());
        } catch (err) {
            console.error("Error fetching market data:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <h3 className="status-msg">Loading Market Data...</h3>;
    if (error) return <h3 className="status-msg error">{error}</h3>;

    const fmt = (val) => (val !== null && val !== undefined && val !== "") ? val : "-";

    const signClass = (val) => Number(val) >= 0 ? "positive" : "negative";
    const signFmt = (val) => Number(val) >= 0 ? `+${val}` : `${val}`;

    return (
        <div className="commodities-wrapper">

            <div className="commodities-header">
                <h2>Commodities Market Data</h2>
                <div className="header-right">
                    <button className="refresh-btn" onClick={fetchData}>Refresh</button>
                    {lastFetched && (
                        <span className="last-fetched">
                            Last updated: {lastFetched.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            <div className="table-scroll">
                <table className="commodities-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Product</th>
                            <th>Message Time</th>
                            <th>Expiry</th>
                            <th>Product Month</th>
                            <th>LTP</th>
                            <th>Buy Price</th>
                            <th>Sell Price</th>
                            <th>Avg Traded Price</th>
                            <th>Open</th>
                            <th>High</th>
                            <th>Low</th>
                            <th>Close</th>
                            <th>Buy Qty</th>
                            <th>Sell Qty</th>
                            <th>LT Qty</th>
                            <th>Total Qty Traded</th>
                            <th>Change</th>
                            <th>% Change</th>
                            <th>OI</th>
                            <th>OI Change</th>
                            <th>OI % Change</th>
                            <th>OI Result</th>
                            <th>Last Traded Time</th>
                            <th>Unit</th>
                            <th>Lot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="26" className="no-data">No data available</td>
                            </tr>
                        ) : (
                            currentItems.map((c, index) => (
                                <tr key={c.id || index}>
                                    <td>{firstIndex + index + 1}</td>
                                    <td className="product-name">{fmt(c.product)}</td>
                                    <td>{fmt(c.messageTime ?? c.message_time)}</td>
                                    <td>{fmt(c.expiry)}</td>
                                    <td>{fmt(c.productMonth ?? c.product_month)}</td>
                                    <td className="price">{fmt(c.lastTradedPrice ?? c.last_traded_price)}</td>
                                    <td className="price">{fmt(c.buyPrice ?? c.buy_price)}</td>
                                    <td className="price">{fmt(c.sellPrice ?? c.sell_price)}</td>
                                    <td className="price">{fmt(c.averageTradedPrice ?? c.average_traded_price)}</td>
                                    <td className="price">{fmt(c.openPrice ?? c.open_price)}</td>
                                    <td className="price">{fmt(c.highPrice ?? c.high_price)}</td>
                                    <td className="price">{fmt(c.lowPrice ?? c.low_price)}</td>
                                    <td className="price">{fmt(c.closePrice ?? c.close_price)}</td>
                                    <td>{fmt(c.buyQuantity ?? c.buy_quantity)}</td>
                                    <td>{fmt(c.sellQuantity ?? c.sell_quantity)}</td>
                                    <td>{fmt(c.lastTradedQuantity ?? c.last_traded_quantity)}</td>
                                    <td>{fmt(c.totalQuantityTraded ?? c.total_quantity_traded)}</td>
                                    <td className={signClass(c.change)}>
                                        {signFmt(fmt(c.change))}
                                    </td>
                                    <td className={signClass(c.perChange ?? c.per_change)}>
                                        {signFmt(fmt(c.perChange ?? c.per_change))}%
                                    </td>
                                    <td>{fmt(c.openInterest ?? c.open_interest)}</td>
                                    <td className={signClass(c.openInterestChange ?? c.open_interest_change)}>
                                        {signFmt(fmt(c.openInterestChange ?? c.open_interest_change))}
                                    </td>
                                    <td className={signClass(c.openInterestPerChange ?? c.open_interest_per_change)}>
                                        {signFmt(fmt(c.openInterestPerChange ?? c.open_interest_per_change))}%
                                    </td>
                                    <td className="oi-result">{fmt(c.oiResult)}</td>
                                    <td>{fmt(c.lastTradedTime ?? c.last_traded_time)}</td>
                                    <td>{fmt(c.priceQuotationUnit ?? c.price_quotation_unit)}</td>
                                    <td>{fmt(c.quotationLot ?? c.quotation_lot)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? "active" : ""}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
                </div>
            )}

        </div>
    );
}

export default Commodities;