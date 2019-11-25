let exec = require("child_process").exec;

exec(
  "curl -LSfs https://gist.githubusercontent.com/praveenperera/585454c3ef85451b3b92209dd822d4aa/raw/7c05b808ba7e4d47676c43b1c6d3649c64e4fa6e/crate-gh-install.sh\
  |  sh -s -- --git avencera/rustywind -f",
  (error, stdout, stderr) => {
    console.log(stderr);
  }
);
