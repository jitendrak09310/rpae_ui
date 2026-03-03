import React, { useEffect, useState } from 'react';
import { getNews } from '../services/ApiNews';
import '../styles/news.css';

function News() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);
    const [search, setSearch] = useState("");
    const [activeTopic, setActiveTopic] = useState("All");
    const [topics, setTopics] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getNews();

            // Remove duplicates by url
            const unique = res.data.filter((item, index, self) =>
                index === self.findIndex(n => n.url === item.url)
            );

            setData(unique);
            setFiltered(unique);

            // Extract unique topics from all articles
            const allTopics = ["All", ...new Set(unique.flatMap(n => n.topics ?? []))];
            setTopics(allTopics);
            setLastFetched(new Date());
        } catch (err) {
            console.error("Error fetching news:", err);
            setError("Failed to load news. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Filter whenever search or topic changes
    useEffect(() => {
        let result = data;

        if (activeTopic !== "All") {
            result = result.filter(n => (n.topics ?? []).includes(activeTopic));
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(n =>
                n.title?.toLowerCase().includes(q) ||
                n.summary?.toLowerCase().includes(q) ||
                n.source?.toLowerCase().includes(q)
            );
        }

        setFiltered(result);
    }, [search, activeTopic, data]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

    const getImage = (n) => n.imageUrl || n.image_url || null;
    const getDate = (n) => n.pubDate || n.pub_date || null;

    if (loading) return (
        <div className="news-loading">
            <div className="news-spinner"></div>
            <p>Loading latest news...</p>
        </div>
    );

    if (error) return (
        <div className="news-loading">
            <p className="status-msg error">{error}</p>
            <button className="refresh-btn" onClick={fetchData}>Try Again</button>
        </div>
    );

    return (
        <div className="news-wrapper">

            {/* Header */}
            <div className="news-header">
                <div>
                    <h2>Market News</h2>
                    <span className="news-count">{filtered.length} articles</span>
                </div>
                <div className="header-right">
                    <button className="refresh-btn" onClick={fetchData}>↻ Refresh</button>
                    {lastFetched && (
                        <span className="last-fetched">
                            Updated: {lastFetched.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            {/* Search + Topic Filter */}
            <div className="news-controls">
                <input
                    type="text"
                    className="news-search"
                    placeholder="🔍  Search by title, summary or source..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="topic-tabs">
                    {topics.map(t => (
                        <button
                            key={t}
                            className={activeTopic === t ? "active" : ""}
                            onClick={() => setActiveTopic(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Grid */}
            {filtered.length === 0 ? (
                <div className="no-news">No articles found.</div>
            ) : (
                <div className="news-grid">
                    {filtered.map((n, i) => (
                        <a
                            key={n.url || i}
                            href={n.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-card"
                        >
                            {/* Image */}
                            <div className="news-card-img">
                                {getImage(n) ? (
                                    <img
                                        src={getImage(n)}
                                        alt={n.title}
                                        onError={e => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "flex";
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="news-card-img-fallback"
                                    style={{ display: getImage(n) ? "none" : "flex" }}
                                >
                                    📰
                                </div>
                            </div>

                            {/* Body */}
                            <div className="news-card-body">
                                <div className="news-card-meta">
                                    <span className="news-source">{n.source ?? "-"}</span>
                                    <span className="news-date">{formatDate(getDate(n))}</span>
                                </div>

                                <h3 className="news-card-title">{n.title}</h3>
                                <p className="news-card-summary">{n.summary}</p>

                                {/* Topics */}
                                {(n.topics ?? []).length > 0 && (
                                    <div className="news-topics">
                                        {(n.topics ?? []).map((t, j) => (
                                            <span key={j} className="news-topic-tag">{t}</span>
                                        ))}
                                    </div>
                                )}

                                <span className="news-read-more">Read more →</span>
                            </div>
                        </a>
                    ))}
                </div>
            )}

        </div>
    );
}

export default News;