import 'ace-builds/src-noconflict/ace'; // mysql模式的包
import 'ace-builds/src-noconflict/mode-yaml'; // pg模式包
import "../themes/VsDark"
import React from 'react';
import PikaAceEditor from "@/components/CodeEditor/AceEditor/index";

export default function YamlAceEditor(props) {
  return <PikaAceEditor {...props} langugae="yaml" theme="vs-dark"/>;
}

