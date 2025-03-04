import React from "react";
import keyword_extractor from "keyword-extractor";

interface BlankAnswerInputProps {
  answer: string;
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
}

const BLANKS = "_____";

export default function BlankAnswerInput({answer, setBlankAnswer} : BlankAnswerInputProps) {
    const keywords = React.useMemo(() => {
        const words = keyword_extractor.extract(answer, {
            language: "english",
            remove_digits: true,
            return_changed_case: false,
            remove_duplicates: false
        });

        const shuffled = words.sort(() => Math.random()-0.5);
        return shuffled.slice(0,2);
    }, [answer]);

    const answerWithBlanks = React.useMemo(()=>{
        const answerWithBlanks = keywords.reduce((acc, keyword) => {
            return acc.replace(keyword, BLANKS);
        }, answer);
        return answerWithBlanks;
    }, [keywords, answer]);

    React.useEffect(() => {
        setBlankAnswer(answerWithBlanks);
    }, [answerWithBlanks, setBlankAnswer]);
    return (
        <div className="flex flex-col w-full gap-4">
        <h1 className="text-xl font-semibold">
          {answerWithBlanks.split(BLANKS).map((part, index) => {
            return (
              <React.Fragment key={index}>
              {part}
              {index == answerWithBlanks.split(BLANKS).length - 1 ? null : 
                <input
                id="user-blank-input"
                className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none" 
             />
              }
              </ React.Fragment>
            )
          })}
        </h1>
    </div>
  );
}