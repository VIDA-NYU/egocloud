import numpy as np
import json
import datetime
import open3d as o3d

f = open('./data/pointcloud.json', "r")
pointclouds = json.load(f)
f.close()

f = open('./data/eye.json', "r")
eyes = json.load(f)
f.close()

f2 = open('./data/compact-pointcloud.json', "w")

res = []

for i in range(len(eyes)):
    e = eyes[i]
    timestamp = int(e["timestamp"].split("-")[0])
    t = datetime.datetime.fromtimestamp(timestamp/1000.0)
    e["timestamp"] = t
    eyes[i] = e

closest_index = 1
pc_index = 0
voxel_size = 0.025
for pc in pointclouds:
    points = pc["xyz_world"]
    colors = pc["color"]
    timestamp = int(pc["timestamp"].split("-")[0])
    t = datetime.datetime.fromtimestamp(timestamp/1000.0)
    
    closest_value = datetime.timedelta(days=90)
    i = closest_index - 1
    while (i < len(eyes) and abs(eyes[i]["timestamp"] - t) < closest_value):
        closest_index = i
        closest_value = abs(eyes[i]["timestamp"] - t)
        i+=1
    
    colors = [[c[0]/255.0, c[1]/255.0, c[2]/255.0] for c in colors]
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(points)
    pcd.colors = o3d.utility.Vector3dVector(colors)
    downpcd = pcd.voxel_down_sample(voxel_size=voxel_size)
    
    xyz = np.asarray(downpcd.points).tolist()
    colors = np.asarray(downpcd.colors).tolist()

    res.append({"pointcloud_index": pc_index, "eye_index": closest_index, "eye_timestamp": eyes[closest_index]["timestamp"].timestamp() * 1000, "points": xyz, "colors": colors})
    pc_index +=1


f2.write(json.dumps(res))
f2.close()
