import { SceneViewer } from '../src/SceneViewer';
import { Dataset } from '../src/model/Dataset';

import { Projector } from '../src/utils/Projector';

const main = async () => {
   
    let pointCloud: any = await fetch('./data/voxelized-pointcloud.json');
    pointCloud = await pointCloud.json();

    let compact_pc: any = await fetch('./data/compact-pointcloud.json');
    compact_pc = await compact_pc.json();

    let eyes: any =  await fetch('./data/eye.json');
    eyes = await eyes.json();

    let frustums: any = await fetch('./data/frustum.json');
    frustums = await frustums.json();

    var video: HTMLVideoElement = document.getElementById("video") as HTMLVideoElement;
    var video_duration: number = video.duration;
    var height: number = video.videoHeight; // returns the intrinsic height of the video
    var width: number = video.videoWidth;

    console.log(width, height)

    var min_eye: any = eyes.reduce(function(prev: any, curr: any) {
        let t1: number = parseInt(prev.timestamp.split("-")[0])
        let t2: number = parseInt(curr.timestamp.split("-")[0])
        return t1 < t2 ? prev : curr;
    });

    var max_eye: any = eyes.reduce(function(prev: any, curr: any) {
        let t1: number = parseInt(prev.timestamp.split("-")[0])
        let t2: number = parseInt(curr.timestamp.split("-")[0])
        return t1 > t2 ? prev : curr;
    });

    var min_timestamp: number = parseInt(min_eye.timestamp.split("-")[0])
    var max_timestamp: number = parseInt(max_eye.timestamp.split("-")[0])

    var diff: number = (max_timestamp - min_timestamp)/1000
    var step: number = diff/eyes.length;

    let eye_index_2_pc_index : any = [];
    let pc_i : number = 0;
    let index: number = 0;
    while (index < eyes.length){

        while (pc_i < compact_pc.length && index <= compact_pc[pc_i]["eye_index"]){
            eye_index_2_pc_index.push(pc_i);
            index++;
        }
        pc_i++;
        if (pc_i >= compact_pc.length){
            while(index < eyes.length){
                eye_index_2_pc_index.push(compact_pc.length-1);
                index++;
            }
            break
        }        
    }

    let positions: any = [];
    let colors: any = [];
    let greyColors: any = [];

    pointCloud.xyz_world.forEach( (coord: number[], index: number) => {
            positions.push( coord );
            colors.push( pointCloud.colors[index] );
            greyColors.push([211/256,211/256,211/256])
    })

    let frustumsLines: any = frustums.map( (element: any) => element.lines)
    let eyePositions: any = eyes.map( (element: any) => [element.GazeOrigin.x, element.GazeOrigin.y, (-1)*element.GazeOrigin.z] );
    let eyeTimestamps: any = eyes.map( (element: any) =>  { return { timestamp: parseInt( element.timestamp.split('-')[0] ) }} );
    let eyeColors: any = eyes.map( (element: any) =>  [55/255, 126/255, 184/255]);

    let gazeDirection: any = [];
    let gazeColors: number[][] = [];

    const lineColors: number [][] = [];
    let eyeDirections: any = eyes.map( (element: any) => {

        lineColors.push( [0.5, 0.1, 0.3 ] );
        const obj = {   origin: [element.GazeOrigin.x, element.GazeOrigin.y, (-1)*element.GazeOrigin.z],
            destination: [
               element.GazeDirection.x,
                element.GazeDirection.y,
                (-1)*element.GazeDirection.z
            ]
        }

        return obj;
        
    });

    //const projection: number[][] = Projector.project_stream_onto_pointcloud( eyeDirections, positions );
    const dataset: Dataset = new Dataset();
    let points_c: any = []
    let colors_c: any = []
    let colors_g: any = []

    // create each frame of pointcloud as object
    compact_pc.forEach( (pc: any, index: number) => {
        points_c = []
        colors_c = []
        colors_g = []
        pc.points.forEach((coord: number[], i2: number) => {
            points_c.push(coord);
            colors_c.push(pc.colors[i2]);
            colors_g.push([211/256,211/256,211/256])
        })
        dataset.add_point_cloud(`compact_world-${index}`, points_c, [], colors_g, [], false, true);
    })

    let hided: any = undefined;
    //dataset.add_point_cloud( 'world', positions, [], colors, [], false, true  );
    dataset.add_point_cloud( 'eye', eyePositions, [], eyeColors, eyeTimestamps, true, false );
    // dataset.add_point_cloud( 'gaze', projection, [], eyeColors, eyeTimestamps, true, false );
    const mainDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div');
    const egoCloud = new SceneViewer( mainDiv, { 'onHover': ( index: number, name: string, position: number[], meta: any ) => { 

        console.log(meta);
        index = eyeTimestamps.findIndex((x: { timestamp: Number; }) => x.timestamp === meta.timestamp);
        
        gazeDirection = [eyeDirections[index]];
        gazeColors =  [lineColors[index]];
        
        if (index !== -1){
            let pc_index: number = eye_index_2_pc_index[index];
            let start: number = step*index;
            let img_position : number[] = eyeDirections[index]["destination"]
            if(pc_index){
                if(hided){
                    dataset.add_point_cloud(`compact_world-${hided}`, points_c, [], colors_g, [], false, true);
                }
                points_c = []
                colors_c = []
                colors_g = []
                let x: number = 0;
                let y: number = 0;
                let z: number = 0;
                compact_pc[pc_index].points.forEach((p:any, index:number) => {
                    points_c.push(p);
                    x += p[0]
                    y += p[1]
                    z += p[2]
                    colors_c.push(compact_pc[pc_index].colors[index]);
                    let c: number[] = compact_pc[pc_index].colors[index];
                    colors_g.push([211/256,211/256,211/256])
                })
                x = x/compact_pc[pc_index].points.length;
                y = y/compact_pc[pc_index].points.length;
                z = z/compact_pc[pc_index].points.length;
                hided = pc_index;
                dataset.add_point_cloud(`compact_world-${pc_index}`, points_c, [], colors_c, [], false, true);
                //egoCloud.highlight('pointcloud', [x, y, z])
            }
            //dataset.add_line_set('gaze-direction', gazeDirection, gazeColors, [])
            dataset.add_frustum('frustum', frustumsLines[index], [])
            
            img_position = [-1, 1, -3]
            dataset.add_video('video', [video], width, height, start, img_position, [])
        }

        egoCloud.clear_highlights();   
        if( 'timestamp' in meta ){  
            egoCloud.highlight( 'point', position ); 
        }
        egoCloud.render( dataset );
        
    }});

    egoCloud.render( dataset );

}

main();


