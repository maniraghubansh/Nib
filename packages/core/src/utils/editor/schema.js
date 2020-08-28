import { Schema } from "prosemirror-model";
import { marks, nodes as nibNodes } from "nib-schema";
import mention from '../../plugins/mention/schema'
import tag from '../../plugins/tag/schema'

const title = {
  attrs: { error: {default: false} },
  content: "inline*",
  group: "block",
  defining: true,
  allowGapCursor: true,
};

const description = {
  content: "paragraph block*",
  group: "block",
  defining: true,
  allowGapCursor: true,
  toDOM() {
    return ['section', 0]
  }
};

const estimate = {
  attrs: { error: {default: false} },
  content: "inline*",
  group: "block",
  defining: true,
  allowGapCursor: true,
};

const userNode = {
  content: "mention* text*",
  attrs: {error: {default: false}},
  group: "block",
  allowGapCursor: true,
  toDOM() {
    return ["p", 0];
  }
}

const task = {
  content: "title description userNode estimate",
  attrs: {root: {default: false}, parent: {default: false}},
  group: "block",
  defining: true,
  allowGapCursor: true,
  toDOM() {
    return ['div', 0]
  }
};

const body = {
  content: "paragraph block*",
  group: "block",
  defining: true,
  allowGapCursor: true,
  toDOM() {
    return ['section', 0]
  }
};

const taskDoc = {
  content: "task",
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

  plugins
    .filter(p => p.node)
    .forEach(p => {
    schema.nodes[p.node.name] = p.node.spec
  })
  // console.log(`NibNodes = ${JSON.stringify(nibNodes)}`)
  schema.nodes['title'] = title;
  schema.nodes['description'] = description;
  schema.nodes['estimate'] = estimate;
  schema.nodes['task'] = task;
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
