import React, { useEffect, useRef, useState } from 'react';
import './Editor.css';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

function Editor() {
  const defaultText = `
Marked - Markdown Parser
========================
[Marked] lets you convert [Markdown] into HTML. Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML. This demo page will let you type anything you like and see how it gets converted. Live. No more waiting around.

How To Use The Demo
-------------------
1. Type in stuff on the left.
2. See the live updates on the right.

That's it. Pretty simple. There's also a drop-down option above to switch between various views:
- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.
[Marked] lets you convert [Markdown](https://marked.js.org/) into HTML.
![Image](https://via.placeholder.com/150)

Inline code example: \`inline code\`.

Code block example:
\`\`\`js
const example = "code block";
\`\`\`

Blockquote example:
> This is a blockquote in markdown.
`;


  const [currentLine, setCurrentLine] = useState(defaultText);
  const [previewContent, setPreviewContent] = useState("");
  const textInputRef = useRef();

  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
  })

  const renderMarkdown = (text) => {
    const parsedHTML = marked.parse(text);
    return DOMPurify.sanitize(parsedHTML, {
      USE_PROFILES: { html: true },
    });
  };

  useEffect(() => {
    setPreviewContent(renderMarkdown(currentLine));
    textInputRef.current.focus();
  }, [currentLine]);
  
  const handleChange = (event) => {
    const inputText = event.target.value;
    setCurrentLine(inputText);
    setPreviewContent(DOMPurify.sanitize(marked.parse(inputText)));
  };

  return (
    <div id='container'>
      <div id="editor">
        <label className='label'>Editor</label>
        <textarea 
          ref={textInputRef}
          className='textEditor' 
          value={currentLine}
          onChange={handleChange}
        />
      </div>  
      <div id="preview">
        <label className='label'>Previewer</label>
        <div 
          id="textPreview" 
          dangerouslySetInnerHTML={{ __html: previewContent }} 
        />
      </div>
     </div>
  );
}

export default Editor;
