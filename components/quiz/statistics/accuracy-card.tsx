import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import React from 'react'

interface AccuracyCardProps {
    accuracy: number;
}

const AccuracyCard = ({accuracy} : AccuracyCardProps) => {
  return (
    <Card className="md:col-span-3 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-2xl font-bold'>Average Accuracy</CardTitle>
            <Target />
        </CardHeader>
        <CardContent className='text-sm font-medium'>
            {accuracy.toString().concat("%")}
        </CardContent>
    </Card>
  )
}

export default AccuracyCard