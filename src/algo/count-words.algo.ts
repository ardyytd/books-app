function countWords(input: string[], query: string[]) {
  const wordCount = {};

  for (const word of input) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }

  const output: number[] = [];
  for (const word of query) {
    output.push(wordCount[word] || 0);
  }

  return output;
}

it('countWords', () => {
  const input = ['xc', 'dz', 'bbb', 'dz'];
  const query = ['bbb', 'ac', 'dz'];

  expect(countWords(input, query)).toEqual([1, 0, 2]);
});
