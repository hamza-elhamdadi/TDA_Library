from ripser import ripser
import math, numpy as np, os, re, itertools

"""actionUnitsKey = {                                                                                                                                              # dictionary mapping parts of face
    "leftEye": (0,7),                                                                                                                                           # to a subset of the Action Units list
    "rightEye": (8,15),                                                                                 
    "leftEyebrow": (16,25),
    "rightEyebrow": (26,35),
    "nose": (36,47),
    "mouth": (48,67),
    "jawline": (68,82)
}"""

# map every element in an array to the float representation of the element
def floatify(array):
    return map(lambda e: float(e), array)

# calculates the Euclidean distance between two points in d dimensions
def distance(p0, p1, d):
    return math.sqrt(sum([
        (p1[i]-p0[i])**2 
        for i in range(d)
    ]))

# gets a list of all files in a directory with ext extension
def getFileNames(d, ext):
    filesindir = []
    for elem in os.listdir(d):
        if os.path.isdir(d + '/' + elem):
            filesindir += getFileNames(d + '/' + elem, ext)
        else:
            if elem[elem.find('.'):] == ext:
                filesindir.append(d + '/' + elem)
    return filesindir

# creates the metric dissimilarity matrix for the data at filename
def getDissMatrix(filename, key, sects, containsHeader):
    lines = open(filename, 'r').readlines()

    temp = [floatify(line.split(' ')[1:]) for line in (lines[1:] if containsHeader else lines)]

    extent = [key.get(s) for s in sects]
    
    data = [temp[e[0]:e[1]] for e in extent]

    ran = range(len(data))

    mat = [[distance(data[i], data[j], 3) for j in ran] for i in ran]

    return mat

# creates a dissimilarity matrix from distances in a file
def rebuildDissMatrix(file, length):
    d = np.zeros(shape=(length,length))
    for v in file:
        d[v[0]][v[1]] = v[2]
        d[v[1]][v[0]] = v[2]
    return d

# gets data for the resultant embedding
def get_embedding_data(filepath, embedding, r):
    with open(filepath, 'r') as file:
        csv_file = csv.reader(file, delimiter=',')
        next(csv_file)
        values = [[int(row[0]),int(row[1]),float(row[2]) if row[2] != 'inf' else row[2]] for row in csv_file]

    d = rebuildDissMatrix(values, values.length)

    data = embedding.fit_transform(np.asmatrix(d))

    arr = np.array2string(data).replace('\n', '').replace('[','').replace(']','').split(' ')
    arr = list(map(lambda e : float(e), filter(lambda e : e != '', arr)))

    array = arr[r[0]:r[1]]
    
    return [
        {
            'x':i,
            'y':array[i]
        } 
        for i in range(len(array))
    ]

# calculates difference between two persistence diagrams
def hera(outputFilepaths, lineparts, inputFilepath1, inputFilepath2):
    dists = [
        './hera/bottleneck/bottleneck_dist ', 
        './hera/wasserstein/wasserstein_dist '
    ]

    heras = [
        dist + inputFilepath1 + ' ' + inputFilepath2
        for dist in dists
    ]

    indices = ','.join(lineparts)
    streams = [os.popen(h) for h in heras]

    for i in range(2):
        csv_file = open(outputFilepaths[i], 'a')
        csv_file.write(indices + ',' + streams[i].read()[:-1] + '\n')