


/** 'keyManager.js' */

class KeyManager {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------

    static NAME = "key-manager";
    static CMD_KEY_DOWN = 0;
    static CMD_KEY_UP = 1;
    static DEFAULT_CONTEXT = 'general';
    static DEFAULT_SUB = '-';

    //----------------------------- PROPERTIES -----------------------------

    #contexts = {};
    #shortcuts = {};
    #commands = {};
    #current = {};
    #keysPressed = [];

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(configuration) {
        if(configuration) this.init(configuration);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #key(...k) {
        let res = '';
        k.forEach(i => res += i);
        return res;
    }

    #getKeyCode(key) {
        return key.charCodeAt(0) - 32;
    }

    #findCommandKeys(command) {
        Object.entries(this.#shortcuts).forEach( e => {
            if(e[1].command[KeyManager.CMD_KEY_DOWN] == command) {
                return e[0];
            }
        });
    }

    #addKey(key) {
        if(this.#keysPressed.indexOf(key) === -1) {
            this.#keysPressed.push(key);
        }
        this.#current.keys = this.#key(this.#keysPressed);
    }

    #delKey(key) {
        let keyIdx = this.#keysPressed.indexOf(key);
        if(keyIdx != -1) {
            this.#keysPressed.splice(keyIdx, 1);
            this.#current.keys = this.#key(this.#keysPressed);
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init(configuration) {
        this.#contexts = configuration.contexts;
        this.#shortcuts = configuration.shortcuts;
        this.#commands = configuration.commands;
        this.#current.context = KeyManager.DEFAULT_CONTEXT;
        this.#current.sub = KeyManager.DEFAULT_SUB;
    }

    clearKeys() {
        this.#keysPressed = [];
        this.#current.keys = this.#key(this.#keysPressed);
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    getCommand({down, up}) {
        if(down) this.#addKey(down);
        if(up) this.#delKey(up);

        if(this.#current.keys) {
            if(this.#shortcuts[this.#current.context]) {
                if(this.#shortcuts[this.#current.context][this.#current.sub]) {
                    let contextKey = this.#shortcuts[this.#current.context][this.#current.sub];
                    if(contextKey[this.#current.keys]) {
                        if(this.#current.command != contextKey[this.#current.keys].command) {
                            let command = [];
                            if(this.#current.command) {
                                if(this.#current.command[KeyManager.CMD_KEY_UP]) {
                                    command.push( {
                                        event: this.#current.command[KeyManager.CMD_KEY_UP],
                                        description: this.#commands[this.#current.context][this.#current.sub][this.#current.command[KeyManager.CMD_KEY_UP]]
                                    });
                                }
                                this.#current.command = undefined;
                            }
                            this.#current.command = contextKey[this.#current.keys].command;
                            if(this.#current.command[KeyManager.CMD_KEY_DOWN]) {
                                command.push( {
                                    event: this.#current.command[KeyManager.CMD_KEY_DOWN],
                                    description: this.#commands[this.#current.context][this.#current.sub][this.#current.command[KeyManager.CMD_KEY_DOWN]]
                                });
                            }
                            return command;
                        }
                        return undefined;
                    }
                }
            }
        }
        
        if(this.#current.command) {
            let command = [];
            if(this.#current.command[KeyManager.CMD_KEY_UP]) {
                command.push({
                    event: this.#current.command[KeyManager.CMD_KEY_UP],
                    description: this.#commands[this.#current.context][this.#current.sub][this.#current.command[KeyManager.CMD_KEY_UP]],
                });
            }
            this.#current.command = undefined;
            return command;
        }
    }

    get context() { return { context: this.#current.context, sub: this.#current.sub }; }
    setContext({context, sub}) {
        context = context || KeyManager.DEFAULT_CONTEXT;
        sub = sub || KeyManager.DEFAULT_SUB;
        this.#current = { context, sub };
    }
    
    get shortcuts() { this.#shortcuts; }
    set shortcuts({context, sub, command, keys}) {
        if(this.#shortcuts[context]) {
            if(this.#shortcuts[context][sub]) {
                let oldKeys = this.#findCommandKeys(command);
                if(oldKeys) {
                    this.#shortcuts[context][sub][this.#key(keys)] = this.#shortcuts[context][sub][oldKeys];
                    delete this.#shortcuts[context][sub][oldKeys];
                }
            }
        }
    }
}