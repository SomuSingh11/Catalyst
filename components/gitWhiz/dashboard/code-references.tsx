"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CodeBlock from "@/components/utilities/code-block";

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
        <TabsList className="flex-shrink-0 overflow-x-auto gap-2 bg-gray-200 h-12 scrollbar-thin rounded-md w-full justify-center">
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

        {fileReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-w-full h-full pt-2 flex-1 min-h-0"
          >
            <div className="border flex-1 h-full">
              <CodeBlock code={file.sourceCode} fileName={file.fileName} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReferences;
