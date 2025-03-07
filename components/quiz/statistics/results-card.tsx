import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Trophy } from 'lucide-react'
import React from 'react'

interface ResultCardProps{
    accuracy: number
}

const ResultCard = ({accuracy}: ResultCardProps) => {
  return (
    <Card className="md:col-span-7 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7 border-b'>
            <CardTitle className='text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent'>Result</CardTitle>
            <Award className="h-8 w-8 text-gray-700" />
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center h-48 p-8'>
        {accuracy > 75 ? (
            <>
                <Trophy className='mb-4' stroke='gold' size={64} strokeWidth={1.5}/>
                <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl font-bold text-yellow-500'>Impressive!</span>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg font-medium text-yellow-600/80'>
                            {accuracy}% accuracy
                        </span>
                        <span className='px-2 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full'>
                            Expert Level
                        </span>
                    </div>
                </div>
            </>
        ) : (accuracy > 25) ? (
            <>
                <Trophy className='mb-4' stroke='#94a3b8' size={64} strokeWidth={1.5}/>
                <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl font-bold text-slate-500'>Good Job!</span>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg font-medium text-slate-600/80'>
                            {accuracy}% accuracy
                        </span>
                        <span className='px-2 py-1 text-sm font-medium bg-slate-100 text-slate-700 rounded-full'>
                            Intermediate
                        </span>
                    </div>
                </div>
            </>
        ) : ( 
            <>
                <Trophy className='mb-4' stroke='#b45309' size={64} strokeWidth={1.5}/>
                <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl font-bold text-amber-700'>Keep Going!</span>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg font-medium text-amber-600/80'>
                            {accuracy}% accuracy
                        </span>
                        <span className='px-2 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full'>
                            Learning
                        </span>
                    </div>
                </div>
            </>
        )}
        </CardContent>
    </Card>
  )
}

export default ResultCard