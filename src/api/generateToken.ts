import { Storage } from "@plasmohq/storage"

export const generateToken = async (code: string) => {
  try {
    const storage = new Storage()
    const session = new Storage({
      area: "session",
      secretKeyList: ["token"]
    })
    const response = await fetch(
      "https://bard-to-notion.onrender.com/token/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code,
          grant_type: "authorization_code",
          redirect_uri:
            "https://theo-lartigau.notion.site/Bard-to-Notion-f0dfe63e7dee485e8d2d7aa5a1102388"
        })
      }
    )
    const data = await response.json()

    await session.set("token", data.access_token)

    const user_id = data.owner.workspace ? "x" : data.owner.user.id
    const user = data.owner.workspace ? null : data.owner.user
    await Promise.all([
      storage.set("workspace_id", data.workspace_id),
      storage.set("workspace_name", data.workspace_name),
      storage.set("user_id", user_id),
      storage.set("user", user)
    ])
    await storage.set("authenticated", true)
    console.log("authenticated")
    return data.user
  } catch (err) {
    console.error(err)
  }
}
