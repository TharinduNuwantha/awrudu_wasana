
import React, { useState } from 'react';
import ShareGate from './ShareGate';

const SEGMENTS = [
    { label: "TRY AGAIN", emoji: "🎁", color: "#334155" },
    { label: "Rs. 5,000", emoji: "🎁", color: "#fbbf24" },
    { label: "iPhone 15", emoji: "🎁", color: "#dc2626" },
    { label: "TRY AGAIN", emoji: "🎁", color: "#334155" },
    { label: "50 GB Data", emoji: "🎁", color: "#2563eb" },
    { label: "GIFT BOX", emoji: "🎁", color: "#9333ea" },
];

const SpinWheel: React.FC = () => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [prize, setPrize] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formUnlocked, setFormUnlocked] = useState(false);
    const [submissionState, setSubmissionState] = useState<'idle' | 'clicked_1' | 'clicked_2' | 'submitted'>('idle');

    const spin = () => {
        if (spinning || attempts >= 3) return;

        setSpinning(true);
        setPrize(null);

        // Rigged Logic:
        // Attempt 1: Land on "Try Again" (Segment 0)
        // Attempt 2: Land on "Rs 5000" (Segment 1)
        // Attempt 3: Land on "iPhone 15" (Segment 2)

        let targetSegmentIndex = 0;
        if (attempts === 0) targetSegmentIndex = 0; // Try Again
        if (attempts === 1) targetSegmentIndex = 1; // Rs 5000
        if (attempts === 2) targetSegmentIndex = 2; // iPhone

        // Calculate rotation
        // Each segment is 60 degrees (360 / 6)
        // To land on index i, we need to rotate so that index i is at the top (pointer).
        // Default pointer is usually at 0 deg (top).
        // We add extra full spins (360 * 5) for effect.

        const segmentAngle = 360 / SEGMENTS.length;
        const offset = 360 - (targetSegmentIndex * segmentAngle);
        const randomOffset = Math.random() * 10 - 5; // Slight randomness within segment
        const newRotation = rotation + (360 * 8) + offset + randomOffset;

        setRotation(newRotation);

        setTimeout(() => {
            setSpinning(false);
            setAttempts(prev => prev + 1);

            // Set prize text based on emoji
            // Set prize text based on label
            setPrize(SEGMENTS[targetSegmentIndex].label);

            if (attempts === 2) {
                // Final win
                setTimeout(() => setShowForm(true), 1000);
            }
        }, 4000); // 4s animation
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Fake Adsterra Logic as requested by user tactics
        // 1st click: Open Ad 1
        // 2nd click: Open Ad 2
        // 3rd click: Submit

        const adLink = "https://google.com"; // Placeholder for ad link

        if (submissionState === 'idle') {
            window.open(adLink, '_blank');
            setSubmissionState('clicked_1');
        } else if (submissionState === 'clicked_1') {
            window.open(adLink, '_blank');
            setSubmissionState('clicked_2');
        } else {
            setSubmissionState('submitted');
            alert("සාර්ථකයි! (Successfully Submitted)");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-bold text-amber-400 mb-2 sinhala-text text-center shadow-amber-500/50 drop-shadow-lg">
                අවුරුදු වාසනාව (New Year Fortune)
            </h2>

            {/* Prize Banner */}
            <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white px-8 py-2 rounded-full font-black text-lg mb-8 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.5)] border-2 border-yellow-300 transform hover:scale-105 transition-transform text-center">
                🏆 WIN: iPhone 15 & Rs. 5000!
            </div>

            <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-md"></div>
                </div>

                {/* Wheel */}
                <div
                    className="w-full h-full rounded-full border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] overflow-hidden relative wheel-spin"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {/* Background Colors */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `conic-gradient(
                                ${SEGMENTS.map((s, i) => `${s.color} ${i * (360 / 6)}deg ${(i + 1) * (360 / 6)}deg`).join(', ')}
                            )`
                        }}
                    />

                    {/* Emojis Layer */}
                    {SEGMENTS.map((seg, i) => {
                        const angle = i * 60 + 30; // Center of segment
                        const radius = 140; // Position near edge
                        const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                        const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

                        return (
                            <div
                                key={i}
                                className="absolute z-20"
                                style={{
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div className="text-center">
                                    <div className="text-5xl md:text-6xl font-bold animate-pulse"
                                        style={{
                                            textShadow: `
                                                0 0 20px rgba(255, 255, 255, 0.3),
                                                0 0 15px rgba(0, 0, 0, 0.5),
                                                2px 2px 8px rgba(0, 0, 0, 0.7)
                                            `,
                                            filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.2)) brightness(1.1)',
                                            WebkitTextStroke: '1px rgba(0, 0, 0, 0.4)'
                                        }}
                                    >
                                        {seg.emoji}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full z-30 shadow-[0_0_25px_rgba(245,158,11,0.8)] flex items-center justify-center border-4 border-white/40">
                    <div className="w-14 h-14 bg-gradient-to-tr from-white to-amber-100 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-4xl">🎯</span>
                    </div>
                </div>
            </div>

            <button
                onClick={spin}
                disabled={spinning || attempts >= 3}
                className="mt-8 px-12 py-4 bg-gradient-to-r from-amber-500 to-red-600 rounded-full text-2xl font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:grayscale border-2 border-white/20 flex items-center gap-3"
            >
                <span className="text-3xl">🎰</span>
                {spinning ? "Spinning..." : attempts >= 3 ? "No More Spins" : "SPIN NOW"}
                <span className="text-3xl">🎰</span>
            </button>
            <script async="async" data-cfasync="false" src="https://pl28374666.effectivegatecpm.com/817dba8cb3ef52d1e5654def7087b89f/invoke.js"></script>
            <div id="container-817dba8cb3ef52d1e5654def7087b89f"></div>
            {prize && !spinning && (
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-900/30 to-red-900/30 rounded-xl text-center backdrop-blur-sm animate-bounce border border-white/20 shadow-lg">
                    <p className="text-gray-200 text-sm mb-1">You won:</p>
                    <p className="text-2xl font-bold text-amber-400 drop-shadow-md flex items-center justify-center gap-2">
                        <span className="text-3xl">
                            🎁
                        </span>
                        {prize}
                    </p>
                </div>
            )}

            {showForm && (
                <div className="mt-10 w-full max-w-lg animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-amber-500 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Confetti effect background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                        <h3 className="text-2xl font-bold text-center text-white mb-2 relative z-10 flex items-center justify-center gap-2">
                            🎉 CONGRATULATIONS! 🎉
                        </h3>
                        <p className="text-center text-gray-400 mb-6 relative z-10">
                            You have won an <span className="text-amber-400 font-bold">iPhone 15</span>!
                        </p>

                        {!formUnlocked ? (
                            <ShareGate onComplete={() => setFormUnlocked(true)} />
                        ) : (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setSubmissionState('submitted');
                            }} className="space-y-4 mt-6 relative z-10">
                                {submissionState === 'submitted' ? (
                                    <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                                            <span className="text-4xl">✅</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-2">Success! (සාර්ථකයි!)</h4>
                                        <p className="text-slate-300">
                                            Your claim has been received. You will be contacted shortly.<br />
                                            (ඔබගේ තෑග්ග තහවුරු විය. අපි ළඟදීම ඔබව අමතන්නෙමු.)
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                                <span>👤</span> Full Name
                                            </label>
                                            <input required type="text" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-amber-500 outline-none" placeholder="Saman Perera" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                                <span>📱</span> Mobile Number
                                            </label>
                                            <input required type="tel" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-amber-500 outline-none" placeholder="077 123 4567" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                                <span>🏠</span> Delivery Address
                                            </label>
                                            <textarea required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-amber-500 outline-none" rows={3} placeholder="No 123, Galle Road, Colombo"></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-700 rounded-lg font-bold text-white text-lg shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                        >
                                            <span>🎁</span>
                                            CLAIM PRIZE
                                            <span>🎁</span>
                                        </button>
                                    </>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpinWheel;