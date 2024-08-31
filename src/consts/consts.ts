export const getText = (average: number) => {
    if (average == 1) return 'Am I Evil? Worst You are Smart 🤓';
    if (average >= 0.9) return 'You are insane! What dimension did you come from? 🌌🌌🌌';
    if (average >= 0.8) return 'WUBBA LUBBA DUB DUB! 💪';
    if (average >= 0.7) return 'Good effort! You\'re getting closer like Morty navigating through interdimensional adventures! 🎉';
    if (average >= 0.6) return 'You\'re doing okay, but there\'s room for improvement like Birdperson recovering from battles. 🐦';
    if (average >= 0.5) return 'You\'re halfway there! Keep pushing like Squanchy in a party! 😺';
    if (average >= 0.4) return 'You\'re making some progress, but there\'s more work to do like Mr. Meeseeks fulfilling requests. 📚';
    if (average >= 0.3) return 'Keep going! You\'re making progress like Jerry trying to figure things out! 🚀';
    if (average >= 0.2) return 'You\'re making an effort, but there\'s still a long way to go like Morty trying to survive adventures. 🚶‍♂️';
    if (average >= 0.1) return 'You\'re as dumb as I am smart  - Rick ';
    if (average == 0) return 'You\'ll get there! Keep trying like Rick never giving up! 💪';
  }
export const URL_CHARACTERS = "https://rickandmortyapi.com/api/character/";