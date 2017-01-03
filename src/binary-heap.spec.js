import {default as BinaryHeap, Factory} from "./binary-heap";
import {MaxHeap, MinHeap} from "./mode";

const test = require('tape');

test('factory invoked without args returns instance', (t) => {
    t.plan(2);

    t.doesNotThrow(() => {
        const h = Factory();

        t.equal(true, BinaryHeap.isPrototypeOf(h));
    });
});

test('factory invoked with valid modes returns instance', (t) => {
    t.plan(4);

    t.doesNotThrow(() => {
        const h = Factory(MaxHeap);

        t.equal(true, BinaryHeap.isPrototypeOf(h));
    });

    t.doesNotThrow(() => {
        const h = Factory(MinHeap);

        t.equal(true, BinaryHeap.isPrototypeOf(h));
    });
});

test('factory invoked with invalid mode throws error', (t) => {
    t.plan(1);

    t.throws(() => {
        Factory('foo')
    }, /Invalid mode/);
});

test('factory invoked with invalid comparator throws error', (t) => {
    t.plan(1);

    t.throws(() => {
        Factory(MinHeap, 'nope')
    }, /Invalid comparator/);
});

test('peek on empty heap returns false', (t) => {
    t.plan(1);

    const h = Factory();

    t.equal(false, h.peek());
});

test('peek after inserting an element into an empty heap returns the element', (t) => {
    t.plan(1);

    const h = Factory();

    h.insert(0);

    t.equal(0, h.peek());
});

[
    {
        name:                 'test insert random sequence (ints) into min heap returns elements in ascending order',
        mode:                 MinHeap,
        inputSequence:        [5, 1, 19, 2, -1, 10],
        expectedSequenceSort: seq => seq.sort((a, b) => a - b)
    },

    {
        name:                 'test insert random sequence (ints) into max heap returns elements in descending order',
        mode:                 MaxHeap,
        inputSequence:        [5, 1, 19, 2, -1, 10],
        expectedSequenceSort: seq => seq.sort((a, b) => b - a)
    },

    {
        name:                 'test insert random sequence (strings) into min heap returns elements in ascending order',
        mode:                 MinHeap,
        inputSequence:        ['Z', 'foo', 'A', 'bar', 'zzz', 'a', 'D', 'c', 'z', 'zzb'],
        expectedSequenceSort: seq => seq.sort()
    },

    {
        name:                 'test insert random sequence (strings) into max heap returns elements in ascending order',
        mode:                 MaxHeap,
        inputSequence:        ['Z', 'foo', 'A', 'bar', 'zzz', 'a', 'D', 'c', 'z', 'zzb'],
        expectedSequenceSort: seq => seq.sort().reverse()
    }
].forEach(testConfig => {
    test(testConfig.name, (t) => {
        t.plan(1);

        const h                = Factory(testConfig.mode);
        const expectedSequence = [...testConfig.inputSequence];
        testConfig.expectedSequenceSort(expectedSequence);

        testConfig.inputSequence.forEach(el => h.insert(el));

        const outputSequence = [];
        let el;

        while (el = h.remove()) {
            outputSequence.push(el);
        }

        t.deepEqual(outputSequence, expectedSequence);
    });
});
