(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('OutSideStage must run unsandboxed.');
    }

    class OutSideStage {
        constructor() {
            this.vm = Scratch.vm;
            this.runtime = this.vm.runtime;
        }

        getInfo() {
            return {
                id: 'outsidestage',
                name: 'OutSideStage',
                color1: '#5B8CFF',
                color2: '#4776E6',
                color3: '#315FC7',
                blocks: [
                    {
                        opcode: 'disableFencing',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'allow sprites outside stage'
                    },
                    {
                        opcode: 'enableFencing',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'keep sprites inside stage'
                    },
                    {
                        opcode: 'fencingEnabled',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'stage fencing enabled?'
                    },
                    {
                        opcode: 'goToXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'go to X [X] Y [Y] without fencing',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set X to [X] without fencing',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set Y to [Y] without fencing',
                        arguments: {
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'changeX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change X by [X] without fencing',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: 'changeY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change Y by [Y] without fencing',
                        arguments: {
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    }
                ]
            };
        }

        disableFencing() {
            if (this.runtime.runtimeOptions.fencing === false) return;
            this.vm.setRuntimeOptions({fencing: false});
        }

        enableFencing() {
            if (this.runtime.runtimeOptions.fencing === true) return;
            this.vm.setRuntimeOptions({fencing: true});
        }

        fencingEnabled() {
            return !!this.runtime.runtimeOptions.fencing;
        }

        goToXY(args, util) {
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(x, y);
            }
        }

        setX(args, util) {
            const x = Scratch.Cast.toNumber(args.X);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(x, util.target.y);
            }
        }

        setY(args, util) {
            const y = Scratch.Cast.toNumber(args.Y);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(util.target.x, y);
            }
        }

        changeX(args, util) {
            const amount = Scratch.Cast.toNumber(args.X);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(util.target.x + amount, util.target.y);
            }
        }

        changeY(args, util) {
            const amount = Scratch.Cast.toNumber(args.Y);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(util.target.x, util.target.y + amount);
            }
        }
    }

    Scratch.extensions.register(new OutSideStage());
})(Scratch);
