"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneManager = void 0;
// third party
var THREE = require("three");
var Highlights_1 = require("./model/highlights/Highlights");
var SceneStyleManager_1 = require("./SceneStyleManager");
var SceneManager = /** @class */ (function () {
    function SceneManager(scene, callbacks) {
        this.scene = scene;
        this.callbacks = callbacks;
        // TODO: saving latest position to avoid firing the callback many timest
        this.latestCallbackIndex = 0;
        this.sceneHighlights = new Highlights_1.SceneHighlights();
        this.sceneStyleManager = new SceneStyleManager_1.SceneStyleManager();
    }
    SceneManager.prototype.highlight_object = function (objectType, position) {
        this.sceneHighlights.highlight_object(objectType, position, this.scene);
    };
    SceneManager.prototype.clear_highlights = function () {
        this.sceneHighlights.clear_current_highlight(this.scene);
    };
    SceneManager.prototype.fire_callback = function (eventType, objectType, objectName, index, position) {
        if (eventType in this.callbacks) {
            if (this.latestCallbackIndex !== index) {
                this.latestCallbackIndex = index;
                var meta = this.dataset.get_object_meta(objectType, objectName, index);
                this.callbacks[eventType](index, objectName, position, meta);
            }
        }
    };
    SceneManager.prototype.get_interactive_layers = function () {
        if (this.dataset) {
            var layers = [];
            for (var _i = 0, _a = Object.entries(this.dataset.pointClouds); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value.interactive) {
                    layers.push(value.name);
                }
            }
            return layers;
        }
        return [];
    };
    SceneManager.prototype.hide_object = function (name, visibility) {
        var currentObject = this.scene.getObjectByName(name);
        if (currentObject) {
            currentObject.visible = visibility;
        }
    };
    SceneManager.prototype.set_style = function (name, style, value) {
        this.sceneStyleManager.change_style(name, style, value, this.scene);
    };
    SceneManager.prototype.set_dataset = function (dataset) {
        this.dataset = dataset;
    };
    SceneManager.prototype.update = function () {
        if (this.dataset) {
            // point clouds
            for (var _i = 0, _a = Object.entries(this.dataset.pointClouds); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                var currentRenderable = value.get_renderables();
                this.scene.add(currentRenderable);
                var box = new THREE.BoxHelper(currentRenderable, '#000000');
                box.name = "".concat(key, "-boundingbox");
                this.dataset.boundingBoxes["".concat(key, "-boundingbox")] = box;
                this.scene.add(box);
            }
            // lines
            for (var _c = 0, _d = Object.entries(this.dataset.lineSets); _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], value = _e[1];
                var currentRenderable = value.get_renderables();
                this.scene.add(currentRenderable);
            }
            // heatmaps
            for (var _f = 0, _g = Object.entries(this.dataset.heatmaps); _f < _g.length; _f++) {
                var _h = _g[_f], key = _h[0], value = _h[1];
                var currentRenderable = value.get_renderables();
                this.scene.add(currentRenderable);
            }
        }
    };
    return SceneManager;
}());
exports.SceneManager = SceneManager;
