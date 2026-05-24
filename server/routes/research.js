import express from 'express';
import { researcherAgent, analystAgent, writerAgent } from '../agents.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/stream', async (req, res) => {
  const { topic } = req.query;
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Topic query parameter is required' });
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    if (res.flush) res.flush();
  };

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
    if (res.flush) res.flush();
  }, 15000);

  req.on('close', () => clearInterval(heartbeat));

  try {
    const researchId = uuidv4();
    const decodedTopic = decodeURIComponent(topic).trim();

    send('agent-start', { agent: 1, status: 'processing', message: '🔍 Agent 1 researching...' });
    const researchFindings = await researcherAgent(decodedTopic);
    send('agent-complete', { agent: 1, status: 'complete', preview: researchFindings.substring(0, 250).trim() + '...', fullText: researchFindings, message: '✓ Research complete' });

    send('agent-start', { agent: 2, status: 'processing', message: '🧠 Agent 2 analyzing...' });
    const analysis = await analystAgent(decodedTopic, researchFindings);
    send('agent-complete', { agent: 2, status: 'complete', preview: analysis.substring(0, 250).trim() + '...', fullText: analysis, message: '✓ Analysis complete' });

    send('agent-start', { agent: 3, status: 'processing', message: '✍️ Agent 3 writing report...' });
    const report = await writerAgent(decodedTopic, researchFindings, analysis);
    send('agent-complete', { agent: 3, status: 'complete', preview: (report.executiveSummary || '').substring(0, 250).trim() + '...', message: '✓ Report complete' });

    const fullText = [report.executiveSummary, ...(report.keyFindings || []), report.detailedAnalysis, report.conclusion, ...(report.recommendations || [])].join(' ');
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;

    send('complete', { researchId, topic: decodedTopic, report, researchFindings, analysis, wordCount, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Research pipeline error:', err);
    send('error', { message: err.message || 'An unexpected error occurred' });
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
});

router.post('/export-pdf', async (req, res) => {
  const { report, topic, generatedAt } = req.body;
  if (!report || !topic) {
    return res.status(400).json({ error: 'report and topic are required' });
  }

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

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;