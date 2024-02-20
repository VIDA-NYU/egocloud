import { Renderable } from "./Renderable";
import * as THREE from 'three';

export declare class VideoFrame extends Renderable {
    name: string;
    video: HTMLVideoElement[];
    width: number;
    height: number;
    start: number;
    position: number[];
    meta: any[];
    constructor(name: string, video: HTMLVideoElement[], width: number, height: number, start: number, position: number[], meta: any[]);
    get_renderables(): THREE.Object3D;
}
