"use client";

import * as CookieConsentApi from "vanilla-cookieconsent";

import CookieModal from "@/components/_cookies/modal";

import "vanilla-cookieconsent/dist/cookieconsent.css";

export default function CookieButton() {
  return (
    <>
      <CookieModal CookieConsentApi={CookieConsentApi} />
    </>
  );
}
