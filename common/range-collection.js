// Task: Implement a 'Range Collection' class.
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

import log from './log';

/**
 * RangeCollection class
 * NOTE: Feel free to add any extra member variables/functions you like.
 */
export default class RangeCollection {
  ranges = [];

  /**
   * get the start integer of the whole range collection
   */
  get rangeStart() {
    const that = this;

    if (!that.length) {
      return null;
    }

    return that.ranges[0][0];
  }

  /**
   * get the end integer of the whole range collection
   */
  get rangeEnd() {
    const that = this;

    if (!that.length) {
      return null;
    }

    return that.ranges[that.ranges.length][1];
  }

  /**
   * get the length of the range collection
   */
  get length() {
    const that = this;

    return that.ranges.length;
  }

  /**
   * get the index of the last range which the number is behind it \
   * for examples: \
   * a ranges collection with [1,3) [5,7) [9,12) \
   * afterRange(0) return -1 \
   * afterRange(2) return 0 \
   * afterRange(3) return 0 \
   * afterRange(6) return 1 \
   * afterRange(17) return 2 \
   * @param {Number} number
   * @returns -1 if totally before all the range, else return the value of index
   */
  afterRange(number, argRanges = null) {
    const that = this;

    const ranges = argRanges || that.ranges;

    let index = ranges.length - 1;
    ranges.every(([start, end], i) => {
      if (start > number) {
        index = i - 1;
        return false;
      }
      return true;
    });

    return index;
  }

  /**
   * Validate the range parameter
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  validateRangeParam(range) {
    /* eslint class-methods-use-this : [0] */
    if (!range || !range.length) {
      throw new Error('range can not be null or empty.');
    }
    const [start, end] = range;
    if (start > end) {
      throw new Error('range start should little than end.');
    }
  }

  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    const that = this;

    that.validateRangeParam(range);
    const [start, end] = range;
    if (start === end) {
      return;
    }

    if (!that.length) {
      // no ranges, just add it
      that.ranges.push(range);

      return;
    }

    const startAfterIndex = that.afterRange(start);
    let newRanges = null;
    let index = 0;
    // first place the range in the ranges
    if (startAfterIndex < 0) {
      newRanges = that.ranges.unshift(range);
    } else {
      index = startAfterIndex + 1;
      newRanges = that.ranges
        .slice(0, startAfterIndex + 1)
        .concat([range])
        .concat(that.ranges.slice(startAfterIndex + 1));
    }

    // look the start and check range before it
    let newEnd = end;
    if (index > 0) {
      const [preStart, preEnd] = newRanges[index - 1];
      if (start <= preEnd) {
        // able to merge these two range
        if (preEnd > end) {
          newEnd = preEnd;
        }
        const tmpRanges = newRanges
          .slice(0, index - 1)
          .concat([[preStart, newEnd]]);

        newRanges = tmpRanges.concat(newRanges.slice(index + 1));
        index -= 1;
      }
    }

    // look the end and the range after it
    const endAfterIndex = that.afterRange(newEnd, newRanges);
    if (endAfterIndex > index) {
      // able to merge these two range
      const [preStart, preEnd] = newRanges[endAfterIndex];
      const placedItem = newRanges[index];
      let tmpRanges = null;
      if (index > 0) {
        tmpRanges = newRanges.slice(0, index - 1);
      }
      tmpRanges = tmpRanges
        .concat([[placedItem[0], newEnd > preEnd ? newEnd : preEnd]])
        .concat(newRanges.slice(endAfterIndex + 1));

      newRanges = tmpRanges;
    }

    that.ranges = newRanges;
  }

  /**
   * Removes a range from the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    const that = this;

    that.validateRangeParam(range);
    const [start, end] = range;
    if (start === end) {
      return;
    }

    if (!that.length) {
      // no ranges, do nothing

      return;
    }

    // split by the start, get the start part of the new ranges
    let startPart = [];
    const startAfterIndex = that.afterRange(start);

    if (startAfterIndex >= 0) {
      startPart = that.ranges.slice(0, startAfterIndex);
      const [preStart, preEnd] = that.ranges[startAfterIndex];
      if (preEnd > start) {
        // need split
        if (start > preStart) {
          startPart = startPart.concat([[preStart, start]]);
        }
      } else {
        startPart = startPart.concat([[preStart, preEnd]]);
      }
    }

    // split by the end, get the end part of the new range
    let endPart = null;
    const endAfterIndex = that.afterRange(end);

    if (endAfterIndex >= 0) {
      endPart = that.ranges.slice(endAfterIndex + 1);
      const [preStart, preEnd] = that.ranges[endAfterIndex];
      if (preEnd > end) {
        // need split
        endPart.unshift([end, preEnd]);
      }
    } else {
      endPart = that.ranges;
    }

    // make new ranges by start part + end part
    that.ranges = startPart.concat(endPart);
  }

  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    const that = this;

    log.info(that.toString());
  }

  /**
   * Format ranges to a string
   */
  toString() {
    const that = this;

    const str = that.ranges
      .map(([start, end]) => `[${start}, ${end})`)
      .join(' ');

    return str;
  }
}
