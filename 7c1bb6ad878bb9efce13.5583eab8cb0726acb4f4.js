/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assetmgr.ts":
/*!*************************!*\
  !*** ./src/assetmgr.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetHandle = exports.Assetmgr = void 0;
const smallEv_1 = __webpack_require__(/*! ./smallEv */ "./src/smallEv.ts");
class Assetmgr {
    constructor() {
        this.db = new Map();
        this.onload = new smallEv_1.SmallEv();
    }
    setAsset(id, blob) {
        this.db.set(id, blob);
        this.onload.emit();
    }
    async loadAsset(id, url) {
        this.db.set(id, null);
        this.onload.emit();
        this.db.set(id, await (await fetch(url)).blob());
        this.onload.emit();
    }
    loadstate() {
        return [[...this.db].reduce((prev, [id, blob]) => blob !== null ? prev + 1 : prev, 0), this.db.size];
    }
    getAsset(id) {
        return this.db.get(id);
    }
}
exports.Assetmgr = Assetmgr;
class AssetHandle {
    constructor() {
        this.onUpdate = new smallEv_1.SmallEv();
        this.data_ = "";
    }
    get data() {
        return this.data_;
    }
    set data(data) {
        this.data_ = data;
        this.onUpdate.emit();
    }
}
exports.AssetHandle = AssetHandle;


/***/ }),

/***/ "./src/components/drawable.ts":
/*!************************************!*\
  !*** ./src/components/drawable.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Drawable = void 0;
const lodash_es_1 = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/lodash.js");
const glUtils_1 = __webpack_require__(/*! ../glUtils */ "./src/glUtils.ts");
const elm_1 = __webpack_require__(/*! ./elm */ "./src/components/elm.ts");
class Drawable extends elm_1.Elm {
    constructor(ctx, id) {
        super(ctx, id);
        this.opacity = 0;
        this.position = {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
        };
        this.elTransform = glUtils_1.mat3.empty;
        this.texTransform = glUtils_1.mat3.empty;
        const gl = ctx.ctx;
        this.tex = (0, glUtils_1.undefinedMsg)(gl.createTexture(), "texture creation failed");
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    bindTex(bindPoint = this.ctx.ctx.TEXTURE_2D || 0) {
        const gl = this.ctx.ctx;
        gl.bindTexture(bindPoint, this.tex);
    }
    getOpacity() {
        return this.opacity;
    }
    get pos() {
        return (0, lodash_es_1.clone)(this.position);
    }
    set pos(pos) {
        this.position = (0, lodash_es_1.clone)(pos);
        this.updatedElTransform();
    }
    updatedElTransform(transforms = []) {
        this.elTransform = glUtils_1.mat3.multiply((0, glUtils_1.pos2mat3)(this.position), ...transforms);
    }
    getElTransform() {
        return this.elTransform;
    }
    updatedTexTransform(transforms = []) {
        this.texTransform = glUtils_1.mat3.multiply((0, glUtils_1.pos2mat3)(this.position), ...transforms);
    }
    getTexTransform() {
        return this.texTransform;
    }
    updateTexSource(source) {
        const gl = this.ctx.ctx;
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    }
}
exports.Drawable = Drawable;


/***/ }),

/***/ "./src/components/elm.ts":
/*!*******************************!*\
  !*** ./src/components/elm.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Elm = void 0;
class Elm {
    constructor(ctx, id) {
        this.ctx = ctx;
        this.id = id;
        if (id != "mask") {
            ctx.elms.set(this.id, this);
        }
    }
}
exports.Elm = Elm;


/***/ }),

/***/ "./src/components/img.ts":
/*!*******************************!*\
  !*** ./src/components/img.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElImg = void 0;
const drawable_1 = __webpack_require__(/*! ./drawable */ "./src/components/drawable.ts");
class ElImg extends drawable_1.Drawable {
    constructor(ctx, id, src) {
        super(ctx, id);
        this.src = src;
        this.img = new Image();
        src.onUpdate.on(() => {
            this.img.src = src.data;
        });
        this.img.addEventListener("load", () => {
            this.updateTexSource(this.img);
        });
        src.onUpdate.emit();
        this.updatedElTransform();
    }
    updatedElTransform(transforms = []) {
        super.updatedElTransform([
            ...transforms,
        ]);
    }
}
exports.ElImg = ElImg;


/***/ }),

