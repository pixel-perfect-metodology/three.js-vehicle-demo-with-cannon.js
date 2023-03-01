import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
import Scene from "components/Scene";
import HUD from "components/HUD";
import "./styles.css";
import { ControlsContext, useControls } from "hooks/useControls";

// const a = new URL(
//   "./worker.ts",
//   // "/src/use-cannon/packages/cannon-worker-api/src/worker/index.ts"
//   // "use-cannon/packages/cannon-worker-api/src/worker/index.ts",
//   //
//   import.meta.url
// );

const App = () => {
  const worker: Worker = useMemo(
    () =>
      new Worker(
        new URL(
          //   "./worker.ts",
          //   // "/src/use-cannon/packages/cannon-worker-api/src/worker/index.ts"
          "use-cannon/packages/cannon-worker-api/src/worker/index.ts",
          //   //
          import.meta.url
        )
        // a
      ),
    []
  );

  const [cameraPosition, setCameraPosition] = useState(
    new Vector3(0.5, 2, 20.5)
  );
  const [cameraTarget, setCameraTarget] = useState(new Vector3(2.2, -3.6, 0.6));
  const CameraControlsRef = useRef<CameraControls>(null);

  const onChangeCamera = (e?: { [x: string]: any; type: "controlend" }) => {
    if (!e) {
      return;
    }

    const eventTarget = e.target as CameraControls;
    setCameraPosition(eventTarget.getPosition(new Vector3()));
    setCameraTarget(eventTarget.getTarget(new Vector3()));
  };

  const CanvasRef = useRef(null);
  const controls = useControls();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <ControlsContext.Provider value={controls}>
        <Suspense fallback={null}>
          <Canvas
            ref={CanvasRef}
            dpr={[1, 1.5]}
            shadows
            camera={{
              fov: 50
            }}
          >
            <CameraControls ref={CameraControlsRef} onEnd={onChangeCamera} />
            <Scene
              cameraControlsRef={CameraControlsRef}
              cameraPosition={cameraPosition}
              cameraTarget={cameraTarget}
              worker={worker}
            />
          </Canvas>
          <HUD cameraPosition={cameraPosition} cameraTarget={cameraTarget} />
        </Suspense>
      </ControlsContext.Provider>
    </div>
  );
};

export default App;
