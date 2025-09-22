import { Brain, Code2, Lightbulb } from "lucide-react";

const FeatureHighLights = () => {
  return (
    <div className="grid grid-cols-3 gap-4 pt-6 border-gray-200">
      <div className="text-center">
        <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
          <Code2 className="size-4 text-blue-600" />
        </div>
        <p className="text-xs text-gray-600">Code Analysis</p>
      </div>
      <div className="text-center">
        <div className="w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
          <Brain className="size-4 text-purple-600" />
        </div>
        <p className="text-xs text-gray-600">Smart Insights</p>
      </div>
      <div className="text-center">
        <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
          <Lightbulb className="size-4 text-green-600" />
        </div>
        <p className="text-xs text-gray-600">Best Practices</p>
      </div>
    </div>
  );
};

export default FeatureHighLights;
