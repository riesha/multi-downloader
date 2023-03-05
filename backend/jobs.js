const CronJob = require("node-cron");
const glob = require("glob");
const fs = require("fs");
exports.initScheduledJobs = () => {
  const scheduledJobFunction = CronJob.schedule("*/5 * * * *", async () => {
    console.log("starting file cleanup...");
    const files = await glob("downloads/*.*");

    for (const file of files) {
      fs.unlink(file, (err) => {
        if (err) return console.log(err);
        console.log(`deleting ${file}...`);
      });
    }
  });

  scheduledJobFunction.start();
};
