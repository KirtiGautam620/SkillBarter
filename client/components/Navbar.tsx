'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Market', href: '/market' },
    { name: 'My Swaps', href: '/my-swaps' },
    { name: 'My Skills', href: '/my-skills' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '0.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 1000 }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }} className="gradient-text">
        SkillBarter
      </div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s',
              background: pathname === item.href ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              color: pathname === item.href ? 'var(--primary)' : 'var(--foreground)',
              fontWeight: pathname === item.href ? '600' : '400',
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }}>Logout</button>
      </div>
    </nav>
  );
}
