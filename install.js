#!/usr/bin/env node
const os = require("os");
const request = require("request");
const rp = require("request-promise");
const fs = require("fs");
const decompress = require("decompress");
const decompressTargz = require("decompress-targz");
const moveFile = require("move-file");
////////////////////////////////////////////////////////////////////////////////
const APP_NAME = "rustywind";
const REPO = "avencera/rustywind";
const GITHUB_REPO = `https://github.com/${REPO}`;
////////////////////////////////////////////////////////////////////////////////

const NPM_BIN_PATH = process.env.BIN_PATH || "/usr/local/bin";

const randomString = () => {
  return Math.random()
    .toString(36)
    .substring(10);
};

const getPlatform = () => {
  switch (os.platform()) {
    case "darwin": {
      return "apple-darwin";
    }
    case "linux": {
      return "unknown-linux-musl";
    }
    case "win32": {
      return "pc-windows-gnu";
    }
    default:
      throw `we don't current support your os (${os.platform()}) please make an issue on github`;
  }
};

const getArch = () => {
  switch (os.arch()) {
    case "x64":
      return "x86_64";
    default:
      throw `we don't current support your cpu arch (${os.arch()}) please make an issue on github`;
  }
};

async function getTag(repo) {
  const url = `https://api.github.com/repos/${REPO}/releases/latest`;
  const response = await rp(url, {
    json: true,
    headers: { "user-agent": "node.js" }
  });

  return response.tag_name;
}

async function download() {
  const tag = await getTag(REPO);
  const url = `${GITHUB_REPO}/releases/download/${tag}/${APP_NAME}-${tag}-${getArch()}-${getPlatform()}.tar.gz`;

  const tmpdir = os.tmpdir();
  const release = `${tmpdir}/${APP_NAME}-${tag}-${getArch()}-${getPlatform()}-${randomString()}.tar.gz`;

  console.log(`Downloading ${APP_NAME}`);
  console.log(`from: ${GITHUB_REPO}`);
  console.log(`version: ${tag}`);
  console.log(`platform: ${getArch()}-${getPlatform()}\n`);

  /* Create an empty file where we can save data */
  let file = fs.createWriteStream(release);
  /* Using Promises so that we can use the ASYNC AWAIT syntax */

  await new Promise((resolve, reject) => {
    let stream = request({
      uri: url
    })
      .pipe(file)
      .on("finish", () => {
        console.log("Download complete");
        resolve();
      })
      .on("error", error => {
        reject(error);
      });
  }).catch(error => {
    console.log(`\n ------------- Something happened: ${error} --------- \n`);
  });

  const binPathDir = release.replace(".tar.gz", "");

  console.log(`Uncompressing bin`);
  await decompress(release, binPathDir, {
    plugins: [decompressTargz()]
  });

  const binPath = `${binPathDir}/${APP_NAME}`;

  console.log(`Installing to: ${NPM_BIN_PATH}`);
  (async () => {
    await moveFile(binPath, `${NPM_BIN_PATH}/${APP_NAME}`);
    console.log("Installation complete\n");
  })();
}

download();