/***/ "./src/components/maskimg.ts":
/*!***********************************!*\
  !*** ./src/components/maskimg.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MaskImg = void 0;
const img_1 = __webpack_require__(/*! ./img */ "./src/components/img.ts");
class MaskImg extends img_1.ElImg {
    constructor(ctx, src) {
        super(ctx, "mask", src);
        this.src = src;
    }
}
exports.MaskImg = MaskImg;


/***/ }),

/***/ "./src/glUtils.ts":
/*!************************!*\
  !*** ./src/glUtils.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mat3 = exports.pos2mat3 = exports.mergeTransformMatrix = exports.mergeTransformMatrices = exports._float = exports._int = exports.vec2 = exports.compileShader = exports.createProgram = exports.createShader = exports.webGlundefined = exports.undefinedMsg = void 0;
function undefinedMsg(fnVal, msg) {
    if (!fnVal) {
        throw new Error(msg);
    }
    else {
        return fnVal;
    }
}
exports.undefinedMsg = undefinedMsg;
function webGlundefined() {
    return new Error("[unexpected] WebGLContext is undefined");
}
exports.webGlundefined = webGlundefined;
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("WebGL Shader creation failed");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    else {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error("WebGL Shader creation failed");
    }
}
exports.createShader = createShader;
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    if (!program) {
        throw new Error("WebGL Program creation failed");
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
exports.createProgram = createProgram;
function compileShader(gl, vertexCode, fragmentCode) {
    const pr = createProgram(gl, createShader(gl, gl.VERTEX_SHADER, vertexCode), createShader(gl, gl.FRAGMENT_SHADER, fragmentCode));
    if (pr) {
        return pr;
    }
    else {
        throw new Error("WebGL Program creation failed");
    }
}
exports.compileShader = compileShader;
function vec2(x, y) {
    return [x, y];
}
exports.vec2 = vec2;
// export type TransformProps = [vec2, vec2, vec2, vec2];
// export const transformProps: TransformProps = [
//     vec2(0, 0),
//     vec2(1, 0),
//     vec2(0, 1),
//     vec2(1, 1)
// ]
function _int(val) {
    return parseInt(val);
}
exports._int = _int;
function _float(val) {
    return parseFloat(val);
}
exports._float = _float;
// export function Pos2Buffer({ x, y, h, w }: Pos) {
//     return new Float32Array([x, y, x + w, y, x + w, y + h, x, y, x, y + h, x + w, y + h]);
// }
function mergeTransformMatrices([aa, ab], [ba, bb]) {
    return [mergeTransformMatrix(aa, ba), mergeTransformMatrix(ab, bb)];
}
exports.mergeTransformMatrices = mergeTransformMatrices;
function mergeTransformMatrix(a, b) {
    if (a) {
        if (b) {
            return exports.mat3.multiply2(a, b);
        }
        else {
            return a;
        }
    }
    else {
        if (b) {
            return b;
        }
        else {
            return exports.mat3.empty;
        }
    }
}
exports.mergeTransformMatrix = mergeTransformMatrix;
function pos2mat3(pos) {
    const tx = sizePos2translate(pos.w, pos.x);
    const ty = sizePos2translate(pos.h, pos.y);
    return exports.mat3.multiply(exports.mat3.scaling(pos.w, pos.h), exports.mat3.translation(tx, ty));
}
exports.pos2mat3 = pos2mat3;
function sizePos2translate(size, pos) {
    return 1 - (1 / size) + (1 - pos - size) * (2 / size);
}
exports.mat3 = {
    multiply(...mats_) {
        const mats = mats_.filter(_ => _ !== null);
        if (mats.length === 0) {
            return exports.mat3.empty;
        }
        else if (mats.length === 1) {
            return mats[0];
        }
        else if (mats.length === 2) {
            const [a, b] = mats;
            return exports.mat3.multiply2(a, b);
        }
        else {
            const [a, b, ...more] = mats;
            return exports.mat3.multiply(exports.mat3.multiply2(a, b), ...more);
        }
    },
    multiply2(a, b) {
        const a00 = a[0 * 3 + 0];
        const a01 = a[0 * 3 + 1];
        const a02 = a[0 * 3 + 2];
        const a10 = a[1 * 3 + 0];
        const a11 = a[1 * 3 + 1];
        const a12 = a[1 * 3 + 2];
        const a20 = a[2 * 3 + 0];
        const a21 = a[2 * 3 + 1];
        const a22 = a[2 * 3 + 2];
        const b00 = b[0 * 3 + 0];
        const b01 = b[0 * 3 + 1];
        const b02 = b[0 * 3 + 2];
        const b10 = b[1 * 3 + 0];
        const b11 = b[1 * 3 + 1];
        const b12 = b[1 * 3 + 2];
        const b20 = b[2 * 3 + 0];
        const b21 = b[2 * 3 + 1];
        const b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
    translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },
    rotation(angle, unit = "deg") {
        const angleInRadians = unit == "deg" ? angle / 360 * Math.PI * 2 : angle;
        var c = Math.cos(-angleInRadians);
        var s = Math.sin(-angleInRadians);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },
    scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },
    get empty() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
};


/***/ }),

