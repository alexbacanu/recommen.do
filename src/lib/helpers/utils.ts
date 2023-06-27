import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterMessage(text: string) {
  const reasonStartIndex = text.indexOf('"reason":');

  if (reasonStartIndex === -1) {
    return "";
  }

  const startIndex = reasonStartIndex + 11;
  let result = text.slice(startIndex);
  result = result.replace(/["}\s]+$/, "");

  return result;
}

export function retryPromise<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        if (retries === 1) {
          reject(error);
          return;
        }
        setTimeout(() => {
          retryPromise(fn, retries - 1, delay)
            .then(resolve)
            .catch(reject);
        }, delay);
      });
  });
}
