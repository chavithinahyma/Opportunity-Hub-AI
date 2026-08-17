import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft, ArrowRight, Bell, Bookmark, BriefcaseBusiness, CalendarDays, Check,
  CheckCircle2, ChevronRight, Clock3, Compass, ExternalLink, FileCheck2, Filter,
  FolderHeart, GraduationCap, LayoutDashboard, Lightbulb, MapPin, RefreshCw, Search,
  Send, ShieldCheck, Sparkles, Target, Trophy, Users, X, Zap,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';

const queryClient = new QueryClient();
const SAVED_KEY = 'opportunity-hub-saved';
const APPLICATIONS_KEY = 'opportunity-hub-applications';
const PROFILE_KEY = 'opportunity-hub-profile';
const LAST_REFRESH_KEY = 'opportunity-hub-last-refresh';

type Category = 'Government' | 'Hackathon' | 'Internship' | 'Private job';
type CycleStatus = 'open' | 'upcoming' | 'not-announced';
type YearCycle = { year: number; status: CycleStatus; note: string };
type Opportunity = {
  id: string;
  title: string;
  company: string;
  category: Category;
  location: string;
  workMode: string;
  description: string;
  longDescription: string;
  deadline: string;
  match: number;
  skills: string[];
  posted: string;
  applyUrl: string;
  featured: boolean;
  accent: string;
  sourceName: string;
  sourceType: 'Official source' | 'Official company page';
  currentStatus: CycleStatus;
  statusNote: string;
  cycles: YearCycle[];
};
type Application = { opportunityId: string; appliedAt: string; status: string };
type Notice = { message: string; kind?: 'success' | 'info' };

const currentYear = new Date().getFullYear();
const reviewedDate = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric',
}).format(new Date());

