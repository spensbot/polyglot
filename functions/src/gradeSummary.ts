// import { onRequest } from "firebase-functions/v2/https";
// import { streamObj } from "./util/llm/generate";

// export const streamData = onRequest(async (req, res) => {
//   const prompt = req.body.prompt;

//   // Enable streaming response
//   res.setHeader("Content-Type", "application/json; charset=utf-8");
//   res.setHeader("Transfer-Encoding", "chunked");

//   const result = await streamObject({
//     model: openai("gpt-4.1"),
//     schema: {
//       type: "object",
//       properties: {
//         summary: { type: "string" },
//         tags: { type: "array", items: { type: "string" } }
//       },
//       required: ["summary", "tags"]
//     },
//     prompt,
//   });

//   // Write streaming JSON patches / deltas
//   for await (const delta of result.objectStream) {
//     res.write(JSON.stringify(delta) + "\n");
//   }

//   // When finished, send final object if you want
//   const final = await result.fullObject;
//   res.write("\nFINAL:\n");
//   res.write(JSON.stringify(final));

//   res.end();
// });