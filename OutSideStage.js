(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('OutSideStage must run unsandboxed.');
    }

    class OutSideStage {
        constructor() {
            this.vm = Scratch.vm;
            this.runtime = this.vm.runtime;
            this.originalSetXY = null;
            this.targetPrototype = null;
            this.enabled = false;
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
                            X: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0},
                            Y: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}
                        }
                    },
                    {
                        opcode: 'setX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set X to [X] without fencing',
                        arguments: {
                            X: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}
                        }
                    },
                    {
                        opcode: 'setY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set Y to [Y] without fencing',
                        arguments: {
                            Y: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}
                        }
                    },
                    {
                        opcode: 'changeX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change X by [X] without fencing',
                        arguments: {
                            X: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10}
                        }
                    },
                    {
                        opcode: 'changeY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change Y by [Y] without fencing',
                        arguments: {
                            Y: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10}
                        }
                    }
                ]
            };
        }

        getTargetPrototype() {
            if (this.targetPrototype) return this.targetPrototype;

            const target = this.runtime.targets.find(t =>
                t && !t.isStage && typeof t.setXY === 'function'
            );

            if (!target) return null;

            this.targetPrototype = Object.getPrototypeOf(target);
            return this.targetPrototype;
        }

        disableFencing() {
            if (this.enabled) return;

            const prototype = this.getTargetPrototype();
            if (!prototype || typeof prototype.setXY !== 'function') return;

            if (!this.originalSetXY) {
                this.originalSetXY = prototype.setXY;
            }

            const extension = this;

            prototype.setXY = function (x, y, force) {
                if (this.isStage || (this.dragging && !force)) return;

                const oldX = this.x;
                const oldY = this.y;

                if (this.renderer) {
                    this.x = x;
                    this.y = y;
                    this.renderer.updateDrawablePosition(this.drawableID, [x, y]);

                    if (this.visible) {
                        this.emitVisualChange();
                        this.runtime.requestRedraw();
                    }
                } else {
                    this.x = x;
                    this.y = y;
                }

                if (this.onTargetMoved) {
                    this.onTargetMoved(this, oldX, oldY, force);
                }

                this.runtime.requestTargetsUpdate(this);
            };

            this.enabled = true;
        }

        enableFencing() {
            if (!this.enabled) return;

            const prototype = this.targetPrototype;
            if (prototype && this.originalSetXY) {
                prototype.setXY = this.originalSetXY;
            }

            this.enabled = false;
        }

        fencingEnabled() {
            return !this.enabled;
        }

        goToXY(args, util) {
            this.disableFencing();

            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(x, y);
            }
        }

        setX(args, util) {
            this.disableFencing();

            const x = Scratch.Cast.toNumber(args.X);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(x, util.target.y);
            }
        }

        setY(args, util) {
            this.disableFencing();

            const y = Scratch.Cast.toNumber(args.Y);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(util.target.x, y);
            }
        }

        changeX(args, util) {
            this.disableFencing();

            const amount = Scratch.Cast.toNumber(args.X);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(util.target.x + amount, util.target.y);
            }
        }

        changeY(args, util) {
            this.disableFencing();

            const amount = Scratch.Cast.toNumber(args.Y);

            if (util && util.target && typeof util.target.setXY === 'function') {
                util.target.setXY(util.target.x, util.target.y + amount);
            }
        }
    }

    Scratch.extensions.register(new OutSideStage());
})(Scratch);
