const body = {
  content: "paragraph block*",
  group: "block",
  defining: true,
  parseDOM: [{ tag: 'section' },
  ],
  toDOM() {
    return ['section', 0]
  }
};

export default body;
