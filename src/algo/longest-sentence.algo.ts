function longestSentence(sentence: string) {
  let longest = 0;
  let count = 0;

  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i] === ' ') {
      longest = Math.max(longest, count);
      count = 0;
    } else {
      count++;
    }
  }

  return longest;
}

it('longestSentence', () => {
  expect(longestSentence('Saya sangat senang mengerjakan soal algoritma')).toBe(
    11,
  );
});
