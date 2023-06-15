const filterMessage = (text: string) => {
  const reasonStartIndex = text.indexOf('"reason":');

  if (reasonStartIndex === -1) {
    return "";
  }

  const startIndex = reasonStartIndex + 11;
  let result = text.slice(startIndex);
  result = result.replace(/["}\s]+$/, "");

  return result;
};

export { filterMessage };
