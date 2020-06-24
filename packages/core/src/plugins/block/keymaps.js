import { Selection, TextSelection } from "prosemirror-state";
import { setBlockType } from "prosemirror-commands";

const changeBlockType = (blockTypeName, attrs) => (state, dispatch) => {
  const blockType = state.schema.nodes[blockTypeName];
  return setBlockType(blockType, attrs)(state, dispatch);
};

export default () => ({
  "Mod-Alt-0": (state, dispatch) =>
    changeBlockType("paragraph")(state, dispatch),
  "Mod-Alt-1": (state, dispatch) =>
    changeBlockType("heading", { level: 1 })(state, dispatch),
  "Mod-Alt-2": (state, dispatch) =>
    changeBlockType("heading", { level: 2 })(state, dispatch),
  "Mod-Alt-3": (state, dispatch) =>
    changeBlockType("heading", { level: 3 })(state, dispatch),
  "Mod-Alt-4": (state, dispatch) =>
    changeBlockType("heading", { level: 4 })(state, dispatch),
  "Mod-Alt-5": (state, dispatch) =>
    changeBlockType("heading", { level: 5 })(state, dispatch),
  "Mod-Alt-6": (state, dispatch) =>
    changeBlockType("heading", { level: 6 })(state, dispatch),
  "Enter": (state, dispatch) => {
    if (state.doc.firstChild.type.name !== "task") return false;
    let currentNodeIndex = state.selection.$head.index(1)

    if (currentNodeIndex === 3) {
      // onTaskNavigation("Cmd-Down");
      return false;
    } else {
      let newPos = 0;
      for (let i = 0; i <= currentNodeIndex + 1; i++) {
        newPos = state.doc.firstChild.content.child(i).nodeSize + newPos
      }
      if (currentNodeIndex == 0) {
        newPos = newPos - 2
      } else {
        newPos = newPos - 1
      }
      // let nextNode = state.doc.content.child(currentNodeIndex + 1)
      // const textSelection = new TextSelection(
      //   Selection.atEnd(state.doc).$head,
      //   Selection.atEnd(state.doc).$head
      // );
      const textSelection = TextSelection.near(state.doc.resolve(newPos))
      // console.log(`State: ${JSON.stringify(state.toJSON())}`)
      dispatch(state.tr.setSelection(textSelection).scrollIntoView());
      // console.log(`State: ${JSON.stringify(state.toJSON())}`)
      // setTimeout(function() {view.focus()}, 100)
    }
    return true;
    // console.log(`cu`)
    if ((state.doc.content.firstChild && state.doc.content.firstChild.type.name == 'heading') &&
      (state.selection.$anchor.parent === state.doc.content.firstChild)) {
      const textSelection = new TextSelection(
        Selection.atEnd(state.doc).$head,
        Selection.atEnd(state.doc).$head
      );
      dispatch(state.tr.setSelection(textSelection));
      return true;
    } else {
      return false;
    }
  }
});

export const KeymapInfo = {
  p: { key: "Mod-Alt-0", label: "Paragraph" },
  h1: { key: "Mod-Alt-1", label: "Heading1" },
  h2: { key: "Mod-Alt-2", label: "Heading2" },
  h3: { key: "Mod-Alt-3", label: "Heading3" },
  h4: { key: "Mod-Alt-4", label: "Heading4" },
  h5: { key: "Mod-Alt-5", label: "Heading5" },
  h6: { key: "Mod-Alt-6", label: "Heading6" }
};
