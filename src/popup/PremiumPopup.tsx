import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { activateTrial } from "~api/activateTrial"
import { registerKey } from "~api/registerKey"
import Spinner from "~common/components/Spinner"
import { i18n } from "~utils/functions"
import type { PopupEnum } from "~utils/types"

dayjs.extend(localizedFormat)

function PremiumPopup() {
  const [isPremium, setPremiumStatus] = useStorage("isPremium", false)
  const [savesLeft, setSavesLeft] = useStorage("savesLeft", 10)

  const [licenseKey, setLicenseKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [keyStatus, setKeyStatus] = useState<"valid" | "invalid" | "unknown">(
    "unknown"
  )
  const [trialStatus, setTrialStatus] = useState<
    "valid" | "invalid" | "unknown" | "over" | "active"
  >("unknown")

  const handleActivate = async () => {
    try {
      setLoading(true)
      const res = await registerKey(licenseKey)
      setPremiumStatus(res.success)
      setKeyStatus(res.success ? "valid" : "invalid")
      if (res.success) setSavesLeft(1000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTrial = async () => {
    try {
      setLoading(true)
      const res = await activateTrial()
      setTrialStatus(res.success ? "valid" : "invalid")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // TODO: get rid of duplicate code
  if (isPremium && keyStatus === "unknown" && trialStatus !== "valid")
    return (
      <div>
        <h2 className="text-center font-bold">{i18n("premium_isPremium")}</h2>
        <p className="text-sm">{i18n("premium_isPremium_meaning")}</p>
        <ul>
          <li className="text-sm">
            - {i18n("premium_isPremium_unlimitedSaves")}
          </li>
          <li className="text-sm">- {i18n("premium_isPremium_future")}</li>
          <li className="text-sm">- {i18n("premium_isPremium_noAds")}</li>
          <li className="text-sm">- {i18n("premium_isPremium_support")}</li>
          <li className="text-sm">- {i18n("premium_isPremium_gratitude")}</li>
        </ul>
        {/* {!isPremium && (
          <>
            <a
              className="block link text-center mb-2"
              href="https://theolartigau.gumroad.com/l/bard-to-notion"
              target="_blank">
              {i18n("premium_cta")}
            </a>
            <input
              className="input mb-2"
              minLength={20}
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder={i18n("premium_key_placeholder")}
            />
            <button
              disabled={loading}
              onClick={handleActivate}
              className="button w-full">
              {i18n("premium_key_activate")}
              {loading && <Spinner white small />}
            </button>
          </>
        )} */}
      </div>
    )

  return (
    <div>
      {/* <h2 className="font-bold text-center">Premium</h2> */}
      <p className="text-sm text-center font-bold">{i18n("premium_desc")}</p>
      <a
        className="block link text-center mb-2"
        href="https://theolartigau.gumroad.com/l/bard-to-notion"
        target="_blank">
        {i18n("premium_cta")}
      </a>
      <input
        className="input mb-2"
        minLength={20}
        value={licenseKey}
        onChange={(e) => setLicenseKey(e.target.value)}
        placeholder={i18n("premium_key_placeholder")}
      />
      <button
        disabled={loading || keyStatus === "valid"}
        onClick={handleActivate}
        className="button w-full">
        {keyStatus === "unknown" && i18n("premium_key_activate")}
        {keyStatus === "valid" && i18n("premium_key_activate_success")}
        {keyStatus === "invalid" && i18n("premium_key_activate_error")}
        {loading && <Spinner white small />}
      </button>
      {keyStatus === "unknown" && (
        <p className="text-sm">{i18n("premium_chatgpt")}</p>
      )}
      {/* {keyStatus === "unknown" && (
        <>
          <div className="my-2 relative w-full">
            <div className="absolute top-1/2 left-0 border w-full -z-10" />
            <p className="text-center">
              <span className="text-sm bg-white text-gray-700 px-1">
                {i18n("premium_trial_or")}
              </span>
            </p>
          </div>
        </>
      )} */}
      {keyStatus === "valid" && (
        <p className="text-sm">{i18n("premium_success")}</p>
      )}
      {keyStatus === "invalid" && (
        <p className="text-sm">{i18n("premium_invalid")}</p>
      )}
    </div>
  )
}

export default PremiumPopup
