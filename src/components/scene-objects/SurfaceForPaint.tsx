import {
  BoxProps,
  CollideEvent,
  CompoundBodyProps,
  Triplet,
  useCompoundBody
} from "use-cannon/packages/react-three-cannon/src";
// } from "@react-three/cannon";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import {
  CHASSIS,
  CUBE,
  PILLAR,
  SURFACE_FOR_PAINT,
  WHEEL
} from "./ObjectCollisionTypes";
import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import {
  ArrowHelper,
  BoxGeometry,
  CanvasTexture,
  Event,
  Intersection,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  Vector2,
  Vector3
} from "three";

const SURFACE_ROOT_OBJECT_NAME = `surface-for-paint`;
const SURFACE_ROOT_OBJECT_MESH_NAME = `surface-for-paint-mesh`;
const HELPER_BOX_NAME = "box-helper";
const HELPER_ARROW_NAME = "arrow-helper";
const HELPER_SPHERE_NAME = "sphere-helper";

const OVERLAP_FOR_TEXTURES_SEAMLESS = 1; // experemental found value // todo should be get from wheel sizes
// const WHEEL_MAX_SIDE_LENGTH = 0.4; // experemental found value // todo should be get from wheel sizes

type SurfaceForPaintProps = BoxProps &
  Partial<{
    width: number;
    height: number;
    depth: number;
    sector: Triplet;
    printCollisionInfo: boolean;
    showDebugHelpers: boolean;
    showSphereToIntersectionPoint: boolean;
  }>;

