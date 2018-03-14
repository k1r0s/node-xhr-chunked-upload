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
    let body = "";

    request.on("data", d => body = body.concat(d));
    request.on("end", () => {
      if(filename) {
        sessions[sessionid].end(body, undefined, _ => {
          delete sessions[sessionid];
          fs.rename(sessionid, filename, end);
        });
      } else {
        if (!sessions[sessionid]) {
          sessions[sessionid] = fs.createWriteStream(sessionid);
          sessions[sessionid].on("open", _ =>
            sessions[sessionid].write(body, undefined, end));
        } else {
          sessions[sessionid].write(body, undefined, end);
        }
      }
    });
  });
