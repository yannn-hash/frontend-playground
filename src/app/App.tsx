import './app.css';
import { useEffect, useState } from 'react';
import type { GameDefinition } from '../shared/contracts/game';
import { catalog, loaders } from '../games/registry';
import Catalog from '../features/catalog/Catalog';
import Player from '../features/player/Player';
import { useProgress } from '../features/progress/useProgress';
import { parseHash, selectionHash } from '../platform/navigation/hash';
import { reportError } from '../platform/monitoring/logger';
import { Icon } from '../shared/ui/Icon';
export default function App() {
  const [selection, setSelection] = useState(() =>
    parseHash(
      location.hash,
      catalog.map((game) => game.id),
    ),
  );
  const [game, setGame] = useState<GameDefinition | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [mobile, setMobile] = useState(false);
  const progress = useProgress();
  useEffect(() => {
    const searchShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.key !== '/' ||
        event.ctrlKey ||
        event.metaKey ||
        target?.closest('input, textarea, [contenteditable="true"]')
      )
        return;
      event.preventDefault();
      const mobileScreen = matchMedia('(max-width:767px)').matches;
      if (mobileScreen) setMobile(true);
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLInputElement>(
            mobileScreen ? '.catalog-drawer input' : '.desktop-catalog input',
          )
          ?.focus(),
      );
    };
    window.addEventListener('keydown', searchShortcut);
    return () => window.removeEventListener('keydown', searchShortcut);
  }, []);
  useEffect(() => {
    const update = () =>
      setSelection(
        parseHash(
          location.hash,
          catalog.map((game) => game.id),
        ),
      );
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    let current = true;
    setLoadError(false);
    loaders[selection.gameId]()
      .then((module) => {
        if (current) setGame(module.default);
      })
      .catch((error) => {
        if (current) {
          setLoadError(true);
          reportError(error, {
            scope: 'catalog',
            gameId: selection.gameId,
            code: 'GAME_LOAD_FAILED',
          });
        }
      });
    return () => {
      current = false;
    };
  }, [selection.gameId, retry]);
  useEffect(() => {
    const media = matchMedia('(min-width:768px)');
    const update = () => {
      if (media.matches) setMobile(false);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const navigate = (gameId: string, level: number) => {
    location.hash = selectionHash(gameId, level);
  };
  const active = game?.id === selection.gameId ? game : null;
  const mission = active?.missions[selection.level];
  const key = mission ? `${selection.gameId}/${mission.id}` : '';
  const validCompleted = progress.record.completed.filter((id) =>
    catalog.some((meta) => id.startsWith(`${meta.id}/`)),
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>
      <header className="site-header">
        <a className="brand" href="#game=box-model&level=1">
          <span className="brand-mark">
            <Icon name="code" size={23} />
          </span>
          <span>
            <strong>
              Riskiyanto<span className="brand-slash"> / </span>
              <span className="brand-word">playground</span>
            </strong>
            <small>FRONTEND EXPERIMENT ARCADE</small>
          </span>
        </a>
        <div className="header-right">
          <span className="global-progress">
            <Icon name="checks" size={16} />
            <strong>
              {validCompleted.length}
              <span> / 18</span>
            </strong>
            <span className="desktop-only">misi selesai</span>
          </span>
          <a
            className="portfolio-link"
            href={import.meta.env.VITE_PORTFOLIO_URL || 'https://portfolio.smtmtc.com/'}
          >
            Portfolio
            <Icon name="arrowUp" size={15} />
          </a>
          <button
            className="icon-button mobile-only"
            aria-label="Buka katalog game"
            onClick={() => setMobile(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      <div className="app-layout">
        <Catalog
          games={catalog}
          active={selection.gameId}
          completed={progress.record.completed}
          onSelect={(id) => navigate(id, 0)}
          mobile={mobile}
          onClose={() => setMobile(false)}
        />
        <div className="main-column">
          {!progress.available && (
            <p className="storage-notice" role="status">
              <Icon name="error" size={16} />
              Penyimpanan browser tidak tersedia. Progres hanya tersedia selama sesi ini.
            </p>
          )}
          {active && mission ? (
            <Player
              key={key}
              game={active}
              level={selection.level}
              draft={progress.record.drafts[key]}
              completed={progress.record.completed}
              onDraft={progress.draft}
              onComplete={progress.complete}
              onLevel={(level) => navigate(selection.gameId, level)}
              onCatalog={() => setMobile(true)}
            />
          ) : loadError ? (
            <main id="main" className="load-state" role="alert">
              <Icon name="error" size={36} />
              <h1>Game belum bisa dimuat.</h1>
              <p>Periksa koneksi lalu coba lagi.</p>
              <button className="button primary" onClick={() => setRetry((n) => n + 1)}>
                Coba lagi
              </button>
            </main>
          ) : (
            <main id="main" className="load-state" aria-busy="true">
              <span className="loading-shape" />
              <p>Menyiapkan eksperimen…</p>
            </main>
          )}
        </div>
      </div>
    </>
  );
}
