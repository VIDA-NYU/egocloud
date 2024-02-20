import { Renderable } from "./Renderable";
import * as THREE from 'three';
export declare class Frustum extends Renderable {
    name: string;
    lines: number[][][];
    meta: any[];
    constructor(name: string, lines: number[][][], meta: any[]);
    get_renderables(): THREE.Object3D;
}
