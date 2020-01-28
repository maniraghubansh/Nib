import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { EditorView } from 'prosemirror-view';

import getPluginStyles from '../../utils/editor/styles';
import { buildEditorState, updateEditorState, clearEditorState } from '../../utils/editor/state';
import { getPluginList } from '../../utils/editor/plugins';
import { useConfigContext } from '../../context/config';
import { usePMStateContext } from '../../context/pm-state';

import { StyledEditor } from './styles';

const Editor = ({
  defaultValue,
  autoFocus,
  spellCheck,
  clear,
  addons,
  onChange,
  licenseKey,
}) => {
  const editorRef = useRef(null);
  const {
    config: { heading, plugins, minHeight, editable },
    dispatcher,
  } = useConfigContext();
  const pmstate = usePMStateContext();
  let [view, setView] = useState();
  const viewProvider = () => view;

  const updateViewListeners = () => {
    dispatcher.dispatch(view);
    addons.forEach(addon => {
      addon.viewUpdateCallback(view);
    });
  };

  useEffect(() => {
    if (clear) {
      let view = viewProvider()
      clearEditorState(view, view.state)
    }
  }, [clear])

  useEffect(() => {
    const pluginList = addons.concat(getPluginList(
      `${plugins.options} history common`
    ));
    const state = buildEditorState(heading, pluginList, defaultValue, viewProvider);
    view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction: tr => {
        let editorState = view.state.apply(tr);

        addons.forEach(addon => {
          if (addon.dispatchTransactionCallback)
            editorState = addon.dispatchTransactionCallback(editorState, tr);
        });

        updateEditorState(view, editorState);
        updateViewListeners();
        const serializableState = view.state.toJSON();
        addons.forEach(addon => {
          const { name, getSerializableState } = addon;
          if (getSerializableState)
            serializableState[name] = getSerializableState();
        });
        if (onChange) onChange(serializableState);
      },
      editable: state => {
        return editable;
      }
    });
    if (autoFocus) {
      view.focus();
    }
    addons.forEach(addon => {
      if (addon.createStateFromDoc)
        addon.createStateFromDoc(doc => {
          const editorState = buildEditorState(heading, pluginList, doc);
          view.updateState(editorState);
        });
    });
    updateViewListeners();
    addons.forEach(addon => {
      if (addon.updateLicenseInfo)
        addon.updateLicenseInfo(editorRef.current, licenseKey);
    });
    setView(view);
    return () => view.destroy();
  }, []);

  return (
    <StyledEditor
      // eslint-disable-next-line react/prop-types
      pluginStyles={getPluginStyles(plugins.options, addons)}
      ref={editorRef}
      spellCheck={spellCheck}
      minHeight={minHeight}
    />
  );
};

Editor.propTypes = {
  autoFocus: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  defaultValue: PropTypes.object,
  onChange: PropTypes.func,
  spellCheck: PropTypes.bool,
  clear: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  addons: PropTypes.array,
  licenseKey: PropTypes.string,
};

Editor.defaultProps = {
  autoFocus: false,
  defaultValue: undefined,
  onChange: () => {},
  spellCheck: false,
  clear: false,
  addons: [],
  licenseKey: undefined,
};

export default Editor;
