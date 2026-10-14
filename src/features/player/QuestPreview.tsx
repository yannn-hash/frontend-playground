import './quest.css';
import { useState } from 'react';
import type { QuestScenario, QuestState } from '../../shared/contracts/game';
import { Icon } from '../../shared/ui/Icon';
export default function QuestPreview({
  scenarios,
  traces,
  busy,
}: {
  scenarios: QuestScenario[];
  traces?: QuestState[][];
  busy: boolean;
}) {
  const [index, setIndex] = useState(0);
  const trace = traces?.[index];
  const latest = trace?.at(-1);
  return (
    <div className="quest-preview">
      <div className="quest-system">
        <span className="status-dot" />
        <span>DELIVERY SERVICE / SANDBOX</span>
        <span className="quest-status">
          {busy ? 'RUNNING' : (latest?.status?.toUpperCase() ?? 'IDLE')}
        </span>
      </div>
      <div className="quest-center">
        <span className={`quest-glyph ${latest?.status ?? ''}`}>
          <Icon
            name={
              latest?.status === 'success'
                ? 'checks'
                : latest?.status === 'error'
                  ? 'error'
                  : 'route'
            }
            size={40}
          />
        </span>
        <h3>
          {busy
            ? 'Menjalankan skenario…'
            : latest?.status === 'success'
              ? 'Permintaan sampai.'
              : latest?.status === 'error'
                ? 'Saatnya mencoba lagi.'
                : 'Setiap kejadian punya arah.'}
        </h3>
        <p>
          Edit nextState, lalu jalankan kode.
          <br />
          Lihat bagaimana state berpindah.
        </p>
      </div>
      <div className="quest-scenarios" aria-label="Skenario">
        {scenarios.map((scenario, i) => (
          <button key={scenario.name} aria-pressed={index === i} onClick={() => setIndex(i)}>
            Skenario {i + 1}
          </button>
        ))}
      </div>
      <div className="event-trace">
        {scenarios[index]?.events.map((event, i) => (
          <div key={i}>
            <span className="event-index">0{i + 1}</span>
            <code>{event.type}</code>
            <span className="event-request">#{event.requestId}</span>
            <Icon name="arrowRight" size={14} />
            <span className={`state-label ${trace?.[i]?.status ?? ''}`}>
              {trace?.[i]?.status ?? '?'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
