import {
  BoxProps,
  Triplet,
  useBox,
} from "use-cannon/packages/react-three-cannon/src";
// import { BoxProps, Triplet, useBox } from "@react-three/cannon";
import {
  CHASSIS,
  CUBE,
  PILLAR,
  SURFACE_FOR_PAINT,
  WHEEL,
} from "./ObjectCollisionTypes";
import { forwardRef, Ref, RefObject } from "react";
import { BufferGeometry, Material, Mesh } from "three";

export type CubeProps = BoxProps & Partial<{ color: string }>;

const Cube = forwardRef(
  (
    { color = "#0391ba", args = [1, 1, 1] as Triplet, ...props }: CubeProps,
    ref
    // ref: RefObject<Mesh<BufferGeometry, Material | Material[]>> | null
    // ref: RefObject<Mesh<BufferGeometry, Material | Material[]>>
    // | undefined
    // ref:
    //   // | ((instance: Mesh<BufferGeometry, Material | Material[]> | null) => void)
    //   | RefObject<Mesh<BufferGeometry, Material | Material[]>>
    //   | null
    //   // | undefined
  ) => {
    const [, api] = useBox<Mesh>(
      () => ({
        mass: 100,
        collisionFilterGroup: CUBE,
        collisionFilterMask:
          CHASSIS | WHEEL | SURFACE_FOR_PAINT | PILLAR | CUBE,
        // collisionFilterMask: CHASSIS | WHEEL | SURFACE_FOR_PAINT | PILLAR | CUBE
        args,
        ...props,
      }),
      // @ts-expect-error
      ref
    );

    // useFrame(() => {
    //   cube.current!.rotation.x += 0.01;
    //   cube.current!.rotation.y += 0.01;
    // });

    return (
      // @ts-expect-error
      <mesh ref={ref} api={api} castShadow receiveShadow name="cube">
        <boxGeometry args={args} name="cube-mesh-geometry" />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }
);

export default Cube;
