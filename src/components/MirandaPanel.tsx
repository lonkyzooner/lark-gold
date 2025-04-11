import React, { useState, useRef } from "react";
import { BookOpenIcon, UserIcon, HashIcon, GlobeIcon, PlayIcon, Loader2Icon } from "lucide-react";

// Supported languages and their display names
const LANGUAGES = [
  { code: "english", label: "English" },
  { code: "spanish", label: "Spanish" },
  { code: "french", label: "French" },
  { code: "vietnamese", label: "Vietnamese" },
  { code: "mandarin", label: "Mandarin" },
  { code: "russian", label: "Russian" },
  { code: "arabic", label: "Arabic" }
];

// Placeholder for Miranda rights text (should be imported from offlineData or backend)
const MIRANDA_TEXT: Record<string, string> = {
  english: "You have the right to remain silent. Anything you say can and will be used against you in a court of law. You have the right to an attorney. If you cannot afford an attorney, one will be provided for you. Do you understand these rights as they have been read to you?",
  spanish: "Tiene derecho a guardar silencio. Todo lo que diga puede y será usado en su contra en un tribunal. Tiene derecho a un abogado. Si no puede pagar uno, se le proporcionará uno. ¿Entiende estos derechos tal como se los he leído?",
  french: "Vous avez le droit de garder le silence. Tout ce que vous direz pourra être utilisé contre vous devant un tribunal. Vous avez le droit à un avocat. Si vous n'avez pas les moyens d'en avoir un, un avocat vous sera fourni. Comprenez-vous ces droits tels qu'ils vous ont été lus?",
  vietnamese: "Bạn có quyền giữ im lặng. Mọi điều bạn nói có thể và sẽ được dùng chống lại bạn trước tòa án. Bạn có quyền có luật sư. Nếu bạn không có khả năng thuê luật sư, một người sẽ được chỉ định cho bạn. Bạn có hiểu các quyền này như tôi đã đọc cho bạn không?",
  mandarin: "你有权保持沉默。你所说的一切都可能在法庭上对你不利。你有权请律师。如果你请不起律师，法庭会为你指定一位。你明白我刚才所宣读的权利吗？",
  russian: "Вы имеете право хранить молчание. Всё, что вы скажете, может быть использовано против вас в суде. Вы имеете право на адвоката. Если вы не можете его оплатить, он будет предоставлен вам бесплатно. Вы понимаете эти права, как я их вам зачитал?",
  arabic: "لديك الحق في التزام الصمت. كل ما تقوله يمكن وسيُستخدم ضدك في المحكمة. لديك الحق في محامٍ. إذا لم تستطع تحمل تكاليفه، سيتم تعيين محامٍ لك. هل تفهم هذه الحقوق كما قرأتها لك؟"
};

export default function MirandaPanel() {
  const [caseNumber, setCaseNumber] = useState("");
  const [suspectName, setSuspectName] = useState("");
  const [language, setLanguage] = useState("english");
  const [status, setStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<Date | null>(null);

  // Simulate TTS playback (replace with real TTS integration)
  const handleReadMiranda = async () => {
    if (!caseNumber.trim() || !suspectName.trim()) {
      setError("Case number and suspect name are required.");
      return;
    }
    setStatus("reading");
    setError(null);
    setTimestamp(new Date());
    // Simulate TTS delay
    setTimeout(() => {
      setStatus("done");
    }, 3500);
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#181e2a] rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a3142] bg-[#23293a]">
        <div className="flex items-center gap-2 text-white text-2xl font-bold tracking-tight">
          <BookOpenIcon className="h-7 w-7" />
          Miranda Rights Workflow
        </div>
        <div className="text-[#bfc8e6] text-base font-medium">Multi-language</div>
      </div>
      {/* Workflow Form */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form
          className="space-y-6"
          onSubmit={e => {
            e.preventDefault();
            handleReadMiranda();
          }}
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[#bfc8e6] mb-1 font-medium" htmlFor="caseNumber">
                <HashIcon className="inline-block h-4 w-4 mr-1" /> Case Number
              </label>
              <input
                id="caseNumber"
                className="w-full rounded-lg bg-[#23293a] border border-[#2a3142] px-4 py-3 text-lg text-white placeholder-[#bfc8e6] focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter case number"
                value={caseNumber}
                onChange={e => setCaseNumber(e.target.value)}
                disabled={status === "reading"}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[#bfc8e6] mb-1 font-medium" htmlFor="suspectName">
                <UserIcon className="inline-block h-4 w-4 mr-1" /> Suspect Name
              </label>
              <input
                id="suspectName"
                className="w-full rounded-lg bg-[#23293a] border border-[#2a3142] px-4 py-3 text-lg text-white placeholder-[#bfc8e6] focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter suspect name"
                value={suspectName}
                onChange={e => setSuspectName(e.target.value)}
                disabled={status === "reading"}
              />
            </div>
          </div>
          <div>
            <label className="block text-[#bfc8e6] mb-1 font-medium" htmlFor="language">
              <GlobeIcon className="inline-block h-4 w-4 mr-1" /> Language
            </label>
            <select
              id="language"
              className="w-full rounded-lg bg-[#23293a] border border-[#2a3142] px-4 py-3 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              disabled={status === "reading"}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#25407a] hover:bg-[#3458a1] text-white rounded-full py-4 text-lg font-semibold flex items-center justify-center gap-2 transition"
            disabled={status === "reading"}
          >
            {status === "reading" ? (
              <>
                <Loader2Icon className="h-5 w-5 animate-spin" /> Reading Miranda Rights...
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5" /> Read Miranda Rights
              </>
            )}
          </button>
        </form>
        {error && (
          <div className="text-red-400 text-center mt-4">{error}</div>
        )}
        {status === "done" && (
          <div className="mt-8 bg-[#e9ecf3] text-[#23293a] rounded-2xl px-6 py-5 shadow-lg">
            <div className="font-bold mb-2">Miranda Rights ({LANGUAGES.find(l => l.code === language)?.label}):</div>
            <div className="mb-2">{MIRANDA_TEXT[language]}</div>
            <div className="text-xs text-[#7a8199]">
              Case: {caseNumber} &nbsp;|&nbsp; Suspect: {suspectName} &nbsp;|&nbsp; {timestamp && timestamp.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}