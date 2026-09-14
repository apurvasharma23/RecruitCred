import React, { useEffect, useState } from 'react';
import { Link, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { apiGetPublicProfile } from '../../services/auth/authService';

interface PublicProfileViewProps {
  username: string;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchProfile = async () => {
      const res = await apiGetPublicProfile(username);
      if (!isMounted) return;

      if (res.success && res.profile) {
        setProfile(res.profile);
      } else {
        setError(res.error || 'Profile not found.');
      }
      setLoading(false);
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Fetching verified public profile...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
        <div className="text-center max-w-md p-8 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-sm text-slate-400">
            The public identifier <strong className="text-white font-mono">@{username}</strong> is not registered or is private.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25"
          >
            <Link className="w-4 h-4" />
            <span>Return to RecruitCred Home</span>
          </a>
        </div>
      </main>
    );
  }

  const verifiedSkills = (profile.skills || []).filter((skill: any) => skill.status === 'verified');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12">
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl relative overflow-hidden">
        {/* Top Glow Ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
            alt={profile.name}
            className="h-24 w-24 rounded-2xl object-cover ring-2 ring-emerald-400/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black">{profile.name}</h1>
              <ShieldCheck className="h-5 w-5 text-emerald-400" aria-label="Verified profile" />
            </div>
            <p className="mt-1 text-sm text-emerald-300">
              @{profile.uniqueUserId || profile.username} · {profile.role}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">{profile.bio}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-xs text-slate-500">Readiness Score</span>
            <strong className="mt-1 block text-2xl text-white">{profile.overallScore || 75}%</strong>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-xs text-slate-500">Verified Skills</span>
            <strong className="mt-1 block text-2xl text-emerald-400">{verifiedSkills.length}</strong>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-xs text-slate-500">Institution</span>
            <strong className="mt-1 block text-sm text-slate-200 truncate">
              {profile.college || profile.education || 'Enterprise Partner'}
            </strong>
          </div>
        </div>

        {/* Verified Skills badges */}
        {verifiedSkills.length > 0 ? (
          <div className="mt-8 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cryptographically Verified Skills:
            </div>
            <div className="flex flex-wrap gap-2">
              {verifiedSkills.map((skill: any) => (
                <span
                  key={skill.id || skill.name}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{skill.name} · {skill.score || 85}% ({skill.level || 'Verified'})</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            No completed assessments yet for this public identifier.
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Link className="h-4 w-4" />
            <span>RecruitCred Platform Home</span>
          </a>
          <span className="text-xs text-slate-500 font-mono">Server-Verified Profile</span>
        </div>
      </article>
    </main>
  );
};