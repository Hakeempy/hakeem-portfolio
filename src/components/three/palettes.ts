import * as THREE from "three";

// Colours for each theme: raw records, clean records, the gold layer, unlit gates, and the room.
export const PALETTES = {
  dark: {
    raw: new THREE.Color("#8f8a84"),
    clean: new THREE.Color("#f4f4f3"),
    gold: new THREE.Color("#c9a45a"),
    gate: new THREE.Color("#4a433c"),
    room: new THREE.Color("#0c0a08"),
  },
  light: {
    raw: new THREE.Color("#aaa49c"),
    clean: new THREE.Color("#1d1a16"),
    gold: new THREE.Color("#a07b34"),
    gate: new THREE.Color("#c4bfb6"),
    room: new THREE.Color("#f3f2ef"),
  },
};
export type Palette = (typeof PALETTES)["dark"];
