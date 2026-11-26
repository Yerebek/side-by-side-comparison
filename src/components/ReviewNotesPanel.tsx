import { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import { VERSIONS, VersionId } from '../data/versions';

export interface ReviewNote {
  id: string;
  versionId: VersionId;
  heuristic: string;
  text: string;
  createdAt: string;
}

interface ReviewNotesPanelProps {
  notes: ReviewNote[];
  onAddNote: (note: Omit<ReviewNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (id: string) => void;
  onExportReport: () => void;
}

export function ReviewNotesPanel({
  notes,
  onAddNote,
  onDeleteNote,
  onExportReport,
}: ReviewNotesPanelProps) {
  const [versionId, setVersionId] = useState<VersionId>('v2');
  const [heuristic, setHeuristic] = useState('General Observation');
  const [text, setText] = useState('');
  const [filterVersion, setFilterVersion] = useState<'all' | VersionId>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddNote({ versionId, heuristic, text: trimmed });
    setText('');
  };

  const visibleNotes =
    filterVersion === 'all'
      ? notes
      : notes.filter((n) => n.versionId === filterVersion);

  return (
    <section
      id="review-notes"
      className="max-w-[1600px] mx-auto px-6 pb-20 pt-8 border-t border-slate-200"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-slate-500">
            Critique Workspace · Saved Locally
          </p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Side-by-Side Usability Review Notes
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
            Record observations while testing the three live builds above, then export a structured Markdown comparison report.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportReport}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Download Markdown Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="note-version"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Target Version
            </label>
            <select
              id="note-version"
              value={versionId}
              onChange={(e) => setVersionId(e.target.value as VersionId)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.index} · {v.name} ({v.methodology})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="note-category"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Evaluation Dimension
            </label>
            <select
              id="note-category"
              value={heuristic}
              onChange={(e) => setHeuristic(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <option value="General Observation">General Observation</option>
              <option value="Intuitive Accounts Flow">
                Intuitive Accounts Flow
              </option>
              <option value="H1 · Visibility of System Status">
                H1 · Visibility of System Status
              </option>
              <option value="H2 · Match System & Real World">
                H2 · Match System & Real World
              </option>
              <option value="H3 · User Control & Freedom">
                H3 · User Control & Freedom
              </option>
              <option value="H4 · Consistency & Standards">
                H4 · Consistency & Standards
              </option>
              <option value="H5 · Error Prevention">H5 · Error Prevention</option>
              <option value="H6 · Recognition Rather Than Recall">
                H6 · Recognition Rather Than Recall
              </option>
              <option value="H7 · Flexibility & Efficiency">
                H7 · Flexibility & Efficiency
              </option>
              <option value="H8 · Aesthetic & Minimalist Design">
                H8 · Aesthetic & Minimalist Design
              </option>
              <option value="H9 · Error Recovery">H9 · Error Recovery</option>
              <option value="H10 · Help & Documentation">
                H10 · Help & Documentation
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="note-text"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Observation
            </label>
            <textarea
              id="note-text"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Document a specific UX improvement, friction point, or visual difference..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Observation</span>
          </button>
        </form>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-900 tabular-nums">
              Logged Observations ({visibleNotes.length})
            </span>

            <div
              role="group"
              aria-label="Filter observations by version"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
            >
              <button
                type="button"
                onClick={() => setFilterVersion('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterVersion === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {VERSIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setFilterVersion(v.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filterVersion === v.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {v.shortName}
                </button>
              ))}
            </div>
          </div>

          {visibleNotes.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                No observations logged yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Add your first note on the left as you compare the three live versions above.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {visibleNotes.map((note) => {
                const version = VERSIONS.find((v) => v.id === note.versionId);
                return (
                  <li
                    key={note.id}
                    className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">
                          {version?.name ?? note.versionId}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{note.heuristic}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {note.createdAt}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                        {note.text}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      aria-label="Delete observation"
                      title="Delete observation"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
