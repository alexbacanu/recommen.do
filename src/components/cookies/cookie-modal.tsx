"use client";

import type CookieConsent from "vanilla-cookieconsent";

import { useEffect } from "react";

import pluginConfig from "@/components/cookies/cookie-config";

interface Props {
  CookieConsentApi: typeof CookieConsent;
}

const CookieModal = (props: Props) => {
  const { run, setLanguage } = props.CookieConsentApi;

  useEffect(() => {
    run(pluginConfig);
    setLanguage("en");
  }, [run, setLanguage]);

  return null;
};

export default CookieModal;
