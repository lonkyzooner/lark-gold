import React, { useState, useEffect } from 'react';
import orchestrator from '../services/LarkOrchestrator';
import { Button } from './ui/button';
import { Eraser as EraseIcon, Download as DownloadIcon, Save as SaveIcon, Sparkles as SparklesIcon, CheckCircle as CheckCircleIcon, ClipboardCheck as ClipboardCheckIcon, X as XIcon, FileText as TemplateIcon, Folder as FolderIcon, Loader2 as LoaderIcon, Trash as TrashIcon, XCircle as XCircleIcon } from 'lucide-react';

interface SavedReport { id: string; title: string; content: string; caseNumber?: string; }

const templates = {
  'Incident Report': '## Incident Information\n\n## Parties Involved\n\n## Narrative\n\n## Actions Taken\n\n## Evidence',
  'Traffic Stop': '## Stop Details\n\n## Driver Information\n\n## Violations\n\n## Officer Actions\n\n## Outcome',
  'Arrest Report': '## Arrest Details\n\n## Suspect Information\n\n## Charges\n\n## Evidence\n\n## Officer Statement'
};

const ReportAssistant: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const clearAll = () => { setReportText(''); setTitle(''); setFeedback(null); };
  const exportReport = () => {
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title || 'report'}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const saveReport = async () => {
    if (!title.trim() || !reportText.trim()) return;
    setSavedReports(prev => [...prev, { id: `${Date.now()}`, title, content: reportText }]);
    setTitle(''); setReportText(''); setFeedback(null);
    try {
      await (orchestrator as any).triggerAction('reportSaved', { title, content: reportText });
      setFeedback({ type: 'success', message: 'Report saved and backend notified.' });
    } catch {
      setFeedback({ type: 'error', message: 'Report saved locally, but failed to notify backend.' });
    }
  };

  const loadReport = (r: SavedReport) => { setTitle(r.title); setReportText(r.content); setFeedback(null); };

  const generateDraft = async () => {
    setLoading(true); setFeedback(null);
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'optimusalpha',
          messages: [
            {
              role: 'user',
              content: 'Generate a detailed, professional police incident report draft based on recent incident data.'
            }
          ]
        })
      });
      const data = await res.json();
      setReportText(data.choices?.[0]?.message?.content || 'No report generated.');
      setToast({ message: 'Draft generated successfully', type: 'success' });
    } catch {
      setToast({ message: 'Failed to generate draft', type: 'error' });
    }
    setLoading(false);
  };

  const reviewReport = async () => {
    if (!reportText.trim()) return;
    setLoading(true); setFeedback(null);
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'optimusalpha',
          messages: [
            {
              role: 'user',
              content:
                `You are an expert legal writing assistant. Carefully review the following police report and provide a numbered list of specific, actionable suggestions to improve clarity, professionalism, completeness, and grammar. Quote or reference the exact sentence or section, explain why it needs improvement, and provide a concrete suggestion.\n\nReport:\n${reportText}`
            }
          ]
        })
      });
      const data = await res.json();
      setFeedback({ type: 'success', message: data.choices?.[0]?.message?.content || 'No suggestions generated.' });
      setToast({ message: 'Report reviewed successfully', type: 'success' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to review report.' });
      setToast({ message: 'Failed to review report', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Report Assistant</h2>
          <p className="text-gray-400 text-sm">Generate and review professional police reports</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={clearAll} variant="outline" className="bg-gray-800 hover:bg-gray-700 border-gray-700"><EraseIcon className="h-4 w-4 mr-2" />Clear</Button>
          <Button onClick={exportReport} disabled={!reportText.trim()} className="bg-blue-600 hover:bg-blue-700"><DownloadIcon className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Report Title" className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Button onClick={saveReport} disabled={loading || !title.trim() || !reportText.trim()} className="bg-green-600 hover:bg-green-700"><SaveIcon className="h-4 w-4 mr-2" />Save</Button>
            </div>
            <div className="relative">
              <textarea value={reportText} onChange={e => setReportText(e.target.value)} placeholder="Write or generate your police report here..." className="w-full h-[500px] p-4 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none" />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button onClick={generateDraft} disabled={loading} className="bg-purple-600 hover:bg-purple-700"><SparklesIcon className="h-4 w-4 mr-2" />{loading ? 'Generating...' : 'Generate Draft'}</Button>
                <Button onClick={reviewReport} disabled={loading || !reportText.trim()} className="bg-yellow-600 hover:bg-yellow-700"><CheckCircleIcon className="h-4 w-4 mr-2" />{loading ? 'Reviewing...' : 'Review'}</Button>
              </div>
            </div>
          </div>
          {feedback && (
            <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-yellow-400 font-semibold flex items-center gap-2"><ClipboardCheckIcon className="h-5 w-5" />AI Review Suggestions</h3>
                <Button onClick={() => setFeedback(null)} variant="ghost" size="sm" className="text-gray-400 hover:text-white"><XIcon className="h-4 w-4" /></Button>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className={`feedback ${feedback.type} text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><TemplateIcon className="h-5 w-5" />Templates</h3>
            <div className="space-y-2">
              {Object.keys(templates).map(template => (
                <button key={template} className="w-full text-left px-4 py-3 rounded bg-gray-900 hover:bg-gray-700 transition-colors text-gray-300" onClick={() => { setReportText(templates[template as keyof typeof templates]); setTitle(template); }}>{template}</button>
              ))}
            </div>
          </div>
          {savedReports.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FolderIcon className="h-5 w-5" />Saved Reports</h3>
              <div className="space-y-2">
                {savedReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-700 transition group">
                    <span className="text-gray-300 truncate flex-1">{report.title}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button onClick={() => loadReport(report)} size="sm" className="bg-blue-600 hover:bg-blue-700"><LoaderIcon className="h-4 w-4" /></Button>
                      <Button onClick={() => setSavedReports(prev => prev.filter(x => x.id !== report.id))} size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700"><TrashIcon className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg transition-all flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ReportAssistant;