/***/ "./src/output.render.ts":
/*!******************************!*\
  !*** ./src/output.render.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sACN2VideoOutput = void 0;
const assetmgr_1 = __webpack_require__(/*! ./assetmgr */ "./src/assetmgr.ts");
const maskimg_1 = __webpack_require__(/*! ./components/maskimg */ "./src/components/maskimg.ts");
const glUtils_1 = __webpack_require__(/*! ./glUtils */ "./src/glUtils.ts");
const sACN2VideoCore_1 = __webpack_require__(/*! ./sACN2VideoCore */ "./src/sACN2VideoCore.ts");
class sACN2VideoOutput extends sACN2VideoCore_1.sACN2VideoCore {
    constructor(target, width = 1920, height = 1080) {
        super(target, width, height);
        this.maskImgSrc = new assetmgr_1.AssetHandle();
        this.maskImg = new maskimg_1.MaskImg(this, this.maskImgSrc);
    }
    renderMask(gl) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.lg.fbTex);
        gl.activeTexture(gl.TEXTURE2);
        this.maskImg.bindTex();
        gl.uniformMatrix3fv(this.getUniform("u_el_transform"), false, glUtils_1.mat3.empty);
        gl.uniformMatrix3fv(this.getUniform("u_tex_transform"), false, glUtils_1.mat3.empty);
        gl.uniform1i(this.getUniform("u_mode"), 2);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}
exports.sACN2VideoOutput = sACN2VideoOutput;


/***/ }),

