import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
  ClipboardList, Target, BarChart3, CheckSquare, Lightbulb,
  Copy, Check, ChevronDown, ChevronUp, Download, RefreshCw,
  Share2, FileText, Loader2,
} from 'lucide-react';
import API_URL from '../config';

const SERVER = API_URL;

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
  const { key, label, icon: Icon, accent, light, badge, isList } = section;
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
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: light }}
          >
            <Icon size={18} style={{ color: accent }} />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</h3>
            {!expanded && !isEmpty && (
              <p className={`text-xs mt-0.5 truncate max-w-xs
                ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
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

      {/* Content */}
      {expanded && (
        <div
          className={`px-5 pb-5 border-t animate-fade-in
            ${darkMode ? 'border-white/5' : 'border-gray-50'}`}
        >
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
            <div className={`pt-4 text-sm leading-relaxed whitespace-pre-wrap
              ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportDisplay({ report, topic, wordCount, generatedAt, onNewResearch, darkMode }) {
  const [expanded, setExpanded]   = useState({ executiveSummary: true, keyFindings: true });
  const [downloading, setDown]    = useState(false);
  const [shared, setShared]       = useState(false);

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const expandAll   = () => setExpanded(Object.fromEntries(SECTIONS.map(s => [s.key, true])));
  const collapseAll = () => setExpanded({});

  const downloadPDF = useCallback(async () => {
    setDown(true);
    try {
      const res = await axios.post(
        `${SERVER}/api/research/export-pdf`,
        { report, topic, generatedAt },
        { responseType: 'blob' }
      );
      const url  = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href  = url;
      link.download = `ResearchAI-${topic.replace(/\s+/g, '-').slice(0, 40)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('PDF generation failed. Make sure puppeteer is installed in the server.');
    } finally {
      setDown(false);
    }
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
        {/* Gradient banner */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-cyan-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.3),transparent_70%)]" />

        <div className={`relative border rounded-2xl p-6 ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-semibold">Report Generated Successfully</span>
              </div>
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1 pr-4">{topic}</h2>
              {/* Meta */}
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
                disabled={downloading}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  bg-gradient-to-r from-purple-600 to-purple-700
                  hover:from-purple-500 hover:to-purple-600
                  text-white transition-all
                  hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                {downloading ? 'Generating...' : 'Download PDF'}
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

      {/* Expand / collapse all controls */}
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
