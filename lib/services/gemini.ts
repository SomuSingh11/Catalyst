import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY ?? "");

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
) {
  // if the user input is in a list, we also process the output as a list of json
  const list_input: boolean = Array.isArray(user_prompt);
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  // start off with no error message
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    try {
      let output_format_prompt: string = `\nYou are to output ${
        list_output && "an array of objects in"
      } the following in json format: ${JSON.stringify(
        output_format
      )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

      if (list_output) {
        output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
      }

      // if output_format contains dynamic elements, process it accordingly
      if (dynamic_elements) {
        output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
      }

      // if input is in a list format, ask it to generate json in a list
      if (list_input) {
        output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
      }

      // Combine prompts for Gemini
      const fullPrompt = `${system_prompt}${output_format_prompt}${error_msg}\n\nUser request: ${
        Array.isArray(user_prompt) ? user_prompt.join("\n") : user_prompt
      }`;

      if (verbose) {
        console.log("Full prompt:", fullPrompt);
      }

      // Generate content with Gemini
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: temperature,
        },
      });

      const response = await result.response;
      // eslint-disable-next-line prefer-const
      let res: string = response
        .text()
        .replace(/'/g, '"')
        .replace(/(\w)"(\w)/g, "$1'$2");

      if (verbose) {
        console.log(
          "System prompt:",
          system_prompt + output_format_prompt + error_msg
        );
        console.log("\nUser prompt:", user_prompt);
        console.log("\nGemini response:", res);
      }

      // Try to parse the response as JSON
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let output: any;
      try {
        // First try direct parsing
        output = JSON.parse(res);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (parseError) {
        // If direct parsing fails, try to extract JSON from the response
        const jsonMatch = res.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          output = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse response as JSON");
        }
      }

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in an array of json");
        }
      } else {
        output = [output];
      }

      // check for each element in the output_list, the format is correctly adhered to
      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          // unable to ensure accuracy of dynamic output header, so skip it
          if (/<.*?>/.test(key)) {
            continue;
          }

          // if output field missing, raise an error
          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          // check that one of the choices given for the list of words is an unknown
          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            // ensure output is not a list
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            // output the default category (if any) if Gemini is unable to identify the category
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            // if the output is a description format, get only the label
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        // if we just want the values for the outputs
        if (output_value_only) {
          output[index] = Object.values(output[index]);
          // just output without the list if there is only one element
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${e instanceof Error ? e.message : e}`;
      console.log("An exception occurred:", e);

      // If this is the last try, throw the error
      if (i === num_tries - 1) {
        throw e;
      }
    }
  }

  throw new Error("Failed to generate response after all retries");
}

// aiSummariseCommit function is function that uses an AI model to generate a summary of a Git diff—i.e., a set of code changes from a Git commit.
export const aiSummariseCommit = async (diff: string) => {
  const response = await model.generateContent([
    `You are an expert programmer, and you are trying to summarize a git diff.
  Reminders about the git diff format:
  For every file, there are a few metadata lines, like (for example):
  \`\`\`
  diff --git a/lib/index.js b/lib/index.js
  index aadf691..bfef603 100644
  --- a/lib/index.js
  +++ b/lib/index.js
  \`\`\`
  This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
  Then there is a specifier of the lines that were modified.
  A line starting with \`+\` means it was added.
  A line that starting with \`-\` means that line was deleted.
  A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
  It is not part of the diff.
  [...]
  EXAMPLE SUMMARY COMMENTS:
  \`\`\`
  * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
  * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
  * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
  * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
  * Lowered numeric tolerance for test files
  \`\`\`
  Most commits will have less comments than this examples list.
  The last comment does not include the file names,
  because there were more than two relevant files in the hypothetical commit.
  Do not include parts of the example in your summary.
  It is given only as an example of appropriate comments.`,
    `Please summarise the following diff file: \n\n${diff}`,
  ]);
  return response.response.text();
};

