let CustomMaterial = require("CustomMaterial");
let ShaderEnum = cc.Enum({
});

let ShaderHelper = cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true,
    },

    properties: {
        _shaderObject: null,
        program: {
            type: ShaderEnum,
            default: 0,
            notify(oldValue) {
                if (this.program === oldValue) {
                    return;
                }
                this.applyShader();
            }
        },
    },

    __preload () {
        let array = CustomMaterial.getAllName();
        ShaderHelper.ShaderEnum = CustomMaterial.getShaderEnum();
        cc.Class.Attr.setClassAttr(ShaderHelper, 'program', 'enumList', array);
    },

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
        this.applyShader();
    },

    update(dt) {
        if (CC_EDITOR) {
            return;
        }

        if (this._shaderObject && this._shaderObject.update) {
            this._shaderObject.update(this.sprite, this.material, dt);
        }
    },

    /**
     * 启用Shader
     */
    applyShader() {
        if (CC_EDITOR) {
            return;
        }

        this._shaderObject = CustomMaterial.getShaderByIndex(this.program);
        let sprite = this.sprite;
        let params = this._shaderObject.params;
        let defines = this._shaderObject.defines;
        let material = sprite.getMaterial(this._shaderObject.name);
        
        if (!material) {
            material = new CustomMaterial(this._shaderObject.name, params, defines || []);
            sprite.setMaterial(this._shaderObject.name, material);
        }
        this.material = material;

        sprite.activateMaterial(this._shaderObject.name);

        //设置Shader参数初值
        if (params) {
            params.forEach((item) => {
                if (item.defaultValue !== undefined) {
                    material.setParamValue(item.name, item.defaultValue);
                }
            });
        }

        if (this._shaderObject.start) {
            this._shaderObject.start(sprite, material);
        }
    },
});