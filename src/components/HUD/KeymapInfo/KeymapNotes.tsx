import GroupKeyNote, { GroupKeyNoteProps } from "./GroupKeyNote";
import MultipleKeyNote, { MultipeKeyNoteProps } from "./MultipleKeyNote";
import PlaceholderNote, { PlaceholderNoteProps } from "./PlaceholderNote";
import SingleKeyNote, { SingleKeyNoteProps } from "./SingleKeyNote";

export type KeymapItem =
  | PlaceholderNoteProps
  | SingleKeyNoteProps
  | MultipeKeyNoteProps
  | GroupKeyNoteProps;

export type KeymapProps = { keymap: KeymapItem[] };

const KeymapNotes = ({ keymap }: KeymapProps) => {
  if (!keymap || !keymap.length) {
    return null;
  }

  return (
    <>
      {keymap.map((keymapItem: KeymapItem) => {
        if ("placeholder" in keymapItem) {
          // if (isPlaceholderNote(keymapItem as PlaceholderNoteProps)) {
          return <PlaceholderNote {...keymapItem} key={keymapItem.uuid} />;
        } else if ("button" in keymapItem) {
          // } else if (isSingleKeyNote(keymapItem as SingleKeyNoteProps)) {
          return <SingleKeyNote {...keymapItem} key={keymapItem.uuid} />;
        } else if ("buttons" in keymapItem) {
          // } else if (isMultipleKeyNote(keymapItem)) {
          return <MultipleKeyNote {...keymapItem} key={keymapItem.uuid} />;
        } else if ("groupTitle" in keymapItem) {
          // } else if (isGroupKeyNote(keymapItem)) {
          return <GroupKeyNote {...keymapItem} key={keymapItem.uuid} />;
        } else {
          return null;
        }
      })}
    </>
  );
};

export default KeymapNotes;
