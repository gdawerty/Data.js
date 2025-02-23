import { useEffect, useState } from "react";

const NewsFeed: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Fetch news from Django backend
                const response = await fetch("http://127.0.0.1:8000/api/get_market_news", {
                    method: "GET",
                    mode: "cors",  // Ensure that CORS is handled correctly
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }

                const data = await response.json();
                console.log(data);  // Check the response in the console

                // Filter articles based on the 'language' field, only include articles with 'en'
                const filteredNews = data.data.filter((article: any) => article.language === 'en');

                setNews(filteredNews || []); // Set the filtered articles to the state
                setLoading(false);
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to fetch news");
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <p>Loading news...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Just For You</h2>
            <ul className="space-y-3">
                {news.length > 0 ? (
                    news.map((article: any) => (
                        <li key={article.uuid} className="border-b pb-2">
                            <div className="flex items-center space-x-3">
                                {article.image_url && (
                                    <img
                                        style={{
                                            maxWidth: "800px"
                                        }}
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-32 h-32 object-cover rounded"  // Fixed size
                                    />
                                )}
                                <div>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {article.title}
                                    </a>
                                    <p className="text-sm text-gray-500">
                                        {article.source} - {new Date(article.published_at).toLocaleString()}
                                    </p>
                                    <p className="text-gray-700 mt-1">{article.description}</p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No news available at the moment.</p>
                )}
            </ul>
        </div>
    );
};

export default NewsFeed;
