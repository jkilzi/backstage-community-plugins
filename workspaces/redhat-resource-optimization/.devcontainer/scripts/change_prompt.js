const fs = require('node:fs');

const FILE = '/home/vscode/.oh-my-zsh/custom/themes/devcontainers.zsh-theme';
const theme = fs
    .readFileSync(FILE)
    .toString()
    .replace(
        /PROMPT\+=('%\{\$fg\[white\]%\}\$ %\{\$reset_color%\}')$/gm,
        "PROMPT+=$$'\\n'$1"
    );
fs.writeFileSync(FILE, theme);
