/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { ComparisonStage } from './components/ComparisonStage';
import { Header } from './components/Header';
import { MethodologyBreakdown } from './components/MethodologyBreakdown';
import { ReviewNote, ReviewNotesPanel } from './components/ReviewNotesPanel';
import { NIELSEN_HEURISTICS, VERSIONS } from './data/versions';

const STORAGE_KEY = 'uiux_compare_review_notes_v1';

export default function App() {
  const [notes, setNotes] = useState<ReviewNote[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ReviewNote[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  const handleAddNote = (entry: Omit<ReviewNote, 'id' | 'createdAt'>) => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const next: ReviewNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: formatted,
      ...entry,
    };
    setNotes((prev) => [next, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleExportReport = () => {
    const lines: string[] = [
      '# UI/UX Iteration Comparison Report',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Hosted Deployments',
      ...VERSIONS.map(
        (v) => `- **${v.index}. ${v.name}** (${v.methodology}): ${v.url}`
      ),
      '',
      '## Evaluation Dimensions (Nielsen Heuristics & Intuitive Accounts)',
      ...NIELSEN_HEURISTICS.map(
        (h) =>
          `- **${h.code} · ${h.title}**\n  - Original Replica: ${h.originalBaseline}\n  - Version 1 (Intuitive Accounts): ${h.v1IntuitiveAccounts}\n  - Version 2 (Nielsen's 10 Heuristics): ${h.v2NielsenHeuristics}`
      ),
      '',
      '## Logged Usability Observations',
      ...(notes.length === 0
        ? ['_No custom observations recorded._']
        : notes.map((n) => {
            const v = VERSIONS.find((ver) => ver.id === n.versionId);
            return `- **[${v?.name ?? n.versionId}]** (${n.heuristic}, ${n.createdAt}): ${n.text}`;
          })),
      '',
    ];

    const blob = new Blob([lines.join('\n')], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'uiux-comparison-report.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header onExportReport={handleExportReport} />

      <main className="flex-1">
        <section className="w-full max-w-[1800px] mx-auto px-4 md:px-6 pt-7 pb-5">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
            <div className="max-w-3xl">
              <p className="text-xs font-medium text-slate-500">
                3 Live Deployments · Original Replica / Intuitive Accounts / Nielsen’s 10 Heuristics
              </p>
              <h1 className="mt-1.5 font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                Side-by-Side UI/UX Iteration Comparison
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
                Inspect all three live builds left-to-right across desktop, tablet, and mobile viewports—comparing Original Replica against Version 1 (Intuitive Accounts) and Version 2 (Nielsen’s 10 Heuristics).
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              {VERSIONS.map((v) => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-slate-200 hover:border-blue-400 rounded-lg px-3 py-2 transition-colors flex flex-col justify-between gap-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-500 tabular-nums truncate">
                      {v.index} · {v.shortName}
                    </span>
                    <ExternalLink
                      className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {v.methodology}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <ComparisonStage />

        <MethodologyBreakdown />

        <ReviewNotesPanel
          notes={notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          onExportReport={handleExportReport}
        />
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            UI/UX Iteration Compare · Side-by-side hosting for Original Replica, Version 1, and Version 2
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {VERSIONS.map((v) => (
              <a
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition-colors font-medium"
              >
                {v.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
