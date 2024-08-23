import { type Layout } from "@keybr/keyboard";
import { LocalDate } from "./localdate.ts";
import { type Result } from "./result.ts";

export type Group<T> = {
  readonly key: T;
  readonly results: readonly Result[];
};

export type KeyOf<T> = (result: Result) => T;

const layoutKey = (): KeyOf<Layout> => {
  return ({ layout }) => layout;
};

const layoutFamilyKey = (): KeyOf<string> => {
  return ({ layout }) => layout.family;
};

const dateKey = (): KeyOf<LocalDate> => {
  let date = new LocalDate(0);
  let next = new LocalDate(0);
  return (result) => {
    const { timeStamp } = result;
    if (!(date.timeStamp <= timeStamp && timeStamp < next.timeStamp)) {
      date = new LocalDate(timeStamp);
      next = date.plusDays(1);
    }
    return date;
  };
};

export class ResultGroups<T> implements Iterable<Group<T>> {
  static readonly byLayout = (results: Iterable<Result>) => {
    return new ResultGroups(layoutKey()).addAll(results);
  };

  static readonly byLayoutFamily = (results: Iterable<Result>) => {
    return new ResultGroups(layoutFamilyKey()).addAll(results);
  };

  static readonly byDate = (results: Iterable<Result>) => {
    return new ResultGroups(dateKey()).addAll(results);
  };

  readonly #keyOf: KeyOf<T>;
  readonly #map: Map<string, { readonly key: T; readonly results: Result[] }>;

  constructor(keyOf: KeyOf<T>) {
    this.#keyOf = keyOf;
    this.#map = new Map();
  }

  [Symbol.iterator](): IterableIterator<Group<T>> {
    return this.#map.values();
  }

  *keys(): IterableIterator<T> {
    for (const { key } of this.#map.values()) {
      yield key;
    }
  }

  get(key: T): readonly Result[] {
    return this.#getGroup(key).results;
  }

  add(result: Result) {
    this.#getGroup(this.#keyOf(result)).results.push(result);
    return this;
  }

  addAll(results: Iterable<Result>) {
    for (const result of results) {
      this.add(result);
    }
    return this;
  }

  #getGroup(key: T) {
    const stringKey = String(key);
    let group = this.#map.get(stringKey);
    if (group == null) {
      this.#map.set(stringKey, (group = { key, results: [] }));
    }
    return group;
  }
}
