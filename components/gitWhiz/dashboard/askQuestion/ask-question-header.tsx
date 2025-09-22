import { Loader2 } from "lucide-react";
import Image from "next/image";

interface AskQuestionHeaderProps {
  loading: boolean;
}

const AskQuestionHeader = ({ loading }: AskQuestionHeaderProps) => {
  return (
    <>
      <div className="p-2 bg-gradient-to-br from-secondary to-green-400 rounded-lg">
        <Image
          src="/binaryLogo.svg"
          alt="gitWhiz"
          width={24}
          height={24}
          className="invert"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold">GitWhiz AI Assistant</h3>
        <p className="text-sm text-gray-500 font-normal">
          Smart code analysis and recommendations
        </p>
      </div>

      {loading && (
        <div className="ml-auto flex items-center gap-2 text-green-900">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">Analyzing your code...</span>
        </div>
      )}
    </>
  );
};

export default AskQuestionHeader;
