import React, { useEffect, useState } from 'react';
import { getBseMostActive } from '../services/ApiMostActive';

function BseMostActive() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    // Search
    const [search, setSearch] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const filtered = data.filter(d =>
        d.company?.toLowerCase().includes(search.toLowerCase()) ||
        d.ticker?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = filtered.slice(firstIndex, lastIndex);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getBseMostActive();
            console.log("BSE first item:", res.data[0]); // debug - remove later
            setData(res.data);
            setLastFetched(new Date());
        } catch (err) {
            console.error("Error fetching BSE most active:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Reset to page 1 on search
    useEffect(() => { setCurrentPage(1); }, [search]);

    if (loading) return <h3 className="status-msg">Loading BSE Most Active...</h3>;
    if (error) return <h3 className="status-msg error">{error}</h3>;

    const fmt = (val) => (val !== null && val !== undefined && val !== "") ? val : "-";
    const signClass = (val) => Number(val) >= 0 ? "positive" : "negative";
    const signFmt = (val) => val === null || val === undefined ? "-" : Number(val) >= 0 ? `+${val}` : `${val}`;

    const ratingClass = (rating) => {
        if (!rating) return "";
        const r = rating.toLowerCase();
        if (r === "bullish") return "positive";
        if (r === "bearish") return "negative";
        return "";
    };

    return (
        <div className="container">

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h2>BSE Most Active</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={fetchData}>Refresh</button>
                    {lastFetched && (
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                            Last updated: {lastFetched.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: "12px" }}>
                <input
                    type="text"
                    placeholder="Search by company or ticker..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "300px" }}
                />
                <span style={{ marginLeft: "12px", fontSize: "13px", color: "#888" }}>
                    {filtered.length} results
                </span>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Ticker</th>
                            <th>Company</th>
                            <th>Price</th>
                            <th>% Change</th>
                            <th>Net Change</th>
                            <th>Open</th>
                            <th>High</th>
                            <th>Low</th>
                            <th>Close</th>
                            <th>Bid</th>
                            <th>Ask</th>
                            <th>Volume</th>
                            <th>52W High</th>
                            <th>52W Low</th>
                            <th>Low Circuit</th>
                            <th>Up Circuit</th>
                            <th>Overall Rating</th>
                            <th>Short Term</th>
                            <th>Long Term</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="20" className="no-data">No data available</td>
                            </tr>
                        ) : (
                            currentItems.map((d, index) => (
                                <tr key={d.ticker || index}>
                                    <td>{firstIndex + index + 1}</td>
                                    <td><strong>{fmt(d.ticker ?? d.ticker)}</strong></td>
                                    <td style={{ textAlign: "left", minWidth: "160px" }}>{fmt(d.company)}</td>
                                    <td><strong>{fmt(d.price)}</strong></td>
                                    <td className={signClass(d.percentChange ?? d.percent_change)}>
                                        {signFmt(d.percentChange ?? d.percent_change)}%
                                    </td>
                                    <td className={signClass(d.netChange ?? d.net_change)}>
                                        {signFmt(d.netChange ?? d.net_change)}
                                    </td>
                                    <td>{fmt(d.open)}</td>
                                    <td>{fmt(d.high)}</td>
                                    <td>{fmt(d.low)}</td>
                                    <td>{fmt(d.close)}</td>
                                    <td>{fmt(d.bid)}</td>
                                    <td>{fmt(d.ask)}</td>
                                    <td>{fmt(d.volume?.toLocaleString())}</td>
                                    <td>{fmt(d.weekHigh52 ?? d["52_week_high"])}</td>
                                    <td>{fmt(d.weekLow52 ?? d["52_week_low"])}</td>
                                    <td>{fmt(d.lowCircuitLimit ?? d.low_circuit_limit)}</td>
                                    <td>{fmt(d.upCircuitLimit ?? d.up_circuit_limit)}</td>
                                    <td className={ratingClass(d.overallRating ?? d.overall_rating)}>
                                        {fmt(d.overallRating ?? d.overall_rating)}
                                    </td>
                                    <td className={ratingClass(d.shortTermTrend ?? d.short_term_trend)}>
                                        {fmt(d.shortTermTrend ?? d.short_term_trend)}
                                    </td>
                                    <td className={ratingClass(d.longTermTrend ?? d.long_term_trend)}>
                                        {fmt(d.longTermTrend ?? d.long_term_trend)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? "active" : ""}
                        >{i + 1}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
                </div>
            )}

        </div>
    );
}

export default BseMostActive;