// These are official portals, not scraped or invented listings. A job is only
// shown as open when the source page is available for the user to verify.
const opportunities: Opportunity[] = [
  {
    id: 'ncs-jobs',
    title: 'National Career Service jobs',
    company: 'Government of India · NCS',
    category: 'Government',
    location: 'Across India',
    workMode: 'Multiple work modes',
    description: 'Search verified employer and government job listings on India’s official career service.',
    longDescription: 'National Career Service is the Government of India’s employment and career platform. Use the official search to check employer details, eligibility, location, and the closing date before applying.',
    deadline: 'Varies by listing',
    match: 95,
    skills: ['Search & filter', 'Profile', 'Eligibility check'],
    posted: 'Daily source check',
    applyUrl: 'https://www.ncs.gov.in/',
    featured: true,
    accent: '#ef9f71',
    sourceName: 'ncs.gov.in',
    sourceType: 'Official source',
    currentStatus: 'open',
    statusNote: 'Listings change throughout the year; verify each listing on NCS.',
    cycles: [
      { year: currentYear, status: 'open', note: 'Live listings can be available now' },
      { year: currentYear + 1, status: 'upcoming', note: 'Expected to continue year-round' },
      { year: currentYear + 2, status: 'upcoming', note: 'Expected to continue year-round' },
    ],
  },
  {
    id: 'upsc-active',
    title: 'UPSC examinations',
    company: 'Union Public Service Commission',
    category: 'Government',
    location: 'Across India',
    workMode: 'On-site / as notified',
    description: 'Track official UPSC exam notifications, calendars, eligibility, and application windows.',
    longDescription: 'UPSC publishes its examination calendar and notices on its official website. Dates can change, so the official notification is the only final source for eligibility, fees, and application deadlines.',
    deadline: 'See current notification',
    match: 91,
    skills: ['Eligibility', 'Exam calendar', 'Official notice'],
    posted: 'Calendar-based',
    applyUrl: 'https://upsc.gov.in/examinations/active-exams',
    featured: true,
    accent: '#7bc6b2',
    sourceName: 'upsc.gov.in',
    sourceType: 'Official source',
    currentStatus: 'open',
    statusNote: 'Active exams and dates are controlled by UPSC notices.',
    cycles: [
      { year: currentYear, status: 'open', note: 'Check active exams and current notices' },
      { year: currentYear + 1, status: 'upcoming', note: 'Annual calendar expected; date not final' },
      { year: currentYear + 2, status: 'upcoming', note: 'Annual cycle expected; not announced' },
    ],
  },
  {
    id: 'ssc-portal',
    title: 'SSC recruitment notifications',
    company: 'Staff Selection Commission',
    category: 'Government',
    location: 'Across India',
    workMode: 'As notified',
    description: 'Follow official SSC recruitment notices instead of relying on forwarded messages or old dates.',
    longDescription: 'The SSC portal is the source of truth for CGL, CHSL, MTS, GD, and other recruitment notices. Open the official portal to check the live notice, eligibility, fee, and application window.',
    deadline: 'See current notification',
    match: 90,
    skills: ['Government exams', 'Eligibility', 'Application form'],
    posted: 'Calendar-based',
    applyUrl: 'https://ssc.gov.in/',
    featured: true,
    accent: '#d7ad54',
    sourceName: 'ssc.gov.in',
    sourceType: 'Official source',
    currentStatus: 'open',
    statusNote: 'Recruitments open only when SSC publishes a notice.',
    cycles: [
      { year: currentYear, status: 'open', note: 'Check the latest SSC calendar' },
      { year: currentYear + 1, status: 'upcoming', note: 'Likely annual recruitment cycle' },
      { year: currentYear + 2, status: 'upcoming', note: 'Not announced yet' },
    ],
  },
  {
    id: 'smart-india-hackathon',
    title: 'Smart India Hackathon',
    company: 'Ministry of Education · Innovation Cell',
    category: 'Hackathon',
    location: 'India · online and host institutions',
    workMode: 'Team-based',
    description: 'Find official problem statements and participation updates for India’s national innovation hackathon.',
    longDescription: 'Smart India Hackathon invites student teams to work on real-world challenges shared by ministries, public organisations, and industry partners. Use the official portal to confirm the latest edition, eligibility, team rules, problem statements, and registration window.',
    deadline: 'See official announcement',
    match: 88,
    skills: ['Problem solving', 'Teamwork', 'Social impact'],
    posted: 'Edition-based',
    applyUrl: 'https://www.sih.gov.in/',
    featured: false,
    accent: '#e8a66f',
    sourceName: 'sih.gov.in',
    sourceType: 'Official source',
    currentStatus: 'not-announced',
    statusNote: 'Participation opens only when the Innovation Cell publishes an official edition notice.',
    cycles: [
      { year: currentYear, status: 'not-announced', note: 'Check the official portal for the current edition' },
      { year: currentYear + 1, status: 'upcoming', note: 'A future edition may be announced; not confirmed' },
      { year: currentYear + 2, status: 'upcoming', note: 'Future participation is not announced' },
    ],
  },
  {
    id: 'isro-careers',
    title: 'ISRO careers',
    company: 'Indian Space Research Organisation',
    category: 'Private job',
    location: 'India · role dependent',
    workMode: 'As notified',
    description: 'Check official ISRO career notices for technical and scientific opportunities.',
    longDescription: 'ISRO recruitment happens through official notices and role-specific eligibility. We link directly to the organisation’s careers page so you can confirm whether a role is still open before applying.',
    deadline: 'See official notice',
    match: 86,
    skills: ['Engineering', 'Science', 'Technical roles'],
    posted: 'Source check required',
    applyUrl: 'https://www.isro.gov.in/Careers.html',
    featured: false,
    accent: '#a7b3e7',
    sourceName: 'isro.gov.in',
    sourceType: 'Official source',
    currentStatus: 'not-announced',
    statusNote: 'No universal opening is claimed; check the latest official notice.',
    cycles: [
      { year: currentYear, status: 'not-announced', note: 'Opening depends on official notice' },
      { year: currentYear + 1, status: 'upcoming', note: 'Possible future recruitment; not confirmed' },
      { year: currentYear + 2, status: 'upcoming', note: 'Possible future recruitment; not confirmed' },
    ],
  },
  {
    id: 'tcs-careers',
    title: 'TCS careers',
    company: 'Tata Consultancy Services',
    category: 'Private job',
    location: 'India · role dependent',
    workMode: 'On-site / Hybrid / Remote',
    description: 'Browse current roles and graduate programmes on the company’s own careers site.',
    longDescription: 'This card is a verified entry point to TCS’s official careers pages, not a promise that a particular job is open. Always confirm the job ID, eligibility, location, and closing date on the source page.',
    deadline: 'Varies by listing',
    match: 83,
    skills: ['Technology', 'Graduate roles', 'Professional roles'],
    posted: 'Source check required',
    applyUrl: 'https://www.tcs.com/careers',
    featured: false,
    accent: '#8fc8dc',
    sourceName: 'tcs.com/careers',
    sourceType: 'Official company page',
    currentStatus: 'open',
    statusNote: 'Current openings vary by role and location.',
    cycles: [
      { year: currentYear, status: 'open', note: 'Check live roles on the company page' },
      { year: currentYear + 1, status: 'upcoming', note: 'New roles may be posted; not guaranteed' },
      { year: currentYear + 2, status: 'upcoming', note: 'Future hiring is not announced' },
    ],
  },
  {
    id: 'google-careers',
    title: 'Google careers',
    company: 'Google',
    category: 'Private job',
    location: 'India & global · role dependent',
    workMode: 'Role dependent',
    description: 'Find current jobs and internships through Google’s official jobs search.',
    longDescription: 'Use the official Google jobs search for live role details. Availability, location, and eligibility can change quickly; this hub never treats an old social post as a live opening.',
    deadline: 'Varies by listing',
    match: 80,
    skills: ['Software', 'Data', 'Product & design'],
    posted: 'Daily source check',
    applyUrl: 'https://www.google.com/about/careers/applications/jobs/results/',
    featured: false,
    accent: '#d9a6c3',
    sourceName: 'google.com/careers',
    sourceType: 'Official company page',
    currentStatus: 'open',
    statusNote: 'Use filters on the official page for current roles.',
    cycles: [
      { year: currentYear, status: 'open', note: 'Live roles depend on the official search' },
      { year: currentYear + 1, status: 'upcoming', note: 'Hiring needs can change' },
      { year: currentYear + 2, status: 'upcoming', note: 'Future roles are not announced' },
    ],
  },
];

