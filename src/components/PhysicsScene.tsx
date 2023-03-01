import { useRef } from "react";
import { Object3D } from "three";
import Pillar from "components/scene-objects/Pillar";
import SurfaceForPaint from "components/scene-objects/SurfaceForPaint";
import Vehicle from "components/scene-objects/Vehicle";
import Cube from "components/scene-objects/Cube";
import { Mesh } from "three";
import { BufferGeometry } from "three";
import { Material } from "three";

const PhysicsScene = () => {
  // const PhysicsScene = ({worker}) => {
  const cubeRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null);
  // const cubeRef = useRef<
  //   | Mesh<BufferGeometry, Material | Material[]>
  //   // | ((instance: Mesh<BufferGeometry, Material | Material[]> | null) => void)
  //   | null
  //   // | undefined
  // >(null);
  // const cubeRef = useRef<Object3D<Event>>(null);

  return (
    <>
      <SurfaceForPaint sector={[-1, 0, -1]} />
      <SurfaceForPaint sector={[-1, 0, 0]} />
      <SurfaceForPaint sector={[-1, 0, 1]} />

      <SurfaceForPaint sector={[0, 0, -1]} />
      <SurfaceForPaint sector={[0, 0, 0]} printCollisionInfo={true} />
      <SurfaceForPaint sector={[0, 0, 1]} />

      <SurfaceForPaint sector={[1, 0, -1]} />
      <SurfaceForPaint sector={[1, 0, 0]} />
      <SurfaceForPaint sector={[1, 0, 1]} />

      <Pillar position={[-5, 0, -6]} userData={{ id: "pillar-1" }} />
      <Pillar position={[0, 0, -6]} userData={{ id: "pillar-2" }} />
      <Pillar position={[5, 0, -6]} userData={{ id: "pillar-3" }} />

      {/* <Surface sector={[-1, 0, -1]} userData={{ id: "floor_-1:0:-1" }} />
            <Surface sector={[-1, 0, 0]} userData={{ id: "floor_-1:0:0" }} />
            <Surface sector={[-1, 0, 1]} userData={{ id: "floor_-1:-:1" }} />

            <Surface sector={[0, 0, -1]} userData={{ id: "floor_0:0:-1" }} />
            <Surface sector={[0, 0, 0]} userData={{ id: "floor_0:0:0" }} />
            <Surface sector={[0, 0, 1]} userData={{ id: "floor_0:0:1" }} />

            <Surface sector={[1, 0, -1]} userData={{ id: "floor_1:0:-1" }} />
            <Surface sector={[1, 0, 0]} userData={{ id: "floor_1:0:0" }} />
            <Surface sector={[1, 0, 1]} userData={{ id: "floor_1:0:1" }} /> */}

      <Cube ref={cubeRef} position={[5, 0, 0]} args={[1, 2, 1]} />

      {/* <Vehicle rotation={[0, -Math.PI / 4, 0]} angularVelocity={[0, 0.5, 0]} /> */}
      <Vehicle rotation={[0, -Math.PI / 4, 0]} position={[0, 2, 0]} />
      {/* <Vehicle worker={worker} rotation={[0, -Math.PI / 4, 0]} position={[0, 2, 0]} /> */}

      {/* debug vehicle wheels */}
      {/* <Cube type='Static' ref={cubeRef} position={[0, 0, 0]} args={[1, 2, 1]} /> */}
    </>
  );
};

export default PhysicsScene;
