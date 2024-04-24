import { useEffect, useState } from 'react'
import './App.css'
import axios, { AxiosResponse } from 'axios';
import { ImgCharacterProps, Character, ObjRequest } from './types';
import { Skeleton } from "@/components/ui/skeleton"
function App() {

  const [firstGame, setFirstGame] = useState(true);
  const [startGame, setStartGame] = useState(false);
  const [restart, setRestart] = useState(false);
  
  const [finish, setFinish] = useState(false);
  //const [lives, setLives] = useState(3);
  const [countSuccess, setCountSuccess] = useState(0);
  const [indexActualCharacter, setIndexActualCharacter] = useState(0);
  const [characters, setCharacters] = useState<Character[]>();
  const [actualCharacter, setActualCharacter] = useState<Character>();
  //const [difficult, setDifficult] = useState<Difficult>('medium');
  const [skeleton, setSkeleton] = useState<number[]>();

  const canUseApi = true;
  const countCharacters = 826;
  const countNeededCharacters = 10;
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
        let skeleton = []
        for (let i = 0; i < countOptions; i++) {
          skeleton.push(i)
        }
        setSkeleton(skeleton)
        const randonNumbers = getRandomNumbers(countCharacters, countNeededCharacters);
        if (canUseApi) getRandomsCharacters(randonNumbers)
        
      };
  }, [restart])


  
  const getRandomNumbers = (nMax: number, countNeeded: number): number[] => { //since 0 to nMax

    const setOfNumbers: Set<number> = new Set();

    while (setOfNumbers.size < countNeeded) {
      const randonNumber = Math.floor(Math.random() * nMax); // Genera un número aleatorio entre 0 y 800
      setOfNumbers.add(randonNumber);
    }
    const listOfNumbers: number[] = Array.from(setOfNumbers)
    return listOfNumbers;
  }

  const handleSuccess = () => {

    setCountSuccess(countSuccess+1)
    
    if(indexActualCharacter+1 == countNeededCharacters){
      setFinish(true)
      setStartGame(false)
      setIndexActualCharacter(indexActualCharacter+1)
      return
    }
    setActualCharacter(characters ? characters[indexActualCharacter+1] : undefined)
    setIndexActualCharacter(indexActualCharacter+1)
  }
    
  const handleFail = () => {

    if(indexActualCharacter+1 == countNeededCharacters){
      setFinish(true)
      setStartGame(false)
      setIndexActualCharacter(indexActualCharacter+1)
      return
    }
    setActualCharacter(characters ? characters[indexActualCharacter+1] : undefined)
    setIndexActualCharacter(indexActualCharacter+1)
    
  }
  
  const setAllStatesDefault = () => {
    restart ? setRestart(false) : setRestart(true)
    setCountSuccess(0)
    setFirstGame(false)
    setFinish(false);
    setIndexActualCharacter(0)
    setCharacters(undefined)
    setActualCharacter(undefined)
    setStartGame(true)
  }
  
  const handleStart = () => {
    if(!startGame){
      setAllStatesDefault()
      return
    }
    
  }

  const handleTryGuess = (guessTry: string) => {
    if(guessTry == actualCharacter?.name){
      handleSuccess();
    }else{
      handleFail();
    }
  }


  const ImgCharacter: React.FC<ImgCharacterProps> = ({ url }) => {

    const [loadingImg, setLoadingImg] = useState(true);

    return(
      <div className='my-4'>
        {loadingImg && <Skeleton className="w-[300px] h-[300px] p-2 rounded-xl" /> }
        <img className={loadingImg ? 'hidden' : 'rounded-xl border-2 border-[#86c437]'} onLoad={() => setLoadingImg(false)} src={url} />
      </div>
    )
  }

  const BtnGuess: React.FC<{name: string}> = ({name}) => {

    let wonStyle = ''
    if (name == actualCharacter?.name){
      wonStyle = 'rounded-lg'
    }
    return(
      <div className='flex items-center justify-center mb-2'>
        <button className={`${wonStyle ? wonStyle : ''} min-h-9 w-72 rounded-lg text-black text-base font-semibold flex p-2 px-4 items-center justify-center bg-[#b3edf9]`}
          onClick={() => handleTryGuess(name)}
        >
          {name}
        </button>
      </div>
      
    )
  }

  
  const getPage = (info: { pages: number; prev: null; next: null; }) => {
    if (info.pages == 1) return 1
    if (info.prev == null) return 1
    if (info.next == null) return info.pages

    const next = new URL(info.next);
    const pageValue = next.searchParams.get('page')
    if (pageValue) return parseInt(pageValue)-1
  }


  const GuessOptions = () => {

    const [options, setOptions] = useState<string[]>()
    

    useEffect(() => {

      const getOptions = async () => {

        let url = URL_CHARACTERS
        
        const urlGender = url+'?gender='+actualCharacter?.gender
        const res = await axios.get(urlGender)
        const data = res.data;
        const count = data.info.count
        const rndNumbers = getRandomNumbers(count, countOptions-1)
        
        let requests: ObjRequest[] = []
        let pagesToGet: number[] = []
        for (let i = 0; i < rndNumbers.length; i++) {
          const num = rndNumbers[i];
          const page = Math.floor(num/20)+1
          const index = num%20;

          if (pagesToGet.includes(page)){
            for (let j = 0; j < requests.length; j++) {
              let req = requests[j];
              if (req.page == page){
                req.index.push(index)
                break
              }
            }
            continue
          }

          pagesToGet.push(page)
          url = urlGender+'&page='+page
          let objRequest: ObjRequest = {
            request: axios.get(url),
            page: page,
            index: [index]
          }
          requests.push(objRequest)
        }
        const allRequest = requests.map((req) => req.request)
        const responses = await axios.all(allRequest)
        
        let options: string[] = []
        let totalIndex: number = 0
        for (let i = 0; i < requests.length; i++) {
          const req = requests[i]
          const { index, page } = req
          totalIndex = totalIndex + index.length
          for (let j = 0; j < responses.length; j++) {
            const res = responses[j];
            const info = res.data.info
            const actualPage = getPage(info)
            
            if (actualPage == page){
              index.forEach(i => {
                let newOption = res.data.results[i].name
                if (newOption == actualCharacter?.name){
                  
                  newOption = res.data.results[i+1].name
                  if (newOption){
                    options.push(newOption)
                  }else{
                    options.push(res.data.results[i-1].name)
                  }
                }else{
                  options.push(res.data.results[i].name)
                }
                
              });
              break
            }
          }
        }
        
        const rndNum = Math.floor(Math.random()*3)
        let auxOption = options[rndNum]
        if (actualCharacter) options[rndNum] = actualCharacter.name
        options.push(auxOption)
        setOptions(options)
        options = []
      }
      
      getOptions()

    }, [])

    
    
    return(
      <div>
          {(!options) && (skeleton?.map((_, i) => (<Skeleton className='h-9 w-72 mb-2 rounded-lg' key={i} />)))}
          {(options) && (options.map((option) => <BtnGuess key={option} name={option} />))}
      </div>
      
    )
  }
  const Score = () => {


    return(
      <div>
        <p className='text-white font-semibold'>Score: {countSuccess}/{countNeededCharacters} </p>
      </div>
    )
  }
  const SectionGuess = () => {
    console.log('renderSect');

    return(
      <div className='flex flex-col items-center justify-center' >
        <ImgCharacter url={actualCharacter?.image} />
        <GuessOptions />
        <Score />
      </div>
    )
  }
  const getText = (average: number) => {
    if (average == 1) return 'Am I Evil? Worst You are Smart 🤓';
    if (average >= 0.9) return 'You are insane! What dimension did you come from? 🌌🌌🌌';
    if (average >= 0.8) return 'WUBBA LUBBA DUB DUB! 💪' ;
    if (average >= 0.7) return 'Good effort! You\'re getting closer like Morty navigating through interdimensional adventures! 🎉';
    if (average >= 0.6) return 'You\'re doing okay, but there\'s room for improvement like Birdperson recovering from battles. 🐦';
    if (average >= 0.5) return 'You\'re halfway there! Keep pushing like Squanchy in a party! 😺';
    if (average >= 0.4) return 'You\'re making some progress, but there\'s more work to do like Mr. Meeseeks fulfilling requests. 📚';
    if (average >= 0.3) return 'Keep going! You\'re making progress like Jerry trying to figure things out! 🚀';
    if (average >= 0.2) return 'You\'re making an effort, but there\'s still a long way to go like Morty trying to survive adventures. 🚶‍♂️';
    if (average >= 0.1) return 'You\'re as dumb as I am smart  - Rick ';
    if (average == 0) return 'You\'ll get there! Keep trying like Rick never giving up! 💪';
  }
  

  const Result = () => {
    const average = countSuccess/countNeededCharacters
    let text = getText(average)
    
    return(
      <div className='flex flex-col items-center justify-center'>
        <h1>Final score</h1>
        <div>
          <h2>{countSuccess}/{countNeededCharacters}</h2>
        </div>
        <div className='mt-6 mb-4'>
          <p className='font-semibold'>{text}</p>
        </div>
      </div>
    )
  } 

  const BtnStart = () => {

    let textBtnStart = "Start!"
    
    if (finish){
      textBtnStart = "Restart"
    }
    if(firstGame){
      textBtnStart = "Start!"
    }
    
    if (!startGame) return(
        <button className='button-start text-[#213547]' onClick={handleStart}>
          {textBtnStart}
        </button>
    )
  }
  
  return (
    <div className='container mx-auto flex flex-col items-center justify-center h-screen '>
      {!finish &&(
        <div className='mt-2 mb-2 px-5 p-5 bg-[#252c38] rounded'>
        <h2 className='text-white font-semibold'>Guess Rick and Morty characters</h2>
        {!canUseApi && <p>desactivado</p>}
        {(startGame && characters && !finish) && <SectionGuess />} 
        </div>
      )}
      <div className='mt-4 flex flex-col items-center justify-center'>
        {finish && <Result />}
        <BtnStart />
      </div>
      
    </div>
  )
}

export default App
