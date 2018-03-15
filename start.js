const http = require("http");
const fs = require("fs");
const sessions = {};

server = http.createServer();
server.listen(3000);

server.on("request",
  (request, response) => {

    const end = root => {
      response.statusCode = 200;
      if(root) {
        var readStream = fs.createReadStream("./public/index.html");
        return readStream.pipe(response);
      }
      response.end();
    }

    if(request.method === "GET") {
      return end(true);
    }

    const filename = request.headers["filename"];
    const session = request.headers["session"];
    const [timestamp, sessionid] = session.split("_");
    const body = [];

    request.on("data", d => body.push(d));
    request.on("end", () => {
      const bodyBuffer = Buffer.concat(body);
      if(filename) {
        sessions[sessionid].end(bodyBuffer, undefined, _ => {
          delete sessions[sessionid];
          fs.rename(sessionid, filename, end);
        });
      } else {
        if (!sessions[sessionid]) {
          sessions[sessionid] = fs.createWriteStream(sessionid);
          sessions[sessionid].on("open", _ =>
            sessions[sessionid].write(bodyBuffer, undefined, end));
        } else {
          sessions[sessionid].write(bodyBuffer, undefined, end);
        }
      }
    });
  });
