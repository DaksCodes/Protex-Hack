import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Education = () => {
    const playlist1_ID = "PLX2SHiKfualEyD05J9JsklEq1JFGbG6qJ";
    const playlist2_ID = "PLX2SHiKfualG_m1yBmcwQuuyQYq5u69EY";

    // Articles Data
    const articles = [
        {
            id: 1,
            title: "Psychology of Money",
            preview: "Save More Money Without Even Realising It",
            link: "https://blog.bankbazaar.com/personal-finance-101-save-more-money-without-even-realising-it/",
            image: "https://blog.bankbazaar.com/wp-content/uploads/2019/11/Heres-Your-Year-end-Financial-Checklist.png"
        },
        {
            id: 2,
            title: "Understanding personal finance",
            preview: "A beginner's guide to how money works and where to start...",
            link: "https://nikhilshares.medium.com/understanding-personal-finance-7f7799472b4f",
            image: "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*pvTMZmlKN0fVTE2w94gvnA.png"
        },
        {
            id: 3,
            title: "Importance of Budgeting",
            preview: "Why tracking every rupee is the first step to wealth creation...",
            link: "https://second-sight.com/news/the-importance-of-budgeting-to-help-support-financial-wellbeing/",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            title: "This or That Account",
            preview: "What are the different bank accounts?",
            link: "https://www.piramalfinance.com/vidya/6-types-of-bank-accounts-in-india-you-need-to-know",
            image: "https://cdn-scripbox-wordpress.scripbox.com/wp-content/uploads/2021/09/types-of-banks-accounts-in-india-vector.png"
        }
    ];

    // Glossary Logic
    const glossaryTerms = [
    { term: "Asset Allocation", definition: "Dividing your investments across different asset classes like stocks, bonds, and gold to minimize risk." },
    { term: "Bull Market", definition: "A financial market condition where prices are continuously rising and investors are highly optimistic." },
    { term: "Compound Interest", definition: "The interest earned on an investment that generates wealth by calculating 'interest on your interest'." },
    { term: "Liquidity", definition: "How quickly and easily an asset can be converted into ready cash without negatively impacting its market price." },
    { term: "Dividend", definition: "A portion of a company's profit that is distributed to its shareholders as a reward for their investment." },
    { term: "Emergency Fund", definition: "Money set aside equivalent to at least 6 months of living expenses, strictly reserved for unexpected financial crises." }
];

    const [currentTerm, setCurrentTerm] = useState(glossaryTerms[0]);
    //const [news, setNews] = useState([]);

    const refreshGlossary = () => {
        const randomIndex = Math.floor(Math.random() * glossaryTerms.length);
        setCurrentTerm(glossaryTerms[randomIndex]);
    };

    const [news, setNews] = useState([]);

    // Real News API Logic
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiUrl = 'https://api.marketaux.com/v1/news/all?api_token=JhQAJ1DUNBrbdvb7Ux4ZUqKl2Be8yHqoZQ2ec2w5&limit=5&language=en';
                const response = await fetch(apiUrl);
                const result = await response.json();
                if (result && result.data) {
                    setNews(result.data);
                }
            } catch (err) {
                console.error("error in fetching news:", err);
            }
        };
        fetchNews();
    }, []);

    return (
        <EducationStyled>
            <div className="main-title">
                <h1>An investment in Knowledge</h1>
                <h1>pays the best interest</h1>
            </div>

            {/* Videos Section */}
            <div className="content-grid">
                <div className="video-card">
                    <div className="card-text">
                        <h2>What is finance?</h2>
                        <h3>Finance Concepts</h3>
                    </div>
                    <div className="iframe-container">
                        <iframe 
                            src={`https://www.youtube.com/embed/videoseries?list=${playlist1_ID}`} 
                            title="Finance Concepts" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                <div className="video-card">
                    <div className="card-text">
                        <h2>Start Small, Think Big</h2>
                        <h3>Personal Finance</h3>
                    </div>
                    <div className="iframe-container">
                        <iframe 
                            src={`https://www.youtube.com/embed/videoseries?list=${playlist2_ID}`} 
                            title="Personal Finance" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Articles Section */}
            <div className="articles-section">
                <h2 className="section-heading">Listen to others' opinions</h2>
                <div className="articles-scroll">
                    {articles.map(article => (
                        <a key={article.id} href={article.link} target="_blank" rel="noreferrer" className="article-card">
                            <div className="article-img">
                                <img src={article.image} alt={article.title} />
                            </div>
                            <div className="article-info">
                                <h4>{article.title}</h4>
                                <p>{article.preview}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Glossary & News Section */}
            <div className="info-section">
                {/* Glossary Card */}
                <div className="info-card glossary">
                    <div className="card-header">
                        <h3>Glossary of the Day</h3>
                        <button onClick={refreshGlossary} title="New Word">
                            ↻ Refresh
                        </button>
                    </div>
                    <div className="card-body">
                        <h4>{currentTerm.term}</h4>
                        <p>{currentTerm.definition}</p>
                    </div>
                </div>

                {/* News Card */}
                <div className="info-card news">
                    <div className="card-header">
                        <h3>Latest Business News</h3>
                    </div>
                    <div className="card-body scroll-news">
                        {news.map((item, index) => (
                            <a 
                                key={index} 
                                href={item.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="news-item-link"
                            >
                                <div className="news-item">
                                    <p className="news-title">• {item.title}</p>
                                    <p className="news-desc">{item.description}</p>
                                    <span className="news-source">Source: {item.source}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </EducationStyled>
    );
};

const EducationStyled = styled.div`
    padding: 1.5rem;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;

    /* Main Title Styling */
    .main-title {
        text-align: center;
        h1 {
            font-size: 2.2rem;
            color: #222260;
            font-weight: 800;
            margin: 0;
        }
        p {
            font-size: 1.2rem;
            color: #4267B2;
            font-weight: 600;
            margin-top: 5px;
        }
    }

    /* Video Grid */
    .content-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        @media(max-width: 1100px) { grid-template-columns: 1fr; }
    }

    .video-card {
        background: rgba(252, 246, 249, 0.78);
        border: 2px solid #FFFFFF;
        border-radius: 25px;
        padding: 1.5rem;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        backdrop-filter: blur(4.5px);
        .card-text {
            margin-bottom: 1rem;
            h2 { font-size: 0.9rem; color: rgba(34, 34, 96, 0.6); text-transform: uppercase; }
            h3 { font-size: 1.5rem; color: #222260; font-weight: 700; }
        }
    }

    .iframe-container {
        position: relative;
        width: 100%;
        padding-top: 56.25%;
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(34, 34, 96, 0.1);
        iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
    }

    /* Articles Styling */
    .articles-section {
        .section-heading {
            font-size: 1.8rem;
            color: #222260;
            margin-bottom: 1.5rem;
            font-weight: 700;
            padding-left: 0.5rem;
        }

        .articles-scroll {
            display: flex;
            gap: 1.5rem;
            overflow-x: auto;
            padding: 1rem 0.5rem;
            cursor: grab;
            
            /* Custom Scrollbar */
            &::-webkit-scrollbar { height: 8px; }
            &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
            &::-webkit-scrollbar-thumb { background: #4267B2; border-radius: 10px; }

            &:active { cursor: grabbing; }
        }

        .article-card {
            min-width: 280px;
            max-width: 280px;
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            text-decoration: none;
            box-shadow: 0px 10px 20px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
            border: 1px solid #fff;

            &:hover { transform: translateY(-5px); }

            .article-img {
                width: 100%;
                height: 150px;
                img { width: 100%; height: 100%; object-fit: cover; }
            }

            .article-info {
                padding: 1rem;
                h4 { color: #222260; font-size: 1.1rem; margin-bottom: 0.5rem; }
                p { color: rgba(34,34,96,0.6); font-size: 0.85rem; line-height: 1.4; }
            }
        }
    }

    /* Glossary & News Section */
    .info-section {
        display: grid;
        grid-template-columns: 1fr 1.5fr; 
        gap: 2rem;
        
        @media(max-width: 900px) {
            grid-template-columns: 1fr;
        }
    }

    .info-card {
        background: rgba(252, 246, 249, 0.78);
        border: 2px solid #FFFFFF;
        border-radius: 25px;
        padding: 1.5rem;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        backdrop-filter: blur(4.5px);
        min-height: 250px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.2rem;
            border-bottom: 1px solid rgba(34, 34, 96, 0.1);
            padding-bottom: 0.5rem;

            h3 { font-size: 1.3rem; color: #222260; }
            
            button {
                background: #4267B2;
                color: white;
                border: none;
                padding: 5px 12px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                transition: all 0.3s ease;
                &:hover { background: #222260; }
            }
        }

        .card-body {
            h4 { color: #4267B2; font-size: 1.5rem; margin-bottom: 0.8rem; }
            p { color: rgba(34, 34, 96, 0.8); line-height: 1.5; font-size: 1rem; }
        }

        &.news .scroll-news {
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-height: 250px; /* Thoda bada kar diya taaki description fit aaye */
            overflow-y: auto;
            padding-right: 5px;

            &::-webkit-scrollbar { width: 5px; }
            &::-webkit-scrollbar-thumb { background: #4267B2; border-radius: 10px; }
        }

        .news-item-link {
            text-decoration: none;
            color: inherit;
            display: block;
            padding: 8px;
            border-radius: 10px;
            transition: background 0.3s ease;
            border: 1px solid transparent;

            &:hover {
                background: rgba(66, 103, 178, 0.05);
                border: 1px solid rgba(66, 103, 178, 0.2);
            }
        }

        .news-item {
            .news-title { 
                font-size: 1rem; 
                font-weight: 700; 
                margin-bottom: 4px; 
                color: #222260; 
            }
            .news-desc {
                font-size: 0.85rem;
                color: rgba(34, 34, 96, 0.7);
                margin-bottom: 6px;
                display: -webkit-box;
                -webkit-line-clamp: 2; /* Description ko 2 line me truncate karne ke liye */
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .news-source { 
                font-size: 0.75rem; 
                color: #4267B2; 
                font-weight: 600; 
                text-transform: uppercase;
            }
        }
    }
`;

export default Education;