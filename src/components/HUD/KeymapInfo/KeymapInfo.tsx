import { useContext } from "react";
import { ControlsContext } from "hooks/useControls";
import { v4 as uuidv4 } from "uuid";
import KeymapNotes, { KeymapItem } from "./KeymapNotes";

const addUUID = (keymapItem: { [key: string]: any }) => {
  keymapItem.uuid = uuidv4();

  return keymapItem;
};

const defaultKeymap: KeymapItem[] = [
  { buttons: ["w", "a", "s", "d"], label: "movement" },
  { button: "space", label: "brake" },
  { button: "r", label: "reset vehicle state" },
  { placeholder: true },

  { button: "h", label: "show/hide more hotkeys" }
].map((v) => addUUID(v) as KeymapItem);

const cannonDebuggerKeymap: KeymapItem[] = [
  { button: "c", label: "enable/disable physics (cannon.js) debugger" }
].map((v) => addUUID(v) as KeymapItem);

const cannonDebuggerExtendedKeymap = [
  {
    groupTitle: "Change highlight color of (cannon.js) debugger",
    keymap: [
      { button: "1", label: "black color" },
      { button: "2", label: "white color" },
      { button: "3", label: "green color" }
    ].map((v) => addUUID(v))
  }
].map((v) => addUUID(v));

const extendedKeymap = (isActiveCannonDebugger = false): KeymapItem[] =>
  [
    { button: "o", label: "show FPS" },
    { button: "p", label: "show perfomance info" },
    { placeholder: true },

    { button: "i", label: "show camera info" },
    { placeholder: true },

    { button: "f", label: "show wireframe" },
    { placeholder: true },

    ...(isActiveCannonDebugger ? [{ placeholder: true }] : []),
    ...cannonDebuggerKeymap,
    ...(isActiveCannonDebugger
      ? [{ placeholder: true }, ...cannonDebuggerExtendedKeymap]
      : []),
    { placeholder: true },
    ...(isActiveCannonDebugger ? [{ placeholder: true }] : []),

    ...defaultKeymap
  ].map((v) => addUUID(v) as KeymapItem);

const KeymapInfo = () => {
  const { showExtendedKeymapInfo } = useContext(ControlsContext);

  const { isActiveCannonDebugger } = useContext(ControlsContext);

  const keymap = showExtendedKeymapInfo
    ? extendedKeymap(isActiveCannonDebugger)
    : defaultKeymap;

  return (
    <div
      className="keymap-note"
      style={{
        position: "absolute",
        bottom: "1em",
        left: "1em",
        lineHeight: "1.7em",
        fontFamily: "monospace",
        wordSpacing: "-0.2em",
        textShadow: "rgba(0, 0, 0, 0.7) 0 1px 2px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        padding: "1em 1em",
        // userSelect: 'none', // overlap by * pointerEvents: "none" *
        pointerEvents: "none"
      }}
    >
      <KeymapNotes keymap={keymap} />
    </div>
  );
};

export default KeymapInfo;
