import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | zybook1', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:zybook1');
    assert.ok(route);
  });
});
