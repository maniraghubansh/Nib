/**
 * See https://prosemirror.net/docs/ref/#model.NodeSpec
 */
export const mention = {
  group: "inline",
  inline: true,
  atom: true,

  attrs: {
    id: "",
    name: "",
    email: "",
    avatar: ""
  },

  selectable: false,
  draggable: false,

  toDOM: node => {
    return [
      "span",
      {
        "data-mention-id": node.attrs.id,
        "data-mention-name": node.attrs.name,
        "data-mention-email": node.attrs.email,
        "data-mention-avatar": node.attrs.avatar,
        class: "prosemirror-mention-node"
      },
      "@" + node.attrs.name || node.attrs.email
    ];
  },

  parseDOM: [
    {
      // match tag with following CSS Selector
      tag: "span[data-mention-id][data-mention-name][data-mention-email][data-mention-email]",

      getAttrs: dom => {
        var id = dom.getAttribute("data-mention-id");
        var name = dom.getAttribute("data-mention-name");
        var email = dom.getAttribute("data-mention-email");
        var avatar = dom.getAttribute("data-mention-avatar")
        return {
          id: id,
          name: name,
          email: email,
          avatar: avatar
        };
      }
    }
  ]
};
