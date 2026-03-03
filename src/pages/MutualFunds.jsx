import React, { useEffect, useState } from 'react';
import { getMarketDataMutualFund } from '../services/ApiMutualfunds';
import '../styles/mutualfund.css';

function MutualFunds() {
    const [data, setData] = useState({});        // nested object
    const [flatData, setFlatData] = useState([]);        // flat list for table
    const [categories, setCategories] = useState([]);        // e.g. ["Debt", "Equity"]
    const [subCategories, setSubCategories] = useState([]);    // e.g. ["Floating Rate", ...]
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSubCategory, setActiveSubCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const totalPages = Math.ceil(flatData.length / itemsPerPage);
    const currentItems = flatData.slice(firstIndex, lastIndex);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getMarketDataMutualFund();
            const nested = res.data;
            console.log("Mutual Fund raw:", nested); // debug - remove later
            setData(nested);

            // Extract top-level categories e.g. ["Debt", "Equity"]
            const cats = Object.keys(nested);
            setCategories(cats);

            // Flatten all into one list for initial display
            flattenAndSet(nested, "All", "All");
            setLastFetched(new Date());
        } catch (err) {
            console.error("Error fetching mutual fund data:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Flatten nested object and attach category/subcategory labels
    const flattenAndSet = (nested, cat, subCat) => {
        const result = [];
        const topKeys = cat === "All" ? Object.keys(nested) : [cat];

        topKeys.forEach(topKey => {
            if (!nested[topKey]) return;
            const subKeys = subCat === "All" ? Object.keys(nested[topKey]) : [subCat];
            subKeys.forEach(subKey => {
                const funds = nested[topKey][subKey] || [];
                funds.forEach(f => result.push({ ...f, _category: topKey, _subCategory: subKey }));
            });
        });

        setFlatData(result);
        setCurrentPage(1);
    };

    // Update subcategory list when category changes
    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setActiveSubCategory("All");
        if (cat === "All") {
            setSubCategories([]);
        } else {
            setSubCategories(Object.keys(data[cat] || {}));
        }
        flattenAndSet(data, cat, "All");
    };

    const handleSubCategoryChange = (subCat) => {
        setActiveSubCategory(subCat);
        flattenAndSet(data, activeCategory, subCat);
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <h3 className="status-msg">Loading Mutual Funds...</h3>;
    if (error) return <h3 className="status-msg error">{error}</h3>;

    const fmt = (val) => (val !== null && val !== undefined && val !== "") ? val : "-";
    const signClass = (val) => Number(val) >= 0 ? "positive" : "negative";
    const signFmt = (val) => val === null || val === undefined ? "-" : Number(val) >= 0 ? `+${val}%` : `${val}%`;
    const stars = (n) => n ? "★".repeat(n) + "☆".repeat(5 - n) : "-";

    return (
        <div className="mf-wrapper">

            <div className="mf-header">
                <h2>Mutual Funds</h2>
                <div className="header-right">
                    <button className="refresh-btn" onClick={fetchData}>Refresh</button>
                    {lastFetched && (
                        <span className="last-fetched">Last updated: {lastFetched.toLocaleTimeString()}</span>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="mf-filters">
                <div className="filter-group">
                    <label>Category:</label>
                    <div className="filter-tabs">
                        <button
                            className={activeCategory === "All" ? "active" : ""}
                            onClick={() => handleCategoryChange("All")}
                        >All</button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={activeCategory === cat ? "active" : ""}
                                onClick={() => handleCategoryChange(cat)}
                            >{cat}</button>
                        ))}
                    </div>
                </div>

                {/* Sub-Category Filter - only shows when a category is selected */}
                {subCategories.length > 0 && (
                    <div className="filter-group">
                        <label>Sub-Category:</label>
                        <div className="filter-tabs">
                            <button
                                className={activeSubCategory === "All" ? "active" : ""}
                                onClick={() => handleSubCategoryChange("All")}
                            >All</button>
                            {subCategories.map(sub => (
                                <button
                                    key={sub}
                                    className={activeSubCategory === sub ? "active" : ""}
                                    onClick={() => handleSubCategoryChange(sub)}
                                >{sub}</button>
                            ))}
                        </div>
                    </div>
                )}

                <span className="result-count">{flatData.length} funds found</span>
            </div>

            <div className="table-scroll">
                <table className="mf-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Fund Name</th>
                            <th>Latest NAV</th>
                            <th>% Change</th>
                            <th>Asset Size (Cr)</th>
                            <th>1M Return</th>
                            <th>3M Return</th>
                            <th>6M Return</th>
                            <th>1Y Return</th>
                            <th>3Y Return</th>
                            <th>5Y Return</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="14" className="no-data">No data available</td>
                            </tr>
                        ) : (
                            currentItems.map((f, index) => (
                                <tr key={index}>
                                    <td>{firstIndex + index + 1}</td>
                                    <td>{fmt(f._category)}</td>
                                    <td>{fmt(f._subCategory)}</td>
                                    <td className="fund-name">{fmt(f.fundName ?? f.fund_name)}</td>
                                    <td className="price">{fmt(f.latestNav ?? f.latest_nav)}</td>
                                    <td className={signClass(f.percentageChange ?? f.percentage_change)}>
                                        {signFmt(f.percentageChange ?? f.percentage_change)}
                                    </td>
                                    <td>{fmt(f.assetSize ?? f.asset_size)}</td>
                                    <td className={signClass(f.oneMonthReturn ?? f["1_month_return"])}>
                                        {signFmt(f.oneMonthReturn ?? f["1_month_return"])}
                                    </td>
                                    <td className={signClass(f.threeMonthReturn ?? f["3_month_return"])}>
                                        {signFmt(f.threeMonthReturn ?? f["3_month_return"])}
                                    </td>
                                    <td className={signClass(f.sixMonthReturn ?? f["6_month_return"])}>
                                        {signFmt(f.sixMonthReturn ?? f["6_month_return"])}
                                    </td>
                                    <td className={signClass(f.oneYearReturn ?? f["1_year_return"])}>
                                        {signFmt(f.oneYearReturn ?? f["1_year_return"])}
                                    </td>
                                    <td className={signClass(f.threeYearReturn ?? f["3_year_return"])}>
                                        {signFmt(f.threeYearReturn ?? f["3_year_return"])}
                                    </td>
                                    <td className={signClass(f.fiveYearReturn ?? f["5_year_return"])}>
                                        {signFmt(f.fiveYearReturn ?? f["5_year_return"])}
                                    </td>
                                    <td className="star-rating">
                                        {stars(f.starRating ?? f.star_rating)}
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

export default MutualFunds;