/***/ "./src/sACN2VideoCore.ts":
/*!*******************************!*\
  !*** ./src/sACN2VideoCore.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sACN2VideoCore = void 0;
const glUtils_1 = __webpack_require__(/*! ./glUtils */ "./src/glUtils.ts");
const vertex_shader_1 = __importDefault(__webpack_require__(/*! ./shader/vertex.shader */ "./src/shader/vertex.shader"));
const fragment_shader_1 = __importDefault(__webpack_require__(/*! ./shader/fragment.shader */ "./src/shader/fragment.shader"));
class sACN2VideoCore {
    constructor(target, width = 1920, height = 1080) {
        this.target = target;
        this.onFps = () => { };
        this.elms = new Map();
        this.rendertime = [];
        this.prescaler = 1;
        this.prescaleCounter = 1;
        this.fps = 0;
        this.uniforms = new Map();
        this.frameBufferSize = [window.screen.height, window.screen.width];
        this.setCvSize(width, height);
        const ctx = target.getContext("webgl2") || undefined;
        if (!ctx) {
            throw new Error("no WebGL");
        }
        else {
            this.ctx = ctx;
        }
        this.initGL().then(this.runRender.bind(this));
        setInterval(() => {
            this.onFps?.(this.fps * 2);
            this.fps = 0;
        }, 500);
    }
    setCvSize(w, h) {
        this.target.width = w;
        this.target.height = h;
    }
    getCvSize() {
        return [this.target.width, this.target.height];
    }
    setPrescaler(prescaler) {
        this.prescaler = prescaler;
    }
    getUniform(name) {
        return (0, glUtils_1.undefinedMsg)(this.uniforms.get(name), `'${name}' was not resolved during lookup`);
    }
    async initGL() {
        const gl = this.ctx;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        const program = (0, glUtils_1.compileShader)(gl, vertex_shader_1.default, fragment_shader_1.default);
        gl.useProgram(program);
        console.log(`%c created WebGL shaders`, "color: #0f0");
        [
            "t_texture",
            "t_fbTex",
            "t_mask",
            "u_mode",
            "u_zind",
            "u_opacity",
            "u_eTL",
            "u_eTR",
            "u_eBL",
            "u_eBR",
            "u_el_transform",
            "u_tex_transform",
        ]
            .forEach(uname => this.uniforms.set(uname, (0, glUtils_1.undefinedMsg)(gl?.getUniformLocation(program, uname), `failed to resolve uniform ${uname}`)));
        this.lg = {
            objPosLoc: gl.getAttribLocation(program, "a_objectPos"),
            objPosBuf: (0, glUtils_1.undefinedMsg)(gl.createBuffer(), "buffer creation failed"),
            fb: (0, glUtils_1.undefinedMsg)(gl.createFramebuffer(), "framebuffer creation failed"),
            fbTex: (0, glUtils_1.undefinedMsg)(gl.createTexture(), "texture creation failed"),
            maskTex: (0, glUtils_1.undefinedMsg)(gl.createTexture(), "texture creation failed"),
            pr: program
        };
        gl.bindTexture(gl.TEXTURE_2D, this.lg.fbTex);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 100, 50, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBufferSize[1], this.frameBufferSize[0], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, this.lg.maskTex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lg.fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.lg.fbTex, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.uniform1i(this.getUniform("t_texture"), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.lg.fbTex);
        gl.uniform1i(this.getUniform("t_fbTex"), 1);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.lg.maskTex);
        gl.uniform1i(this.getUniform("t_mask"), 2);
        gl.activeTexture(gl.TEXTURE1);
        gl.uniform1i(this.getUniform("u_mode"), 0);
        gl.uniform1f(this.getUniform("u_zind"), 0);
        gl.uniform2f(this.getUniform("u_eTL"), .2, 0);
        gl.uniform2f(this.getUniform("u_eTR"), 1, 0);
        gl.uniform2f(this.getUniform("u_eBL"), 0, 1);
        gl.uniform2f(this.getUniform("u_eBR"), 1, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lg.objPosBuf);
        gl.vertexAttribPointer(this.lg.objPosLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.lg.objPosLoc);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.lg.texPosBuf);
        // gl.vertexAttribPointer(this.lg.texPosLoc, 2, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(this.lg.texPosLoc);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    runRender() {
        requestAnimationFrame(this.render.bind(this));
    }
    render() {
        if (this.prescaleCounter < this.prescaler) {
            this.prescaleCounter++;
            this.runRender();
            return;
        }
        this.prescaleCounter = 1;
        const renderstart = performance.now();
        const gl = this.ctx;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.uniformMatrix3fv(this.getUniform("u_el_transform"), false, glUtils_1.mat3.empty);
        gl.uniformMatrix3fv(this.getUniform("u_tex_transform"), false, glUtils_1.mat3.empty);
        gl.uniform1i(this.getUniform("u_mode"), 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lg.fb);
        gl.activeTexture(gl.TEXTURE0);
        for (let [id, elm] of this.elms) {
            if (elm.getOpacity() < 0.01) { // < 1%
                continue;
            }
            elm.bindTex();
            gl.uniformMatrix3fv(this.getUniform("u_el_transform"), false, elm.getElTransform());
            gl.uniformMatrix3fv(this.getUniform("u_tex_transform"), false, elm.getTexTransform());
            gl.uniform1f(this.getUniform("u_opacity"), elm.getOpacity());
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        this.renderMask(gl);
        this.rendertime.push(performance.now() - renderstart);
        while (this.rendertime.length > 10) {
            this.rendertime.shift();
        }
        const avgRender = this.rendertime.reduce((prev, curr) => prev + curr) / this.rendertime.length;
        this.fps++;
        this.runRender();
    }
}
exports.sACN2VideoCore = sACN2VideoCore;


/***/ }),

/***/ "./src/smallEv.ts":
/*!************************!*\
  !*** ./src/smallEv.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmallEv = void 0;
class SmallEv {
    constructor() {
        this.listener = new Set();
    }
    on(cb) {
        this.listener.add(cb);
    }
    emit() {
        this.listener.forEach(_ => _());
    }
}
exports.SmallEv = SmallEv;


/***/ }),

/***/ "./src/test/test.ts":
/*!**************************!*\
  !*** ./src/test/test.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const assetmgr_1 = __webpack_require__(/*! ../assetmgr */ "./src/assetmgr.ts");
const img_1 = __webpack_require__(/*! ../components/img */ "./src/components/img.ts");
const test0_jpg_1 = __importDefault(__webpack_require__(/*! ../../misc/test0.jpg */ "./misc/test0.jpg"));
const testmask_png_1 = __importDefault(__webpack_require__(/*! ../../misc/testmask.png */ "./misc/testmask.png"));
const output_render_1 = __webpack_require__(/*! ../output.render */ "./src/output.render.ts");
async function init() {
    const cv = document.getElementById("canvas");
    const s2v = new output_render_1.sACN2VideoOutput(cv);
    s2v.setPrescaler(5);
    const imgSrc = new assetmgr_1.AssetHandle();
    imgSrc.data = test0_jpg_1.default;
    const img = new img_1.ElImg(s2v, "testbild", imgSrc);
    img.opacity = 1;
    const mask = new assetmgr_1.AssetHandle();
    // s2v.masks.set("mask", {
    //     pos: mat3.scaling(.5, .5),
    //     src: mask,
    // })
    s2v.maskImgSrc.data = testmask_png_1.default;
    // mask.data = testmask;
}
window.addEventListener("load", init);


