# BIPLAN-vscode

The BIPLAN-vscode extension implements basic syntax highlitghting for the BIPLAN programming language. This extension is designed to enhance readability and improve coding efficiency by visually marking keywords, operators, variables, functions, and other BIPLAN language constructs.

![example](/example.png)

## Installation

For now I do not plan to distribute this extension on the the marketplace but this directory contains everything you need to use BIPLAN syntax highlitghting.

### Linux / OSX
Drop this directory in: `~/.vscode/extensions/`.

### Windows
Drop this directory in: `C:\Users\<User>\.vscode\extensions\` where `<User>` corresponds to your username.

Open a terminal in this directory and execute:
1. `npm install -g vsce`
2. `vsce package`

If successful this built the extension that is now ready to be installed. Install the extension with the following command: `code --install-extension C:\Users\<User>\.vscode\extensions\biplan-vscode-0.0.1.vsix` where `<User>` corresponds to your username.

## Usage

Once installed, open BIPLAN source files with `.biplan` and the syntax highlighting will be automatically applied.

## Supported Editors

- Visual Studio Code

## Contribution

Contributions to improve the syntax highlighting rules or add support for more editors are welcome. Please submit pull requests or issues on the repository.
