// codemirror-matlab.ts

export function MATLAB_mode(CodeMirror: any) {
  CodeMirror.defineMode("matlab", (config: any) => {
    return {
      startState: () => ({}),
      token: (stream: any, state: any) => {
        if (stream.match(/%[^\n]*/)) {
          return 'comment';
        }
        if (stream.match(/'[^']*'/)) {
          return 'string';
        }
        if (stream.match(/\b(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\b/)) {
          return 'number';
        }
        if (stream.match(/\b(if|else|elseif|end|for|while|break|continue|return|function)\b/)) {
          return 'keyword';
        }
        if (stream.match(/[+\-*/^=<>~]/)) {
          return 'operator';
        }
        if (stream.match(/[a-zA-Z_]\w*/)) {
          return 'variable';
        }
        stream.next();
        return null;
      }
    };
  });

  CodeMirror.defineMIME("text/x-matlab", "matlab");
}