/***/ }),

/***/ "./misc/test0.jpg":
/*!************************!*\
  !*** ./misc/test0.jpg ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "9198769a320bf3f01792.jpg";

/***/ }),

/***/ "./misc/testmask.png":
/*!***************************!*\
  !*** ./misc/testmask.png ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "bd99a2d2f18c30a42d3a.png";

/***/ }),

/***/ "./src/shader/fragment.shader":
/*!************************************!*\
  !*** ./src/shader/fragment.shader ***!
  \************************************/
/***/ ((module) => {

module.exports = "precision lowp float;\r\nprecision lowp int;\r\n\r\nvarying vec2 v_texturePos;\r\nvarying vec2 v_textureGlobalPos;\r\n\r\nuniform sampler2D t_texture;\r\nuniform sampler2D t_mask;\r\nuniform sampler2D t_fbTex;\r\n\r\nuniform lowp int u_mode;\r\nuniform float u_opacity;\r\n\r\nuniform vec2 u_eTL;\r\nuniform vec2 u_eTR;\r\nuniform vec2 u_eBL;\r\nuniform vec2 u_eBR;\r\n\r\n#define u_maskMode 1\r\n\r\n// following two functions taken from https://iquilezles.org/articles/ibilinear/\r\n\r\nfloat cross2d(in vec2 a, in vec2 b) { return a.x * b.y - a.y * b.x; }\r\n\r\nvec2 inverseBilinear(in vec2 p, in vec2 a, in vec2 b, in vec2 c, in vec2 d)\r\n{\r\n    vec2 res = vec2(-1.0);\r\n\r\n    vec2 e = b - a;\r\n    vec2 f = d - a;\r\n    vec2 g = a - b + c - d;\r\n    vec2 h = p - a;\r\n\r\n    float k2 = cross2d(g, f);\r\n    float k1 = cross2d(e, f) + cross2d(h, g);\r\n    float k0 = cross2d(h, e);\r\n\r\n    // if edges are parallel, this is a linear equation\r\n    if (abs(k2) < 0.001)\r\n    {\r\n        res = vec2((h.x * k1 + f.x * k0) / (e.x * k1 - g.x * k0), -k0 / k1);\r\n    }\r\n    // otherwise, it's a quadratic\r\n    else\r\n    {\r\n        float w = k1 * k1 - 4.0 * k0 * k2;\r\n        if (w < 0.0) return vec2(-1.0);\r\n        w = sqrt(w);\r\n\r\n        float ik2 = 0.5 / k2;\r\n        float v = (-k1 - w) * ik2;\r\n        float u = (h.x - f.x * v) / (e.x + g.x * v);\r\n\r\n        if (u < 0.0 || u>1.0 || v < 0.0 || v>1.0)\r\n        {\r\n            v = (-k1 + w) * ik2;\r\n            u = (h.x - f.x * v) / (e.x + g.x * v);\r\n        }\r\n        res = vec2(u, v);\r\n    }\r\n\r\n    return res;\r\n}\r\n\r\nvec2 bilinear(in vec2 p, in vec2 a, in vec2 b, in vec2 c, in vec2 d) {\r\n    vec2 _p = a + (b - a) * p.x;\r\n    vec2 _q = d + (c - d) * p.x;\r\n    return _p + (_q - _p) * p.y;\r\n    // return b + (b - a) * p.x + (d - a) * p.y + ((a - b) + (c - d)) * p.x * p.y;\r\n}\r\n\r\nbool outOf01Range(vec2 pos) {\r\n    if (pos.x < 0. || pos.x > 1. || pos.y < 0. || pos.y > 1.) {\r\n        return true;\r\n    } else {\r\n        return false;\r\n    }\r\n}\r\n\r\nvoid main() {\r\n    if (u_mode == 1) { // 1:1 copy t_texture\r\n        gl_FragColor = texture2D(t_texture, v_texturePos);\r\n        gl_FragColor.a *= u_opacity;\r\n        if (outOf01Range(v_texturePos)) {\r\n            gl_FragColor = vec4(0, 0, 0, 0); //transparent\r\n        }\r\n    } else if (u_mode == 2) { // inverse bilinear\r\n        vec2 flipedTexPos = v_texturePos * vec2(1, -1) + vec2(0, 1);\r\n        vec2 texPix = inverseBilinear(flipedTexPos, u_eTL, u_eTR, u_eBR, u_eBL);\r\n        if (outOf01Range(texPix)) {\r\n            gl_FragColor = vec4(0, 0, 0, 0); //transparent\r\n        } else {\r\n            vec4 maskColor = texture2D(t_mask, flipedTexPos);\r\n            gl_FragColor = texture2D(t_fbTex, texPix);\r\n            float alpha = 1.;\r\n            //maskMode == 0 //disable mask\r\n            if (u_maskMode == 1) { //red\r\n                alpha = maskColor.r;\r\n            } else if (u_maskMode == 2) { //green\r\n                alpha = maskColor.g;\r\n            } else if (u_maskMode == 3) { //blue\r\n                alpha = maskColor.b;\r\n            } else if (u_maskMode == 4) { //alpha\r\n                alpha = maskColor.a;\r\n            }\r\n            gl_FragColor.a = alpha > .5 ? 1. : 0.;\r\n        }\r\n    } else if (u_mode == 3) {\r\n        vec2 flipedTexPos = v_textureGlobalPos * vec2(1, -1) + vec2(0, 1);\r\n        vec2 texPix = bilinear(flipedTexPos, u_eTL, u_eTR, u_eBR, u_eBL);\r\n        if (outOf01Range(texPix)) {\r\n            gl_FragColor = vec4(0, 0, 0, 0); //transparent\r\n        } else {\r\n            vec4 maskColor = texture2D(t_mask, texPix);\r\n            gl_FragColor = texture2D(t_fbTex, flipedTexPos);\r\n            float maskValue = 1.;\r\n            if (u_maskMode == 1) { //red\r\n                maskValue = maskColor.r;\r\n            } else if (u_maskMode == 2) { //green\r\n                maskValue = maskColor.g;\r\n            } else if (u_maskMode == 3) { //blue\r\n                maskValue = maskColor.b;\r\n            } else if (u_maskMode == 4) { //alpha\r\n                maskValue = maskColor.a;\r\n            }\r\n            gl_FragColor *= maskValue > .5 ? 1. : u_opacity;\r\n            gl_FragColor.a = 1.;\r\n        }\r\n    } else if (u_mode == 4) {// 1:1 copy framebuffer\r\n        gl_FragColor = texture2D(t_fbTex, v_texturePos * vec2(1, -1) + vec2(0, 1));\r\n    }\r\n}\r\n";

/***/ }),

