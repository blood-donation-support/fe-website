import removeMarkdown from "remove-markdown";

function getPreviewText(content: string, length: number = 180) {
  const plain = removeMarkdown(content || "");
  return plain.length > length ? plain.slice(0, length) + "..." : plain;
}
export { getPreviewText };