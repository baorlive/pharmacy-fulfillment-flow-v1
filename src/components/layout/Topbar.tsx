'use client';

interface TopbarProps {
  incomingEnabled: boolean;
  onToggleIncoming: () => void;
}

export default function Topbar({ incomingEnabled, onToggleIncoming }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo" aria-label="GetNow Pharmacy">
          <img className="logo-image" src="/getnow.svg" alt="GetNow Pharmacy" />
        </div>
      </div>

      <div className="topbar-right">
        <button
          id="incoming-receive-toggle"
          className={`incoming-receive-toggle ${incomingEnabled ? 'is-on' : 'is-off'}`}
          type="button"
          role="switch"
          aria-checked={incomingEnabled}
          onClick={onToggleIncoming}
          title="Toggle receiving new order notifications"
        >
          <span className="incoming-receive-track" aria-hidden="true">
            <span className="incoming-receive-thumb" />
          </span>
          <span className="incoming-receive-copy">
            <span className="incoming-receive-label">New Orders</span>
            <span className="incoming-receive-state">
              {incomingEnabled ? 'Receiving' : 'Paused'}
            </span>
          </span>
        </button>

        <div className="session-owner">
          <span className="session-owner-label">Pharmacist</span>
          <span className="session-owner-name">Mrs. Hong</span>
        </div>

        <button className="topbar-icon-btn" type="button" aria-label="Notifications" title="Notifications">
          <svg className="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10.268 21a2 2 0 0 0 3.464 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <button className="topbar-icon-btn" type="button" aria-label="Settings" title="Settings">
          <svg className="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3.828 9.56a3.1 3.1 0 0 1-.002 4.865 2 2 0 0 0 1.98 3.425 3.1 3.1 0 0 1 4.211 2.434 2 2 0 0 0 3.958.002 3.1 3.1 0 0 1 4.213-2.431 2 2 0 0 0 1.983-3.424 3.1 3.1 0 0 1 .001-4.866 2 2 0 0 0-1.978-3.425 3.1 3.1 0 0 1-4.214-2.421 2 2 0 0 0-3.961.004A3.1 3.1 0 0 1 5.81 6.135 2 2 0 0 0 3.828 9.56" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.9" fill="none" />
          </svg>
        </button>
      </div>
    </header>
  );
}
