const link = {
  attrs: {
    href: {}
  },
  inclusive: false,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs(dom) {
        return {
          href: dom.getAttribute("href")
        };
      }
    }
  ],
  toDOM(node) {
    return [
      "a",
      {
        ...node.attrs,
        class: 'prosemirror-link-node',
      },
      0
    ];
  }
};

export default link;
