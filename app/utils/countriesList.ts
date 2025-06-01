export function getFlagEmoji(location: string) {
  const cleanLocation = location.trim().toLocaleLowerCase();

  const country = countryList.find((country) =>
    cleanLocation.includes(country.name.toLocaleLowerCase())
  );

  return country?.flagEmoji || "";
}

export const countryList = [
  { name: "Decatur", flagEmoji: "🏙️" },
  { name: "Springfield", flagEmoji: "🏛️" },
  { name: "Champaign", flagEmoji: "🎓" },
  { name: "Bloomington", flagEmoji: "🏢" },
  { name: "Normal", flagEmoji: "🏘️" },
  { name: "Peoria", flagEmoji: "🚢" },
  { name: "Danville", flagEmoji: "🏞️" },
  { name: "Mattoon", flagEmoji: "🚂" },
  { name: "Effingham", flagEmoji: "🛣️" },
  { name: "Taylorville", flagEmoji: "🌾" },
  { name: "Lincoln", flagEmoji: "🎩" },
  { name: "Jacksonville", flagEmoji: "🏡" },
  { name: "Paris", flagEmoji: "🗼" },
  { name: "Pontiac", flagEmoji: "🚗" },
  { name: "Charleston", flagEmoji: "📚" },
  { name: "Clinton", flagEmoji: "🏯" },
  { name: "Monticello", flagEmoji: "🌳" },
  { name: "Pana", flagEmoji: "🌻" },
  { name: "Sullivan", flagEmoji: "🏞️" },
  { name: "Tuscola", flagEmoji: "🛍️" },
];