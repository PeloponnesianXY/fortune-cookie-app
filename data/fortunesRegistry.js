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
  "weird",
  "wired"
];

const FORTUNES = [
  {
    id: "f_0001",
    text: "Things improve when you stop fighting your own limits.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0002",
    text: "You do not have to delay peace to prove anything.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0003",
    text: "Let peace arrive before everything is figured out.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0004",
    text: "Calm is wise movement at the right speed.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0005",
    text: "Calm doesn't just happen. You've earned it.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0006",
    text: "Pressure is loud, but you are still the one in charge.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0007",
    text: "Things get lighter when you stop looking for what's wrong.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0008",
    text: "Peace is doing more for your future than panic ever could.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0009",
    text: "A settled heart can recognize what matters.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0010",
    text: "A serene mind notices what a chaotic one keeps missing.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0011",
    text: "Keeping your center and your humor will take you far.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0012",
    text: "A steady mind beats a perfect plan in the long run.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0013",
    text: "Staying centered is the ultimate power move.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0014",
    text: "Calmness quietly changes more than drama ever does.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0015",
    text: "Tranquility in the face of chaos is half the battle.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0016",
    text: "Trust the calmer part of you to set the pace.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0017",
    text: "Your calmer mind may already know what matters.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0018",
    text: "A quieter mind can tell what matters.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0019",
    text: "Gentle and grounded is enough for today.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0020",
    text: "Calm gets more things right than rushing does.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0021",
    text: "Life has a soft place for the person who does not force it.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0022",
    text: "Stillness can reveal what pressure hides.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0023",
    text: "When you soften, the right things stand out.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0024",
    text: "A calm approach wastes less of you.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0025",
    text: "Peace looks unusually good on your nervous system.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0026",
    text: "Sometimes stillness is the best movement.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0027",
    text: "A settled mind makes cleaner contact with reality.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0028",
    text: "There is power in not needing each moment to be different.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0029",
    text: "Your peace may be turning chaos into background noise.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0030",
    text: "Peace is not lazy; it is well edited.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0031",
    text: "A calm mind wastes less electricity.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0032",
    text: "Calm is grace with good boundaries.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0033",
    text: "Peace is composure in comfortable shoes.",
    primaryBucket: "calm",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0034",
    text: "Not every moment needs a dramatic opinion.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0035",
    text: "A steady middle can still be a valid place to stand.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0036",
    text: "You do not owe every day a grand emotional arc.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0037",
    text: "Ordinary is sometimes just reality without stage lights.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0038",
    text: "This moment may be simple, and simple may be enough.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0039",
    text: "A quiet baseline is still a kind of stability.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0040",
    text: "Nothing urgent may be the message, not a flaw.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0041",
    text: "A neutral day can leave room for clean judgment.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0042",
    text: "You are allowed to be undecorated by crisis or euphoria.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0043",
    text: "Calm enough to notice, plain enough to think clearly.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0044",
    text: "Not much happening is still something happening honestly.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0045",
    text: "A middle note can carry the whole song just fine.",
    primaryBucket: "neutral",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0046",
    text: "Gratitude puts better lighting on ordinary things.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0047",
    text: "Enough can feel extravagant when you finally notice it.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0048",
    text: "Appreciation makes small blessings stand at attention.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0049",
    text: "What is already here may be quietly excellent.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0050",
    text: "Some riches arrive without needing a bank.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0051",
    text: "Gratitude sharpens the view without adding noise.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0052",
    text: "Ordinary things can become rare under good attention.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0053",
    text: "Thankfulness is a better magnifying glass than worry.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0054",
    text: "A noticed good thing becomes sturdier.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0055",
    text: "Some days are improved by counting what stayed kind.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0056",
    text: "What remains good still deserves a witness.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0057",
    text: "Appreciation can turn basics into luxuries.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0058",
    text: "Gratitude makes the room feel less rented.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0059",
    text: "Noticing what is here changes what here feels like.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0060",
    text: "Abundance sometimes arrives dressed as enough.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0061",
    text: "A small good thing can carry shocking weight.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0062",
    text: "Thankfulness edits the day toward accuracy.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0063",
    text: "What you cherish starts looking more alive.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0064",
    text: "Gratitude gives the day a steadier pulse.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0065",
    text: "The overlooked often improves under direct attention.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0066",
    text: "Quiet abundance is still abundance.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0067",
    text: "What is working deserves more eye contact.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0068",
    text: "A good life often hides in unglamorous corners.",
    primaryBucket: "grateful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0069",
    text: "Affection makes the world less drafty.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0070",
    text: "Tenderness is strength in a softer jacket.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0071",
    text: "Care is one of your more convincing talents.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0072",
    text: "Warmth travels farther than most arguments.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0073",
    text: "Some closeness makes the room itself improve.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0074",
    text: "Gentleness can hold astonishing weight.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0075",
    text: "Devotion makes ordinary gestures look expensive.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0076",
    text: "Softness is not weakness; it is better aim.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0077",
    text: "Being moved is its own kind of fluency.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0078",
    text: "Care flowing outward changes the weather a little.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0079",
    text: "You are allowed to be tender without apology.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0080",
    text: "Closeness can make the day feel more inhabited.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0081",
    text: "Warmth is a serious skill wearing casual clothes.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0082",
    text: "Love often arrives looking like excellent attention.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0083",
    text: "Tenderness keeps strength from becoming ugly.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0084",
    text: "Some bonds make the world feel properly furnished.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0085",
    text: "The generous version of you has good instincts.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0086",
    text: "Affection is a quiet form of intelligence.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0087",
    text: "To love well is to make space without shrinking.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0088",
    text: "Soft-hearted does not mean easy to knock over.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0089",
    text: "Closeness can enlarge the ordinary on contact.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0090",
    text: "A little tenderness can civilize an entire afternoon.",
    primaryBucket: "caring",
    alsoFits: [],
    scope: "specific",
    active: false
  },
  {
    id: "f_0091",
    text: "Attraction has entered the room wearing better lighting.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0092",
    text: "Romance is often confidence with softer edges.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0093",
    text: "A charged glance can make the whole day misbehave.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0094",
    text: "Desire knows how to turn ordinary timing theatrical.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0095",
    text: "Flirtation is curiosity in a sharper jacket.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0096",
    text: "Some chemistry arrives before the explanation does.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0097",
    text: "Being a little smitten can improve the weather immediately.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0098",
    text: "The heart is currently writing in italics.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0099",
    text: "A romantic mood can make small details feel heavily cast.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0100",
    text: "Attraction is not always subtle, but it can still be elegant.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0101",
    text: "A little spark can reorganize an otherwise average afternoon.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0102",
    text: "You are allowed to enjoy being a little enchanted by someone.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0103",
    text: "Desire is often just attention refusing to sit still.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0104",
    text: "Some moods prefer candlelight and unnecessary eye contact.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0105",
    text: "Romance adds dramatic music where there was previously logistics.",
    primaryBucket: "romantic",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0106",
    text: "Today may call for less heroism and more water.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0107",
    text: "A slower engine can still get you somewhere good.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0108",
    text: "Rest never gets added to the agenda. It should.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0109",
    text: "Your body has filed a complaint. Consider settling.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0110",
    text: "Some victories look suspiciously like a nap.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0111",
    text: "Today may improve once you stop cosplaying as tireless.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0112",
    text: "One less thing may be today’s masterpiece.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0113",
    text: "No cat says, “I’ll nap, but first, a few more emails.”",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0114",
    text: "An empty tank does not need motivation. It needs fuel.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0115",
    text: "This fatigue has a backstory. Respect it.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0116",
    text: "The thread is fraying. This is not the time to pull.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0117",
    text: "A wilting plant does not need a pep talk.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0118",
    text: "Today’s major accomplishment may be cancelling one thing.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0119",
    text: "Usually willpower wins. Today, maybe the couch and the remote.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0120",
    text: "Your thoughts may need a pillow more than another brainstorm.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0121",
    text: "Today’s go-getter move may be lower expectations.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0122",
    text: "A drained battery needs a charger, not a lecture.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0123",
    text: "“Sleep on it” is wisdom, not weakness.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0124",
    text: "A weary brain makes everything look oddly uphill.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0125",
    text: "Today is a finger trap. Stop pulling so hard.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0126",
    text: "A heavy eyelid is an instruction, not opinion.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0127",
    text: "Heading into a wall is no time to accelerate.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0128",
    text: "Burn-out is not a badge of honor. It’s just burnout.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0129",
    text: "The most content creature on Earth is a sleeping cat.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0130",
    text: "Koalas sleep 22 hours a day. They seem just fine.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0131",
    text: "Your fatigue may be the receipt for showing up hard.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0132",
    text: "Fatigue can be evidence of effort, not indictment of will.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0133",
    text: "Something in you has been doing serious lifting.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0134",
    text: "Exhaustion often means something in you kept going too far.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0135",
    text: "Your weariness may be proof that you gave a lot.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0136",
    text: "Some days are better judged after sleep.",
    primaryBucket: "tired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0137",
    text: "Your body may want gentleness more than productivity today.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0138",
    text: "Feeling off is enough information; you do not need to argue with it.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0139",
    text: "A slower day may be the correct medicine, not a moral failure.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0140",
    text: "Recovery counts even when it looks like doing very little.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0141",
    text: "A body under strain is not being dramatic. It is reporting honestly.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0142",
    text: "You are allowed to treat physical discomfort like real news.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0143",
    text: "Rest is a reasonable response to feeling unwell.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0144",
    text: "If your system feels tender, answer it with less force.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0145",
    text: "A rough body day is still a day deserving kindness.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0146",
    text: "Your job today may be to reduce friction, not prove endurance.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0147",
    text: "Healing often looks boring from the outside and useful from the inside.",
    primaryBucket: "sick",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0148",
    text: "Your stomach has entered the meeting without consent.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0149",
    text: "This may be a sandwich-level emergency.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0150",
    text: "Blood sugar is a poor philosopher.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0151",
    text: "Your body is negotiating in growls now.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0152",
    text: "Hunger makes every plan sound less elegant.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0153",
    text: "Your next insight may be inside a burrito.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0154",
    text: "The body has filed a very fair complaint.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0155",
    text: "Low fuel gives bad advice with confidence.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0156",
    text: "This mood may improve after contact with carbohydrates.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0157",
    text: "A hungry person should not be editing reality.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0158",
    text: "The stomach would like the floor, immediately.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0159",
    text: "Peckish is just hunger wearing office clothes.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0160",
    text: "Ravenous is not a personality. It is a menu request.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0161",
    text: "Some conflicts are really sandwich-shaped.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0162",
    text: "Your standards may return after a decent snack.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0163",
    text: "This body runs better when the pantry cooperates.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0164",
    text: "Your system would like calories before philosophy.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0165",
    text: "A fed person has better diplomacy.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0166",
    text: "Snack first. Interpretive thinking later.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0167",
    text: "This may be less destiny and more lunch.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0168",
    text: "The growling is not symbolic.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0169",
    text: "A banana could save several reputations today.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0170",
    text: "Your body is making a practical demand, not a speech.",
    primaryBucket: "hungry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0171",
    text: "Your presence still matters, even on quiet days.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0172",
    text: "This feeling is loud, not always honest.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0173",
    text: "You are not forgotten because today feels empty.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0174",
    text: "A small connection may arrive more gently than expected.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0175",
    text: "Being alone today is not proof you are unwanted.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0176",
    text: "Even quiet days leave your shape in the world.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0177",
    text: "Your place here is bigger than this mood admits.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0178",
    text: "One small reach may meet surprising warmth.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0179",
    text: "You still belong more than this feeling admits.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0180",
    text: "Stillness is not proof that no one cares.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0181",
    text: "Your tenderness still reaches farther than you think.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0182",
    text: "Soft kinds of connection still count.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0183",
    text: "You do not vanish when the room goes quiet.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0184",
    text: "Company may find you somewhere ordinary.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0185",
    text: "Wanting closeness is part of being human.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0186",
    text: "Even now, your life touches more than you know.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0187",
    text: "This feeling is real, but not the whole truth.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0188",
    text: "A small kindness could mean extra much today.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0189",
    text: "You still have a place in what comes next.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0190",
    text: "Distance can soften with a simple hello.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0191",
    text: "The world still has a place for you.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0192",
    text: "Your own company can still be good company.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0193",
    text: "Someone may be kinder than your mood predicts.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0194",
    text: "Not everyone caring is making noise about it.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0195",
    text: "This ache is real; its conclusions may not be.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0196",
    text: "The world is often warmer than first impressions.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0197",
    text: "You may be one small moment from feeling less alone.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0198",
    text: "A bit of warmth may be closer than it appears.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0199",
    text: "Even a passing kindness can change the weather.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0200",
    text: "This ache can shrink after one decent conversation.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0201",
    text: "Heavy feelings shrink a little in decent company.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0202",
    text: "Low today? A friend - or your cat - may lift your mood.",
    primaryBucket: "lonely",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0203",
    text: "Your mood is making the day sparkle. Stay with it.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0204",
    text: "Let this good feeling belong to now, not just later.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0205",
    text: "Gratitude makes small things easier to notice and appreciate.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0206",
    text: "One fleeting bright moment can mean a lifetime of memories.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0207",
    text: "This feeling may know exactly what it needs. Listen to it.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0208",
    text: "Life is made of moments like this. Step back to appreciate.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0209",
    text: "A small yes today can move a mountain down the line.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0210",
    text: "The more you savor this, the more alive the day gets.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0211",
    text: "Your energy is smoothing things out in your favor.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0212",
    text: "This bright version of you is creating momentum.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0213",
    text: "Enjoying this moment is not a waste of it.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0214",
    text: "A good mood can make ordinary things worth keeping.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0215",
    text: "Some days are for solving; this one may be for savoring.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0216",
    text: "This brightness makes room for more life.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0217",
    text: "Today may reward your willingness to enjoy it.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0218",
    text: "A good mood can turn enough into plenty.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0219",
    text: "One bright minute can redeem a forgettable day.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0220",
    text: "Joy is sometimes just better access to the present.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0221",
    text: "This may be your nature getting interrupted less.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0222",
    text: "This state can be just your true self with better reception.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0223",
    text: "Your smile may be evidence that life is getting the hint.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0224",
    text: "A bright mood gives life better acoustics.",
    primaryBucket: "happy",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0225",
    text: "You did not borrow this feeling. You built it.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0226",
    text: "Self-respect wears very good posture.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0227",
    text: "Some victories are private and still enormous.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0228",
    text: "Earned satisfaction weighs better than luck.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0229",
    text: "You carried this farther than excuses would have.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0230",
    text: "Quiet triumph still counts as triumph.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0231",
    text: "This feeling has receipts.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0232",
    text: "You stood up where quitting had good arguments.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0233",
    text: "Stand a little taller. The evidence is in.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0234",
    text: "Your standards and your effort finally shook hands.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0235",
    text: "You have earned the right to nod at yourself.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0236",
    text: "Some wins arrive without confetti and still matter more.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0237",
    text: "Integrity ages well in the mirror.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0238",
    text: "This is what follow-through feels like from the inside.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0239",
    text: "A hard thing got done because you stayed in the room.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0240",
    text: "Pride is best when it can look itself in the eye.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0241",
    text: "You made ground and kept your name clean.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0242",
    text: "There is dignity in what you did not abandon.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0243",
    text: "You are looking at proof, not hype.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0244",
    text: "A standard was met. Enjoy the internal applause.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0245",
    text: "Some outcomes fit better because you grew into them.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0246",
    text: "Well done has a steadier pulse than good luck.",
    primaryBucket: "proud",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0247",
    text: "This feeling does not define your whole story.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0248",
    text: "A softer day may carry you through.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0249",
    text: "Let kindness reach you before expectations.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0250",
    text: "Something gentle is closer than it feels.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0251",
    text: "This heaviness may visit, but it does not own you.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0252",
    text: "You're allowed to need comfort first today.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0253",
    text: "What you feel deserves warmth, not criticism.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0254",
    text: "Heavy hearts still get decent sunsets.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0255",
    text: "This feeling is real; it is also a terrible narrator.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0256",
    text: "You do not need a comeback arc by tonight.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0257",
    text: "Not every dark day is a deep truth.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0258",
    text: "Tiny comforts can do serious work right now.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0259",
    text: "Getting through today still counts as progress.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0260",
    text: "Foggy days distort the view; wait before trusting it.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0261",
    text: "The clouds in you are not the whole sky.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0262",
    text: "Heavy feelings shrink a little in decent company.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0263",
    text: "Even today can still hold one beautiful moment.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0264",
    text: "A dim day is not a doomed day.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0265",
    text: "Heavy feelings can be sincere and still exaggerate.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0266",
    text: "Even a gray day can catch a few sun rays.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0267",
    text: "This feeling is eloquent, not necessarily correct.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0268",
    text: "Some days are better judged after sleep.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0269",
    text: "One small errand can be a tiny rebellion today.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0270",
    text: "A sad day may need less meaning and more kitten videos.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0271",
    text: "A walk with a dog can drag the soul into daylight.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0272",
    text: "A guitar can talk a mood down without using words.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0273",
    text: "Some moods improve after contact with dumbbells.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0274",
    text: "Cheer up your dog and borrow the results.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0275",
    text: "Low today? A friend - or your cat - may lift your mood.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0276",
    text: "A good song can sand down the edges of a hard day.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0277",
    text: "A good book can lower the volume on a bad mood.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0278",
    text: "Laughter can trick your body and mind into easing up.",
    primaryBucket: "sad",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0279",
    text: "Regret is better used as a compass than a weapon.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0280",
    text: "A conscience can guide without putting you on trial.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0281",
    text: "Remorse means your values still have a pulse.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0282",
    text: "Repair does more good than self-attack ever will.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0283",
    text: "Guilt is a message, not a permanent address.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0284",
    text: "You can face what happened without becoming the sentence.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0285",
    text: "A mistake is data, not your full biography.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0286",
    text: "Shame loves loops. Repair prefers motion.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0287",
    text: "If you owe something, begin there, not in the dungeon.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0288",
    text: "A good apology weighs less than endless replay.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0289",
    text: "Regret can point north without becoming the weather.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0290",
    text: "You are allowed to learn without staging a collapse.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0291",
    text: "The part of you that feels bad is not the enemy.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0292",
    text: "Accountability works better without theatrical lighting.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0293",
    text: "A conscience is a lantern, not a firing squad.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0294",
    text: "Repair what you can. Release what you cannot relive usefully.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0295",
    text: "Being sorry is useful when it opens the door forward.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0296",
    text: "A decent amend beats an immaculate guilt spiral.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0297",
    text: "Regret should sharpen you, not eat you.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0298",
    text: "You can hold responsibility without crushing the container.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0299",
    text: "Some lessons arrive wearing uncomfortable shoes.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0300",
    text: "Making it right usually starts smaller than punishment.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0301",
    text: "Your values are speaking. They do not need a whip.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0302",
    text: "Mercy and honesty can share a chair.",
    primaryBucket: "guilty",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0303",
    text: "Numb is not empty; it is the system on low power.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0304",
    text: "Even a muted soul can notice one warm thing.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0305",
    text: "Flat is still a feeling, just with the volume lowered.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0306",
    text: "Low signal days still count as being here.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0307",
    text: "Shutdown is not failure. It is expensive self-protection.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0308",
    text: "A dim day may only ask for one human-sized sensation.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0309",
    text: "Nothing may be loud right now, but something is still present.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0310",
    text: "The lights are low, not gone.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0311",
    text: "A numb day may prefer texture over meaning.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0312",
    text: "Borrow one small signal from the physical world.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0313",
    text: "Even low voltage can power a tiny lamp.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0314",
    text: "You do not have to force feeling to welcome its return.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0315",
    text: "Blankness can be a room, not a verdict.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0316",
    text: "Some systems come back online in whispers.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0317",
    text: "Today may be about contact, not catharsis.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0318",
    text: "Muted is not lifeless. It is quieter than that.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0319",
    text: "A low-signal day may trust softness over insight.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0320",
    text: "If nothing else, notice temperature and proceed from there.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0321",
    text: "Numbness often lifts by teaspoons, not thunderclaps.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0322",
    text: "The body may rejoin the conversation before the heart does.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0323",
    text: "Tiny evidence of aliveness is still evidence.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0324",
    text: "Do not confuse quiet with absence.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0325",
    text: "A flat day can still register one kind thing.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0326",
    text: "Return does not always announce itself dramatically.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0327",
    text: "Tiny comforts can do serious work right now.",
    primaryBucket: "numb",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0328",
    text: "This wave will pass more gently if you stop feeding it.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0329",
    text: "Not every feeling in your body is warning you of danger.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0330",
    text: "The future does not need this pain to unfold.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0331",
    text: "Trust yourself with what is real, not just what feels scary.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0332",
    text: "What feels urgent may later feel irrelevant.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0333",
    text: "You do not need to be fearless to be safe right now.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0334",
    text: "The capital F future does not need solving right this moment.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0335",
    text: "Reality is rarely as grim as your mind portrays it.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0336",
    text: "You are doing better than the stress is letting you believe.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0337",
    text: "A loud mind is not always a well-informed one.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0338",
    text: "Your body can feel scared even when you're actually okay.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0339",
    text: "This moment is about what's here, not what's imagined.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0340",
    text: "Your mind deserves a peaceful reality check.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0341",
    text: "You are safer than this feeling is making it seem.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0342",
    text: "Not every alarm in your body is an instruction.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0343",
    text: "You can pick up tomorrow; stop for today.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0344",
    text: "A bad thought is not the same as a true one.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0345",
    text: "This can feel vivid and still be wrong.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0346",
    text: "This feeling is persuasive, not necessarily accurate.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0347",
    text: "A feeling is not a forecast.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0348",
    text: "Your mind sometimes talks faster than reality.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0349",
    text: "What feels convincing is not always true.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0350",
    text: "The mind makes guesses and calls them truth.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0351",
    text: "Your mind can sound very certain without good evidence.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0352",
    text: "A frightening thought is still only a thought.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0353",
    text: "Your mind loves prediction; reality loves evidence.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0354",
    text: "Your mind is rehearsing disasters that may never make opening night.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0355",
    text: "Not every thought is a prophecy.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0356",
    text: "Sometimes peace enters quietly through the door called facts.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0357",
    text: "A pained mind is a gifted storyteller, not a reliable witness.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0358",
    text: "Your mind may be filling blanks with thunder again.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0359",
    text: "Sometimes the bravest thing is to let the facts stay boring.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0360",
    text: "Your mind sometimes writes fan fiction and calls it planning.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0361",
    text: "An unsettled mind packs for storms not on the map.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0362",
    text: "Your mind hears hoofbeats and drafts apocalypse.",
    primaryBucket: "anxious",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0363",
    text: "Pressure lies about what must be done first.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0364",
    text: "Not everything on your plate is dinner.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0365",
    text: "Bandwidth is finite, not a moral issue.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0366",
    text: "Some weight belongs on the floor, not your spine.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0367",
    text: "This pace is expensive in very human ways.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0368",
    text: "Compression makes everything feel falsely urgent.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0369",
    text: "A crowded mind is bad at honest scheduling.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0370",
    text: "Too much is a quantity, not a character flaw.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0371",
    text: "Pressure loves pretending it is all priority one.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0372",
    text: "Your capacity is a border, not a suggestion.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0373",
    text: "Some strain is just math refusing to flatter you.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0374",
    text: "The pile is real. So is triage.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0375",
    text: "A full plate is not a dare.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0376",
    text: "Overload makes every email sound louder.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0377",
    text: "You may need subtraction more than inspiration.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0378",
    text: "Being stretched thin is still being stretched.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0379",
    text: "Not all demands deserve equal seating.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0380",
    text: "A shorter list can be an act of intelligence.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0381",
    text: "Weight distorts scale. Start with the heaviest brick.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0382",
    text: "This is too much, not too little grit.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0383",
    text: "Your margin is part of the job, not a luxury.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0384",
    text: "Pressure is loud, but you are still the one in charge.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0385",
    text: "Stillness can reveal what pressure hides.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0386",
    text: "Calm gets more things right than rushing does.",
    primaryBucket: "stressed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0387",
    text: "Your nervous system is drumming on the table again.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0388",
    text: "Static is not guidance.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0389",
    text: "The engine is on, but nobody requested speed.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0390",
    text: "Your body is buffering in all caps.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0391",
    text: "This buzz needs less fuel, not more meaning.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0392",
    text: "Overcaffeinated is a genre, not a destiny.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0393",
    text: "Your circuits appear to be freelancing.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0394",
    text: "Too much voltage makes bad philosophers of us all.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0395",
    text: "The body is pinging. The threat may be fictional.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0396",
    text: "This much activation needs a dimmer switch.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0397",
    text: "You are not behind; you are over-revved.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0398",
    text: "The hum in you does not need a speech.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0399",
    text: "A buzzing body can mistake motion for necessity.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0400",
    text: "The static is loud, not especially wise.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0401",
    text: "Your thoughts may just be riding a sugar tornado.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0402",
    text: "Restlessness is energy with bad table manners.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0403",
    text: "The revving is real. The emergency may not be.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0404",
    text: "A pinging system narrates badly.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0405",
    text: "You do not need to match your own voltage.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0406",
    text: "The body loves a false start when overstimulated.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0407",
    text: "This feels urgent because your wiring brought a megaphone.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0408",
    text: "Too much activation makes everything look clickable.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0409",
    text: "A loud mind is not always a well-informed one.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0410",
    text: "Your mind sometimes talks faster than reality.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0411",
    text: "This feeling is persuasive, not necessarily accurate.",
    primaryBucket: "wired",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0412",
    text: "That small yes in you may be wiser than your doubt.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0413",
    text: "Something promising may be arriving quietly.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0414",
    text: "A better chapter may be closer than it looks.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0415",
    text: "Your outlook may be noticing something real.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0416",
    text: "Something in you hears openings before proof arrives.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0417",
    text: "The good thing may be closer than caution thinks.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0418",
    text: "The next turn may feel more open than expected.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0419",
    text: "Something may be shifting, and your intuition sensed it.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0420",
    text: "Thinking this way is not naive; it may be observant.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0421",
    text: "Stay open; the day may meet you halfway.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0422",
    text: "Trust that small pull; it may know something.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0423",
    text: "Something good may be forming out of sight.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0424",
    text: "A better stretch may begin with very little warning.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0425",
    text: "Possibility may be doing more work than you can see.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0426",
    text: "Sometimes hope is just accurate patience.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0427",
    text: "You may be closer to change than it feels.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0428",
    text: "A good turn may arrive before your doubt is ready.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0429",
    text: "A small bright thought can change the whole horizon.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0430",
    text: "Optimism can be realism with foresight.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0431",
    text: "A positive mind can spot doors doubt walks past.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0432",
    text: "Sometimes progress first appears as less resistance.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0433",
    text: "Something in you hears hinges before doors appear.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0434",
    text: "Optimism is not naive; it is early.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0435",
    text: "Hope sees scaffolding where doubt sees rubble.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0436",
    text: "A small yes can have remarkable staying power.",
    primaryBucket: "hopeful",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0437",
    text: "Strong feelings are human. Harm is still a choice.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0438",
    text: "Ask what this feeling is protecting before reacting.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0439",
    text: "Keep your composure; don't give it to what upset you.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0440",
    text: "Guard your calm; don't surrender it to the trigger.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0441",
    text: "Save your energy for what truly needs your response.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0442",
    text: "What hurt you matters. Respond without losing yourself.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0443",
    text: "Wait for the fire to cool before choosing your move.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0444",
    text: "A clear boundary will serve you better than drama.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0445",
    text: "Protect your peace, then choose your next step.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0446",
    text: "Don't spend all your power in one hot moment.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0447",
    text: "Let the heat cool enough for wisdom to catch up.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0448",
    text: "Heat can become clarity if handled with care.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0449",
    text: "Choose the response you can respect tomorrow.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0450",
    text: "Your power grows when it becomes deliberate.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0451",
    text: "You don't need to explode to be understood.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0452",
    text: "Let your standards speak louder than your temper.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0453",
    text: "There is a question under this. Do not rush the answer.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0454",
    text: "Something in you says a line got crossed.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0455",
    text: "Holding this too long may cost you most.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0456",
    text: "A firm boundary says more than raised volume.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0457",
    text: "Refusing to give others power over our feelings is a win.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0458",
    text: "Self-respect often looks quieter than rage.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0459",
    text: "Intensity is not the same thing as direction.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0460",
    text: "Something in you is saying this matters. Don't rush it.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0461",
    text: "This can be a map with the polite labels burned off.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0462",
    text: "Some feelings are self-respect refusing to sit down.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0463",
    text: "If you delay a reaction, you may thank yourself later.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0464",
    text: "Some emotions spend energy like it grows back overnight.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0465",
    text: "This mood kicks doors open, then forgets why.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0466",
    text: "A hot mind files reckless paperwork.",
    primaryBucket: "angry",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0467",
    text: "Some days are just paperwork filed by resistance.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0468",
    text: "Jammed gears are not a character flaw.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0469",
    text: "This should not be this hard, and yet here we are.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0470",
    text: "Friction is real. So is persistence with snacks.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0471",
    text: "A stuck thing is not the same as a broken thing.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0472",
    text: "Today appears to be sponsored by minor obstacles.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0473",
    text: "Progress may be late, not canceled.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0474",
    text: "The gears are grinding, not judging you.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0475",
    text: "Resistance loves drama. Do not co-sign it.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0476",
    text: "Annoyance is often effort meeting bad architecture.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0477",
    text: "A stubborn problem is not a referendum on your talent.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0478",
    text: "This jam may need a smaller wrench, not a bigger mood.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0479",
    text: "Some days require less force and better leverage.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0480",
    text: "You are allowed to resent the needless extra steps.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0481",
    text: "The bottleneck is real. It is also temporary.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0482",
    text: "A blocked path is still a path, just with opinions.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0483",
    text: "This delay has the charm of wet socks.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0484",
    text: "When everything sticks, reduce the surface area.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0485",
    text: "A jammed door is not asking for a shoulder tackle.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0486",
    text: "Being thwarted is exhausting, not enlightening.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0487",
    text: "Try a smaller move. Stuck things respect increments.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0488",
    text: "This problem may be difficult, not personal.",
    primaryBucket: "frustrated",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0489",
    text: "Envy is sometimes desire wearing bad manners.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0490",
    text: "Someone else’s shine is not proof of your dimness.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0491",
    text: "Jealousy points. It should not get to steer.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0492",
    text: "Comparison is a thief with excellent lighting.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0493",
    text: "Another person’s glow is not your power outage.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0494",
    text: "Wanting can be useful once it stops staring sideways.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0495",
    text: "Envy may be naming what you miss, badly.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0496",
    text: "Possessiveness makes small rooms out of large lives.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0497",
    text: "Someone else having it does not ban you from it.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0498",
    text: "Borrowed fixation is still expensive attention.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0499",
    text: "Jealousy often confuses distance with destiny.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0500",
    text: "The other lane is never as simple as it looks.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0501",
    text: "What hooks you may also be teaching you.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0502",
    text: "Another life is not a verdict on yours.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0503",
    text: "Jealousy squints at abundance until it looks scarce.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0504",
    text: "Their sparkle is not an audit of your worth.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0505",
    text: "Wanting something is cleaner than resenting someone.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0506",
    text: "Envy gets calmer when it tells the truth.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0507",
    text: "If it stings, ask what it is pointing at.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0508",
    text: "Longing is useful. Obsession is just overtime.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0509",
    text: "Jealousy gets loud when desire lacks a name.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0510",
    text: "Not every ache needs a rival.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0511",
    text: "Your lane improves when your eyes come home.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0512",
    text: "Wanting more for yourself beats guarding someone else.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0513",
    text: "There is a question under this. Do not rush the answer.",
    primaryBucket: "jealous",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0514",
    text: "Your reaction is giving you useful information. Listen to it.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0515",
    text: "Your body often spots trouble before your mind explains it.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0516",
    text: "What feels wrong does not need to be rationalized.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0517",
    text: "Knowing what you don't like is a form of self-respect.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0518",
    text: "You do not owe enthusiasm to what feels fundamentally off.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0519",
    text: "Discomfort can be useful when it sharpens clarity.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0520",
    text: "Your taste is part of your wisdom. It is allowed to vote.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0521",
    text: "That strong 'no' you feel is telling you something.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0522",
    text: "Your aversion may be wisdom being loud.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0523",
    text: "A clear no can be a form of self-respect.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0524",
    text: "Not everything deserves a second look, let alone approval.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0525",
    text: "Revulsion can be discernment that has run out of patience.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0526",
    text: "Disgust is taste refusing to be polite.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0527",
    text: "Your no has excellent survival instincts.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0528",
    text: "'Not for you' is a complete sentence.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0529",
    text: "Bad vibes rarely improve with more exposure.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0530",
    text: "Disgust is clarity with better reflexes.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0531",
    text: "Your whole system just voted no without needing a meeting.",
    primaryBucket: "disgusted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0532",
    text: "Being puzzled is okay; it means you're figuring things out.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0533",
    text: "The next useful thing may be simpler than you think.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0534",
    text: "Set down one impossible standard and see what clears.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0535",
    text: "Ask only for the next step, not the whole answer.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0536",
    text: "Your mind may be tangled; your next move can be simple.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0537",
    text: "The map is blurry; you only need the next step.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0538",
    text: "Not knowing is uncomfortable, not catastrophic.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0539",
    text: "Perfect clarity is like perfect pitch: lovely, not necessary.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0540",
    text: "Not knowing everything is not the same as knowing nothing.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0541",
    text: "Keep moving gently; the picture will sharpen.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0542",
    text: "Clarity usually shows up after you start.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0543",
    text: "You can begin before everything makes sense.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0544",
    text: "You are allowed to figure this out as you go.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0545",
    text: "A tangled mind can still make one decent choice.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0546",
    text: "The next step does not need the whole map.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0547",
    text: "You may need less clarity than you think.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0548",
    text: "Directionally right is better than precisely wrong.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0549",
    text: "Some clarity comes only after contact with real life.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0550",
    text: "A decent next step beats a perfect theory.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0551",
    text: "Your instincts may take you farther than overthinking.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0552",
    text: "Perfect clarity is not required; decent instincts will do.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0553",
    text: "This may be the hallway before the right room.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0554",
    text: "Clarity sometimes arrives in pieces.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0555",
    text: "Confusion is clarity before its coffee.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0556",
    text: "This place is your mind refusing a fake neat answer.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0557",
    text: "A messy signal may still contain a true direction.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0558",
    text: "Right answers arrive only after the wrong ones get tired.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0559",
    text: "You may not be lost; you may be between explanations.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0560",
    text: "The meaning may be late, not absent.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0561",
    text: "When nothing makes sense, try following what makes less nonsense.",
    primaryBucket: "confused",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0562",
    text: "Being a person in public is advanced material.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0563",
    text: "Cringe is often self-awareness with sharper elbows.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0564",
    text: "Awkward is not fatal. Just badly timed humanity.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0565",
    text: "Social gravity gets weird around everyone eventually.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0566",
    text: "A fumble is not a prophecy.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0567",
    text: "Some moments fit like borrowed shoes.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0568",
    text: "Bad timing is not a felony.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0569",
    text: "Most people are too busy surviving themselves to keep score.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0570",
    text: "A little social static is still excellent attendance.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0571",
    text: "Grace often arrives after the replay ends.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0572",
    text: "Embarrassment loves a close-up no one else requested.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0573",
    text: "You can be sincere and slightly weird at once.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0574",
    text: "A clumsy moment is not a character witness.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0575",
    text: "Self-consciousness is loud, not omniscient.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0576",
    text: "Every room contains at least one invisible blooper reel.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0577",
    text: "Awkwardness is just choreography under construction.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0578",
    text: "Being socially off is still being fully human.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0579",
    text: "Not every stumble deserves memorial architecture.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0580",
    text: "You survived the moment. The legend can retire now.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0581",
    text: "People recover from stranger things than one odd sentence.",
    primaryBucket: "embarrassed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0582",
    text: "Your attention has twelve browser tabs and no supervisor.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0583",
    text: "Not every thought needs a speaking role.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0584",
    text: "A scattered day may need one anchor, not a lecture.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0585",
    text: "Attention drift is real; it is not a moral drama.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0586",
    text: "Your focus appears to be freelance today.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0587",
    text: "A wandering mind may need a smaller landing strip.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0588",
    text: "Scattered is a state, not a failure review.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0589",
    text: "One useful target beats six decorative intentions.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0590",
    text: "Your attention keeps changing seats mid-show.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0591",
    text: "The day may improve if one thing gets the microphone.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0592",
    text: "Partial attention is expensive in quiet ways.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0593",
    text: "A drifting day likes simpler furniture.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0594",
    text: "One small anchor can outvote a lot of static.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0595",
    text: "Mental pinball is still pinball, not destiny.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0596",
    text: "The next right focus may be embarrassingly small.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0597",
    text: "Too many signals make mediocre bosses.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0598",
    text: "A scattered hour may only need one honest task.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0599",
    text: "Your concentration is not gone; it is being overbooked.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0600",
    text: "The wandering is understandable. Try a shorter runway.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0601",
    text: "Refocus is usually a narrowing, not a speech.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0602",
    text: "A single thread can rescue a tangled afternoon.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0603",
    text: "Attention likes a smaller room when it gets skittish.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0604",
    text: "The point is not perfect focus. It is one true thing.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0605",
    text: "Today may need less ambition and one visible next step.",
    primaryBucket: "distracted",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0606",
    text: "The world just got bigger without moving an inch.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0607",
    text: "Wonder looks good on a nervous system.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0608",
    text: "Some moments arrive wearing extra sky.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0609",
    text: "Awe is what happens when reality overachieves.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0610",
    text: "Life just showed off a little.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0611",
    text: "Some beauty is almost rude in its confidence.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0612",
    text: "The ceiling on ordinary just moved.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0613",
    text: "Your jaw may know something your words do not.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0614",
    text: "Today has cathedral-scale lighting, minus the sermon.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0615",
    text: "The view just made your inner narrator sit down.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0616",
    text: "Some moments deserve a quieter kind of wow.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0617",
    text: "Reality appears to be showing its work.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0618",
    text: "Amazement is excellent posture for the soul.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0619",
    text: "Some details arrive with their own weather.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0620",
    text: "The world is being a little too interesting to ignore.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0621",
    text: "For a second there, everything had better acoustics.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0622",
    text: "Scale just entered the room without knocking.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0623",
    text: "Some sights make the brain clap softly.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0624",
    text: "You are allowed to be briefly outclassed by beauty.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0625",
    text: "The horizon is doing unnecessary but appreciated work.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0626",
    text: "Something vast just got personal.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0627",
    text: "Even your skepticism had to blink at that.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0628",
    text: "A good wow can recalibrate the whole afternoon.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0629",
    text: "Some moments make language feel slightly underfunded.",
    primaryBucket: "wowed",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0630",
    text: "The day just swerved. A seatbelt and an open mind will help.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0631",
    text: "Reality just changed the playlist. New track, same you.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0632",
    text: "Today upgraded itself without asking. Explore the features.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0633",
    text: "This was not on the menu. It may still be delicious.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0634",
    text: "Unexpected does not mean unwanted.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0635",
    text: "Life just improvised. Try not to boo.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0636",
    text: "The script changed mid-scene. Keep rolling.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0637",
    text: "A sharp turn can still head somewhere good.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0638",
    text: "A plot twist can still be a favor in costume.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0639",
    text: "This detour may know a shortcut you do not.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0640",
    text: "Not every curveball is thrown to ruin your inning.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0641",
    text: "The sudden thing may be friendlier than its timing.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0642",
    text: "A quick swerve can miss a very boring road.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0643",
    text: "The wrong turn may have better scenery.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0644",
    text: "Some changes enter like chaos and stay like progress.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0645",
    text: "Sometimes a stumble sends you into a flower meadow.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0646",
    text: "A perfectly predictable year would need resuscitation.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0647",
    text: "If life came with spoilers, people would complain.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0648",
    text: "Surprises, like whisky, taste better when you let them breathe.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0649",
    text: "The unexpected can have surprisingly good manners.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0650",
    text: "Some interruptions arrive carrying upgrades.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0651",
    text: "The unplanned note may improve the whole melody.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0652",
    text: "A break in pattern can lead to an epiphany.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0653",
    text: "What arrived sideways may still land beautifully.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0654",
    text: "Not every jolt is a warning. Some are invitations.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0655",
    text: "Not every accident is a setback. Ask penicillin.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0656",
    text: "The odd gust may be what lifts the kite.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0657",
    text: "Reality occasionally likes to freestyle. Catch the beat.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0658",
    text: "The unexpected keeps the world from becoming office carpet.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0659",
    text: "If you are always on autopilot, you'll forget how to drive.",
    primaryBucket: "shaken",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0660",
    text: "Something unusual is moving in your favor.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0661",
    text: "A strange current may know the way.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0662",
    text: "What feels distant may already be arriving.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0663",
    text: "Something quiet beneath the surface is turning.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0664",
    text: "Not everything needs daylight to be real.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0665",
    text: "Trust what lingers at the edge of things.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0666",
    text: "A little mystery may be telling the truth.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0667",
    text: "What resists force may open to patience.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0668",
    text: "Some tides reveal themselves only in time.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0669",
    text: "Your inner weather may be changing for a reason.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0670",
    text: "What seems elusive may already be unfolding.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0671",
    text: "Something subtle may already be turning your way.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0672",
    text: "A hidden pull may be guiding you true.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0673",
    text: "A disguised door may soon reveal itself.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0674",
    text: "Some truths arrive as a feeling first.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0675",
    text: "Let the strange feeling keep its magic.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0676",
    text: "What seems cloudy may be quietly clearing.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0677",
    text: "A mysterious day may be building something real.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0678",
    text: "The pull is real, even when the message hides.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0679",
    text: "Let events ripen before reading the signs.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0680",
    text: "Something in the air is not accidental.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  },
  {
    id: "f_0681",
    text: "The omens favor a gentler reading.",
    primaryBucket: "weird",
    alsoFits: [],
    scope: "specific",
    active: true
  }
];

export { FORTUNES, FORTUNE_BUCKET_KEYS };
