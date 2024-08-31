export const getRandomNumbers = (nMax: number, countNeeded: number): number[] => { //since 0 to nMax

    const setOfNumbers: Set<number> = new Set();

    while (setOfNumbers.size < countNeeded) {
      const randonNumber = Math.floor(Math.random() * nMax); // Genera un número aleatorio entre 0 y 800
      setOfNumbers.add(randonNumber);
    }
    const listOfNumbers: number[] = Array.from(setOfNumbers)
    return listOfNumbers;
  }

  