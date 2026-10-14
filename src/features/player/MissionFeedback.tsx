import type { RefObject } from 'react';
import type {
  MissionDefinition,
  GameDefinition,
  ValidationResult,
} from '../../shared/contracts/game';
import { Icon } from '../../shared/ui/Icon';
interface Props {
  feedbackRef: RefObject<HTMLDivElement | null>;
  error: string;
  feedback: ValidationResult | null;
  mission: MissionDefinition;
  game: GameDefinition;
  level: number;
  onLevel: (level: number) => void;
}
export default function MissionFeedback({
  feedbackRef,
  error,
  feedback,
  mission,
  game,
  level,
  onLevel,
}: Props) {
  return (
    <div className="feedback" ref={feedbackRef} tabIndex={-1} aria-live="polite" aria-atomic="true">
      {error && (
        <div className="error-feedback">
          <Icon name="error" />
          <div>
            <strong>Kode perlu diperiksa.</strong>
            <p>{error}</p>
          </div>
        </div>
      )}
      {feedback && (
        <div className={feedback.passed ? 'success-feedback' : 'check-feedback'}>
          <div className="feedback-heading">
            <Icon name={feedback.passed ? 'success' : 'target'} size={24} />
            <div>
              <strong>
                {feedback.passed
                  ? 'Misi selesai. Konsepnya mulai terasa!'
                  : 'Hampir sampai. Coba satu perubahan lagi.'}
              </strong>
              <p>
                {feedback.passed
                  ? mission.explanation
                  : 'Lihat pemeriksaan berikut untuk menemukan bagian yang perlu diubah.'}
              </p>
            </div>
          </div>
          <ul>
            {feedback.checks.map((item) => (
              <li key={item.id}>
                <Icon name={item.passed ? 'check' : 'error'} size={16} />
                <div>
                  <strong>{item.label}</strong>
                  {!item.passed && <p>{item.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
          {feedback.passed &&
            (level < 2 ? (
              <button className="button primary" onClick={() => onLevel(level + 1)}>
                Misi berikutnya
                <Icon name="arrowRight" />
              </button>
            ) : (
              <div className="badge-message">
                <Icon name="trophy" />
                Tiga misi selesai. Badge {game.title} menjadi milikmu.
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
