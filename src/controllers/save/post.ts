import BardData from "../../models/token"
import { Request, Response } from "express"

export const post = async (req: Request, res: Response) => {
  try {
    const { workspace_id, user_id, answers, isPremium, type } = req.body
    const id = `${workspace_id}:${user_id}`

    let savesLeft = 999

    const data = await BardData.findOneAndUpdate(
      { id },
      { today_saves: { $inc: answers } },
      { new: true }
    )
    if (!data) throw new Error("user data not found")

    if (!isPremium) {
      const { today_saves } = data
      savesLeft = Math.max(8 - today_saves, 0)
    }

    res.status(200).send({ savesLeft })
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: "Something went wrong",
      error: JSON.stringify(err),
    })
  }
}
