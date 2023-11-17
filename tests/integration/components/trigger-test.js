import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import {
  render,
  triggerEvent,
  triggerKeyEvent,
  tap,
  click,
  focus,
} from '@ember/test-helpers';

module('Integration | Component | basic-dropdown-trigger', function (hooks) {
  setupRenderingTest(hooks);

  test('It renders the given block in a div with class `ember-basic-dropdown-trigger`, with no wrapper around', async function (assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <div id="direct-parent">
        <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
      </div>
    `);

    assert
      .dom('#direct-parent > .ember-basic-dropdown-trigger')
      .exists('The trigger is not wrapped');
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasText('Click me', 'The trigger contains the given block');
  });

  test('If a `@defaultClass` argument is provided to the trigger, its value is added to the list of classes', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <div id="direct-parent">
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @defaultClass="extra-class">Click me</BasicDropdownTrigger>
      </div>
    `);

    assert.dom('.ember-basic-dropdown-trigger').hasClass('extra-class');
  });

  // Attributes and a11y
  test("If it doesn't receive any tabindex, defaults to 0", async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('tabindex', '0', 'Has a tabindex of 0');
  });

  test('If it receives a tabindex={{false}}, it removes the tabindex', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger tabindex={{false}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .doesNotHaveAttribute('tabindex');
  });

  test('If it receives `tabindex="3"`, the tabindex of the element is 3', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} tabindex="3">Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('tabindex', '3', 'Has a tabindex of 3');
  });

  test('If it receives `title="something"`, if has that title attribute', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} title="foobar">Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('title', 'foobar', 'Has the given title');
  });

  test('If it receives `id="some-id"`, if has that id', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} id="my-own-id">Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('id', 'my-own-id', 'Has the given id');
  });

  test("If the dropdown is disabled, the trigger doesn't have tabindex attribute", async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123, disabled: true };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .doesNotHaveAttribute('tabindex', "The component doesn't have tabindex");
  });

  test('If it belongs to a disabled dropdown, it gets an `aria-disabled=true` attribute for a11y', async function (assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123, disabled: true };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('aria-disabled', 'true', 'It is marked as disabled');
    this.set('dropdown', { ...this.dropdown, disabled: false });
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('aria-disabled', 'false', 'It is NOT marked as disabled');
  });

  test('If the received dropdown is open, it has an `aria-expanded="true"` attribute, otherwise `"false"`', async function (assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123, isOpen: false };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('aria-expanded', 'false', 'the aria-expanded is false');
    this.set('dropdown', { ...this.dropdown, isOpen: true });
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('aria-expanded', 'true', 'the aria-expanded is true');
  });

  test('If it has an `aria-controls="foo123"` attribute pointing to the id of the content', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('aria-controls', 'ember-basic-dropdown-content-123');
  });

  test('If it receives `@htmlTag`, the trigger uses that tag name', async function (assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @htmlTag="button" type="button">Click me</BasicDropdownTrigger>
    `);
    assert.strictEqual(
      this.element.querySelector('.ember-basic-dropdown-trigger').tagName,
      'BUTTON',
    );
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('type', 'button');
  });

  test('If it receives `role="presentation"` it gets that attribute', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} role="presentation">Click me</BasicDropdownTrigger>
    `);
    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasAttribute('role', 'presentation');
  });

  test('If it does not receive an specific `role`, the default is `button`', async function (assert) {
    assert.expect(1);
    this.dropdown = { uniqueId: 123 };
    this.role = undefined;
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    assert.dom('.ember-basic-dropdown-trigger').hasAttribute('role', 'button');
  });

  // Custom actions
  test('the user can bind arbitrary events to the trigger', async function (assert) {
    assert.expect(2);
    this.dropdown = { uniqueId: 123 };
    this.onMouseEnter = (dropdown, e) => {
      assert.deepEqual(
        dropdown,
        this.dropdown,
        'receives the dropdown as 1st argument',
      );
      assert.ok(
        e instanceof window.Event,
        'It receives the event as second argument',
      );
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} {{on "mouseenter" (fn this.onMouseEnter this.dropdown)}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'mouseenter');
  });

  // Default behaviour
  test('click events invoke the `toggle` action on the dropdown by default', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('mousedown events DO NOT invoke the `toggle` action on the dropdown by default', async function (assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle() {
          assert.ok(false);
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'mousedown');
  });

  test('click events DO NOT invoke the `toggle` action on the dropdown if `@eventType="mousedown"`', async function (assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle() {
          assert.ok(false);
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('mousedown events invoke the `toggle` action on the dropdown if `eventType="mousedown"', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'mousedown');
  });

  test('when `stopPropagation` is true the `click` event does not bubble', async function (assert) {
    assert.expect(3);
    this.handlerInParent = () =>
      assert.ok(false, 'This should never be called');

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <div role="button" onclick={{this.handlerInParent}}>
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @stopPropagation={{true}} role="presentation">Click me</BasicDropdownTrigger>
      </div>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('when `stopPropagation` is true and eventType is true, the `click` event does not bubble', async function (assert) {
    assert.expect(3);
    this.handlerInParent = () =>
      assert.ok(false, 'This should never be called');

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <div role="button" onclick={{this.handlerInParent}}>
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @stopPropagation={{true}} role="presentation">Click me</BasicDropdownTrigger>
      </div>
    `);
    await triggerEvent('.ember-basic-dropdown-trigger', 'click');
  });

  test('Pressing ENTER fires the `toggle` action on the dropdown', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
  });

  test('Pressing SPACE fires the `toggle` action on the dropdown and preventsDefault to avoid scrolling', async function (assert) {
    assert.expect(4);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
          assert.ok(e.defaultPrevented, 'The event is defaultPrevented');
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
  });

  test('Pressing ESC fires the `close` action on the dropdown', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        close(e) {
          assert.ok(true, 'The `close()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  test('Pressing ENTER/SPACE/ESC does nothing if there is a `{{on "keydown"}}` event that calls stopImmediatePropagation', async function (assert) {
    assert.expect(0);
    this.onKeyDown = (e) => e.stopImmediatePropagation();
    this.dropdown = {
      uniqueId: 123,
      actions: {
        close() {
          assert.ok(false, 'This action is not called');
        },
        toggle() {
          assert.ok(false, 'This action is not called');
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} {{on "keydown" this.onKeyDown}}>Click me</BasicDropdownTrigger>
    `);

    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  test('Tapping invokes the toggle action on the dropdown', async function (assert) {
    assert.expect(4);
    this.dropdown = {
      actions: {
        uniqueId: 123,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.strictEqual(
            e.type,
            'touchend',
            'The event that toggles the dropdown is the touchend',
          );
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @isTouchDevice={{true}}>Click me</BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });

  test("Firing a mousemove between a touchstart and a touchend (touch scroll) doesn't fire the toggle action", async function (assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle() {
          assert.ok(false, 'This action in not called');
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @isTouchDevice={{true}}>Click me</BasicDropdownTrigger>
    `);

    await triggerEvent('.ember-basic-dropdown-trigger', 'touchstart');
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchmove', {
      changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 0 }],
    });
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchend', {
      changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 10 }],
    });
  });

  test('Using stylus on touch device will handle scroll/tap to fire toggle action properly', async function (assert) {
    assert.expect(1);
    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle() {
          assert.ok(true, 'The toggle action is called');
        },
        reposition() {},
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @isTouchDevice={{true}}>Click me</BasicDropdownTrigger>
    `);

    // scroll
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchstart');
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchmove', {
      changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
    });
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchend', {
      changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 10 }],
    });

    // tap
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchstart');
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchmove', {
      changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
    });
    await triggerEvent('.ember-basic-dropdown-trigger', 'touchend', {
      changedTouches: [{ touchType: 'stylus', pageX: 4, pageY: 0 }],
    });
  });

  test("If its dropdown is disabled it won't respond to mouse, touch or keyboard event", async function (assert) {
    assert.expect(0);
    this.dropdown = {
      uniqueId: 123,
      disabled: true,
      actions: {
        toggle() {
          assert.ok(false, 'This action in not called');
        },
        open() {
          assert.ok(false, 'This action in not called');
        },
        close() {
          assert.ok(false, 'This action in not called');
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @isTouchDevice={{true}}>Click me</BasicDropdownTrigger>
    `);
    await click('.ember-basic-dropdown-trigger');
    await tap('.ember-basic-dropdown-trigger');
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 32);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 27);
  });

  // Decorating and overriding default event handlers
  test('A user-supplied {{on "mousedown"}} callback will execute before the default toggle behavior', async function (assert) {
    assert.expect(3);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(
            userActionRanfirst,
            'User-supplied `{{on "mousedown"}}` ran before default `toggle`',
          );
        },
      },
    };

    this.onMouseDown = (e) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRanfirst = true;
    };

    await render(hbs`
      {{!-- template-lint-disable no-pointer-down-event-binding --}}
      <BasicDropdownTrigger {{on "mousedown" this.onMouseDown}} @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);

    await click('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "click"}} callback that calls `stopImmediatePropagation`, will prevent the default behavior', async function (assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        },
      },
    };

    this.onClick = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "click" this.onClick}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);

    await click('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "mousedown"}} callback that calls `stopImmediatePropagation` will prevent the default behavior', async function (assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        },
      },
    };

    this.onMouseDown = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The user-supplied action has been fired');
    };

    await render(hbs`
      {{!-- template-lint-disable no-pointer-down-event-binding --}}
      <BasicDropdownTrigger {{on "mousedown" this.onMouseDown}} @dropdown={{this.dropdown}} @eventType="mousedown">Click me</BasicDropdownTrigger>
    `);

    await click('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "touchend"}} callback will execute before the default toggle behavior', async function (assert) {
    assert.expect(3);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(
            userActionRanfirst,
            'User-supplied `{{on "touchend"}}` ran before default `toggle`',
          );
        },
      },
    };

    this.onTouchEnd = (e) => {
      assert.ok(true, 'The user-supplied touchend callback has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRanfirst = true;
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "touchend" this.onTouchEnd}} @dropdown={{this.dropdown}}>
        Click me
      </BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied {{on "touchend"}} callback calling e.stopImmediatePropagation will prevent the default behavior', async function (assert) {
    assert.expect(2);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: (e) => {
          assert.notEqual(
            e.type,
            'touchend',
            'Default `toggle` action should not run',
          );
        },
      },
    };

    this.onTouchEnd = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The user-supplied touchend callback has been fired');
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "touchend" this.onTouchEnd}} @dropdown={{this.dropdown}}>
        Click me
      </BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });

  test('A user-supplied `{{on "keydown"}}` action will execute before the default toggle behavior', async function (assert) {
    assert.expect(3);
    let userActionRanfirst = false;

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(
            userActionRanfirst,
            'User-supplied `{{on "keydown}}` ran before default `toggle`',
          );
        },
      },
    };

    this.onKeyDown = (e) => {
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
      assert.ok(e instanceof window.Event, 'It receives the event');
      userActionRanfirst = true;
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "keydown" this.onKeyDown}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13); // Enter
  });

  test('A user-supplied `{{on "keydown"}}` action calling `stopImmediatePropagation` will prevent the default behavior', async function (assert) {
    assert.expect(1);

    this.dropdown = {
      uniqueId: 123,
      actions: {
        toggle: () => {
          assert.ok(false, 'Default `toggle` action should not run');
        },
      },
    };

    this.onKeyDown = (e) => {
      e.stopImmediatePropagation();
      assert.ok(true, 'The `userSuppliedAction()` action has been fired');
    };

    await render(hbs`
      <BasicDropdownTrigger {{on "keydown" this.onKeyDown}} @dropdown={{this.dropdown}}>Click me</BasicDropdownTrigger>
    `);
    await triggerKeyEvent('.ember-basic-dropdown-trigger', 'keydown', 13); // Enter
  });

  test('Tapping an SVG inside of the trigger invokes the toggle action on the dropdown', async function (assert) {
    assert.expect(3);
    this.dropdown = {
      actions: {
        uniqueId: 123,
        toggle(e) {
          assert.ok(true, 'The `toggle()` action has been fired');
          assert.ok(
            e instanceof window.Event,
            'It receives the event as first argument',
          );
          assert.strictEqual(
            arguments.length,
            1,
            'It receives only one argument',
          );
        },
      },
    };
    await render(hbs`
      <BasicDropdownTrigger @dropdown={{this.dropdown}} @isTouchDevice={{true}}><svg class="trigger-child-svg">Click me</svg></BasicDropdownTrigger>
    `);
    await tap('.ember-basic-dropdown-trigger');
  });

  /**
   * Tests related to https://github.com/cibernox/ember-basic-dropdown/issues/498
   * Can be removed when the template `V1` compatability event handlers are removed.
   */
  module('trigger event handlers', function (hooks) {
    hooks.beforeEach(function () {
      this.set('dropdown', { uniqueId: 'e123', actions: { toggle: () => {} } });
    });

    function assertCommonEventHandlerArgs(assert, args) {
      const [dropdown, e] = args;

      assert.ok(
        dropdown.uniqueId === this.dropdown.uniqueId,
        'It receives the dropdown argument as the first argument',
      );
      assert.ok(
        e instanceof window.Event,
        'It receives the event as second argument',
      );
      assert.ok(args.length === 2, 'It receives only 2 arguments');
    }

    test('It properly handles the onBlur action', async function (assert) {
      assert.expect(4);

      const onBlur = function () {
        assert.ok(true, 'The `onBlur()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onBlur', onBlur.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onBlur={{this.onBlur}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'blur'); // For some reason, `blur` test-helper fails here
    });

    test('It properly handles the onClick action', async function (assert) {
      assert.expect(4);

      const onClick = function () {
        assert.ok(true, 'The `onClick()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onClick', onClick.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onClick={{this.onClick}}>hello</BasicDropdownTrigger>
      `);
      await click('.ember-basic-dropdown-trigger');
    });

    test('It properly handles the onFocus action', async function (assert) {
      assert.expect(4);

      const onFocus = function () {
        assert.ok(true, 'The `onFocus()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onFocus', onFocus.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onFocus={{this.onFocus}}>hello</BasicDropdownTrigger>
      `);
      await focus('.ember-basic-dropdown-trigger');
    });

    test('It properly handles the onFocusIn action', async function (assert) {
      assert.expect(4);

      const onFocusIn = function () {
        assert.ok(true, 'The `onFocusIn()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onFocusIn', onFocusIn.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onFocusIn={{this.onFocusIn}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'focusin');
    });

    test('It properly handles the onFocusOut action', async function (assert) {
      assert.expect(4);

      const onFocusOut = function () {
        assert.ok(true, 'The `onFocusOut()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onFocusOut', onFocusOut.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onFocusOut={{this.onFocusOut}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'focusout');
    });

    test('It properly handles the onKeyDown action', async function (assert) {
      assert.expect(4);

      const onKeyDown = function () {
        assert.ok(true, 'The `onKeyDown()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onKeyDown', onKeyDown.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onKeyDown={{this.onKeyDown}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'keydown');
    });

    test('It properly handles the onMouseDown action', async function (assert) {
      assert.expect(4);

      const onMouseDown = function () {
        assert.ok(true, 'The `onMouseDown()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onMouseDown', onMouseDown.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onMouseDown={{this.onMouseDown}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'mousedown');
    });

    test('It properly handles the onMouseEnter action', async function (assert) {
      assert.expect(4);

      const onMouseEnter = function () {
        assert.ok(true, 'The `onMouseEnter()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onMouseEnter', onMouseEnter.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onMouseEnter={{this.onMouseEnter}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'mouseenter');
    });

    test('It properly handles the onMouseLeave action', async function (assert) {
      assert.expect(4);

      const onMouseLeave = function () {
        assert.ok(true, 'The `onMouseLeave()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onMouseLeave', onMouseLeave.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onMouseLeave={{this.onMouseLeave}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'mouseleave');
    });

    test('It properly handles the onTouchEnd action', async function (assert) {
      assert.expect(4);

      const onTouchEnd = function () {
        assert.ok(true, 'The `onTouchEnd()` action has been fired');
        assertCommonEventHandlerArgs.call(this, assert, arguments);
      };

      this.set('onTouchEnd', onTouchEnd.bind(this));

      await render(hbs`
        <BasicDropdownTrigger @dropdown={{this.dropdown}} @onTouchEnd={{this.onTouchEnd}}>hello</BasicDropdownTrigger>
      `);
      await triggerEvent('.ember-basic-dropdown-trigger', 'touchend');
    });
  });
});
