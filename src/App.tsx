import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

interface Match {
  idEvent: string;
  strEvent: string;
  intHomeScore: string;
  intAwayScore: string;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strStatus: string;
}

function App() {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const CAMBUUR_ID = "134303";

  useEffect(() => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${CAMBUUR_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setMatch(data.results[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const isCambuurBehind = () => {
    if (!match) return false;
    const homeScore = parseInt(match.intHomeScore);
    const awayScore = parseInt(match.intAwayScore);

    if (match.idHomeTeam === CAMBUUR_ID) {
      return homeScore < awayScore;
    } else {
      return awayScore < homeScore;
    }
  };

  useEffect(() => {
    if (!loading && match && isCambuurBehind()) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [loading, match]);

  if (loading) return <div className="loading">Loading scores...</div>;
  if (!match) return <div className="error">No match data found.</div>;

  const behind = isCambuurBehind();

  return (
    <div className={`app-container ${behind ? 'party' : 'sad'}`}>
      <h1>Cambuur Score Watch</h1>
      <div className="match-card">
        <div className="teams">
          <span>{match.strHomeTeam}</span>
          <span className="score">{match.intHomeScore} - {match.intAwayScore}</span>
          <span>{match.strAwayTeam}</span>
        </div>
        <div className="status">{match.strStatus}</div>
      </div>

      <div className="mood-indicator">
        {behind ? (
          <div className="party-content">
            <span className="emoji">🥳🎉🎆</span>
            <p>Cambuur is behind! PARTY TIME!</p>
          </div>
        ) : (
          <div className="sad-content">
            <span className="emoji">😢😔🌧️</span>
            <p>Cambuur is not behind. Sad mood...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
