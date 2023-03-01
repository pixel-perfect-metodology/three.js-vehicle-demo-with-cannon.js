import {
  BoxProps,
  CollideEvent,
  useBox
} from "use-cannon/packages/react-three-cannon/src";
// import { BoxProps, CollideEvent, useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import {
  CHASSIS,
  CUBE,
  PILLAR,
  SURFACE_FOR_PAINT,
  WHEEL
} from "../ObjectCollisionTypes";
import { forwardRef, Ref, useContext, useState } from "react";
import { Mesh, Object3D } from "three";
import { ControlsContext } from "hooks/useControls";

const filePath = "/all-terrain-vehicle-chassis.textured.glb";

type ChassisProps = BoxProps & {
  printCollisionInfo?: boolean;
};

const Chassis = forwardRef(
  (
    {
      args = [1.65, 0.8, 4],
      mass = 5000,
      printCollisionInfo = false,
      ...props
    }: ChassisProps,
    ref
  ) => {
    const { nodes, materials } = useGLTF(filePath);

    const onCollideHandler = function (e: CollideEvent) {
      if (
        e.body.name !== "pillar" &&
        e.body.name !== "cube" &&
        e.target.name === "surface-for-paint"
      ) {
        debugger;
      }
      // if (e.body.userData.id === "floor_0:0:0") {
      //   // if (e.body.userData.id === "wheel-front-first-axis-left") {
      //   // console.log("collision with wheel", e.body.userData);
      //   // console.log(arguments);
      //   if (logs.length < 10) {
      //     logs.push({ e, arguments });
      //   }
      // }
    };

    const chassisBoxOptions = {
      mass,
      args,
      allowSleep: false,
      collisionFilterGroup: CHASSIS,
      collisionFilterMask: CHASSIS | WHEEL | SURFACE_FOR_PAINT | PILLAR | CUBE,
      ...props
    };

    if (printCollisionInfo) {
      chassisBoxOptions.onCollide = onCollideHandler;
    }

    const [_boxRef, api] = useBox<Mesh>(() => chassisBoxOptions, ref);

    const steelMaterial = materials["Paint.Gray"];
    const windowMaterial = materials["Black plastic"];

    const { showWireframe } = useContext(ControlsContext);

    (nodes.Cube002 as Mesh).material.wireframe = showWireframe;
    (nodes.Cube002_1 as Mesh).material.wireframe = showWireframe;

    const { position } = props;

    /*
    Auto-generated by: https://github.com/pmndrs/gltfjsx
    Command: npx gltfjsx@6.1.4 chassis.glb --transform
    */
    return (
      <mesh ref={ref} api={api} name="chassis">
        <axesHelper
          name="chassis-helper"
          position={position}
          // position={_boxRef.current?.position.toArray()}
        />
        <group
          position={[0, -0.83, 0]}
          name="chassis-inner-mesh-position-group"
        >
          <mesh
            name="chassis-metallic-parts"
            castShadow
            receiveShadow
            geometry={nodes.Cube002.geometry}
            material={steelMaterial}
          />
          <mesh
            name="chassis-plastic-parts"
            castShadow
            receiveShadow
            geometry={nodes.Cube002_1.geometry}
            material={windowMaterial}
          />
        </group>
      </mesh>
    );
  }
);

useGLTF.preload(filePath);

export default Chassis;