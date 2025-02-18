import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY ?? "");

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
  // Get the model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
