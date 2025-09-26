import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY ?? "");

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
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
  // console.log("source", doc.metadata);
  console.log("source code for file:", doc.metadata.source, code);
  try {
    const response = await model.generateContent([
      `
  ## ROLE & GOAL
  You are a code analysis AI specializing in generating concise, developer-friendly technical summaries.
  Your dual objectives:
  1. Create a dense, factual, technical summary suitable for vector embeddings and semantic search.
  2. Present the summary in a clean, professional, scannable markdown format for software developers.

  ## TASK
  Analyze the following source file: \`${doc.metadata.source}\`.  
  Summarize its purpose, abstractions, and interactions. If the file is not a standard code module (e.g., JSON, markdown, simple export file), adapt the summary to reflect its actual purpose.

  ### SOURCE CODE
  ---
  ${code}
  ---

  ## OUTPUT FORMAT
  Use the **exact markdown structure** below. Be as detailed and technical as possible within each section..  


  ## **Overview:** 
  A detailed, multi-sentence overview of this file’s role, its primary responsibilities, and how it fits into the overall application architecture.

  ## **Core Functionality** A detailed sentence describing the file’s primary technical purpose.

  // Suggestion 1: Added the Architectural Pattern section
  ## **Architectural Pattern** If applicable, identify and briefly explain the software design pattern this file implements (e.g., Middleware, React Hook, Singleton, Factory). If not applicable, state "N/A".

  ## **Key Abstractions & Logic**
  - **\`functionName(param1, param2)\`**: A detailed description of its logic, purpose, key parameters, and what it returns.
  - **\`ClassName\`**: A description of its responsibilities, key methods, and properties.
  *(List all major exported functions and classes. Do not skip important ones.)*


  ## **Error Handling & Side Effects**
  - **Error Handling:** Describe how this code handles potential errors (e.g., try-catch blocks, error propagation, calls to a logging service).
  - **Side Effects:** List any important side effects (e.g., makes an API call to an external service, writes to a database, modifies global state).

  ## **Dependencies & Interactions**
  - **External:** List key imported libraries and briefly state what each is used for.
  - **Internal:** Explain how this file connects with the rest of the codebase in detail.

  ## **Technical Keywords**
  Single line, comma-separated, 8–15 technical keywords. Be specific.

  ## FINAL REVIEW
  Silently review your summary before responding. Ensure it accurately reflects the code, adheres to the format, and is concise yet technical. Remove all conversational fluff.
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
