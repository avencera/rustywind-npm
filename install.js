let exec = require("child_process").exec;

exec(
  "curl -LSfs https://raw.githubusercontent.com/avencera/rustywind-npm/master/install.sh \
  |  sh -s -- --git avencera/rustywind -f --to $(npm bin -g)",
  (error, stdout, stderr) => {
    console.log(stderr);
  }
);
