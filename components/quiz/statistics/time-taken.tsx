import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTimeDelta } from '@/lib/utils';
import { time } from 'console';
import { differenceInSeconds } from 'date-fns';
import { Hourglass } from 'lucide-react'
import React from 'react'

interface TimeTakenProps{
    timeEnded: Date;
    timeStarted: Date;
}

const TimeTakenCard = ({timeEnded, timeStarted} : TimeTakenProps) => {
  return (
    <Card className="md:col-span-4 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-2xl font-bold'>Time Taken</CardTitle>
            <Hourglass />
        </CardHeader>
        <CardContent>
            <div className='text-sm font-medium'>
                {formatTimeDelta(differenceInSeconds(timeEnded, timeStarted))}
            </div>
        </CardContent>
    </Card>
  )
}

export default TimeTakenCard  