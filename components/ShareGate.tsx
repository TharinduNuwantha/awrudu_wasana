import React, { useState } from 'react';
import { Share2, CheckCircle, Lock } from 'lucide-react';

interface ShareGateProps {
    onComplete: () => void;
}

const ShareGate: React.FC<ShareGateProps> = ({ onComplete }) => {
    const [shareCount, setShareCount] = useState(0);
    const REQUIRED_SHARES = 10;

    const [adClicked, setAdClicked] = useState(false);

    const handleShare = () => {
        // Special logic for the 10th share (index 9 going to 10)
        if (shareCount === REQUIRED_SHARES - 1 && !adClicked) {
            // Redirect to special ad link
            window.open('https://www.effectivegatecpm.com/iaz9qetn?key=f62027696faa9c20cdb50a0241cf0245', '_blank');
            setAdClicked(true);
            return; // Don't increment count yet, let them click again or assume they come back and click again
        }

        // Normal Share Logic
        const text = encodeURIComponent("මම අලුත් අවුරුදු තෑග්ග දිනා ගත්තා! ඔයත් දැන්ම උත්සාහ කරන්න! (I won a New Year Gift! Try now!)");
        const url = encodeURIComponent(window.location.href);
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');

        // Increment count
        const newCount = shareCount + 1;
        setShareCount(newCount);

        if (newCount >= REQUIRED_SHARES) {
            // Wait a moment for UX before unlocking
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    };

    const progress = Math.min((shareCount / REQUIRED_SHARES) * 100, 100);

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-amber-500/30 shadow-2xl w-full max-w-md mx-auto mt-6">
            <h3 className="text-xl font-bold text-amber-400 mb-4 text-center sinhala-text">
                තෑග්ග ලබා ගැනීමට මිතුරන් 10 දෙනෙකුට යවන්න
                <br />
                <span className="text-sm text-gray-400 font-sans">(Share with 10 friends to unlock prize)</span>
            </h3>

            <div className="mb-6 relative h-6 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md">
                    {shareCount} / {REQUIRED_SHARES} Shared
                </div>
            </div>

            <button
                onClick={handleShare}
                disabled={shareCount >= REQUIRED_SHARES}
                className={`w-full py-4 rounded-full flex items-center justify-center gap-3 text-lg font-bold transition-transform active:scale-95 ${shareCount >= REQUIRED_SHARES
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_0_15px_rgba(37,211,102,0.5)] animate-pulse'
                    }`}
            >
                {shareCount >= REQUIRED_SHARES ? (
                    <>
                        <CheckCircle className="w-6 h-6" />
                        Completed!
                    </>
                ) : (
                    <>
                        <Share2 className="w-6 h-6" />
                        Share on WhatsApp
                    </>
                )}
            </button>

            {shareCount < REQUIRED_SHARES && (
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Claim form is currently locked</span>
                </div>
            )}
        </div>
    );
};

export default ShareGate;