export interface Wish {
    id: string;
    senderName: string;
    message: string;
    image?: string; // Base64 data URL
    avatarId?: number;
    templateId: number;
    createdAt: number;
}

export interface Gift {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export enum AppState {
    CREATE = 'CREATE',
    VIEW = 'VIEW',
    GAME = 'GAME'
}

export const TEMPLATES = [
    {
        id: 1,
        name: "Golden Glow",
        bg: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
        imageContainer: "rounded-full border-4 border-white shadow-xl",
        cardBorder: "border-4 border-amber-200/50",
        textStyle: "bg-black/20 backdrop-blur-sm text-white"
    },
    {
        id: 2,
        name: "Midnight Sparkle",
        bg: "bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900",
        imageContainer: "rounded-2xl border-2 border-purple-300 shadow-purple-500/50 shadow-lg rotate-1",
        cardBorder: "border-2 border-purple-400/30",
        textStyle: "bg-slate-900/50 border border-purple-500/30 text-purple-100"
    },
    {
        id: 3,
        name: "Lush Green",
        bg: "bg-gradient-to-br from-green-400 via-emerald-600 to-teal-800",
        imageContainer: "rounded-[2rem] border-8 border-emerald-900/20 shadow-inner",
        cardBorder: "border-none ring-4 ring-emerald-400/50",
        textStyle: "bg-emerald-900/40 text-emerald-50"
    },
    {
        id: 4,
        name: "Royal Purple",
        bg: "bg-gradient-to-br from-purple-600 via-fuchsia-700 to-indigo-900",
        imageContainer: "rounded-full border-[6px] border-amber-400 shadow-2xl",
        cardBorder: "border-y-8 border-amber-400",
        textStyle: "bg-indigo-950/60 border-t border-b border-amber-400/50 text-amber-100"
    },
    {
        id: 5,
        name: "Tropical Sunset",
        bg: "bg-gradient-to-br from-rose-400 via-orange-400 to-yellow-300",
        imageContainer: "rounded-3xl rotate-3 border-4 border-white/80 shadow-lg",
        cardBorder: "border-8 border-white/20",
        textStyle: "bg-white/30 backdrop-blur-md text-slate-900 font-bold shadow-sm"
    },
    {
        id: 6,
        name: "Deep Ocean",
        bg: "bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-900",
        imageContainer: "rounded-lg border-4 border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)]",
        cardBorder: "border-x-8 border-cyan-900/30",
        textStyle: "bg-gradient-to-r from-blue-900/80 to-cyan-900/80 text-cyan-50 border border-cyan-400/30"
    },
    {
        id: 7,
        name: "Ruby Red",
        bg: "bg-gradient-to-br from-red-500 via-red-700 to-rose-900",
        imageContainer: "rounded-full border-4 border-rose-200 p-1 bg-rose-900/50",
        cardBorder: "border-4 border-double border-rose-300/50",
        textStyle: "bg-rose-950/40 text-rose-100 italic"
    },
    {
         id: 8, 
         name: "Spring Blossom", 
         bg: "bg-gradient-to-br from-pink-300 via-rose-400 to-red-400",
         imageContainer: "rounded-t-full rounded-b-3xl border-4 border-white",
         cardBorder: "border-white/40 border-8",
         textStyle: "bg-white/80 text-rose-900 font-semibold"
    },
    { 
        id: 9, 
        name: "Earthy Terracotta", 
        bg: "bg-gradient-to-br from-orange-300 via-amber-600 to-yellow-800",
        imageContainer: "rounded-2xl border-dashed border-4 border-amber-900/40",
        cardBorder: "border-[12px] border-amber-900/10",
        textStyle: "bg-amber-950/30 text-amber-50"
    },
];

export const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mila"
];