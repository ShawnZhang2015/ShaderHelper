let ShaderHelper = require('ShaderHelper');
cc.Class({
    extends: cc.Component,
    properties: {
      
    },

    start () {

    },

    createSprite() {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        node.parent = this.node;
        node.name = 'image';
        cc.loader.load({uuid:'eee7c902-130c-498b-ad6f-f53387adcc7e' }, (err, spriteFrame) => {
            sprite.spriteFrame = spriteFrame;
            this.imageNode = sprite.node;
        });
    },

    setShader() {
        if (!this.imageNode) {
            cc.log('节点不存在，请先创建精灵节点');
        }
        let shaderHelper = this.imageNode.getComponent(ShaderHelper);
        if (!shaderHelper) {
            shaderHelper = this.imageNode.addComponent(ShaderHelper);
        }
        shaderHelper.program = Math.min(shaderHelper.program + 1, 13);
    }

    // update (dt) {},
});
