import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <h1 className="logo">Task Manager</h1>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
            <NavLink to="/kanban" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Kanban
            </NavLink>
          </nav>
        </div>
        <div className="header-right">
          <span className="user-name">{user?.full_name}</span>
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
