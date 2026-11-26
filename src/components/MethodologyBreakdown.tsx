import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { NIELSEN_HEURISTICS, VERSIONS } from '../data/versions';

export function MethodologyBreakdown() {
  const [query, setQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState<string>('ALL');

  const filteredHeuristics = NIELSEN_HEURISTICS.filter((h) => {
    const matchesCode = selectedCode === 'ALL' || h.code === selectedCode;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      h.title.toLowerCase().includes(q) ||
      h.principle.toLowerCase().includes(q) ||
      h.v1IntuitiveAccounts.toLowerCase().includes(q) ||
      h.v2NielsenHeuristics.toLowerCase().includes(q);
    return matchesCode && matchesQuery;
  });

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 space-y-16 pb-16">
      <section id="methodology" className="pt-8 border-t border-slate-200">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-medium text-slate-500">
            Iteration Architecture · 01 through 03
          </p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Three Progressive Approaches to the Same Experience
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
            Each deployment isolates a distinct UX intervention—from the unmodified baseline to Intuitive Accounts workflows and a full Nielsen heuristics overhaul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {VERSIONS.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs font-medium text-slate-500 tabular-nums">
                    {v.index} · {v.shortName}
                  </span>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>

                <h3 className="mt-3 font-display text-xl font-semibold text-slate-900">
                  {v.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {v.methodology}
                </p>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {v.summary}
                </p>

                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 mb-2.5">
                    Key Design Focus
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {v.primaryFocus.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="text-slate-400 select-none"
                        >
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-slate-500 truncate">
                  {v.hostLabel}
                </span>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-900 hover:text-blue-600 whitespace-nowrap shrink-0"
                >
                  Open Live Build
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="heuristics" className="pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500">
              Usability Evaluation · H1–H10 Framework
            </p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Side-by-Side Heuristic & Account Flow Matrix
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
              Filter across Jakob Nielsen’s 10 Usability Heuristics to compare how the Original Replica, Version 1 (Intuitive Accounts), and Version 2 (Nielsen’s 10 Heuristics) handle each principle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter heuristics..."
                aria-label="Filter heuristics"
                className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 w-56 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
            </div>

            <label htmlFor="heuristic-select" className="sr-only">
              Filter by heuristic code
            </label>
            <select
              id="heuristic-select"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <option value="ALL">All 10 Heuristics</option>
              {NIELSEN_HEURISTICS.map((h) => (
                <option key={h.code} value={h.code}>
                  {h.code} · {h.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[840px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4 w-[24%]">Heuristic</th>
                  <th className="py-3.5 px-4 w-[24%]">
                    01 · Original Replica
                  </th>
                  <th className="py-3.5 px-4 w-[26%]">
                    02 · Version 1 (Intuitive Accounts)
                  </th>
                  <th className="py-3.5 px-4 w-[26%]">
                    03 · Version 2 (Nielsen’s 10 Heuristics)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredHeuristics.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 px-4 text-center text-slate-500"
                    >
                      No heuristics match your filter.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('');
                          setSelectedCode('ALL');
                        }}
                        className="text-blue-600 font-medium hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredHeuristics.map((item) => (
                    <tr
                      key={item.code}
                      className="hover:bg-slate-50/70 transition-colors align-top"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-xs font-medium text-blue-600 tabular-nums shrink-0">
                            {item.code}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {item.title}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {item.principle}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-slate-600 leading-relaxed">
                        {item.originalBaseline}
                      </td>
                      <td className="py-4 px-4 text-slate-700 leading-relaxed">
                        {item.v1IntuitiveAccounts}
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-medium leading-relaxed">
                        {item.v2NielsenHeuristics}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
