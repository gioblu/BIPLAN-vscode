const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    const systemFunctions = [
        {
            label: 'while',
            detail: 'While loop',
            documentation:
                '`while` if the condition is truthy forces the cyclical execution of the following statements until `next` is encountered.'
        },
        {
            label: 'for',
            detail: 'For loop',
            documentation:
                '`for` is a cycle that supports a single local variable identified by `#` that can be set with an initial value and a limit value that is specified after `to`. Optionally the increment or decrement value can be configured after `step`.'
        },
        {
            label: 'adc read', detail: 'Reads analog to digital converter input', documentation: "`adc read` returns the current value from an analog input channel of the machine. \n\n Example: `print adc read 0` \n\n Prints voltage sampled from ADC 0."
        },
        { label: 'break', detail: 'Interrupt iteration', documentation: '`break` interrupts the iteration within a `for` or a `while` and all following statements are ignored.', kind: vscode.CompletionItemKind.Text, insertText: 'break' },
        { label: 'continue', detail: 'Go to next iteration', documentation: '`continue` interrupts the iteration within a `for` or a `while`, all following statements are ignored and a new iteration is initiated.' },
        { label: 'args', detail: 'Access command line arguments', documentation: '`args` returns the array of command line arguments passed to the program.\n\n Example: `print args[0]`\n\n Prints the first argument passed to the program.' },
        { label: 'print char', detail: 'Convert number into character', documentation: '`char` is a modifier of the `print` system function, converts numbers into characters.\n\n Example: `print char 64`\n\n Prints @.' },
        { label: 'print cursor', detail: 'Cursor control', documentation: '`cursor` is a modifier of the `print` system function, controls the position of the cursor. \n\n Example: `print cursor 0, 0` \n\n Moves the cursor to x = 0, y = 0' },
        { label: 'delay', detail: 'Pause execution', documentation: '`delay` delays execution for a specified number of milliseconds. \n\n Example: `delay 1000` \n\n Delays execution for 1 second' },
        { label: 'file close', detail: 'Close an open file', documentation: '`file close` closes a previously opened file and frees associated resources. It receives a single parameter, the pointer to file. \n\n Example: `file close @f` \n\n Closes file' },
        {
            label: 'file open', detail: 'Open a file', documentation: '`file open` opens a file. It receives two parameters, the file path and the mode. It returns the memory address to the file. \n\n `@f = file open "test.txt", 0` \n\n Opens the test.txt file in reading mode. \n\n Available modes: 0 read (r), 1 read binary (rb), 2 read write (r+), 3 read write binary (rb+), 4 write (w), 5 write binary (wb), 6 write read (w+), 7 write read binary (wb+), 8 append (a), 9 append binary (ab), 10 append read write (a+), 11 append binary read write (ab+)'
        },
        { label: 'file read', detail: 'Read from a file', documentation: '`file read` reads data from a file. It receives one parameter, the memory address. \n\n Example: `@c = file read @f` \n\n Returns one character from file.' },
        { label: 'file write', detail: 'Write to a file', documentation: '`file write` writes data to an open file handle. It receives two parameters, the memory address and the value to be written in the file. \n\n Example: `file write @f, "Hello world!"` \n\n Writes Hello world! in file' },
        { label: 'include', detail: 'Include source file', documentation: '`include` includes another BIPLAN source file. \n\n Example: `include "another_file.biplan"` \n\n If you want to include files from the standard library, on LINUX and OSX are present in `/usr/local/BIPLAN/`. ' },
        { label: 'index', detail: 'Index retrieval', documentation: '`index` receives a single parameter of type numeric variable or string. Returns the memory address of the variable received. \n\n Example: `@aa = 5 @b  = 9 print index @aa` \n\n Prints 0' },
        { label: 'input', detail: 'Read input', documentation: '`input` returns the input, it blocks the execution until a carriage return is detected, then it returns one character at a time.' },
        { label: 'input read', detail: 'Read input', documentation: '`input read` returns one character from input immediately or -1 if no input is received.' },

        { label: 'io open', detail: 'Open I/O interface', documentation: '`io open` receives two parameters, the pin number and the mode (0 or `INPUT`, 1 or `OUTPUT`). Sets the mode of a digital I/O pin.\n\n Example: `io open 12, OUTPUT` \n\n Sets pin 2 as an output pin.' },
        { label: 'io read', detail: 'Read I/O', documentation: '`io read` receives a single parameter, the pin number. Reads a digital I/O pin, it returns 0 or 1.\n\n Example: `io read 12` \n\n Reads pin 12.' },
        { label: 'io write', detail: 'Write I/O', documentation: '`io write` receives two parameters, the pin number and the state (0 or `LOW`, 1 or `HIGH`). Sets the state of a digital I/O pin.\n\n Example: `io write 12, HIGH` \n\n Writes `HIGH` to pin 12.' },
        { label: 'mem', detail: 'Memory access', documentation: '`mem` can read or write one byte of memory. \n\n Example: `mem[0] = 1 print mem[0]` \n\n Prints 1' },
        { label: 'millis', detail: 'Milliseconds timer', documentation: '`millis` returns the number of milliseconds elapsed since system start. \n\n Example: `print millis` \n\n Prints time elapsed since start up.' },
        { label: 'number', detail: 'Number processing functions', documentation: '`number` converts a string, string literal or argument to an integer and returns its value. \n\n Example: `:test = "123" print number :test + 1` \n\n Prints 124' },
        { label: 'random', detail: 'Random number generator', documentation: '`random` receives a single parameter, the exclusive maximum value. Returns a randomly generated number. \n\n Example: `print random 10` \n\n Prints a number between 0 and 9.' },
        { label: 'restart', detail: 'Restart execution', documentation: '`restart` Restarts program execution or the system.' },
        { label: 'serial open', detail: 'Open serial port', documentation: '`serial open` initializes the serial port. \n\n Example: `serial open "COM1", 9600` \n\n Opens serial COM1 at 9600Bd' },
        { label: 'serial read', detail: 'Read serial port', documentation: '`serial read` returns the value received via serial or -1 if no value is received.' },
        { label: 'serial write', detail: 'Write serial port', documentation: '`serial write` Receives a single parameter of type number or variable or string. Transmits the value via serial. \n\n Example: `serial write "Hello world!"` \n\n Sends "Hello World!" via serial.' },
        { label: 'size', detail: 'Size retrieval', documentation: '`size` returns the size or length of a variable.' },
        { label: 'stop', detail: 'Stop execution', documentation: '`stop` stops the execution of the program.' },
        { label: 'string', detail: 'String conversion', documentation: '`string` converts a variable or a number to a string. It receives the number to be converted, the string where to save the conversion and optionally the position where to start writing. \n\n Example: `string 123, :str` \n\n Converts 123 to a string and saves it in `:str`.' },
        { label: 'system', detail: 'Invoke an operating system command', documentation: '`system` invokes an operating system command to the host environment, returns after the command has been completed.' }
    ];

    const provider = vscode.languages.registerCompletionItemProvider(
        'biplan',
        {
            provideCompletionItems() {
                return systemFunctions.map(fn => {
                    const item = new vscode.CompletionItem(fn.label, vscode.CompletionItemKind.Function);
                    if (fn.label === 'for') {
                        item.insertText = new vscode.SnippetString(
                            'for #i = 0 to 100 \n  print #i \nnext'
                        );
                    } else if (fn.label === 'while') {
                        item.insertText = new vscode.SnippetString(
                            'while ++@i < 100\n  print @i\nnext'
                        );
                    } else {
                        // Default: insert label + parentheses snippet
                        item.insertText = fn.insertText;
                    }

                    item.detail = fn.detail;
                    item.documentation = new vscode.MarkdownString(fn.documentation);
                    return item;
                });
            }
        },
        ' ', '('
    );

    context.subscriptions.push(provider);

    const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (document.fileName.endsWith('.biplan')) {
            let terminal = vscode.window.terminals.find(t => t.name === 'BIPLAN Terminal');
            if (!terminal) {
                terminal = vscode.window.createTerminal('BIPLAN Terminal');
            }
            terminal.sendText('bcc ' + document.fileName + ' ' + document.fileName.split('.biplan')[0] + '.bip', true);
            terminal.sendText('biplan -i ' + document.fileName.split('.biplan')[0] + '.bip -d');
            terminal.show();
        }
    });

    context.subscriptions.push(saveListener);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
