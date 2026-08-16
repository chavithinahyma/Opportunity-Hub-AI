import { type ReactNode, type CSSProperties, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft, ArrowRight, Bell, Bookmark, BriefcaseBusiness, CalendarDays, Check,
  CheckCircle2, ChevronRight, Clock3, Compass, ExternalLink, FileCheck2, Filter,
  FolderHeart, GraduationCap, LayoutDashboard, Lightbulb, MapPin, Search, Send,
  Sparkles, Target, Trophy, Users, X, Zap,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';

const queryClient = new QueryClient();
const SAVED_KEY = 'opportunity-hub-saved';
const APPLICATIONS_KEY = 'opportunity-hub-applications';
const PROFILE_KEY = 'opportunity-hub-profile';

type Category = 'Government' | 'Hackathon' | 'Internship' | 'Private job';
type Opportunity = {
  id: string; title: string; company: string; category: Category; location: string;
  workMode: string; description: string; longDescription: string; deadline: string;
  match: number; skills: string[]; posted: string; applyUrl: string; featured: boolean; accent: string;
};
type Application = { opportunityId: string; appliedAt: string; status: string };
type Notice = { message: string; kind?: 'success' | 'info' };

const opportunities: Opportunity[] = [
  {
    id: 'ssc-cgl-2025', title: 'Combined Graduate Level Examination', company: 'Staff Selection Commission',
    category: 'Government', location: 'Across India', workMode: 'On-site / Hybrid', description: 'A high-impact entry point into public service, policy, and administration.',
    longDescription: 'The SSC CGL brings together ambitious graduates for Group B and Group C roles across central government departments. It is a structured path for people who want meaningful scale, stability, and a close view of how India works.',
    deadline: '18 Jul 2025', match: 92, skills: ['Quantitative aptitude', 'Reasoning', 'General awareness'], posted: '2 days ago', applyUrl: 'https://ssc.gov.in/', featured: true, accent: '#ef9f71',
  },
  {
    id: 'sih-2025', title: 'Smart India Hackathon 2025', company: 'Ministry of Education', category: 'Hackathon',
    location: 'India · 36-hour finale', workMode: 'Team-based', description: 'Turn a real public problem into a working prototype with a team that ships.',
    longDescription: 'Smart India Hackathon is a national innovation movement connecting student teams with problems from ministries, public sector organisations, and industry. Bring a sharp point of view, find your team, and build something people can use.',
    deadline: '30 Jun 2025', match: 88, skills: ['Product thinking', 'Prototyping', 'Teamwork'], posted: '5 days ago', applyUrl: 'https://www.sih.gov.in/', featured: true, accent: '#7bc6b2',
  },
  {
    id: 'google-gsoc', title: 'Google Summer of Code', company: 'Google · Open source', category: 'Internship',
    location: 'Remote · Global', workMode: 'Remote', description: 'Spend a summer contributing to open source with a global mentor community.',
    longDescription: 'GSoC is a global, online program where contributors work with open source organisations on a real project. It is a powerful portfolio signal for explorers who want to learn in public and work across borders.',
    deadline: '12 Apr 2025', match: 84, skills: ['Git', 'Open source', 'Communication'], posted: '1 week ago', applyUrl: 'https://summerofcode.withgoogle.com/', featured: true, accent: '#d7ad54',
  },
  {
    id: 'devfolio-build', title: 'Build your next brave idea', company: 'Devfolio community', category: 'Hackathon',
    location: 'Online & in-person', workMode: 'Team-based', description: 'Find a live hackathon and get from blank page to demo day in public.',
    longDescription: 'Devfolio hosts some of India’s most builder-friendly hackathons. Browse active events, meet collaborators, and choose a brief that gives your curiosity somewhere to go next.',
    deadline: 'Rolling opportunities', match: 81, skills: ['Development', 'Design', 'Storytelling'], posted: '1 week ago', applyUrl: 'https://devfolio.co/hackathons', featured: false, accent: '#a7b3e7',
  },
  {
    id: 'microsoft-explore', title: 'Explore Program Internship', company: 'Microsoft', category: 'Internship',
    location: 'Bengaluru, India', workMode: 'Hybrid', description: 'A launchpad for first and second-year students exploring software careers.',
    longDescription: 'Microsoft Explore is designed to give early-career talent a practical view of software engineering through rotations, mentorship, and a cohort experience. Check the official student roles for current openings.',
    deadline: 'Applications vary', match: 79, skills: ['Computer science', 'Problem solving', 'Curiosity'], posted: '2 weeks ago', applyUrl: 'https://careers.microsoft.com/v2/global/en/students', featured: false, accent: '#9ac7dd',
  },
  {
    id: 'drdo-apprentice', title: 'Graduate Apprentice Training', company: 'DRDO', category: 'Government',
    location: 'Multiple labs · India', workMode: 'On-site', description: 'Learn alongside scientists and engineers working on India’s frontier technologies.',
    longDescription: 'DRDO labs periodically open graduate apprentice roles across engineering, science, and administration. Keep your documents ready and explore the official recruitment updates for the right lab and cycle.',
    deadline: 'Check official updates', match: 76, skills: ['Engineering', 'Research', 'Discipline'], posted: '3 weeks ago', applyUrl: 'https://www.drdo.gov.in/careers', featured: false, accent: '#d7a78b',
  },
  {
    id: 'razorpay-product', title: 'Associate Product Intern', company: 'Razorpay', category: 'Private job',
    location: 'Bengaluru, India', workMode: 'Hybrid', description: 'Get close to customer problems and help shape the future of financial infrastructure.',
    longDescription: 'Razorpay’s product teams work at the intersection of money, technology, and everyday business. For current roles, explore the company’s official careers hub and look for internship and early-career openings.',
    deadline: 'Applications vary', match: 74, skills: ['Product sense', 'Analytics', 'Writing'], posted: '3 weeks ago', applyUrl: 'https://razorpay.com/jobs/', featured: false, accent: '#ef9f71',
  },
  {
    id: 'linkedin-design', title: 'Early Career Design Roles', company: 'India design ecosystem', category: 'Private job',
    location: 'India · varied', workMode: 'Remote / Hybrid', description: 'A focused search for design roles where your point of view can become your advantage.',
    longDescription: 'Use this curated public search to find internships and early-career design roles across India. Filter by experience and location, then save the opportunities that feel like a genuine stretch.',
    deadline: 'Rolling opportunities', match: 70, skills: ['Portfolio', 'Figma', 'Communication'], posted: '1 month ago', applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=design%20intern&location=India', featured: false, accent: '#b5c780',
  },
];

const categoryMeta: { label: Category; count: string; icon: typeof BriefcaseBusiness; accent: string }[] = [
  { label: 'Government', count: '12 open paths', icon: BriefcaseBusiness, accent: '#ef9f71' },
  { label: 'Hackathon', count: '8 ways to build', icon: Lightbulb, accent: '#7bc6b2' },
  { label: 'Internship', count: '19 early starts', icon: GraduationCap, accent: '#d7ad54' },
  { label: 'Private job', count: '26 growing teams', icon: Target, accent: '#a7b3e7' },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch { return fallback; }
}

function Logo() {
  return <Link href="/" className="brand" data-testid="link-brand"><span className="brand-mark"><Zap size={17} strokeWidth={2.5} /></span><span className="brand-name">opportunity<span>hub</span></span></Link>;
}

function Shell({ children, savedCount, applicationCount }: { children: ReactNode; savedCount: number; applicationCount: number }) {
  const [location, setLocation] = useLocation();
  const [topQuery, setTopQuery] = useState('');
  const nav = [
    { href: '/', label: 'Today', icon: LayoutDashboard },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/saved', label: 'Saved', icon: Bookmark, count: savedCount },
    { href: '/applications', label: 'Applications', icon: FileCheck2, count: applicationCount },
  ];
  return <div className="app-shell">
    <aside className="sidebar"><Logo /><div className="nav-label">Your workspace</div><nav className="side-nav" aria-label="Primary navigation">{nav.map(item => { const Icon = item.icon; const active = item.href === '/' ? location === '/' : location.startsWith(item.href); return <Link key={item.href} href={item.href} className={`nav-link ${active ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase()}`}><Icon size={16} /><span>{item.label}</span>{item.count ? <span className="nav-count">{item.count}</span> : null}</Link>; })}</nav><div className="side-spacer" /><div className="side-profile"><span className="avatar">AR</span><div><strong>Aarav’s space</strong><small>Explorer · India</small></div></div></aside>
    <main className="main-content"><header className="topbar"><div><div className="eyebrow">Thursday · 20 March</div><div className="top-greeting">A clear next move is closer than it looks.</div></div><div className="top-actions"><form className="top-search" onSubmit={event => { event.preventDefault(); if (topQuery.trim()) setLocation(`/explore?q=${encodeURIComponent(topQuery.trim())}`); }}><Search size={14} /><input aria-label="Search opportunities" placeholder="Search opportunities" value={topQuery} onChange={event => setTopQuery(event.target.value)} data-testid="input-top-search" /></form><button className="notify-button" aria-label="View notifications" data-testid="button-notifications"><Bell size={15} /></button><span className="avatar">AR</span></div></header>{children}<nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(item => { const Icon = item.icon; const active = item.href === '/' ? location === '/' : location.startsWith(item.href); return <Link key={item.href} href={item.href} className={active ? 'active' : ''} data-testid={`link-mobile-${item.label.toLowerCase()}`}><Icon size={17} /><span>{item.label}</span></Link>; })}</nav></main>
  </div>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function CategoryIcon({ category, size = 16 }: { category: Category; size?: number }) {
  const Icon = category === 'Government' ? BriefcaseBusiness : category === 'Hackathon' ? Lightbulb : category === 'Internship' ? GraduationCap : Target;
  return <Icon size={size} />;
}

function OpportunityCard({ opportunity, saved, applied, onSave, onApply, index = 0 }: { opportunity: Opportunity; saved: boolean; applied: boolean; onSave: () => void; onApply: () => void; index?: number }) {
  const style = { '--op-accent': opportunity.accent, animationDelay: `${index * 70}ms` } as CSSProperties;
  return <article className="op-card" style={style} data-testid={`card-opportunity-${opportunity.id}`}>
    <div className="op-card-top"><span className="company-mark" aria-hidden="true">{opportunity.company.slice(0, 2).toUpperCase()}</span><div style={{ display: 'flex', gap: 7, alignItems: 'center' }}><span className="badge"><CategoryIcon category={opportunity.category} size={11} />{opportunity.category}</span><button className={`icon-button ${saved ? 'saved' : ''}`} onClick={onSave} aria-label={saved ? `Remove ${opportunity.title} from saved` : `Save ${opportunity.title}`} data-testid={`button-save-${opportunity.id}`}>{saved ? <Bookmark size={15} fill="currentColor" /> : <Bookmark size={15} />}</button></div></div>
    <h3><Link href={`/opportunities/${opportunity.id}`} data-testid={`link-title-${opportunity.id}`}>{opportunity.title}</Link></h3><div className="op-company">{opportunity.company}</div><p className="op-description">{opportunity.description}</p>
    <div className="op-bottom"><div className="op-meta"><span><MapPin size={12} />{opportunity.location.split(' · ')[0]}</span><span><Clock3 size={12} />{opportunity.posted}</span></div><div className="op-actions"><Link href={`/opportunities/${opportunity.id}`} className="button button-soft" data-testid={`link-details-${opportunity.id}`}>Details</Link><button className="button button-primary" onClick={onApply} data-testid={`button-apply-${opportunity.id}`}>{applied ? <><Check size={13} />Applied</> : <><Send size={13} />Apply</>}</button></div></div>
  </article>;
}

function EmptyState({ type, title, description, actionLabel, actionHref }: { type: 'saved' | 'applications'; title: string; description: string; actionLabel: string; actionHref: string }) {
  return <div className="empty-state" data-testid={`empty-${type}`}><div><div className="empty-icon">{type === 'saved' ? <FolderHeart size={26} /> : <FileCheck2 size={26} />}</div><h2>{title}</h2><p>{description}</p><Link href={actionHref} className="button button-primary" data-testid={`link-empty-${type}`}>{actionLabel}<ArrowRight size={14} /></Link></div></div>;
}

function Dashboard({ savedIds, applications, onSave, onApply, profileDone, onCompleteProfile }: PageProps & { profileDone: boolean; onCompleteProfile: () => void }) {
  const featured = opportunities.filter(item => item.featured).slice(0, 4);
  return <div className="page">
    <section className="hero"><div className="hero-copy"><div className="hero-kicker">A workspace for your next move</div><h1>Find the signal.<br /><span style={{ color: 'hsl(var(--accent))' }}>Follow it.</span></h1><p>Opportunity Hub turns a noisy internet into a short, thoughtful list of paths worth your attention today.</p><Link className="button hero-link" href="/explore" data-testid="link-hero-explore">Explore opportunities <ArrowRight size={14} /></Link></div><div className="hero-orbit-label"><strong>{opportunities.length + 8}</strong> fresh paths mapped this week</div></section>
    <div className="stats-grid"><div className="stat-card"><Trophy className="stat-icon" size={16} /><div className="stat-value">{featured.length}</div><div className="stat-label">strong matches today</div></div><div className="stat-card"><Bookmark className="stat-icon" size={16} /><div className="stat-value">{savedIds.length}</div><div className="stat-label">saved for later</div></div><div className="stat-card"><FileCheck2 className="stat-icon" size={16} /><div className="stat-value">{applications.length}</div><div className="stat-label">applications in motion</div></div><div className="stat-card"><Sparkles className="stat-icon" size={16} /><div className="stat-value">+12</div><div className="stat-label">momentum this month</div></div></div>
    <div className="dashboard-columns"><div><div className="section-row"><div><h2>Picked for your path</h2><p>Small list, high intent. Start with the one that sparks something.</p></div><Link className="section-link" href="/explore" data-testid="link-see-all">See all <ArrowRight size={13} /></Link></div><div className="opportunity-grid">{featured.map((item, index) => <OpportunityCard key={item.id} opportunity={item} saved={savedIds.includes(item.id)} applied={applications.some(app => app.opportunityId === item.id)} onSave={() => onSave(item.id)} onApply={() => onApply(item)} index={index} />)}</div></div><div><div className="section-row"><div><h2>Keep your momentum</h2><p>Progress is a practice, not a personality.</p></div></div><div className="momentum-card"><div className="eyebrow" style={{ color: 'hsl(var(--accent))' }}>Your March rhythm</div><h3>3 moves made</h3><p>You are building a pattern. One more considered action this week keeps it alive.</p><div className="momentum-line" aria-label="Momentum over the last seven days">{[1,2,3,4,5,6,7].map(item => <i key={item} />)}</div></div><div className="profile-card" style={{ marginTop: 13 }}><div className="eyebrow">Your profile signal</div><h3>{profileDone ? 'Profile is in shape.' : 'Give your profile a sharper edge.'}</h3><p>{profileDone ? 'Your preferences are saved. We’ll keep your next list more relevant.' : 'Tell us what you’re curious about and make every recommendation count.'}</p><div className="progress-track"><div className="progress-fill" style={{ width: profileDone ? '100%' : '62%' }} /></div><div className="progress-caption"><span>{profileDone ? 'Complete' : '62% complete'}</span><button className="button button-quiet" onClick={onCompleteProfile} data-testid="button-complete-profile">{profileDone ? 'Edit profile' : 'Complete profile'} <ChevronRight size={13} /></button></div></div></div></div>
    <div className="section-row"><div><h2>Browse by intention</h2><p>Choose a direction, then let curiosity do the rest.</p></div><Link className="section-link" href="/explore" data-testid="link-browse-all">Browse all <ArrowRight size={13} /></Link></div><div className="category-grid">{categoryMeta.map(item => { const Icon = item.icon; return <Link key={item.label} href={`/explore?category=${encodeURIComponent(item.label)}`} className="category-tile" style={{ '--op-accent': item.accent } as CSSProperties} data-testid={`link-category-${item.label.toLowerCase().replace(' ', '-')}`}><Icon size={19} /><div><strong>{item.label}</strong><small>{item.count}</small></div></Link>; })}</div>
  </div>;
}

function Explore({ savedIds, applications, onSave, onApply }: PageProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  useEffect(() => { const params = new URLSearchParams(window.location.search); setQuery(params.get('q') ?? ''); const incoming = params.get('category') as Category | null; if (incoming && categoryMeta.some(item => item.label === incoming)) setCategory(incoming); }, []);
  const results = useMemo(() => opportunities.filter(item => (category === 'All' || item.category === category) && `${item.title} ${item.company} ${item.description} ${item.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return <div className="page"><PageHeader eyebrow="The opportunity field" title="Explore with intent." description="Search the full field, filter by the kind of stretch you want, and keep the paths that feel like yours." action={<Link className="button button-primary" href="/"><LayoutDashboard size={14} />Back to Today</Link>} /><div className="search-panel"><label className="search-box"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Try “product”, “remote”, or “hackathon”" aria-label="Search opportunity list" data-testid="input-explore-search" /><kbd>⌘ K</kbd></label><button className="button button-soft" onClick={() => { setCategory('All'); setQuery(''); setLocation('/explore'); }} data-testid="button-reset-filters"><Filter size={14} />Reset</button></div><div className="filter-row" aria-label="Opportunity categories"><button className={`filter-chip ${category === 'All' ? 'active' : ''}`} onClick={() => setCategory('All')} data-testid="filter-category-all">All paths</button>{categoryMeta.map(item => <button key={item.label} className={`filter-chip ${category === item.label ? 'active' : ''}`} onClick={() => setCategory(item.label)} data-testid={`filter-category-${item.label.toLowerCase().replace(' ', '-')}`}><CategoryIcon category={item.label} size={12} />{item.label}</button>)}</div><p className="results-count">{results.length} {results.length === 1 ? 'opportunity' : 'opportunities'} in your field of view</p>{results.length ? <div className="opportunity-grid">{results.map((item, index) => <OpportunityCard key={item.id} opportunity={item} saved={savedIds.includes(item.id)} applied={applications.some(app => app.opportunityId === item.id)} onSave={() => onSave(item.id)} onApply={() => onApply(item)} index={index} />)}</div> : <EmptyState type="saved" title="That signal is still forming." description="Try a broader phrase or another category. The right path may be one small search away." actionLabel="Clear filters" actionHref="/explore" />}</div>;
}

function Saved({ savedIds, applications, onSave, onApply }: PageProps) {
  const saved = opportunities.filter(item => savedIds.includes(item.id));
  return <div className="page"><PageHeader eyebrow="Your shortlist" title="Saved for the right moment." description="Keep the possibilities that deserve a second look. No pressure to decide today." action={<Link className="button button-primary" href="/explore" data-testid="link-save-more"><Compass size={14} />Find more</Link>} />{saved.length ? <div className="opportunity-grid">{saved.map((item, index) => <OpportunityCard key={item.id} opportunity={item} saved applied={applications.some(app => app.opportunityId === item.id)} onSave={() => onSave(item.id)} onApply={() => onApply(item)} index={index} />)}</div> : <EmptyState type="saved" title="Your shortlist is quiet." description="When something makes you pause, save it here. Your future self will thank you for the small act of attention." actionLabel="Explore opportunities" actionHref="/explore" />}</div>;
}

function Applications({ applications }: { applications: Application[] }) {
  const applied = applications.map(application => ({ application, opportunity: opportunities.find(item => item.id === application.opportunityId) })).filter(item => item.opportunity);
  return <div className="page"><PageHeader eyebrow="Your movement" title="Applications in motion." description="A calm view of the chances you’ve chosen to act on. Keep moving, one thoughtful application at a time." action={<Link className="button button-primary" href="/explore" data-testid="link-application-explore"><Compass size={14} />Find another path</Link>} />{applied.length ? <div className="application-list">{applied.map(({ application, opportunity }) => opportunity ? <div className="application-row" key={application.opportunityId} data-testid={`row-application-${application.opportunityId}`}><div className="application-main"><span className="company-mark" style={{ '--op-accent': opportunity.accent } as CSSProperties}>{opportunity.company.slice(0, 2).toUpperCase()}</span><div><h3><Link href={`/opportunities/${opportunity.id}`} data-testid={`link-application-${opportunity.id}`}>{opportunity.title}</Link></h3><p>{opportunity.company} · Applied {new Date(application.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p></div></div><span className="status-pill"><CheckCircle2 size={13} />{application.status}</span></div> : null)}</div> : <EmptyState type="applications" title="Nothing in motion yet." description="The first application is not a commitment to a career. It’s simply a signal to yourself that you’re ready to try." actionLabel="Find your first path" actionHref="/explore" />}</div>;
}

function OpportunityDetail({ savedIds, applications, onSave, onApply }: PageProps) {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const opportunity = opportunities.find(item => item.id === id);
  if (!opportunity) return <div className="page"><div className="empty-state"><div><div className="empty-icon"><Search size={26} /></div><h2>That opportunity moved on.</h2><p>Explore the field again and find another path with a little more room to grow.</p><Link href="/explore" className="button button-primary">Back to Explore <ArrowRight size={14} /></Link></div></div></div>;
  const applied = applications.some(item => item.opportunityId === opportunity.id);
  return <div className="page"><div className="detail-back"><button className="button button-quiet" onClick={() => setLocation('/explore')} data-testid="button-back-explore"><ArrowLeft size={14} />Back to Explore</button></div><div className="detail-layout"><article className="detail-main"><span className="badge" style={{ '--op-accent': opportunity.accent } as CSSProperties}><CategoryIcon category={opportunity.category} size={12} />{opportunity.category}</span><h1>{opportunity.title}</h1><div className="detail-company"><span className="company-mark" style={{ '--op-accent': opportunity.accent } as CSSProperties}>{opportunity.company.slice(0, 2).toUpperCase()}</span><span><strong>{opportunity.company}</strong><br />{opportunity.location}</span></div><p className="detail-copy">{opportunity.longDescription}</p><div className="detail-copy"><h2>What you’ll bring</h2><p>{opportunity.description} The strongest applications are specific, curious, and clear about the work you want to learn through.</p><div className="skills">{opportunity.skills.map(skill => <span key={skill} className="skill">{skill}</span>)}</div><h2>Why this could be your move</h2><p>This opportunity matches {opportunity.match}% of the signals in your current profile: the way you learn, the kind of work you’re drawn to, and the stage you’re ready for.</p></div></article><aside className="detail-side"><div className="detail-side-header"><h3>Make it real</h3><button className={`icon-button ${savedIds.includes(opportunity.id) ? 'saved' : ''}`} onClick={() => onSave(opportunity.id)} aria-label="Save opportunity" data-testid={`button-detail-save-${opportunity.id}`}>{savedIds.includes(opportunity.id) ? <Bookmark fill="currentColor" size={16} /> : <Bookmark size={16} />}</button></div><div className="detail-fact"><CalendarDays size={16} /><div><label>Deadline</label><strong>{opportunity.deadline}</strong></div></div><div className="detail-fact"><MapPin size={16} /><div><label>Where</label><strong>{opportunity.location}</strong></div></div><div className="detail-fact"><Sparkles size={16} /><div><label>Profile match</label><strong>{opportunity.match}% · strong signal</strong></div></div><div className="detail-fact"><Clock3 size={16} /><div><label>Added</label><strong>{opportunity.posted}</strong></div></div><button className="button button-primary" onClick={() => onApply(opportunity)} data-testid={`button-detail-apply-${opportunity.id}`}>{applied ? <><CheckCircle2 size={15} />Applied · destination opened</> : <><ExternalLink size={15} />Apply now</>}</button><p style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))', lineHeight: 1.5, margin: '11px 0 0', textAlign: 'center' }}>{applied ? 'Your application is saved in Applications.' : 'You’ll be taken to the official destination in a new tab.'}</p></aside></div></div>;
}

function ProfileModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('Aarav Rao');
  const [interests, setInterests] = useState<string[]>(['Product']);
  const options = ['Product', 'Technology', 'Design', 'Public impact', 'Entrepreneurship'];
  const save = () => { localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, interests })); onSaved(); onClose(); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><div className="modal-header"><div><h2 id="profile-title">Sharpen your signal.</h2><p>A few details help us make the field feel more like your field.</p></div><button className="icon-button" onClick={onClose} aria-label="Close profile editor" data-testid="button-close-profile"><X size={16} /></button></div><label htmlFor="profile-name">Your name</label><input id="profile-name" value={name} onChange={event => setName(event.target.value)} data-testid="input-profile-name" /><label>What are you curious about?</label><div className="interest-list">{options.map(option => <button key={option} className={`interest ${interests.includes(option) ? 'selected' : ''}`} onClick={() => setInterests(current => current.includes(option) ? current.filter(item => item !== option) : [...current, option])} data-testid={`button-interest-${option.toLowerCase().replace(' ', '-')}`}>{interests.includes(option) ? <Check size={12} /> : null}{option}</button>)}</div><div className="modal-actions"><button className="button button-soft" onClick={onClose} data-testid="button-cancel-profile">Not now</button><button className="button button-primary" onClick={save} data-testid="button-save-profile">Save profile <ArrowRight size={14} /></button></div></div></div>;
}

type PageProps = { savedIds: string[]; applications: Application[]; onSave: (id: string) => void; onApply: (opportunity: Opportunity) => void };

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [savedIds, setSavedIds] = useState<string[]>(() => readStorage(SAVED_KEY, []));
  const [applications, setApplications] = useState<Application[]>(() => readStorage(APPLICATIONS_KEY, []));
  const [notice, setNotice] = useState<Notice | null>(null);
  const [profileDone, setProfileDone] = useState(() => Boolean(readStorage(PROFILE_KEY, null)));
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => { if (!notice) return; const timeout = window.setTimeout(() => setNotice(null), 3800); return () => window.clearTimeout(timeout); }, [notice]);
  const onSave = (id: string) => { setSavedIds(current => { const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id]; localStorage.setItem(SAVED_KEY, JSON.stringify(next)); setNotice({ message: current.includes(id) ? 'Removed from your shortlist.' : 'Saved to your shortlist.' }); return next; }); };
  const onApply = (opportunity: Opportunity) => { if (applications.some(item => item.opportunityId === opportunity.id)) { setNotice({ message: 'Already applied — your application is in motion.' }); return; } const record = { opportunityId: opportunity.id, appliedAt: new Date().toISOString(), status: 'Applied' }; const next = [...applications, record]; setApplications(next); localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(next)); setNotice({ message: 'Application recorded. Good luck with this one.' }); if (opportunity.applyUrl) window.open(opportunity.applyUrl, '_blank', 'noopener,noreferrer'); };
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Shell savedCount={savedIds.length} applicationCount={applications.length}><Switch><Route path="/"><Dashboard savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} profileDone={profileDone} onCompleteProfile={() => setProfileOpen(true)} /></Route><Route path="/explore"><Explore savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} /></Route><Route path="/saved"><Saved savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} /></Route><Route path="/applications"><Applications applications={applications} /></Route><Route path="/opportunities/:id"><OpportunityDetail savedIds={savedIds} applications={applications} onSave={onSave} onApply={onApply} /></Route><Route><div className="page"><div className="empty-state"><div><div className="empty-icon"><Compass size={26} /></div><h2>Page not found.</h2><p>Let’s get you back to a useful signal.</p><Link href="/" className="button button-primary">Back to Today <ArrowRight size={14} /></Link></div></div></div></Route></Switch></Shell></RoutedErrorBoundary></WouterRouter>{profileOpen ? <ProfileModal onClose={() => setProfileOpen(false)} onSaved={() => { setProfileDone(true); setNotice({ message: 'Profile signal updated.' }); }} /> : null}<Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
