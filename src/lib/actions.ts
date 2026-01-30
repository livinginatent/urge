export type DistractionAction =
  | string // Physical/mental task (plain text)
  | {
      type: "reddit";
      title: string;
      url: string;
    }
  | {
      type: "wiki";
      title: string;
      url: string;
    }
  | {
      type: "youtube";
      title: string;
      url: string;
    };

export const DISTRACTION_ACTIONS: DistractionAction[] = [
  // Physical/Mental Tasks
  "Drop and do 20 push-ups. Burn the urge out of your body.",
  "Fill a page with everything you're feeling. No editing, just bleed ink.",
  "Cold water on your face for 30 seconds. Reset your nervous system.",
  "Walk outside for 5 minutes. Count red objects as you go.",
  "Set a 3-minute timer and breathe: 4 in, 4 hold, 4 out. Repeat.",
  "Delete one thing from your phone that makes the habit worse.",
  "Text a trusted friend: \"I'm riding out an urge. No reply needed.\"",
  "Stand up, shake out your whole body for 60 seconds. Get loud if you can.",
  "Write down 3 reasons future-you will be glad you didn't cave.",
  "Do 25 squats while staring at a single point on the wall. Own the tension.",
  "Sprint up and down a flight of stairs three times. Feel your heart pound for a different reason.",
  "Stand on one leg for 60 seconds. Switch. Challenge your balance and focus.",
  "Tense every muscle in your body for 10 seconds, then release completely. Repeat three times.",
  "Massage your own scalp and temples for two full minutes.",
  "Tap your fingers sequentially from thumb to pinky and back, 10 times each hand.",
  "Count backward from 100 by 7s (100, 93, 86...).",
  "Mentally list 10 things you're grateful for right this second.",
  "Think of the last time you relapsed and how you felt. Write it down.",
  "Plan your ideal meal for tomorrow in excruciating detail.",
  'Learn how to say "I am stronger than this urge" in three new languages. Google it now.',
  'Do a "5-4-3-2-1" sensory scan: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
  "Compose a ridiculous 3-line jingle for a product that doesn't exist.",
  "Write down the worst-case scenario if you gave in. Then write the best-case if you don't.",
  "Write your problem on a piece of paper, then set it safely on fire (in a sink/ashtray).",
  "Unfollow one social media account that makes you feel worse.",
  "Write a positive review for a business you love.",
  "Research a question you've always had (e.g., 'How do stars form?').",
  "Write a letter to your future self, promising to be stronger than this urge.",

  // Reddit Posts

  {
    type: "reddit",
    title: "Sailors of Reddit, what is one thing about the open ocean that most people don't know about?",
    url: "https://www.reddit.com/r/AskReddit/comments/19ci1a/sailors_of_reddit_what_is_one_thing_about_the/",
  },
  {
    type: "reddit",
    title: "Which Wikipedia article will start me on the most interesting Wiki-binge?",
    url: "https://www.reddit.com/r/AskReddit/comments/1g9dyi/which_wikipedia_article_will_start_me_on_the_most/",
  },


  // Wikipedia Articles
  {
    type: "wiki",
    title: "Willpower - The mental ability to resist impulses",
    url: "https://en.wikipedia.org/wiki/Willpower",
  },
  {
    type: "wiki",
    title: "Habit - Automatic routines and behaviors",
    url: "https://en.wikipedia.org/wiki/Habit",
  },
  {
    type: "wiki",
    title: "Self-control - The ability to regulate one's emotions and behaviors",
    url: "https://en.wikipedia.org/wiki/Self-control",
  },
  {
    type: "wiki",
    title: "Cognitive behavioral therapy - Understanding thought patterns",
    url: "https://en.wikipedia.org/wiki/Cognitive_behavioral_therapy",
  },
  {
    type: "wiki",
    title: "Dopamine - The neurotransmitter behind motivation and reward",
    url: "https://en.wikipedia.org/wiki/Dopamine",
  },
  {
    type: "wiki",
    title: "Neuroplasticity - How the brain changes and adapts",
    url: "https://en.wikipedia.org/wiki/Neuroplasticity",
  },
  {
    type: "wiki",
    title: "Mindfulness - Present-moment awareness practices",
    url: "https://en.wikipedia.org/wiki/Mindfulness",
  },
  {
    type: "wiki",
    title: "Stoicism - Ancient philosophy of resilience and self-control",
    url: "https://en.wikipedia.org/wiki/Stoicism",
  },

  // YouTube Videos
  {
    type: "youtube",
    title: "How to Build Self-Discipline - Practical strategies",
    url: "https://www.youtube.com/results?search_query=self+discipline+motivation",
  },
  {
    type: "youtube",
    title: "Breaking Bad Habits - Science-backed methods",
    url: "https://www.youtube.com/results?search_query=breaking+bad+habits",
  },
  {
    type: "youtube",
    title: "Meditation for Beginners - 10 minute guided session",
    url: "https://www.youtube.com/results?search_query=meditation+for+beginners",
  },
  {
    type: "youtube",
    title: "Understanding Addiction - Educational content",
    url: "https://www.youtube.com/results?search_query=understanding+addiction",
  },
  {
    type: "youtube",
    title: "Motivational Speeches - Inspiring talks on resilience",
    url: "https://www.youtube.com/results?search_query=motivational+speeches",
  },
];