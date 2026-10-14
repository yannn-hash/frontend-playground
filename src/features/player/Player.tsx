import './player.css';
import './workspace.css';
import { lazy, Suspense, type CSSProperties } from 'react';
import { useMission } from './useMission';
import MissionFeedback from './MissionFeedback';
import type { DraftRecord, GameDefinition } from '../../shared/contracts/game';
import { Icon } from '../../shared/ui/Icon';
import Preview from '../../platform/preview/Preview';
import { changeControl, controlValue } from './controls';
import QuestPreview from './QuestPreview';
const CodeEditor = lazy(() => import('./CodeEditor'));
interface Props {
  game: GameDefinition;
  level: number;
  draft?: DraftRecord;
  completed: string[];
  onDraft: (id: string, draft: DraftRecord) => void;
  onComplete: (id: string) => void;
  onLevel: (level: number) => void;
  onCatalog: () => void;
}
export default function Player({
  game,
  level,
  draft,
  completed,
  onDraft,
  onComplete,
  onLevel,
  onCatalog,
}: Props) {
  const {
    mission,
    missionKey,
    code,
    manual,
    hint,
    setHint,
    feedback,
    error,
    busy,
    tab,
    setTab,
    width,
    setWidth,
    traces,
    craft,
    setCraft,
    copyStatus,
    feedbackRef,
    update,
    reset,
    run,
    copy,
  } = useMission({ game, level, draft, onDraft, onComplete });
  const Arena = game.Arena;
  const completedCount = game.missions.filter((m) =>
    completed.includes(`${game.id}/${m.id}`),
  ).length;
  return (
    <main className="player" id="main" style={{ '--game-accent': game.accent } as CSSProperties}>
      <div className="player-breadcrumb">
        <button className="text-button mobile-only" onClick={onCatalog}>
          <Icon name="panel" size={16} />
          Eksperimen
        </button>
        <span className="desktop-only">PLAYGROUND</span>
        <Icon name="right" size={13} />
        <span>{game.title}</span>
        <span className="breadcrumb-number">
          EXPERIMENT /{' '}
          {String(
            [
              'box-model',
              'flexbox-dock',
              'grid-architect',
              'responsive-rescue',
              'state-quest',
              'motion-studio',
            ].indexOf(game.id) + 1,
          ).padStart(2, '0')}
        </span>
      </div>
      <div className="game-heading">
        <div>
          <div className="game-heading-label">
            <span className="difficulty">{game.difficulty}</span>
            <span>
              <Icon name="clock" size={13} />
              {game.duration}
            </span>
          </div>
          <h1>
            {game.title}
            <span>.</span>
          </h1>
          <p>{game.subtitle} Belajar dengan mencoba, bukan sekadar membaca.</p>
        </div>
        <div
          className={`game-heading-icon ${completedCount === 3 ? 'badge-earned' : ''}`}
          title={completedCount === 3 ? 'Badge game selesai' : undefined}
        >
          <Icon name={completedCount === 3 ? 'trophy' : game.icon} size={34} />
        </div>
      </div>
      <nav className="mission-tabs" aria-label="Misi game">
        {game.missions.map((m, i) => {
          const done = completed.includes(`${game.id}/${m.id}`);
          return (
            <button
              key={m.id}
              className={i === level ? 'selected' : ''}
              aria-current={i === level ? 'step' : undefined}
              onClick={() => onLevel(i)}
            >
              <span className={`step-circle ${done ? 'done' : ''}`}>
                {done ? <Icon name="check" size={13} /> : `0${i + 1}`}
              </span>
              <span>{m.title}</span>
              <span className="mission-short">Misi {i + 1}</span>
            </button>
          );
        })}
      </nav>
      <section className="mission-brief" aria-labelledby="mission-title">
        <span className="brief-icon">
          <Icon name="target" size={20} />
        </span>
        <div>
          <p className="eyebrow">MISI {String(level + 1).padStart(2, '0')} / TUJUANMU</p>
          <h2 id="mission-title">{mission.title}</h2>
          <p>{mission.objective}</p>
        </div>
        {completed.includes(missionKey) && (
          <span className="completed-label">
            <Icon name="success" size={14} />
            Selesai
          </span>
        )}
      </section>
      <section className="workspace" aria-label="Arena dan kode">
        <div className="canvas-toolbar">
          <div>
            <span className="live-indicator" />
            <strong>Live preview</strong>
            <span className="canvas-caption">IDE → INTERAKSI</span>
          </div>
          <div className="canvas-actions">
            {game.id === 'responsive-rescue' ? (
              <label>
                <span className="sr-only">Lebar viewport preview</span>
                <select value={width} onChange={(e) => setWidth(Number(e.target.value))}>
                  {[375, 768, 1024].map((w) => (
                    <option key={w} value={w}>
                      {w}px
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="canvas-mode">
                <Icon name="code" size={14} />
                {game.language === 'javascript' ? 'JS RUNTIME' : 'CSS CANVAS'}
              </span>
            )}
          </div>
        </div>
        <div className={`canvas ${game.language === 'javascript' ? 'js-canvas' : ''}`}>
          <Arena>
            {game.language === 'javascript' ? (
              <QuestPreview
                key={level}
                scenarios={game.scenarios!(level)}
                traces={traces}
                busy={busy}
              />
            ) : (
              <Preview
                html={game.arenaHtml}
                base={game.arenaCss}
                code={code}
                mission={level}
                width={width}
              />
            )}
          </Arena>
          {game.id === 'motion-studio' && (
            <button
              className="test-motion text-button"
              onClick={() => {
                const frame = document.querySelector<HTMLIFrameElement>('.preview-scroll iframe');
                frame?.contentDocument?.querySelector<HTMLButtonElement>('.motion-button')?.focus();
              }}
            >
              <Icon name="play" size={14} />
              Uji interaksi
            </button>
          )}
        </div>
        <div className="editor-toolbar">
          <div className="workspace-tabs">
            {mission.controls.length > 0 && (
              <button aria-pressed={tab === 'controls'} onClick={() => setTab('controls')}>
                <Icon name="move" size={15} />
                Kontrol visual
              </button>
            )}
            <button aria-pressed={tab === 'code'} onClick={() => setTab('code')}>
              <Icon name="code" size={15} />
              {game.language === 'css' ? 'style.css' : 'state.js'}
            </button>
          </div>
          <div className="editor-status">
            {copyStatus ? (
              <span role="status">{copyStatus}</span>
            ) : (
              <span>{game.editable ? 'BOLEH DIEDIT' : 'MENGIKUTI KONTROL'}</span>
            )}
            <button className="icon-button" aria-label="Salin kode" onClick={copy}>
              <Icon name="copy" size={15} />
            </button>
          </div>
        </div>
        {tab === 'controls' ? (
          <div className="visual-controls">
            {manual && (
              <p className="control-warning">
                Kode sudah diedit. Reset untuk memakai kontrol visual kembali.
              </p>
            )}
            {mission.controls.map((control) => {
              const value = controlValue(code, control);
              return (
                <label className="visual-control" key={control.property}>
                  <span>
                    {control.label}
                    <code>{control.property}</code>
                  </span>
                  {control.type === 'number' ? (
                    <>
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={1}
                        value={parseFloat(value)}
                        disabled={manual}
                        onChange={(e) =>
                          update(changeControl(code, control, e.target.value), false)
                        }
                      />
                      <output>{value}</output>
                    </>
                  ) : (
                    <select
                      value={value}
                      disabled={manual}
                      onChange={(e) => update(changeControl(code, control, e.target.value), false)}
                    >
                      {control.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              );
            })}
            <p className="control-note">
              <Icon name="code" size={14} />
              Buka style.css untuk melihat kode di balik perubahanmu.
            </p>
          </div>
        ) : (
          <Suspense fallback={<div className="editor-loading">Memuat editor…</div>}>
            <CodeEditor
              value={code}
              language={game.language}
              readOnly={!game.editable}
              onChange={(next) => update(next, true)}
            />
          </Suspense>
        )}
        <div className="workspace-bottom">
          <span>
            <Icon name="shield" size={13} />
            Eksperimen lokal. Bebas mencoba.
          </span>
          <span>{game.language === 'css' ? 'CSS / LIVE' : 'JAVASCRIPT / WORKER'}</span>
        </div>
      </section>
      <div className="mission-actions">
        <div>
          <button
            className="button secondary"
            onClick={() => setHint((previous) => Math.min(previous + 1, 2))}
            disabled={hint === 2}
          >
            <Icon name="hint" />
            Petunjuk{hint > 0 ? ` ${hint}/2` : ''}
          </button>
          <button className="text-button" onClick={reset}>
            <Icon name="reset" size={16} />
            Reset
          </button>
        </div>
        <button className="button primary" onClick={run} disabled={busy}>
          <Icon name="play" size={17} />
          {busy
            ? 'Memeriksa…'
            : game.language === 'javascript'
              ? 'Jalankan & periksa'
              : 'Periksa hasil'}
          <kbd aria-hidden="true">↵</kbd>
        </button>
      </div>
      {hint > 0 && (
        <aside className="hint-panel" aria-label="Petunjuk">
          <Icon name="hint" size={20} />
          <div>
            {mission.hints.slice(0, hint).map((text, i) => (
              <p key={text}>
                <strong>0{i + 1}.</strong> {text}
              </p>
            ))}
          </div>
        </aside>
      )}
      <MissionFeedback
        feedbackRef={feedbackRef}
        error={error}
        feedback={feedback}
        mission={mission}
        game={game}
        level={level}
        onLevel={onLevel}
      />
      <section className="craft-section">
        <button className="craft-toggle" aria-expanded={craft} onClick={() => setCraft(!craft)}>
          <span>
            <Icon name="terminal" size={19} />
            <span>
              Di balik interaksi<small>Catatan frontend dari Riskiyanto</small>
            </span>
          </span>
          <Icon name={craft ? 'close' : 'down'} size={17} />
        </button>
        {craft && (
          <ul>
            {game.craft.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </section>
      <footer className="player-footer">
        <span>DIBUAT UNTUK RASA INGIN TAHU.</span>
        <a href="https://github.com/yannn-hash" target="_blank" rel="noreferrer">
          Riskiyanto <Icon name="arrowUp" size={13} />
        </a>
      </footer>
    </main>
  );
}
