export default function getCountByOption(cards, optionList, key) {
  const count = {};
  optionList.forEach((opt) => {
    count[opt.value] = 0;
  });
  cards.forEach((card) => {
    const val = card[key];
    if (val) {
      const valKey = key === "grade" ? val.toUpperCase() : val;
      if (count.hasOwnProperty(valKey)) count[valKey]++;
    }
  });
  return count;
}
