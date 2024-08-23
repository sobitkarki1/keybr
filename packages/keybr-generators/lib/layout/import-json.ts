import { readFileSync } from "node:fs";
import {
  type Character,
  type CharacterDict,
  KeyCharacters,
  type KeyId,
} from "@keybr/keyboard";
import { toCodePoints } from "@keybr/unicode";
import chalk from "chalk";
import { pathTo } from "../root.ts";
import { makeDeadCharacter } from "./diacritics.ts";
import { type CharacterList, type KeyMap } from "./json.ts";
import { characterKeys } from "./keys.ts";

export function importKeymap(filename: string): CharacterDict {
  console.log(`Parsing JSON file ${filename}`);
  const text = readFileSync(pathTo(filename), "utf-8");
  return parseKeymap(JSON.parse(text));
}

function parseKeymap(keymap: KeyMap): CharacterDict {
  const dict = new Map<KeyId, (Character | null)[]>();
  for (const keyId of characterKeys) {
    const list = keymap[keyId];
    if (list != null) {
      dict.set(keyId, parseCharacterList(keyId, list));
    }
  }
  return { ...Object.fromEntries(dict), Space: [0x0020] };
}

function parseCharacterList(
  keyId: KeyId,
  list: CharacterList,
): (Character | null)[] {
  if (typeof list === "string") {
    return [...toCodePoints(list)];
  }

  if (Array.isArray(list)) {
    const characters: (Character | null)[] = [];

    for (const item of list) {
      if (item == null || item === 0x0000) {
        characters.push(null);
        continue;
      }

      if (
        KeyCharacters.isCodePoint(item) ||
        KeyCharacters.isDead(item) ||
        KeyCharacters.isSpecial(item) ||
        KeyCharacters.isLigature(item)
      ) {
        characters.push(item);
        continue;
      }

      if (typeof item === "string") {
        const a = [...toCodePoints(item)];

        if (a.length === 0) {
          characters.push(null);
          continue;
        }

        if (a.length === 1) {
          characters.push(a[0]);
          continue;
        }

        if (a.length === 2) {
          if (a[0] === /* * */ 0x002a) {
            characters.push(makeDeadCharacter(keyId, a[1]));
            continue;
          }

          characters.push(null);
          console.error(chalk.red(`[${keyId}] Invalid character`), item);
          continue;
        }

        characters.push(null);
        console.error(chalk.red(`[${keyId}] Invalid character`), item);
        continue;
      }

      characters.push(null);
      console.error(chalk.red(`[${keyId}] Invalid character`), item);
    }

    return characters;
  }

  console.error(chalk.red(`[${keyId}] Invalid character list`), list);
  return [];
}

/**
 * Layout data as a two-dimensional array.
 *
 * ```
 * [
 *    ["`~", "1!", ...], // Backspace row.
 *    ["qQ", "wW", ...], // Tab row.
 *    ["aA", "sS", ...], // CapsLock row.
 *    ["zZ", "xX", ...], // Shift row.
 * ]
 * ```
 */
export type KeyList = readonly (readonly CharacterList[])[];

/**
 * Parses the given layout data for the ANSI geometry.
 */
export function parseAnsiLayout(data: KeyList): CharacterDict {
  return parseLayout(ansiGeometry, data);
}

/**
 * Parses the given layout data for the ISO geometry.
 */
export function parseIsoLayout(data: KeyList): CharacterDict {
  return parseLayout(isoGeometry, data);
}

export function parseLayout(
  geometry: readonly (readonly KeyId[])[],
  data: KeyList,
): CharacterDict {
  const map = new Map<KeyId, CharacterList>();
  if (geometry.length !== data.length) {
    throw new TypeError(
      `Wrong number of rows, ` +
        `expected ${geometry.length}, ` +
        `got ${data.length}`,
    );
  }
  for (let i = 0; i < geometry.length; i++) {
    const geometryRow = geometry[i];
    const dataRow = data[i];
    if (geometryRow.length !== dataRow.length) {
      throw new TypeError(
        `Wrong number of keys in row ${i}, ` +
          `expected ${geometryRow.length}, ` +
          `actual ${dataRow.length}`,
      );
    }
    for (let j = 0; j < geometryRow.length; j++) {
      map.set(geometryRow[j], dataRow[j]);
    }
  }
  if (!map.has("IntlBackslash") && map.has("Backslash")) {
    map.set("IntlBackslash", map.get("Backslash")!);
  }
  return parseKeymap(
    Object.fromEntries(
      [...map].sort(
        (a, b) => characterKeys.indexOf(a[0]) - characterKeys.indexOf(b[0]),
      ),
    ),
  );
}

/**
 * Maps row and column indices to key identifiers of the ANSI geometry.
 */
export const ansiGeometry: readonly (readonly KeyId[])[] = [
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
  ],
  [
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
    "Backslash",
  ],
  [
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
  ],
  [
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
  ],
];

/**
 * Maps row and column indices to key identifiers of the ISO geometry.
 */
export const isoGeometry: readonly (readonly KeyId[])[] = [
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
  ],
  [
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
  ],
  [
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
    "Backslash",
  ],
  [
    "IntlBackslash",
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
  ],
];
