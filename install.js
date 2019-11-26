let exec = require("child_process").exec;

exec(
  "sh ./install.sh -s -- --git avencera/rustywind -f --to $(npm bin -g)",
  (error, stdout, stderr) => {
    console.log(stderr);
  }
);
