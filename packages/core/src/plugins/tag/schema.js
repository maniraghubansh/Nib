/**
 * See https://prosemirror.net/docs/ref/#model.NodeSpec
 */
export const tag = {
  group: "inline",
  inline: true,
  atom: true,

  attrs: {
    id: "",
    tag: ""
  },

  selectable: false,
  draggable: false,

  toDOM: node => {
    return [
      "span",
      {
        "data-tag": node.attrs.tag,
        "data-id": node.attrs.id,
        class: "prosemirror-tag-node"
      },
      "#" + node.attrs.tag
    ];
  },

  parseDOM: [
    {
      // match tag with following CSS Selector
      tag: "span[data-tag][data-id]",

      getAttrs: dom => {
        var tag = dom.getAttribute("data-tag");
        var id = dom.getAttribute("data-id")
        return {
          id: id,
          tag: tag
        };
      }
    }
  ]
};

export default tag
