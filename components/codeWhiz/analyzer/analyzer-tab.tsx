import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, LetterText } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { FileNode } from "@/types/gitWhiz";
import CodeBlock from "@/components/utilities/code-block";
interface AnalyzerTabProps {
  file: FileNode | null;
}

function AnalyzerTab({ file }: AnalyzerTabProps) {
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="code" className="flex-1 h-full flex flex-col">
        <TabsList className="flex gap-2 bg-white pt-4 rounded-md w-full justify-center">
          <TabsTrigger value="code" className="bg-gray-200">
            <Code2 className="mr-2 size-4" /> Code
          </TabsTrigger>
          <TabsTrigger value="summary" className="bg-gray-200">
            <LetterText className="mr-2 size-4" /> Summary
          </TabsTrigger>
          <TabsTrigger value="analysis" className="bg-gray-200">
            <Code2 className="mr-2 size-4" /> AI Analysis
          </TabsTrigger>
        </TabsList>

        {/* Code Panel */}
        <TabsContent
          value="code"
          className="flex-1 min-h-0 overflow-y-auto scrollbar-thin mt-2 rounded-lg"
        >
          <CodeBlock
            code={file?.sourceCode ?? ""}
            fileName={file?.name ?? ""}
          />
        </TabsContent>

        {/* Summary Panel */}
        <TabsContent value="summary" className="flex-1 min-h-0 mt-2">
          <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-6">
            <div data-color-mode="light">
              <MDEditor.Markdown
                source={file?.summary || "Select a file to view its content."}
                className="w-full h-full"
              />
            </div>
          </div>
        </TabsContent>

        {/* AI Analysis Panel */}
        <TabsContent value="analysis" className="flex-1 min-h-0 mt-2">
          <div className="bg-white border overflow-y-auto border-gray-200 rounded-lg h-full">
            <p>AI Analysis incoming</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyzerTab;
