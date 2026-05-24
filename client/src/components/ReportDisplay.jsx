import React, { useState, useCallback } from 'react';
import {
  ClipboardList, Target, BarChart3, CheckSquare, Lightbulb,
  Copy, Check, ChevronDown, ChevronUp, Download, RefreshCw,
  Share2, FileText,
} from 'lucide-react';

const SECTIONS = [
  {
    key: 'executiveSummary',
    label: 'Executive Summary',
    icon: ClipboardList,
    color: 'purple',
    accent: '#7C3AED',
    light: 'rgba(124,58,237,0.1)',
    badge: 'text-purple-300',
  },
  {
    key: 'keyFindings',
    label: 'Key Findings',
    icon: Target,
    color: 'blue',
    accent: '#3B82F6',
    light: 'rgba(59,130,246,0.1)',
    badge: 'text-blue-300',
    isList: true,
  },
  {
    key: 'detailedAnalysis',
    label: 'Detailed Analysis',
    icon: BarChart3,
    color: 'cyan',
    accent: '#06B6D4',
    light: 'rgba(6,182,212,0.1)',
    badge: 'text-cyan-300',
  },
  {
    key: 'conclusion',
    label: 'Conclusion',
    icon: CheckSquare,
    color: 'green',
    accent: '#10B981',
    light: 'rgba(16,185,129,0.1)',
    badge: 'text-emerald-300',
  },
  {
    key: 'recommendations',
    label: 'Recommendations',
    icon: Lightbulb,
    color: 'amber',
    accent: '#F59E0B',
    light: 'rgba(245,158,11,0.1)',
    badge: 'text-amber-300',
    isList: true,
  },
];

