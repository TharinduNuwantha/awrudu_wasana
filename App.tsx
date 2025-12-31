import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Share2, Download, Wand2, RefreshCw, Gift, Loader2, Link as LinkIcon, Home } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateSinhalaWish } from './services/geminiService';
import { saveWishToSupabase, getWishFromSupabase } from './services/supabaseClient';
import { uploadImageToImgBB } from './services/imgbbService';
import Fireworks from './components/Fireworks';
import SpinWheel from './components/SpinWheel';
import { Wish, AppState, TEMPLATES, AVATARS } from './types';

function App() {
  const [viewState, setViewState] = useState<AppState>(AppState.CREATE);

  // Create State
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(0);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null); // For local preview
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // For loading state during save
  const [generatedWish, setGeneratedWish] = useState<Wish | null>(null);

  // Social Proof Data
  const data = [
    { name: 'Gampaha', winners: 45 },
    { name: 'Colombo', winners: 62 },
    { name: 'Kandy', winners: 38 },
    { name: 'Galle', winners: 25 },
  ];

  // Load wish from URL Query Param (id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wishId = params.get('id');

    if (wishId) {
      setIsSaving(true); // Reuse saving loader for initial fetch
      getWishFromSupabase(wishId).then((wish) => {
        if (wish) {
          setGeneratedWish(wish);
          setViewState(AppState.VIEW);
        } else {
          // If wish is not found, maybe invalid ID, just let them create one
          console.error("Wish not found");
        }
        setIsSaving(false);
      });
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
        setSelectedAvatar(null); // Clear avatar if image uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!senderName) {
      alert("Please enter your name first / කරුණාකර පළමුව ඔබගේ නම ඇතුලත් කරන්න");
      return;
    }
    setIsGenerating(true);
    const text = await generateSinhalaWish(senderName, relationship);
    setMessage(text);
    setIsGenerating(false);
  };

  const handleCreateWish = async () => {
    if (!senderName || !message) {
      alert("Please fill in required fields");
      return;
    }

    setIsSaving(true);
    let finalImageUrl = undefined;

    // 1. Upload Image to ImgBB if exists
    if (uploadedImagePreview) {
      const url = await uploadImageToImgBB(uploadedImagePreview);
      if (url) {
        finalImageUrl = url;
      } else {
        alert("Image upload failed, proceeding with default.");
      }
    }

    // 2. Save to Supabase
    const wishId = await saveWishToSupabase(
      senderName,
      message,
      selectedTemplate,
      selectedAvatar !== null ? selectedAvatar : undefined,
      finalImageUrl
    );

    if (wishId) {
      const newWish: Wish = {
        id: wishId,
        senderName,
        message,
        image: finalImageUrl,
        avatarId: selectedAvatar !== null ? selectedAvatar : undefined,
        templateId: selectedTemplate,
        createdAt: Date.now()
      };

      setGeneratedWish(newWish);
      setViewState(AppState.VIEW);

      // Update URL without reloading
      const newUrl = `${window.location.pathname}?id=${wishId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
      alert("Failed to save wish. Please try again.");
    }

    setIsSaving(false);
  };

  const getShareLink = () => {
    if (!generatedWish) return window.location.href;
    // Construct the link carefully
    const origin = window.location.origin;
    const path = window.location.pathname === '/' ? '' : window.location.pathname;
    return `${origin}${path}?id=${generatedWish.id}`;
  };

  const shareOnWhatsApp = () => {
    const link = getShareLink();
    const text = `Hey! ${generatedWish?.senderName} sent you a New Year Wish! Open here: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const activeTemplate = TEMPLATES.find(t => t.id === (generatedWish?.templateId || selectedTemplate));

  if (isSaving && !generatedWish && viewState === AppState.CREATE) {
    // Initial Load or Saving
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="text-xl font-semibold animate-pulse">
          {isSaving && !uploadedImagePreview && !message ? "Loading Wish..." : "Saving your beautiful wish..."}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden text-white font-sans selection:bg-amber-500 selection:text-black">
      <Fireworks />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between p-4 md:px-8 bg-slate-900/50 backdrop-blur-md border-b border-slate-700">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            // Reset to home cleanly
            window.history.pushState({}, '', window.location.pathname);
            setViewState(AppState.CREATE);
            setGeneratedWish(null);
            setSenderName('');
            setMessage('');
            setUploadedImagePreview(null);
          }}
        >
          <Sparkles className="text-amber-400 animate-pulse" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent hidden md:block">
            Suba Aluth Avurudde
          </h1>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent md:hidden">
            New Year Wishes
          </h1>
        </div>
        {viewState !== AppState.GAME && (
          <button
            onClick={() => setViewState(AppState.GAME)}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold px-4 py-1.5 rounded-full text-sm animate-bounce shadow-[0_0_15px_rgba(245,158,11,0.6)]"
          >
            🎁 Get Gift
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 pb-32">

        {viewState === AppState.CREATE && (
          <div className="max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h2 className="text-2xl font-bold text-center mb-6 sinhala-text">
              ඔබේ සුභ පැතුම නිර්මාණය කරන්න <br />
              <span className="text-sm font-sans text-gray-400 font-normal">Create your New Year Wish</span>
            </h2>

            <div className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500 bg-slate-700 shadow-xl group">
                  {uploadedImagePreview ? (
                    <img src={uploadedImagePreview} alt="User" className="w-full h-full object-cover" />
                  ) : selectedAvatar !== null ? (
                    <img src={AVATARS[selectedAvatar]} alt="Avatar" className="w-full h-full object-cover bg-white" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <label className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs py-1 text-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-4 h-4 mx-auto inline mb-0.5" /> Change
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <label className="absolute inset-0 cursor-pointer" title="Upload Image">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>

                <div className="flex gap-2">
                  <span className="text-sm text-gray-400 my-auto">Or select avatar:</span>
                  {AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedAvatar(idx); setUploadedImagePreview(null); }}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition hover:scale-110 ${selectedAvatar === idx && !uploadedImagePreview ? 'border-amber-500 scale-110' : 'border-slate-600'}`}
                    >
                      <img src={av} alt={`Avatar ${idx}`} className="bg-white" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition"
                    placeholder="Enter your name..."
                  />
                </div>

                <div className="space-y-2 [&:has(button:hover)_textarea]:border-violet-500 [&:has(button:hover)_textarea]:shadow-[0_0_15px_rgba(139,92,246,0.15)] [&:has(button:hover)_textarea]:ring-1 [&:has(button:hover)_textarea]:ring-violet-500/30">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm text-gray-300 transition-colors [&:has(+button:hover)]:text-violet-300">Wish Message (Sinhala)</label>
                    <button
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 border border-white/10 hover:border-white/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none z-10 animate-breathe-glow"
                    >
                      {/* Interactive hover shine */}
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rotate-12 blur-md"></span>

                      {/* Constant live shimmer effect */}
                      <span className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>

                      {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin relative z-10" /> : <Wand2 className="w-3.5 h-3.5 relative z-10" />}
                      <span className="relative z-10">Generate with AI</span>
                    </button>
                  </div>
                  <div className="relative">
                    {/* Animated gradient border overlay when generating */}
                    <div className={`absolute -inset-[1px] rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-0 transition-opacity duration-500 ${isGenerating ? 'opacity-100 animate-pulse' : ''} blur-sm`}></div>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isGenerating}
                      className={`relative w-full bg-slate-900 border rounded-lg p-3 text-white outline-none sinhala-text transition-all duration-300
                        ${isGenerating
                          ? 'border-transparent bg-slate-900/90'
                          : 'border-slate-700 focus:border-amber-500'
                        }
                      `}
                      rows={3}
                      placeholder={isGenerating ? "AI is writing a beautiful wish for you..." : "ඔබේ පණිවිඩය මෙහි ලියන්න... (Write your message here)"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Select Template</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`h-16 rounded-lg ${t.bg} ${selectedTemplate === t.id ? 'ring-2 ring-white scale-95 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'opacity-70 hover:opacity-100'} transition-all shadow-md`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateWish}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isSaving ? "Creating Wish..." : "Create Wish & Send"}
              </button>
            </div>
          </div>
        )}

        {viewState === AppState.VIEW && generatedWish && activeTemplate && (
          <div className="max-w-md mx-auto flex flex-col items-center animate-in fade-in zoom-in duration-500">

            {/* The Card */}
            <div className={`w-full aspect-[4/5] ${activeTemplate.bg} rounded-2xl p-6 shadow-2xl relative flex flex-col items-center justify-between text-center ${activeTemplate.cardBorder || 'border-4 border-amber-500/30'} transition-all`}>
              <div className="absolute top-4 right-4 animate-pulse">
                <Sparkles className="text-white opacity-70" />
              </div>

              <h3 className="text-2xl font-bold text-white drop-shadow-md mt-4 sinhala-text z-10">
                සුභ අලුත් අවුරුද්දක් වේවා!
              </h3>

              <div className="relative z-10">
                <div className={`w-40 h-40 overflow-hidden mx-auto bg-white ${activeTemplate.imageContainer || 'rounded-full border-4 border-white'}`}>
                  {generatedWish.image ? (
                    <img src={generatedWish.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <img src={AVATARS[generatedWish.avatarId || 0]} alt="Avatar" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                  {generatedWish.senderName}
                </div>
              </div>

              <div className={`${activeTemplate.textStyle || 'bg-black/20 backdrop-blur-sm text-white'} rounded-xl p-4 w-full z-10 shadow-sm`}>
                <p className="text-lg font-medium sinhala-text leading-relaxed">
                  "{generatedWish.message}"
                </p>
              </div>

              <div className="text-xs text-white/60 font-sans mb-2 z-10">
                Created with SubaAluthAvurudde.lk
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-6 space-y-3">
              <button
                onClick={shareOnWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-1"
              >
                <Share2 /> Share to WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyLink}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <LinkIcon size={18} /> Copy Link
                </button>
                {/* <button
                  onClick={() => alert("Image download started...")}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Download size={18} /> Download
                </button> */}
              </div>

              <button
                onClick={() => {
                  setGeneratedWish(null);
                  setSenderName('');
                  setMessage('');
                  setUploadedImagePreview(null);
                  // Clear URL params to allow creating new wish cleanly
                  window.history.pushState({}, document.title, window.location.pathname);
                  setViewState(AppState.CREATE);
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 rounded-xl mt-4 shadow-lg transition flex items-center justify-center gap-2"
              >
                <Home size={18} /> Create Your Own Wish
              </button>
            </div>
          </div>
        )}

        {viewState === AppState.GAME && (
          <SpinWheel />
        )}

        {/* Social Proof Ticker (Visible mostly on Desktop/Tablet) */}
        {viewState !== AppState.GAME && (
          <div className="hidden md:block fixed bottom-24 right-8 w-64 bg-slate-800/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl">
            <h4 className="text-xs text-gray-400 uppercase font-bold mb-2">Live Winners</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fbbf24' }}
                  />
                  <Bar dataKey="winners" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </main>

      {/* Sticky Golden Button */}
      {viewState !== AppState.GAME && (
        <div className="fixed bottom-0 left-0 w-full p-4 z-50 bg-gradient-to-t from-slate-900 to-transparent pb-8 pointer-events-none">
          <button
            onClick={() => setViewState(AppState.GAME)}
            className="pointer-events-auto w-full max-w-md mx-auto bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-slate-900 font-extrabold text-xl py-4 rounded-full shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-bounce flex items-center justify-center gap-3 border-4 border-white/20"
          >
            <Gift className="w-8 h-8" />
            HERE IS YOUR NEW YEAR GIFT!
          </button>
        </div>
      )}

    </div>
  );
}

export default App;