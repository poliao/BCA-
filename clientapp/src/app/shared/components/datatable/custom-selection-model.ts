import { getMultipleValuesInSingleSelectionError, SelectionModel } from "@angular/cdk/collections";
import { Subject } from 'rxjs';

export class Selection<T> {
  private _data!: Set<T> | T[];
  private readonly compareFunc?: (d: T, s: T) => boolean;

  constructor(_compareFunc?: (d: T, s: T) => boolean) {
    this.compareFunc = _compareFunc;
    this._data = _compareFunc ? [] : new Set<T>();
  }

  setByType(actionSet: () => void, actionArray: () => void): void {
    if (this._data instanceof Set)
      actionSet();
    else actionArray();
  }

  getByType<R>(funcSet: () => R, funcArray: () => R): R {
    if (this._data instanceof Set)
      return funcSet();
    else return funcArray();
  }

  values(): any {
    return this.getByType<any>(() => this._data.values(), () => this._data);
  }

  add(value: T): void {
    this.setByType(
      () => (this._data as Set<T>).add(value),
      () => (this._data as Array<T>).push(value));
  }

  delete(value: T): void {
    this.setByType(
      () => (this._data as Set<T>).delete(value),
      () => {
        this._data = (this._data as Array<T>).filter(d => !this.compareFunc(d, value))
      });
  }

  has(value: T): boolean {
    return this.getByType(
      () => (this._data as Set<T>).has(value),
      () => {
        return !!((this._data as Array<T>).find(d => this.compareFunc(d, value)));
      });
  }

  forEach = (callbackFn: (value: T) => void) => {
    this._data.forEach(callbackFn);
  }

  get size(): number {
    return this.getByType(
      () => (this._data as Set<T>).size,
      () => (this._data as Array<T>).length);
  }
}


export class CustomSelectionModal<T> {
  private readonly compareFunc?: (d: T, s: T) => boolean;

  /** Currently-selected values. */
  private readonly _selection!: Selection<T>;

  /** Keeps track of the deselected options that haven't been emitted by the change event. */
  private _deselectedToEmit: T[] = [];

  /** Keeps track of the selected options that haven't been emitted by the change event. */
  private _selectedToEmit: T[] = [];

  /** Cache for the array value of the selected items. */
  private _selected: T[] | null;

  /** Selected values. */
  get selected(): T[] {
    if (!this._selected)
      this._selected = Array.from(this._selection.values());
    return this._selected;
  }

  /** Event emitted when the value has changed. */
  readonly changed = new Subject<SelectionChange<T>>();

  constructor(
    private readonly _multiple = false,
    initiallySelectedValues?: T[],
    private readonly _emitChanges = true,
    _compareFunc?: (d: T, s: T) => boolean
  ) {
    this.compareFunc = _compareFunc;
    this._selection = new Selection<T>(_compareFunc);

    if (initiallySelectedValues?.length) {
      if (_multiple)
        initiallySelectedValues.forEach(value => this._markSelected(value));
      else this._markSelected(initiallySelectedValues[0]);

      // Clear the array in order to avoid firing the change event for preselected values.
      this._selectedToEmit.length = 0;
    }
  }

  /**
   * Selects a value or an array of values.
   */
  select(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach(value => this._markSelected(value));
    this._emitChangeEvent();
  }

  /**
   * Deselects a value or an array of values.
   */
  deselect(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach(value => this._unmarkSelected(value));
    this._emitChangeEvent();
  }


  isAllSelected(data: T[]): boolean {
    if (this.compareFunc)
      return !data.some(d => !this.isSelected(d));
    else {
      const numSelected = this.selected.length;
      const numRows = data.length;
      return numSelected === numRows;
    }
  }

  masterToggle(data: T[]): void {
    if (this.isAllSelected(data)) {
      if (this.compareFunc)
        data.forEach(d => this.deselect(d));
      else this.clear();
      return;
    }

    this.select(...data);
  }

  /**
   * Toggles a value between selected and deselected.
   */
  toggle(value: T): void {
    this.isSelected(value) ? this.deselect(value) : this.select(value);
  }

  /**
   * Clears all of the selected values.
   */
  clear(): void {
    this._unmarkAll();
    this._emitChangeEvent();
  }

  /**
   * Determines whether a value is selected.
   */
  isSelected(value: T): boolean {
    return this._selection.has(value);
  }

  /**
   * Determines whether the model does not have a value.
   */
  isEmpty(): boolean {
    return this._selection.size === 0;
  }

  /**
   * Determines whether the model has a value.
   */
  hasValue(): boolean {
    return !this.isEmpty();
  }

  /**
   * Sorts the selected values based on a predicate function.
   */
  sort(predicate?: (a: T, b: T) => number): void {
    if (this._multiple && this.selected)
      this._selected.sort(predicate);
  }

  /**
   * Gets whether multiple values can be selected.
   */
  isMultipleSelection(): boolean {
    return this._multiple;
  }

  /** Emits a change event and clears the records of selected and deselected values. */
  private _emitChangeEvent(): void {
    // Clear the selected values so they can be re-cached.
    this._selected = null;

    if (this._selectedToEmit.length || this._deselectedToEmit.length) {
      this.changed.next({
        source: this,
        added: this._selectedToEmit,
        removed: this._deselectedToEmit,
      });

      this._deselectedToEmit = [];
      this._selectedToEmit = [];
    }
  }

  /** Selects a value. */
  private _markSelected(value: T): void {
    if (!this.isSelected(value)) {
      if (!this._multiple)
        this._unmarkAll();

      this._selection.add(value);

      if (this._emitChanges)
        this._selectedToEmit.push(value);
    }
  }

  /** Deselects a value. */
  private _unmarkSelected(value: T): void {
    if (this.isSelected(value)) {
      this._selection.delete(value);

      if (this._emitChanges)
        this._deselectedToEmit.push(value);
    }
  }

  /** Clears out the selected values. */
  private _unmarkAll(): void {
    if (!this.isEmpty())
      this._selection.forEach(value => this._unmarkSelected(value));
  }

  /**
   * Verifies the value assignment and throws an error if the specified value array is
   * including multiple values while the selection model is not supporting multiple values.
   */
  private _verifyValueAssignment(values: T[]): void {
    if (values.length > 1 && !this._multiple)
      throw getMultipleValuesInSingleSelectionError();
  }
}

export interface SelectionChange<T> {
  /** Model that dispatched the event. */
  source: SelectionModel<T> | CustomSelectionModal<T>;
  /** Options that were added to the model. */
  added: T[];
  /** Options that were removed from the model. */
  removed: T[];
}
