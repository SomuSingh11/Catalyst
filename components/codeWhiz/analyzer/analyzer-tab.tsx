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
          {/* <SyntaxHighlighter
            language={
              file?.name?.endsWith(".tsx") || file?.name?.endsWith(".ts")
                ? "typescript"
                : file?.name?.endsWith(".jsx") || file?.name?.endsWith(".js")
                ? "javascript"
                : file?.name?.endsWith(".py")
                ? "python"
                : file?.name?.endsWith(".css")
                ? "css"
                : file?.name?.endsWith(".html")
                ? "html"
                : file?.name?.endsWith(".json")
                ? "json"
                : "text"
            }
            style={lucario}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "14px",
              height: "100%",
            }}
            showLineNumbers={true}
            wrapLines={true}
            lineProps={{
              style: { wordBreak: "break-word", whiteSpace: "pre-wrap" },
            }}
          >
            {file?.sourceCode ?? ""}
          </SyntaxHighlighter> */}

          <CodeBlock
            code={file?.sourceCode ?? ""}
            fileName={file?.name ?? ""}
          />
        </TabsContent>

        {/* Summary Panel */}
        <TabsContent value="summary" className="flex-1 h-full mt-2">
          <div className="bg-white border border-gray-200 rounded-lg h-full">
            <div className="overflow-y-auto bg-editor h-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <MDEditor.Markdown
                source={file?.summary || "Select a file to view its content."}
                data-color-mode="light"
                className="w-full h-full p-4 pb-0 rounded-lg"
              />
            </div>
          </div>
        </TabsContent>

        {/* AI Analysis Panel */}
        <TabsContent value="analysis" className="flex-1 min-h-0 mt-2">
          <div className="bg-white border border-gray-200 rounded-lg h-full">
            <p>AI Analysis incoming</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyzerTab;
