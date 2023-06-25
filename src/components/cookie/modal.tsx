"use client";

import type CookieConsent from "vanilla-cookieconsent";

import { useEffect } from "react";

import pluginConfig from "@/components/cookie/cookie";

interface Props {
  CookieConsentApi: typeof CookieConsent;
}

export default function CookieModal(props: Props) {
  const { run, setLanguage } = props.CookieConsentApi;

  useEffect(() => {
    run(pluginConfig);
    setLanguage("en");
  }, [run, setLanguage]);

  return null;
}
