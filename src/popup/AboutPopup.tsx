import "~styles.css"

import { i18n } from "~utils/functions"

function AboutPopup() {
  return (
    <>
      <p className="text-sm">
        <span className="italic">{i18n("extensionName")}</span>
        {" " + i18n("about_extensionBy") + " "}
        <a
          className="link"
          href="https://twitter.com/lartdoesstuff"
          target="_blank">
          Théo Lartigau
        </a>
        {". " + i18n("about_suggestionsIssues")}
      </p>
      <ol className="my-4">
        <li>
          <a
            className="link text-sm"
            href="https://theo-lartigau.notion.site/FAQ-214e7413e07e4887aa84339b64c17296?pvs=4"
            target="_blank">
            {i18n("about_FAQ")}
          </a>
        </li>
        <li>
          <a
            className="link text-sm"
            href="https://github.com/L-a-r-t/Bard-to-Notion"
            target="_blank">
            {i18n("about_github")}
          </a>
        </li>
      </ol>
      <div className="text-center text-xs text-gray-500">
        {i18n("about_pinIcon") + " "}
        <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a>
        {" " + i18n("about_pinLicense")}
      </div>
    </>
  )
}

export default AboutPopup
