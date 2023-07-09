"use client";

import type CookieConsent from "vanilla-cookieconsent";

import { useEffect } from "react";

import pluginConfig from "@/components/_cookies/cookie";

interface Props {
  CookieConsentApi: typeof CookieConsent;
}

export default function CookieModal(props: Props) {
  const { run } = props.CookieConsentApi;

  useEffect(() => {
    void run(pluginConfig);
  }, [run]);

  return null;
}
