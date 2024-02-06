import { defineConfig } from "vite";

import eslint from "vite-plugin-eslint";

import { createReadStream, statSync } from "fs";
import { join } from "path";
import { IncomingMessage, ServerResponse } from "http";

export default defineConfig({
  publicDir: "./streams",
  plugins: [
    eslint({
      failOnWarning: false,
      failOnError: false,
    }),
  ],
  server: {
    proxy: {
      "^/local/.*.mp3": {
        target: "http://localhost:5173",
        changeOrigin: true,
        bypass: (req, res) => {
          if (req?.url) {
            streamFile(req.url, res);
            return "bypass";
          }
          return false;
        },
      },
    },
  },
});

function streamFile(url: string, res: ServerResponse<IncomingMessage>) {
  const filename = getFilePath(url);
  const stat = statSync(filename);

  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Content-Length": stat.size,
    TestRange: "1-200/*",
  });

  const stream = createReadStream(filename);
  stream.pipe(res);
}

function getFilePath(url: string) {
  let filename = url.slice("/local/".length);
  const queryIndex = filename.indexOf("?");
  if (queryIndex > 0) {
    filename = filename.slice(0, queryIndex);
  }
  // eslint-disable-next-line no-undef
  return join(__dirname, "streams", filename.slice(filename.indexOf("/") + 1));
}
