function reverseAlphabet(str: string): string {
  let numberStr = '';

  let reverseStr = '';

  for (let i = str.length - 1; i >= 0; i--) {
    if (parseInt(str[i])) {
      numberStr = str[i] + numberStr;

      continue;
    }

    reverseStr += str[i];
  }

  return reverseStr + numberStr;
}

it('reverseAlphabet', () => {
  expect(reverseAlphabet('NEGIE1')).toBe('EIGEN1');
});
