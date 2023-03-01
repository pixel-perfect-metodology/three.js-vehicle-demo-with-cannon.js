import {
  CylinderProps,
  useCylinder,
} from "use-cannon/packages/react-three-cannon/src";
// import { CylinderProps, useCylinder } from "@react-three/cannon";
import {
  CHASSIS,
  CUBE,
  PILLAR,
  SURFACE_FOR_PAINT,
  WHEEL,
} from "./ObjectCollisionTypes";
import { Mesh, BufferGeometry, Material } from "three";

const PILLAR_OBJECT_NAME = `pillar`;

export default function Pillar({
  args = [0.7, 0.7, 5, 16],
  ...props
}: CylinderProps) {
  const [ref] = useCylinder<Mesh<BufferGeometry, Material | Material[]>>(
    () => ({
      mass: 1000,
      collisionFilterGroup: PILLAR,
      collisionFilterMask: CHASSIS | WHEEL | SURFACE_FOR_PAINT | PILLAR | CUBE,
      args,
      ...props,
    })
  );
  return (
    <mesh ref={ref} castShadow receiveShadow name={PILLAR_OBJECT_NAME}>
      <cylinderGeometry args={args} name="pillar-mesh-geometry" />
      <meshNormalMaterial />
    </mesh>
  );
}
