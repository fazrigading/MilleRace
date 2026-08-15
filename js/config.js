/* MilleRace - Game Configuration & Data Matrix */

const GAME_CONFIG = {
  TIMER_SECONDS: 180, // 3 Minutes overall game countdown

  // STAGE 1: Miller's Gallery (Visual AIAS Test)
  STAGE_1: {
    character: 'Miller',
    avatar: 'assets/images/characters/stills/Miller-no-bg-square.png',
    bgImage: 'assets/images/backgrounds/Level 1.png',
    introSentences: [
      "Each room in this building is interlocked.",
      "To reach the end of the maze, we must obtain keys.",
      "The first one is hidden in the gallery.",
      "We must first clear up the space and find it.",
      "Eliminate decoys and help me find real art works."
    ],
    questions: [
      {
        id: 1,
        prompt: "Which one of these framed art pieces is NOT a real human creation?",
        options: [
          { letter: 'A', img: 'assets/images/questions/stage-1/1A.jpg', label: 'Option A' },
          { letter: 'B', img: 'assets/images/questions/stage-1/1B.jpg', label: 'Option B' },
          { letter: 'C', img: 'assets/images/questions/stage-1/1C.jpg', label: 'Option C' }
        ],
        correct: 'B'
      },
      {
        id: 2,
        prompt: "Which one of these framed art pieces is NOT a real human creation?",
        options: [
          { letter: 'A', img: 'assets/images/questions/stage-1/2A.jpg', label: 'Option A' },
          { letter: 'B', img: 'assets/images/questions/stage-1/2B.jpg', label: 'Option B' },
          { letter: 'C', img: 'assets/images/questions/stage-1/2C.jpg', label: 'Option C' }
        ],
        correct: 'C'
      },
      {
        id: 3,
        prompt: "Which one of these photos is NOT a genuine deep space optical capture?",
        options: [
          { letter: 'A', img: 'assets/images/questions/stage-1/3A.jpg', label: 'Option A' },
          { letter: 'B', img: 'assets/images/questions/stage-1/3B.jpg', label: 'Option B' },
          { letter: 'C', img: 'assets/images/questions/stage-1/3C.jpg', label: 'Option C' }
        ],
        correct: 'C'
      },
      {
        id: 4,
        prompt: "Which one of these illustrations is NOT a real human creation?",
        options: [
          { letter: 'A', img: 'assets/images/questions/stage-1/4A.jpg', label: 'Option A' },
          { letter: 'B', img: 'assets/images/questions/stage-1/4B.jpg', label: 'Option B' },
          { letter: 'C', img: 'assets/images/questions/stage-1/4C.jpg', label: 'Option C' }
        ],
        correct: 'A'
      }
    ]
  },

  // STAGE 2: Jen's Door Passwords (Literary Knowledge)
  STAGE_2: {
    character: 'Jen',
    avatar: 'assets/images/characters/stills/Jen-no-bg-square.png',
    bgImage: 'assets/images/backgrounds/Level 2.png',
    introSentences: [
      "There are too many doors to unlock!",
      "Only one way to find out.",
      "Each of these doors contains a password.",
      "Fill in the blanks with the correct options."
    ],
    questions: [
      { id: 1, title: "Anne of Green _____", answer: "Gables", choices: ["Gables", "Hills", "Farms", "Fields"] },
      { id: 2, title: "Harry Potter and The _____ of The Phoenix", answer: "Order", choices: ["Order", "Secret", "Army", "Flight"] },
      { id: 3, title: "The _____ Runner", answer: "Kite", choices: ["Kite", "Fast", "Night", "Wind"] },
      { id: 4, title: "Gulliver's _____", answer: "Travels", choices: ["Travels", "Map", "Island", "Ship"] },
      { id: 5, title: "_____ Wood", answer: "Norwegian", choices: ["Norwegian", "Dark", "Silent", "Deep"] },
      { id: 6, title: "The Lion, The Witch & The _____", answer: "Wardrobe", choices: ["Wardrobe", "Mirror", "Door", "Key"] },
      { id: 7, title: "The _____ in Our Stars", answer: "Fault", choices: ["Fault", "Light", "Wish", "Destiny"] },
      { id: 8, title: "My Year of _____ and Relaxation", answer: "Rest", choices: ["Rest", "Sleep", "Peace", "Solitude"] },
      { id: 9, title: "Song of The Open _____", answer: "Road", choices: ["Road", "Sky", "Sea", "Mind"] },
      { id: 10, title: "A Brief History of _____", answer: "Time", choices: ["Time", "Earth", "Stars", "Life"] }
    ]
  },

  // STAGE 3: Aidan's Floor of Letters (Textual AIAS Test)
  STAGE_3: {
    character: 'Aidan',
    avatar: 'assets/images/characters/stills/Miller-no-bg-square.png',
    bgImage: null,
    introSentences: [
      "Ah, if this isn't the key to success...",
      "I figure these letters have clues to our next key.",
      "Help me delete letters that do not sound human."
    ],
    passages: [
      {
        id: 1,
        text: "Axolotls derive from the same species as salamanders. Whilst being amphibians, their external gills remain aquatic. They reach maturity without significant metamorphosis.",
        target: "Human",
        scores: {
          "Human": 5,
          "Somewhat Human": 3,
          "Barely Human": 1,
          "Not Human": 0
        }
      },
      {
        id: 2,
        text: "British foods revolve around proteins. A full-on English breakfast have fried egg, bacons, beans and Yorkshire pudding. For lunch, scotched eggs are a common favorite, in a donut shape with breaded sausage.",
        target: "Human",
        scores: {
          "Human": 5,
          "Somewhat Human": 3,
          "Barely Human": 1,
          "Not Human": 0
        }
      },
      {
        id: 3,
        text: "Valentine's Day is celebrated every February 14th and is named after Saint Valentine, a Roman priest associated with love and romance. People around the world celebrate their love by exchanging billions of chocolates, flowers, and cards with their loved ones.",
        target: "Not Human",
        scores: {
          "Human": 0,
          "Somewhat Human": 1,
          "Barely Human": 3,
          "Not Human": 5
        }
      },
      {
        id: 4,
        text: "In the 1920s, uniforms were often formal and practical, reflecting the fashion and social standards of the time. Many people wore uniforms for work, school, sports, and military service, and these outfits were usually designed to look neat and professional. Uniforms from this era often included structured jackets, skirts or trousers, hats, and polished shoes.",
        target: "Not Human",
        scores: {
          "Human": 0,
          "Somewhat Human": 1,
          "Barely Human": 3,
          "Not Human": 5
        }
      },
      {
        id: 5,
        text: "Chopsticks are made around 1200 BCE. Historically, firework became on demand during the Shang dynasty where people had to work quickly. The utensil is made to shorten time when chopping and stirring.",
        target: "Human",
        scores: {
          "Human": 5,
          "Somewhat Human": 3,
          "Barely Human": 1,
          "Not Human": 0
        }
      }
    ],
    ratingOptions: ["Human", "Somewhat Human", "Barely Human", "Not Human"]
  },

  // STAGE 4: Lizzy's Room of Colors (PISA Reading & Inferential Comprehension)
  STAGE_4: {
    character: 'Lizzy',
    avatar: 'assets/images/characters/stills/Jen-no-bg-square.png',
    bgImage: null,
    introSentences: [
      "This place is bursting its colors!",
      "We must escape quickly before it lures us into magic!"
    ],
    questions: [
      {
        id: 1,
        passage: "Charlie searches for the Golden Ticket on the edge of a gutter. It has been his only wish, but he could not afford an expensive bar of Wonka chocolate.",
        options: [
          { letter: 'A', text: "The Golden Ticket is hidden in a bar of Wonka chocolate", pts: 3 },
          { letter: 'B', text: "Charlie comes from a poor family", pts: 5 },
          { letter: 'C', text: "A Wonka chocolate bar comes in limited edition", pts: 0 }
        ]
      },
      {
        id: 2,
        passage: "Mrs Honey's house is the only place where Matilda can read freely. At home, her parents think of it as bizarre; they would be on tantrums.",
        options: [
          { letter: 'A', text: "Mrs Honey is a relative of Matilda's", pts: 0 },
          { letter: 'B', text: "Matilda's parents do not share her intelligence", pts: 5 },
          { letter: 'C', text: "Matilda performs above average at school", pts: 3 }
        ]
      },
      {
        id: 3,
        passage: "There has been discourses on the IELTS test. Some say it is a form of discrimination to third world countries as the certification expires in two years. It is studied in the theory of Postcolonialism.",
        options: [
          { letter: 'A', text: "The IELTS exam is in the expensive side", pts: 0 },
          { letter: 'B', text: "One person's English language skill is seen as interchangeable", pts: 3 },
          { letter: 'C', text: "The study of Postcolonialism studies power dominance between countries", pts: 5 }
        ]
      },
      {
        id: 4,
        passage: "Gastrodiplomacy presents itself in food similarities. For example, Mexican elotes and Indonesian jagung susu keju share the same concept of shredded corn with cheese as dessert.",
        options: [
          { letter: 'A', text: "Gastrodiplomacy connects countries through culinary knowledge", pts: 5 },
          { letter: 'B', text: "Mexican foods share similar culture to Indonesian foods", pts: 0 },
          { letter: 'C', text: "Gastrodiplomacy means food similarities", pts: 0 }
        ]
      }
    ]
  },

  // CHARACTER MATCH PROFILES
  CHARACTERS: {
    miller: {
      name: "Miller",
      scoreRange: "1–25 Points",
      pisaLevel: "PISA Reading Level 1–2",
      cefrLevel: "CEFR A1–A2 (Early Reader)",
      avatar: "assets/images/characters/stills/Miller-no-bg-square.png",
      quote: "Miller loves finding clues for his adventures! But he often gets lost without his keys. That is why thinking critically is important!",
      bio: "Curious and ready for new chapters! Miller loves finding clues for his adventures, but often gets lost without his keys. He would love to read more, one page at a time. Comic books and fun facts suit his personality.",
      activities: ["Nighttime stories", "Comic books & graphic novels", "Fun facts from encyclopedias", "Word search & crosswords"],
      books: [
        { title: "Charlotte's Web", author: "E. B. White", link: "https://archive.org/details/CharlottesWeb" },
        { title: "Keluarga Cemara", author: "Arswendo Atmowiloto", link: "https://kios-perpustakaan.jakarta.go.id/catalogue/detail/99218" }
      ],
      resources: [
        { title: "University of Sheffield Critical Thinking Guide", link: "https://sheffield.ac.uk/study-skills/research/approaches/thinking-critically" },
        { title: "Bookrclass Critical Thinking Activities for Kids", link: "https://bookrclass.com/blog/critical-thinking-activities-for-kids/" }
      ]
    },
    jen: {
      name: "Jen",
      scoreRange: "26–50 Points",
      pisaLevel: "PISA Reading Level 3–4",
      cefrLevel: "CEFR B1 (Young Adult)",
      avatar: "assets/images/characters/stills/Jen-no-bg-square.png",
      quote: "Jen knows everything! But she never really knows what to trust. She always checks… factually!",
      bio: "Witty and energetic, Jen is exploring the world! She has imaginary friends and places to be. Short stories and fairy tales are where she goes, inspired by real-life stories and writing in her diary.",
      activities: ["Reading short stories & fairy tales", "Keeping journal/diary logs", "Completing online fact-check challenges"],
      books: [
        { title: "The Fault in Our Stars", author: "John Green", link: "https://books.google.co.id/books/about/The_Fault_in_Our_Stars.html?hl=id&id=Qk8n0olOX5MC&redir_esc=y" },
        { title: "Laskar Pelangi", author: "Andrea Hirata", link: "https://kios-perpustakaan.jakarta.go.id" }
      ],
      resources: [
        { title: "Reuters Fact-Check Guide", link: "https://www.reuters.com/fact-check/" },
        { title: "MediaSmarts Break the Fake Online Scavenger Hunt", link: "https://mediasmarts.ca/break-fake" }
      ]
    },
    aidan: {
      name: "Aidan",
      scoreRange: "51–75 Points",
      pisaLevel: "PISA Reading Level 5",
      cefrLevel: "CEFR B2 (Advanced Reader)",
      avatar: "assets/images/characters/stills/Miller-no-bg-square.png", // Fallback image
      quote: "Aidan loves browsing the internet! But he only accepts legit sources. He sees citations and timelines!",
      bio: "Adventurous and resilient, Aidan is on the move! Books are his window to the world. He reads articles about his favorite characters, loves book series, and watches film adaptations.",
      activities: ["Reading book series & novels", "Comparing book-to-film adaptations", "Mastering academic citations & references"],
      books: [
        { title: "1984", author: "George Orwell", link: "https://dn790002.ca.archive.org/0/items/NineteenEightyFour-Novel-GeorgeOrwell/orwell1984.pdf" },
        { title: "Gadis Kretek", author: "Ratih Kumala", link: "https://bi.go.id/id/layanan/perpustakaan" }
      ],
      resources: [
        { title: "PSU Library Citation Searching Guide", link: "https://guides.libraries.psu.edu/bibliometrics/citationsearching" },
        { title: "Academic References & Citations Guide", link: "https://medium.com/@kichu.josef/all-you-need-to-know-about-references-citations-in-academic-writing-9174922d5f9e" }
      ]
    },
    lizzy: {
      name: "Lizzy",
      scoreRange: "76–100 Points",
      pisaLevel: "PISA Reading Level 6",
      cefrLevel: "CEFR C1 (High Literacy / Wiz)",
      avatar: "assets/images/characters/stills/Jen-no-bg-square.png", // Fallback image
      quote: "Lizzy's lies set on lies! She reads graphs like the Egyptian pyramid. Statistics got nothing on her!",
      bio: "Lizzy is the wiz! She reads like there's no tomorrow and is always guarded against misinformation. She creates artwork based on what she reads and reads graphs like Egyptian pyramids.",
      activities: ["Volunteering in reading clubs", "Creating literature-inspired artwork", "Studying data & graphic literacy"],
      books: [
        { title: "The Strange Case of Dr Jekyll and Mr Hyde", author: "Robert Louis Stevenson", link: "https://www.gutenberg.org/files/43/43-h/43-h.htm" },
        { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", link: "https://kios-perpustakaan.jakarta.go.id" }
      ],
      resources: [
        { title: "UC Berkeley Beginner's Guide to Reading Graphics", link: "https://ischoolonline.berkeley.edu/blog/beginners-guide-improving-data-literacy/" },
        { title: "Dataversity Data Literacy Essentials", link: "https://www.dataversity.net/articles/data-literacy-essentials-what-you-need-to-know/" }
      ]
    }
  }
};
