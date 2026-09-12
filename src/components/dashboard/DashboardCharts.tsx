import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  Award,
  PieChart as PieIcon,
  BarChart3,
  Info
} from 'lucide-react';
import { DASHBOARD_DEMO_DATA } from '../../mockData/dashboardDemoData';

interface DashboardChartsProps {
  isLoading?: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ isLoading = false }) => {
  const demo = DASHBOARD_DEMO_DATA;
  const skillGrowthData = demo.skillGrowthTimeline || [
    { month: 'May', score: 58 },
    { month: 'Jun', score: 64 },
    { month: 'Jul', score: 69 },
    { month: 'Aug', score: 76 },
    { month: 'Sep', score: 82 }
  ];

  const assessmentData = demo.assessmentPerformanceData || [
    { skill: 'Python', score: 86, passScore: 70 },
    { skill: 'Prob. Solving', score: 83, passScore: 70 },
    { skill: 'C', score: 81, passScore: 70 },
    { skill: 'CAD', score: 78, passScore: 70 },
    { skill: 'React', score: 74, passScore: 70 }
  ];

  const breakdownData = demo.credibilityBreakdownData || [
    { name: 'Verified Skills', value: 30, color: '#10B981' },
    { name: 'Assessments', value: 25, color: '#6C63FF' },
    { name: 'Evidence', value: 20, color: '#8B7CFF' },
    { name: 'Projects', value: 15, color: '#32395C' },
    { name: 'Verification', value: 10, color: '#666A7A' }
  ];

  const benchmarkData = demo.benchmarkComparison || {
    candidateReadiness: 84,
    nationalBenchmark: 72,
    delta: 12,
    cohortLabel: 'Campus Cohort Benchmark (Demo)'
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="h-64 rounded-2xl bg-[#171A2B] border border-[#252A46] p-5 flex items-center justify-center animate-pulse">
            <span className="text-xs text-slate-500 font-medium">Loading analytics...</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#8B7CFF]" />
            Performance & Credibility Analytics
          </h2>
          <p className="text-xs text-[#666A7A] mt-0.5">
            Interactive verified evidence and assessment telemetry.
          </p>
        </div>
      </div>

      {/* 2x2 Desktop Grid, 1 Column Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* CHART 1: Skill Growth (Line Chart) */}
        <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#252A46]/80">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#6C63FF]" />
                Skill Growth
              </h3>
              <p className="text-[11px] text-[#666A7A] mt-0.5">
                Your assessment and evidence-backed skill progression
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#8B7CFF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-md border border-[#6C63FF]/20">
              +24 pts (5 mo)
            </span>
          </div>

          <div className="h-56 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252A46" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#666A7A"
                  tick={{ fontSize: 11, fill: '#9498AB' }}
                  tickLine={false}
                  axisLine={{ stroke: '#252A46' }}
                />
                <YAxis
                  stroke="#666A7A"
                  domain={[40, 100]}
                  tick={{ fontSize: 11, fill: '#9498AB' }}
                  tickLine={false}
                  axisLine={{ stroke: '#252A46' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#111424] border border-[#252A46] p-2.5 rounded-xl shadow-xl text-xs">
                          <div className="font-bold text-white mb-1">{label}</div>
                          <div className="text-[#8B7CFF] font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#6C63FF]" />
                            Skill Index: <span className="text-white font-bold">{payload[0].value} / 100</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6C63FF"
                  strokeWidth={2.5}
                  dot={{ fill: '#8B7CFF', stroke: '#171A2B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8B7CFF' }}
                  name="Skill Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Assessment Performance (Bar Chart) */}
        <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#252A46]/80">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#10B981]" />
                Assessment Performance
              </h3>
              <p className="text-[11px] text-[#666A7A] mt-0.5">
                Proctored benchmark scores with passing indicator (70%)
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md border border-[#10B981]/20">
              5/5 Passed
            </span>
          </div>

          <div className="h-56 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252A46" vertical={false} />
                <XAxis
                  dataKey="skill"
                  stroke="#666A7A"
                  tick={{ fontSize: 10, fill: '#9498AB' }}
                  tickLine={false}
                  axisLine={{ stroke: '#252A46' }}
                />
                <YAxis
                  stroke="#666A7A"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#9498AB' }}
                  tickLine={false}
                  axisLine={{ stroke: '#252A46' }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#10B981"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#111424] border border-[#252A46] p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-white">{data.skill} Assessment</div>
                          <div className="text-[#8B7CFF] font-semibold">
                            Score: <span className="text-white font-bold">{data.score}%</span>
                          </div>
                          <div className="text-[10px] text-emerald-400 font-medium">
                            Status: Passed (&ge; 70% threshold)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="#6C63FF"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Credibility Breakdown (Donut / Ring Chart) */}
        <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#252A46]/80">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-[#8B7CFF]" />
                Credibility Breakdown
              </h3>
              <p className="text-[11px] text-[#666A7A] mt-0.5">
                Weightage distribution across verified credibility factors
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#666A7A]">100% Total</span>
          </div>

          <div className="h-56 w-full pt-1 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="h-44 w-44 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-[#111424] border border-[#252A46] px-2.5 py-1.5 rounded-xl shadow-xl text-xs">
                            <span className="font-bold text-white">{data.name}:</span>{' '}
                            <span className="text-[#8B7CFF] font-semibold">{data.value}%</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#171A2B"
                    strokeWidth={2}
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-black text-white">82</span>
                <span className="text-[9px] font-bold text-[#666A7A] uppercase">Index</span>
              </div>
            </div>

            {/* Legend & Categories */}
            <div className="flex-1 w-full space-y-1.5 pr-2">
              {breakdownData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 text-[11px] truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-white text-[11px]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: India Benchmark (Cohort Comparison) */}
        <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#252A46]/80">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#6C63FF]" />
                India Benchmark
              </h3>
              <p className="text-[11px] text-[#666A7A] mt-0.5">
                Candidate readiness vs campus engineering cohort
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#8B7CFF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-md border border-[#6C63FF]/20">
              Cohort Metric
            </span>
          </div>

          <div className="h-56 w-full pt-2 flex flex-col justify-between space-y-3">
            {/* Top Macro Comparison */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#111424] border border-[#252A46]">
              <div>
                <span className="text-[10px] font-bold text-[#666A7A] uppercase tracking-wider block">Your Readiness</span>
                <div className="text-xl font-black text-white mt-0.5 flex items-baseline gap-1">
                  {benchmarkData.candidateReadiness}
                  <span className="text-[10px] font-normal text-[#10B981]">/100 (+{benchmarkData.delta})</span>
                </div>
              </div>
              <div className="border-l border-[#252A46] pl-3">
                <span className="text-[10px] font-bold text-[#666A7A] uppercase tracking-wider block">Benchmark</span>
                <div className="text-xl font-black text-[#8B7CFF] mt-0.5 flex items-baseline gap-1">
                  {benchmarkData.nationalBenchmark}
                  <span className="text-[10px] font-normal text-[#666A7A]">/100</span>
                </div>
              </div>
            </div>

            {/* Visual comparative bar breakdown */}
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">Your Readiness Score</span>
                  <span className="text-white font-bold">{benchmarkData.candidateReadiness}%</span>
                </div>
                <div className="w-full bg-[#111424] rounded-full h-2 overflow-hidden border border-[#252A46]">
                  <div
                    className="h-full rounded-full bg-[#6C63FF] transition-all duration-500"
                    style={{ width: `${benchmarkData.candidateReadiness}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#666A7A] font-medium">Cohort Average Benchmark</span>
                  <span className="text-[#8B7CFF] font-bold">{benchmarkData.nationalBenchmark}%</span>
                </div>
                <div className="w-full bg-[#111424] rounded-full h-2 overflow-hidden border border-[#252A46]">
                  <div
                    className="h-full rounded-full bg-[#252A46] border-r-2 border-[#8B7CFF] transition-all duration-500"
                    style={{ width: `${benchmarkData.nationalBenchmark}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Disclaimer / Note */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#666A7A] pt-1 border-t border-[#252A46]/60">
              <Info className="w-3 h-3 text-[#666A7A] shrink-0" />
              <span>Campus cohort comparative index based on verified assessment scores.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
