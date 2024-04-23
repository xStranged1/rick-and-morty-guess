import { useEffect, useState } from 'react'
import './App.css'
import axios, { AxiosResponse } from 'axios';
import { Character } from './types';
function App() {

  const [startGame, setStartGame] = useState(false);
  const [canUseApi, setCanUseApi] = useState(true);
  const [characters, setCharacters] = useState<Character[]>();
  const [actualCharacter, setActualCharacter] = useState<Character>();
  
  const countCharacters = 826;
  const countNeededCharacters = 10;
  const URL_CHARACTERS = "https://rickandmortyapi.com/api/character/";
  useEffect(() =>{
  }, [])

  useEffect(() =>{

    const getRandomsCharacters = async (randomNumbers: number[]) => {
      let url = URL_CHARACTERS;
      randomNumbers.forEach((number) => {
        url = url+number+','
      })
      url = url.slice(0,-1)
      axios.get<Character[]>(url)
        .then((res: AxiosResponse<Character[]>) => {
          const characters = res.data
          const character = characters[0]

          setCharacters(characters)
          setActualCharacter(character)
      })

    }
      return () => {
        const randonNumbers = getRandomNumbers();
        if (canUseApi) getRandomsCharacters(randonNumbers)
        
      };
  }, [])



  const getRandomNumbers = (): number[] => {

    const setOfNumbers: Set<number> = new Set();

    while (setOfNumbers.size < countNeededCharacters) {
      const randonNumber = Math.floor(Math.random() * countCharacters); // Genera un número aleatorio entre 0 y 800
      setOfNumbers.add(randonNumber);
    }
    const listOfNumbers: number[] = Array.from(setOfNumbers)
    return listOfNumbers;
  }

  
  const handleStart = () => {
    setStartGame(true)
  }

  const ImgCharacter = () => {

    return(
      <img src='https://rickandmortyapi.com/api/character/avatar/97.jpeg' />
    )
  }

  return (
    <div className='container'>
      <h2>Guess rick and morty characters</h2>

      {(actualCharacter && startGame) && (
        <ImgCharacter />
      )}
      <button onClick={handleStart}>
        {!startGame ? 'Start!' : 'Continue'}
      </button>
    </div>
  )
}

export default App
