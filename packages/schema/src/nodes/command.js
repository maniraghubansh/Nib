/**
 * See https://prosemirror.net/docs/ref/#model.NodeSpec
 */
export const command = {
  group: "inline",
  inline: true,
  atom: true,

  attrs: {
    id: "",
    name: "",
    displayName: "",
    description: ""
  },

  selectable: false,
  draggable: false,

  toDOM: node => {
    return [
      "span",
      {
        "data-command-id": node.attrs.id,
        "data-command-name": node.attrs.name,
        "data-command-display-name": node.attrs.displayName,
        "data-command-description": node.attrs.description,
        class: "prosemirror-mention-node"
      },
      node.attrs.displayName
    ];
  },

  // parseDOM: [
  //   {
  //     // match tag with following CSS Selector
  //     tag: "span[data-mention-id][data-mention-name][data-mention-email][data-mention-email]",

  //     getAttrs: dom => {
  //       var id = dom.getAttribute("data-mention-id");
  //       var name = dom.getAttribute("data-mention-name");
  //       var email = dom.getAttribute("data-mention-email");
  //       var avatar = dom.getAttribute("data-mention-avatar")
  //       return {
  //         id: id,
  //         name: name,
  //         email: email,
  //         avatar: avatar
  //       };
  //     }
  //   }
  // ]
};
