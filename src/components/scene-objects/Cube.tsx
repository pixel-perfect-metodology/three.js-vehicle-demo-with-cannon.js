import { BoxProps, Triplet, useBox } from "use-cannon/packages/react-three-cannon/src";
// import { BoxProps, Triplet, useBox } from "@react-three/cannon";
import {
  CHASSIS,
  CUBE,
  PILLAR,
  SURFACE_FOR_PAINT,
  WHEEL
} from "./ObjectCollisionTypes";
import { forwardRef, Ref } from "react";
import { BufferGeometry, Material, Mesh } from "three";

type CubeProps = BoxProps &
  Partial<{
    color: string;
  }>;

const Cube = forwardRef(
  (
    { color = "#0391ba", args = [1, 1, 1] as Triplet, ...props }: CubeProps,
    ref
  ) => {
    const [, api] = useBox<Mesh>(
      () => ({
        mass: 100,
        collisionFilterGroup: CUBE,
        collisionFilterMask:
          CHASSIS | WHEEL | SURFACE_FOR_PAINT | PILLAR | CUBE,
        // collisionFilterMask: CHASSIS | WHEEL | SURFACE_FOR_PAINT | PILLAR | CUBE
        args,
        ...props
      }),
      ref
    );

    // useFrame(() => {
    //   cube.current!.rotation.x += 0.01;
    //   cube.current!.rotation.y += 0.01;
    // });

    return (
      <mesh ref={ref} api={api} castShadow receiveShadow name="cube">
        <boxGeometry args={args} name="cube-mesh-geometry" />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }
);

export default Cube;