/***/ "./src/shader/vertex.shader":
/*!**********************************!*\
  !*** ./src/shader/vertex.shader ***!
  \**********************************/
/***/ ((module) => {

module.exports = "attribute vec2 a_objectPos;\r\n\r\nvarying vec2 v_texturePos;\r\nvarying vec2 v_textureGlobalPos;\r\n\r\nuniform lowp int u_mode;\r\nuniform lowp float u_zind;\r\nuniform lowp int u_flip;\r\n\r\nuniform mat3 u_el_transform;\r\n\r\nuniform mat3 u_tex_transform;\r\n\r\n#define FLIP false\r\n\r\n// 0 to 1 > -1 to 1\r\nvec2 tex2clip(vec2 pos) {\r\n    return FLIP ? (pos * -2. + 1.) : (pos * 2. - 1.);\r\n}\r\n// -1 to 1 > 0 to 1\r\nvec2 clip2tex(vec2 pos) {\r\n    return FLIP ? ((pos - 1.) / -2.) : ((pos + 1.) / 2.);\r\n}\r\n\r\nvoid main() {\r\n    gl_Position = vec4((u_el_transform * vec3(tex2clip(a_objectPos), 1)).xy, u_zind, 1);\r\n    v_texturePos = clip2tex((u_tex_transform * vec3(tex2clip(a_objectPos), 1.)).xy);\r\n    v_textureGlobalPos = clip2tex((u_el_transform * vec3(tex2clip(a_objectPos), 1.)).xy);\r\n}\r\n";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_lodash-es_lodash_js"], () => (__webpack_require__("./src/test/test.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=7c1bb6ad878bb9efce13.5583eab8cb0726acb4f4.js.map