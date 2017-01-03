import naivePrimitiveComparator from "./naive-primitive-comparator";
import {MaxHeap, MinHeap} from "./mode";

const _heapUp   = Symbol('heap up handler');
const _heapDown = Symbol('heap down handler');

const _comparator = Symbol('comparator');
const _mode       = Symbol('mode');
const _storage    = Symbol('heap storage');

/**
 * @class BinaryHeap
 * @static
 */
const BinaryHeap = {
    /**
     * Initialize an object whose prototype is a BinaryHeap
     *
     * @param {Symbol} mode
     * @param {Function} comparator
     * @returns {BinaryHeap}
     */
    init(mode, comparator) {
        // validate mode
        if (-1 === [MinHeap, MaxHeap].indexOf(mode)) {
            throw new Error('Invalid mode');
        }

        // validate comparator
        if ('function' !== typeof comparator) {
            throw new Error('Invalid comparator');
        }

        this[_mode]       = mode;
        this[_comparator] = comparator;
        this[_storage]    = [];

        return this;
    },

    /**
     * Insert an element into the heap
     *
     * @param element
     */
    insert(element) {
        // add the element to the end of the storage array
        this[_storage].push(element);

        // only element in the backing store, nothing to heapify
        if (1 === this[_storage].length) {
            return;
        }

        // heap-up from current element
        this[_heapUp](this[_storage].length - 1);
    },

    /**
     * Fetch the current root (min / max) element without
     * removing it from the heap
     *
     * @returns {Object|boolean}
     */
    peek() {
        return this[_storage].length
            ? this[_storage][0]
            : false;
    },

    /**
     * Remove the root element (min / max) from the heap
     *
     * @returns {*}
     */
    remove() {
        // only a single element in the backing store, return it
        if (1 === this[_storage].length) {
            return this[_storage].pop();
        }

        const root = this[_storage][0];

        // move the last element from the backing store to the root
        this[_storage][0] = this[_storage].pop();

        // heap-down from the root element
        this[_heapDown](0);

        return root;
    },

    /**
     * Ensure the correct heap relationship between the specified index
     * and its children
     *
     * @param {Number} index
     */
    [_heapDown](index) {
        const leftChildIndex = 2 * index + 1;

        // if the left child index falls outside the bounds of the
        // backing store, nothing left to do
        if (leftChildIndex >= this[_storage].length) {
            return;
        }

        const rightChildIndex = 2 * index + 2;

        // fetch the current value at the target index
        const value = this[_storage][index];

        let comparisonIndex;
        let comparisonValue;
        const leftChildValue = this[_storage][leftChildIndex];

        if (
            leftChildIndex < this[_storage].length
            && rightChildIndex < this[_storage].length
        ) {
            /*
             * both child indices fall within the bounds of the backing store,
             * determine which child should be compared based on the current
             * mode (min / max)
             */
            const rightChildValue       = this[_storage][rightChildIndex];
            const childComparisonResult = this[_comparator](leftChildValue, rightChildValue);

            if (MaxHeap === this[_mode]) {
                // max heap should compare current element against "larger" child
                [comparisonIndex, comparisonValue] = (childComparisonResult >= 0)
                    ? [leftChildIndex, leftChildValue]
                    : [rightChildIndex, rightChildValue];
            } else {
                // min heap should compare current element against "smaller" child
                [comparisonIndex, comparisonValue] = (childComparisonResult >= 0)
                    ? [rightChildIndex, rightChildValue]
                    : [leftChildIndex, leftChildValue];
            }
        } else {
            // only left child falls within bounds of backing store
            comparisonIndex = leftChildIndex;
            comparisonValue = leftChildValue;
        }

        // compare current element against appropriate child element from above
        let comparisonResult = this[_comparator](value, comparisonValue);
        // adjust the comparison result based on the mode (min / max)
        comparisonResult *= (MinHeap === this[_mode]) ? -1 : 1;

        if (comparisonResult >= 0) {
            // the relationship between the current element and its child
            // already satisfies the heap property
            return;
        }

        // swap the current element with the appropriate child
        [this[_storage][comparisonIndex], this[_storage][index]] = [value, comparisonValue];

        // continue heapifying down to the child element
        this[_heapDown](comparisonIndex);
    },

    /**
     * Ensure the correct heap relationship between the specified index
     * and its parent
     *
     * @param index
     */
    [_heapUp](index) {
        // calculate the parent element's index
        const parentIndex = Math.floor((index - 1) / 2);
        // fetch the element at the current index
        const value       = this[_storage][index];
        // fetch the parent element
        const parentValue = this[_storage][parentIndex];

        // compare the current element with its parent
        let comparisonResult = this[_comparator](value, parentValue);
        // adjust the comparison result based on the mode (min / max)
        comparisonResult *= (MaxHeap === this[_mode]) ? -1 : 1;

        if (comparisonResult >= 0) {
            // the relationship between the current element and its parent
            // already satisfies the heap property
            return;
        }

        // swap the current element and its parent
        [this[_storage][parentIndex], this[_storage][index]] = [value, parentValue];

        // if the root element has been reached, nothing remaining to do
        if (0 === parentIndex) {
            return;
        }

        // continue heapifying up to the parent element
        this[_heapUp](parentIndex);
    }
};

const Factory = function (mode = MinHeap, comparator = naivePrimitiveComparator) {
    return Object.create(BinaryHeap).init(mode, comparator);
};

export {Factory, MaxHeap, MinHeap};
export default BinaryHeap;
