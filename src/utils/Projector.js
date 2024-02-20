"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projector = void 0;
var THREE = require("three");
var Projector = /** @class */ (function () {
    function Projector() {
    }
    Projector.project_stream_onto_pointcloud = function (lines, pointCloud) {
        // creating point cloud
        var pointgeometry = new THREE.BufferGeometry();
        if (pointCloud.length > 0)
            pointgeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointCloud.flat(), 3));
        var pointmaterial = new THREE.PointsMaterial({ size: 0.015, vertexColors: true, sizeAttenuation: true, transparent: true });
        var pointCloudObject = new THREE.Points(pointgeometry, pointmaterial);
        // creating raycaster
        var raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = 0.02;
        var projection = [];
        lines.forEach(function (line) {
            raycaster.set(new THREE.Vector3(line.origin[0], line.origin[1], line.origin[2]), new THREE.Vector3(line.destination[0], line.destination[1], line.destination[2]).normalize());
            var intersection = [];
            do {
                raycaster.params.Points.threshold += 0.01;
                intersection = raycaster.intersectObject(pointCloudObject);
            } while (intersection.length === 0);
            projection.push(intersection[0].point.toArray());
            raycaster.params.Points.threshold = 0.02;
        });
        return projection;
    };
    return Projector;
}());
exports.Projector = Projector;
