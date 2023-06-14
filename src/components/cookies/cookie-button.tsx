"use client";

import * as CookieConsentApi from "vanilla-cookieconsent";

import "vanilla-cookieconsent/dist/cookieconsent.css";

import CookieModal from "~/components/cookies/cookie-modal";

export default function CookieButton() {
  return (
    <>
      <CookieModal CookieConsentApi={CookieConsentApi} />
    </>
  );
}
