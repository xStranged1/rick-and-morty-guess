import { useEffect, useState } from 'react'
import './App.css'
import axios, { AxiosResponse } from 'axios';
import { Character } from './types';
import { ImgCharacterProps, Difficult } from './types';
import { Skeleton } from "@/components/ui/skeleton"
function App() {

  const [startGame, setStartGame] = useState(false);
  const [restart, setRestart] = useState(false);
  const [options, setOptions] = useState()
  
  const [win, setWin] = useState(false);
  const [lives, setLives] = useState(3);
  const [indexActualCharacter, setIndexActualCharacter] = useState(0);
  const [characters, setCharacters] = useState<Character[]>();
  const [actualCharacter, setActualCharacter] = useState<Character>();
  const [difficult, setDifficult] = useState<Difficult>('medium');
  const canUseApi = true;
  const countCharacters = 826;
  const countNeededCharacters = 3;
  const countOptions = 4;
  const URL_CHARACTERS = "https://rickandmortyapi.com/api/character/";

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
          setIndexActualCharacter(0)
          setActualCharacter(character)
      })

    }
      return () => {
        console.log('call');
        
        const randonNumbers = getRandomNumbers(countCharacters, countNeededCharacters);
        if (canUseApi) getRandomsCharacters(randonNumbers)
        
      };
  }, [restart])


  const handleGuess = () => {
    if(indexActualCharacter+1 == countNeededCharacters){
      setWin(true)
      setStartGame(false)
      setIndexActualCharacter(indexActualCharacter+1)
      return
    }
    setActualCharacter(characters ? characters[indexActualCharacter+1] : undefined)
    setIndexActualCharacter(indexActualCharacter+1)
  }
    
  const getRandomNumbers = (nMax: number, countNeeded: number): number[] => { //since 0 to nMax

    const setOfNumbers: Set<number> = new Set();

    while (setOfNumbers.size < countNeeded) {
      const randonNumber = Math.floor(Math.random() * nMax); // Genera un número aleatorio entre 0 y 800
      setOfNumbers.add(randonNumber);
    }
    const listOfNumbers: number[] = Array.from(setOfNumbers)
    return listOfNumbers;
  }

  
  const handleStart = () => {
    if(!startGame){
      setStartGame(true)
      return
    }

    //restart
    restart ? setRestart(false) : setRestart(true)
    setIndexActualCharacter(0)
    setCharacters(undefined)
    setActualCharacter(undefined)
  }

  const handleTryGuess = (guessTry: string) => {
    if(guessTry == actualCharacter?.name){
      handleGuess();
    }else{
      console.log('no adivino');
    }
  }


  const ImgCharacter: React.FC<ImgCharacterProps> = ({ url }) => {

    const [loadingImg, setLoadingImg] = useState(true);

    return(
      <div className='my-8'>
        {loadingImg && <Skeleton className="w-[250px] h-[250px] rounded-xl" /> }
        <img className={loadingImg ? 'hidden' : 'rounded-xl b'} onLoad={() => setLoadingImg(false)} src={url} />
      </div>
    )
  }

  const BtnGuess = ( {name} ) => {


    return(
      <div className='flex items-center justify-center'>
        <button className='rounded-lg h-[30px] text-white font-semibold flex p-2 px-4 items-center justify-center h-screen bg-slate-800 '>
          {name}
        </button>
      </div>
      
    )
  }

  const getOptions = async () => {


    let url = URL_CHARACTERS
    console.log("actualCharacter?.gender");
    console.log(actualCharacter?.gender);
    
    const urlGender = url+'?gender='+actualCharacter?.gender
    const res = await axios.get(urlGender)
    const data = res.data;
    const pages = data.info.pages
    const count = data.info.count
    const rndNumbers = getRandomNumbers(count, countOptions-1)
    

    let characters: Character[] = data.results
    
    let requests = []
    let pagesToGet: number[] = []
    let indexs: number[] = [];
    for (let i = 0; i < rndNumbers.length; i++) {
      const num = rndNumbers[i];
      const page = Math.floor(num/20)
      const index = num%20;
      indexs.push(index)
      console.log('page');
      console.log(page);
      console.log("index");
      console.log(index);
      if (pagesToGet.includes(page)) continue
      pagesToGet.push(page)
      url = urlGender+'&page='+page
      requests.push(axios.get(url))
    }
    const response = await axios.all(requests)
    const options = response.map((res, i) => res.data.results[indexs[i]].name)
    return options
  }



  const GuessOptions = async () => {

      if (difficult == 'medium'){
        const options = await getOptions()
        console.log("options");
        console.log(options);
        
      }
    
    
    return(
      <div>
          {(!options) && <p>cargando...</p>}
          {(options) && (options.map((option) => <BtnGuess name={option} />))}
      </div>
      
    )
  }
  const Score = () => {


    return(
      <div>
        <p>Score: {indexActualCharacter}/{countNeededCharacters} </p>
      </div>
    )
  }
  const SectionGuess = () => {
    console.log('renderSect');

    return(
      <div className='flex flex-col items-center justify-center' >
        <ImgCharacter url={actualCharacter?.image} />
        <h4>{actualCharacter?.name}</h4>
        <GuessOptions />
        <Score />
        
      </div>
    )
  }

  const YouWin = () => (
    <div>
      <h1>You win!</h1>
    </div>
  )

  const BtnStart = () => {
    let textBtnStart = "Start!"
    if (win){
      textBtnStart = "Restart"
    }
    
    if (!startGame) return(
        <button className='button-start' onClick={handleStart}>
          {textBtnStart}
        </button>
    )
  }
  
  return (
    <div className='container mx-auto flex flex-col items-center justify-center h-screen '>
      <div className='mt-5 px-5 p-5 bg-slate-300'>
        <h2>Guess  rick and morty characters</h2>
        {!canUseApi && <p>desactivado</p>}
        {(startGame && characters && !win) && <SectionGuess />} 
      </div>
      <div className='mt-8'>
        {win && <YouWin />}
        <BtnStart />
      </div>
      
    </div>
  )
}

export default App
