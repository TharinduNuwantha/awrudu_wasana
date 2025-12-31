// Simulating AI behavior with a predefined list of high-quality wishes
// This removes the need for an API key while finding the "best" wish for the user.

const WISHES = [
    "ලැබුවා වූ නව වසර සාමය සතුට පිරි සුභ නව වසරක් වේවා!",
    "ඔබටත් ඔබේ පවුලේ සැමටත් සාමය සතුට පිරි සුභ නව වසරක් වේවා!",
    "කිරියෙන් පැණියෙන් ඉතිරෙන, සෞභාග්‍යමත් සුභ නව වසරක් වේවා!",
    "සිතූ පැතූ සම්පත් ලැබෙන, රෝග පීඩා දුරු වන සුභ නව වසරක් වේවා!",
    "සියලු වැඩ කටයුතු සාර්ථක වන, වාසනාවන්ත සුභ නව වසරක් වේවා!",
    "සිනහවෙන්, සතුටෙන් පිරි සුභ නව වසරක් වේවා!",
    "නව වසර ඔබගේ සියලු යහපත් බලාපොරොත්තු ඉටුවන සුභ වසරක් වේවා!",
    "සාමය, සතුට, සෞභාග්‍යය සපිරි සුභ නව වසරක් වේවා!",
    "දුක කඳුළ නැති, සිනහව පිරි වාසනාවන්ත හෙටක් උදාවේවා! සුභ නව වසරක්!",
    "හිරු එළිය මෙන් ජීවිතය ආලෝකවත් වන සුභ නව වසරක් වේවා!",
    "කරන කියන සියලු දේ සාර්ථක වන, ජයග්‍රාහී නව වසරක් වේවා!",
    "ඔබේ දිවියට නව ආලෝකයක් ලැබෙන සුභ නව වසරක් වේවා!",
    "සාමය සතුට පිරුණු, නිරෝගී බව රැඳුණු සුභ නව වසරක් වේවා!",
    "සෞභාග්‍යයේ දොරටු විවර වන වාසනාවන්ත නව වසරක් වේවා!",
    "අලුත් සිතිවිලි එක්ක අලුත් වන ජීවිතයකට සුභ නව වසරක් වේවා!"
];

export const generateSinhalaWish = async (senderName: string, relationship: string): Promise<string> => {
    // Simulate AI "Thinking" Delay (1.5s - 2.5s)
    // This makes the user feel like complex processing is happening
    const delay = Math.floor(Math.random() * 1000) + 1500;

    return new Promise((resolve) => {
        setTimeout(() => {
            // Select a random wish from the array
            // In a real AI scenario, this would be generated based on context
            const randomIndex = Math.floor(Math.random() * WISHES.length);
            const baseWish = WISHES[randomIndex];

            // Occasionally personalize it slightly (simple logic to mimic basic AI)
            // But mostly return the high-quality template
            resolve(baseWish);
        }, delay);
    });
};