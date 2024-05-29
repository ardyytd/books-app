function calculateDiagonalMatrix(matrix: number[][]) {
  let diagonal1Sum = 0;
  let diagonal2Sum = 0;

  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    diagonal1Sum += matrix[i][i];
    diagonal2Sum += matrix[i][n - 1 - i];
  }

  return Math.abs(diagonal1Sum - diagonal2Sum);
}

it('calculateDiagonalMatrix', () => {
  // const matrix = [
  //   [1, 2, 3],
  //   [4, 5, 6],
  //   [9, 8, 9],
  // ];

  const matrix = [
    [1, 2, 0],
    [4, 5, 6],
    [7, 8, 9],
  ];

  expect(calculateDiagonalMatrix(matrix)).toBe(3);
});
