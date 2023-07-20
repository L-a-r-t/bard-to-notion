import BardData from "../models/token"
import BardSaves from "../models/counters"
import schedule from "node-schedule"
import dayjs from "dayjs"

const callback = async () => {
  const sum = await BardData.aggregate([
    {
      $group: {
        _id: null,
        todaySaves: { $sum: "$today_saves" },
      },
    },
  ])
  const todaySaves: number = sum[0].todaySaves
  console.log(
    `TOTAL SAVES ON ${dayjs()
      .format("DD/MM/YYYY")}: ${todaySaves}`
  )

  await BardData.updateMany({}, { today_saves: 0 })
  console.log("SUCCESSFULLY RESET USER SAVES")

  await BardSaves.create({
    day: new Date(),
    saves: todaySaves,
  })
  console.log("SUCCESSFULLY ADDED TODAY'S SAVE COUNT TO COLLECTION")
}

const resetCounters = {
  scheduleRecurrence() {
    const rule = new schedule.RecurrenceRule()
    rule.hour = 0
    rule.minute = 0
    rule.second = 0
    rule.tz = "Etc/UTC"

    const dailyJob = schedule.scheduleJob(rule, callback)
    console.log(
      `JOB:\n${
        dailyJob.name
      }\n HAS BEEN SCHEDULED FOR ${dailyJob.nextInvocation()}`
    )
  },
}

export default resetCounters
