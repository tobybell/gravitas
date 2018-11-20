import * as THREE from 'three';

export const ORIGIN = new THREE.Vector3(0, 0, 0);
export const X_AXIS = new THREE.Vector3(1, 0, 0);
export const Y_AXIS = new THREE.Vector3(0, 1, 0);
export const Z_AXIS = new THREE.Vector3(0, 0, 1);

export const SPHERE_GEO = new THREE.SphereBufferGeometry(1, 60, 30);
export const CIRCLE_GEO = new THREE.RingBufferGeometry(1, 1, 120, 0);
