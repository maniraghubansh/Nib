const codeDOM = ["code",{class: 'prosemirror-code-node'}, 0];
const code = {
  parseDOM: [{ tag: "code" }],
  toDOM() {
    return codeDOM;
  }
};

export default code;
