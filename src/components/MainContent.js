import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MainContent.css';
import { program } from '../program/game-func';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import copyIcon from  "../assets/copy-icon.png"

const QGEM_ADDRESS = "6oBcsN8wRze7BjHYXF911YNGTSdG2awYqjxh8YVjZKo2";

const MainContent = ({ games }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null); 
  const [activeGames, setActiveGames] = useState(0)
  const [inActiveGame, setInActiveGame] = useState(0)
  const [copied, setCopied] = useState(false)


  const wallet = useAnchorWallet()

  // Placeholder user reviews data
  const userReviews = [
    { id: 1, name: "Alice", review: "Quantum RPS is incredibly fun and engaging!", rating: 5 },
    { id: 2, name: "Bob", review: "Monopoly: Landmark Legends brings a fresh twist to a classic.", rating: 4 },
    // Add more reviews as needed
  ];

   // Placeholder FAQ data
   const faqs = [
    { id: 1, question: "How do I start playing Quantum RPS?", answer: "To start playing, simply connect your wallet and choose 'Quantum RPS' from the game menu." },
    { id: 2, question: "What is GameFi in Quantum Gem?", answer: "GameFi refers to the blend of gaming and finance, leveraging blockchain technology to create value-driven gaming experiences." },
    // Add more FAQs as needed
  ];

  const handleLearnMore = (game) => {
    setSelectedGame(game);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  const scrollToGamePreviews = () => {
    const section = document.getElementById("gamePreviews");
    section.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollGallery = (direction) => {
    const gallery = document.querySelector('.games-gallery');
    const scrollAmount = 300; // Adjust as needed
    const currentScroll = gallery.scrollLeft;
  
    gallery.scrollTo({
      top: 0,
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(()=>{
    (async()=>{
      if(wallet){
        const pg = program(wallet)
        const games = await pg.account.game.all();

        const active = games.filter((item)=> item.account.isActive==true)
        const inActive = games.filter((item)=> item.account.isActive==false)

        setActiveGames(active?.length)
        setInActiveGame(inActive?.length)

        console.log(games,active, inActive)


      }
    })();
    console.log("run")
  },[wallet])
  
  useEffect(() => {
    if(copied){
      setTimeout(() => {
        setCopied(false)
      }, 1200);
    }
  }, [copied])

  return (
    <div className="main-content">
      {/* Introduction Section with Animation and Call-to-Action */}
      <section className="intro-section">
        <h1 className="intro-heading">Welcome to Quantum Gem</h1>
        <p className="intro-text">Explore the world of peer-to-peer blockchain gaming with Quantum Gem</p>
        <div className="copy-box">
            <p style={{color:"white"}} >{QGEM_ADDRESS.slice(0,4)+"...."+QGEM_ADDRESS.slice(-4)} </p>
            {!copied ? <img src={copyIcon} alt="copy" onClick={() => {navigator.clipboard.writeText(QGEM_ADDRESS); setCopied(true) }} /> : <p style={{color:"white"}}>copied!</p>} 
          </div>
        <div onClick={scrollToGamePreviews} className="intro-cta">
          Discover Games
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Unique Features</h2>
        <p>Our standout feature is the thrilling exploration into gaming finance (game-fi), where we leverage blockchain technology to deliver value-focused gaming experiences.</p>
      </section>

      {/* Interactive Game Showcase */}
      <section className="game-showcase-section" id="gamePreviews">
    <h2 style={{ color: "#9E2AB3" }}>Game Previews</h2> {/* Title "Game Previews" now in purple */}
    <div className="games-gallery-wrapper">
        <button className="arrow left-arrow" onClick={() => scrollGallery('left')}>←</button>
        <div className="games-gallery">
            {games.map(game => (
                <div key={game.id} className="game-card">
                    <Link to={`/${game.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <img src={`/assets/${game.imageUrl}`} alt={game.name} className="game-image" />
                    </Link>
                    <div className="game-details">
                        <h3 style={{ color: "black" }}>{game.name}</h3> {/* Game name in black */}
                        <p style={{ color: "black" }}>{game.description}</p> {/* Game description in black */}
                        <button onClick={() => handleLearnMore(game)} className="learn-more-btn">Learn More</button>
                    </div>
                </div>
            ))}
        </div>
        <button className="arrow right-arrow" onClick={() => scrollGallery('right')}>→</button>
    </div>
</section>


      {/* Game Description Pop-up */}
      {showPopup && selectedGame && (
        <div className="game-popup">
          <div className="game-popup-content">
            <h3>{selectedGame.name}</h3>
            <p>{selectedGame.fullDescription}</p>
            <button onClick={handleClosePopup} className="close-popup-btn">Close</button>
          </div>
        </div>
      )}

      {/* Live Data Dashboard */}
      <section className="data-dashboard-section">
        <h2>Live Data</h2>

        {/* Current Game Statistics */}
        <div className="current-game-stats">
          <h3>Current Game Statistics</h3>
          {wallet ? <div className='game-stat-box'>
            {activeGames ? <div className="game-stats">Active : {activeGames}</div> : null}
            {inActiveGame ? <div className="game-stats">Inactive : {inActiveGame}</div> : null}
          </div> : <p>Connect wallet to view stats</p>}
          {/* Placeholder for current game statistics */}
        </div>

        {/* Marketplace Activity */}
        <div className="marketplace-activity">
          <h3>Marketplace Activity</h3>
          {/* Placeholder for marketplace activity */}
        </div>

        {/* Token (QGEM) Statistics */}
        <div className="qgem-statistics">
          <h3>Token (QGEM) Statistics</h3>
          {/* Placeholder for QGEM statistics */}
        </div>

        {/* Game-Specific Data */}
        <div className="game-specific-data">
          <h3>Game-Specific Data</h3>
          {/* Placeholder for game-specific data */}
        </div>

        {/* Notifications and Updates */}
        <div className="notifications-updates">
          <h3>Notifications and Updates</h3>
          {/* Placeholder for notifications and updates */}
        </div>
      </section>

      {/* Testimonials or User Reviews */}
      <section className="testimonials-section">
        <h2 style={{ textAlign: 'center' }}>User Reviews</h2>
        <div className="reviews-container">
          {userReviews.map(review => (
            <div key={review.id} className="review-card">
              <h3>{review.name}</h3>
              <p>{review.review}</p>
              <span>Rating: {review.rating} / 5</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>FAQs</h2>
        <div className="faqs-container">
          {faqs.map(faq => (
            <div key={faq.id} className={`faq-item ${activeFAQ === faq.id ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                {faq.question}
              </div>
              <div className={`faq-answer ${activeFAQ === faq.id ? 'show' : ''}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Any additional sections as needed */}
    </div>
  );
};

export default MainContent;