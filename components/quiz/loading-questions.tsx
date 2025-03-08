import Image from 'next/image'
import React from 'react'
import { Progress } from '../ui/progress'

interface LoadingQuestionsProps{
  finished: boolean;
}

const loadingTexts = [
  "Summoning the wisdom of the cosmos...",
  "Gathering questions from the digital oracle...",
  "Consulting the Gemini archives for your quiz...",
  "Fetching mind-bending queries just for you...",
  "Unraveling the mysteries of knowledge...",
  "Bringing questions from the depths of AI...",
  "Assembling brain teasers from the stars...",
  "Deciphering the enigma of curiosity...",
  "Crafting the perfect challenge...",
  "Loading... because great questions take time!",
  "Channeling the knowledge of ancient sages...",
  "Generating questions at the speed of thought...",
  "Fetching fresh quiz fuel for your brain...",
  "Weaving words into quiz-worthy riddles...",
  "Preparing a cerebral workout...",
  "Cooking up some tricky questions...",
  "Downloading brain boosters...",
  "Fetching some AI-crafted brain ticklers...",
  "Bringing you the best of Gemini’s quiz vault...",
  "Scouting the knowledge universe for challenges..."
];


const LoadingQuestions = ({finished}: LoadingQuestionsProps) => {
  const [progress, setProgress] = React.useState<number>(0);
  const [loadingText, setLoadingText] = React.useState<string>(loadingTexts[0]); 

  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000)

    return () => clearInterval(interval);
  }, [])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev >= 100) return 0;
        
        // Simulate slower progress at certain points
        if (prev > 85) return prev + 0.1;
        if (prev > 70) return prev + 0.3;
        if (prev > 40) return prev + 0.7;
        
        // Faster at the beginning
        return prev + Math.random() * 1.2;
      })
    }, 50)

    return () => clearInterval(interval);
  }, [finished])
  return (
    <div className='flex flex-col items-center w-[70vw] md:w-[60vw]'>
        <Image 
            src={`/loading.gif`}
            width={400}
            height={400}
            alt='loading animation'
            className='rounded-2xl'
        />
        <Progress 
          value={progress}
          className='w-full mt-4'
          />
        <h1 className='mt-2 text-xl'>{loadingText}</h1>
    </div>
  )
} 

export default LoadingQuestions