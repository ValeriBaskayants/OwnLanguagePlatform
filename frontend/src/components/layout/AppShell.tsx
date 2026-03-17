import { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        marginLeft: 'var(--sidebar-w)',
        flex: 1,
        padding: '2.5rem 2.5rem 4rem',
        minWidth: 0,
        maxWidth: '1100px',
      }}>
        {children}
      </main>
    </div>
  );
}
