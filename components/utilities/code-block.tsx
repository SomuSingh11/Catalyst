import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ThemeName =
  | "vsDark"
  | "dracula"
  | "github"
  | "okaidia"
  | "palenight"
  | "shadesOfPurple"
  | "synthwave84"
  | "nightOwl"
  | "oceanicNext"
  | "oneDark"
  | "duotoneDark"
  | "duotoneLight"
  | "nightOwlLight"
  | "jettwaveLight"
  | "jettwaveDark";

const themeMap = {
  vsDark: themes.vsDark,
  dracula: themes.dracula,
  github: themes.github,
  okaidia: themes.okaidia,
  palenight: themes.palenight,
  shadesOfPurple: themes.shadesOfPurple,
  synthwave84: themes.synthwave84,
  nightOwl: themes.nightOwl,
  oceanicNext: themes.oceanicNext,
  oneDark: themes.oneDark,
  duotoneDark: themes.duotoneDark,
  duotoneLight: themes.duotoneLight,
  nightOwlLight: themes.nightOwlLight,
  jettwaveLight: themes.jettwaveLight,
  jettwaveDark: themes.jettwaveDark,
};

const themeDisplayNames = {
  vsDark: "VS Dark",
  dracula: "Dracula",
  github: "GitHub",
  okaidia: "Okaidia",
  palenight: "Palenight",
  shadesOfPurple: "Shades of Purple",
  synthwave84: "Synthwave '84",
  nightOwl: "Night Owl",
  oceanicNext: "Oceanic Next",
  oneDark: "One Dark",
  duotoneDark: "Duotone Dark",
  duotoneLight: "Duotone Light",
  nightOwlLight: "Night Owl Light",
  jettwaveLight: "Jettwave Light",
  jettwaveDark: "Jettwave Dark",
};

interface CodeBlockProps {
  code: string;
  fileName: string;
  theme?: ThemeName;
}

function CodeBlock({
  code,
  fileName,
  theme: initialTheme = "nightOwl",
}: CodeBlockProps) {
  const [theme, setTheme] = React.useState<ThemeName>(initialTheme);

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "tsx":
      case "ts":
        return "typescript";
      case "jsx":
      case "js":
        return "javascript";
      case "py":
        return "python";
      case "css":
        return "css";
      case "html":
      case "htm":
        return "markup"; // Prism uses "markup" for HTML
      case "json":
        return "json";
      case "md":
      case "markdown":
        return "markdown";
      case "yaml":
      case "yml":
        return "yaml";
      case "xml":
        return "xml";
      case "sql":
        return "sql";
      case "sh":
      case "bash":
        return "bash";
      default:
        return "text";
    }
  };

  const language = getLanguageFromFileName(fileName);
  const selectedTheme = themeMap[theme];

  return (
    <div className="h-full flex flex-col">
      {/* Filename Header */}
      <div
        className="flex justify-between items-center border-b"
        style={{
          backgroundColor: selectedTheme.plain.backgroundColor,
          borderBottomColor: "rgba(255,255,255,0.1)",
        }}
      >
        {fileName && (
          <div
            className="px-3 py-2 text-xs font-mono opacity-80 truncate overflow-hidden whitespace-nowrap"
            style={{
              backgroundColor: selectedTheme.plain.backgroundColor,
              color: selectedTheme.plain.color,
            }}
            title={fileName}
          >
            {fileName}
          </div>
        )}

        <div
          className="flex items-center gap-2 p-3"
          style={{
            backgroundColor: selectedTheme.plain.backgroundColor,
          }}
        >
          <label
            className="text-xs font-mono"
            style={{ color: selectedTheme.plain.color }}
          >
            Theme:
          </label>
          <Select
            value={theme}
            onValueChange={(value: ThemeName) => setTheme(value)}
          >
            <SelectTrigger
              className="w-35 h-8 text-xs font-mono"
              style={{ color: selectedTheme.plain.color }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(themeMap).map((themeName) => (
                <SelectItem key={themeName} value={themeName}>
                  {themeDisplayNames[themeName as ThemeName]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code Block */}
      <div className="flex-1 min-h-0">
        <Highlight code={code ?? ""} language={language} theme={selectedTheme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                margin: 0,
                borderRadius: 0,
                fontSize: "14px",
                height: "100%",
                padding: "12px",
                overflowX: "auto",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export default CodeBlock;
