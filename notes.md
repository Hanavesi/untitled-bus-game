### Parsing the gltf file
- loop through the nodes starting from the root node inside the scenes object
- for each node
    - create object to store data
    - store local transform *if not specified set default values eg. no transform*
    - parse mesh data if present and add reference to it in node
    - parse skin data if present and add reference to it in node
    - iterate through children

## Objects in code
*Probably add data from non-node objects into the parent node-objects. Like mesh, skin and animation data*
- Buffers
- Node
    - childNodes list []
    - transform matrix
    - *mesh data*
        - primitives
            - vertex buffers / VBO
            - index buffer / EBO
            - VAO
            - materials
                - **decide how to do**
    - *skin data*
        - inverse bind matrices
        - joints indices list []
- *animation data*
    - **read about gltf animation**

### Reading buffers
- Pass list of buffer URIs to function that returns a list of ArrayBuffer objects of same length

## Mesh parsing
- Append buffers together if primitive attributes are in different buffers
    - update byteOffset for these attributes
- Put indices in its own ArrayBuffer object
- create gl VAO, VBO and EBO from these buffers and store gl buffer objects in mesh data
- **Material parsing implementation on a later date**

## Animations
- For each animation in animations list
    - store as a separate animation object
    - check animation channels for sampler input min/max and store it
- Create LERP and SLERP functions for transformations
- Create functions that take animation and timestamp and return transformation matrix
- Create a list of FinalMatrices after animating with indices representing node IDs

## Inverse Bind Matrices
InverseBindMatrices are stored in the buffer in the order that the joints are listed.

- Create a Float32Array
- Loop through the buffer for the matrices
- Set them into the array with an index based on the joint
- take into account that each joint contains 16 float32 values

## Global Transform of Joint node
Needs to be calculcated for all joints before any draw calls by looping through the nodes.
- create a list containing boneName-matrix pairs
- Start looping through the joints list of a skin and iterating through a joints children
- add to list if bone name not found and continue iterating
- else skip to next

## Joint matrix
- Calculate the joint matrix with
    (InverseMeshParentTransform) * globalTransformOfJoint * inverseBindMatrix
- inverse of meshes parent node might not be needed

## Rendering
- If node contains skinning data
    - calculate jointmatrices from generated FinalMatrices, InverseBindMatrices and inverse of parent node tansform matrix
    - pass matrices as uniform/texture to skinning shader program
- Keep track of local transformations while iterating through node hierarchy
- When node has a mesh
    - If it has a skin use skinning shader program
    - If not use another shader program
    - Pass local transform as a mat4 uniform
    - draw()