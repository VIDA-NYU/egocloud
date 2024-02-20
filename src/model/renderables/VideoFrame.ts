import { VoxelCube } from "../interfaces/VoxelCube.interface";
import { Renderable } from "./Renderable";
import * as THREE from 'three';

export class VideoFrame extends Renderable {

    // To work with image

//     constructor( public name: string, public frame: string[], public position: number[], public meta: any[] ){
//         super(name);
//     }

//     public get_renderables(): THREE.Object3D {
//         var loader = new THREE.TextureLoader();
//         const group: THREE.Group = new THREE.Group();
//         group.name = this.name;
//         for(let i = 0; i < this.frame.length; i++){
//             let imageTexture = loader.load(this.frame[i])

            
//             // Load an image file into a custom material
//             let imageGeometry = new THREE.PlaneGeometry(1, 1, 1, 1 );
//             let imageMaterial = new THREE.MeshBasicMaterial({map: imageTexture});
//             let imageScreen = new THREE.Mesh(imageGeometry, imageMaterial);

//             // Change plane position
//             imageScreen.position.x = this.position[0];
//             imageScreen.position.y = this.position[1];
//             imageScreen.position.z = this.position[2];

//             group.add(imageScreen);
//         }

//         return group;
//     }

// }

//end to work with image

//to work with video

        constructor( public name: string, public video: HTMLVideoElement[], public width: number, public height: number, public start: number, public position: number[], public meta: any[] ){
            super(name);
        }
    
        public get_renderables(): THREE.Object3D {
            const group: THREE.Group = new THREE.Group();
            group.name = this.name;
            for(let i = 0; i < this.video.length; i++){
                let videoTexture = new THREE.VideoTexture(this.video[i]);
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;

                var movieMaterial = new THREE.MeshBasicMaterial({
                        map: videoTexture,
                        side: THREE.FrontSide,
                        toneMapped: false
                    })

                let movieGeometry = new THREE.PlaneGeometry(this.width/this.height, 1);
                let moviePlaneScreen = new THREE.Mesh(movieGeometry, movieMaterial)
                moviePlaneScreen.position.set(this.position[0], this.position[1], this.position[2])
                this.video[i].src = `./data/main.mp4#t=${this.start}`;
                
                videoTexture.needsUpdate = true;
            
                group.add(moviePlaneScreen);
            }
    
            return group;
        }
    }

// end to work with video