const cron = require("node-cron");
const glob = require("glob");
const fs = require("fs");

exports.initjobs = () => {
  const cleanupjob = cron.schedule("*/5 * * * *", async () => {
    console.log("starting file cleanup...");
    const files = await glob("downloads/*", {
      ignore: ["downloads/*.part", ".gitignore"],
    });

    for (const file of files) {
      fs.unlink(file, (err) => {
        if (err) return console.log(err);

        console.log(`deleting ${file}...`);
      });
    }
  });

  cleanupjob.start();
};