const dailyUpdates = [
  { title: 'Source check', text: 'Every card links to the official application or notification page.', icon: ShieldCheck },
  { title: 'No stale dates', text: 'Old deadlines are not presented as current openings.', icon: CalendarDays },
  { title: 'Future watch', text: 'Upcoming years are marked as expected, never guaranteed.', icon: Clock3 },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function statusLabel(status: CycleStatus) {
  return status === 'open' ? 'Check now' : status === 'upcoming' ? 'Upcoming' : 'Not announced';
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

type PageProps = {
  savedIds: string[];
  applications: Application[];
  onSave: (id: string) => void;
  onApply: (opportunity: Opportunity) => void;
};

function App() {
  const [savedIds, setSavedIds] = useState<string[]>(() => readStorage(SAVED_KEY, []));
  const [applications, setApplications] = useState<Application[]>(() => readStorage(APPLICATIONS_KEY, []));
  const [notice, setNotice] = useState<Notice | null>(null);
  const [profileDone, setProfileDone] = useState(() => Boolean(readStorage(PROFILE_KEY, null)));
  const [profileOpen, setProfileOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(() => readStorage(LAST_REFRESH_KEY, reviewedDate));

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const onSave = (id: string) => {
    setSavedIds(current => {
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setNotice({ message: current.includes(id) ? 'Removed from your shortlist.' : 'Saved for later.' });
      return next;
    });
  };

  const onApply = (opportunity: Opportunity) => {
    if (opportunity.currentStatus === 'upcoming' || opportunity.currentStatus === 'not-announced') {
      setNotice({ message: 'This cycle is not confirmed open. Check the official source first.' });
      window.open(opportunity.applyUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (applications.some(item => item.opportunityId === opportunity.id)) {
      setNotice({ message: 'Already recorded — check your Applications page.' });
      return;
    }
    const record: Application = { opportunityId: opportunity.id, appliedAt: new Date().toISOString(), status: 'Source opened' };
    const next = [...applications, record];
    setApplications(next);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(next));
    setNotice({ message: 'Official source opened. Complete the application there.' });
    window.open(opportunity.applyUrl, '_blank', 'noopener,noreferrer');
  };

  const refreshSources = () => {
    const now = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
    setLastRefresh(now);
    localStorage.setItem(LAST_REFRESH_KEY, now);
    setNotice({ message: 'Daily source checklist refreshed.' });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RoutedErrorBoundary>
            <Shell savedCount={savedIds.length} applicationCount={applications.length}>
              <Switch>
                <Route path="/">
                  <Dashboard savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} profileDone={profileDone} onCompleteProfile={() => setProfileOpen(true)} lastRefresh={lastRefresh} onRefresh={refreshSources} />
                </Route>
                <Route path="/explore"><Explore savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} lastRefresh={lastRefresh} /></Route>
                <Route path="/saved"><Saved savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} /></Route>
                <Route path="/applications"><Applications applications={applications} /></Route>
                <Route path="/opportunities/:id"><OpportunityDetail savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} /></Route>
                <Route>
                  <div className="page"><div className="empty-state"><div><div className="empty-icon"><Compass size={26} /></div><h2>Page not found.</h2><p>Let’s get you back to a useful signal.</p><Link href="/" className="button button-primary">Back to Today <ArrowRight size={14} /></Link></div></div></div>
                </Route>
              </Switch>
            </Shell>
          </RoutedErrorBoundary>
        </WouterRouter>
        {profileOpen ? <ProfileModal onClose={() => setProfileOpen(false)} onSaved={() => { setProfileDone(true); setNotice({ message: 'Profile signal updated.' }); }} /> : null}
        {notice ? <div className="notice" role="status"><CheckCircle2 size={16} />{notice.message}</div> : null}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Shell({ children, savedCount, applicationCount }: { children: ReactNode; savedCount: number; applicationCount: number }) {
  const [location] = useLocation();
  const nav = [
    { href: '/', label: 'Today', icon: LayoutDashboard },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/saved', label: 'Shortlist', icon: FolderHeart, count: savedCount },
    { href: '/applications', label: 'Applications', icon: FileCheck2, count: applicationCount },
  ];
  return <div className="app-shell"><aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span className="brand-name">opportunity<span>hub</span></span></Link><div className="nav-label">Your field guide</div><nav className="side-nav">{nav.map(item => { const Icon = item.icon; const active = item.href === '/' ? location === '/' : location.startsWith(item.href); return <Link key={item.href} href={item.href} className={`nav-link ${active ? 'active' : ''}`}><Icon size={16} />{item.label}{item.count ? <span className="nav-count">{item.count}</span> : null}</Link>; })}</nav><div className="side-spacer" /><div className="side-profile"><div className="avatar">AH</div><div><strong>Opportunity seeker</strong><small>Official-source first</small></div></div></aside><main className="main-content"><header className="topbar"><div className="top-greeting"><span className="eyebrow">Daily signal</span><br />Make one useful move today.</div><div className="top-actions"><label className="top-search"><Search size={14} /><input placeholder="Search opportunities" aria-label="Search opportunities" onKeyDown={event => { if (event.key === 'Enter') window.location.href = `/explore?q=${encodeURIComponent(event.currentTarget.value)}`; }} /></label><button className="notify-button" aria-label="Daily updates"><Bell size={16} /></button></div></header>{children}<nav className="mobile-nav">{nav.map(item => { const Icon = item.icon; const active = item.href === '/' ? location === '/' : location.startsWith(item.href); return <Link key={item.href} href={item.href} className={active ? 'active' : ''}><Icon size={16} />{item.label}</Link>; })}</nav></main></div>;
}

function Dashboard({ savedIds, applications, onSave, onApply, profileDone, onCompleteProfile, lastRefresh, onRefresh }: PageProps & { profileDone: boolean; onCompleteProfile: () => void; lastRefresh: string; onRefresh: () => void }) {
  const featured = opportunities.filter(item => item.featured);
  return <div className="page">
    <section className="hero"><div className="hero-copy"><span className="hero-kicker">A calmer way to find what’s next</span><h1>Real opportunities.<br />Clear next steps.</h1><p>Curated from official sources, with current status and future-cycle context so you don’t waste time on expired or fake job posts.</p><Link href="/explore" className="button hero-link">Explore verified sources <ArrowRight size={14} /></Link></div><div className="hero-orbit-label"><strong>{opportunities.length}</strong> official source paths<br />checked {lastRefresh}</div></section>
    <div className="section-row"><div><span className="eyebrow">Today’s field note</span><h2>Know what is open, upcoming, and not announced.</h2></div><button className="button button-soft" onClick={onRefresh}><RefreshCw size={14} /> Refresh daily check</button></div>
    <div className="stats-grid"><Stat icon={ShieldCheck} label="Source policy" value="Official only" /><Stat icon={CalendarDays} label="Future view" value={`${currentYear + 1} → ${currentYear + 2}`} /><Stat icon={FileCheck2} label="Applications" value={String(applications.length)} /></div>
    <div className="dashboard-columns"><div><div className="section-row compact"><div><span className="eyebrow">Verified paths</span><h2>Start with a source you can trust.</h2></div><Link href="/explore" className="section-link">See all <ChevronRight size={14} /></Link></div><div className="opportunity-grid">{featured.map(item => <OpportunityCard key={item.id} opportunity={item} saved={savedIds.includes(item.id)} applied={applications.some(application => application.opportunityId === item.id)} onSave={onSave} onApply={onApply} />)}</div></div><div><div className="section-row compact"><div><span className="eyebrow">Daily updates</span><h2>What we protect you from.</h2></div></div><div className="momentum-card">{dailyUpdates.map(update => { const Icon = update.icon; return <div className="momentum-line" key={update.title}><Icon size={17} /><div><strong>{update.title}</strong><p>{update.text}</p></div></div>; })}<div className="source-stamp"><ShieldCheck size={14} /> Last checked: {lastRefresh}</div></div>{profileDone ? <div className="profile-card"><span className="eyebrow">Personal signal</span><h3>Your interests are saved.</h3><p>Use your shortlist and profile to make daily decisions faster.</p><Link href="/saved" className="button button-soft">Open shortlist <ArrowRight size={14} /></Link></div> : <div className="profile-card"><span className="eyebrow">Make it yours</span><h3>Give your search a little context.</h3><p>Save interests locally so the field feels more relevant.</p><button className="button button-primary" onClick={onCompleteProfile}>Set up profile <ArrowRight size={14} /></button></div>}</div></div>
  </div>;
}

function Explore({ savedIds, applications, onSave, onApply, lastRefresh }: PageProps & { lastRefresh: string }) {
  const query = new URLSearchParams(window.location.search).get('q')?.toLowerCase() ?? '';
  const [category, setCategory] = useState<'All' | Category>('All');
  const [status, setStatus] = useState<'All' | CycleStatus>('All');
  const filtered = useMemo(() => opportunities.filter(item => (category === 'All' || item.category === category) && (status === 'All' || item.currentStatus === status) && (!query || `${item.title} ${item.company} ${item.skills.join(' ')}`.toLowerCase().includes(query))), [category, status, query]);
  return <div className="page"><div className="page-header"><div><span className="eyebrow">Explore the field</span><h1>Opportunities with receipts.</h1><p>Each card links to the official source. We show future cycles as a watchlist, not as a promise.</p></div><div className="results-count">{filtered.length} paths · checked {lastRefresh}</div></div><div className="search-panel"><label className="search-box"><Search size={16} /><input placeholder="Search role, company, or skill" defaultValue={query} onKeyDown={event => { if (event.key === 'Enter') window.location.href = `/explore?q=${encodeURIComponent(event.currentTarget.value)}`; }} /></label><a className="button button-soft" href="#filters"><Filter size={14} /> Filter</a></div><div id="filters" className="filter-row"><button className={`filter-chip ${category === 'All' ? 'active' : ''}`} onClick={() => setCategory('All')}>All</button>{(['Government', 'Internship', 'Private job', 'Hackathon'] as const).map(item => <button key={item} className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}<span className="filter-divider" /><button className={`filter-chip ${status === 'All' ? 'active' : ''}`} onClick={() => setStatus('All')}>Any status</button><button className={`filter-chip ${status === 'open' ? 'active' : ''}`} onClick={() => setStatus('open')}>Open to check</button><button className={`filter-chip ${status === 'upcoming' ? 'active' : ''}`} onClick={() => setStatus('upcoming')}>Upcoming years</button></div><div className="opportunity-grid explore-grid">{filtered.map(item => <OpportunityCard key={item.id} opportunity={item} saved={savedIds.includes(item.id)} applied={applications.some(application => application.opportunityId === item.id)} onSave={onSave} onApply={onApply} />)}</div>{filtered.length === 0 ? <div className="empty-state"><div><div className="empty-icon"><Search size={26} /></div><h2>No matching sources yet.</h2><p>Try a broader search or clear the filters.</p></div></div> : null}</div>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={17} /></div><div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong></div></div>;
}

function OpportunityCard({ opportunity, saved, applied, onSave, onApply }: { opportunity: Opportunity; saved: boolean; applied: boolean; onSave: (id: string) => void; onApply: (opportunity: Opportunity) => void }) {
  return <article className="op-card" style={{ '--card-accent': opportunity.accent } as CSSProperties}><div className="op-card-top"><span className="badge">{opportunity.category}</span><button className={`icon-button ${saved ? 'saved' : ''}`} aria-label={saved ? `Remove ${opportunity.title} from shortlist` : `Save ${opportunity.title}`} onClick={() => onSave(opportunity.id)}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /></button></div><Link href={`/opportunities/${opportunity.id}`}><div className="company-mark">{opportunity.company.slice(0, 1)}</div><span className="op-company">{opportunity.company}</span><h3>{opportunity.title}</h3><p className="op-description">{opportunity.description}</p></Link><div className="op-meta"><span><MapPin size={13} />{opportunity.location}</span><span><Clock3 size={13} />{opportunity.deadline}</span></div><div className="op-bottom"><span className={`status-pill ${opportunity.currentStatus}`}>{opportunity.currentStatus === 'open' ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}{statusLabel(opportunity.currentStatus)}</span><span className="match">{opportunity.match}% fit</span></div><div className="source-line"><ShieldCheck size={12} /> {opportunity.sourceType} · {opportunity.sourceName}</div><div className="op-actions"><Link className="button button-soft" href={`/opportunities/${opportunity.id}`}>Details <ArrowRight size={13} /></Link><button className="button button-primary" onClick={() => onApply(opportunity)}>{applied ? <><Check size={13} />Opened</> : <><ExternalLink size={13} />Apply via source</>}</button></div></article>;
}

function Saved({ savedIds, applications, onSave, onApply }: PageProps) {
  const items = opportunities.filter(item => savedIds.includes(item.id));
  return <div className="page"><div className="page-header"><div><span className="eyebrow">Your shortlist</span><h1>Keep the good signals close.</h1><p>Save paths you want to compare. Check the official source before each application.</p></div></div>{items.length ? <div className="opportunity-grid">{items.map(item => <OpportunityCard key={item.id} opportunity={item} saved applied={applications.some(application => application.opportunityId === item.id)} onSave={onSave} onApply={onApply} />)}</div> : <div className="empty-state"><div><div className="empty-icon"><FolderHeart size={26} /></div><h2>Your shortlist is clear.</h2><p>Save an opportunity from Explore when you want to return to it.</p><Link href="/explore" className="button button-primary">Explore sources <ArrowRight size={14} /></Link></div></div>}</div>;
}

function Applications({ applications }: { applications: Application[] }) {
  return <div className="page"><div className="page-header"><div><span className="eyebrow">Your trail</span><h1>Applications, without the guesswork.</h1><p>We only record that you opened an official source. Submission and status remain with the employer or commission.</p></div></div>{applications.length ? <div className="application-list">{applications.map(application => { const item = opportunities.find(opportunity => opportunity.id === application.opportunityId); return <div className="application-row" key={`${application.opportunityId}-${application.appliedAt}`}><div className="application-main"><div className="company-mark">{item?.company.slice(0, 1) ?? '?'}</div><div><strong>{item?.title ?? 'Saved opportunity'}</strong><small>{item?.company ?? 'Source no longer in this feed'}</small></div></div><div><span className="status-pill open"><CheckCircle2 size={12} />{application.status}</span><small className="application-date">Opened {formatDate(application.appliedAt)}</small></div>{item ? <a className="button button-soft" href={item.applyUrl} target="_blank" rel="noreferrer">Open source <ExternalLink size={13} /></a> : null}</div>; })}</div> : <div className="empty-state"><div><div className="empty-icon"><Send size={26} /></div><h2>No applications recorded.</h2><p>When you open an official source through this app, it will appear here.</p><Link href="/explore" className="button button-primary">Find a source <ArrowRight size={14} /></Link></div></div>}</div>;
}

function OpportunityDetail({ savedIds, applications, onSave, onApply }: PageProps) {
  const { id } = useParams<{ id: string }>();
  const opportunity = opportunities.find(item => item.id === id);
  if (!opportunity) return <div className="page"><div className="empty-state"><div><h2>Opportunity not found.</h2><Link href="/explore" className="button button-primary">Back to Explore</Link></div></div></div>;
  const applied = applications.some(item => item.opportunityId === opportunity.id);
  return <div className="page"><Link href="/explore" className="button button-quiet detail-back"><ArrowLeft size={14} /> Back to Explore</Link><div className="detail-layout"><div className="detail-main"><div className="detail-company"><div className="company-mark">{opportunity.company.slice(0, 1)}</div><div><strong>{opportunity.company}</strong><br /><span>{opportunity.sourceType} · {opportunity.sourceName}</span></div></div><span className="badge detail-badge">{opportunity.category}</span><h1>{opportunity.title}</h1><p className="detail-copy">{opportunity.longDescription}</p><div className="detail-copy"><h2>Current source status</h2><p>{opportunity.statusNote} Never pay a recruiter to apply. Confirm the domain, job ID, eligibility, and deadline on the linked source.</p><h2>Year-by-year outlook</h2><p>Future years help with planning only. A cycle is final only after the official organisation publishes its notification.</p><div className="year-timeline">{opportunity.cycles.map(cycle => <div className={`year-item ${cycle.status}`} key={cycle.year}><div className="year-dot" /><div><strong>{cycle.year}</strong><span>{statusLabel(cycle.status)}</span><p>{cycle.note}</p></div></div>)}</div></div><div className="skills">{opportunity.skills.map(skill => <span className="skill" key={skill}>{skill}</span>)}</div></div><aside className="detail-side"><div className="detail-side-header"><h3>Make a safe move</h3><button className={`icon-button ${savedIds.includes(opportunity.id) ? 'saved' : ''}`} onClick={() => onSave(opportunity.id)} aria-label="Save opportunity"><Bookmark size={15} fill={savedIds.includes(opportunity.id) ? 'currentColor' : 'none'} /></button></div><div className="detail-fact"><ShieldCheck size={16} /><div><label>Source</label><strong>{opportunity.sourceName}</strong></div></div><div className="detail-fact"><CalendarDays size={16} /><div><label>Current window</label><strong>{opportunity.deadline}</strong></div></div><div className="detail-fact"><Target size={16} /><div><label>Fit signal</label><strong>{opportunity.match}% based on this guide</strong></div></div><button className="button button-primary" onClick={() => onApply(opportunity)}>{applied ? <><Check size={14} />Source opened</> : <><ExternalLink size={14} />Open official source</>}</button><a className="button button-soft" href={opportunity.applyUrl} target="_blank" rel="noreferrer">Open in new tab <ExternalLink size={13} /></a><p className="safe-note"><ShieldCheck size={13} /> This app never submits or guarantees an application. It takes you to the official source.</p></aside></div></div>;
}

function ProfileModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('Opportunity seeker');
  const [interests, setInterests] = useState<string[]>(['Technology']);
  const options = ['Product', 'Technology', 'Design', 'Public impact', 'Entrepreneurship'];
  const save = () => { localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, interests })); onSaved(); onClose(); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><div className="modal-header"><div><h2 id="profile-title">Sharpen your signal.</h2><p>These preferences stay on this device and help you choose where to look next.</p></div><button className="icon-button" onClick={onClose} aria-label="Close profile editor"><X size={16} /></button></div><label htmlFor="profile-name">Your name</label><input id="profile-name" value={name} onChange={event => setName(event.target.value)} /><label>What are you curious about?</label><div className="interest-list">{options.map(option => <button key={option} className={`interest ${interests.includes(option) ? 'selected' : ''}`} onClick={() => setInterests(current => current.includes(option) ? current.filter(item => item !== option) : [...current, option])}>{interests.includes(option) ? <Check size={12} /> : null}{option}</button>)}</div><div className="modal-actions"><button className="button button-soft" onClick={onClose}>Not now</button><button className="button button-primary" onClick={save}>Save profile <ArrowRight size={14} /></button></div></div></div>;
}

export default App;