export async function summariseCode(doc: Document) {
  const code = doc.pageContent.slice(0, 10000);
  console.log("summarise code ----------------------");
  console.log("source code for file:", doc.metadata.source, code);

  try {
    const response = await model.generateContent([
      `
## ROLE & GOAL
You are a code analysis AI creating dual-purpose summaries:
1. **For RAG/Vector Search**: Semantically rich, question-answerable content that helps retrieve this file when users ask natural language questions
2. **For Frontend Display**: Clean, scannable markdown that developers can read and navigate

**Critical Balance**: Write in natural, flowing language (good for embeddings) while maintaining clear structure (good for UI rendering).

## TASK
Analyze this source file: \`${doc.metadata.source}\`

### SOURCE CODE
---
${code}
---

## OUTPUT FORMAT
Use this **exact markdown structure**. Write each section in natural, explanatory language (not just bullet points).

---

## **📋 Overview**
[Write 3-4 sentences explaining what this file does, why it exists, and when developers would interact with it. Use natural language as if explaining to a teammate. Include the problem it solves and its role in the application architecture.]

---

## **🎯 Core Purpose**
[A detailed paragraph (4-6 sentences) describing the file's primary technical purpose and how it accomplishes it. Use varied terminology and explain both WHAT it does and HOW it works. This should answer questions like "What does this file handle?" and "How does it implement [feature]?"]

---

## **🏗️ Architecture & Pattern**
**Design Pattern**: [If applicable, identify the pattern (e.g., "Middleware Pattern", "Custom React Hook", "Service Layer", "Repository Pattern"). If not applicable, state "N/A"]

**Architectural Role**: [2-3 sentences explaining how this fits into the broader system architecture. Use language like "serves as", "connects", "orchestrates", etc.]

---

## **⚙️ Key Components & Logic**

${
  "" /* For each major export, write 2-3 descriptive sentences, not just bullets */
}

### \`functionOrClassName\`
[Describe what it does, when you'd use it, key parameters, return values, and its purpose in the system. Write as if documenting for a team wiki.]

### \`anotherComponentName\`
[Same approach - natural language explanation that answers questions like "What does X do?" "When would I use Y?" "How does Z work?"]

${"" /* Continue for all major exports - aim for 3-7 key components */}

---

## **🔧 Implementation Details**

**Technical Approach**: [Paragraph describing the implementation strategy, algorithms, or patterns used. Explain WHY this approach was chosen if evident from the code.]

**State Management**: [How data flows through this code, any state tracking, caching strategies]

**Performance Considerations**: [Any optimization patterns, async handling, memoization, etc. Write "None significant" if not applicable]

---

## **🔌 Dependencies & Integration**

**External Libraries**:
- **\`library-name\`**: [Not just "used for X" but "enables this file to accomplish Y by providing Z functionality"]
${"" /* List 3-7 key dependencies with context */}

**Internal Connections**: [Paragraph explaining how this file integrates with other parts of the codebase. Use phrases like "consumed by", "depends on", "provides services to", "coordinates with". This helps answer "how does X connect to Y?" questions.]

**Related Files**: [List 2-5 related files a developer should understand alongside this one, with brief context why]

---

## **⚠️ Error Handling & Edge Cases**

**Error Management**: [Describe the error handling strategy. Use searchable language: "handles validation errors by...", "catches and logs...", "prevents failures through..."]

**Side Effects**: [List important side effects with context]
- [e.g., "Makes authenticated API calls to the external payment service"]
- [e.g., "Writes audit logs to the database for compliance tracking"]
- [e.g., "Updates global application state that triggers re-renders"]

**Edge Cases Handled**: [Any special cases or boundary conditions this code accounts for]

---

## **❓ Common Questions This Answers**

${"" /* CRITICAL for RAG - phrase as actual developer questions */}
This file helps answer questions like:

- "How does the application [specific capability]?"
- "What handles [specific responsibility or feature]?"  
- "Where is [pattern/concept/algorithm] implemented?"
- "How do I [task this enables]?"
- "Why does the system [behavior this creates]?"

${"" /* Include 5-8 realistic questions */}

---

## **🔍 Technical Keywords**
[Single line, 15-20 comma-separated terms including: exact function/class names, technical concepts, problem domains, architectural patterns, related synonyms, frameworks, algorithms. This aids both search and embedding.]

---

## **📝 Usage Context**
[2-3 sentences on when/why a developer would need to modify or reference this file. Include common scenarios like "When adding new authentication methods...", "If implementing additional payment providers...", etc.]

---

## CRITICAL INSTRUCTIONS FOR QUALITY

**For RAG Optimization**:
1. Use **varied phrasing** - mention the same concept multiple ways with different words
2. Write in **natural, flowing language** - not telegraphic bullet points
3. Include **problem-domain vocabulary** - use terms developers actually search for
4. Answer implicit questions - structure as if responding to "what", "why", "how", "when"
5. **Semantic density** - every sentence should add retrievable information

**For Frontend Display**:
1. Maintain **clear markdown hierarchy** with proper heading levels
2. Use **emojis** for visual scanning (📋 🎯 🏗️ ⚙️ 🔧 🔌 ⚠️ ❓ 🔍 📝)
3. Keep **consistent structure** - every summary follows the same format
4. Make **scannable** - use bold for emphasis, code formatting for names
5. **No filler text** - every section must contain useful information

**Balance Both**:
- Write detailed explanations (good for vectors) in structured sections (good for UI)
- Use descriptive prose (RAG-friendly) with clear headings (render-friendly)
- Include technical accuracy (useful content) with natural language (better embeddings)

Before responding, verify:
✓ Each section uses natural, explanatory language (not just lists)
✓ The summary would match common developer questions
✓ The markdown structure is clean and consistent
✓ Technical accuracy is maintained throughout
✓ Both humans and vector search would find this useful
  `,
    ]);
    return response.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    return "";
  }
}

export async function generateEmbedding(summary: string) {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });
  const result = await model.embedContent(summary);
  const embedding = result.embedding;
  return embedding.values;
}
