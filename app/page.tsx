"use client";
import React, { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("// Your generated code will appear here...");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const generateCode = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.code) {
        setCode(data.code);
        setActiveTab("preview");
      } else {
        setCode("// Error generating code");
      }
    } catch (err) {
      console.error(err);
      setCode("// Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  return (
    <main className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Left Sidebar: Controls & Prompt */}
      <div className="w-1/3 border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Frontend Builder 🚀
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            Describe your component or page, and AI will generate its code and live preview.
          </p>
          <textarea
            className="w-full h-40 bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none text-white"
            placeholder="E.g., Create a modern login form with a purple gradient..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button
          onClick={generateCode}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Generating Magic..." : "Generate & Build"}
        </button>
      </div>

      {/* Right Section: Split View / Code Editor & Live Preview */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Top Bar for Tabs & Actions */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-gray-950">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                activeTab === "preview" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                activeTab === "code" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              Source Code
            </button>
          </div>
          {activeTab === "code" && (
            <button
              onClick={copyToClipboard}
              className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded text-gray-300 transition"
            >
              Copy Code
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {activeTab === "preview" ? (
            <div className="w-full h-full bg-white flex items-center justify-center p-6 text-black overflow-auto">
              {/* Live Preview Render Box with Sandbox & Link Block protection */}
              <div className="w-full h-full border border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50">
                <iframe
                  title="live-preview"
                  className="w-full h-full border-0 rounded"
                  sandbox="allow-scripts"
                  srcDoc={`
                    <html>
                      <head>
                        <script>
                          // Prevent links inside iframe from opening new windows
                          document.addEventListener('click', function(e) {
                            const target = e.target.closest('a');
                            if (target) {
                              e.preventDefault();
                            }
                          }, true);
                        </script>
                      </head>
                      <body>${code}</body>
                    </html>
                  `}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full p-4 overflow-auto bg-gray-950 font-mono text-sm">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-gray-200 focus:outline-none resize-none"
                spellCheck="false"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}