const FORTUNE_BUCKET_KEYS = [
  "caring",
  "wowed",
  "angry",
  "anxious",
  "embarrassed",
  "calm",
  "confident",
  "confused",
  "distracted",
  "disgusted",
  "emotional",
  "engaged",
  "frustrated",
  "grateful",
  "guilty",
  "happy",
  "hopeful",
  "hungry",
  "jealous",
  "lonely",
  "neutral",
  "numb",
  "proud",
  "romantic",
  "sad",
  "sick",
  "stressed",
  "shaken",
  "tired",
  "unknown",
  "wired"
];

const FORTUNES = [
  {
    id: "f_0001",
    text: "Things improve when you stop fighting your own limits.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0002",
    text: "You do not have to delay peace to prove anything.",
    primaryBucket: "calm",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0003",
    text: "Let peace arrive before everything is figured out.",
    primaryBucket: "calm",
    alsoFits: [
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0005",
    text: "Calm arrives more readily where the mind has already done its work.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0007",
    text: "Things get lighter when you stop looking for what's wrong.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0010",
    text: "A serene mind notices what a chaotic one keeps missing.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0012",
    text: "A serene mind beats a perfect plan.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0015",
    text: "Tranquility in the face of chaos is half the battle.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0016",
    text: "Trust the calmer part of you to set the pace.",
    primaryBucket: "calm",
    alsoFits: [
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0017",
    text: "Your quieter mind may already know what matters.",
    primaryBucket: "calm",
    alsoFits: [
      "confused",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0019",
    text: "Gentle and grounded is enough for today.",
    primaryBucket: "calm",
    alsoFits: [
      "distracted",
      "sad",
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0021",
    text: "Life has a soft place for the person who does not force it.",
    primaryBucket: "calm",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0022",
    text: "Stillness can reveal what pressure hides.",
    primaryBucket: "calm",
    alsoFits: [
      "confused",
      "distracted",
      "frustrated",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0023",
    text: "When you soften, the right things stand out.",
    primaryBucket: "calm",
    alsoFits: [
      "confused",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0026",
    text: "Sometimes not moving is the best move.",
    primaryBucket: "calm",
    alsoFits: [
      "distracted",
      "shaken",
      "tired"
    ],
    scope: "shared"
  },
  {
    id: "f_0027",
    text: "A settled mind makes cleaner contact with reality.",
    primaryBucket: "calm",
    alsoFits: [
      "confused"
    ],
    scope: "shared"
  },
  {
    id: "f_0028",
    text: "There is power in not needing each moment to be different.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0029",
    text: "Your peace may be turning chaos into background noise.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0030",
    text: "Peace is not lazy; it is well edited.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0034",
    text: "Not every moment needs a dramatic opinion.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0035",
    text: "A steady middle can still be a valid place to stand.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0036",
    text: "Not every day requires a grand design.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0037",
    text: "Ordinary is sometimes just reality without stage lights.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0041",
    text: "A neutral day can leave room for clean judgment.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0042",
    text: "A day without crisis or euphoria leaves space to look around you.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0046",
    text: "Gratitude puts better lighting on ordinary things.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0051",
    text: "Gratitude sharpens the view without adding noise.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0057",
    text: "Appreciation can turn basics into luxuries.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0059",
    text: "Noticing what is here changes what here feels like.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0060",
    text: "Abundance sometimes arrives dressed as enough.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0064",
    text: "Gratitude gives the day a steadier pulse.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0068",
    text: "A good life often hides in unglamorous corners.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0069",
    text: "Affection makes the world less drafty.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0072",
    text: "Warmth travels farther than most arguments.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0101",
    text: "A little spark can light up an otherwise average afternoon.",
    primaryBucket: "romantic",
    alsoFits: [
      "caring"
    ],
    scope: "shared"
  },
  {
    id: "f_0104",
    text: "Some moods prefer candlelight and eye contact.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0106",
    text: "Today may call for less heroism and more tea.",
    primaryBucket: "tired",
    alsoFits: [
      "sick",
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0107",
    text: "A slower engine can still get you somewhere good.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0108",
    text: "Today is the time to add rest to the agenda.",
    primaryBucket: "tired",
    alsoFits: [
      "sick",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0109",
    text: "Your body has filed a complaint. Consider settling.",
    primaryBucket: "tired",
    alsoFits: [
      "sick",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0110",
    text: "Some victories look suspiciously like a nap.",
    primaryBucket: "tired",
    alsoFits: [
      "sick"
    ],
    scope: "shared"
  },
  {
    id: "f_0112",
    text: "One less thing may be today’s masterpiece.",
    primaryBucket: "tired",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0113",
    text: "No cat says, “I’ll nap, but first, a few more emails.”",
    primaryBucket: "tired",
    alsoFits: [
      "sick"
    ],
    scope: "shared"
  },
  {
    id: "f_0114",
    text: "An empty tank does not need motivation. It needs fuel.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0115",
    text: "This fatigue has a backstory. Respect it.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0116",
    text: "The thread is fraying. This is not the time to pull.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0117",
    text: "A wilting plant does not need a pep talk.",
    primaryBucket: "tired",
    alsoFits: [
      "sick"
    ],
    scope: "shared"
  },
  {
    id: "f_0118",
    text: "Today’s major accomplishment may be cancelling one thing.",
    primaryBucket: "tired",
    alsoFits: [
      "distracted",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0119",
    text: "Usually willpower wins. Today, let the couch and the remote.",
    primaryBucket: "tired",
    alsoFits: [
      "sick"
    ],
    scope: "shared"
  },
  {
    id: "f_0120",
    text: "Your thoughts may need a pillow more than another brainstorm.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0121",
    text: "Today’s go-getter move may be lower expectations.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0122",
    text: "A drained battery needs a charger, not a lecture.",
    primaryBucket: "tired",
    alsoFits: [
      "sick"
    ],
    scope: "shared"
  },
  {
    id: "f_0123",
    text: "“Sleep on it” is wisdom, not weakness.",
    primaryBucket: "tired",
    alsoFits: [
      "angry"
    ],
    scope: "shared"
  },
  {
    id: "f_0124",
    text: "A weary brain makes every road look uphill.",
    primaryBucket: "tired",
    alsoFits: [
      "anxious",
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0125",
    text: "Today is a finger trap. Stop pulling so hard.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0126",
    text: "A heavy eyelid is an instruction, not opinion.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0127",
    text: "Heading into a wall is no time to accelerate.",
    primaryBucket: "tired",
    alsoFits: [
      "sick"
    ],
    scope: "specific"
  },
  {
    id: "f_0128",
    text: "Weariness is not a medal, but a warning.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0129",
    text: "The most content creature on Earth is a sleeping cat.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0130",
    text: "Koalas sleep 22 hours a day. They seem just fine.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0131",
    text: "Your fatigue may be the receipt for showing up hard.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0133",
    text: "Something in you has been doing serious lifting.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0134",
    text: "Exhaustion often means something in you kept going too far.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0135",
    text: "Your weariness may be proof that you gave a lot.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0153",
    text: "Your next insight may be inside a burrito.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0155",
    text: "Hunger makes poor counsel sound wise.",
    primaryBucket: "hungry",
    alsoFits: [
      "tired"
    ],
    scope: "shared"
  },
  {
    id: "f_0156",
    text: "This mood may improve after contact with carbohydrates.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0173",
    text: "You are not forgotten because today feels empty.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0176",
    text: "Even quiet days leave your shape in the world.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0177",
    text: "Your place here is bigger than this mood admits.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0179",
    text: "You still belong more than this feeling admits.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0184",
    text: "Company may find you somewhere ordinary.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0186",
    text: "Even now, your life touches more than you know.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0187",
    text: "This ache is real, though it may not tell the whole story.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0190",
    text: "Distance can soften with a simple hello.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0193",
    text: "Someone may be kinder than your mood predicts.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0194",
    text: "Not everyone caring is making noise about it.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0195",
    text: "This ache is real; its conclusions may not be.",
    primaryBucket: "lonely",
    alsoFits: [
      "embarrassed",
      "guilty"
    ],
    scope: "specific"
  },
  {
    id: "f_0196",
    text: "The world is often warmer than first impressions.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0197",
    text: "You may be one small moment from feeling less alone.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0198",
    text: "A bit of warmth may be closer than it appears.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0200",
    text: "This ache can shrink after one decent conversation.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0202",
    text: "A friendly companion may lighten this dark moment.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0203",
    text: "Your mood is making the day sparkle. Stay with it.",
    primaryBucket: "happy",
    alsoFits: [
      "calm",
      "confident",
      "hopeful",
      "proud"
    ],
    scope: "shared"
  },
  {
    id: "f_0207",
    text: "Joy travels farther when welcomed without hesitation.",
    primaryBucket: "happy",
    alsoFits: [
      "calm",
      "confident",
      "hopeful",
      "romantic"
    ],
    scope: "shared"
  },
  {
    id: "f_0208",
    text: "A bright spirit improves the weather around it.",
    primaryBucket: "happy",
    alsoFits: [
      "wowed",
      "calm",
      "grateful",
      "hopeful",
      "proud"
    ],
    scope: "shared"
  },
  {
    id: "f_0210",
    text: "The more you savor this, the more alive the day gets.",
    primaryBucket: "happy",
    alsoFits: [
      "wowed",
      "calm",
      "grateful",
      "hopeful",
      "proud"
    ],
    scope: "shared"
  },
  {
    id: "f_0211",
    text: "Your bright spirit smooths the road ahead.",
    primaryBucket: "happy",
    alsoFits: [
      "confident",
      "hopeful"
    ],
    scope: "shared"
  },
  {
    id: "f_0212",
    text: "This bright version of you is creating momentum.",
    primaryBucket: "happy",
    alsoFits: [
      "confident",
      "hopeful"
    ],
    scope: "shared"
  },
  {
    id: "f_0215",
    text: "Some days are for solving; this one may be for savoring.",
    primaryBucket: "happy",
    alsoFits: [
      "wowed",
      "calm",
      "grateful",
      "proud"
    ],
    scope: "shared"
  },
  {
    id: "f_0216",
    text: "This brightness makes room for more life.",
    primaryBucket: "happy",
    alsoFits: [
      "wowed",
      "calm",
      "hopeful"
    ],
    scope: "shared"
  },
  {
    id: "f_0217",
    text: "Today may reward your willingness to enjoy it.",
    primaryBucket: "happy",
    alsoFits: [
      "calm"
    ],
    scope: "shared"
  },
  {
    id: "f_0218",
    text: "Enough grows richer when well noticed.",
    primaryBucket: "happy",
    alsoFits: [
      "grateful",
      "hopeful"
    ],
    scope: "shared"
  },
  {
    id: "f_0219",
    text: "One bright minute can redeem a forgettable day.",
    primaryBucket: "happy",
    alsoFits: [
      "wowed",
      "hopeful"
    ],
    scope: "shared"
  },
  {
    id: "f_0220",
    text: "Joy is sometimes just better access to the present.",
    primaryBucket: "happy",
    alsoFits: [
      "wowed",
      "hopeful"
    ],
    scope: "shared"
  },
  {
    id: "f_0221",
    text: "This may be your truest nature, lightly revealed.",
    primaryBucket: "happy",
    alsoFits: [
      "calm",
      "confident",
      "grateful",
      "proud"
    ],
    scope: "shared"
  },
  {
    id: "f_0228",
    text: "Earned satisfaction tastes sweeter than luck.",
    primaryBucket: "proud",
    alsoFits: [
      "confident"
    ],
    scope: "shared"
  },
  {
    id: "f_0232",
    text: "You stood fast where quitting had good arguments.",
    primaryBucket: "proud",
    alsoFits: [
      "confident"
    ],
    scope: "shared"
  },
  {
    id: "f_0236",
    text: "Some wins arrive without confetti but feel better than a parade.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0244",
    text: "Getting here deserves the internal applause.",
    primaryBucket: "proud",
    alsoFits: [
      "confident"
    ],
    scope: "shared"
  },
  {
    id: "f_0245",
    text: "Some outcomes fit because you grew to meet them.",
    primaryBucket: "proud",
    alsoFits: [
      "confident"
    ],
    scope: "shared"
  },
  {
    id: "f_0247",
    text: "A heavy hour is not the whole tale.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0251",
    text: "This cloud may pass soon without a single raindrop.",
    primaryBucket: "sad",
    alsoFits: [
      "lonely",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0252",
    text: "Comfort is honorable company on a dark day.",
    primaryBucket: "sad",
    alsoFits: [
      "angry",
      "anxious",
      "embarrassed",
      "confused",
      "jealous",
      "sick",
      "stressed",
      "shaken",
      "tired",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0254",
    text: "Even a heavy heart may meet a fair sunset.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0255",
    text: "Sorrow speaks boldly and is not always correct.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "embarrassed",
      "distracted",
      "guilty",
      "jealous",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0257",
    text: "A dark day need not become a lasting legacy.",
    primaryBucket: "sad",
    alsoFits: [
      "guilty",
      "lonely",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0259",
    text: "To endure the day is already an achievement.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "confused",
      "lonely",
      "numb",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0260",
    text: "Foggy days distort the view; wait before trusting it.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "distracted",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0261",
    text: "The clouds in you are not the whole sky.",
    primaryBucket: "sad",
    alsoFits: [
      "distracted",
      "lonely",
      "numb"
    ],
    scope: "shared"
  },
  {
    id: "f_0262",
    text: "Heavy feelings shrink a little in decent company.",
    primaryBucket: "sad",
    alsoFits: [
      "angry",
      "anxious",
      "distracted",
      "lonely",
      "numb",
      "stressed",
      "shaken",
      "tired"
    ],
    scope: "shared"
  },
  {
    id: "f_0263",
    text: "Even today can still hold one beautiful moment.",
    primaryBucket: "sad",
    alsoFits: [
      "angry",
      "distracted",
      "frustrated",
      "stressed",
      "shaken",
      "tired"
    ],
    scope: "shared"
  },
  {
    id: "f_0265",
    text: "Heavy feelings can sound wise without being right.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "lonely",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0266",
    text: "Even a gray day can catch a few sun rays.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0267",
    text: "A feeling may speak eloquently and still mislead.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "embarrassed",
      "guilty",
      "jealous",
      "lonely",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0268",
    text: "Some days are better judged after sleep.",
    primaryBucket: "sad",
    alsoFits: [
      "angry",
      "anxious",
      "embarrassed",
      "distracted",
      "frustrated",
      "stressed",
      "shaken",
      "tired",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0269",
    text: "One small errand can be a tiny rebellion today.",
    primaryBucket: "sad",
    alsoFits: [
      "distracted",
      "lonely"
    ],
    scope: "shared"
  },
  {
    id: "f_0270",
    text: "A sad day may ask less for meaning than for kindness.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0272",
    text: "A guitar can talk a mood down without using words.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0276",
    text: "A good song can sand down the edges of a hard day.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0277",
    text: "A good book can lower the volume on a bad mood.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0278",
    text: "A little laughter can trick a distraught mind.",
    primaryBucket: "sad",
    alsoFits: [
      "anxious",
      "embarrassed",
      "numb",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0280",
    text: "Conscience guides best without becoming a judge.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0282",
    text: "Repair is more useful than punishment.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0283",
    text: "Guilt is a signal, not a permanent residence.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0288",
    text: "A good apology weighs less than endless replay.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0294",
    text: "Conscience prefers amends to torment.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0295",
    text: "Being sorry is useful when it opens the door forward.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0296",
    text: "A simple amends outweigh a grand remorse.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0297",
    text: "Regret should sharpen you, not eat you.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0298",
    text: "You can hold responsibility without crushing the container.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0300",
    text: "Making it right usually starts smaller than punishment.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0305",
    text: "Low light may still reveal the way ahead.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0308",
    text: "Feeling often returns by inches, not miles.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0314",
    text: "Low light can still show the way home.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0325",
    text: "Even a flat day may usher in one kind thing.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0329",
    text: "An unsettled heart mistakes many shadows for danger.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0331",
    text: "Trust yourself before you trust the fright.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0332",
    text: "What feels urgent may later feel irrelevant.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0333",
    text: "Safety does not always require a solution at once.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0335",
    text: "Reality is rarely as grim as your mind portrays it.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0337",
    text: "A loud mind is not always a well-informed one.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0338",
    text: "Anxious body is not always a threatened one.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0339",
    text: "This moment is about what's here, not what's imagined.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0340",
    text: "A calm look at things may improve the picture.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0341",
    text: "Your situation may be safer than your nerves report.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0342",
    text: "Not every alarm is an instruction.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0344",
    text: "A bad thought is not the same as a true one.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0345",
    text: "Some thoughts can feel vivid and still be wrong.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0346",
    text: "A loud fear is not always a true one.",
    primaryBucket: "anxious",
    alsoFits: [
      "embarrassed",
      "guilty",
      "stressed",
      "shaken",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0347",
    text: "A feeling in your body is not a forecast.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0348",
    text: "Your mind sometimes talks faster than reality.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0349",
    text: "What feels certain is not always even likely.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0350",
    text: "The mind makes guesses and calls them truth.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0351",
    text: "Your mind can sound very certain without good evidence.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0352",
    text: "A dark thought is still only a passing guest.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0353",
    text: "The mind predicts storms the sky may never send.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0355",
    text: "Not every destabilizing thought is a prophecy.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0356",
    text: "Sometimes peace enters through the door called facts.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0357",
    text: "A pained mind is a gifted storyteller, not a reliable witness.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0359",
    text: "Sometimes the bravest thing is to let the facts stay boring.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0360",
    text: "Your mind sometimes writes fiction and calls it planning.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0361",
    text: "An unsettled mind packs for storms not on the map.",
    primaryBucket: "anxious",
    alsoFits: [
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0363",
    text: "Pressure lies about what must be done first.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0366",
    text: "Some weight belongs on the floor, not your spine.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0368",
    text: "Stress makes small choices wear heavy boots.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0371",
    text: "Pressure loves pretending it is all priority one.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0372",
    text: "Your capacity is a border, not a suggestion.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0375",
    text: "A full plate is not a dare. It's a truth.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0377",
    text: "You may need subtraction more than inspiration.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0379",
    text: "Not all demands deserve equal attention.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0380",
    text: "A shorter list is often the wiser one.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0382",
    text: "Sometimes it is too much, not too little grit.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0383",
    text: "Buffers are sanity, not a luxury.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0384",
    text: "Pressure is loud, but you are still the one in charge.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0391",
    text: "A racing spirit benefits from fewer sparks.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0396",
    text: "Not every bright buzz deserves a chase.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0399",
    text: "A buzzing body can mistake motion for necessity.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0408",
    text: "Restless energy often improves when given less audience.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0412",
    text: "That small yes in you may be wiser than your doubt.",
    primaryBucket: "hopeful",
    alsoFits: [
      "confused"
    ],
    scope: "shared"
  },
  {
    id: "f_0413",
    text: "Something promising may be arriving quietly.",
    primaryBucket: "hopeful",
    alsoFits: [
      "confident"
    ],
    scope: "shared"
  },
  {
    id: "f_0414",
    text: "A better chapter may be closer than it looks.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0415",
    text: "Your outlook may be noticing something real.",
    primaryBucket: "hopeful",
    alsoFits: [
      "confident",
      "confused"
    ],
    scope: "shared"
  },
  {
    id: "f_0416",
    text: "Something in you hears openings before doors appear.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0417",
    text: "The good thing may be closer than caution thinks.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0419",
    text: "A shift unseen but intuited may already be underway.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0420",
    text: "Hope is not always naive; sometimes it is observant.",
    primaryBucket: "hopeful",
    alsoFits: [
      "confident"
    ],
    scope: "shared"
  },
  {
    id: "f_0421",
    text: "Stay open; the day may meet you halfway.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0422",
    text: "Trust that small pull; it may know something.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0423",
    text: "Something good may be forming out of sight.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0424",
    text: "A better stretch may begin with very little warning.",
    primaryBucket: "hopeful",
    alsoFits: [
      "distracted",
      "frustrated",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0425",
    text: "Possibility may be doing more work than you can see.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0426",
    text: "Sometimes hope is just grounded patience.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0429",
    text: "A small bright thought can change the whole perspective.",
    primaryBucket: "hopeful",
    alsoFits: [
      "anxious",
      "distracted",
      "frustrated",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0431",
    text: "A positive mind can spot doors doubt walks past.",
    primaryBucket: "hopeful",
    alsoFits: [
      "frustrated",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0432",
    text: "Sometimes progress first appears as less resistance.",
    primaryBucket: "hopeful",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0434",
    text: "Optimism sometimes is a sneak preview into reality.",
    primaryBucket: "hopeful",
    alsoFits: [
      "confident"
    ],
    scope: "shared"
  },
  {
    id: "f_0435",
    text: "Hope sees scaffolding where doubt sees rubble.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0437",
    text: "Strong feelings cannot be controlled, but reactions can.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0438",
    text: "Asking what this feeling protects may point to a measured reaction.",
    primaryBucket: "angry",
    alsoFits: [
      "anxious",
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0439",
    text: "Keeping your composure means not surrendering to the trigger.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0441",
    text: "Save your energy for what truly needs your response.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0442",
    text: "What hurt you matters. Respond without losing yourself.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0443",
    text: "Wait for the fire to cool before choosing your move.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0445",
    text: "Protect your peace, then choose your next step.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0446",
    text: "Don't spend all your power in one hot moment.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0447",
    text: "Let yourself cool enough for wisdom to catch up.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0448",
    text: "Anger can become clarity if handled with care.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0449",
    text: "Choose the response you can respect tomorrow.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0452",
    text: "Let your values speak louder than your temper.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0453",
    text: "There is a question under this. Do not rush the answer.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0454",
    text: "Something in you says a line got crossed.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0455",
    text: "Anger carried too long punishes the bearer more than the object.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0456",
    text: "A firm boundary says more than raised volume.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0457",
    text: "Refusing to give others power over our feelings is a quiet win.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0459",
    text: "Intensity is not the same thing as direction.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0461",
    text: "This can be a map with the polite labels burned off.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0462",
    text: "Some refusals are dignity declining a bad seat.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0463",
    text: "Delaying a reaction doesn't mean not reacting.",
    primaryBucket: "angry",
    alsoFits: [
      "frustrated",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0464",
    text: "Some emotions spend energy like it grows back overnight.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0465",
    text: "Anger kicks doors open, then forgets why.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0466",
    text: "A hot mind files reckless paperwork.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0468",
    text: "Jammed gears are not a character flaw.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0477",
    text: "A stubborn problem is not a referendum on your talent.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0479",
    text: "Some days require less force and better leverage.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0482",
    text: "A blocked path is still a path, just with opinions.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0487",
    text: "Try a smaller move. Stuck things respect increments.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0490",
    text: "Another's shine need not dim your own light.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0492",
    text: "Beware comparison, for it will rob you of all your riches.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0493",
    text: "Another person’s glow is not your power outage.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0494",
    text: "Wanting can offer good insights once it stops staring sideways.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0503",
    text: "Jealousy squints at abundance until it looks scarce.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0515",
    text: "Your body often spots trouble before your mind explains it.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0516",
    text: "What repels you need not earn a long defense.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0517",
    text: "Knowing what you don't like is a form of self-respect.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0520",
    text: "Taste is one of wisdom's louder votes.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0524",
    text: "Not everything deserves a second look, let alone approval.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0525",
    text: "Discernment can grow sharp when patience runs thin.",
    primaryBucket: "disgusted",
    alsoFits: [
      "frustrated"
    ],
    scope: "shared"
  },
  {
    id: "f_0529",
    text: "Bad vibes rarely improve with more exposure.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0532",
    text: "Being puzzled is okay; it means you're figuring things out.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0533",
    text: "Your next move may be simpler than you think.",
    primaryBucket: "confused",
    alsoFits: [
      "anxious",
      "frustrated",
      "stressed",
      "shaken",
      "wired"
    ],
    scope: "shared"
  },
  {
    id: "f_0534",
    text: "Set down one impossible standard and see what clears.",
    primaryBucket: "confused",
    alsoFits: [
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0535",
    text: "Ask only for the next step, not the whole answer.",
    primaryBucket: "confused",
    alsoFits: [
      "frustrated",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0536",
    text: "A tangled hour may still afford one simple step.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0537",
    text: "The map is blurry; you only need the next step.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0538",
    text: "Not knowing is uncomfortable, not catastrophic.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0539",
    text: "Perfect clarity is like perfect pitch: lovely, not necessary.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0540",
    text: "Not knowing everything is not the same as knowing nothing.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0541",
    text: "Keep moving gently; the picture will sharpen.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0543",
    text: "You can begin before everything makes sense.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0544",
    text: "You are allowed to figure this out as you go.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0545",
    text: "A tangled mind can still make one decent choice.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0546",
    text: "The next step does not need the whole map.",
    primaryBucket: "confused",
    alsoFits: [
      "anxious",
      "distracted",
      "frustrated",
      "stressed",
      "shaken"
    ],
    scope: "shared"
  },
  {
    id: "f_0548",
    text: "Directionally right is better than precisely wrong.",
    primaryBucket: "confused",
    alsoFits: [
      "distracted",
      "stressed"
    ],
    scope: "shared"
  },
  {
    id: "f_0549",
    text: "Some clarity comes only after contact with real life.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0551",
    text: "Your instincts may take you farther than overthinking.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0552",
    text: "Perfect clarity is not required; decent instincts will do.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "shared"
  },
  {
    id: "f_0556",
    text: "This place is your mind refusing a fake neat answer.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0557",
    text: "A messy signal may still contain a true direction.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0558",
    text: "Answers often arrive after the noise grows tired.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0559",
    text: "You may not be lost; you may be between explanations.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0561",
    text: "When nothing makes sense, try following what makes less nonsense.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0567",
    text: "Some moments fit like borrowed shoes, but you do get to cast them off.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0569",
    text: "Most people are too busy surviving themselves to notice your misstep.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0576",
    text: "Every room keeps a private archive of missteps.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0583",
    text: "Not every thought needs a speaking role.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0591",
    text: "The day may improve when one thing holds the floor.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0609",
    text: "Awe is reality exceeding its own rumor.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0612",
    text: "Marvel gladly; the world is showing its fine work.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0615",
    text: "Some sights leave wisdom where words cannot.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0630",
    text: "Today swerved. A seatbelt and an open mind will help.",
    primaryBucket: "shaken",
    alsoFits: [
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0631",
    text: "Reality just changed the playlist. New track, same you.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0632",
    text: "Today upgraded itself without asking. Explore the features.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0633",
    text: "This was not on the menu. It may still be delicious.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0634",
    text: "Unexpected does not mean unwanted.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0635",
    text: "Life just improvised. Try not to boo.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0636",
    text: "The script changed mid-scene. Keep rolling.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0637",
    text: "A sharp turn can still head somewhere good.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0638",
    text: "A plot twist can still be a favor in disguise.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0639",
    text: "This detour may know a shortcut you do not.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0640",
    text: "Not every curveball can ruin your inning.",
    primaryBucket: "shaken",
    alsoFits: [
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0643",
    text: "The wrong turn may have better scenery.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0644",
    text: "Some changes enter like chaos and stay like progress.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0645",
    text: "Sometimes a stumble sends you into a flower meadow.",
    primaryBucket: "shaken",
    alsoFits: [
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0646",
    text: "Too much predictability can drain a year of life.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0647",
    text: "If life came with spoilers, people would ask for a refund.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0648",
    text: "Surprises, like wine, taste better when you let them breathe.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0650",
    text: "Some interruptions arrive carrying upgrades.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0651",
    text: "The unplanned note may improve the whole melody.",
    primaryBucket: "shaken",
    alsoFits: [
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0652",
    text: "A break in pattern can lead to a new appreciation.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0653",
    text: "What arrived sideways may still land beautifully.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0654",
    text: "Not every jolt is a verdict; some are a summons to wake.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0656",
    text: "The odd gust may be what lifts the kite.",
    primaryBucket: "shaken",
    alsoFits: [
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0657",
    text: "Reality occasionally likes to freestyle. Catch the beat.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0659",
    text: "Too much autopilot and you forget how to drive.",
    primaryBucket: "shaken",
    alsoFits: [
      "distracted"
    ],
    scope: "shared"
  },
  {
    id: "f_0683",
    text: "Kindness can reach places words never do.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0685",
    text: "Affection is its own kind of wisdom.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0686",
    text: "This feeling does not need to be loud to be real.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0687",
    text: "Self-trust is a quiet kind of power.",
    primaryBucket: "confident",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0688",
    text: "You do not need perfect certainty to move well.",
    primaryBucket: "confident",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0689",
    text: "Your strength does not ask permission to exist.",
    primaryBucket: "confident",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0690",
    text: "Confidence grows every time you back yourself.",
    primaryBucket: "confident",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0691",
    text: "The next move does not need a louder voice, only yours.",
    primaryBucket: "confident",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0692",
    text: "Stand like someone who has met hard things before.",
    primaryBucket: "confident",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0699",
    text: "A willing mind makes fine company for good fortune.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0701",
    text: "Something worthwhile may be nearing clarity.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0702",
    text: "The Cookie Oracle does not know this one. Your future is still bright.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0704",
    text: "The fortune cannot name this feeling. It still likes your chances.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0705",
    text: "The cookie is puzzled. Your prospects remain excellent.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0706",
    text: "The fortune has no label for this one. Good things are still to come.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0708",
    text: "There is meaning in what is stirring inside you.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0709",
    text: "Some feelings arrive softly and remain.",
    primaryBucket: "caring",
    alsoFits: [
      "grateful"
    ],
    scope: "shared"
  },
  {
    id: "f_0713",
    text: "Some moments ask not to be rushed.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0717",
    text: "Some moments speak to your heart, not mind.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0718",
    text: "A deep stir often means something worth noticing.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0719",
    text: "A moved heart is a compass pointing toward meaning.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0720",
    text: "Some tides bring more emotions than water.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0721",
    text: "Laughter is the spice of life; so is a well-seasoned burrito.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0722",
    text: "Hunger conquers the impossible, like eating a whole pizza.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0723",
    text: "When hunger strikes, logic and reason take a backseat.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0724",
    text: "A bit of laughter and a bit of food can change the day.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0725",
    text: "Don't let hunger bring you down; use it for comedy.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0726",
    text: "Small gestures are the currency of relationships that last.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0727",
    text: "Romance thrives where curiosity is practiced.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0728",
    text: "Love is discovering small miracles within another human.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0729",
    text: "Awe turns an ordinary hour into a landmark.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0731",
    text: "Wisdom begins with wonder.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0732",
    text: "Wonder may be the aura of truth, the halo of it.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0733",
    text: "To marvel is to become a traveler in your own life.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0734",
    text: "Each question carries a spark; each spark a world to be lit.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0735",
    text: "Children teach us how to marvel without apology.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0736",
    text: "A single hush of awe can shift an entire year.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0737",
    text: "Awe is the past and the future meeting in the present.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0739",
    text: "Your attention knows where it wants to go.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0740",
    text: "Energy becomes flow when it finds direction.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0741",
    text: "The greatest warrior is an ordinary person, with laser focus.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0742",
    text: "A kind heart is the beginning of all knowledge.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0743",
    text: "Passion sweetens the moment; affection lets it last.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0744",
    text: "Affection often changes more than argument can.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0745",
    text: "The charge in you wants a target.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0746",
    text: "The current is with you now. Swim.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0747",
    text: "Something in you has already said yes.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0748",
    text: "You and this moment are facing the same way.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0749",
    text: "This moment may offer more than first appears.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0750",
    text: "Warmth has a way of finding its mark.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0751",
    text: "The heart does some of its best work quietly.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0752",
    text: "The gentlest things often reach the deepest.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0753",
    text: "The heart is often clearest in its gentler moments.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0754",
    text: "Allow happiness to grow from small bright moments.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0755",
    text: "What is needed to be happy is already all within youself.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0757",
    text: "Most people are as happy as they make up their minds to be.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0758",
    text: "Stress is who you think you should be, calm is who you are.",
    primaryBucket: "stressed",
    alsoFits: [
      "anxious"
    ],
    scope: "shared"
  },
  {
    id: "f_0759",
    text: "Count your life by smiles, not tears.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0760",
    text: "Some victories sit quietly and still shine.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0761",
    text: "This feeling was earned one step at a time.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0762",
    text: "There is dignity in what you made happen.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0763",
    text: "Some pride comes from simply not giving up.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0764",
    text: "Focus and simplicity can move mountains.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0765",
    text: "If you sometimes let your mind wander, it may guide you to change.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0767",
    text: "Focus on remedies, not faults.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0770",
    text: "The human heart opens to the heart that opens in return.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0773",
    text: "The heart remembers in its own strange light.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0774",
    text: "A full heart can make time feel thin.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0775",
    text: "Some moments glow longer than the hour that made them.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0776",
    text: "Time folds easily around a tender memory.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0777",
    text: "A moved heart can make the world feel brighter.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0778",
    text: "Not every moment asks to be more than it is.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0779",
    text: "Some days are meant to pass without a headline.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0780",
    text: "This moment may be plain, but it is still yours.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0781",
    text: "Evenness can be its own kind of mercy.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0782",
    text: "You do not have to be lit up to be alive.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0783",
    text: "Some moods are simply room to breathe.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0784",
    text: "The middle has its own kind of balance.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0785",
    text: "A quiet state can hold more than it shows.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0786",
    text: "A flat road still gets you somewhere.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0787",
    text: "The ordinary can be a resting place.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0788",
    text: "You do not need a wave to know the sea is there.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0789",
    text: "There is grace in a day that asks little of you.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0790",
    text: "Not every day needs color to have shape.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0791",
    text: "There is relief in a mood that does not insist.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0792",
    text: "Sometimes enough is exactly what a moment should be.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0793",
    text: "A quieter state can leave more room around you.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0794",
    text: "A jealous moment may be naming a wish that needs sunlight.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0795",
    text: "What catches in you may reveal where longing lives.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0797",
    text: "Some envy points forward. Some points nowhere.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0798",
    text: "Some longing is real. Some is borrowed.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0799",
    text: "Envy can be a compass or a mirage.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0800",
    text: "Some wants should be fed. Others outgrown.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0801",
    text: "Jealousy can sort wish from illusion.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0802",
    text: "Envy can reveal what is yours to want.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0803",
    text: "Envy asks to be understood, not obeyed.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0804",
    text: "What strikes the heart rarely does so without reason.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0806",
    text: "Hunger is a bad time for problem solving.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0807",
    text: "A snack may now qualify as emotional support.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0808",
    text: "Your wisdom is currently under review by your stomach.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0809",
    text: "Right now, your best idea may be lunch.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0810",
    text: "Greatest thinkers also need something crunchy.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0811",
    text: "The cookie cannot place this mood. The future remains bright.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0812",
    text: "The fortune shrugs politely. Your future still looks favorable.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0813",
    text: "The oracle cannot decode this one. It still approves your odds.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0814",
    text: "The cookie does not know this word. It still predicts good things.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0815",
    text: "The fortune is puzzled, but not pessimistic.",
    primaryBucket: "unknown",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0816",
    text: "Trust the instinct that says no.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0817",
    text: "Disgust is a boundary asking to be respected.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0818",
    text: "Not everything foul deserves a second glance.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0819",
    text: "Disgust is often clarity with less patience.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0820",
    text: "Recovery favors those who stop negotiating with the symptoms.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0821",
    text: "The body speaks plainly, if not politely.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0822",
    text: "Rest is a worthy labor when the body is strained.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0823",
    text: "A gentler day may be today’s best medicine.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0824",
    text: "Some days yearn for tea and blankets, not toughness and bravery.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0825",
    text: "Broth may accomplish more today than willpower.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0826",
    text: "When you argue with your body, the body usually wins.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0827",
    text: "Some hard days can barely spare a whisper, let alone a scream.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0828",
    text: "Numbness often means something is too tired to shout.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0829",
    text: "Some days the feelings are in another room.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0830",
    text: "When all is muted, search for what feels true.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0831",
    text: "Low light is not the same as complete darkness.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0832",
    text: "Muted is often distance, not disappearance.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0833",
    text: "Appreciation makes ordinary feel radiant.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0834",
    text: "Some blessings arrive dressed as everyday life.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0835",
    text: "A thankful heart makes simple things feel generous.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0836",
    text: "Travel far enough and home may shine more brightly.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0837",
    text: "Gratitude turns a tin cup into a golden chalice.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0838",
    text: "Practice noticing, and your heart will thank you.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0839",
    text: "A cherished pebble sparkles like a diamond.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0840",
    text: "Enough is easier to recognize than to invent.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0841",
    text: "A grateful mind hears the truth, not the noise.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0842",
    text: "A small bruise need not spoil the fruit.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0843",
    text: "What stings now may one day be a faint nostalgic memory.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0844",
    text: "Some moments hurt without meaning much.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0845",
    text: "Not every sting is a story about who you are.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0846",
    text: "Romance likes timing almost as much as courage.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0847",
    text: "A glance may brighten the entire week.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0848",
    text: "Romance often begins with attention.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0849",
    text: "Romance loves small details that logic overlooks.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0850",
    text: "One electric moment may improve your opinion of time.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0851",
    text: "Romance rewards those who notice what others miss.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0852",
    text: "Noticing something small may usher in a big moment.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0853",
    text: "One sincere awkward word does more than a polished speech.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0854",
    text: "Romance likes the brave, but it adores the genuine.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0855",
    text: "Affection grows best where curiosity is welcome.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0856",
    text: "Notice how the path to this moment has changed you.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0857",
    text: "The wisest plan may be to forget about today until tomorrow.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0858",
    text: "Symptoms seldom ask permission to be believed.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0859",
    text: "The body sometimes insists on a gentler day.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0860",
    text: "Recovery begins when resistance ends.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0861",
    text: "Today may reward comfort more than standards.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0862",
    text: "A muted day may still answer to care.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0863",
    text: "Numbness is a segment of the journey, not the destination.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0864",
    text: "Guilt should open a path, not lock a prison cell door.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0865",
    text: "Responsibility is useful; replay seldom is.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0866",
    text: "Let conscience advise you, not sentence you.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0867",
    text: "Regret is meant to guide, not consume.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0868",
    text: "Let sorry open a door, not close one.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0869",
    text: "Affection has excellent timing when least expected.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0870",
    text: "If love is a battlefield, a courageous gesture will win the day.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0871",
    text: "Jealousy often points at a wound and calls it a rival.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0872",
    text: "What catches in you may also be telling on you.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0873",
    text: "Envy asks a rude question that may still be worth answering.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0875",
    text: "A moved heart is already in conversation with truth.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0876",
    text: "The Cookie Oracle sees big things in your future. A footlong sandwich.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0877",
    text: "Your future is bright, but your stomach wants a burrito first.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0878",
    text: "The stars suggest immediate contact with protein.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0879",
    text: "The universe supports your goals and also a second taco.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0880",
    text: "The mind seeks truth, justice, and something crunchy.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0881",
    text: "Destiny may be calling, but lunch is calling louder.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0882",
    text: "A noble and enlightened spirit still yearns for sushi.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0883",
    text: "Your next breakthrough may be hiding inside a wrap.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0884",
    text: "Enlightenment is easier after a good scone.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0885",
    text: "This is a good hour to follow what catches your mind.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0886",
    text: "On a dim day, one small kindness may be the answer.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0887",
    text: "A painful moment is not a permanent description.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0888",
    text: "Warmth changes a room more than a fresh coat of paint.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0889",
    text: "A strong no is a useful form of wisdom.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0890",
    text: "Disgust can be discernment with no time for manners.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0891",
    text: "Some reactions are cleaner than explanations.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0892",
    text: "Your aversion may know something worth respecting.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0893",
    text: "Spotlight can make you flush, but photons do not judge.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0894",
    text: "Your recoil may know what your mind is still parsing.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0895",
    text: "A sharp refusal is still a form of intelligence.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0896",
    text: "What feels foul is not owed your curiosity.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0897",
    text: "Aversion often knows before explanation arrives.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0898",
    text: "A stirred heart sometimes hears tomorrow before the mind does.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0899",
    text: "Some truths announce themselves by the way they touch the heart.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0900",
    text: "What lingers in feeling may matter more than what shouts for attention.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0901",
    text: "Some moments press upon the heart because they intend to remain.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0902",
    text: "A deep feeling is sometimes the soul insisting on a second look.",
    primaryBucket: "emotional",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0903",
    text: "Kindness often arrives quietly and leaves a long echo.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0904",
    text: "Warmth offered freely often returns by another road.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0905",
    text: "Warmth is often remembered long after advice is forgotten.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0906",
    text: "Kindness is often the shortest road through a hard hour.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0907",
    text: "Care leaves fingerprints on the future.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0908",
    text: "What draws your mind may already be drawing your future.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0909",
    text: "Interest is a thread; follow it before it gets cut off.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  },
  {
    id: "f_0910",
    text: "A mind fully present is halfway to discovery.",
    primaryBucket: "engaged",
    alsoFits: [],
    scope: "specific"
  }
];

export { FORTUNES, FORTUNE_BUCKET_KEYS };