export default function SurfaceForPaint({
  width = 10,
  height = 1,
  depth = 10,
  sector = [0, 0, 0],
  printCollisionInfo = false,
  showDebugHelpers = false,
  // showDebugHelpers = false,
  // showSphereToIntersectionPoint = true,
  showSphereToIntersectionPoint = false,
  ...props
}: SurfaceForPaintProps) {
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

  let surfaceCompoundBodyOptions: CompoundBodyProps = {
    mass: 1,
    position: [sector[0] * width, -height * 3, sector[2] * depth],
    type: "Static",
    material: "ground",
    collisionFilterGroup: SURFACE_FOR_PAINT,
    collisionFilterMask: CHASSIS | WHEEL | PILLAR | CUBE,
    shapes: [
      {
        type: "Box",
        args: [
          width + OVERLAP_FOR_TEXTURES_SEAMLESS,
          height,
          depth + OVERLAP_FOR_TEXTURES_SEAMLESS
        ]
      }
    ],
    ...props
  };

  if (printCollisionInfo) {
    surfaceCompoundBodyOptions.onCollide = onCollideHandler;
  }

  const ref = useRef<Object3D<Event>>(null);
  useCompoundBody(() => surfaceCompoundBodyOptions, ref);

  const canvasRef = useRef(document.createElement("canvas"));
  const textureRef = useRef<CanvasTexture>(null);

  const paintBackgroundTexture = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "gray";
        context.fill();

        if (textureRef.current) {
          textureRef.current.needsUpdate = true;
        }
      }
    }
  }, [canvasRef, textureRef]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 1024;

    paintBackgroundTexture();
  }, [canvasRef, paintBackgroundTexture]);

  const paintImprint = useCallback(
    ({ uv }: ThreeEvent<PointerEvent> | { uv: Vector2 }) => {
      if (canvasRef.current) {
        if (uv) {
          const canvas = canvasRef.current;
          const x = uv.x * canvas.width;
          const y = (1 - uv.y) * canvas.height;

          const context = canvas.getContext("2d");
          if (context) {
            const arcRadius = 20;
            context.beginPath();
            context.arc(x, y, arcRadius, 0, 2 * Math.PI);
            context.fillStyle = "rgba(0, 0, 0, 0.025)";
            // context.fillStyle = "rgba(0, 0, 0, 0.5)";
            // context.fillStyle = "black";
            context.fill();

            if (textureRef.current) {
              textureRef.current.needsUpdate = true;
            }
          }
        }
      }
    },
    [canvasRef, textureRef]
  );

  const resetTextureToDefaultState = useCallback(() => {
    paintBackgroundTexture();
  }, [paintBackgroundTexture]);

  const arrowHelperRef = useRef<ArrowHelper>(null);

  useFrame((state) => {
    const scene = state.scene;

    let wheelWorldPosition = new Vector3();
    let wheelWorldDirection = new Vector3();

    let surfaceWorldPosition = new Vector3();
    let surfaceWorldDirection = new Vector3();

    const wheelOne = scene.getObjectByName("wheel-front-first-axis-left");
    const surface000 = scene.getObjectByProperty("sector", "0:0:0");

    if (!wheelOne || !surface000) {
      return;
    }

    const surface000Mesh = surface000.getObjectByName(
      SURFACE_ROOT_OBJECT_MESH_NAME
    );
    if (!surface000Mesh) {
      return;
    }

    wheelOne.getWorldPosition(wheelWorldPosition);
    wheelOne.getWorldDirection(wheelWorldDirection);

    surface000Mesh.getWorldPosition(surfaceWorldPosition);
    surface000Mesh.getWorldDirection(surfaceWorldDirection);

    const getAllObjectsByName = (
      // as collection analog of Object3d.geObjectByName
      originObject: Object3D,
      targetObjectNames: String[]
    ): Object3D[] => {
      const foundObjects: Object3D[] = [];
      originObject.traverse((sceneObject) => {
        if (targetObjectNames.includes(sceneObject.name)) {
          foundObjects.push(sceneObject);
        }
      });

      return foundObjects;
    };

    const removeObjectHelpersFromScene = (targetObjectNames: string[] = []) => {
      const objectsToRemoveFromScene: Object3D[] = getAllObjectsByName(
        scene,
        targetObjectNames
      );
      scene.remove(...objectsToRemoveFromScene);
    };

    removeObjectHelpersFromScene([
      HELPER_BOX_NAME,
      HELPER_SPHERE_NAME,
      HELPER_ARROW_NAME
    ]);

    const addBoxHelper = (position: Vector3, direction: Vector3) => {
      if (!position) {
        throw new Error("addBoxHelper(position) position is not defined");
      }

      const sideSize = 1;
      const sideSegments = 1;
      const geometry = new BoxGeometry(
        sideSize,
        sideSize,
        sideSize,
        sideSegments,
        sideSegments,
        sideSegments
      );

      const material = new MeshBasicMaterial({ color: 0x00ffff });
      material.wireframe = true;

      const box = new Mesh(geometry, material);
      box.name = HELPER_BOX_NAME;

      box.position.set(...position.toArray());
      box.lookAt(direction);

      scene.add(box);
    };

    if (showDebugHelpers) {
      addBoxHelper(wheelWorldPosition, wheelWorldDirection);
      addBoxHelper(surfaceWorldPosition, surfaceWorldDirection);
    }

    // const directionFromWheelWorldPositionToSurfaceWorldPosition = new Vector3();
    // // direction.subVectors(wheelWorldPosition, surfaceWorldPosition).normalize();
    // directionFromWheelWorldPositionToSurfaceWorldPosition
    //   .subVectors(surfaceWorldPosition, wheelWorldPosition)
    //   .normalize();

    const gravityDirection = new Vector3(0, -1, 0);

    const rayOriginPosition = wheelWorldPosition;
    const rayDirection = gravityDirection;
    // const rayDirection = directionFromWheelWorldPositionToSurfaceWorldPosition

    const { raycaster } = state;

    // save previous raycaster parameters
    const previousRaycasterParameters = {
      ray: {
        origin: raycaster.ray.origin,
        direction: raycaster.ray.direction
      },
      near: raycaster.near,
      far: raycaster.far
      // mode: raycaster.mode,
    };
    // /save previous raycaster parameters

    raycaster.set(rayOriginPosition, rayDirection);
    raycaster.near = 0;
    raycaster.far = 0.625; // = wheel radius + error_delta

    const surfaces = scene.getObjectsByProperty(
      "name",
      SURFACE_ROOT_OBJECT_MESH_NAME
    );
    // const a = getAllObjectByName(scene, targetObjectNames); // alternative to search by array of value for attribute
    const intersections = raycaster.intersectObjects(surfaces, false);

    // restore previous raycaster parameters
    raycaster.set(
      previousRaycasterParameters.ray.origin,
      previousRaycasterParameters.ray.direction
    );
    raycaster.near = previousRaycasterParameters.near;
    raycaster.far = previousRaycasterParameters.far;
    // /restore previous raycaster parameters

    const addSphereHelperToScene = (
      position: Vector3,
      direction: Vector3 | undefined | null,
      userData: { [key: string]: any } = {}
    ) => {
      const radius = 0.2;
      const widthSegments = 8;
      const heightSegments = 6;
      const geometry = new SphereGeometry(
        radius,
        widthSegments,
        heightSegments
      );
      const material = new MeshBasicMaterial({ color: 0xffff00 });
      material.wireframe = true;
      const sphere = new Mesh(geometry, material);
      sphere.name = HELPER_SPHERE_NAME;
      sphere.userData = userData;

      sphere.position.set(...position.toArray());
      if (direction) {
        sphere.lookAt(direction);
      }

      scene.add(sphere);
    };

    const MIN_DISTANCE_BETWEEN_WHEEL_AND_SURFACE_TO_COUNT_IT_AS_A_TOUCH = 0.625; // wheelRadius = radius(1) * radiusScaleCoefficient(0.625) // see more on next line
    // intersection.distance - distance between the origin-of-the-ray (wheel-position) and the intersection

    const paintTrailInIntersectionPoint = (
      intersection: Intersection<Object3D<Event>> | undefined
    ) => {
      if (!intersection) {
        return;
      }

      if (
        intersection.distance <=
        MIN_DISTANCE_BETWEEN_WHEEL_AND_SURFACE_TO_COUNT_IT_AS_A_TOUCH
      ) {
        const intersectionName = `wheel: ${wheelOne.name} surface: ${intersection.object.name}`;
        const userData = {
          intersectionName
        };

        if (showDebugHelpers || showSphereToIntersectionPoint) {
          addSphereHelperToScene(intersection.point, null, userData);
        }

        if (intersection.uv) {
          paintImprint({ uv: intersection.uv });
        }
      }
    };

    // paint on all intersection points
    // intersections.forEach((intersection) =>
    //   paintTrailInIntersectionPoint(intersection)
    // );

    const closestIntersection = intersections[0];
    paintTrailInIntersectionPoint(closestIntersection); // TODO enable to draw trails by wheels

    // for debug only
    window.closestIntersection = closestIntersection;
    window.intersections = intersections;
    // /for debug only

    const addArrowHelper = (
      arrowHelperRef: RefObject<ArrowHelper> | undefined
    ) => {
      if (!arrowHelperRef || !arrowHelperRef.current) {
        return;
      }

      const arrow = arrowHelperRef.current;

      arrow.position.set(...rayOriginPosition.toArray());
      arrow.setDirection(rayDirection);
      arrow.setColor("#ff0000");

      arrow.setLength(2);
      // arrow.setLength(10);
      // if (closestIntersection) {
      //   arrow.setLength(closestIntersection.distance);
      // }
    };

    if (showDebugHelpers) {
      addArrowHelper(arrowHelperRef);
    }

    // todo ////////////////////////////////////////////////////////
    // uv = surface000.geometry.getAttribute('uv');
    // window.originalUV = uv.array.slice()
    // window.uv = uv
    //   for (let i = 0; i < uv.count; i++) {
    //     uv.array[i + 0] = uv.array[i + 0] < 0 ? uv.array[i + 0]+0.1 : uv.array[i + 0] - 0.1;
    //     uv.array[i + 1] = uv.array[i + 1] < 0 ? uv.array[i + 1]+0.1 : uv.array[i + 1] - 0.1;
    // }
    // uv.needsUpdate = true
  });

  const sectorCoordinates = sector.join(":");
  // const [showAsWireframe, setShowAsWireframe] = useState(true);
  const [showAsWireframe, setShowAsWireframe] = useState(false);

  return (
    <group
      ref={ref}
      name={SURFACE_ROOT_OBJECT_NAME}
      sector={sectorCoordinates}
      onPointerMove={paintImprint}
      onPointerDown={resetTextureToDefaultState}
    >
      <arrowHelper ref={arrowHelperRef} name={HELPER_ARROW_NAME} />

      <group position={[0, height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow name={SURFACE_ROOT_OBJECT_MESH_NAME}>
          <planeGeometry
            name="surface-plane-geometry"
            attach="geometry"
            args={[width, depth]}
          />
          <meshStandardMaterial
            name="surface-mesh-standart-material"
            attach="material"
            metalness={0}
            roughness={1}
            wireframe={showAsWireframe}
          >
            <canvasTexture
              ref={textureRef}
              attach="map"
              image={canvasRef.current}
            />
          </meshStandardMaterial>
        </mesh>
      </group>
    </group>
  );
}
