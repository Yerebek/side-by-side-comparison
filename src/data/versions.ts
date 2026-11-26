export type VersionId = 'original' | 'v1' | 'v2';

export interface VersionSpec {
  id: VersionId;
  index: string;
  name: string;
  shortName: string;
  methodology: string;
  url: string;
  hostLabel: string;
  summary: string;
  primaryFocus: string[];
  tradeoffs: string;
}

export interface HeuristicItem {
  code: string;
  title: string;
  principle: string;
  originalBaseline: string;
  v1IntuitiveAccounts: string;
  v2NielsenHeuristics: string;
}

export const VERSIONS: VersionSpec[] = [
  {
    id: 'original',
    index: '01',
    name: 'Original Replica',
    shortName: 'Original',
    methodology: 'Baseline Reference',
    url: 'https://original-replica-beta.vercel.app/',
    hostLabel: 'original-replica-beta.vercel.app',
    summary:
      'Faithful baseline replica establishing the initial information architecture, navigation patterns, and core task flows prior to targeted UX interventions.',
    primaryFocus: [
      'Initial layout structure and component density',
      'Standard form and navigation controls',
      'Unmodified visual hierarchy and spacing rhythm',
    ],
    tradeoffs: 'Serves as the control benchmark for evaluating downstream usability gains.',
  },
  {
    id: 'v1',
    index: '02',
    name: 'Version 1',
    shortName: 'Version 1',
    methodology: 'Built Using Intuitive Accounts',
    url: 'https://original-replica-qojp.vercel.app/',
    hostLabel: 'original-replica-qojp.vercel.app',
    summary:
      'Refines account-centric workflows, identity clarity, and progressive disclosure so users navigate sign-in, profile state, and primary tasks with lower cognitive friction.',
    primaryFocus: [
      'Intuitive Accounts mental model for identity and session clarity',
      'Streamlined onboarding and contextual entry points',
      'Reduced friction across account actions and state transitions',
    ],
    tradeoffs: 'Prioritizes account flow intuition over exhaustive system-wide heuristic coverage.',
  },
  {
    id: 'v2',
    index: '03',
    name: 'Version 2',
    shortName: 'Version 2',
    methodology: "Built Using Nielsen's 10 Heuristics",
    url: 'https://enhancedversion2.vercel.app/',
    hostLabel: 'enhancedversion2.vercel.app',
    summary:
      "Systematically audited and redesigned against Jakob Nielsen's 10 Usability Heuristics—strengthening status visibility, error prevention, user control, and visual restraint.",
    primaryFocus: [
      'Explicit system status feedback and predictable state cues',
      'Error prevention, clear recovery paths, and undo/exit safety',
      'Consistent standards, recognition over recall, and minimalist layout',
    ],
    tradeoffs: 'Introduces structured guardrails and feedback cues across all primary workflows.',
  },
];

export const NIELSEN_HEURISTICS: HeuristicItem[] = [
  {
    code: 'H1',
    title: 'Visibility of System Status',
    principle: 'Keep users informed about what is going on through timely, clear feedback.',
    originalBaseline: 'Minimal state indicators during navigation and form submission.',
    v1IntuitiveAccounts: 'Clear account session and authentication state awareness.',
    v2NielsenHeuristics: 'Explicit progress cues, active step indicators, and immediate action confirmation.',
  },
  {
    code: 'H2',
    title: 'Match Between System & Real World',
    principle: 'Speak the users’ language with familiar concepts and logical ordering.',
    originalBaseline: 'Mixes interface-centric terminology with standard labels.',
    v1IntuitiveAccounts: 'Reframes account steps around everyday user intentions.',
    v2NielsenHeuristics: 'Plain, domain-natural copy and task sequencing aligned to user expectations.',
  },
  {
    code: 'H3',
    title: 'User Control & Freedom',
    principle: 'Support clearly marked emergency exits, back navigation, and undo actions.',
    originalBaseline: 'Standard browser navigation with limited inline escape hatches.',
    v1IntuitiveAccounts: 'Easier switching and cancellation within account prompts.',
    v2NielsenHeuristics: 'Dedicated cancel, reset, and reversible state controls on key interactions.',
  },
  {
    code: 'H4',
    title: 'Consistency & Standards',
    principle: 'Follow platform conventions so users never wonder whether different words mean the same thing.',
    originalBaseline: 'Occasional variation in control styling and label conventions.',
    v1IntuitiveAccounts: 'Unified patterns across account entry and profile screens.',
    v2NielsenHeuristics: 'Cohesive button hierarchy, spacing scale, and standardized interaction patterns.',
  },
  {
    code: 'H5',
    title: 'Error Prevention',
    principle: 'Eliminate error-prone conditions or check with users before committing destructive actions.',
    originalBaseline: 'Relies primarily on post-submit validation.',
    v1IntuitiveAccounts: 'Guides account inputs to minimize credential and setup mistakes.',
    v2NielsenHeuristics: 'Inline constraints, sensible defaults, and proactive validation guards.',
  },
  {
    code: 'H6',
    title: 'Recognition Rather Than Recall',
    principle: 'Minimize memory load by making options, actions, and context visible.',
    originalBaseline: 'Requires users to remember prior selections across views.',
    v1IntuitiveAccounts: 'Surfaces active account context where actions occur.',
    v2NielsenHeuristics: 'Persistent context headers, visible affordances, and clear option labels.',
  },
  {
    code: 'H7',
    title: 'Flexibility & Efficiency of Use',
    principle: 'Accelerate frequent actions for experienced users while remaining approachable for novices.',
    originalBaseline: 'Single fixed path through primary workflows.',
    v1IntuitiveAccounts: 'Streamlined repeat sign-in and account switching paths.',
    v2NielsenHeuristics: 'Direct shortcuts, scannable layouts, and fast-path controls.',
  },
  {
    code: 'H8',
    title: 'Aesthetic & Minimalist Design',
    principle: 'Keep interfaces free of irrelevant information that competes with primary tasks.',
    originalBaseline: 'Baseline visual density with standard structural chrome.',
    v1IntuitiveAccounts: 'Cleaner focus around account and primary task surfaces.',
    v2NielsenHeuristics: 'High signal-to-noise typography, generous whitespace, and zero clutter.',
  },
  {
    code: 'H9',
    title: 'Help Users Recognize, Diagnose & Recover from Errors',
    principle: 'Express error messages in plain language, indicate the problem, and suggest a solution.',
    originalBaseline: 'Generic validation feedback with limited corrective guidance.',
    v1IntuitiveAccounts: 'Actionable recovery prompts for account and access issues.',
    v2NielsenHeuristics: 'Human-readable inline diagnostics paired with direct corrective actions.',
  },
  {
    code: 'H10',
    title: 'Help & Documentation',
    principle: 'Provide concise, searchable, task-focused help right when users need it.',
    originalBaseline: 'Minimal contextual assistance.',
    v1IntuitiveAccounts: 'Inline helper cues around account fields and permissions.',
    v2NielsenHeuristics: 'Contextual guidance embedded directly beside non-obvious controls.',
  },
];
