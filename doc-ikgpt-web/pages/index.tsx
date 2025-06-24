import { useState, useRef, useEffect } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";

export default function VoiceControlDashboard() {
  const [patients, setPatients] = useState([
    { name: 'Patient A', status: 'stopped' },
    { name: 'Patient B', status: 'stopped' },
    { name: 'Patient C', status: 'stopped' }
  ]);

  const [selectedLang, setSelectedLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [canvasNote, setCanvasNote] = useState('');
  const recognitionRef = useRef<any>(null);

  const updateStatus = (index: number, status: string) => {
    setPatients(prev => prev.map((p, i) => i === index ? { ...p, status } : p));
  };

  const simulateTranslation = async (text: string, targetLang: string) => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Translate the following patient message to ${targetLang}: '${text}'`
          }
        ]
      })
    });
    const data = await res.json();
    setTranslatedText(data.choices?.[0]?.message?.content || 'Translation error');
  };

  const performMedicalSearch = async () => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Search for evidence-based medical guidelines and references related to: ${searchQuery}. Include sources like AHA, IDSA, ACG, GOLD, and UpToDate.`
          }
        ]
      })
    });
    const data = await res.json();
    setSearchResult(data.choices?.[0]?.message?.content || 'No result');
  };

  const exportNotes = () => {
    const element = document.createElement("a");
    const file = new Blob([canvasNote], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "clinical_note.txt";
    document.body.appendChild(element);
    element.click();
  };

  const exportNotesAsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Clinical Note</title></head><body>');
      printWindow.document.write(`<pre style="font-family:sans-serif">${canvasNote}</pre>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const generateSoapNote = async () => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a medical documentation assistant generating SOAP notes. Follow HIPAA-compliant formatting."
          },
          {
            role: "user",
            content: `Based on this dictation, generate a SOAP note:\n${canvasNote}`
          }
        ]
      })
    });
    const data = await res.json();
    const generatedNote = data.choices?.[0]?.message?.content || '';
    setCanvasNote(generatedNote);
  };

  const submitNoteToEHR = async () => {
    try {
      const res = await fetch('/api/ehr-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note: canvasNote })
      });
      const result = await res.json();
      alert(result.message || 'Submitted successfully');
    } catch (error) {
      alert('Error submitting to EHR');
    }
  };

  useEffect(() => {
    simulateTranslation("How are you feeling today?", selectedLang);

    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        setCanvasNote(prev => prev + '\n' + transcript);
      };
      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  return (
    <>
    <nav className="bg-blue-100 p-4 mb-6 rounded-xl shadow flex flex-col sm:flex-row justify-between items-center">
  <div className="flex items-center space-x-3">
    <img src="/logo.png" alt="DOC IK Logo" className="w-10 h-10 rounded-full" />
    <h1 className="text-xl font-bold text-blue-700">DOC IK</h1>
  </div>
  <div className="space-x-4">
    <a href="/voice-control" className="text-blue-800 hover:underline">Voice</a>
    <a href="/transcribe" className="text-blue-800 hover:underline">Transcribe</a>
    <a href="/soap" className="text-blue-800 hover:underline">Progress Note</a>
    <a href="/admission" className="text-blue-800 hover:underline">Admission Note</a>
    <a href="/discharge" className="text-blue-800 hover:underline">Discharge Summary</a>
  </div>
</nav>

    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Patient Voice Controls + Translation + Medical Search</h1>

      <div className="mb-4 flex gap-3">
        <button onClick={() => recognitionRef.current?.start()} className="bg-green-600 text-white px-4 py-2 rounded">🎤 Start Live Dictation</button>
        <button onClick={() => recognitionRef.current?.stop()} className="bg-red-600 text-white px-4 py-2 rounded">🛑 Stop Dictation</button>
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-gray-700">Select Target Language</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
          <option value="ru">Russian</option>
          <option value="pt">Portuguese</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
        </select>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {patients.map((p, i) => (
          <div key={i} className="p-4 border rounded-xl bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">{p.name}</h2>
            <p className="mb-4 text-gray-600">Status: {p.status}</p>
            <div className="flex gap-2 mb-4">
              <button onClick={() => updateStatus(i, 'recording')} className="bg-green-500 text-white px-4 py-2 rounded">Start</button>
              <button onClick={() => updateStatus(i, 'paused')} className="bg-yellow-500 text-white px-4 py-2 rounded">Pause</button>
              <button onClick={() => updateStatus(i, 'stopped')} className="bg-red-500 text-white px-4 py-2 rounded">Stop</button>
            </div>
            <ReactMediaRecorder
  audio
  render={({ status, startRecording, stopRecording, pauseRecording, mediaBlobUrl }) => (
    <div>
      <p className="text-sm text-gray-500">Recording Status: {status}</p>
      <div className="flex gap-2 my-2">
        <button onClick={startRecording} className="bg-green-600 text-white px-2 py-1 rounded">🎙️ Start Dictation</button>
        <button onClick={pauseRecording} className="bg-yellow-600 text-white px-2 py-1 rounded">⏸️ Pause</button>
        <button onClick={stopRecording} className="bg-red-600 text-white px-2 py-1 rounded">⏹️ Stop</button>
      </div>
      {mediaBlobUrl && (
        <audio
          src={mediaBlobUrl}
          controls
          className="mt-2 w-full"
          onEnded={() => {
            fetch(mediaBlobUrl)
              .then(r => r.blob())
              .then(blob => blob.text())
              .then(text => setCanvasNote(prev => prev + '\n' + text));
          }}
        />
      )}
    </div>
  )}
/>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Live Translation Output</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-700 italic">Translated: {translatedText}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Medical Deep Search</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search guidelines or conditions..."
            className="border p-2 rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={performMedicalSearch} className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        </div>
        <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
          <p className="text-gray-700">{searchResult}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">HIPAA-Compliant Canvas Notes</h2>
        <textarea
          value={canvasNote}
          onChange={(e) => setCanvasNote(e.target.value)}
          placeholder={`SOAP Note Format:\nSubjective:\nObjective:\nAssessment:\nPlan:`}
          className="w-full border p-4 rounded h-60 bg-white font-mono"
        ></textarea>
        <div className="flex gap-3 mt-4">
          <button
            onClick={generateSoapNote}
            className="bg-purple-700 text-white px-4 py-2 rounded"
          >
            ✨ Auto-Draft Note
          </button>
          <button
            onClick={exportNotes}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Download TXT
          </button>
          <button
            onClick={exportNotesAsPDF}
            className="bg-amber-600 text-white px-4 py-2 rounded"
          >
            Export as PDF
          </button>
          <button
            onClick={submitNoteToEHR}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit to EHR
          </button>
        </div>
      </div>
    </main>
  </>
  );
}

