#!/usr/bin/env node
const os = require("os");
const request = require("request");
const rp = require("request-promise");
const uuidv4 = require("uuid/v4");
const tar = require("tar");
const fs = require("fs");
const decompress = require("decompress");
const decompressTargz = require("decompress-targz");

const appName = "rustywind";
const repo = "avencera/rustywind";
const githubRepoLink = `https://github.com/${repo}`;

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

async function getTag(repo: string) {
  const url = `https://api.github.com/repos/${repo}/releases/latest`;
  const response = await rp(url, {
    json: true,
    headers: { "user-agent": "node.js" }
  });

  return response.tag_name;
}

async function download() {
  const tag = await getTag(repo);
  const url = `${githubRepoLink}/releases/download/${tag}/${appName}-${tag}-${getArch()}-${getPlatform()}.tar.gz`;

  const tmpdir = os.tmpdir();
  const release = `${tmpdir}/${appName}-${tag}-${getArch()}-${getPlatform()}-${randomString()}.tar.gz`;

  /* Create an empty file where we can save data */
  let file = fs.createWriteStream(release);
  /* Using Promises so that we can use the ASYNC AWAIT syntax */

  await new Promise((resolve, reject) => {
    let stream = request({
      uri: url
    })
      .pipe(file)
      .on("finish", () => {
        console.log(`The file is finished downloading.`);
        resolve();
      })
      .on("error", (error: string) => {
        reject(error);
      });
  }).catch(error => {
    console.log(`Something happened: ${error}`);
  });

  const binPathDir = release.replace(".tar.gz", "");

  await decompress(release, binPathDir, {
    plugins: [decompressTargz()]
  });

  const binPath = `${binPathDir}/${appName}`;

  console.log("BIN PATH: ", process.env.BIN_PATH);
  console.log("CURRENT FOLDER: ", process.cwd());
}

download();
