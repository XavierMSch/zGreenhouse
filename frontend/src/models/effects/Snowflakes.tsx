import { useEffect, useRef } from "react";
import { useAnimations, useGLTF, useMask } from "@react-three/drei";
import type { Group, Material, Mesh } from "three";

type SnowflakesProps = {
  intensity: number;
  maskId: number;
};
export function Snowflakes({ intensity, maskId }: SnowflakesProps) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF("/3d-models/snowflakes_animation.glb");
  const { actions } = useAnimations(animations, group);
  const stencil = useMask(maskId); // ← AGREGAR ESTA LÍNEA

  useEffect(() => {
    const firstAnimationName = animations[0]?.name;
    if (!firstAnimationName) return;

    const action = actions?.[firstAnimationName];
    action?.reset().play();

    return () => {
      action?.stop();
    };
  }, [actions, animations]);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        const material = mat as Material & {
          transparent: boolean;
          opacity: number;
          depthWrite: boolean;
          needsUpdate: boolean;
        };

        Object.assign(material, stencil); // ← AGREGAR ESTA LÍNEA
        material.transparent = true;
        material.opacity = intensity;
        material.depthWrite = false;
        material.needsUpdate = true;
      });
    });

    if (group.current) {
      group.current.visible = intensity > 0.01;
    }
  }, [scene, intensity, stencil]); // ← AGREGAR stencil A LAS DEPENDENCIAS

  return (
    <group ref={group} scale={2} position={[0.1, 0, 0]}>
      <primitive object={scene} fog={false} />
    </group>
  );
}
