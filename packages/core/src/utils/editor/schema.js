import { Schema } from "prosemirror-model";
import { marks, nodes as nibNodes } from "nib-schema";
import mention from '../../plugins/mention/schema'
import tag from '../../plugins/tag/schema'

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

const userNode = {
  content: "mention* text*",
  group: "block",
  toDOM() {
    return ["p", 0];
  }
}

const taskDoc = {
  content: "heading body heading userNode",
  group: "block"
}

const discussionDoc = {
  content: "heading body",
  group: "block"
};

const commentDoc = {
  content: "body",
  group: "block"
};

export default (type, plugins) => {
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
  // console.log(`NibNodes = ${JSON.stringify(nibNodes)}`)
  schema.nodes['body'] = body;
  schema.nodes['mention'] = mention;
  schema.nodes['tag'] = tag;
  schema.nodes['userNode'] = userNode;
  let docNode = null;
  if(type == 'discussion') {
    docNode = discussionDoc;
  } else if (type == 'comment') {
    docNode = commentDoc;
  } else if (type == 'task') {
    docNode = taskDoc;
  }
  schema.nodes['doc'] = docNode;
  // console.log(`Schema = ${JSON.stringify(schema)}`)
  return new Schema(schema);
};
