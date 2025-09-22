"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

interface codeReferencesProps {
  fileReferences: {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];
}

const CodeReferences = ({ fileReferences }: codeReferencesProps) => {
  const [tab, setTab] = React.useState(fileReferences[0]?.fileName || "");

  if (fileReferences.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="overflow-x-auto scrollbar-hide flex gap-2 bg-gray-200 rounded-md w-full justify-start">
          {fileReferences.map((file) => (
            <TabsTrigger
              key={file.fileName}
              value={file.fileName}
              className="whitespace-nowrap"
            >
              {file.fileName}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {fileReferences.map((file) => (
            <TabsContent
              key={file.fileName}
              value={file.fileName}
              className="max-w-full rounded-md mt-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin"
            >
              <div className="border rounded-md overflow-hidden">
                <SyntaxHighlighter
                  language="typescript"
                  style={lucario}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "14px",
                  }}
                  showLineNumbers={true}
                >
                  {file.sourceCode}
                </SyntaxHighlighter>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default CodeReferences;
