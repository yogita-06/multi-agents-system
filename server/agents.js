import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

export const researcherAgent = async (topic) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert researcher. Given a topic, identify and list the 5 most important aspects, recent developments, key statistics, and main challenges. Be factual and concise. Structure your response with clear numbered sections and use concrete data where possible.`,
      },
      {
        role: 'user',
        content: `Research this topic thoroughly and provide comprehensive findings: "${topic}"`,
      },
    ],
    model: MODEL,
    temperature: 0.7,
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content || '';
};

export const analystAgent = async (topic, researchFindings) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert analyst. Given research findings, analyze patterns, identify insights, compare different perspectives, and highlight the most significant points. Structure your analysis clearly with sections for: Key Patterns, Critical Insights, Comparative Analysis, and Significance Rankings. Be specific and evidence-driven.`,
      },
      {
        role: 'user',
        content: `Topic: "${topic}"\n\nResearch Findings:\n${researchFindings}\n\nProvide a comprehensive, structured analysis of these findings.`,
      },
    ],
    model: MODEL,
    temperature: 0.7,
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content || '';
};

export const writerAgent = async (topic, researchFindings, analysis) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert report writer. Given research and analysis, write a professional, well-structured report. You MUST return a valid JSON object with EXACTLY these keys (no extra text before or after the JSON):
{
  "executiveSummary": "2-3 paragraph comprehensive summary",
  "keyFindings": ["finding 1 with detail", "finding 2 with detail", "finding 3 with detail", "finding 4 with detail", "finding 5 with detail"],
  "detailedAnalysis": "3-4 paragraphs of detailed analysis with insights",
  "conclusion": "1-2 paragraph conclusion",
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3", "actionable recommendation 4", "actionable recommendation 5"]
}
Make it formal, clear, and actionable. Return ONLY the JSON object.`,
      },
      {
        role: 'user',
        content: `Topic: "${topic}"\n\nResearch:\n${researchFindings}\n\nAnalysis:\n${analysis}\n\nWrite a comprehensive professional report as a JSON object.`,
      },
    ],
    model: MODEL,
    temperature: 0.4,
    max_tokens: 3000,
  });

  const content = completion.choices[0]?.message?.content || '{}';

  // Extract JSON robustly
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Fallback: structure the raw content
    }
  }

  return {
    executiveSummary: content.substring(0, 800),
    keyFindings: ['See full analysis below'],
    detailedAnalysis: content,
    conclusion: 'Please review the detailed analysis above.',
    recommendations: ['Review the findings and apply relevant insights to your specific context.'],
  };
};
