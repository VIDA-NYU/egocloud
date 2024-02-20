import { VoxelCube } from "../interfaces/VoxelCube.interface";
import { Renderable } from "./Renderable";
import * as THREE from 'three';

export class Frustum extends Renderable {
    constructor( public name: string, public lines: number[][][], public meta: any[] ){
        super(name);
    }

    public get_renderables(): THREE.Object3D {
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff, linewidth: 3} );
        const group: THREE.Group = new THREE.Group();
        group.name = this.name;
        for(let i = 0; i < this.lines.length; i++){
            var p: THREE.Vector3[] = []
            var x1: number[] = this.lines[i][0];
            var x2: number[] = this.lines[i][1];
            p.push( new THREE.Vector3(x1[0], x1[1], x1[2]) );
            p.push( new THREE.Vector3(x2[0], x2[1], x2[2]) );
            const geometry: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints( p );
            const line: THREE.Line = new THREE.Line( geometry, material );
            group.add(line);
        }

        return group;
    }
}