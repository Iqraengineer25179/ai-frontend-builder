'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');

  const generateCode = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      
      if (data.error) {
        alert('API Error: ' + data.error);
        setLoading(false);
        return;
      }

      const cleanCode = (data.code || '').replace(/```html/g, '').replace(/```/g, '');
      setHtmlCode(cleanCode);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400 text-center">AI Frontend Builder</h1>
      
      <div className="flex gap-4 max-w-3xl w-full mx-auto mb-6">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Create a modern landing page for a coffee shop with dark theme..."
          className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 text-white"
        />
        <button 
          onClick={generateCode}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
        >
          {loading ? 'Generating...' : 'Build UI'}
        </button>
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
        <div className="bg-gray-900 px-4 py-2 text-xs text-gray-400 border-b border-gray-800 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="ml-2">Live Preview Window</span>
        </div>
        <iframe 
          srcDoc={htmlCode}
          title="output-preview"
          className="w-full flex-1 bg-white min-h-[500px]"
        />
      </div>
    </main>
  );
}