import numpy as np
import json

def get_rotation_matrix(v1, v2):
    """
    Compute a matrix R that rotates v1 to align with v2.
    v1 and v2 must be length-3 1d numpy arrays.
    """
    # unit vectors
    u = v1 / np.linalg.norm(v1)
    Ru = v2 / np.linalg.norm(v2)
    # dimension of the space and identity
    dim = u.size
    I = np.identity(dim)
    # the cos angle between the vectors
    c = np.dot(u, Ru)
    # a small number
    eps = 1.0e-10
    if np.abs(c - 1.0) < eps:
        # same direction
        return I
    elif np.abs(c + 1.0) < eps:
        # opposite direction
        return -I
    else:
        # the cross product matrix of a vector to rotate around
        K = np.outer(Ru, u) - np.outer(u, Ru)
        # Rodrigues' formula
        return I + K + (K @ K) / (1 + c)

def translate_point(p1, p2):
    return p1 + p2

def get_frustum(origin, direction, size, d):
    p0 = np.array(origin)
    p1 = np.array([size/2, d, - size/2])
    p2 = np.array([size/2, d, size/2])
    p3 = np.array([- size/2, d, size/2])
    p4 = np.array([- size/2, d, - size/2])
    
    d1 = np.array([0, 1, 0])
    rm = get_rotation_matrix(d1, direction)
    
    # rotate the points
    p1 = np.matmul(rm, p1)
    p2 = np.matmul(rm, p2)
    p3 = np.matmul(rm, p3)
    p4 = np.matmul(rm, p4)

    # translate the points
    p1 = translate_point(p1, origin)
    p2 = translate_point(p2, origin)
    p3 = translate_point(p3, origin)
    p4 = translate_point(p4, origin)

    p0 = p0.tolist()
    p1 = p1.tolist()
    p2 = p2.tolist()
    p3 = p3.tolist()
    p4 = p4.tolist()

    # define lines
    lines = [[p0, p1], [p0, p2], [p0, p3], [p0, p4], [p1, p2], [p2, p3], [p3, p4], [p4, p1]]
    return lines

f = open('./data/eye.json', "r")
f2 = open('./data/frustum.json', "w")

eye = json.load(f)

res = []

size = 0.25
d = 0.4
for ele in eye:
    origin = ele["GazeOrigin"]
    direction = ele["GazeDirection"]
    timest = ele["timestamp"]

    origin = [origin["x"], origin["y"], (-1)*origin["z"]]
    direction = [direction["x"], direction["y"], (-1)*direction["z"]]
    timest = int(timest.split("-")[0])

    lines = get_frustum(origin, direction, size, d)
    res.append({
        "lines": lines,
        "timestamp": timest
    })

f2.write(json.dumps(res))
f.close()
f2.close()