function CopyButton({ text, darkMode }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
        ${copied
          ? 'bg-green-500/20 text-green-400'
          : darkMode
            ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            : 'bg-black/5 text-gray-500 hover:bg-black/10 hover:text-gray-700'
        }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function SectionCard({ section, report, expanded, onToggle, darkMode }) {
  const { key, label, icon: Icon, accent, light, isList } = section;
  const content = report[key];
  const isEmpty = !content || (Array.isArray(content) && content.length === 0);

  const plainText = isList
    ? (Array.isArray(content) ? content.join('\n') : '')
    : (content || '');

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-300
        ${darkMode ? 'bg-white/3 border-white/6 hover:border-white/10' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: light }}
          >
            <Icon size={18} style={{ color: accent }} />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</h3>
            {!expanded && !isEmpty && (
              <p className={`text-xs mt-0.5 truncate max-w-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {isList
                  ? `${Array.isArray(content) ? content.length : 0} items`
                  : `${plainText.split(' ').length} words`
                }
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {expanded && !isEmpty && <CopyButton text={plainText} darkMode={darkMode} />}
          {expanded
            ? <ChevronUp size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            : <ChevronDown size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          }
        </div>
      </button>

      {expanded && (
        <div className={`px-5 pb-5 border-t animate-fade-in ${darkMode ? 'border-white/5' : 'border-gray-50'}`}>
          {isEmpty ? (
            <p className={`pt-4 text-sm italic ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              No content available.
            </p>
          ) : isList ? (
            <ul className="pt-4 space-y-3">
              {(Array.isArray(content) ? content : [content]).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={`pt-4 text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportDisplay({ report, topic, wordCount, generatedAt, onNewResearch, darkMode }) {
  const [expanded, setExpanded] = useState({ executiveSummary: true, keyFindings: true });
  const [shared, setShared]     = useState(false);

  const toggle      = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const expandAll   = () => setExpanded(Object.fromEntries(SECTIONS.map(s => [s.key, true])));
  const collapseAll = () => setExpanded({});

  // PDF generation — no server needed, browser handles it
  const downloadPDF = useCallback(() => {
    const formatList = (items) =>
      Array.isArray(items) && items.length
        ? items.map((item) => `<li>${item}</li>`).join('')
        : '<li>N/A</li>';

    const date = generatedAt
      ? new Date(generatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ResearchAI - ${topic}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 48px; line-height: 1.7; font-size: 14px; }
    .header { background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%); color: white; padding: 32px 36px; border-radius: 16px; margin-bottom: 32px; }
    .header-title { font-size: 26px; font-weight: 700; margin-bottom: 8px; }
    .header-meta { font-size: 13px; opacity: 0.88; }
    .header-meta span { margin-right: 24px; }
    .section { background: #F8F7FF; border-left: 4px solid #7C3AED; border-radius: 0 12px 12px 0; padding: 24px 28px; margin-bottom: 20px; }
    .section.cyan { border-left-color: #06B6D4; }
    .section.blue { border-left-color: #3B82F6; }
    .section-badge { display: inline-block; background: linear-gradient(135deg, #7C3AED, #06B6D4); color: white; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; }
    .section h2 { color: #4C1D95; font-size: 17px; font-weight: 700; margin-bottom: 12px; }
    .section p { color: #374151; line-height: 1.8; white-space: pre-wrap; }
    .section ul { padding-left: 20px; }
    .section li { color: #374151; margin-bottom: 8px; line-height: 1.7; }
    .footer { text-align: center; color: #9CA3AF; font-size: 11px; margin-top: 36px; padding-top: 16px; border-top: 1px solid #E5E7EB; }
    @media print { body { padding: 20px; } .header { border-radius: 8px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-title">🔬 ResearchAI Report</div>
    <div class="header-meta">
      <span>📌 Topic: <strong>${topic}</strong></span>
      <span>📅 ${date}</span>
    </div>
  </div>
  <div class="section">
    <div class="section-badge">📋 Executive Summary</div>
    <h2>Executive Summary</h2>
    <p>${report.executiveSummary || 'N/A'}</p>
  </div>
  <div class="section blue">
    <div class="section-badge" style="background:linear-gradient(135deg,#3B82F6,#7C3AED)">🎯 Key Findings</div>
    <h2 style="color:#1D4ED8">Key Findings</h2>
    <ul>${formatList(report.keyFindings)}</ul>
  </div>
  <div class="section cyan">
    <div class="section-badge" style="background:linear-gradient(135deg,#06B6D4,#7C3AED)">📊 Detailed Analysis</div>
    <h2 style="color:#0E7490">Detailed Analysis</h2>
    <p>${(report.detailedAnalysis || 'N/A').replace(/\n/g, '<br>')}</p>
  </div>
  <div class="section">
    <div class="section-badge">✅ Conclusion</div>
    <h2>Conclusion</h2>
    <p>${report.conclusion || 'N/A'}</p>
  </div>
  <div class="section blue">
    <div class="section-badge" style="background:linear-gradient(135deg,#059669,#06B6D4)">💡 Recommendations</div>
    <h2 style="color:#065F46">Recommendations</h2>
    <ul>${formatList(report.recommendations)}</ul>
  </div>
  <div class="footer">Generated by <strong>ResearchAI</strong> | Powered by LLaMA-3.3-70B via Groq</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
  }, [report, topic, generatedAt]);

  const shareReport = () => {
    const fullText = SECTIONS.map(s => {
      const v = report[s.key];
      const body = Array.isArray(v) ? v.map((x, i) => `${i + 1}. ${x}`).join('\n') : (v || '');
      return `## ${s.label}\n${body}`;
    }).join('\n\n');

    const textToCopy = `ResearchAI Report: ${topic}\n${'='.repeat(60)}\n\n${fullText}\n\nGenerated by ResearchAI`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    });
  };

  const date = generatedAt
    ? new Date(generatedAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="animate-fade-in-up">
      {/* Report header card */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-cyan-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.3),transparent_70%)]" />

        <div className={`relative border rounded-2xl p-6 ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-semibold">Report Generated Successfully</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1 pr-4">{topic}</h2>
              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  { icon: FileText, label: `${wordCount.toLocaleString()} words` },
                  { icon: ClipboardList, label: '5 sections' },
                  { icon: null, label: date },
                ].map(({ icon: Ic, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                    {Ic && <Ic size={11} />}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
              <button
                onClick={shareReport}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all
                  ${shared
                    ? 'bg-green-500/20 border-green-500/30 text-green-400'
                    : darkMode
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {shared ? <Check size={13} /> : <Share2 size={13} />}
                {shared ? 'Copied!' : 'Share'}
              </button>

              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  bg-gradient-to-r from-purple-600 to-purple-700
                  hover:from-purple-500 hover:to-purple-600
                  text-white transition-all
                  hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]"
              >
                <Download size={13} />
                Download PDF
              </button>

              <button
                onClick={onNewResearch}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all
                  ${darkMode
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-600'
                  }`}
              >
                <RefreshCw size={13} />
                New Research
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expand / collapse controls */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Report Sections
        </h3>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className={`text-xs px-2.5 py-1 rounded-lg transition
              ${darkMode ? 'text-gray-500 hover:text-purple-400 hover:bg-purple-500/10' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className={`text-xs px-2.5 py-1 rounded-lg transition
              ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <SectionCard
            key={section.key}
            section={section}
            report={report}
            expanded={!!expanded[section.key]}
            onToggle={() => toggle(section.key)}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className={`mt-8 p-5 rounded-2xl border text-center
        ${darkMode ? 'bg-white/2 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Want to research another topic?
        </p>
        <button
          onClick={onNewResearch}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white
            bg-gradient-to-r from-purple-600 to-cyan-600
            hover:from-purple-500 hover:to-cyan-500
            transition-all duration-200
            hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
        >
          <RefreshCw size={15} />
          Start New Research
        </button>
      </div>
    </div>
  );
}