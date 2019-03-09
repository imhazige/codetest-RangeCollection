import assert from 'assert';
import { describe, it } from 'mocha';
import RangeCollection from '../../common/range-collection';
import log from '../../common/log';


describe('RangeCollection', () => {
  describe('test all ()', () => {
    it('test all', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
      const rc = new RangeCollection();

      rc.add([1, 5]);
      log.info('add([1, 5]) Should display: [1, 5)');
      rc.print();
      assert.equal('[1, 5)', rc.toString());

      rc.add([10, 20]);
      log.info('add([10, 20]) Should display: [1, 5) [10, 20)');
      rc.print();
      assert.equal('[1, 5) [10, 20)', rc.toString());

      rc.add([20, 20]);
      log.info('add([20, 20]) Should display: [1, 5) [10, 20)');
      rc.print();
      assert.equal('[1, 5) [10, 20)', rc.toString());

      rc.add([20, 21]);
      log.info('add([20, 21]) Should display: [1, 5) [10, 21)');
      rc.print();
      assert.equal('[1, 5) [10, 21)', rc.toString());

      rc.add([2, 4]);
      log.info('add([2, 4]) Should display: [1, 5) [10, 21)');
      rc.print();
      assert.equal('[1, 5) [10, 21)', rc.toString());

      rc.add([3, 8]);
      log.info('add([3, 8]) Should display: [1, 8) [10, 21)');
      rc.print();
      assert.equal('[1, 8) [10, 21)', rc.toString());

      rc.remove([10, 10]);
      log.info('remove([10, 10]) Should display: [1, 8) [10, 21)');
      rc.print();
      assert.equal('[1, 8) [10, 21)', rc.toString());

      rc.remove([10, 11]);
      log.info('remove([10, 11]) Should display: [1, 8) [11, 21)');
      rc.print();
      assert.equal('[1, 8) [11, 21)', rc.toString());

      rc.remove([15, 17]);
      log.info('remove([15, 17]) Should display: [1, 8) [11, 15) [17, 21)');
      rc.print();
      assert.equal('[1, 8) [11, 15) [17, 21)', rc.toString());

      rc.remove([3, 19]);
      log.info('remove([3, 19]) Should display: [1, 3) [19, 21)');
      rc.print();
      assert.equal('[1, 3) [19, 21)', rc.toString());
    });
  });
});
