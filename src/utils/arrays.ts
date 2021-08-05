/* eslint-disable import/prefer-default-export */

export const chunk = <T>(array: T[], chunkSize: number): Array<typeof array> => {
  const tempArray: Array<typeof array> = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    tempArray.push(array.slice(i, i + chunkSize));
  }

  return tempArray;
};
