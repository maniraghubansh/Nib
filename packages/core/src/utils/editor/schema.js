import { Schema } from "prosemirror-model";
import { marks, nodes as nibNodes } from "nib-schema";
import mention from '../../plugins/mention/schema'
import tag from '../../plugins/tag/schema'

const body = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: 'section' },
  ],
  toDOM() {
    return ['section', 0]
  }
};

export default plugins => {
  const schema = plugins
    .map(p => p && p.schema)
    .reduce(
      (result, s) => {
        const newResult = result;
        if (s) {
          newResult.nodes = [...result.nodes, ...(s.nodes || [])];
          newResult.marks = [...result.marks, ...(s.marks || [])];
        }
        return newResult;
      },
      { nodes: ["paragraph"], marks: [] }
    );
  schema.marks = schema.marks.reduce((result, mark) => {
    const newResult = result;
    newResult[mark] = marks[mark];
    return newResult;
  }, {});
  schema.nodes = schema.nodes.reduce((result, node) => {
    const newResult = result;
    newResult[node] = nibNodes[node];
    return newResult;
  }, {});
  console.log(`NibNodes = ${JSON.stringify(nibNodes)}`)
  schema.nodes['body'] = body;
  schema.nodes['mention'] = mention;
  schema.nodes['tag'] = tag;
  console.log(`Schema = ${JSON.stringify(schema)}`)
  return new Schema(schema);
};
