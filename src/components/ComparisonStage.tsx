import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  X,
} from 'lucide-react';
import { VERSIONS, VersionId, VersionSpec } from '../data/versions';

type LayoutMode = '3-up' | '2-up' | 'focus';
type ViewportPreset = 'fit' | 'desktop' | 'tablet' | 'mobile';
type FrameHeight = 620 | 760 | 900;

const PRESET_WIDTHS: Record<Exclude<ViewportPreset, 'fit'>, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 390,
};

interface VersionPaneProps {
  version: VersionSpec;
  viewportPreset: ViewportPreset;
  frameHeight: FrameHeight;
  globalReloadTick: number;
  onExpand: (id: VersionId) => void;
}

function VersionPane({
  version,
  viewportPreset,
  frameHeight,
  globalReloadTick,
  onExpand,
}: VersionPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(480);
  const [reloadCount, setReloadCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSlowNotice, setShowSlowNotice] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setShowSlowNotice(false);
    const timer = window.setTimeout(() => {
      setShowSlowNotice(true);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [reloadCount, globalReloadTick]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(version.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const targetWidth =
    viewportPreset === 'fit' ? containerWidth : PRESET_WIDTHS[viewportPreset];
  const scale =
    viewportPreset === 'fit'
      ? 1
      : Math.min(1, containerWidth / targetWidth);
  const scaledIframeHeight =
    scale < 1 ? Math.round(frameHeight / scale) : frameHeight;

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      <div className="px-3.5 py-3 border-b border-slate-200 flex items-start justify-between gap-2 bg-white">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-mono text-xs font-medium text-slate-500 tabular-nums shrink-0">
              {version.index}
            </span>
            <h3 className="font-display text-sm xl:text-base font-semibold text-slate-900 truncate">
              {version.name}
            </h3>
          </div>

          <p className="mt-0.5 text-xs font-medium text-slate-600 truncate">
            {version.methodology}
          </p>

          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono truncate">
            <span className="truncate">{version.hostLabel}</span>
            {viewportPreset !== 'fit' && (
              <>
                <span aria-hidden="true" className="text-slate-300 shrink-0">
                  ·
                </span>
                <span className="tabular-nums shrink-0 text-slate-500">
                  {targetWidth}px ({Math.round(scale * 100)}%)
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setReloadCount((c) => c + 1)}
            title={`Reload ${version.name}`}
            aria-label={`Reload ${version.name}`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleCopyUrl}
            title={`Copy URL for ${version.name}`}
            aria-label={`Copy URL for ${version.name}`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onExpand(version.id)}
            title={`Expand ${version.name} fullscreen`}
            aria-label={`Expand ${version.name} fullscreen`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <a
            href={version.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${version.name} in new tab`}
            aria-label={`Open ${version.name} in new tab`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-slate-100 overflow-hidden flex justify-center"
        style={{ height: `${frameHeight}px` }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/95 px-6 text-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-700">
              Loading {version.name}
            </p>
            <p className="mt-1 text-xs font-mono text-slate-500">
              {version.hostLabel}
            </p>
            {showSlowNotice && (
              <div className="mt-4 max-w-xs text-xs text-slate-600 space-y-2">
                <p>
                  Still connecting or blocked from embedding by browser frame
                  policies.
                </p>
                <a
                  href={version.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-slate-200 rounded-md hover:border-blue-300 transition-colors"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        )}

        <div
          className="h-full origin-top bg-white"
          style={
            viewportPreset === 'fit'
              ? { width: '100%', height: `${frameHeight}px` }
              : {
                  width: `${targetWidth}px`,
                  height: `${scaledIframeHeight}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  boxShadow:
                    scale < 1 ? '0 0 0 1px rgba(15, 23, 42, 0.08)' : undefined,
                }
          }
        >
          <iframe
            key={`${version.id}-${reloadCount}-${globalReloadTick}`}
            src={version.url}
            title={`${version.name} — ${version.methodology}`}
            onLoad={() => setIsLoaded(true)}
            className="w-full h-full border-0 bg-white"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4 text-xs text-slate-600">
        <span className="truncate">{version.tradeoffs}</span>
        <a
          href={version.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0 inline-flex items-center gap-1"
        >
          <span>Launch</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function ComparisonStage() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('3-up');
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>('desktop');
  const [frameHeight, setFrameHeight] = useState<FrameHeight>(760);
  const [twoUpPair, setTwoUpPair] = useState<[VersionId, VersionId]>([
    'original',
    'v2',
  ]);
  const [focusId, setFocusId] = useState<VersionId>('v2');
  const [globalReloadTick, setGlobalReloadTick] = useState(0);
  const [expandedId, setExpandedId] = useState<VersionId | null>(null);

  useEffect(() => {
    if (!expandedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedId]);

  const visibleVersions: VersionSpec[] =
    layoutMode === '3-up'
      ? VERSIONS
      : layoutMode === '2-up'
      ? twoUpPair
          .map((id) => VERSIONS.find((v) => v.id === id))
          .filter((v): v is VersionSpec => Boolean(v))
      : VERSIONS.filter((v) => v.id === focusId);

  const expandedVersion = expandedId
    ? VERSIONS.find((v) => v.id === expandedId) ?? null
    : null;

  return (
    <section id="live-stage" className="w-full max-w-[1800px] mx-auto px-4 md:px-6 pb-16">
      <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Comparison layout mode"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              onClick={() => setLayoutMode('3-up')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                layoutMode === '3-up'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3-Up Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('2-up')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                layoutMode === '2-up'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2-Up Compare
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('focus')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                layoutMode === 'focus'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Single Focus
            </button>
          </div>

          {layoutMode === '2-up' && (
            <div className="flex items-center gap-2 text-xs">
              <label className="sr-only" htmlFor="left-pane-select">
                Left version
              </label>
              <select
                id="left-pane-select"
                value={twoUpPair[0]}
                onChange={(e) =>
                  setTwoUpPair([e.target.value as VersionId, twoUpPair[1]])
                }
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {VERSIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    Left: {v.name}
                  </option>
                ))}
              </select>
              <span className="text-slate-400">vs</span>
              <label className="sr-only" htmlFor="right-pane-select">
                Right version
              </label>
              <select
                id="right-pane-select"
                value={twoUpPair[1]}
                onChange={(e) =>
                  setTwoUpPair([twoUpPair[0], e.target.value as VersionId])
                }
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {VERSIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    Right: {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {layoutMode === 'focus' && (
            <div
              role="group"
              aria-label="Select version to focus"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
            >
              {VERSIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setFocusId(v.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    focusId === v.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {v.shortName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Simulated viewport width"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              onClick={() => setViewportPreset('desktop')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewportPreset === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">1440px</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportPreset('tablet')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewportPreset === 'tablet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">768px</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportPreset('mobile')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewportPreset === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">390px</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportPreset('fit')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewportPreset === 'fit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fit Pane
            </button>
          </div>

          <div
            role="group"
            aria-label="Preview frame height"
            className="hidden sm:inline-flex items-center p-1 bg-slate-100 rounded-lg"
          >
            {([620, 760, 900] as FrameHeight[]).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setFrameHeight(h)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors tabular-nums whitespace-nowrap shrink-0 cursor-pointer ${
                  frameHeight === h
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {h}px
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setGlobalReloadTick((t) => t + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reload All</span>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div
          className={`grid gap-3 md:gap-4 ${
            layoutMode === '3-up'
              ? 'grid-cols-3 min-w-[780px]'
              : layoutMode === '2-up'
              ? 'grid-cols-2 min-w-[540px]'
              : 'grid-cols-1'
          }`}
        >
          {visibleVersions.map((version, idx) => (
            <VersionPane
              key={`${version.id}-${idx}`}
              version={version}
              viewportPreset={viewportPreset}
              frameHeight={frameHeight}
              globalReloadTick={globalReloadTick}
              onExpand={setExpandedId}
            />
          ))}
        </div>
      </div>

      {expandedVersion && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen preview of ${expandedVersion.name}`}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-4 md:p-6 flex flex-col"
        >
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  role="group"
                  aria-label="Switch fullscreen version"
                  className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
                >
                  {VERSIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setExpandedId(v.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        expandedVersion.id === v.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {v.index} · {v.shortName}
                    </button>
                  ))}
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 truncate">
                  <span className="font-medium text-slate-800">
                    {expandedVersion.methodology}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono truncate">
                    {expandedVersion.hostLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={expandedVersion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setExpandedId(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Close</span>
                  <X className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-slate-100">
              <iframe
                key={`modal-${expandedVersion.id}`}
                src={expandedVersion.url}
                title={`Fullscreen: ${expandedVersion.name}`}
                className="w-full h-full border-0 bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
