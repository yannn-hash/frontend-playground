import './catalog.css';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '../../shared/ui/Icon';
import type { GameMetadata } from '../../shared/contracts/game';
interface Props {
  games: GameMetadata[];
  active: string;
  completed: string[];
  onSelect: (id: string) => void;
  mobile: boolean;
  onClose: () => void;
}
export default function Catalog({ games, active, completed, onSelect, mobile, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (mobile && !dialog.current?.open) dialog.current?.showModal();
    else if (!mobile && dialog.current?.open) dialog.current.close();
  }, [mobile]);
  const filtered = games.filter(
    (game) =>
      (filter === 'Semua' || game.difficulty === filter) &&
      `${game.title} ${game.topics.join(' ')}`.toLowerCase().includes(search.toLowerCase()),
  );
  const content = (
    <>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">PILIH EKSPERIMEN</p>
          <h2>
            Rasa ingin tahu,
            <br />
            mulai dari sini<span>.</span>
          </h2>
        </div>
        <button className="icon-button mobile-only" aria-label="Tutup katalog" onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <label className="search-field">
        <Icon name="search" size={17} />
        <span className="sr-only">Cari game atau topik</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari game atau topik…"
        />
        <kbd aria-hidden="true">/</kbd>
      </label>
      <div className="catalog-filters" aria-label="Tingkat kesulitan">
        {['Semua', 'Dasar', 'Menengah', 'Lanjutan'].map((level) => (
          <button key={level} aria-pressed={filter === level} onClick={() => setFilter(level)}>
            {level}
          </button>
        ))}
      </div>
      <div className="catalog-count">
        <span>{filtered.length} eksperimen</span>
        <span>01 — 06</span>
      </div>
      <nav aria-label="Daftar game" className="game-list">
        {filtered.map((game) => {
          const count = completed.filter((id) => id.startsWith(`${game.id}/`)).length;
          return (
            <button
              className={`game-card ${active === game.id ? 'active' : ''}`}
              style={{ '--game-accent': game.accent } as CSSProperties}
              key={game.id}
              aria-current={active === game.id ? 'true' : undefined}
              onClick={() => {
                onSelect(game.id);
                onClose();
              }}
            >
              <span className="game-card-top">
                <span className="game-icon">
                  <Icon name={game.icon} size={21} />
                </span>
                <span className={`difficulty ${game.difficulty.toLowerCase()}`}>
                  {game.difficulty}
                </span>
                {count === 3 && <Icon name="trophy" size={15} />}
              </span>
              <span className="game-title">
                {game.title}
                <Icon name="arrowUp" size={16} />
              </span>
              <span className="game-subtitle">{game.subtitle}</span>
              <span className="game-card-bottom">
                <span>{game.topics.slice(0, 2).join(' / ')}</span>
                <span className="mission-dots" aria-label={`${count} dari 3 misi selesai`}>
                  {[0, 1, 2].map((n) => (
                    <i key={n} className={n < count ? 'done' : ''} />
                  ))}
                </span>
              </span>
            </button>
          );
        })}
        {!filtered.length && (
          <p className="empty-results">
            Belum ada yang cocok. Coba “CSS”, “Grid”, atau tingkat lain.
          </p>
        )}
      </nav>
      <div className="catalog-footer">
        <Icon name="shield" size={16} />
        <p>
          Tanpa akun. Bebas bereksperimen.
          <br />
          <span>Progres tersimpan di browser ini.</span>
        </p>
      </div>
    </>
  );
  return (
    <>
      <aside className="catalog desktop-catalog">{content}</aside>
      <dialog
        ref={dialog}
        className="catalog-drawer"
        onCancel={onClose}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="catalog">{content}</div>
      </dialog>
    </>
  );
}
