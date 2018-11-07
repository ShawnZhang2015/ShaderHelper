/**
 * 自定义材质
 */

const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;
const Material = renderEngine.Material;

var CustomMaterial = (function (Material$$1) {
	function CustomMaterial(shaderName, params, defines) {
		Material$$1.call(this, false);

		var pass = new renderer.Pass(shaderName);
		pass.setDepth(false, false);
		pass.setCullMode(gfx.CULL_NONE);
		pass.setBlend(
			gfx.BLEND_FUNC_ADD,
			gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
			gfx.BLEND_FUNC_ADD,
			gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
		);

		var techParams = [
			{ name: 'texture', type: renderer.PARAM_TEXTURE_2D },
			{ name: 'color', type: renderer.PARAM_COLOR4 }
		];
		if (params) {
			techParams = techParams.concat(params);
		}
		var mainTech = new renderer.Technique(
			['transparent'],
			techParams,
			[pass]
		);

		this.name = shaderName;
		this._color = { r: 1, g: 1, b: 1, a: 1 };
		this._effect = new renderer.Effect(
			[
				mainTech
			],
			{},
			defines,
		);

		this._mainTech = mainTech;
		this._texture = null;
	}

	if (Material$$1) CustomMaterial.__proto__ = Material$$1;
	CustomMaterial.prototype = Object.create(Material$$1 && Material$$1.prototype);
	CustomMaterial.prototype.constructor = CustomMaterial;

	var prototypeAccessors = { effect: { configurable: true }, texture: { configurable: true }, color: { configurable: true } };

	prototypeAccessors.effect.get = function () {
		return this._effect;
	};

	prototypeAccessors.texture.get = function () {
		return this._texture;
	};

	prototypeAccessors.texture.set = function (val) {
		if (this._texture !== val) {
			this._texture = val;
			this._effect.setProperty('texture', val.getImpl());
			this._texIds['texture'] = val.getId();
		}
	};

	prototypeAccessors.color.get = function () {
		return this._color;
	};

	prototypeAccessors.color.set = function (val) {
		var color = this._color;
		color.r = val.r / 255;
		color.g = val.g / 255;
		color.b = val.b / 255;
		color.a = val.a / 255;
		this._effect.setProperty('color', color);
	};

	CustomMaterial.prototype.clone = function clone() {
		var copy = new CustomMaterial();
		copy.texture = this.texture;
		copy.color = this.color;
		copy.updateHash();
		return copy;
	};

	// 设置自定义参数的值
	CustomMaterial.prototype.setParamValue = function (name, value) {
		this._effect.setProperty(name, value);
    };
   
    // 获取自定义参数的值
    CustomMaterial.prototype.getParamValue = function (name) {
		return this._effect.getProperty(name);
	};

	// 设置定义值
	CustomMaterial.prototype.setDefine = function (name, value) {
		this._effect.define(name, value);
	};

	Object.defineProperties(CustomMaterial.prototype, prototypeAccessors);

	return CustomMaterial;
}(Material));

let g_shaders = {};
CustomMaterial.addShader = function(shader) {
    if (g_shaders[shader.name]) {
        console.log("addShader - shader already exist: ", shader.name);
        return;
    }
    cc.renderer._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines || []);
    g_shaders[shader.name] = shader;
}
//取Shader的定义
CustomMaterial.getShader = function(name) {
    return g_shaders[name];
};

CustomMaterial.getShaderByIndex = function(index) {
    let array = Object.values(g_shaders);
    return array[index];
};

CustomMaterial.getAllName = function() {
    let array = Object.keys(g_shaders);
    let result = array.map((name, value) => {
        return {name, value};
    });
    return result;
};

let g_shaderEnum = null;
CustomMaterial.getShaderEnum = function() {
    if (g_shaderEnum) {
        return g_shaderEnum;
    }
    let array = Object.keys(g_shaders);
    let obj = {};
    array.forEach((name, index) => obj[name] = index);
    g_shaderEnum = cc.Enum(obj);
    return g_shaderEnum;
}

module.exports = CustomMaterial;