interface StatisticsPageProps {
    params: {
        quizzyId: string; 
    }
}

export default async function StatisticsPage({params}: StatisticsPageProps){
    const quizzyId = params.quizzyId;
    return (
        <div>{quizzyId }</div>
    )
}