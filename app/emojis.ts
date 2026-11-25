export type Emoji = { symbol: string; name: string };

const pairs = [
  [{ symbol: "🐙", name: "Octopus" }, { symbol: "🐟", name: "Fish" }],
  [{ symbol: "🐱", name: "Cat" }, { symbol: "🐶", name: "Dog" }],
  [{ symbol: "🐸", name: "Frog" }, { symbol: "🪰", name: "Fly" }],
  [{ symbol: "🦊", name: "Fox" }, { symbol: "🐰", name: "Rabbit" }],
  [{ symbol: "☀️", name: "Sun" }, { symbol: "🌙", name: "Moon" }],
];

export const presets = {
  one: pairs.map(([first]) => first),
  two: pairs.map(([, second]) => second),
};

export const emojiLibrary: Emoji[] = [
  ...pairs.flat(),
  { symbol: "🐼", name: "Panda" },
  { symbol: "🐨", name: "Koala" },
  { symbol: "🦁", name: "Lion" },
  { symbol: "🐯", name: "Tiger" },
  { symbol: "🐵", name: "Monkey" },
  { symbol: "🦉", name: "Owl" },
  { symbol: "🐧", name: "Penguin" },
  { symbol: "🦆", name: "Duck" },
  { symbol: "🦋", name: "Butterfly" },
  { symbol: "🐝", name: "Bee" },
  { symbol: "🐢", name: "Turtle" },
  { symbol: "🦈", name: "Shark" },
  { symbol: "🦀", name: "Crab" },
  { symbol: "🐬", name: "Dolphin" },
  { symbol: "👻", name: "Ghost" },
  { symbol: "👽", name: "Alien" },
  { symbol: "🦄", name: "Unicorn" },
  { symbol: "🐉", name: "Dragon" },
  { symbol: "🌈", name: "Rainbow" },
  { symbol: "⭐", name: "Star" },
  { symbol: "🔥", name: "Fire" },
  { symbol: "❄️", name: "Snowflake" },
  { symbol: "🍓", name: "Strawberry" },
  { symbol: "🍉", name: "Watermelon" },
  { symbol: "🍕", name: "Pizza" },
  { symbol: "🍩", name: "Doughnut" },
  { symbol: "🏀", name: "Basketball" },
  { symbol: "⚽", name: "Soccer ball" },
  { symbol: "🎸", name: "Guitar" },
  { symbol: "🚀", name: "Rocket" },
  { symbol: "💎", name: "Gem" },
  { symbol: "🌻", name: "Sunflower" },
];
