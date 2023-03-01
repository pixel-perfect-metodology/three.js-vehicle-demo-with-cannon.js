import {
  Debug as CannonDebugger,
  Physics,
} from "use-cannon/packages/react-three-cannon/src";
// import { Debug as CannonDebugger, Physics } from "@react-three/cannon";
import {
  CameraControls,
  Environment,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import PhysicsScene from "components/PhysicsScene";
import { ControlsContext } from "hooks/useControls";
import { useIsFirstRender } from "hooks/useIsFirstRender";
import { Perf } from "r3f-perf";
import { RefObject, Suspense, useContext, useEffect, useState } from "react";
import { Vector3 } from "three";

export const DebuggerColorIdByName = {
  Black: 1 as const,
  White: 2 as const,
  Green: 3 as const,
};

export const DebuggerColorNamessById = [
  "Black" as const, // 0 index
  "Black" as const, // 1 index
  "White" as const, // 2 index
  "Green" as const, // 3 index
];

// type DebuggerColorsByNameValues = typeof DebuggerColorsByName[ColorKeys];
// export const DebuggerColorsById: {
//   [key in DebuggerColorsByNameValues]: ColorKeys;
// } = Object.fromEntries(
//   Object.entries(DebuggerColorsByName).map((entry) => entry.reverse())
// );

const Colors = {
  Black: "#000000" as const,
  White: "#ffffff" as const,
  Green: "#00ff00" as const,
};

type ColorKeys = keyof typeof Colors;
type ColorValues = (typeof Colors)[ColorKeys];

type SceneProps = {
  cameraControlsRef: RefObject<CameraControls>;
  cameraPosition: Vector3;
  cameraTarget: Vector3;
  worker: Worker;
};

const Scene = ({
  cameraControlsRef,
  cameraPosition = new Vector3(),
  cameraTarget = new Vector3(),
  worker,
}: SceneProps) => {
  const controls = useContext(ControlsContext);
  const {
    isActiveCannonDebugger,
    cannonDebuggerColorIndex,
    showFPSStats,
    showPerfomanceInfo,
  } = controls;

  const [
    isActiveCurrentCannonDebuggerState,
    setIsActiveCurrentCannonDebuggerState,
  ] = useState(false);
  const [cannonDebuggerColor, setCannonDebuggerColor] = useState<ColorValues>(
    Colors[DebuggerColorNamessById[cannonDebuggerColorIndex]]
  );

  useEffect(() => {
    if (!cameraControlsRef.current) {
      return;
    }

    // cameraControlsRef.current.setTarget(...cameraTarget.toArray());
    cameraControlsRef.current.setLookAt(
      ...cameraPosition.toArray(),
      ...cameraTarget.toArray()
    );
  }, []);

  useFrame(() => {
    if (isActiveCannonDebugger !== isActiveCurrentCannonDebuggerState) {
      setIsActiveCurrentCannonDebuggerState(isActiveCannonDebugger);
    }
  });

  useFrame(() => {
    if (!isActiveCannonDebugger) {
      return;
    }

    let newColor = cannonDebuggerColor;
    if (cannonDebuggerColorIndex === DebuggerColorIdByName.White) {
      newColor = Colors.White;
    } else if (cannonDebuggerColorIndex === DebuggerColorIdByName.Green) {
      newColor = Colors.Green;
    } else {
      //if (cannonDebuggerColor === DebuggerColors.Black)
      newColor = Colors.Black;
    }

    if (newColor !== cannonDebuggerColor) {
      setCannonDebuggerColor(newColor);
    }
  });

  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    setIsActiveCurrentCannonDebuggerState(!isActiveCurrentCannonDebuggerState);
  }, [cannonDebuggerColor]);

  return (
    <>
      {showFPSStats && <Stats />}
      {showPerfomanceInfo && <Perf position="top-right" />}

      <OrbitControls />

      <axesHelper position={[0, 0, 0]} name="scene x:0 y:0 z:0" />

      <fog attach="fog" args={["#171720", 10, 50]} />
      <color attach="background" args={["#171720"]} />
      <ambientLight intensity={0.1} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        intensity={1}
        penumbra={1}
        castShadow
      />

      <Physics
        broadphase="SAP"
        // @ts-expect-error
        contactEquationRelaxation={4}
        friction={1e-3}
        allowSleep
        worker={worker}
      >
        {isActiveCurrentCannonDebuggerState && (
          <CannonDebugger color={cannonDebuggerColor}>
            <PhysicsScene />
            {/* <PhysicsScene worker={worker} /> */}
          </CannonDebugger>
        )}
        {!isActiveCurrentCannonDebuggerState && <PhysicsScene />}
      </Physics>

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
    </>
  );
};

export default Scene;
