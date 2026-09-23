import { createCn } from "cn/config"

// Class merger that knows our type scale. Without this, `text-control`
// (a font size) looks like a text colour and silently removes classes such as
// `text-white`. Import `cn` from here, never from the "cn" package directly.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["label", "body", "control", "heading", "title", "count", "phone"] }],
    },
  },
})
