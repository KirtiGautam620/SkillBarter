import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Background Mountain Shapes */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50vh', background: 'linear-gradient(180deg, transparent 0%, rgba(76,34,111,0.8) 100%)', zIndex: -1, clipPath: 'polygon(0 40%, 30% 0, 70% 30%, 100% 10%, 100% 100%, 0 100%)' }}></div>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40vh', background: 'rgba(45,27,78,0.9)', zIndex: -1, clipPath: 'polygon(0 60%, 20% 20%, 50% 50%, 80% 10%, 100% 30%, 100% 100%, 0 100%)' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="glow-text" style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>SkillBarter</h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            A magical journey to exchange skills using time as currency. Climb the mountain of knowledge together.
          </p>
        </div>

        {/* Journey Pathway Layout */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem', paddingBottom: '4rem' }}>
          
          <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '50%', width: '4px', background: 'linear-gradient(180deg, var(--gold) 0%, rgba(255,255,255,0.2) 100%)', transform: 'translateX(-50%)', zIndex: 0, borderRadius: '4px' }}></div>

          {/* Stepping Stone 4: Success */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.6))', marginBottom: '1rem' }}>🏆</div>
              <div className="signpost-btn glow-text" style={{ cursor: 'default' }}>SUCCESS</div>
            </div>
          </div>

          {/* Stepping Stone 3: Build Skills */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', position: 'relative', zIndex: 1, paddingLeft: '10%' }}>
            <div className="magical-card" style={{ maxWidth: '300px', textAlign: 'center' }}>
              <h3 style={{ color: '#e8d9ff', marginBottom: '0.5rem' }}>Build Skills</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Collaborate and level up your expertise.</p>
            </div>
          </div>

          {/* Stepping Stone 2: Learn & Grow */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', position: 'relative', zIndex: 1, paddingRight: '10%' }}>
            <div className="magical-card" style={{ maxWidth: '300px', textAlign: 'center' }}>
              <h3 style={{ color: '#e8d9ff', marginBottom: '0.5rem' }}>Learn & Grow</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Trade your time to learn what you don't know.</p>
            </div>
          </div>

          {/* Stepping Stone 1: Actions */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', position: 'relative', zIndex: 1, marginTop: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column', alignItems: 'center' }}>
              <div className="signpost-btn" style={{ cursor: 'default', background: 'var(--sky-mid)', borderColor: 'var(--sky-top)' }}>TAKE ACTION</div>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/register" className="signpost-btn">
                  START HERE
                </Link>
                <Link href="/login" className="signpost-btn signpost-left" >
                  LOGIN
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

