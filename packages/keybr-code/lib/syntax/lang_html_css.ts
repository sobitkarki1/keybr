// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    alt: [
      {
        ref: "html",
      },
      {
        ref: "css",
      },
    ],
  },
  html: {
    seq: [
      {
        ref: "html_tag",
      },
      " ",
      {
        ref: "html_entity",
      },
    ],
  },
  html_tag: {
    ref: "html_self_closing_tag",
  },
  html_self_closing_tag: {
    seq: [
      "<",
      {
        ref: "html_ident",
      },
      {
        ref: "html_attr_list",
      },
      "/>",
    ],
  },
  html_attr_list: {
    seq: [
      " ",
      {
        ref: "html_id_attr",
      },
      " ",
      {
        ref: "html_class_attr",
      },
      " ",
      {
        ref: "html_style_attr",
      },
    ],
  },
  html_id_attr: {
    seq: [
      'id="',
      {
        ref: "css_class_id",
      },
      '"',
    ],
  },
  html_class_attr: {
    seq: [
      'class="',
      {
        ref: "css_class_id",
      },
      '"',
    ],
  },
  html_style_attr: {
    seq: [
      'style="',
      {
        ref: "css_property",
      },
      '"',
    ],
  },
  html_ident: {
    seq: [
      {
        f: 0.5,
        opt: {
          alt: ["ns:", "my-"],
        },
      },
      {
        alt: ["p", "div", "span", "em", "strong"],
      },
    ],
  },
  html_entity: {
    alt: ["&nbsp;", "&lt;", "&gt;", "&amp;", "&apos;"],
  },
  css: {
    ref: "css_rule",
  },
  css_rule: {
    seq: [
      {
        ref: "css_selector",
      },
      " { ",
      {
        ref: "css_property_list",
      },
      " }",
    ],
  },
  css_selector: {
    seq: [
      {
        alt: [
          {
            ref: "css_id_selector",
          },
          {
            ref: "css_class_selector",
          },
        ],
      },
      {
        f: 0.5,
        opt: {
          ref: "css_pseudo_selector",
        },
      },
      {
        f: 0.5,
        opt: {
          seq: [
            {
              alt: [" > ", " + "],
            },
            {
              alt: [
                {
                  ref: "css_id_selector",
                },
                {
                  ref: "css_class_selector",
                },
              ],
            },
            {
              f: 0.5,
              opt: {
                ref: "css_pseudo_selector",
              },
            },
          ],
        },
      },
    ],
  },
  css_id_selector: {
    seq: [
      "#",
      {
        ref: "css_class_id",
      },
    ],
  },
  css_class_selector: {
    seq: [
      ".",
      {
        ref: "css_class_id",
      },
    ],
  },
  css_pseudo_selector: {
    alt: [
      {
        ref: "css_pseudo_class",
      },
      {
        ref: "css_pseudo_element",
      },
    ],
  },
  css_pseudo_class: {
    seq: [
      ":",
      {
        ref: "css_pseudo_class_name",
      },
    ],
  },
  css_pseudo_class_name: {
    alt: [
      {
        seq: [
          "dir(",
          {
            alt: ["ltr", "rtl"],
          },
          ")",
        ],
      },
      "hover",
      "active",
      "focus",
      "valid",
      "invalid",
      "required",
      "optional",
    ],
  },
  css_pseudo_element: {
    seq: [
      "::",
      {
        ref: "css_pseudo_element_name",
      },
    ],
  },
  css_pseudo_element_name: {
    alt: ["before", "after", "backdrop"],
  },
  css_property_list: {
    seq: [
      {
        ref: "css_property",
      },
      "; ",
      {
        ref: "css_property",
      },
      "; ",
      {
        ref: "css_property",
      },
      ";",
    ],
  },
  css_property: {
    seq: [
      {
        ref: "css_property_name",
      },
      ": ",
      {
        ref: "css_property_value",
      },
    ],
  },
  css_property_name: {
    alt: [
      "color",
      "box-sizing",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["min", "max"],
                },
                "-",
              ],
            },
          },
          {
            alt: ["width", "height"],
          },
        ],
      },
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["min", "max"],
                },
                "-",
              ],
            },
          },
          {
            alt: ["inline", "block"],
          },
          "-size",
        ],
      },
      "left",
      "right",
      "top",
      "bottom",
      {
        seq: [
          "inset",
          {
            f: 0.5,
            opt: {
              seq: [
                "-",
                {
                  alt: ["inline", "block"],
                },
                {
                  f: 0.5,
                  opt: {
                    seq: [
                      "-",
                      {
                        alt: ["start", "end"],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "flex",
          {
            f: 0.5,
            opt: {
              seq: [
                "-",
                {
                  alt: ["direction", "grow", "shrink", "basis", "flow", "wrap"],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  css_property_value: {
    alt: [
      {
        ref: "css_std_value",
      },
      {
        ref: "css_var_value",
      },
      {
        ref: "css_url_value",
      },
      {
        ref: "css_color_value",
      },
    ],
  },
  css_std_value: {
    alt: ["initial", "inherit", "revert", "unset"],
  },
  css_var_value: {
    seq: [
      "var(",
      {
        ref: "css_var_id",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "css_color_value",
            },
          ],
        },
      },
      ")",
    ],
  },
  css_url_value: {
    seq: [
      "url(",
      {
        alt: [
          {
            ref: "css_image_url",
          },
          {
            ref: "css_font_url",
          },
        ],
      },
      ")",
    ],
  },
  css_image_url: {
    seq: [
      {
        alt: ["logo", "bg", "img", "hero", "footer"],
      },
      {
        alt: [".jpg", ".png", ".svg"],
      },
    ],
  },
  css_font_url: {
    seq: [
      {
        alt: ["mono", "serif", "sans-serif"],
      },
      {
        alt: [".woff", ".ttf"],
      },
    ],
  },
  css_var_id: {
    seq: [
      "--",
      {
        alt: ["color", "x", "y"],
      },
    ],
  },
  css_color_value: {
    alt: [
      "#aaa",
      "#bbb",
      "#ccc",
      "#ddd",
      "#eee",
      "#fff",
      {
        ref: "css_named_color",
      },
    ],
  },
  css_class_id: {
    alt: [
      "main",
      "nav",
      "header",
      "footer",
      "aside",
      "article",
      {
        seq: [
          {
            alt: ["row", "col"],
          },
          "-",
          {
            alt: ["sm", "md", "lg"],
          },
        ],
      },
      {
        seq: [
          {
            alt: ["bg", "color"],
          },
          "-",
          {
            ref: "css_named_color",
          },
        ],
      },
    ],
  },
  css_named_color: {
    alt: ["black", "silver", "gray", "white", "red", "green", "blue"],
  },
} as Rules;
