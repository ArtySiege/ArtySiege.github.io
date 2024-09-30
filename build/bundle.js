
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.52.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /* @license
    Papa Parse
    v5.3.2
    https://github.com/mholt/PapaParse
    License: MIT
    */

    var papaparse_min = createCommonjsModule(function (module, exports) {
    !function(e,t){module.exports=t();}(commonjsGlobal,function s(){var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var i=(t=t||{}).dynamicTyping||!1;M(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!M(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var r=function(){if(!b.WORKERS_SUPPORTED)return !1;var e=(i=f.URL||f.webkitURL||null,r=s.toString(),b.BLOB_URL||(b.BLOB_URL=i.createObjectURL(new Blob(["(",r,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var i,r;return t.onmessage=_,t.id=h++,a[t.id]=t}();return r.userStep=t.step,r.userChunk=t.chunk,r.userComplete=t.complete,r.userError=t.error,t.step=M(t.step),t.chunk=M(t.chunk),t.complete=M(t.complete),t.error=M(t.error),delete t.worker,void r.postMessage({input:e,config:t,workerId:r.id})}var n=null;b.NODE_STREAM_INPUT,"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&M(e.read)&&M(e.on)?n=new g(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var n=!1,_=!0,m=",",y="\r\n",s='"',a=s+s,i=!1,r=null,o=!1;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter);("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(n=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines);"string"==typeof t.newline&&(y=t.newline);"string"==typeof t.quoteChar&&(s=t.quoteChar);"boolean"==typeof t.header&&(_=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns;}void 0!==t.escapeChar&&(a=t.escapeChar+s);("boolean"==typeof t.escapeFormulae||t.escapeFormulae instanceof RegExp)&&(o=t.escapeFormulae instanceof RegExp?t.escapeFormulae:/^[=+\-@\t\r].*$/);}();var h=new RegExp(j(s),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,i);if("object"==typeof e[0])return u(r||Object.keys(e[0]),e,i)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||r),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function u(e,t,i){var r="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(r+=m),r+=v(e[a],a);0<t.length&&(r+=y);}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c]);}u=""===d.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(r+=m);var g=n&&s?e[p]:p;r+=v(t[o][g],p);}o<t.length-1&&(!i||0<h&&!f)&&(r+=y);}}return r}function v(e,t){if(null==e)return "";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var i=!1;o&&"string"==typeof e&&o.test(e)&&(e="'"+e,i=!0);var r=e.toString().replace(h,a);return (i=i||!0===n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||function(e,t){for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return !0;return !1}(r,b.BAD_DELIMITERS)||-1<r.indexOf(m)||" "===r.charAt(0)||" "===r.charAt(r.length-1))?s+r+s:r}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=E,b.ParserHandle=i,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)});}),e(),this;function e(){if(0!==h.length){var e,t,i,r,n=h[0];if(M(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(M(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){M(a)&&a(e,n.file,n.inputElem),u();},b.parse(n.file,n.instanceConfig);}else M(o.complete)&&o.complete();}function u(){h.splice(0,1),e();}};}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&M(this._config.beforeFirstChunk)){var i=this._config.beforeFirstChunk(e);void 0!==i&&(e=i);}this.isFirstChunk=!1,this._halted=!1;var r=this._partialLine+e;this._partialLine="";var n=this._handle.parse(r,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=r.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(M(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!M(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0;},this._sendError=function(e){M(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1});};}function l(e){var r;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else {if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),n||(r.onload=v(this._chunkLoaded,this),r.onerror=v(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)r.setRequestHeader(t,e[t]);}if(this._config.chunkSize){var i=this._start+this._config.chunkSize-1;r.setRequestHeader("Range","bytes="+this._start+"-"+i);}try{r.send(this._config.downloadRequestBody);}catch(e){this._chunkError(e.message);}n&&0===r.status&&this._chunkError();}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:r.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return -1;return parseInt(t.substring(t.lastIndexOf("/")+1))}(r),this.parseChunk(r.responseText)));},this._chunkError=function(e){var t=r.statusText||e;this._sendError(new Error(t));};}function c(e){var r,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((r=new FileReader).onload=v(this._chunkLoaded,this),r.onerror=v(this._chunkError,this)):r=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t);}var i=r.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:i}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(r.error);};}function p(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,t=this._config.chunkSize;return t?(e=i.substring(0,t),i=i.substring(t)):(e=i,i=""),this._finished=!i,this.parseChunk(e)}};}function g(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0;},this._streamData=v(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=v(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=v(function(){this._streamCleanUp(),r=!0,this._streamData("");},this),this._streamCleanUp=v(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function i(m){var a,o,h,r=Math.pow(2,53),n=-r,s=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,u=/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/,t=this,i=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(M(m.step)){var p=m.step;m.step=function(e){if(c=e,_())g();else {if(g(),0===c.data.length)return;i+=e.data.length,m.preview&&i>m.preview?o.abort():(c.data=c.data[0],p(c,t));}};}function y(e){return "greedy"===m.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){return c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),m.skipEmptyLines&&(c.data=c.data.filter(function(e){return !y(e)})),_()&&function(){if(!c)return;function e(e,t){M(m.transformHeader)&&(e=m.transformHeader(e,t)),l.push(e);}if(Array.isArray(c.data[0])){for(var t=0;_()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1);}else c.data.forEach(e);}(),function(){if(!c||!m.header&&!m.dynamicTyping&&!m.transform)return c;function e(e,t){var i,r=m.header?{}:[];for(i=0;i<e.length;i++){var n=i,s=e[i];m.header&&(n=i>=l.length?"__parsed_extra":l[i]),m.transform&&(s=m.transform(s,n)),s=v(n,s),"__parsed_extra"===n?(r[n]=r[n]||[],r[n].push(s)):r[n]=s;}return m.header&&(i>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+i,f+t):i<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+i,f+t)),r}var t=1;!c.data.length||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);m.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function _(){return m.header&&0===l.length}function v(e,t){return i=e,m.dynamicTypingFunction&&void 0===m.dynamicTyping[i]&&(m.dynamicTyping[i]=m.dynamicTypingFunction(i)),!0===(m.dynamicTyping[i]||m.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<r)return !0}return !1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var i;}function k(e,t,i,r){var n={type:e,code:t,message:i};void 0!==r&&(n.row=r),c.errors.push(n);}this.parse=function(e,t,i){var r=m.quoteChar||'"';if(m.newline||(m.newline=function(e,t){e=e.substring(0,1048576);var i=new RegExp(j(t)+"([^]*?)"+j(t),"gm"),r=(e=e.replace(i,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<r[0].length;if(1===r.length||s)return "\n";for(var a=0,o=0;o<r.length;o++)"\n"===r[o][0]&&a++;return a>=r.length/2?"\r\n":"\r"}(e,r)),h=!1,m.delimiter)M(m.delimiter)&&(m.delimiter=m.delimiter(e),c.meta.delimiter=m.delimiter);else {var n=function(e,t,i,r,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new E({comments:r,delimiter:f,newline:t,preview:10}).parse(e),g=0;g<p.data.length;g++)if(i&&y(p.data[g]))c++;else {var _=p.data[g].length;l+=_,void 0!==o?0<_&&(d+=Math.abs(_-o),o=_):o=_;}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l);}return {successful:!!(m.delimiter=s),bestDelimiter:s}}(e,m.newline,m.skipEmptyLines,m.comments,m.delimitersToGuess);n.successful?m.delimiter=n.bestDelimiter:(h=!0,m.delimiter=b.DefaultDelimiter),c.meta.delimiter=m.delimiter;}var s=w(m);return m.preview&&m.header&&s.preview++,a=e,o=new E(s),c=o.parse(a,t,i),g(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=M(m.chunk)?"":a.substring(o.getCharIndex());},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(t.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,M(m.complete)&&m.complete(c),a="";};}function j(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e){var S,O=(e=e||{}).delimiter,x=e.newline,I=e.comments,T=e.step,D=e.preview,A=e.fastMode,L=S=void 0===e.quoteChar||null===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(L=e.escapeChar),("string"!=typeof O||-1<b.BAD_DELIMITERS.indexOf(O))&&(O=","),I===O)throw new Error("Comment character same as delimiter");!0===I?I="#":("string"!=typeof I||-1<b.BAD_DELIMITERS.indexOf(I))&&(I=!1),"\n"!==x&&"\r"!==x&&"\r\n"!==x&&(x="\n");var F=0,z=!1;this.parse=function(r,t,i){if("string"!=typeof r)throw new Error("Input must be a string");var n=r.length,e=O.length,s=x.length,a=I.length,o=M(T),h=[],u=[],f=[],d=F=0;if(!r)return C();if(A||!1!==A&&-1===r.indexOf(S)){for(var l=r.split(x),c=0;c<l.length;c++){if(f=l[c],F+=f.length,c!==l.length-1)F+=x.length;else if(i)return C();if(!I||f.substring(0,a)!==I){if(o){if(h=[],k(f.split(O)),R(),z)return C()}else k(f.split(O));if(D&&D<=c)return h=h.slice(0,D),C(!0)}}return C()}for(var p=r.indexOf(O,F),g=r.indexOf(x,F),_=new RegExp(j(L)+j(S),"g"),m=r.indexOf(S,F);;)if(r[F]!==S)if(I&&0===f.length&&r.substring(F,F+a)===I){if(-1===g)return C();F=g+s,g=r.indexOf(x,F),p=r.indexOf(O,F);}else if(-1!==p&&(p<g||-1===g))f.push(r.substring(F,p)),F=p+e,p=r.indexOf(O,F);else {if(-1===g)break;if(f.push(r.substring(F,g)),w(g+s),o&&(R(),z))return C();if(D&&h.length>=D)return C(!0)}else for(m=F,F++;;){if(-1===(m=r.indexOf(S,m+1)))return i||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:F}),E();if(m===n-1)return E(r.substring(F,m).replace(_,S));if(S!==L||r[m+1]!==L){if(S===L||0===m||r[m-1]!==L){-1!==p&&p<m+1&&(p=r.indexOf(O,m+1)),-1!==g&&g<m+1&&(g=r.indexOf(x,m+1));var y=b(-1===g?p:Math.min(p,g));if(r.substr(m+1+y,e)===O){f.push(r.substring(F,m).replace(_,S)),r[F=m+1+y+e]!==S&&(m=r.indexOf(S,F)),p=r.indexOf(O,F),g=r.indexOf(x,F);break}var v=b(g);if(r.substring(m+1+v,m+1+v+s)===x){if(f.push(r.substring(F,m).replace(_,S)),w(m+1+v+s),p=r.indexOf(O,F),m=r.indexOf(S,F),o&&(R(),z))return C();if(D&&h.length>=D)return C(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:F}),m++;}}else m++;}return E();function k(e){h.push(e),d=F;}function b(e){var t=0;if(-1!==e){var i=r.substring(m+1,e);i&&""===i.trim()&&(t=i.length);}return t}function E(e){return i||(void 0===e&&(e=r.substring(F)),f.push(e),F=n,k(f),o&&R()),C()}function w(e){F=e,k(f),f=[],g=r.indexOf(x,F);}function C(e){return {data:h,errors:u,meta:{delimiter:O,linebreak:x,aborted:z,truncated:!!e,cursor:d+(t||0)}}}function R(){T(C()),h=[],u=[];}},this.abort=function(){z=!0;},this.getCharIndex=function(){return F};}function _(e){var t=e.data,i=a[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,m(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:y,resume:y};if(M(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results;}else M(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!r&&m(t.workerId,t.results);}function m(e,t){var i=a[e];M(i.userComplete)&&i.userComplete(t),i.terminate(),delete a[e];}function y(){throw new Error("Not implemented.")}function w(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var i in e)t[i]=w(e[i]);return t}function v(e,t){return function(){e.apply(t,arguments);}}function M(e){return "function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var i=b.parse(t.input,t.config);i&&f.postMessage({workerId:b.WORKER_ID,results:i,finished:!0});}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(g.prototype=Object.create(u.prototype)).constructor=g,b});
    });

    // Todo fix this and the typings?
    const SUPPORTED_LANGUAGES = [
        'en_US',
        'es_EU',
        'es_US',
        'fr_EU',
        'fr_US',
        'de_EU',
        'nl_EU',
        'it_EU',
        'ru_EU',
        'zh_CN',
        'zh_TW',
        'ja_JP',
        'ko_KR',
    ];
    const lang = writable('en_US');
    const initial_language = navigator.language;
    if (SUPPORTED_LANGUAGES.map((l) => l.replace('_', '-')).includes(initial_language)) {
        lang.set(initial_language.replace('-', '_'));
    }
    else if (initial_language === 'fr-CA') {
        lang.set('fr_US');
    }
    else if (initial_language.startsWith('es')) {
        if (initial_language === 'es' || initial_language === 'es-ES') {
            lang.set('es_EU');
        }
        else {
            lang.set('es_US');
        }
    }
    else {
        // compare first two characters of initial_language against each first two characters of SUPPORTED_LANGUAGES
        const initial_language_prefix = initial_language.substring(0, 2);
        const language_match = SUPPORTED_LANGUAGES.find((l) => l.substring(0, 2) === initial_language_prefix);
        lang.set(language_match !== null && language_match !== void 0 ? language_match : 'en_US');
    }
    const fetchData = async ($lang) => {
        let cardFetch = await fetch('/i18n/' + $lang + '.csv');
        let cardData = await cardFetch.text();
        const cardRows = papaparse_min.parse(cardData, { header: true, delimiter: ',' });
        const cards = {};
        cardRows.data.forEach((row) => {
            cards[parseInt(row['No.'])] = {
                name: row['Name'],
                nameParts: [row['Title Line 1'], row['Title Line 2']].filter((s) => !!s),
                headerScale: parseFloat(row['Title Scale']),
            };
        });
        return cards;
    };
    const asyncDerivedStream = (stores, callback, initial_value = {}) => {
        let previous = 0;
        return derived(stores, ($stores, set) => {
            const start = Date.now();
            Promise.resolve(callback($stores)).then((value) => {
                if (start > previous) {
                    previous = start;
                    set(value);
                }
            });
        }, initial_value);
    };
    let cardNames = asyncDerivedStream(lang, fetchData);
    const titleFontSize = derived(lang, ($lang) => {
        return $lang === 'ko_KR' || $lang === 'zh_CN' || $lang === 'zh_TW' ? 42 : 32;
    });

    const createCardStore = () => {
        const { subscribe, set } = writable([]);
        return {
            subscribe,
            set,
            init: async () => {
                let cardFetch = await fetch('/data.csv');
                let cardData = await cardFetch.text();
                const cardRows = papaparse_min.parse(cardData, { header: true, delimiter: ',' });
                const cards = cardRows.data.map((row) => {
                    const artistLinks = [];
                    if (row['Link 1 Description']) {
                        artistLinks.push({ title: row['Link 1 Description'], link: row['Link 1 URL'] });
                    }
                    if (row['Link 2 Description']) {
                        artistLinks.push({ title: row['Link 2 Description'], link: row['Link 2 URL'] });
                    }
                    if (row['Link 3 Description']) {
                        artistLinks.push({ title: row['Link 3 Description'], link: row['Link 3 URL'] });
                    }
                    const cardDetails = {
                        name: row['Name'],
                        nameParts: [row['Title Line 1'], row['Title Line 2']].filter((s) => !!s),
                        headerScale: parseFloat(row['Title Scale']),
                        img: row['@Img'],
                        number: parseInt(row['No.']),
                        rarity: row['Rarity'].toLowerCase(),
                        artist: row['Artist'],
                        artistAlias: row['ArtistAlias'],
                        artistLinks,
                        description: row['Card Description'],
                        featureType: row['Group'],
                        creditColorOverride: row['Credit Colour Override'],
                        series: row['Season'],
                        seriesNumber: row['Set No.'],
                        seriesColorOverride: row['No. Colour Override'],
                        seriesTotal: row['Set Total'],
                        grid: [
                            row['Row1'],
                            row['Row2'],
                            row['Row3'],
                            row['Row4'],
                            row['Row5'],
                            row['Row6'],
                            row['Row7'],
                            row['Row8'],
                        ],
                        points: parseInt(row['Square Count']),
                        specialCost: parseInt(row['Special Cost']),
                    };
                    return cardDetails;
                });
                set(cards);
            },
        };
    };
    const activeCardNumber = writable();
    const cards = createCardStore();
    const activeCard = derived([cards, activeCardNumber], ([$cards, $activeCardNumber]) => $activeCardNumber ? $cards[$activeCardNumber - 1] : undefined);
    const uniqueArtists = derived(cards, ($cards) => {
        const artists = [];
        const seenArtists = {};
        $cards.forEach((c) => {
            if (c.artist && seenArtists[c.artist] === undefined) {
                seenArtists[c.artist] = artists.length;
                artists.push({
                    artist: c.artist,
                    artistAlias: c.artistAlias,
                    artistLinks: c.artistLinks,
                    cards: [c],
                    // cardNumbers: [c.number],
                });
            }
            else if (seenArtists[c.artist]) {
                const entry = artists[seenArtists[c.artist]];
                entry.cards = [...entry.cards, c];
                // entry.cardNumbers = [...entry.cardNumbers, c.number]
            }
        });
        artists.sort((a, b) => a.artist.localeCompare(b.artist));
        return artists;
    });
    const searchCard = writable('');
    const search = writable('');
    const displayFilter = writable('All');
    const season = writable('');
    const filteredCards = derived([cards, searchCard, search, cardNames, displayFilter, season], ([$cards, $searchCard, $search, $cardNames, $displayFilter, $season]) => $cards.filter((c) => c.img &&
        ($season === '' || c.series === $season) &&
        ($displayFilter === 'All' || c.featureType === $displayFilter) &&
        ($searchCard === '' || $cardNames[c.number].name.toLowerCase().includes($searchCard.toLowerCase())) &&
        ($search === '' ||
            c.artist.toLowerCase().includes($search.toLowerCase()) ||
            c.artistAlias.toLowerCase().includes($search.toLowerCase()))));
    const resetFilters = () => {
        searchCard.set('');
        search.set('');
        displayFilter.set('All');
        season.set('');
    };
    let scrollToIndex = writable(undefined);

    /* src/About.svelte generated by Svelte v3.52.0 */
    const file$g = "src/About.svelte";

    function create_fragment$h(ctx) {
    	let about;
    	let column0;
    	let section0;
    	let div0;
    	let t0;
    	let t1_value = /*$cards*/ ctx[0].filter(func).length + "";
    	let t1;
    	let t2;
    	let t3_value = /*$uniqueArtists*/ ctx[1].length + "";
    	let t3;
    	let t4;
    	let t5;
    	let section1;
    	let div1;
    	let p0;
    	let strong0;
    	let t7;
    	let i0;
    	let br0;
    	let t9;
    	let t10;
    	let p1;
    	let strong1;
    	let t12;
    	let i1;
    	let br1;
    	let t14;
    	let t15;
    	let div2;
    	let p2;
    	let t17;
    	let p3;
    	let t19;
    	let column1;
    	let section2;
    	let div3;
    	let p4;
    	let strong2;
    	let t21;
    	let ul;
    	let li0;
    	let a0;
    	let t23;
    	let li1;
    	let a1;
    	let t25;
    	let li2;
    	let a2;
    	let t27;
    	let li3;
    	let a3;
    	let t29;
    	let p5;
    	let t30;
    	let a4;
    	let t32;

    	const block = {
    		c: function create() {
    			about = element("about");
    			column0 = element("column");
    			section0 = element("section");
    			div0 = element("div");
    			t0 = text("A unique Tableturf deck for you to print at home, currently featuring ");
    			t1 = text(t1_value);
    			t2 = text(" cards\n        illustrated by ");
    			t3 = text(t3_value);
    			t4 = text("\n        artists!");
    			t5 = space();
    			section1 = element("section");
    			div1 = element("div");
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "arty";
    			t7 = space();
    			i0 = element("i");
    			i0.textContent = "[ahr-tee]";
    			br0 = element("br");
    			t9 = text("\n          Inclined towards the arts");
    			t10 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "siege";
    			t12 = space();
    			i1 = element("i");
    			i1.textContent = "[seej]";
    			br1 = element("br");
    			t14 = text("\n          A blockade or assault on a territory");
    			t15 = space();
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "“Arty Siege” describes the gameplay of Tableturf - territory control using ink.";
    			t17 = space();
    			p3 = element("p");
    			p3.textContent = "It also contains some of the same sounds as “our TCG”, a reference to the acronym for “Trading Card Game”.";
    			t19 = space();
    			column1 = element("column");
    			section2 = element("section");
    			div3 = element("div");
    			p4 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "Stay Updated!";
    			t21 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Twitter";
    			t23 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Tumblr";
    			t25 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Cohost";
    			t27 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Discord";
    			t29 = space();
    			p5 = element("p");
    			t30 = text("Join the ");
    			a4 = element("a");
    			a4.textContent = "Mailing List";
    			t32 = text(" for email\n          updates.");
    			attr_dev(div0, "class", "card mini svelte-12sbfsf");
    			add_location(div0, file$g, 7, 6, 126);
    			attr_dev(section0, "class", "svelte-12sbfsf");
    			add_location(section0, file$g, 6, 4, 110);
    			attr_dev(strong0, "class", "svelte-12sbfsf");
    			add_location(strong0, file$g, 16, 10, 426);
    			add_location(i0, file$g, 16, 32, 448);
    			add_location(br0, file$g, 16, 48, 464);
    			attr_dev(p0, "class", "svelte-12sbfsf");
    			add_location(p0, file$g, 15, 8, 412);
    			attr_dev(strong1, "class", "svelte-12sbfsf");
    			add_location(strong1, file$g, 20, 10, 542);
    			add_location(i1, file$g, 20, 33, 565);
    			add_location(br1, file$g, 20, 46, 578);
    			attr_dev(p1, "class", "svelte-12sbfsf");
    			add_location(p1, file$g, 19, 8, 528);
    			attr_dev(div1, "class", "card svelte-12sbfsf");
    			add_location(div1, file$g, 14, 6, 385);
    			attr_dev(p2, "class", "svelte-12sbfsf");
    			add_location(p2, file$g, 25, 8, 691);
    			attr_dev(p3, "class", "svelte-12sbfsf");
    			add_location(p3, file$g, 26, 8, 786);
    			attr_dev(div2, "class", "card svelte-12sbfsf");
    			add_location(div2, file$g, 24, 6, 664);
    			attr_dev(section1, "class", "svelte-12sbfsf");
    			add_location(section1, file$g, 13, 4, 369);
    			add_location(column0, file$g, 5, 2, 97);
    			attr_dev(strong2, "class", "svelte-12sbfsf");
    			add_location(strong2, file$g, 36, 10, 1048);
    			attr_dev(p4, "class", "svelte-12sbfsf");
    			add_location(p4, file$g, 35, 8, 1034);
    			attr_dev(a0, "href", "https://twitter.com/tableturfproj");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noreferrer");
    			add_location(a0, file$g, 39, 14, 1119);
    			add_location(li0, file$g, 39, 10, 1115);
    			attr_dev(a1, "href", "https://tableturfproj.tumblr.com");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noreferrer");
    			add_location(a1, file$g, 40, 14, 1227);
    			add_location(li1, file$g, 40, 10, 1223);
    			attr_dev(a2, "href", "https://cohost.org/TableTurfProj");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noreferrer");
    			add_location(a2, file$g, 41, 14, 1333);
    			add_location(li2, file$g, 41, 10, 1329);
    			attr_dev(a3, "href", "https://discord.gg/Be9XqKmVwf");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noreferrer");
    			add_location(a3, file$g, 42, 14, 1439);
    			add_location(li3, file$g, 42, 10, 1435);
    			attr_dev(ul, "class", "svelte-12sbfsf");
    			add_location(ul, file$g, 38, 8, 1100);
    			attr_dev(a4, "href", "https://forms.gle/keK7rG84gPcT7qit9");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noreferrer");
    			add_location(a4, file$g, 45, 19, 1574);
    			attr_dev(p5, "class", "svelte-12sbfsf");
    			add_location(p5, file$g, 44, 8, 1551);
    			attr_dev(div3, "class", "card svelte-12sbfsf");
    			add_location(div3, file$g, 34, 6, 1007);
    			attr_dev(section2, "class", "svelte-12sbfsf");
    			add_location(section2, file$g, 33, 4, 991);
    			attr_dev(column1, "class", "socials svelte-12sbfsf");
    			add_location(column1, file$g, 32, 2, 962);
    			attr_dev(about, "id", "about");
    			attr_dev(about, "class", "svelte-12sbfsf");
    			add_location(about, file$g, 4, 0, 76);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, about, anchor);
    			append_dev(about, column0);
    			append_dev(column0, section0);
    			append_dev(section0, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(column0, t5);
    			append_dev(column0, section1);
    			append_dev(section1, div1);
    			append_dev(div1, p0);
    			append_dev(p0, strong0);
    			append_dev(p0, t7);
    			append_dev(p0, i0);
    			append_dev(p0, br0);
    			append_dev(p0, t9);
    			append_dev(div1, t10);
    			append_dev(div1, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t12);
    			append_dev(p1, i1);
    			append_dev(p1, br1);
    			append_dev(p1, t14);
    			append_dev(section1, t15);
    			append_dev(section1, div2);
    			append_dev(div2, p2);
    			append_dev(div2, t17);
    			append_dev(div2, p3);
    			append_dev(about, t19);
    			append_dev(about, column1);
    			append_dev(column1, section2);
    			append_dev(section2, div3);
    			append_dev(div3, p4);
    			append_dev(p4, strong2);
    			append_dev(div3, t21);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t23);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t25);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t27);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(div3, t29);
    			append_dev(div3, p5);
    			append_dev(p5, t30);
    			append_dev(p5, a4);
    			append_dev(p5, t32);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$cards*/ 1 && t1_value !== (t1_value = /*$cards*/ ctx[0].filter(func).length + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$uniqueArtists*/ 2 && t3_value !== (t3_value = /*$uniqueArtists*/ ctx[1].length + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(about);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = c => !!c.img;

    function instance$h($$self, $$props, $$invalidate) {
    	let $cards;
    	let $uniqueArtists;
    	validate_store(cards, 'cards');
    	component_subscribe($$self, cards, $$value => $$invalidate(0, $cards = $$value));
    	validate_store(uniqueArtists, 'uniqueArtists');
    	component_subscribe($$self, uniqueArtists, $$value => $$invalidate(1, $uniqueArtists = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		cards,
    		uniqueArtists,
    		$cards,
    		$uniqueArtists
    	});

    	return [$cards, $uniqueArtists];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/Credits.svelte generated by Svelte v3.52.0 */

    const file$f = "src/Credits.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (20:8) {#each artist.cards as card}
    function create_each_block_2$2(ctx) {
    	let button;
    	let t0_value = /*card*/ ctx[11].seriesNumber + "";
    	let t0;
    	let t1;
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*card*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			attr_dev(img, "alt", img_alt_value = "Series " + /*card*/ ctx[11].series);
    			attr_dev(img, "class", "button-season svelte-1ho6ix3");
    			if (!src_url_equal(img.src, img_src_value = "./img/UI/Season_" + /*card*/ ctx[11].series.padStart(2, '0') + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$f, 22, 12, 790);
    			attr_dev(button, "class", "svelte-1ho6ix3");
    			add_location(button, file$f, 20, 10, 694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, img);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$uniqueArtists*/ 1 && t0_value !== (t0_value = /*card*/ ctx[11].seriesNumber + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$uniqueArtists*/ 1 && img_alt_value !== (img_alt_value = "Series " + /*card*/ ctx[11].series)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*$uniqueArtists*/ 1 && !src_url_equal(img.src, img_src_value = "./img/UI/Season_" + /*card*/ ctx[11].series.padStart(2, '0') + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(20:8) {#each artist.cards as card}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {:else}
    function create_else_block$3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "link svelte-1ho6ix3");
    			add_location(span, file$f, 34, 10, 1225);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(34:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#if i < artist.artistLinks.length}
    function create_if_block$8(ctx) {
    	let span;
    	let a;
    	let t_value = /*artist*/ ctx[5].artistLinks[/*i*/ ctx[8]].title + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*artist*/ ctx[5].artistLinks[/*i*/ ctx[8]].link);
    			add_location(a, file$f, 32, 29, 1121);
    			attr_dev(span, "class", "link svelte-1ho6ix3");
    			add_location(span, file$f, 32, 10, 1102);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$uniqueArtists*/ 1 && t_value !== (t_value = /*artist*/ ctx[5].artistLinks[/*i*/ ctx[8]].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*$uniqueArtists*/ 1 && a_href_value !== (a_href_value = /*artist*/ ctx[5].artistLinks[/*i*/ ctx[8]].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(32:8) {#if i < artist.artistLinks.length}",
    		ctx
    	});

    	return block;
    }

    // (31:6) {#each [...Array(3).keys()] as i}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[8] < /*artist*/ ctx[5].artistLinks.length) return create_if_block$8;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(31:6) {#each [...Array(3).keys()] as i}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#each $uniqueArtists as artist}
    function create_each_block$6(ctx) {
    	let span0;
    	let t0;
    	let span1;
    	let t1_value = /*artist*/ ctx[5].artist + "";
    	let t1;
    	let t2;
    	let span2;
    	let t3;
    	let t4;
    	let span3;
    	let each_value_2 = /*artist*/ ctx[5].cards;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	let each_value_1 = [...Array(3).keys()];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span2 = element("span");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			span3 = element("span");
    			attr_dev(span0, "class", "svelte-1ho6ix3");
    			add_location(span0, file$f, 16, 6, 589);
    			attr_dev(span1, "class", "svelte-1ho6ix3");
    			add_location(span1, file$f, 17, 6, 604);
    			attr_dev(span2, "class", "svelte-1ho6ix3");
    			add_location(span2, file$f, 18, 6, 640);
    			attr_dev(span3, "class", "svelte-1ho6ix3");
    			add_location(span3, file$f, 37, 6, 1281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span2, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(span2, null);
    			}

    			insert_dev(target, t3, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, span3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$uniqueArtists*/ 1 && t1_value !== (t1_value = /*artist*/ ctx[5].artist + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*scrollToCard, $uniqueArtists*/ 3) {
    				each_value_2 = /*artist*/ ctx[5].cards;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(span2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*$uniqueArtists, Array*/ 1) {
    				each_value_1 = [...Array(3).keys()];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t4.parentNode, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span2);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(span3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(16:4) {#each $uniqueArtists as artist}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let h30;
    	let t3;
    	let div0;
    	let t4;
    	let h31;
    	let t6;
    	let h32;
    	let t8;
    	let p0;
    	let t10;
    	let h33;
    	let t12;
    	let div1;
    	let span0;
    	let t14;
    	let span1;
    	let t16;
    	let span2;
    	let t18;
    	let span3;
    	let t20;
    	let h34;
    	let t22;
    	let h35;
    	let t24;
    	let p1;
    	let t25;
    	let a0;
    	let t27;
    	let a1;
    	let t29;
    	let t30;
    	let p2;
    	let t31;
    	let a2;
    	let t33;
    	let a3;
    	let t35;
    	let p3;
    	let t36;
    	let a4;
    	let t38;
    	let a5;
    	let t40;
    	let p4;
    	let each_value = /*$uniqueArtists*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Credits";
    			t1 = space();
    			h30 = element("h3");
    			h30.textContent = "Artists";
    			t3 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			h31 = element("h3");
    			h31.textContent = "Hosts";
    			t6 = text("\n  Alecat • Charlie\n\n  ");
    			h32 = element("h3");
    			h32.textContent = "Mods";
    			t8 = text("\n  alalampone • Camo_Ink\n\n  ");
    			p0 = element("p");
    			p0.textContent = "Thanks also to Midi Mayo and kuro for assistance with project setup and artist panelling.";
    			t10 = space();
    			h33 = element("h3");
    			h33.textContent = "Playtesters";
    			t12 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Nicosar";
    			t14 = text(" •\n    ");
    			span1 = element("span");
    			span1.textContent = "Yessoan";
    			t16 = text(" •\n    ");
    			span2 = element("span");
    			span2.textContent = "SpongeBev";
    			t18 = text(" •\n    ");
    			span3 = element("span");
    			span3.textContent = "Palette";
    			t20 = space();
    			h34 = element("h3");
    			h34.textContent = "LAN Tableturf Admins";
    			t22 = text("\n  BAE • Chino\n\n  ");
    			h35 = element("h3");
    			h35.textContent = "Code";
    			t24 = space();
    			p1 = element("p");
    			t25 = text("Card effects based on ");
    			a0 = element("a");
    			a0.textContent = "poke-holo.simey.me";
    			t27 = text("\n    - code adapted from the\n    ");
    			a1 = element("a");
    			a1.textContent = "GitHub project";
    			t29 = text(".");
    			t30 = space();
    			p2 = element("p");
    			t31 = text("Translation data from ");
    			a2 = element("a");
    			a2.textContent = "leanny.github.io";
    			t33 = text("\n    by\n    ");
    			a3 = element("a");
    			a3.textContent = "Lean";
    			t35 = space();
    			p3 = element("p");
    			t36 = text("Translation handling referenced from ");
    			a4 = element("a");
    			a4.textContent = "splatoon3.ink";
    			t38 = text("\n    by\n    ");
    			a5 = element("a");
    			a5.textContent = "Matt Isenhower";
    			t40 = space();
    			p4 = element("p");
    			p4.textContent = "Website by Alecat. Built with Svelte.";
    			add_location(h2, file$f, 11, 2, 480);
    			add_location(h30, file$f, 13, 2, 500);
    			attr_dev(div0, "class", "contributors svelte-1ho6ix3");
    			add_location(div0, file$f, 14, 2, 519);
    			add_location(h31, file$f, 41, 2, 1314);
    			add_location(h32, file$f, 44, 2, 1351);
    			add_location(p0, file$f, 47, 2, 1392);
    			add_location(h33, file$f, 49, 2, 1492);
    			add_location(span0, file$f, 51, 4, 1545);
    			add_location(span1, file$f, 52, 4, 1572);
    			add_location(span2, file$f, 53, 4, 1599);
    			add_location(span3, file$f, 54, 4, 1628);
    			attr_dev(div1, "class", "playtesters");
    			add_location(div1, file$f, 50, 2, 1515);
    			add_location(h34, file$f, 57, 2, 1661);
    			add_location(h35, file$f, 60, 2, 1708);
    			attr_dev(a0, "href", "https://poke-holo.simey.me/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noreferrer");
    			add_location(a0, file$f, 62, 26, 1754);
    			attr_dev(a1, "href", "https://github.com/simeydotme/pokemon-cards-css");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noreferrer");
    			add_location(a1, file$f, 64, 4, 1880);
    			add_location(p1, file$f, 61, 2, 1724);
    			attr_dev(a2, "href", "https://github.com/Leanny/leanny.github.io/tree/master/splat3/data/language");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noreferrer");
    			add_location(a2, file$f, 67, 26, 2030);
    			attr_dev(a3, "href", "https://twitter.com/LeanYoshi");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noreferrer");
    			add_location(a3, file$f, 75, 4, 2216);
    			add_location(p2, file$f, 66, 2, 2000);
    			attr_dev(a4, "href", "https://splatoon3.ink/");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noreferrer");
    			add_location(a4, file$f, 78, 41, 2352);
    			attr_dev(a5, "href", "https://mastodon.social/@mattisenhower");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noreferrer");
    			add_location(a5, file$f, 82, 4, 2459);
    			add_location(p3, file$f, 77, 2, 2307);
    			add_location(p4, file$f, 84, 2, 2569);
    			attr_dev(main, "id", "credits");
    			attr_dev(main, "class", "svelte-1ho6ix3");
    			add_location(main, file$f, 10, 0, 458);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, h30);
    			append_dev(main, t3);
    			append_dev(main, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(main, t4);
    			append_dev(main, h31);
    			append_dev(main, t6);
    			append_dev(main, h32);
    			append_dev(main, t8);
    			append_dev(main, p0);
    			append_dev(main, t10);
    			append_dev(main, h33);
    			append_dev(main, t12);
    			append_dev(main, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t14);
    			append_dev(div1, span1);
    			append_dev(div1, t16);
    			append_dev(div1, span2);
    			append_dev(div1, t18);
    			append_dev(div1, span3);
    			append_dev(main, t20);
    			append_dev(main, h34);
    			append_dev(main, t22);
    			append_dev(main, h35);
    			append_dev(main, t24);
    			append_dev(main, p1);
    			append_dev(p1, t25);
    			append_dev(p1, a0);
    			append_dev(p1, t27);
    			append_dev(p1, a1);
    			append_dev(p1, t29);
    			append_dev(main, t30);
    			append_dev(main, p2);
    			append_dev(p2, t31);
    			append_dev(p2, a2);
    			append_dev(p2, t33);
    			append_dev(p2, a3);
    			append_dev(main, t35);
    			append_dev(main, p3);
    			append_dev(p3, t36);
    			append_dev(p3, a4);
    			append_dev(p3, t38);
    			append_dev(p3, a5);
    			append_dev(main, t40);
    			append_dev(main, p4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, $uniqueArtists, scrollToCard*/ 3) {
    				each_value = /*$uniqueArtists*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $filteredCards;
    	let $scrollToIndex;
    	let $uniqueArtists;
    	validate_store(filteredCards, 'filteredCards');
    	component_subscribe($$self, filteredCards, $$value => $$invalidate(3, $filteredCards = $$value));
    	validate_store(scrollToIndex, 'scrollToIndex');
    	component_subscribe($$self, scrollToIndex, $$value => $$invalidate(4, $scrollToIndex = $$value));
    	validate_store(uniqueArtists, 'uniqueArtists');
    	component_subscribe($$self, uniqueArtists, $$value => $$invalidate(0, $uniqueArtists = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Credits', slots, []);

    	const scrollToCard = cardNumber => {
    		$scrollToIndex($filteredCards.findIndex(c => c.number === cardNumber));

    		// navigate to the gallery anchor
    		window.location = ('' + window.location).replace(/#[A-Za-z0-9_-]*$/, '') + '#gallery';

    		window.scrollTo(0, window.scrollY + 110);
    		activeCardNumber.set(cardNumber);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Credits> was created with unknown prop '${key}'`);
    	});

    	const click_handler = card => scrollToCard(card.number);

    	$$self.$capture_state = () => ({
    		activeCardNumber,
    		filteredCards,
    		scrollToIndex,
    		uniqueArtists,
    		scrollToCard,
    		$filteredCards,
    		$scrollToIndex,
    		$uniqueArtists
    	});

    	return [$uniqueArtists, scrollToCard, click_handler];
    }

    class Credits extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Credits",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.52.0 */

    const file$e = "src/Footer.svelte";

    function create_fragment$f(ctx) {
    	let footer;
    	let t0;
    	let h3;
    	let t2;
    	let div2;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let div1;
    	let a1;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			t0 = text("Arty Siege is a fan project, and is not affiliated with Nintendo or Splatoon.\n  ");
    			h3 = element("h3");
    			h3.textContent = "All art remains property of the respective artists. Files on this site are provided for personal use only - do not\n    produce copies to sell.";
    			t2 = space();
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t3 = space();
    			div1 = element("div");
    			a1 = element("a");
    			img1 = element("img");
    			add_location(h3, file$e, 4, 2, 120);
    			attr_dev(img0, "alt", "twitter.com/tableturfproj");
    			if (!src_url_equal(img0.src, img0_src_value = "../img/Site/icon-twitter.svg")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$e, 11, 8, 441);
    			attr_dev(a0, "href", "https://twitter.com/tableturfproj");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noreferrer");
    			add_location(a0, file$e, 10, 6, 355);
    			attr_dev(div0, "class", "social-media-link svelte-b25gec");
    			add_location(div0, file$e, 9, 4, 317);
    			attr_dev(img1, "alt", "tumblr.com/tableturfproj");
    			if (!src_url_equal(img1.src, img1_src_value = "../img/Site/icon-tumblr.svg")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$e, 16, 8, 665);
    			attr_dev(a1, "href", "https://tumblr.com/tableturfproj");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noreferrer");
    			add_location(a1, file$e, 15, 6, 580);
    			attr_dev(div1, "class", "social-media-link svelte-b25gec");
    			add_location(div1, file$e, 14, 4, 542);
    			attr_dev(div2, "class", "social-media-row svelte-b25gec");
    			add_location(div2, file$e, 8, 2, 282);
    			attr_dev(footer, "class", "svelte-b25gec");
    			add_location(footer, file$e, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, t0);
    			append_dev(footer, h3);
    			append_dev(footer, t2);
    			append_dev(footer, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			append_dev(a1, img1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/Navigation.svelte generated by Svelte v3.52.0 */
    const file$d = "src/Navigation.svelte";

    function create_fragment$e(ctx) {
    	let nav;
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let button;
    	let span0;
    	let span1;
    	let span2;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let t9;
    	let li4;
    	let a4;
    	let t11;
    	let li5;
    	let a5;
    	let t13;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			button = element("button");
    			span0 = element("span");
    			span1 = element("span");
    			span2 = element("span");
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "About";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Gallery";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Print";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "What's Next";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "How to Play";
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Credits";
    			t13 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Deutsch";
    			option1 = element("option");
    			option1.textContent = "English";
    			option2 = element("option");
    			option2.textContent = "Español";
    			option3 = element("option");
    			option3.textContent = "Español (MX)";
    			option4 = element("option");
    			option4.textContent = "Français";
    			option5 = element("option");
    			option5.textContent = "Français (CA)";
    			option6 = element("option");
    			option6.textContent = "Italiano";
    			option7 = element("option");
    			option7.textContent = "日本語";
    			option8 = element("option");
    			option8.textContent = "한국어";
    			option9 = element("option");
    			option9.textContent = "Pусский";
    			option10 = element("option");
    			option10.textContent = "Nederlands";
    			option11 = element("option");
    			option11.textContent = "中文（简体)";
    			option12 = element("option");
    			option12.textContent = "中文（台灣)";
    			attr_dev(img, "alt", "Arty Siege");
    			if (!src_url_equal(img.src, img_src_value = "img/Logo.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "60px");
    			attr_dev(img, "class", "svelte-1mm4ggk");
    			add_location(img, file$d, 5, 2, 96);
    			attr_dev(span0, "class", "svelte-1mm4ggk");
    			add_location(span0, file$d, 7, 50, 227);
    			attr_dev(span1, "class", "svelte-1mm4ggk");
    			add_location(span1, file$d, 7, 58, 235);
    			attr_dev(span2, "class", "svelte-1mm4ggk");
    			add_location(span2, file$d, 7, 66, 243);
    			attr_dev(button, "class", "svelte-1mm4ggk");
    			add_location(button, file$d, 7, 4, 181);
    			attr_dev(a0, "href", "#about");
    			attr_dev(a0, "class", "svelte-1mm4ggk");
    			add_location(a0, file$d, 9, 10, 294);
    			attr_dev(li0, "class", "svelte-1mm4ggk");
    			add_location(li0, file$d, 9, 6, 290);
    			attr_dev(a1, "href", "#gallery");
    			attr_dev(a1, "class", "svelte-1mm4ggk");
    			add_location(a1, file$d, 10, 10, 336);
    			attr_dev(li1, "class", "svelte-1mm4ggk");
    			add_location(li1, file$d, 10, 6, 332);
    			attr_dev(a2, "href", "#print");
    			attr_dev(a2, "class", "svelte-1mm4ggk");
    			add_location(a2, file$d, 11, 10, 382);
    			attr_dev(li2, "class", "svelte-1mm4ggk");
    			add_location(li2, file$d, 11, 6, 378);
    			attr_dev(a3, "href", "#whats-next");
    			attr_dev(a3, "class", "svelte-1mm4ggk");
    			add_location(a3, file$d, 12, 10, 424);
    			attr_dev(li3, "class", "svelte-1mm4ggk");
    			add_location(li3, file$d, 12, 6, 420);
    			attr_dev(a4, "href", "#how-to-play");
    			attr_dev(a4, "class", "svelte-1mm4ggk");
    			add_location(a4, file$d, 13, 10, 477);
    			attr_dev(li4, "class", "svelte-1mm4ggk");
    			add_location(li4, file$d, 13, 6, 473);
    			attr_dev(a5, "href", "#credits");
    			attr_dev(a5, "class", "svelte-1mm4ggk");
    			add_location(a5, file$d, 14, 10, 531);
    			attr_dev(li5, "class", "svelte-1mm4ggk");
    			add_location(li5, file$d, 14, 6, 527);
    			attr_dev(ul, "class", "svelte-1mm4ggk");
    			toggle_class(ul, "showNav", /*showNav*/ ctx[0]);
    			add_location(ul, file$d, 8, 4, 265);
    			attr_dev(div, "class", "svelte-1mm4ggk");
    			toggle_class(div, "showNav", /*showNav*/ ctx[0]);
    			add_location(div, file$d, 6, 2, 157);
    			option0.__value = "de_EU";
    			option0.value = option0.__value;
    			add_location(option0, file$d, 18, 4, 634);
    			option1.__value = "en_US";
    			option1.value = option1.__value;
    			add_location(option1, file$d, 19, 4, 677);
    			option2.__value = "es_EU";
    			option2.value = option2.__value;
    			add_location(option2, file$d, 20, 4, 720);
    			option3.__value = "es_US";
    			option3.value = option3.__value;
    			add_location(option3, file$d, 21, 4, 763);
    			option4.__value = "fr_EU";
    			option4.value = option4.__value;
    			add_location(option4, file$d, 22, 4, 811);
    			option5.__value = "fr_US";
    			option5.value = option5.__value;
    			add_location(option5, file$d, 23, 4, 855);
    			option6.__value = "it_EU";
    			option6.value = option6.__value;
    			add_location(option6, file$d, 24, 4, 904);
    			option7.__value = "ja_JP";
    			option7.value = option7.__value;
    			add_location(option7, file$d, 25, 4, 948);
    			option8.__value = "ko_KR";
    			option8.value = option8.__value;
    			add_location(option8, file$d, 26, 4, 987);
    			option9.__value = "ru_EU";
    			option9.value = option9.__value;
    			add_location(option9, file$d, 27, 4, 1026);
    			option10.__value = "nl_EU";
    			option10.value = option10.__value;
    			add_location(option10, file$d, 28, 4, 1069);
    			option11.__value = "zh_CN";
    			option11.value = option11.__value;
    			add_location(option11, file$d, 29, 4, 1115);
    			option12.__value = "zh_TW";
    			option12.value = option12.__value;
    			add_location(option12, file$d, 30, 4, 1157);
    			attr_dev(select, "id", "language");
    			if (/*$lang*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[3].call(select));
    			add_location(select, file$d, 17, 2, 588);
    			attr_dev(nav, "class", "svelte-1mm4ggk");
    			add_location(nav, file$d, 4, 0, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, img);
    			append_dev(nav, t0);
    			append_dev(nav, div);
    			append_dev(div, button);
    			append_dev(button, span0);
    			append_dev(button, span1);
    			append_dev(button, span2);
    			append_dev(div, t1);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t11);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(nav, t13);
    			append_dev(nav, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			append_dev(select, option8);
    			append_dev(select, option9);
    			append_dev(select, option10);
    			append_dev(select, option11);
    			append_dev(select, option12);
    			select_option(select, /*$lang*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[3])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*showNav*/ 1) {
    				toggle_class(ul, "showNav", /*showNav*/ ctx[0]);
    			}

    			if (dirty & /*showNav*/ 1) {
    				toggle_class(div, "showNav", /*showNav*/ ctx[0]);
    			}

    			if (dirty & /*$lang*/ 2) {
    				select_option(select, /*$lang*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $lang;
    	validate_store(lang, 'lang');
    	component_subscribe($$self, lang, $$value => $$invalidate(1, $lang = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigation', slots, []);
    	let showNav = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, showNav = !showNav);

    	function select_change_handler() {
    		$lang = select_value(this);
    		lang.set($lang);
    	}

    	$$self.$capture_state = () => ({ lang, showNav, $lang });

    	$$self.$inject_state = $$props => {
    		if ('showNav' in $$props) $$invalidate(0, showNav = $$props.showNav);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showNav, $lang, click_handler, select_change_handler];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/WhatsNext.svelte generated by Svelte v3.52.0 */

    const file$c = "src/WhatsNext.svelte";

    function create_fragment$d(ctx) {
    	let main;
    	let div1;
    	let h20;
    	let t1;
    	let div0;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let a0;
    	let t6;
    	let t7;
    	let div4;
    	let div2;
    	let t8;
    	let div3;
    	let h21;
    	let t10;
    	let p2;
    	let t12;
    	let p3;
    	let t13;
    	let a1;
    	let t15;
    	let a2;
    	let t17;
    	let t18;
    	let p4;
    	let t19;
    	let a3;
    	let t21;
    	let t22;
    	let p5;
    	let t24;
    	let p6;
    	let t26;
    	let p7;
    	let t28;
    	let ul2;
    	let li0;
    	let t30;
    	let li1;
    	let t32;
    	let li2;
    	let t34;
    	let ul0;
    	let li3;
    	let t36;
    	let li4;
    	let t38;
    	let li5;
    	let t40;
    	let ul1;
    	let li6;
    	let t42;
    	let li7;
    	let t44;
    	let p8;
    	let t46;
    	let p9;
    	let t48;
    	let ul6;
    	let li8;
    	let t50;
    	let li9;
    	let t52;
    	let ul3;
    	let li10;
    	let t54;
    	let li11;
    	let t56;
    	let ul4;
    	let li12;
    	let t58;
    	let li13;
    	let t60;
    	let li14;
    	let t62;
    	let li15;
    	let t64;
    	let ul5;
    	let li16;
    	let t66;
    	let li17;
    	let t68;
    	let li18;
    	let t70;
    	let p10;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Stay Updated";
    			t1 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "The project will take a bit of a break, some small website updates might happen during that time.";
    			t3 = space();
    			p1 = element("p");
    			t4 = text("A print run is in continual consideration. You can fill in this ");
    			a0 = element("a");
    			a0.textContent = "Interest Check form";
    			t6 = text("\n        to help us determine where we put our energy next!");
    			t7 = space();
    			div4 = element("div");
    			div2 = element("div");
    			t8 = space();
    			div3 = element("div");
    			h21 = element("h2");
    			h21.textContent = "How To Play";
    			t10 = space();
    			p2 = element("p");
    			p2.textContent = "By printing these cards you can play Tableturf in real life!";
    			t12 = space();
    			p3 = element("p");
    			t13 = text("We ");
    			a1 = element("a");
    			a1.textContent = "prototyped";
    			t15 = text(" and\n        ");
    			a2 = element("a");
    			a2.textContent = "playtested IRL tableturf";
    			t17 = text(", but since the\n        game now offers multiplayer the focus of the project has pivoted away from making it a practical Print &\n        Play game; we worried less about size and contrast on the cards in favour of allowing the artists to let their\n        imaginations run wild with the card art.");
    			t18 = space();
    			p4 = element("p");
    			t19 = text("Meanwhile, ");
    			a3 = element("a");
    			a3.textContent = "alternative rules";
    			t21 = text(" have been designed which\n        streamline gameplay in an IRL environment. These rules require updates to the card UI - currently exclusive to print\n        runs distributed at LAN events, thanks to the efforts of BAE and Chino.");
    			t22 = space();
    			p5 = element("p");
    			p5.textContent = "If you want an exact 1-1 gameplay experience, read on!";
    			t24 = space();
    			p6 = element("p");
    			p6.textContent = "These instructions will not explain the rules of Tableturf.";
    			t26 = space();
    			p7 = element("p");
    			p7.textContent = "You will need:";
    			t28 = space();
    			ul2 = element("ul");
    			li0 = element("li");
    			li0.textContent = "15 card decks for two players (you can print just the cards you need!)";
    			t30 = space();
    			li1 = element("li");
    			li1.textContent = "Privacy screens to keep your moves hidden";
    			t32 = space();
    			li2 = element("li");
    			li2.textContent = "A private map for each player. To match the Arty Siege cards, make the grid lines 3mm / 1/8th inch apart";
    			t34 = space();
    			ul0 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Lined graph paper is a handy way to draw out your moves.";
    			t36 = space();
    			li4 = element("li");
    			li4.textContent = "Using a piece of clear acrylic, or printing on clear acetate will allow you to preview each move by sliding\n            your card around under the minimap";
    			t38 = space();
    			li5 = element("li");
    			li5.textContent = "A play area to be shared by the players and a way to mark the occupied squares - you can get very creative\n          with how you construct the game board!";
    			t40 = space();
    			ul1 = element("ul");
    			li6 = element("li");
    			li6.textContent = "Fans have made their own boards using lego, 3D printed grids, cardboard, beads and more!";
    			t42 = space();
    			li7 = element("li");
    			li7.textContent = "Tokens to track how much special charge each player has";
    			t44 = space();
    			p8 = element("p");
    			p8.textContent = "Play:";
    			t46 = space();
    			p9 = element("p");
    			p9.textContent = "Start the game by drawing your starting hand.";
    			t48 = space();
    			ul6 = element("ul");
    			li8 = element("li");
    			li8.textContent = "Each turn, make your move selection in secret, using your minimap to guide where you are permitted to place\n          pieces.";
    			t50 = space();
    			li9 = element("li");
    			li9.textContent = "Once both players have made their selections, reveal where you placed your cards!";
    			t52 = space();
    			ul3 = element("ul");
    			li10 = element("li");
    			li10.textContent = "Or, reveal that you haven't placed a card, discarding your card for a special charge.";
    			t54 = space();
    			li11 = element("li");
    			li11.textContent = "Resolve the placements.";
    			t56 = space();
    			ul4 = element("ul");
    			li12 = element("li");
    			li12.textContent = "Update the play mat. It's handy to mark all the tiles for the larger card, then the smaller one, overriding\n            the large piece's tiles if necessary";
    			t58 = space();
    			li13 = element("li");
    			li13.textContent = "Spend any special charge tokens that were needed to make your placement.";
    			t60 = space();
    			li14 = element("li");
    			li14.textContent = "Remember to update your minimaps as well!";
    			t62 = space();
    			li15 = element("li");
    			li15.textContent = "Check for special charge - take a token if you've charged special from a square.";
    			t64 = space();
    			ul5 = element("ul");
    			li16 = element("li");
    			li16.textContent = "Make sure you have a way of knowing that you've taken special charge from a square once only";
    			t66 = space();
    			li17 = element("li");
    			li17.textContent = "Draw a new card";
    			t68 = space();
    			li18 = element("li");
    			li18.textContent = "Repeat card placements until twelve turns have passed";
    			t70 = space();
    			p10 = element("p");
    			p10.textContent = "The winner is the player who has claimed the most squares at the end of the game!";
    			attr_dev(h20, "id", "whats-next");
    			attr_dev(h20, "class", "svelte-11o0sh7");
    			add_location(h20, file$c, 4, 4, 75);
    			add_location(p0, file$c, 6, 6, 148);
    			attr_dev(a0, "href", "https://forms.gle/vi9CDbJXvrkTEmMRA");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noreferrer");
    			add_location(a0, file$c, 8, 72, 335);
    			add_location(p1, file$c, 7, 6, 259);
    			attr_dev(div0, "class", "whats-next svelte-11o0sh7");
    			add_location(div0, file$c, 5, 4, 117);
    			attr_dev(div1, "class", "whats-next-wrapper svelte-11o0sh7");
    			add_location(div1, file$c, 3, 2, 38);
    			attr_dev(div2, "class", "how-to-play-background svelte-11o0sh7");
    			add_location(div2, file$c, 18, 4, 607);
    			attr_dev(h21, "id", "how-to-play");
    			attr_dev(h21, "class", "svelte-11o0sh7");
    			add_location(h21, file$c, 20, 6, 682);
    			add_location(p2, file$c, 21, 6, 726);
    			attr_dev(a1, "href", "https://twitter.com/alecatmew/status/1571518307064483840");
    			add_location(a1, file$c, 23, 11, 815);
    			attr_dev(a2, "href", "https://twitter.com/alecatmew/status/1578373911892226048");
    			add_location(a2, file$c, 24, 8, 909);
    			add_location(p3, file$c, 22, 6, 800);
    			attr_dev(a3, "href", "https://mixam.com/embed/66187d80287a5445a991cc91");
    			add_location(a3, file$c, 30, 19, 1345);
    			add_location(p4, file$c, 29, 6, 1322);
    			add_location(p5, file$c, 34, 6, 1673);
    			add_location(p6, file$c, 35, 6, 1741);
    			add_location(p7, file$c, 36, 6, 1814);
    			add_location(li0, file$c, 38, 8, 1855);
    			add_location(li1, file$c, 39, 8, 1943);
    			add_location(li2, file$c, 40, 8, 2002);
    			add_location(li3, file$c, 44, 10, 2159);
    			add_location(li4, file$c, 45, 10, 2235);
    			add_location(ul0, file$c, 43, 8, 2144);
    			add_location(li5, file$c, 50, 8, 2445);
    			add_location(li6, file$c, 55, 10, 2653);
    			add_location(ul1, file$c, 54, 8, 2638);
    			add_location(li7, file$c, 57, 8, 2773);
    			add_location(ul2, file$c, 37, 6, 1842);
    			add_location(p8, file$c, 59, 6, 2856);
    			add_location(p9, file$c, 60, 6, 2875);
    			add_location(li8, file$c, 62, 8, 2947);
    			add_location(li9, file$c, 66, 8, 3110);
    			add_location(li10, file$c, 67, 12, 3213);
    			add_location(ul3, file$c, 67, 8, 3209);
    			add_location(li11, file$c, 68, 8, 3321);
    			add_location(li12, file$c, 70, 10, 3377);
    			add_location(li13, file$c, 74, 10, 3577);
    			add_location(li14, file$c, 75, 10, 3669);
    			add_location(ul4, file$c, 69, 8, 3362);
    			add_location(li15, file$c, 77, 8, 3742);
    			add_location(li16, file$c, 78, 12, 3844);
    			add_location(ul5, file$c, 78, 8, 3840);
    			add_location(li17, file$c, 79, 8, 3959);
    			add_location(li18, file$c, 80, 8, 3992);
    			add_location(ul6, file$c, 61, 6, 2934);
    			add_location(p10, file$c, 82, 6, 4073);
    			attr_dev(div3, "class", "how-to-play svelte-11o0sh7");
    			add_location(div3, file$c, 19, 4, 650);
    			attr_dev(div4, "class", "how-to-play-wrapper svelte-11o0sh7");
    			add_location(div4, file$c, 17, 2, 569);
    			attr_dev(main, "class", "svelte-11o0sh7");
    			add_location(main, file$c, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(p1, t4);
    			append_dev(p1, a0);
    			append_dev(p1, t6);
    			append_dev(main, t7);
    			append_dev(main, div4);
    			append_dev(div4, div2);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, h21);
    			append_dev(div3, t10);
    			append_dev(div3, p2);
    			append_dev(div3, t12);
    			append_dev(div3, p3);
    			append_dev(p3, t13);
    			append_dev(p3, a1);
    			append_dev(p3, t15);
    			append_dev(p3, a2);
    			append_dev(p3, t17);
    			append_dev(div3, t18);
    			append_dev(div3, p4);
    			append_dev(p4, t19);
    			append_dev(p4, a3);
    			append_dev(p4, t21);
    			append_dev(div3, t22);
    			append_dev(div3, p5);
    			append_dev(div3, t24);
    			append_dev(div3, p6);
    			append_dev(div3, t26);
    			append_dev(div3, p7);
    			append_dev(div3, t28);
    			append_dev(div3, ul2);
    			append_dev(ul2, li0);
    			append_dev(ul2, t30);
    			append_dev(ul2, li1);
    			append_dev(ul2, t32);
    			append_dev(ul2, li2);
    			append_dev(ul2, t34);
    			append_dev(ul2, ul0);
    			append_dev(ul0, li3);
    			append_dev(ul0, t36);
    			append_dev(ul0, li4);
    			append_dev(ul2, t38);
    			append_dev(ul2, li5);
    			append_dev(ul2, t40);
    			append_dev(ul2, ul1);
    			append_dev(ul1, li6);
    			append_dev(ul2, t42);
    			append_dev(ul2, li7);
    			append_dev(div3, t44);
    			append_dev(div3, p8);
    			append_dev(div3, t46);
    			append_dev(div3, p9);
    			append_dev(div3, t48);
    			append_dev(div3, ul6);
    			append_dev(ul6, li8);
    			append_dev(ul6, t50);
    			append_dev(ul6, li9);
    			append_dev(ul6, t52);
    			append_dev(ul6, ul3);
    			append_dev(ul3, li10);
    			append_dev(ul6, t54);
    			append_dev(ul6, li11);
    			append_dev(ul6, t56);
    			append_dev(ul6, ul4);
    			append_dev(ul4, li12);
    			append_dev(ul4, t58);
    			append_dev(ul4, li13);
    			append_dev(ul4, t60);
    			append_dev(ul4, li14);
    			append_dev(ul6, t62);
    			append_dev(ul6, li15);
    			append_dev(ul6, t64);
    			append_dev(ul6, ul5);
    			append_dev(ul5, li16);
    			append_dev(ul6, t66);
    			append_dev(ul6, li17);
    			append_dev(ul6, t68);
    			append_dev(ul6, li18);
    			append_dev(div3, t70);
    			append_dev(div3, p10);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WhatsNext', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WhatsNext> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class WhatsNext extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WhatsNext",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    function scrollStop$1(refresh = 100) {
        let isScrolling;
        return (callback) => {
            clearTimeout(isScrolling);
            isScrolling = setTimeout(callback, refresh);
        };
    }
    function scrollSpeed(refresh = 200) {
        let lastScrollPosition = undefined;
        let isScrollingFast;
        return (size, callback) => (scrollPosition) => {
            if (!lastScrollPosition) {
                lastScrollPosition = scrollPosition;
            }
            else {
                if (Math.abs(scrollPosition - lastScrollPosition) > size) {
                    callback.fast();
                    if (isScrollingFast !== undefined) {
                        clearTimeout(isScrollingFast);
                        isScrollingFast = undefined;
                    }
                    isScrollingFast = setTimeout(() => {
                        callback.slow();
                        isScrollingFast = undefined;
                    }, refresh);
                }
                else {
                    if (isScrollingFast === undefined) {
                        callback.slow();
                    }
                }
                lastScrollPosition = scrollPosition;
            }
        };
    }

    /* src/lib/Grid.svelte generated by Svelte v3.52.0 */

    const file$b = "src/lib/Grid.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	const constants_0 = /*getItemProps*/ child_ctx[10](/*index*/ child_ctx[37]);
    	child_ctx[38] = constants_0.rowIndex;
    	child_ctx[39] = constants_0.columnIndex;
    	child_ctx[40] = constants_0.style;
    	return child_ctx;
    }

    const get_placeholder_slot_changes = dirty => ({
    	index: dirty[0] & /*indexes*/ 128,
    	rowIndex: dirty[0] & /*indexes*/ 128,
    	columnIndex: dirty[0] & /*indexes*/ 128,
    	style: dirty[0] & /*indexes*/ 128
    });

    const get_placeholder_slot_context = ctx => ({
    	index: /*index*/ ctx[37],
    	rowIndex: /*rowIndex*/ ctx[38],
    	columnIndex: /*columnIndex*/ ctx[39],
    	style: /*style*/ ctx[40]
    });

    const get_item_slot_changes = dirty => ({
    	index: dirty[0] & /*indexes*/ 128,
    	rowIndex: dirty[0] & /*indexes*/ 128,
    	columnIndex: dirty[0] & /*indexes*/ 128,
    	style: dirty[0] & /*indexes*/ 128
    });

    const get_item_slot_context = ctx => ({
    	index: /*index*/ ctx[37],
    	rowIndex: /*rowIndex*/ ctx[38],
    	columnIndex: /*columnIndex*/ ctx[39],
    	style: /*style*/ ctx[40]
    });

    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    // (117:2) {#if $$slots.header}
    function create_if_block_1$6(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	const header_slot_template = /*#slots*/ ctx[28].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[27], get_header_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (header_slot) header_slot.c();
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[29].call(div));
    			add_location(div, file$b, 117, 4, 4197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (header_slot) {
    				header_slot.m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[29].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty[0] & /*$$scope*/ 134217728)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[27], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (header_slot) header_slot.d(detaching);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(117:2) {#if $$slots.header}",
    		ctx
    	});

    	return block;
    }

    // (129:6) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const placeholder_slot_template = /*#slots*/ ctx[28].placeholder;
    	const placeholder_slot = create_slot(placeholder_slot_template, ctx, /*$$scope*/ ctx[27], get_placeholder_slot_context);
    	const placeholder_slot_or_fallback = placeholder_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (placeholder_slot_or_fallback) placeholder_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (placeholder_slot_or_fallback) {
    				placeholder_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (placeholder_slot) {
    				if (placeholder_slot.p && (!current || dirty[0] & /*$$scope, indexes*/ 134217856)) {
    					update_slot_base(
    						placeholder_slot,
    						placeholder_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(placeholder_slot_template, /*$$scope*/ ctx[27], dirty, get_placeholder_slot_changes),
    						get_placeholder_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(placeholder_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(placeholder_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (placeholder_slot_or_fallback) placeholder_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(129:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (127:6) {#if !isScrollingFast || !$$slots.placeholder}
    function create_if_block$7(ctx) {
    	let current;
    	const item_slot_template = /*#slots*/ ctx[28].item;
    	const item_slot = create_slot(item_slot_template, ctx, /*$$scope*/ ctx[27], get_item_slot_context);
    	const item_slot_or_fallback = item_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (item_slot_or_fallback) item_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (item_slot_or_fallback) {
    				item_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (item_slot) {
    				if (item_slot.p && (!current || dirty[0] & /*$$scope, indexes*/ 134217856)) {
    					update_slot_base(
    						item_slot,
    						item_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(item_slot_template, /*$$scope*/ ctx[27], dirty, get_item_slot_changes),
    						get_item_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(127:6) {#if !isScrollingFast || !$$slots.placeholder}",
    		ctx
    	});

    	return block;
    }

    // (130:74) Missing placeholder
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Missing placeholder");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(130:74) Missing placeholder",
    		ctx
    	});

    	return block;
    }

    // (128:67) Missing template
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Missing template");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(128:67) Missing template",
    		ctx
    	});

    	return block;
    }

    // (124:4) {#each indexes as index (getKey(index))}
    function create_each_block$5(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*isScrollingFast*/ ctx[8] || !/*$$slots*/ ctx[12].placeholder) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(124:4) {#each indexes as index (getKey(index))}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let style_height = `${/*innerHeight*/ ctx[9]}px`;
    	let t1;
    	let div1_resize_listener;
    	let style_height_1 = `${/*height*/ ctx[0]}px`;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*$$slots*/ ctx[12].header && create_if_block_1$6(ctx);
    	let each_value = /*indexes*/ ctx[7];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*getKey*/ ctx[2](/*index*/ ctx[37]);
    	validate_each_keys(ctx, each_value, get_each_context$5, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    	}

    	const footer_slot_template = /*#slots*/ ctx[28].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[27], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (footer_slot) footer_slot.c();
    			set_style(div0, "height", style_height);
    			set_style(div0, "width", `100%`);
    			add_location(div0, file$b, 122, 2, 4287);
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[31].call(div1));
    			set_style(div1, "position", `relative`);
    			set_style(div1, "overflow", `auto`);
    			set_style(div1, "height", style_height_1);
    			set_style(div1, "width", /*width*/ ctx[1]);
    			add_location(div1, file$b, 106, 0, 3989);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);

    			if (footer_slot) {
    				footer_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[30](div1);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[31].bind(div1));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "scroll", /*onScroll*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*$$slots*/ ctx[12].header) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*$$slots*/ 4096) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*$$scope, indexes, getItemProps, isScrollingFast, $$slots, getKey*/ 134223236) {
    				each_value = /*indexes*/ ctx[7];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$5, null, get_each_context$5);
    				check_outros();
    			}

    			if (dirty[0] & /*innerHeight*/ 512 && style_height !== (style_height = `${/*innerHeight*/ ctx[9]}px`)) {
    				set_style(div0, "height", style_height);
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty[0] & /*$$scope*/ 134217728)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[27], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}

    			if (dirty[0] & /*height*/ 1 && style_height_1 !== (style_height_1 = `${/*height*/ ctx[0]}px`)) {
    				set_style(div1, "height", style_height_1);
    			}

    			if (dirty[0] & /*width*/ 2) {
    				set_style(div1, "width", /*width*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (footer_slot) footer_slot.d(detaching);
    			/*div1_binding*/ ctx[30](null);
    			div1_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const scrollStop = scrollStop$1();
    const _scrollSpeed = scrollSpeed();

    const round = {
    	ceil: (x, multiple) => Math.ceil(x / multiple) * multiple,
    	floor: (x, multiple) => ~~(x / multiple) * multiple
    };

    const getIndexes = (itemCount, itemHeight, height, columnCount, overScanColumn, scrollPosition) => {
    	const indexes = [];
    	const startIndexTemp = round.floor(scrollPosition / itemHeight * columnCount, columnCount);

    	const startIndexOverScan = startIndexTemp > overScanColumn
    	? startIndexTemp - overScanColumn
    	: 0;

    	const startIndex = startIndexTemp > 0 && startIndexOverScan >= 0
    	? startIndexOverScan
    	: startIndexTemp;

    	const endIndexTemp = Math.min(itemCount, round.ceil((scrollPosition + height) / itemHeight * columnCount, columnCount));
    	const endIndexOverScan = endIndexTemp + overScanColumn;

    	const endIndex = endIndexOverScan < itemCount
    	? endIndexOverScan
    	: itemCount;

    	for (let i = startIndex; i < endIndex; i++) indexes.push(i);
    	return indexes;
    };

    const getRowIndex = (index, columnCount) => ~~(index / columnCount);

    function instance$c($$self, $$props, $$invalidate) {
    	let _columnCount;
    	let innerHeight;
    	let overScanColumn;
    	let scrollSpeed$1;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, ['header','item','placeholder','footer']);
    	const $$slots = compute_slots(slots);
    	let { itemCount } = $$props;
    	let { itemHeight } = $$props;
    	let { itemWidth } = $$props;
    	let { height } = $$props;
    	let { width = '100%' } = $$props;
    	let { overScan = 1 } = $$props;
    	let { marginLeft = 0 } = $$props;
    	let { marginTop = 0 } = $$props;
    	let { scrollPosition = 0 } = $$props;
    	let { scrollBehavior = 'auto' } = $$props;
    	let { getKey = index => index } = $$props;
    	let { columnCount = undefined } = $$props;
    	let grid;
    	let _scrollPosition = scrollPosition;
    	let headerHeight = 0;
    	let offsetWidth = 0;
    	let clientWidth = 0;
    	let indexes = [];
    	let manualScroll = false;
    	let isScrolling = false;
    	let isScrollingFast = false;

    	const scrollToIndex = (index, behavior = scrollBehavior) => {
    		scrollTo(getRowIndex(index, _columnCount) * itemHeight + marginTop, behavior);
    	};

    	const scrollToPosition = (position, behavior = scrollBehavior) => {
    		scrollTo(position, behavior);
    	};

    	const scrollTo = (top, behavior = scrollBehavior) => {
    		if (grid) {
    			manualScroll = true;
    			grid.scrollTo({ top: top + headerHeight, behavior });
    			$$invalidate(13, scrollPosition = _scrollPosition);
    			manualScroll = false;
    		}
    	};

    	const scrollToManual = scrollPosition => {
    		if (!manualScroll && !isScrolling) {
    			manualScroll = true;

    			grid.scrollTo({
    				top: scrollPosition,
    				behavior: scrollBehavior
    			});

    			manualScroll = false;
    		}
    	};

    	const getItemProps = index => {
    		const rowIndex = getRowIndex(index, _columnCount);
    		const columnIndex = index % _columnCount;

    		return {
    			rowIndex,
    			columnIndex,
    			style: `position: absolute; transform: translate3d(${columnIndex * itemWidth + marginLeft}px, ${rowIndex * itemHeight + marginTop}px, 0px); height: ${itemHeight}px; width: ${itemWidth}px; will-change: transform;`
    		};
    	};

    	const onScroll = ({ currentTarget }) => {
    		isScrolling = true;

    		if (!manualScroll) {
    			$$invalidate(24, _scrollPosition = Math.max(0, currentTarget.scrollTop - headerHeight));
    			$$invalidate(13, scrollPosition = _scrollPosition);
    			scrollSpeed$1(scrollPosition);
    		}

    		scrollStop(() => {
    			isScrolling = false;
    		});
    	};

    	$$self.$$.on_mount.push(function () {
    		if (itemCount === undefined && !('itemCount' in $$props || $$self.$$.bound[$$self.$$.props['itemCount']])) {
    			console.warn("<Grid> was created without expected prop 'itemCount'");
    		}

    		if (itemHeight === undefined && !('itemHeight' in $$props || $$self.$$.bound[$$self.$$.props['itemHeight']])) {
    			console.warn("<Grid> was created without expected prop 'itemHeight'");
    		}

    		if (itemWidth === undefined && !('itemWidth' in $$props || $$self.$$.bound[$$self.$$.props['itemWidth']])) {
    			console.warn("<Grid> was created without expected prop 'itemWidth'");
    		}

    		if (height === undefined && !('height' in $$props || $$self.$$.bound[$$self.$$.props['height']])) {
    			console.warn("<Grid> was created without expected prop 'height'");
    		}
    	});

    	const writable_props = [
    		'itemCount',
    		'itemHeight',
    		'itemWidth',
    		'height',
    		'width',
    		'overScan',
    		'marginLeft',
    		'marginTop',
    		'scrollPosition',
    		'scrollBehavior',
    		'getKey',
    		'columnCount'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		headerHeight = this.offsetHeight;
    		$$invalidate(6, headerHeight);
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			grid = $$value;
    			$$invalidate(3, grid);
    		});
    	}

    	function div1_elementresize_handler() {
    		offsetWidth = this.offsetWidth;
    		clientWidth = this.clientWidth;
    		$$invalidate(4, offsetWidth);
    		$$invalidate(5, clientWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('itemCount' in $$props) $$invalidate(14, itemCount = $$props.itemCount);
    		if ('itemHeight' in $$props) $$invalidate(15, itemHeight = $$props.itemHeight);
    		if ('itemWidth' in $$props) $$invalidate(16, itemWidth = $$props.itemWidth);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('overScan' in $$props) $$invalidate(17, overScan = $$props.overScan);
    		if ('marginLeft' in $$props) $$invalidate(18, marginLeft = $$props.marginLeft);
    		if ('marginTop' in $$props) $$invalidate(19, marginTop = $$props.marginTop);
    		if ('scrollPosition' in $$props) $$invalidate(13, scrollPosition = $$props.scrollPosition);
    		if ('scrollBehavior' in $$props) $$invalidate(20, scrollBehavior = $$props.scrollBehavior);
    		if ('getKey' in $$props) $$invalidate(2, getKey = $$props.getKey);
    		if ('columnCount' in $$props) $$invalidate(21, columnCount = $$props.columnCount);
    		if ('$$scope' in $$props) $$invalidate(27, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		__scrollSpeed: scrollSpeed,
    		_scrollStop: scrollStop$1,
    		scrollStop,
    		_scrollSpeed,
    		round,
    		getIndexes,
    		getRowIndex,
    		itemCount,
    		itemHeight,
    		itemWidth,
    		height,
    		width,
    		overScan,
    		marginLeft,
    		marginTop,
    		scrollPosition,
    		scrollBehavior,
    		getKey,
    		columnCount,
    		grid,
    		_scrollPosition,
    		headerHeight,
    		offsetWidth,
    		clientWidth,
    		indexes,
    		manualScroll,
    		isScrolling,
    		isScrollingFast,
    		scrollToIndex,
    		scrollToPosition,
    		scrollTo,
    		scrollToManual,
    		getItemProps,
    		onScroll,
    		scrollSpeed: scrollSpeed$1,
    		overScanColumn,
    		_columnCount,
    		innerHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ('itemCount' in $$props) $$invalidate(14, itemCount = $$props.itemCount);
    		if ('itemHeight' in $$props) $$invalidate(15, itemHeight = $$props.itemHeight);
    		if ('itemWidth' in $$props) $$invalidate(16, itemWidth = $$props.itemWidth);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('overScan' in $$props) $$invalidate(17, overScan = $$props.overScan);
    		if ('marginLeft' in $$props) $$invalidate(18, marginLeft = $$props.marginLeft);
    		if ('marginTop' in $$props) $$invalidate(19, marginTop = $$props.marginTop);
    		if ('scrollPosition' in $$props) $$invalidate(13, scrollPosition = $$props.scrollPosition);
    		if ('scrollBehavior' in $$props) $$invalidate(20, scrollBehavior = $$props.scrollBehavior);
    		if ('getKey' in $$props) $$invalidate(2, getKey = $$props.getKey);
    		if ('columnCount' in $$props) $$invalidate(21, columnCount = $$props.columnCount);
    		if ('grid' in $$props) $$invalidate(3, grid = $$props.grid);
    		if ('_scrollPosition' in $$props) $$invalidate(24, _scrollPosition = $$props._scrollPosition);
    		if ('headerHeight' in $$props) $$invalidate(6, headerHeight = $$props.headerHeight);
    		if ('offsetWidth' in $$props) $$invalidate(4, offsetWidth = $$props.offsetWidth);
    		if ('clientWidth' in $$props) $$invalidate(5, clientWidth = $$props.clientWidth);
    		if ('indexes' in $$props) $$invalidate(7, indexes = $$props.indexes);
    		if ('manualScroll' in $$props) manualScroll = $$props.manualScroll;
    		if ('isScrolling' in $$props) isScrolling = $$props.isScrolling;
    		if ('isScrollingFast' in $$props) $$invalidate(8, isScrollingFast = $$props.isScrollingFast);
    		if ('scrollSpeed' in $$props) scrollSpeed$1 = $$props.scrollSpeed;
    		if ('overScanColumn' in $$props) $$invalidate(25, overScanColumn = $$props.overScanColumn);
    		if ('_columnCount' in $$props) $$invalidate(26, _columnCount = $$props._columnCount);
    		if ('innerHeight' in $$props) $$invalidate(9, innerHeight = $$props.innerHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*columnCount, offsetWidth, marginLeft, clientWidth, itemWidth*/ 2424880) {
    			$$invalidate(26, _columnCount = !columnCount
    			? Math.max(~~((offsetWidth - marginLeft - (offsetWidth - clientWidth)) / itemWidth), 1)
    			: columnCount);
    		}

    		if ($$self.$$.dirty[0] & /*itemCount, _columnCount, itemHeight*/ 67158016) {
    			$$invalidate(9, innerHeight = round.ceil(itemCount, _columnCount) * itemHeight / _columnCount);
    		}

    		if ($$self.$$.dirty[0] & /*_columnCount, overScan*/ 67239936) {
    			$$invalidate(25, overScanColumn = _columnCount * overScan);
    		}

    		if ($$self.$$.dirty[0] & /*offsetWidth, _columnCount, itemCount, itemHeight, height, overScanColumn, _scrollPosition*/ 117489681) {
    			if (offsetWidth || _columnCount) {
    				$$invalidate(7, indexes = getIndexes(itemCount, itemHeight, height, _columnCount, overScanColumn, _scrollPosition));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*grid, scrollPosition*/ 8200) {
    			if (grid) {
    				scrollToManual(scrollPosition);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*height*/ 1) {
    			scrollSpeed$1 = _scrollSpeed(height, {
    				fast: () => {
    					$$invalidate(8, isScrollingFast = true);
    				},
    				slow: () => {
    					$$invalidate(8, isScrollingFast = false);
    				}
    			});
    		}
    	};

    	return [
    		height,
    		width,
    		getKey,
    		grid,
    		offsetWidth,
    		clientWidth,
    		headerHeight,
    		indexes,
    		isScrollingFast,
    		innerHeight,
    		getItemProps,
    		onScroll,
    		$$slots,
    		scrollPosition,
    		itemCount,
    		itemHeight,
    		itemWidth,
    		overScan,
    		marginLeft,
    		marginTop,
    		scrollBehavior,
    		columnCount,
    		scrollToIndex,
    		scrollToPosition,
    		_scrollPosition,
    		overScanColumn,
    		_columnCount,
    		$$scope,
    		slots,
    		div_elementresize_handler,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$c,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				itemCount: 14,
    				itemHeight: 15,
    				itemWidth: 16,
    				height: 0,
    				width: 1,
    				overScan: 17,
    				marginLeft: 18,
    				marginTop: 19,
    				scrollPosition: 13,
    				scrollBehavior: 20,
    				getKey: 2,
    				columnCount: 21,
    				scrollToIndex: 22,
    				scrollToPosition: 23
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get itemCount() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemCount(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemWidth() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemWidth(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overScan() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overScan(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginLeft() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginLeft(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginTop() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginTop(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollPosition() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollPosition(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollBehavior() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollBehavior(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getKey() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getKey(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnCount() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnCount(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToIndex() {
    		return this.$$.ctx[22];
    	}

    	set scrollToIndex(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToPosition() {
    		return this.$$.ctx[23];
    	}

    	set scrollToPosition(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const getCardContext = () => {
        const card = getContext('card');
        if (!card) {
            throw new Error('Card must be called inside a card context');
        }
        return card;
    };

    /* src/card/face/Glare.svelte generated by Svelte v3.52.0 */

    const file$a = "src/card/face/Glare.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "glare " + /*rarity*/ ctx[0] + " svelte-jhd6we");
    			add_location(div, file$a, 4, 0, 51);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*rarity*/ 1 && div_class_value !== (div_class_value = "glare " + /*rarity*/ ctx[0] + " svelte-jhd6we")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Glare', slots, []);
    	let { rarity = 'common' } = $$props;
    	const writable_props = ['rarity'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Glare> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('rarity' in $$props) $$invalidate(0, rarity = $$props.rarity);
    	};

    	$$self.$capture_state = () => ({ rarity });

    	$$self.$inject_state = $$props => {
    		if ('rarity' in $$props) $$invalidate(0, rarity = $$props.rarity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [rarity];
    }

    class Glare extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { rarity: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Glare",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get rarity() {
    		throw new Error("<Glare>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rarity(value) {
    		throw new Error("<Glare>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/card/face/Holo.svelte generated by Svelte v3.52.0 */
    const file$9 = "src/card/face/Holo.svelte";

    function create_fragment$a(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "holo " + /*card*/ ctx[0].rarity + " svelte-14fc1or");
    			set_style(div, "background-image", "url('../img/HoloOverlays/" + /*card*/ ctx[0].number.toString().padStart(3, '0') + ".webp'), repeating-linear-gradient( -63deg, rgb(255, 119, 115) calc(var(--space) * 1), rgba(255, 237, 95, 1) calc(var(--space) * 2), rgba(168, 255, 95, 1) calc(var(--space) * 3), rgba(131, 255, 247, 1) calc(var(--space) * 4), rgba(120, 148, 255, 1) calc(var(--space) * 5), rgb(216, 117, 255) calc(var(--space) * 6), rgb(255, 119, 115) calc(var(--space) * 7) )");
    			add_location(div, file$9, 5, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Holo', slots, []);
    	const card = getCardContext();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Holo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getCardContext, card });
    	return [card];
    }

    class Holo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Holo",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const prefersReducedMotion = writable(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const prefersReducedLighting = writable(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const galleryWidth = writable(window.innerWidth);
    const cardDescriptionEnabled = writable(true);

    let checkedPermission = false;
    const hasPermission = writable(false);
    const getRawOrientation = function (e) {
        if (!e) {
            return { alpha: 0, beta: 0, gamma: 0 };
        }
        else {
            return { alpha: e.alpha, beta: e.beta, gamma: e.gamma };
        }
    };
    let firstReading = true;
    let baseOrientation = getRawOrientation();
    const getOrientationObject = (e) => {
        const orientation = getRawOrientation(e);
        return {
            absolute: orientation,
            relative: {
                alpha: orientation.alpha - baseOrientation.alpha,
                beta: orientation.beta - baseOrientation.beta,
                gamma: orientation.gamma - baseOrientation.gamma,
            },
        };
    };
    const resetBaseOrientation = () => {
        // console.log("Resetting Base Orientation");
        requestPermission();
        firstReading = true;
        baseOrientation = getRawOrientation();
    };
    const handleOrientation = (e, set) => {
        window.requestAnimationFrame(() => {
            if (firstReading) {
                firstReading = false;
                baseOrientation = getRawOrientation(e);
                // console.log("Starting Orientation from: ", baseOrientation );
            }
            const o = getOrientationObject(e);
            // console.log("Setting Orientation to: ", o );
            set(o);
        });
    };
    // TODO: Storing this here is probably bad practice
    let orientationSet;
    const orientation = readable(getOrientationObject(), (set) => {
        orientationSet = set;
        return function stop() {
            window.removeEventListener('deviceorientation', (e) => handleOrientation(e, set), true);
            // console.log('Stopping Orientation Tracking')
        };
    });
    const requestPermission = () => {
        // console.log('requesting perms')
        if (!checkedPermission) {
            const requestPermission = DeviceOrientationEvent.requestPermission;
            if (typeof requestPermission === 'function') {
                checkedPermission = true;
                requestPermission()
                    .then((response) => {
                    if (response == 'granted') {
                        hasPermission.set(true);
                        // console.log('Granted permission')
                    }
                })
                    .catch(console.error);
            }
            else {
                checkedPermission = true;
                // console.log('Granted permission')
                hasPermission.set(true);
            }
            if (hasPermission) {
                window.addEventListener('deviceorientation', (e) => handleOrientation(e, orientationSet), true);
            }
        }
    };
    const isSafari$1 = navigator.vendor &&
        navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') == -1 &&
        navigator.userAgent.indexOf('FxiOS') == -1;

    var isSafari =
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1;

    const r = 1 * (isSafari ? 1.4 : 1); /* width of outline in pixels */
    const n = Math.ceil(2 * Math.PI * r); /* number of shadows */
    const shadowList = [];
    for (let i = 0; i < n; i++ /* append shadows in n evenly distributed directions */) {
      const theta = ((2 * i) / n) * Math.PI;
      let x = r * Math.cos(theta);
      let y = r * Math.sin(theta);
      shadowList.push(`drop-shadow(${(x + 0.2).toFixed(4)}px ${(y + 0.2).toFixed(4)}px 0px var(--shadowColor))`);
    }
    const shadows = shadowList.join(' ');

    const styles = readable({ shadows });

    function fragment(node) {
      node.parentElement.appendChild(node.content);
      node.setAttribute('style', 'display: none;');

      return {
        destroy() {
          if (node && node.parentElement) {
            node.parentElement.removeChild(node.content);
          }
        },
      };
    }

    /* src/card/face/Title.svelte generated by Svelte v3.52.0 */
    const file$8 = "src/card/face/Title.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[6] = i;

    	const constants_0 = /*i*/ child_ctx[6] === 0
    	? /*localizedCard*/ child_ctx[0].nameParts.length === 1
    		? 0.455
    		: 0.3
    	: 0.7;

    	child_ctx[4] = constants_0;
    	return child_ctx;
    }

    // (13:2) {#if localizedCard}
    function create_if_block$6(ctx) {
    	let div;
    	let svg;
    	let g;
    	let t;
    	let header;
    	let span;
    	let raw_value = /*localizedCard*/ ctx[0].nameParts.join('<br />') + "";
    	let each_value = /*localizedCard*/ ctx[0].nameParts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			header = element("header");
    			span = element("span");
    			add_location(g, file$8, 19, 8, 657);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "class", "svelte-1p7mr5m");
    			add_location(svg, file$8, 18, 6, 616);
    			attr_dev(span, "class", "" + (null_to_empty(/*card*/ ctx[1].rarity) + " svelte-1p7mr5m"));
    			add_location(span, file$8, 31, 8, 1148);
    			attr_dev(header, "class", "svelte-1p7mr5m");
    			add_location(header, file$8, 30, 6, 1131);
    			attr_dev(div, "class", "header-wrapper svelte-1p7mr5m");
    			set_style(div, "--header-scale", Math.min(1, /*localizedCard*/ ctx[0].headerScale));
    			set_style(div, "--browserScale", isSafari$1 ? 1.1 : 1);
    			toggle_class(div, "singleLine", /*localizedCard*/ ctx[0].nameParts.length === 1);
    			add_location(div, file$8, 13, 4, 401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(div, t);
    			append_dev(div, header);
    			append_dev(header, span);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*localizedCard*/ 1) {
    				each_value = /*localizedCard*/ ctx[0].nameParts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*localizedCard*/ 1 && raw_value !== (raw_value = /*localizedCard*/ ctx[0].nameParts.join('<br />') + "")) span.innerHTML = raw_value;
    			if (dirty & /*localizedCard*/ 1) {
    				set_style(div, "--header-scale", Math.min(1, /*localizedCard*/ ctx[0].headerScale));
    			}

    			if (dirty & /*localizedCard*/ 1) {
    				toggle_class(div, "singleLine", /*localizedCard*/ ctx[0].nameParts.length === 1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(13:2) {#if localizedCard}",
    		ctx
    	});

    	return block;
    }

    // (21:10) {#each localizedCard.nameParts as part, i}
    function create_each_block$4(ctx) {
    	let text0;
    	let t0_value = /*part*/ ctx[3] + "";
    	let t0;
    	let text0_y_value;
    	let text1;
    	let t1_value = /*part*/ ctx[3] + "";
    	let t1;
    	let text1_y_value;

    	const block = {
    		c: function create() {
    			text0 = svg_element("text");
    			t0 = text(t0_value);
    			text1 = svg_element("text");
    			t1 = text(t1_value);
    			attr_dev(text0, "class", "stroke-small svelte-1p7mr5m");
    			attr_dev(text0, "x", "50%");
    			attr_dev(text0, "y", text0_y_value = "" + (100 * /*y*/ ctx[4] + "%"));
    			attr_dev(text0, "dominant-baseline", "central");
    			attr_dev(text0, "text-anchor", "middle");
    			add_location(text0, file$8, 22, 12, 820);
    			attr_dev(text1, "class", "stroke svelte-1p7mr5m");
    			attr_dev(text1, "x", "50%");
    			attr_dev(text1, "y", text1_y_value = "" + (100 * /*y*/ ctx[4] + "%"));
    			attr_dev(text1, "dominant-baseline", "central");
    			attr_dev(text1, "text-anchor", "middle");
    			add_location(text1, file$8, 25, 12, 973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text0, anchor);
    			append_dev(text0, t0);
    			insert_dev(target, text1, anchor);
    			append_dev(text1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*localizedCard*/ 1 && t0_value !== (t0_value = /*part*/ ctx[3] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*localizedCard*/ 1 && text0_y_value !== (text0_y_value = "" + (100 * /*y*/ ctx[4] + "%"))) {
    				attr_dev(text0, "y", text0_y_value);
    			}

    			if (dirty & /*localizedCard*/ 1 && t1_value !== (t1_value = /*part*/ ctx[3] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*localizedCard*/ 1 && text1_y_value !== (text1_y_value = "" + (100 * /*y*/ ctx[4] + "%"))) {
    				attr_dev(text1, "y", text1_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text0);
    			if (detaching) detach_dev(text1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(21:10) {#each localizedCard.nameParts as part, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let if_block = /*localizedCard*/ ctx[0] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*localizedCard*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let localizedCard;
    	let $cardNames;
    	validate_store(cardNames, 'cardNames');
    	component_subscribe($$self, cardNames, $$value => $$invalidate(2, $cardNames = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	const card = getCardContext();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getCardContext,
    		styles,
    		isSafari: isSafari$1,
    		cardNames,
    		fragment,
    		card,
    		localizedCard,
    		$cardNames
    	});

    	$$self.$inject_state = $$props => {
    		if ('localizedCard' in $$props) $$invalidate(0, localizedCard = $$props.localizedCard);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$cardNames*/ 4) {
    			$$invalidate(0, localizedCard = $cardNames[card.number]);
    		}
    	};

    	return [localizedCard, card, $cardNames];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/card/Card.svelte generated by Svelte v3.52.0 */
    const file$7 = "src/card/Card.svelte";

    // (124:6) {#if !loading}
    function create_if_block_1$5(ctx) {
    	let t;
    	let title;
    	let current;
    	let if_block = !/*$prefersReducedLighting*/ ctx[13] && create_if_block_2$3(ctx);
    	title = new Title({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(title.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(title, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*$prefersReducedLighting*/ ctx[13]) {
    				if (if_block) {
    					if (dirty[0] & /*$prefersReducedLighting*/ 8192) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(title.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(title.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(title, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(124:6) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (125:8) {#if !$prefersReducedLighting}
    function create_if_block_2$3(ctx) {
    	let holo;
    	let current;
    	holo = new Holo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(holo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(holo, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(holo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(holo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(holo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(125:8) {#if !$prefersReducedLighting}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#if !$prefersReducedLighting}
    function create_if_block$5(ctx) {
    	let glare;
    	let current;
    	glare = new Glare({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(glare.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(glare, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(glare.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(glare.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(glare, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(131:4) {#if !$prefersReducedLighting}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let card_1;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let div0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*loading*/ ctx[3] && create_if_block_1$5(ctx);
    	let if_block1 = !/*$prefersReducedLighting*/ ctx[13] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			card_1 = element("card");
    			div2 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			img1 = element("img");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(img0, "aria-hidden", "true");
    			attr_dev(img0, "class", "card_back svelte-ddroj");
    			if (!src_url_equal(img0.src, img0_src_value = "./img/UI/CardBack.webp")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "loading", "lazy");
    			add_location(img0, file$7, 110, 4, 2964);
    			attr_dev(img1, "class", "rarity_back svelte-ddroj");
    			attr_dev(img1, "loading", "lazy");
    			if (!src_url_equal(img1.src, img1_src_value = /*card_front_background*/ ctx[16])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "aria-hidden", "true");
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$7, 114, 8, 3162);
    			add_location(div0, file$7, 112, 6, 3095);
    			attr_dev(div1, "class", "card_front svelte-ddroj");
    			add_location(div1, file$7, 111, 4, 3064);
    			attr_dev(div2, "class", "tilt svelte-ddroj");
    			set_style(div2, "--mx", /*mx*/ ctx[7] + "px");
    			set_style(div2, "--my", /*my*/ ctx[8] + "px");
    			set_style(div2, "transform", "rotateX(" + /*x*/ ctx[5] + "deg) rotateY(" + /*y*/ ctx[6] + "deg)");
    			set_style(div2, "--posx", /*posx*/ ctx[9] + "%");
    			set_style(div2, "--posy", /*posy*/ ctx[10] + "%");
    			set_style(div2, "--o", /*o*/ ctx[11]);
    			add_location(div2, file$7, 105, 2, 2787);
    			attr_dev(card_1, "style", /*style*/ ctx[0]);
    			attr_dev(card_1, "aria-label", "" + (/*card*/ ctx[14].name + " by " + /*card*/ ctx[14].artist));
    			attr_dev(card_1, "id", "card_" + /*card*/ ctx[14].number);
    			attr_dev(card_1, "class", "svelte-ddroj");
    			toggle_class(card_1, "active", /*active*/ ctx[2]);
    			toggle_class(card_1, "pagebreak", /*pagebreak*/ ctx[1]);
    			toggle_class(card_1, "prefersReducedLighting", /*$prefersReducedLighting*/ ctx[13]);
    			add_location(card_1, file$7, 92, 0, 2484);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, card_1, anchor);
    			append_dev(card_1, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img1);
    			append_dev(div1, t1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div2, t2);
    			if (if_block1) if_block1.m(div2, null);
    			/*div2_binding*/ ctx[24](div2);
    			/*card_1_binding*/ ctx[25](card_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(img1, "load", /*imageLoader*/ ctx[15], false, false, false),
    					listen_dev(card_1, "click", /*onClick*/ ctx[18], false, false, false),
    					listen_dev(card_1, "keydown", keydown_handler, false, false, false),
    					listen_dev(card_1, "mousemove", /*onMouseMove*/ ctx[17], false, false, false),
    					listen_dev(card_1, "mouseleave", /*onMouseLeave*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!/*loading*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*loading*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*$prefersReducedLighting*/ ctx[13]) {
    				if (if_block1) {
    					if (dirty[0] & /*$prefersReducedLighting*/ 8192) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*mx*/ 128) {
    				set_style(div2, "--mx", /*mx*/ ctx[7] + "px");
    			}

    			if (!current || dirty[0] & /*my*/ 256) {
    				set_style(div2, "--my", /*my*/ ctx[8] + "px");
    			}

    			if (!current || dirty[0] & /*x, y*/ 96) {
    				set_style(div2, "transform", "rotateX(" + /*x*/ ctx[5] + "deg) rotateY(" + /*y*/ ctx[6] + "deg)");
    			}

    			if (!current || dirty[0] & /*posx*/ 512) {
    				set_style(div2, "--posx", /*posx*/ ctx[9] + "%");
    			}

    			if (!current || dirty[0] & /*posy*/ 1024) {
    				set_style(div2, "--posy", /*posy*/ ctx[10] + "%");
    			}

    			if (!current || dirty[0] & /*o*/ 2048) {
    				set_style(div2, "--o", /*o*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*style*/ 1) {
    				attr_dev(card_1, "style", /*style*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*active*/ 4) {
    				toggle_class(card_1, "active", /*active*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*pagebreak*/ 2) {
    				toggle_class(card_1, "pagebreak", /*pagebreak*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*$prefersReducedLighting*/ 8192) {
    				toggle_class(card_1, "prefersReducedLighting", /*$prefersReducedLighting*/ ctx[13]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(card_1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*div2_binding*/ ctx[24](null);
    			/*card_1_binding*/ ctx[25](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const multiple = 10;

    const keydown_handler = () => {
    	
    };

    function instance$8($$self, $$props, $$invalidate) {
    	let active;
    	let proxyOrientation;
    	let $prefersReducedLighting;
    	let $prefersReducedMotion;
    	let $orientation;
    	let $activeCardNumber;
    	validate_store(prefersReducedLighting, 'prefersReducedLighting');
    	component_subscribe($$self, prefersReducedLighting, $$value => $$invalidate(13, $prefersReducedLighting = $$value));
    	validate_store(prefersReducedMotion, 'prefersReducedMotion');
    	component_subscribe($$self, prefersReducedMotion, $$value => $$invalidate(27, $prefersReducedMotion = $$value));
    	validate_store(orientation, 'orientation');
    	component_subscribe($$self, orientation, $$value => $$invalidate(22, $orientation = $$value));
    	validate_store(activeCardNumber, 'activeCardNumber');
    	component_subscribe($$self, activeCardNumber, $$value => $$invalidate(23, $activeCardNumber = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	const card = getCardContext();
    	let { style } = $$props;
    	let { pagebreak = false } = $$props;
    	let { animate = true } = $$props;
    	let loading = true;

    	const imageLoader = e => {
    		$$invalidate(3, loading = false);
    	};

    	let card_front_background = './img/Merged/' + card.number.toString().padStart(3, '0') + '.webp';
    	let img_base = card.img.startsWith('http') ? '' : './img/';
    	let front_img = '';
    	front_img = img_base + card.img;
    	let tiltBox;
    	let x;
    	let y;
    	let mx;
    	let my;
    	let posx = 50;
    	let posy = 50;
    	let o = 0;
    	const clamp = (num, min = -20, max = 20) => Math.min(Math.max(num, min), max);

    	const orientate = e => {
    		const xDeg = e.relative.beta;
    		const yDeg = e.relative.gamma;
    		const max = { x: 16, y: 23 };
    		$$invalidate(5, x = clamp(xDeg, -max.x, max.x));
    		$$invalidate(6, y = clamp(yDeg, -max.y, max.y));
    		$$invalidate(9, posx = xDeg / max.x * 10 + 50);
    		$$invalidate(10, posy = yDeg / max.y * 10 + 50);
    	};

    	function transformElement(mouseX, mouseY) {
    		let box = tiltBox.getBoundingClientRect();

    		if (!$prefersReducedMotion) {
    			$$invalidate(5, x = (mouseY - box.y - box.height / 2) / multiple);
    			$$invalidate(6, y = -(mouseX - box.x - box.width / 2) / multiple);
    		}

    		if (!$prefersReducedLighting) {
    			$$invalidate(7, mx = mouseX - box.x);
    			$$invalidate(8, my = mouseY - box.y);
    			$$invalidate(9, posx = 100 * (mx / box.width));
    			$$invalidate(10, posy = 100 * (my / box.height));
    			$$invalidate(11, o = 1);
    		}
    	}

    	const onMouseMove = e => {
    		if (animate) {
    			window.requestAnimationFrame(function () {
    				transformElement(e.clientX, e.clientY);
    			});
    		}
    	};

    	const onClick = e => {
    		if (active) {
    			activeCardNumber.set(undefined);
    		} else {
    			activeCardNumber.set(card.number);
    		}

    		resetBaseOrientation();
    	};

    	const onMouseLeave = e => {
    		window.requestAnimationFrame(function () {
    			$$invalidate(5, x = 0);
    			$$invalidate(6, y = 0);
    			$$invalidate(9, posx = 50);
    			$$invalidate(10, posy = 50);
    		});

    		$$invalidate(11, o = 0);
    	}; // active = false

    	let ref;

    	$$self.$$.on_mount.push(function () {
    		if (style === undefined && !('style' in $$props || $$self.$$.bound[$$self.$$.props['style']])) {
    			console.warn("<Card> was created without expected prop 'style'");
    		}
    	});

    	const writable_props = ['style', 'pagebreak', 'animate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tiltBox = $$value;
    			$$invalidate(4, tiltBox);
    		});
    	}

    	function card_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(12, ref);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('pagebreak' in $$props) $$invalidate(1, pagebreak = $$props.pagebreak);
    		if ('animate' in $$props) $$invalidate(20, animate = $$props.animate);
    	};

    	$$self.$capture_state = () => ({
    		getCardContext,
    		Glare,
    		Holo,
    		prefersReducedMotion,
    		prefersReducedLighting,
    		orientation,
    		resetBaseOrientation,
    		activeCardNumber,
    		Title,
    		card,
    		style,
    		pagebreak,
    		animate,
    		loading,
    		imageLoader,
    		card_front_background,
    		img_base,
    		front_img,
    		multiple,
    		tiltBox,
    		x,
    		y,
    		mx,
    		my,
    		posx,
    		posy,
    		o,
    		clamp,
    		orientate,
    		transformElement,
    		onMouseMove,
    		onClick,
    		onMouseLeave,
    		ref,
    		active,
    		proxyOrientation,
    		$prefersReducedLighting,
    		$prefersReducedMotion,
    		$orientation,
    		$activeCardNumber
    	});

    	$$self.$inject_state = $$props => {
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('pagebreak' in $$props) $$invalidate(1, pagebreak = $$props.pagebreak);
    		if ('animate' in $$props) $$invalidate(20, animate = $$props.animate);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    		if ('card_front_background' in $$props) $$invalidate(16, card_front_background = $$props.card_front_background);
    		if ('img_base' in $$props) img_base = $$props.img_base;
    		if ('front_img' in $$props) front_img = $$props.front_img;
    		if ('tiltBox' in $$props) $$invalidate(4, tiltBox = $$props.tiltBox);
    		if ('x' in $$props) $$invalidate(5, x = $$props.x);
    		if ('y' in $$props) $$invalidate(6, y = $$props.y);
    		if ('mx' in $$props) $$invalidate(7, mx = $$props.mx);
    		if ('my' in $$props) $$invalidate(8, my = $$props.my);
    		if ('posx' in $$props) $$invalidate(9, posx = $$props.posx);
    		if ('posy' in $$props) $$invalidate(10, posy = $$props.posy);
    		if ('o' in $$props) $$invalidate(11, o = $$props.o);
    		if ('ref' in $$props) $$invalidate(12, ref = $$props.ref);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('proxyOrientation' in $$props) $$invalidate(21, proxyOrientation = $$props.proxyOrientation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$activeCardNumber*/ 8388608) {
    			$$invalidate(2, active = $activeCardNumber === card.number);
    		}

    		if ($$self.$$.dirty[0] & /*active*/ 4) {
    			{
    				if (active) {
    					$$invalidate(11, o = 1);
    				} else {
    					$$invalidate(11, o = 0);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*active*/ 4) {
    			$$invalidate(21, proxyOrientation = active ? orientation : null);
    		}

    		if ($$self.$$.dirty[0] & /*proxyOrientation, $orientation*/ 6291456) {
    			proxyOrientation && orientate($orientation);
    		}
    	};

    	return [
    		style,
    		pagebreak,
    		active,
    		loading,
    		tiltBox,
    		x,
    		y,
    		mx,
    		my,
    		posx,
    		posy,
    		o,
    		ref,
    		$prefersReducedLighting,
    		card,
    		imageLoader,
    		card_front_background,
    		onMouseMove,
    		onClick,
    		onMouseLeave,
    		animate,
    		proxyOrientation,
    		$orientation,
    		$activeCardNumber,
    		div2_binding,
    		card_1_binding
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { style: 0, pagebreak: 1, animate: 20 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get style() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pagebreak() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pagebreak(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animate() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animate(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/card/Context.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1$1 } = globals;

    function create_fragment$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Context', slots, ['default']);
    	let { cardDetails } = $$props;

    	setContext('card', Object.assign(Object.assign({}, cardDetails), {
    		name: cardDetails.nameParts.join(' '),
    		points: cardDetails.grid.join('').match(/[XS]/g).length
    	}));

    	$$self.$$.on_mount.push(function () {
    		if (cardDetails === undefined && !('cardDetails' in $$props || $$self.$$.bound[$$self.$$.props['cardDetails']])) {
    			console.warn("<Context> was created without expected prop 'cardDetails'");
    		}
    	});

    	const writable_props = ['cardDetails'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Context> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cardDetails' in $$props) $$invalidate(0, cardDetails = $$props.cardDetails);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext, cardDetails });

    	$$self.$inject_state = $$props => {
    		if ('cardDetails' in $$props) $$invalidate(0, cardDetails = $$props.cardDetails);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cardDetails, $$scope, slots];
    }

    class Context extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { cardDetails: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Context",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get cardDetails() {
    		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cardDetails(value) {
    		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const FeatureTypeFilterOptions = [
        {
            Weapons: [
                'Shooter',
                'Blaster',
                'Roller',
                'Brush',
                'Charger',
                'Bucket',
                'Splatling',
                'Dualie',
                'Brella',
                'Stringer',
                'Splatana',
            ],
        },
        'Sub',
        'Special',
        'NPC',
        'Brand',
        'Octarian Army',
        'Salmonid',
        'Key Item',
    ];

    /* src/GalleryFilters.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1 } = globals;
    const file$6 = "src/GalleryFilters.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (21:2) {#if panelOpen}
    function create_if_block$4(ctx) {
    	let div13;
    	let div2;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let div6;
    	let div3;
    	let label2;
    	let t7;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t12;
    	let div5;
    	let label3;
    	let t14;
    	let div4;
    	let select1;
    	let option4;
    	let t16;
    	let div9;
    	let div7;
    	let label4;
    	let t18;
    	let input2;
    	let t19;
    	let div8;
    	let input3;
    	let t20;
    	let label5;
    	let t22;
    	let div12;
    	let div10;
    	let input4;
    	let t23;
    	let label6;
    	let t25;
    	let div11;
    	let input5;
    	let t26;
    	let label7;
    	let mounted;
    	let dispose;
    	let each_value = FeatureTypeFilterOptions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Search by card name";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Search by artist";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div6 = element("div");
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "Season";
    			t7 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "All";
    			option1 = element("option");
    			option1.textContent = "Drizzle Season 2022";
    			option2 = element("option");
    			option2.textContent = "Chill Season 2022";
    			option3 = element("option");
    			option3.textContent = "Fresh Season 2023";
    			t12 = space();
    			div5 = element("div");
    			label3 = element("label");
    			label3.textContent = "Card Type";
    			t14 = space();
    			div4 = element("div");
    			select1 = element("select");
    			option4 = element("option");
    			option4.textContent = "All";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			div9 = element("div");
    			div7 = element("div");
    			label4 = element("label");
    			label4.textContent = "Zoom";
    			t18 = space();
    			input2 = element("input");
    			t19 = space();
    			div8 = element("div");
    			input3 = element("input");
    			t20 = space();
    			label5 = element("label");
    			label5.textContent = "Show card descriptions";
    			t22 = space();
    			div12 = element("div");
    			div10 = element("div");
    			input4 = element("input");
    			t23 = space();
    			label6 = element("label");
    			label6.textContent = "Disable Card Motion";
    			t25 = space();
    			div11 = element("div");
    			input5 = element("input");
    			t26 = space();
    			label7 = element("label");
    			label7.textContent = "Disable Lighting Effects";
    			attr_dev(label0, "for", "cardSearch");
    			add_location(label0, file$6, 24, 10, 845);
    			attr_dev(input0, "id", "cardSearch");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-1alf5n1");
    			add_location(input0, file$6, 25, 10, 907);
    			attr_dev(div0, "class", "display-option-row svelte-1alf5n1");
    			add_location(div0, file$6, 23, 8, 802);
    			attr_dev(label1, "for", "artistSearch");
    			add_location(label1, file$6, 28, 10, 1036);
    			attr_dev(input1, "id", "artistSearch");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "svelte-1alf5n1");
    			add_location(input1, file$6, 29, 10, 1097);
    			attr_dev(div1, "class", "display-option-row svelte-1alf5n1");
    			add_location(div1, file$6, 27, 8, 993);
    			attr_dev(div2, "class", "search-group svelte-1alf5n1");
    			add_location(div2, file$6, 22, 6, 767);
    			attr_dev(label2, "for", "season");
    			add_location(label2, file$6, 34, 10, 1270);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$6, 36, 12, 1369);
    			option1.__value = "1";
    			option1.value = option1.__value;
    			add_location(option1, file$6, 37, 12, 1411);
    			option2.__value = "2";
    			option2.value = option2.__value;
    			add_location(option2, file$6, 38, 12, 1470);
    			option3.__value = "3";
    			option3.value = option3.__value;
    			add_location(option3, file$6, 39, 12, 1527);
    			attr_dev(select0, "id", "season");
    			attr_dev(select0, "class", "svelte-1alf5n1");
    			if (/*$season*/ ctx[5] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[13].call(select0));
    			add_location(select0, file$6, 35, 10, 1315);
    			attr_dev(div3, "class", "display-option-row svelte-1alf5n1");
    			add_location(div3, file$6, 33, 8, 1227);
    			attr_dev(label3, "for", "featureTypeSelect");
    			add_location(label3, file$6, 43, 10, 1658);
    			option4.__value = "All";
    			option4.value = option4.__value;
    			add_location(option4, file$6, 46, 14, 1835);
    			attr_dev(select1, "class", "svelte-1alf5n1");
    			if (/*$displayFilter*/ ctx[6] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
    			add_location(select1, file$6, 45, 12, 1784);
    			attr_dev(div4, "id", "featureTypeSelect");
    			attr_dev(div4, "class", "featureTypeSelect");
    			add_location(div4, file$6, 44, 10, 1717);
    			attr_dev(div5, "class", "display-option-row svelte-1alf5n1");
    			add_location(div5, file$6, 42, 8, 1615);
    			attr_dev(div6, "class", "filter-group svelte-1alf5n1");
    			add_location(div6, file$6, 32, 6, 1192);
    			attr_dev(label4, "for", "zoom");
    			add_location(label4, file$6, 66, 10, 2596);
    			attr_dev(input2, "id", "zoom");
    			attr_dev(input2, "type", "range");
    			attr_dev(input2, "min", ".25");
    			attr_dev(input2, "max", "1");
    			attr_dev(input2, "step", "0.05");
    			attr_dev(input2, "class", "svelte-1alf5n1");
    			add_location(input2, file$6, 67, 10, 2637);
    			attr_dev(div7, "class", "display-option-row svelte-1alf5n1");
    			add_location(div7, file$6, 65, 8, 2553);
    			attr_dev(input3, "id", "showDescriptions");
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "class", "svelte-1alf5n1");
    			add_location(input3, file$6, 70, 10, 2789);
    			attr_dev(label5, "for", "showDescriptions");
    			add_location(label5, file$6, 71, 10, 2886);
    			attr_dev(div8, "class", "display-option-row svelte-1alf5n1");
    			add_location(div8, file$6, 69, 8, 2746);
    			attr_dev(div9, "class", "view-group svelte-1alf5n1");
    			add_location(div9, file$6, 64, 6, 2520);
    			attr_dev(input4, "id", "disableMotion");
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "class", "svelte-1alf5n1");
    			add_location(input4, file$6, 76, 10, 3066);
    			attr_dev(label6, "for", "disableMotion");
    			add_location(label6, file$6, 77, 10, 3158);
    			attr_dev(div10, "class", "display-option-row svelte-1alf5n1");
    			add_location(div10, file$6, 75, 8, 3023);
    			attr_dev(input5, "id", "disableLighting");
    			attr_dev(input5, "type", "checkbox");
    			attr_dev(input5, "class", "svelte-1alf5n1");
    			add_location(input5, file$6, 80, 10, 3279);
    			attr_dev(label7, "for", "disableLighting");
    			add_location(label7, file$6, 81, 10, 3375);
    			attr_dev(div11, "class", "display-option-row svelte-1alf5n1");
    			add_location(div11, file$6, 79, 8, 3236);
    			attr_dev(div12, "class", "accessibility-group svelte-1alf5n1");
    			add_location(div12, file$6, 74, 6, 2981);
    			attr_dev(div13, "class", "options svelte-1alf5n1");
    			add_location(div13, file$6, 21, 4, 739);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div2);
    			append_dev(div2, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*$searchCard*/ ctx[3]);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*$search*/ ctx[4]);
    			append_dev(div13, t5);
    			append_dev(div13, div6);
    			append_dev(div6, div3);
    			append_dev(div3, label2);
    			append_dev(div3, t7);
    			append_dev(div3, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			select_option(select0, /*$season*/ ctx[5]);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div5, label3);
    			append_dev(div5, t14);
    			append_dev(div5, div4);
    			append_dev(div4, select1);
    			append_dev(select1, option4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*$displayFilter*/ ctx[6]);
    			append_dev(div13, t16);
    			append_dev(div13, div9);
    			append_dev(div9, div7);
    			append_dev(div7, label4);
    			append_dev(div7, t18);
    			append_dev(div7, input2);
    			set_input_value(input2, /*userScale*/ ctx[0]);
    			append_dev(div9, t19);
    			append_dev(div9, div8);
    			append_dev(div8, input3);
    			input3.checked = /*$cardDescriptionEnabled*/ ctx[7];
    			append_dev(div8, t20);
    			append_dev(div8, label5);
    			append_dev(div13, t22);
    			append_dev(div13, div12);
    			append_dev(div12, div10);
    			append_dev(div10, input4);
    			input4.checked = /*$prefersReducedMotion*/ ctx[8];
    			append_dev(div10, t23);
    			append_dev(div10, label6);
    			append_dev(div12, t25);
    			append_dev(div12, div11);
    			append_dev(div11, input5);
    			input5.checked = /*$prefersReducedLighting*/ ctx[9];
    			append_dev(div11, t26);
    			append_dev(div11, label7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[13]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[14]),
    					listen_dev(input2, "change", /*input2_change_input_handler*/ ctx[15]),
    					listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[15]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[16]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[17]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[18])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$searchCard*/ 8 && input0.value !== /*$searchCard*/ ctx[3]) {
    				set_input_value(input0, /*$searchCard*/ ctx[3]);
    			}

    			if (dirty & /*$search*/ 16 && input1.value !== /*$search*/ ctx[4]) {
    				set_input_value(input1, /*$search*/ ctx[4]);
    			}

    			if (dirty & /*$season*/ 32) {
    				select_option(select0, /*$season*/ ctx[5]);
    			}

    			if (dirty & /*FeatureTypeFilterOptions, Object*/ 0) {
    				each_value = FeatureTypeFilterOptions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$displayFilter, FeatureTypeFilterOptions, Object*/ 64) {
    				select_option(select1, /*$displayFilter*/ ctx[6]);
    			}

    			if (dirty & /*userScale*/ 1) {
    				set_input_value(input2, /*userScale*/ ctx[0]);
    			}

    			if (dirty & /*$cardDescriptionEnabled*/ 128) {
    				input3.checked = /*$cardDescriptionEnabled*/ ctx[7];
    			}

    			if (dirty & /*$prefersReducedMotion*/ 256) {
    				input4.checked = /*$prefersReducedMotion*/ ctx[8];
    			}

    			if (dirty & /*$prefersReducedLighting*/ 512) {
    				input5.checked = /*$prefersReducedLighting*/ ctx[9];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(21:2) {#if panelOpen}",
    		ctx
    	});

    	return block;
    }

    // (51:16) {:else}
    function create_else_block$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Object.keys(/*featureType*/ ctx[19]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*FeatureTypeFilterOptions, Object*/ 0) {
    				each_value_1 = Object.keys(/*featureType*/ ctx[19]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(51:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:16) {#if typeof featureType === 'string'}
    function create_if_block_1$4(ctx) {
    	let option;
    	let t_value = /*featureType*/ ctx[19] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*featureType*/ ctx[19];
    			option.value = option.__value;
    			add_location(option, file$6, 49, 18, 2002);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(49:16) {#if typeof featureType === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (54:20) {#each featureType[key] as subType}
    function create_each_block_2$1(ctx) {
    	let option;
    	let t_value = /*subType*/ ctx[25] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*subType*/ ctx[25];
    			option.value = option.__value;
    			add_location(option, file$6, 54, 22, 2265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(54:20) {#each featureType[key] as subType}",
    		ctx
    	});

    	return block;
    }

    // (52:18) {#each Object.keys(featureType) as key}
    function create_each_block_1$1(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*featureType*/ ctx[19][/*key*/ ctx[22]];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*FeatureTypeFilterOptions, Object*/ 0) {
    				each_value_2 = /*featureType*/ ctx[19][/*key*/ ctx[22]];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(52:18) {#each Object.keys(featureType) as key}",
    		ctx
    	});

    	return block;
    }

    // (48:14) {#each FeatureTypeFilterOptions as featureType}
    function create_each_block$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*featureType*/ ctx[19] === 'string') return create_if_block_1$4;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(48:14) {#each FeatureTypeFilterOptions as featureType}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*panelOpen*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Jump to a random card!";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Search, Filter and Display Options";
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(button0, "class", "svelte-1alf5n1");
    			add_location(button0, file$6, 16, 4, 525);
    			attr_dev(button1, "class", "svelte-1alf5n1");
    			toggle_class(button1, "panelOpen", /*panelOpen*/ ctx[2]);
    			add_location(button1, file$6, 17, 4, 597);
    			add_location(div, file$6, 15, 2, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*scrollToRandom*/ ctx[1])) /*scrollToRandom*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(button1, "click", /*click_handler*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*panelOpen*/ 4) {
    				toggle_class(button1, "panelOpen", /*panelOpen*/ ctx[2]);
    			}

    			if (/*panelOpen*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function isFeatureType(featureType) {
    	return typeof featureType === 'string';
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $searchCard;
    	let $search;
    	let $season;
    	let $displayFilter;
    	let $cardDescriptionEnabled;
    	let $prefersReducedMotion;
    	let $prefersReducedLighting;
    	validate_store(searchCard, 'searchCard');
    	component_subscribe($$self, searchCard, $$value => $$invalidate(3, $searchCard = $$value));
    	validate_store(search, 'search');
    	component_subscribe($$self, search, $$value => $$invalidate(4, $search = $$value));
    	validate_store(season, 'season');
    	component_subscribe($$self, season, $$value => $$invalidate(5, $season = $$value));
    	validate_store(displayFilter, 'displayFilter');
    	component_subscribe($$self, displayFilter, $$value => $$invalidate(6, $displayFilter = $$value));
    	validate_store(cardDescriptionEnabled, 'cardDescriptionEnabled');
    	component_subscribe($$self, cardDescriptionEnabled, $$value => $$invalidate(7, $cardDescriptionEnabled = $$value));
    	validate_store(prefersReducedMotion, 'prefersReducedMotion');
    	component_subscribe($$self, prefersReducedMotion, $$value => $$invalidate(8, $prefersReducedMotion = $$value));
    	validate_store(prefersReducedLighting, 'prefersReducedLighting');
    	component_subscribe($$self, prefersReducedLighting, $$value => $$invalidate(9, $prefersReducedLighting = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GalleryFilters', slots, []);
    	let { userScale } = $$props;
    	let { scrollToRandom } = $$props;
    	let panelOpen = false;

    	$$self.$$.on_mount.push(function () {
    		if (userScale === undefined && !('userScale' in $$props || $$self.$$.bound[$$self.$$.props['userScale']])) {
    			console.warn("<GalleryFilters> was created without expected prop 'userScale'");
    		}

    		if (scrollToRandom === undefined && !('scrollToRandom' in $$props || $$self.$$.bound[$$self.$$.props['scrollToRandom']])) {
    			console.warn("<GalleryFilters> was created without expected prop 'scrollToRandom'");
    		}
    	});

    	const writable_props = ['userScale', 'scrollToRandom'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GalleryFilters> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, panelOpen = !panelOpen);

    	function input0_input_handler() {
    		$searchCard = this.value;
    		searchCard.set($searchCard);
    	}

    	function input1_input_handler() {
    		$search = this.value;
    		search.set($search);
    	}

    	function select0_change_handler() {
    		$season = select_value(this);
    		season.set($season);
    	}

    	function select1_change_handler() {
    		$displayFilter = select_value(this);
    		displayFilter.set($displayFilter);
    	}

    	function input2_change_input_handler() {
    		userScale = to_number(this.value);
    		$$invalidate(0, userScale);
    	}

    	function input3_change_handler() {
    		$cardDescriptionEnabled = this.checked;
    		cardDescriptionEnabled.set($cardDescriptionEnabled);
    	}

    	function input4_change_handler() {
    		$prefersReducedMotion = this.checked;
    		prefersReducedMotion.set($prefersReducedMotion);
    	}

    	function input5_change_handler() {
    		$prefersReducedLighting = this.checked;
    		prefersReducedLighting.set($prefersReducedLighting);
    	}

    	$$self.$$set = $$props => {
    		if ('userScale' in $$props) $$invalidate(0, userScale = $$props.userScale);
    		if ('scrollToRandom' in $$props) $$invalidate(1, scrollToRandom = $$props.scrollToRandom);
    	};

    	$$self.$capture_state = () => ({
    		displayFilter,
    		searchCard,
    		search,
    		season,
    		FeatureTypeFilterOptions,
    		prefersReducedMotion,
    		prefersReducedLighting,
    		cardDescriptionEnabled,
    		userScale,
    		scrollToRandom,
    		panelOpen,
    		isFeatureType,
    		$searchCard,
    		$search,
    		$season,
    		$displayFilter,
    		$cardDescriptionEnabled,
    		$prefersReducedMotion,
    		$prefersReducedLighting
    	});

    	$$self.$inject_state = $$props => {
    		if ('userScale' in $$props) $$invalidate(0, userScale = $$props.userScale);
    		if ('scrollToRandom' in $$props) $$invalidate(1, scrollToRandom = $$props.scrollToRandom);
    		if ('panelOpen' in $$props) $$invalidate(2, panelOpen = $$props.panelOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		userScale,
    		scrollToRandom,
    		panelOpen,
    		$searchCard,
    		$search,
    		$season,
    		$displayFilter,
    		$cardDescriptionEnabled,
    		$prefersReducedMotion,
    		$prefersReducedLighting,
    		click_handler,
    		input0_input_handler,
    		input1_input_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input2_change_input_handler,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler
    	];
    }

    class GalleryFilters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { userScale: 0, scrollToRandom: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GalleryFilters",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get userScale() {
    		throw new Error("<GalleryFilters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userScale(value) {
    		throw new Error("<GalleryFilters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToRandom() {
    		throw new Error("<GalleryFilters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollToRandom(value) {
    		throw new Error("<GalleryFilters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/card/Gallery.svelte generated by Svelte v3.52.0 */

    const { window: window_1 } = globals;
    const file$5 = "src/card/Gallery.svelte";

    // (1:0) <script lang="ts">import { onMount }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (49:2) {:then}
    function create_then_block(ctx) {
    	let nav;
    	let h2;
    	let t1;
    	let galleryfilters;
    	let updating_userScale;
    	let t2;
    	let div1;
    	let div0;
    	let previous_key = /*$filteredCards*/ ctx[6];
    	let div0_resize_listener;
    	let div1_resize_listener;
    	let current;

    	function galleryfilters_userScale_binding(value) {
    		/*galleryfilters_userScale_binding*/ ctx[16](value);
    	}

    	let galleryfilters_props = { scrollToRandom: /*func*/ ctx[15] };

    	if (/*userScale*/ ctx[1] !== void 0) {
    		galleryfilters_props.userScale = /*userScale*/ ctx[1];
    	}

    	galleryfilters = new GalleryFilters({
    			props: galleryfilters_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(galleryfilters, 'userScale', galleryfilters_userScale_binding));
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			h2 = element("h2");
    			h2.textContent = "Card Gallery";
    			t1 = space();
    			create_component(galleryfilters.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			div0 = element("div");
    			key_block.c();
    			attr_dev(h2, "id", "gallery");
    			attr_dev(h2, "class", "svelte-ucilti");
    			add_location(h2, file$5, 50, 6, 1884);
    			attr_dev(nav, "class", "svelte-ucilti");
    			add_location(nav, file$5, 49, 4, 1872);
    			attr_dev(div0, "class", "grid-wrapper-inner svelte-ucilti");

    			set_style(div0, "--width", /*cardWidth*/ ctx[11]
    			? /*cardWidth*/ ctx[11] * /*scale*/ ctx[4] * /*userScale*/ ctx[1] * /*gridFitColumns*/ ctx[3] + 20 + 'px'
    			: '100%');

    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[18].call(div0));
    			add_location(div0, file$5, 62, 6, 2324);
    			attr_dev(div1, "class", "grid-wrapper svelte-ucilti");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[19].call(div1));
    			add_location(div1, file$5, 61, 4, 2255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, h2);
    			append_dev(nav, t1);
    			mount_component(galleryfilters, nav, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			key_block.m(div0, null);
    			div0_resize_listener = add_resize_listener(div0, /*div0_elementresize_handler*/ ctx[18].bind(div0));
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[19].bind(div1));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const galleryfilters_changes = {};
    			if (dirty & /*$filteredCards, $scrollToIndex, $prefersReducedMotion*/ 448) galleryfilters_changes.scrollToRandom = /*func*/ ctx[15];

    			if (!updating_userScale && dirty & /*userScale*/ 2) {
    				updating_userScale = true;
    				galleryfilters_changes.userScale = /*userScale*/ ctx[1];
    				add_flush_callback(() => updating_userScale = false);
    			}

    			galleryfilters.$set(galleryfilters_changes);

    			if (dirty & /*$filteredCards*/ 64 && safe_not_equal(previous_key, previous_key = /*$filteredCards*/ ctx[6])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(div0, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (!current || dirty & /*scale, userScale, gridFitColumns*/ 26) {
    				set_style(div0, "--width", /*cardWidth*/ ctx[11]
    				? /*cardWidth*/ ctx[11] * /*scale*/ ctx[4] * /*userScale*/ ctx[1] * /*gridFitColumns*/ ctx[3] + 20 + 'px'
    				: '100%');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(galleryfilters.$$.fragment, local);
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(galleryfilters.$$.fragment, local);
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(galleryfilters);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			key_block.d(detaching);
    			div0_resize_listener();
    			div1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(49:2) {:then}",
    		ctx
    	});

    	return block;
    }

    // (82:48) 
    function create_if_block_1$3(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Click on a card for artist links and notes!";
    			add_location(p, file$5, 82, 16, 3233);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(82:48) ",
    		ctx
    	});

    	return block;
    }

    // (79:14) {#if $filteredCards.length === 0}
    function create_if_block$3(ctx) {
    	let p;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No cards found. Maybe we haven't yet illustrated what you're looking for.";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Clear filters";
    			add_location(p, file$5, 79, 16, 3016);
    			add_location(button, file$5, 80, 16, 3113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", resetFilters, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(79:14) {#if $filteredCards.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (78:12) 
    function create_header_slot(ctx) {
    	let header;

    	function select_block_type(ctx, dirty) {
    		if (/*$filteredCards*/ ctx[6].length === 0) return create_if_block$3;
    		if (/*$cardDescriptionEnabled*/ ctx[10]) return create_if_block_1$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			if (if_block) if_block.c();
    			attr_dev(header, "slot", "header");
    			add_location(header, file$5, 77, 12, 2929);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			if (if_block) if_block.m(header, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(header, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(78:12) ",
    		ctx
    	});

    	return block;
    }

    // (86:12) 
    function create_placeholder_slot(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", "card_back svelte-ucilti");
    			if (!src_url_equal(img.src, img_src_value = "./img/UI/CardBack.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "aria-hidden", "true");
    			add_location(img, file$5, 86, 14, 3395);
    			attr_dev(div, "slot", "placeholder");
    			attr_dev(div, "style", div_style_value = /*style*/ ctx[25]);
    			add_location(div, file$5, 85, 12, 3338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*style*/ 33554432 && div_style_value !== (div_style_value = /*style*/ ctx[25])) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_placeholder_slot.name,
    		type: "slot",
    		source: "(86:12) ",
    		ctx
    	});

    	return block;
    }

    // (89:12) <CardContext slot="item" let:style let:index cardDetails={$filteredCards[index]}>
    function create_default_slot$1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: { style: /*style*/ ctx[25] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*style*/ 33554432) card_changes.style = /*style*/ ctx[25];
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(89:12) <CardContext slot=\\\"item\\\" let:style let:index cardDetails={$filteredCards[index]}>",
    		ctx
    	});

    	return block;
    }

    // (89:12) 
    function create_item_slot(ctx) {
    	let cardcontext;
    	let current;

    	cardcontext = new Context({
    			props: {
    				slot: "item",
    				cardDetails: /*$filteredCards*/ ctx[6][/*index*/ ctx[24]],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardcontext.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardcontext, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardcontext_changes = {};
    			if (dirty & /*$filteredCards, index*/ 16777280) cardcontext_changes.cardDetails = /*$filteredCards*/ ctx[6][/*index*/ ctx[24]];

    			if (dirty & /*$$scope, style*/ 100663296) {
    				cardcontext_changes.$$scope = { dirty, ctx };
    			}

    			cardcontext.$set(cardcontext_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardcontext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardcontext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardcontext, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_item_slot.name,
    		type: "slot",
    		source: "(89:12) ",
    		ctx
    	});

    	return block;
    }

    // (68:8) {#key $filteredCards}
    function create_key_block(ctx) {
    	let grid;
    	let updating_scrollToIndex;
    	let current;

    	function grid_scrollToIndex_binding(value) {
    		/*grid_scrollToIndex_binding*/ ctx[17](value);
    	}

    	let grid_props = {
    		width: String(/*$galleryWidth*/ ctx[9]),
    		height: /*gridWrapperHeight*/ ctx[2] - 150,
    		itemWidth: /*cardWidth*/ ctx[11] * /*scale*/ ctx[4] * /*userScale*/ ctx[1],
    		itemHeight: /*cardHeight*/ ctx[12] * /*scale*/ ctx[4] * /*userScale*/ ctx[1],
    		itemCount: /*$filteredCards*/ ctx[6].length,
    		marginLeft: 10 * /*scale*/ ctx[4] * /*userScale*/ ctx[1],
    		$$slots: {
    			item: [
    				create_item_slot,
    				({ index, style }) => ({ 24: index, 25: style }),
    				({ index, style }) => (index ? 16777216 : 0) | (style ? 33554432 : 0)
    			],
    			placeholder: [
    				create_placeholder_slot,
    				({ style }) => ({ 25: style }),
    				({ style }) => style ? 33554432 : 0
    			],
    			header: [create_header_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*$scrollToIndex*/ ctx[7] !== void 0) {
    		grid_props.scrollToIndex = /*$scrollToIndex*/ ctx[7];
    	}

    	grid = new Grid({ props: grid_props, $$inline: true });
    	binding_callbacks.push(() => bind(grid, 'scrollToIndex', grid_scrollToIndex_binding));

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};
    			if (dirty & /*$galleryWidth*/ 512) grid_changes.width = String(/*$galleryWidth*/ ctx[9]);
    			if (dirty & /*gridWrapperHeight*/ 4) grid_changes.height = /*gridWrapperHeight*/ ctx[2] - 150;
    			if (dirty & /*scale, userScale*/ 18) grid_changes.itemWidth = /*cardWidth*/ ctx[11] * /*scale*/ ctx[4] * /*userScale*/ ctx[1];
    			if (dirty & /*scale, userScale*/ 18) grid_changes.itemHeight = /*cardHeight*/ ctx[12] * /*scale*/ ctx[4] * /*userScale*/ ctx[1];
    			if (dirty & /*$filteredCards*/ 64) grid_changes.itemCount = /*$filteredCards*/ ctx[6].length;
    			if (dirty & /*scale, userScale*/ 18) grid_changes.marginLeft = 10 * /*scale*/ ctx[4] * /*userScale*/ ctx[1];

    			if (dirty & /*$$scope, $filteredCards, index, style, $cardDescriptionEnabled*/ 117441600) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_scrollToIndex && dirty & /*$scrollToIndex*/ 128) {
    				updating_scrollToIndex = true;
    				grid_changes.scrollToIndex = /*$scrollToIndex*/ ctx[7];
    				add_flush_callback(() => updating_scrollToIndex = false);
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(68:8) {#key $filteredCards}",
    		ctx
    	});

    	return block;
    }

    // (44:23)      <nav>       <h2 id="gallery">Card Gallery</h2>       loading...     </nav>   {:then}
    function create_pending_block(ctx) {
    	let nav;
    	let h2;
    	let t1;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			h2 = element("h2");
    			h2.textContent = "Card Gallery";
    			t1 = text("\n      loading...");
    			attr_dev(h2, "id", "gallery");
    			attr_dev(h2, "class", "svelte-ucilti");
    			add_location(h2, file$5, 45, 6, 1795);
    			attr_dev(nav, "class", "svelte-ucilti");
    			add_location(nav, file$5, 44, 4, 1783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, h2);
    			append_dev(nav, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(44:23)      <nav>       <h2 id=\\\"gallery\\\">Card Gallery</h2>       loading...     </nav>   {:then}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[14]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		blocks: [,,,]
    	};

    	handle_promise(cards.init(), info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			info.block.c();
    			set_style(main, "--gallery-scale", /*scale*/ ctx[4] * /*userScale*/ ctx[1]);
    			attr_dev(main, "class", "svelte-ucilti");
    			add_location(main, file$5, 42, 0, 1680);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			/*main_binding*/ ctx[20](main);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "scroll", /*handleScroll*/ ctx[13], false, false, false),
    					listen_dev(window_1, "resize", /*onwindowresize*/ ctx[14])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);

    			if (!current || dirty & /*scale, userScale*/ 18) {
    				set_style(main, "--gallery-scale", /*scale*/ ctx[4] * /*userScale*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			/*main_binding*/ ctx[20](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $activeCardNumber;
    	let $filteredCards;
    	let $scrollToIndex;
    	let $prefersReducedMotion;
    	let $galleryWidth;
    	let $cardDescriptionEnabled;
    	validate_store(activeCardNumber, 'activeCardNumber');
    	component_subscribe($$self, activeCardNumber, $$value => $$invalidate(22, $activeCardNumber = $$value));
    	validate_store(filteredCards, 'filteredCards');
    	component_subscribe($$self, filteredCards, $$value => $$invalidate(6, $filteredCards = $$value));
    	validate_store(scrollToIndex, 'scrollToIndex');
    	component_subscribe($$self, scrollToIndex, $$value => $$invalidate(7, $scrollToIndex = $$value));
    	validate_store(prefersReducedMotion, 'prefersReducedMotion');
    	component_subscribe($$self, prefersReducedMotion, $$value => $$invalidate(8, $prefersReducedMotion = $$value));
    	validate_store(galleryWidth, 'galleryWidth');
    	component_subscribe($$self, galleryWidth, $$value => $$invalidate(9, $galleryWidth = $$value));
    	validate_store(cardDescriptionEnabled, 'cardDescriptionEnabled');
    	component_subscribe($$self, cardDescriptionEnabled, $$value => $$invalidate(10, $cardDescriptionEnabled = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let gridWrapperWidth = window.innerWidth;
    	const cardWidth = (744 + 71) / 2;
    	const cardHeight = (1039 + 71) / 2;
    	let userScale = 1;
    	let gridFitColumns = Math.max(1, Math.floor(window.innerWidth / (cardWidth * userScale)));
    	let gridWrapperHeight = window.innerHeight;
    	let scale = 1;

    	const setGridWrapperHeight = () => {
    		$$invalidate(3, gridFitColumns = Math.floor((gridWrapperWidth - 20) / (cardWidth * userScale)));

    		if (gridFitColumns < 1) {
    			$$invalidate(3, gridFitColumns = 1);
    			$$invalidate(4, scale = (gridWrapperWidth - 20) / (cardWidth * userScale));
    		} else {
    			$$invalidate(4, scale = 1);
    		}
    	}; // gridWrapperHeight = Math.ceil($filteredCards.length / gridFitColumns) * cardHeight

    	let galleryRef;
    	let yCoordinate;

    	// record the offset position when the gallery is mounted
    	onMount(() => {
    		yCoordinate = galleryRef.getBoundingClientRect().top + window.scrollY;
    	});

    	// Hide the card description when scrolling past the gallery
    	const handleScroll = () => {
    		if ($activeCardNumber && window.scrollY > yCoordinate + gridWrapperHeight - 150) {
    			activeCardNumber.set(undefined);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(2, gridWrapperHeight = window_1.innerHeight);
    	}

    	const func = () => {
    		const scrollToCard = ~~(Math.random() * $filteredCards.length);
    		$scrollToIndex(scrollToCard, $prefersReducedMotion ? 'auto' : 'smooth');
    		activeCardNumber.set($filteredCards[scrollToCard].number);
    	};

    	function galleryfilters_userScale_binding(value) {
    		userScale = value;
    		$$invalidate(1, userScale);
    	}

    	function grid_scrollToIndex_binding(value) {
    		$scrollToIndex = value;
    		scrollToIndex.set($scrollToIndex);
    	}

    	function div0_elementresize_handler() {
    		$galleryWidth = this.clientWidth;
    		galleryWidth.set($galleryWidth);
    	}

    	function div1_elementresize_handler() {
    		gridWrapperWidth = this.clientWidth;
    		$$invalidate(0, gridWrapperWidth);
    	}

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			galleryRef = $$value;
    			$$invalidate(5, galleryRef);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Grid,
    		Card,
    		CardContext: Context,
    		activeCardNumber,
    		cards,
    		filteredCards,
    		resetFilters,
    		scrollToIndex,
    		prefersReducedMotion,
    		galleryWidth,
    		cardDescriptionEnabled,
    		GalleryFilters,
    		gridWrapperWidth,
    		cardWidth,
    		cardHeight,
    		userScale,
    		gridFitColumns,
    		gridWrapperHeight,
    		scale,
    		setGridWrapperHeight,
    		galleryRef,
    		yCoordinate,
    		handleScroll,
    		$activeCardNumber,
    		$filteredCards,
    		$scrollToIndex,
    		$prefersReducedMotion,
    		$galleryWidth,
    		$cardDescriptionEnabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('gridWrapperWidth' in $$props) $$invalidate(0, gridWrapperWidth = $$props.gridWrapperWidth);
    		if ('userScale' in $$props) $$invalidate(1, userScale = $$props.userScale);
    		if ('gridFitColumns' in $$props) $$invalidate(3, gridFitColumns = $$props.gridFitColumns);
    		if ('gridWrapperHeight' in $$props) $$invalidate(2, gridWrapperHeight = $$props.gridWrapperHeight);
    		if ('scale' in $$props) $$invalidate(4, scale = $$props.scale);
    		if ('galleryRef' in $$props) $$invalidate(5, galleryRef = $$props.galleryRef);
    		if ('yCoordinate' in $$props) yCoordinate = $$props.yCoordinate;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*gridWrapperWidth, userScale, gridWrapperHeight*/ 7) {
    			(gridWrapperHeight && setGridWrapperHeight());
    		}
    	};

    	return [
    		gridWrapperWidth,
    		userScale,
    		gridWrapperHeight,
    		gridFitColumns,
    		scale,
    		galleryRef,
    		$filteredCards,
    		$scrollToIndex,
    		$prefersReducedMotion,
    		$galleryWidth,
    		$cardDescriptionEnabled,
    		cardWidth,
    		cardHeight,
    		handleScroll,
    		onwindowresize,
    		func,
    		galleryfilters_userScale_binding,
    		grid_scrollToIndex_binding,
    		div0_elementresize_handler,
    		div1_elementresize_handler,
    		main_binding
    	];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/lib/Tooltip.svelte generated by Svelte v3.52.0 */

    const file$4 = "src/lib/Tooltip.svelte";

    function create_fragment$4(ctx) {
    	let trigger;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			trigger = element("trigger");
    			if (default_slot) default_slot.c();
    			attr_dev(trigger, "data-tooltip", /*text*/ ctx[0]);
    			attr_dev(trigger, "class", "svelte-hce4tx");
    			add_location(trigger, file$4, 5, 2, 138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, trigger, anchor);

    			if (default_slot) {
    				default_slot.m(trigger, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*text*/ 1) {
    				attr_dev(trigger, "data-tooltip", /*text*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(trigger);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['default']);
    	let { text } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (text === undefined && !('text' in $$props || $$self.$$.bound[$$self.$$.props['text']])) {
    			console.warn("<Tooltip> was created without expected prop 'text'");
    		}
    	});

    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, $$scope, slots];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get text() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const printing = writable(false);
    const bleed = writable(1);

    /* src/card/PrintMarks.svelte generated by Svelte v3.52.0 */
    const file$3 = "src/card/PrintMarks.svelte";

    function create_fragment$3(ctx) {
    	let div16;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;
    	let t8;
    	let div9;
    	let t9;
    	let div10;
    	let t10;
    	let div11;
    	let t11;
    	let div12;
    	let t12;
    	let div13;
    	let t13;
    	let div14;
    	let t14;
    	let div15;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			t8 = space();
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			t10 = space();
    			div11 = element("div");
    			t11 = space();
    			div12 = element("div");
    			t12 = space();
    			div13 = element("div");
    			t13 = space();
    			div14 = element("div");
    			t14 = space();
    			div15 = element("div");
    			attr_dev(div0, "class", "corner svelte-6zsj9x");
    			set_style(div0, "grid-area", "top-left");
    			add_location(div0, file$3, 4, 2, 146);
    			attr_dev(div1, "class", "corner svelte-6zsj9x");
    			set_style(div1, "grid-area", "top-right");
    			add_location(div1, file$3, 5, 2, 200);
    			attr_dev(div2, "class", "corner svelte-6zsj9x");
    			set_style(div2, "grid-area", "bottom-left");
    			add_location(div2, file$3, 6, 2, 254);
    			attr_dev(div3, "class", "corner svelte-6zsj9x");
    			set_style(div3, "grid-area", "bottom-right");
    			add_location(div3, file$3, 7, 2, 310);
    			attr_dev(div4, "class", "vertical top svelte-6zsj9x");
    			set_style(div4, "grid-area", "top-gap-1");
    			add_location(div4, file$3, 8, 2, 367);
    			attr_dev(div5, "class", "vertical top svelte-6zsj9x");
    			set_style(div5, "grid-area", "top-gap-2");
    			add_location(div5, file$3, 9, 2, 428);
    			attr_dev(div6, "class", "horizontal left svelte-6zsj9x");
    			set_style(div6, "grid-area", "left-gap-1");
    			add_location(div6, file$3, 10, 2, 489);
    			attr_dev(div7, "class", "cross svelte-6zsj9x");
    			set_style(div7, "grid-area", "top-left-intersect");
    			add_location(div7, file$3, 11, 2, 554);
    			attr_dev(div8, "class", "cross svelte-6zsj9x");
    			set_style(div8, "grid-area", "top-right-intersect");
    			add_location(div8, file$3, 12, 2, 617);
    			attr_dev(div9, "class", "horizontal right svelte-6zsj9x");
    			set_style(div9, "grid-area", "right-gap-1");
    			add_location(div9, file$3, 13, 2, 681);
    			attr_dev(div10, "class", "horizontal left svelte-6zsj9x");
    			set_style(div10, "grid-area", "left-gap-2");
    			add_location(div10, file$3, 14, 2, 748);
    			attr_dev(div11, "class", "cross svelte-6zsj9x");
    			set_style(div11, "grid-area", "bottom-left-intersect");
    			add_location(div11, file$3, 15, 2, 813);
    			attr_dev(div12, "class", "cross svelte-6zsj9x");
    			set_style(div12, "grid-area", "bottom-right-intersect");
    			add_location(div12, file$3, 16, 2, 879);
    			attr_dev(div13, "class", "horizontal right svelte-6zsj9x");
    			set_style(div13, "grid-area", "right-gap-2");
    			add_location(div13, file$3, 17, 2, 946);
    			attr_dev(div14, "class", "vertical bottom svelte-6zsj9x");
    			set_style(div14, "grid-area", "bottom-gap-1");
    			add_location(div14, file$3, 18, 2, 1013);
    			attr_dev(div15, "class", "vertical bottom svelte-6zsj9x");
    			set_style(div15, "grid-area", "bottom-gap-2");
    			add_location(div15, file$3, 19, 2, 1080);
    			attr_dev(div16, "class", "marks svelte-6zsj9x");
    			set_style(div16, "--markWidth", /*$bleed*/ ctx[0] === 0 ? '.5px' : '1px');
    			add_location(div16, file$3, 3, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div0);
    			append_dev(div16, t0);
    			append_dev(div16, div1);
    			append_dev(div16, t1);
    			append_dev(div16, div2);
    			append_dev(div16, t2);
    			append_dev(div16, div3);
    			append_dev(div16, t3);
    			append_dev(div16, div4);
    			append_dev(div16, t4);
    			append_dev(div16, div5);
    			append_dev(div16, t5);
    			append_dev(div16, div6);
    			append_dev(div16, t6);
    			append_dev(div16, div7);
    			append_dev(div16, t7);
    			append_dev(div16, div8);
    			append_dev(div16, t8);
    			append_dev(div16, div9);
    			append_dev(div16, t9);
    			append_dev(div16, div10);
    			append_dev(div16, t10);
    			append_dev(div16, div11);
    			append_dev(div16, t11);
    			append_dev(div16, div12);
    			append_dev(div16, t12);
    			append_dev(div16, div13);
    			append_dev(div16, t13);
    			append_dev(div16, div14);
    			append_dev(div16, t14);
    			append_dev(div16, div15);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$bleed*/ 1) {
    				set_style(div16, "--markWidth", /*$bleed*/ ctx[0] === 0 ? '.5px' : '1px');
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $bleed;
    	validate_store(bleed, 'bleed');
    	component_subscribe($$self, bleed, $$value => $$invalidate(0, $bleed = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrintMarks', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrintMarks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ bleed, $bleed });
    	return [$bleed];
    }

    class PrintMarks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrintMarks",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/card/PrintSettings.svelte generated by Svelte v3.52.0 */
    const file$2 = "src/card/PrintSettings.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (56:23) <Tooltip           text="Bleed is an extended area of artwork around the cards that allows for a margin of error when cutting them to size."           >
    function create_default_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "ℹ️";
    			attr_dev(div, "class", "icon-info svelte-1eyenu2");
    			add_location(div, file$2, 57, 11, 1828);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(56:23) <Tooltip           text=\\\"Bleed is an extended area of artwork around the cards that allows for a margin of error when cutting them to size.\\\"           >",
    		ctx
    	});

    	return block;
    }

    // (70:24) <Tooltip           text="It's recommended to print a Test Page first to ensure your cards are printed at the right size."           >
    function create_default_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "ℹ️";
    			attr_dev(div, "class", "icon-info svelte-1eyenu2");
    			add_location(div, file$2, 71, 11, 2277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(70:24) <Tooltip           text=\\\"It's recommended to print a Test Page first to ensure your cards are printed at the right size.\\\"           >",
    		ctx
    	});

    	return block;
    }

    // (82:4) {#if printGroup === 'Selection'}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t0_value = /*printSelection*/ ctx[1].length + "";
    	let t0;
    	let t1;
    	let t2_value = (/*printSelection*/ ctx[1].length === 1 ? '' : 's') + "";
    	let t2;
    	let t3;
    	let t4;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*$cards*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(" card");
    			t2 = text(t2_value);
    			t3 = text(" selected");
    			t4 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "option-wrapper svelte-1eyenu2");
    			add_location(div, file$2, 82, 6, 2686);
    			attr_dev(select, "id", "printSelection");
    			select.multiple = true;
    			attr_dev(select, "class", "svelte-1eyenu2");
    			if (/*printSelection*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file$2, 85, 6, 2820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_options(select, /*printSelection*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[11]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*printSelection*/ 2 && t0_value !== (t0_value = /*printSelection*/ ctx[1].length + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*printSelection*/ 2 && t2_value !== (t2_value = (/*printSelection*/ ctx[1].length === 1 ? '' : 's') + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$cards, $cardNames*/ 40) {
    				each_value = /*$cards*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*printSelection, $cards*/ 10) {
    				select_options(select, /*printSelection*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(82:4) {#if printGroup === 'Selection'}",
    		ctx
    	});

    	return block;
    }

    // (88:10) {#if card.img}
    function create_if_block_2$2(ctx) {
    	let option;
    	let t_value = /*$cardNames*/ ctx[5][/*card*/ ctx[13].number].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*card*/ ctx[13].number;
    			option.value = option.__value;
    			add_location(option, file$2, 88, 12, 2954);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$cardNames, $cards*/ 40 && t_value !== (t_value = /*$cardNames*/ ctx[5][/*card*/ ctx[13].number].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*$cards*/ 8 && option_value_value !== (option_value_value = /*card*/ ctx[13].number)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(88:10) {#if card.img}",
    		ctx
    	});

    	return block;
    }

    // (87:8) {#each $cards as card}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*card*/ ctx[13].img && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*card*/ ctx[13].img) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(87:8) {#each $cards as card}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if printGroup === 'Backs'}
    function create_if_block$2(ctx) {
    	let div;
    	let label;
    	let t1;
    	let input;
    	let input_max_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Number of Card Backs";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "numberBacks");
    			attr_dev(label, "class", "svelte-1eyenu2");
    			add_location(label, file$2, 95, 8, 3156);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", input_max_value = /*$cards*/ ctx[3].length);
    			attr_dev(input, "step", "1");
    			add_location(input, file$2, 96, 8, 3219);
    			attr_dev(div, "class", "option-wrapper svelte-1eyenu2");
    			add_location(div, file$2, 94, 6, 3119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*numberBacks*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[12]),
    					listen_dev(input, "change", /*clipNumberCards*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$cards*/ 8 && input_max_value !== (input_max_value = /*$cards*/ ctx[3].length)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*numberBacks*/ 4 && to_number(input.value) !== /*numberBacks*/ ctx[2]) {
    				set_input_value(input, /*numberBacks*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(94:4) {#if printGroup === 'Backs'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div5;
    	let div4;
    	let h2;
    	let t1;
    	let div0;
    	let t3;
    	let div1;
    	let label0;
    	let t4;
    	let tooltip0;
    	let t5;
    	let select0;
    	let option0;
    	let option1;
    	let t8;
    	let p;
    	let t9;
    	let div2;
    	let label1;
    	let t10;
    	let tooltip1;
    	let t11;
    	let select1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let t16;
    	let t17;
    	let t18;
    	let div3;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	tooltip0 = new Tooltip({
    			props: {
    				text: "Bleed is an extended area of artwork around the cards that allows for a margin of error when cutting them to size.",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip1 = new Tooltip({
    			props: {
    				text: "It's recommended to print a Test Page first to ensure your cards are printed at the right size.",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*printGroup*/ ctx[0] === 'Selection' && create_if_block_1$2(ctx);
    	let if_block1 = /*printGroup*/ ctx[0] === 'Backs' && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Print";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Thanks to our generous artists, the cards on this site are available for you to print for personal use!";
    			t3 = space();
    			div1 = element("div");
    			label0 = element("label");
    			t4 = text("Include Bleed ");
    			create_component(tooltip0.$$.fragment);
    			t5 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Yes";
    			option1 = element("option");
    			option1.textContent = "No";
    			t8 = space();
    			p = element("p");
    			t9 = space();
    			div2 = element("div");
    			label1 = element("label");
    			t10 = text("Cards to Print ");
    			create_component(tooltip1.$$.fragment);
    			t11 = space();
    			select1 = element("select");
    			option2 = element("option");
    			option2.textContent = "Test Page";
    			option3 = element("option");
    			option3.textContent = "Card Backs";
    			option4 = element("option");
    			option4.textContent = "All Illustrated Cards";
    			option5 = element("option");
    			option5.textContent = "Choose Cards";
    			t16 = space();
    			if (if_block0) if_block0.c();
    			t17 = space();
    			if (if_block1) if_block1.c();
    			t18 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Print";
    			attr_dev(h2, "class", "svelte-1eyenu2");
    			add_location(h2, file$2, 49, 4, 1426);
    			attr_dev(div0, "class", "option-wrapper svelte-1eyenu2");
    			add_location(div0, file$2, 50, 4, 1445);
    			attr_dev(label0, "for", "bleed");
    			attr_dev(label0, "class", "svelte-1eyenu2");
    			add_location(label0, file$2, 54, 6, 1634);
    			option0.__value = 1;
    			option0.value = option0.__value;
    			add_location(option0, file$2, 61, 8, 1948);
    			option1.__value = 0;
    			option1.value = option1.__value;
    			add_location(option1, file$2, 62, 8, 1987);
    			attr_dev(select0, "id", "bleed");
    			if (/*$bleed*/ ctx[4] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[9].call(select0));
    			add_location(select0, file$2, 60, 6, 1900);
    			add_location(p, file$2, 64, 6, 2039);
    			attr_dev(div1, "class", "option-wrapper svelte-1eyenu2");
    			add_location(div1, file$2, 53, 4, 1599);
    			attr_dev(label1, "for", "printGroup");
    			attr_dev(label1, "class", "svelte-1eyenu2");
    			add_location(label1, file$2, 68, 6, 2096);
    			option2.__value = "Test Page";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 75, 8, 2406);
    			option3.__value = "Backs";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 76, 8, 2459);
    			option4.__value = "All";
    			option4.value = option4.__value;
    			add_location(option4, file$2, 77, 8, 2509);
    			option5.__value = "Selection";
    			option5.value = option5.__value;
    			add_location(option5, file$2, 78, 8, 2568);
    			attr_dev(select1, "id", "printGroup");
    			if (/*printGroup*/ ctx[0] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[10].call(select1));
    			add_location(select1, file$2, 74, 6, 2349);
    			attr_dev(div2, "class", "option-wrapper svelte-1eyenu2");
    			add_location(div2, file$2, 67, 4, 2061);
    			add_location(button, file$2, 107, 6, 3463);
    			attr_dev(div3, "class", "option-wrapper svelte-1eyenu2");
    			add_location(div3, file$2, 106, 4, 3428);
    			attr_dev(div4, "class", "print-settings-inner svelte-1eyenu2");
    			add_location(div4, file$2, 48, 2, 1387);
    			attr_dev(div5, "id", "print");
    			attr_dev(div5, "class", "print-settings svelte-1eyenu2");
    			add_location(div5, file$2, 47, 0, 1345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, h2);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div1, label0);
    			append_dev(label0, t4);
    			mount_component(tooltip0, label0, null);
    			append_dev(div1, t5);
    			append_dev(div1, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			select_option(select0, /*$bleed*/ ctx[4]);
    			append_dev(div1, t8);
    			append_dev(div1, p);
    			append_dev(div4, t9);
    			append_dev(div4, div2);
    			append_dev(div2, label1);
    			append_dev(label1, t10);
    			mount_component(tooltip1, label1, null);
    			append_dev(div2, t11);
    			append_dev(div2, select1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			append_dev(select1, option4);
    			append_dev(select1, option5);
    			select_option(select1, /*printGroup*/ ctx[0]);
    			append_dev(div4, t16);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t17);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t18);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[9]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[10]),
    					listen_dev(button, "click", /*handlePrint*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const tooltip0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tooltip0_changes.$$scope = { dirty, ctx };
    			}

    			tooltip0.$set(tooltip0_changes);

    			if (dirty & /*$bleed*/ 16) {
    				select_option(select0, /*$bleed*/ ctx[4]);
    			}

    			const tooltip1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				tooltip1_changes.$$scope = { dirty, ctx };
    			}

    			tooltip1.$set(tooltip1_changes);

    			if (dirty & /*printGroup*/ 1) {
    				select_option(select1, /*printGroup*/ ctx[0]);
    			}

    			if (/*printGroup*/ ctx[0] === 'Selection') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(div4, t17);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*printGroup*/ ctx[0] === 'Backs') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div4, t18);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip0.$$.fragment, local);
    			transition_in(tooltip1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip0.$$.fragment, local);
    			transition_out(tooltip1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(tooltip0);
    			destroy_component(tooltip1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $cards;
    	let $bleed;
    	let $cardNames;
    	validate_store(cards, 'cards');
    	component_subscribe($$self, cards, $$value => $$invalidate(3, $cards = $$value));
    	validate_store(bleed, 'bleed');
    	component_subscribe($$self, bleed, $$value => $$invalidate(4, $bleed = $$value));
    	validate_store(cardNames, 'cardNames');
    	component_subscribe($$self, cardNames, $$value => $$invalidate(5, $cardNames = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrintSettings', slots, []);

    	window.addEventListener('beforeprint', event => {
    		printing.set(true);

    		window.dataLayer.push({
    			event: 'arty__print_dialog_opened',
    			bleed: $bleed,
    			printGroup,
    			printSelection,
    			selectionCount: printSelection.length
    		});
    	});

    	const handlePrint = () => {
    		printing.set(true);

    		window.dataLayer.push({
    			event: 'arty__print_button_clicked',
    			bleed: $bleed,
    			printGroup,
    			printSelection,
    			selectionCount: printSelection.length
    		});

    		setTimeout(window.print, 500);
    	};

    	let cardGroups = [];

    	const clipNumberCards = e => {
    		if (Number(e.currentTarget.value) < 1) {
    			$$invalidate(2, numberBacks = 1);
    		}
    	};

    	let { numberBacks } = $$props;
    	let { printGroup } = $$props;
    	let { printSelection } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (numberBacks === undefined && !('numberBacks' in $$props || $$self.$$.bound[$$self.$$.props['numberBacks']])) {
    			console.warn("<PrintSettings> was created without expected prop 'numberBacks'");
    		}

    		if (printGroup === undefined && !('printGroup' in $$props || $$self.$$.bound[$$self.$$.props['printGroup']])) {
    			console.warn("<PrintSettings> was created without expected prop 'printGroup'");
    		}

    		if (printSelection === undefined && !('printSelection' in $$props || $$self.$$.bound[$$self.$$.props['printSelection']])) {
    			console.warn("<PrintSettings> was created without expected prop 'printSelection'");
    		}
    	});

    	const writable_props = ['numberBacks', 'printGroup', 'printSelection'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrintSettings> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		$bleed = select_value(this);
    		bleed.set($bleed);
    	}

    	function select1_change_handler() {
    		printGroup = select_value(this);
    		$$invalidate(0, printGroup);
    	}

    	function select_change_handler() {
    		printSelection = select_multiple_value(this);
    		$$invalidate(1, printSelection);
    	}

    	function input_input_handler() {
    		numberBacks = to_number(this.value);
    		$$invalidate(2, numberBacks);
    	}

    	$$self.$$set = $$props => {
    		if ('numberBacks' in $$props) $$invalidate(2, numberBacks = $$props.numberBacks);
    		if ('printGroup' in $$props) $$invalidate(0, printGroup = $$props.printGroup);
    		if ('printSelection' in $$props) $$invalidate(1, printSelection = $$props.printSelection);
    	};

    	$$self.$capture_state = () => ({
    		Tooltip,
    		cards,
    		cardNames,
    		printing,
    		bleed,
    		handlePrint,
    		cardGroups,
    		clipNumberCards,
    		numberBacks,
    		printGroup,
    		printSelection,
    		$cards,
    		$bleed,
    		$cardNames
    	});

    	$$self.$inject_state = $$props => {
    		if ('cardGroups' in $$props) $$invalidate(8, cardGroups = $$props.cardGroups);
    		if ('numberBacks' in $$props) $$invalidate(2, numberBacks = $$props.numberBacks);
    		if ('printGroup' in $$props) $$invalidate(0, printGroup = $$props.printGroup);
    		if ('printSelection' in $$props) $$invalidate(1, printSelection = $$props.printSelection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*printGroup, $cards, printSelection, cardGroups*/ 267) {
    			{
    				$$invalidate(8, cardGroups = []);

    				const printCards = printGroup === 'All'
    				? $cards.filter(c => !!c.artist)
    				: $cards.filter(c => printSelection.includes(c.number));

    				while (printCards.length > 0) {
    					cardGroups.push(printCards.splice(0, 9));
    				}
    			}
    		}
    	};

    	return [
    		printGroup,
    		printSelection,
    		numberBacks,
    		$cards,
    		$bleed,
    		$cardNames,
    		handlePrint,
    		clipNumberCards,
    		cardGroups,
    		select0_change_handler,
    		select1_change_handler,
    		select_change_handler,
    		input_input_handler
    	];
    }

    class PrintSettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			numberBacks: 2,
    			printGroup: 0,
    			printSelection: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrintSettings",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get numberBacks() {
    		throw new Error("<PrintSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberBacks(value) {
    		throw new Error("<PrintSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get printGroup() {
    		throw new Error("<PrintSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set printGroup(value) {
    		throw new Error("<PrintSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get printSelection() {
    		throw new Error("<PrintSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set printSelection(value) {
    		throw new Error("<PrintSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/card/PrintGallery.svelte generated by Svelte v3.52.0 */
    const file$1 = "src/card/PrintGallery.svelte";

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_if_ctx(ctx) {
    	const child_ctx = ctx.slice();
    	const constants_0 = Math.ceil(/*numberBacks*/ child_ctx[3] / 9);
    	child_ctx[16] = constants_0;
    	return child_ctx;
    }

    // (30:2) {#if $printing}
    function create_if_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_if_block_2$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*printGroup*/ ctx[1] === 'Test Page') return 0;
    		if (/*printGroup*/ ctx[1] === 'Backs') return 1;
    		return 2;
    	}

    	function select_block_ctx(ctx, index) {
    		if (index === 1) return get_if_ctx(ctx);
    		return ctx;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](select_block_ctx(ctx, current_block_type_index));

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(select_block_ctx(ctx, current_block_type_index), dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](select_block_ctx(ctx, current_block_type_index));
    					if_block.c();
    				} else {
    					if_block.p(select_block_ctx(ctx, current_block_type_index), dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(30:2) {#if $printing}",
    		ctx
    	});

    	return block;
    }

    // (65:4) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_3 = /*cardGroups*/ ctx[0];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$bleed, cardGroups, $cardNames, $lang*/ 225) {
    				each_value_3 = /*cardGroups*/ ctx[0];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(65:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:37) 
    function create_if_block_2$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = Array(/*pageCount*/ ctx[16]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$bleed, Array, Math, numberBacks*/ 40) {
    				each_value_1 = Array(/*pageCount*/ ctx[16]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(46:37) ",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#if printGroup === 'Test Page'}
    function create_if_block_1$1(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let printmarks;
    	let current;
    	let each_value = Array(8);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	printmarks = new PrintMarks({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(printmarks.$$.fragment);
    			attr_dev(img, "class", "print-card svelte-m9jxjk");
    			attr_dev(img, "alt", "Test Card");
    			if (!src_url_equal(img.src, img_src_value = "./img/Print/" + /*$lang*/ ctx[6] + "/0_test.webp")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 37, 10, 1262);
    			attr_dev(div0, "class", "page svelte-m9jxjk");
    			add_location(div0, file$1, 36, 8, 1233);
    			attr_dev(div1, "class", "wrapper first svelte-m9jxjk");
    			set_style(div1, "--printBleed", /*$bleed*/ ctx[5] + "mm");
    			set_style(div1, "--printInset", 3 - /*$bleed*/ ctx[5] + "mm");
    			set_style(div1, "--cardHeight", 88 + /*$bleed*/ ctx[5] * 2 + "mm");
    			set_style(div1, "--cardWidth", 63 + /*$bleed*/ ctx[5] * 2 + "mm");
    			add_location(div1, file$1, 31, 6, 1037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);
    			mount_component(printmarks, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$lang*/ 64 && !src_url_equal(img.src, img_src_value = "./img/Print/" + /*$lang*/ ctx[6] + "/0_test.webp")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--printBleed", /*$bleed*/ ctx[5] + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--printInset", 3 - /*$bleed*/ ctx[5] + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--cardHeight", 88 + /*$bleed*/ ctx[5] * 2 + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--cardWidth", 63 + /*$bleed*/ ctx[5] * 2 + "mm");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(printmarks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(printmarks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(printmarks);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(31:4) {#if printGroup === 'Test Page'}",
    		ctx
    	});

    	return block;
    }

    // (74:12) {#each group as card}
    function create_each_block_4(ctx) {
    	let img;
    	let img_alt_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "print-card svelte-m9jxjk");
    			attr_dev(img, "alt", img_alt_value = "" + (/*$cardNames*/ ctx[7][/*card*/ ctx[24].number].name + " by " + /*card*/ ctx[24].artist));
    			if (!src_url_equal(img.src, img_src_value = "/img/Print/" + /*$lang*/ ctx[6] + "/" + /*card*/ ctx[24].number.toString().padStart(3, '0') + ".webp")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 75, 14, 2751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$cardNames, cardGroups*/ 129 && img_alt_value !== (img_alt_value = "" + (/*$cardNames*/ ctx[7][/*card*/ ctx[24].number].name + " by " + /*card*/ ctx[24].artist))) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*$lang, cardGroups*/ 65 && !src_url_equal(img.src, img_src_value = "/img/Print/" + /*$lang*/ ctx[6] + "/" + /*card*/ ctx[24].number.toString().padStart(3, '0') + ".webp")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(74:12) {#each group as card}",
    		ctx
    	});

    	return block;
    }

    // (66:6) {#each cardGroups as group, i}
    function create_each_block_3(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let printmarks;
    	let t1;
    	let current;
    	let each_value_4 = /*group*/ ctx[22];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	printmarks = new PrintMarks({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			create_component(printmarks.$$.fragment);
    			t1 = space();
    			attr_dev(div0, "class", "page svelte-m9jxjk");
    			add_location(div0, file$1, 72, 10, 2576);
    			attr_dev(div1, "class", "wrapper svelte-m9jxjk");
    			set_style(div1, "--printBleed", /*$bleed*/ ctx[5] + "mm");
    			set_style(div1, "--printInset", 3 - /*$bleed*/ ctx[5] + "mm");
    			set_style(div1, "--cardHeight", 88 + /*$bleed*/ ctx[5] * 2 + "mm");
    			set_style(div1, "--cardWidth", 63 + /*$bleed*/ ctx[5] * 2 + "mm");
    			toggle_class(div1, "first", /*i*/ ctx[19] === 0);
    			add_location(div1, file$1, 66, 8, 2344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t0);
    			mount_component(printmarks, div1, null);
    			append_dev(div1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$cardNames, cardGroups, $lang*/ 193) {
    				each_value_4 = /*group*/ ctx[22];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--printBleed", /*$bleed*/ ctx[5] + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--printInset", 3 - /*$bleed*/ ctx[5] + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--cardHeight", 88 + /*$bleed*/ ctx[5] * 2 + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--cardWidth", 63 + /*$bleed*/ ctx[5] * 2 + "mm");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(printmarks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(printmarks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(printmarks);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(66:6) {#each cardGroups as group, i}",
    		ctx
    	});

    	return block;
    }

    // (57:12) {#each Array(i <= pageCount - 1 ? 9 : numberBacks % 9) as _}
    function create_each_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "print-card svelte-m9jxjk");
    			attr_dev(img, "alt", "Test Card");
    			if (!src_url_equal(img.src, img_src_value = "./img/UI/CardBack.webp")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 57, 14, 2123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(57:12) {#each Array(i <= pageCount - 1 ? 9 : numberBacks % 9) as _}",
    		ctx
    	});

    	return block;
    }

    // (48:6) {#each Array(pageCount) as page, i}
    function create_each_block_1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let printmarks;
    	let t1;
    	let current;

    	let each_value_2 = Array(/*i*/ ctx[19] <= /*pageCount*/ ctx[16] - 1
    	? 9
    	: /*numberBacks*/ ctx[3] % 9);

    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	printmarks = new PrintMarks({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			create_component(printmarks.$$.fragment);
    			t1 = space();
    			attr_dev(div0, "class", "page svelte-m9jxjk");
    			add_location(div0, file$1, 54, 10, 1909);
    			attr_dev(div1, "class", "wrapper back svelte-m9jxjk");
    			set_style(div1, "--printBleed", /*$bleed*/ ctx[5] + "mm");
    			set_style(div1, "--printInset", 3 - /*$bleed*/ ctx[5] + "mm");
    			set_style(div1, "--cardHeight", 88 + /*$bleed*/ ctx[5] * 2 + "mm");
    			set_style(div1, "--cardWidth", 63 + /*$bleed*/ ctx[5] * 2 + "mm");
    			toggle_class(div1, "first", /*i*/ ctx[19] === 0);
    			add_location(div1, file$1, 48, 8, 1672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t0);
    			mount_component(printmarks, div1, null);
    			append_dev(div1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*numberBacks*/ 8) {
    				each_value_2 = Array(/*i*/ ctx[19] <= /*pageCount*/ ctx[16] - 1
    				? 9
    				: /*numberBacks*/ ctx[3] % 9);

    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--printBleed", /*$bleed*/ ctx[5] + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--printInset", 3 - /*$bleed*/ ctx[5] + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--cardHeight", 88 + /*$bleed*/ ctx[5] * 2 + "mm");
    			}

    			if (!current || dirty & /*$bleed*/ 32) {
    				set_style(div1, "--cardWidth", 63 + /*$bleed*/ ctx[5] * 2 + "mm");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(printmarks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(printmarks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(printmarks);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(48:6) {#each Array(pageCount) as page, i}",
    		ctx
    	});

    	return block;
    }

    // (39:10) {#each Array(8) as _}
    function create_each_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "print-card svelte-m9jxjk");
    			attr_dev(img, "alt", "Test Card");
    			if (!src_url_equal(img.src, img_src_value = "./img/Print/1_test.webp")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 39, 12, 1387);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(39:10) {#each Array(8) as _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let printsettings;
    	let updating_printGroup;
    	let updating_printSelection;
    	let updating_numberBacks;
    	let t;
    	let current;

    	function printsettings_printGroup_binding(value) {
    		/*printsettings_printGroup_binding*/ ctx[9](value);
    	}

    	function printsettings_printSelection_binding(value) {
    		/*printsettings_printSelection_binding*/ ctx[10](value);
    	}

    	function printsettings_numberBacks_binding(value) {
    		/*printsettings_numberBacks_binding*/ ctx[11](value);
    	}

    	let printsettings_props = {};

    	if (/*printGroup*/ ctx[1] !== void 0) {
    		printsettings_props.printGroup = /*printGroup*/ ctx[1];
    	}

    	if (/*printSelection*/ ctx[2] !== void 0) {
    		printsettings_props.printSelection = /*printSelection*/ ctx[2];
    	}

    	if (/*numberBacks*/ ctx[3] !== void 0) {
    		printsettings_props.numberBacks = /*numberBacks*/ ctx[3];
    	}

    	printsettings = new PrintSettings({
    			props: printsettings_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(printsettings, 'printGroup', printsettings_printGroup_binding));
    	binding_callbacks.push(() => bind(printsettings, 'printSelection', printsettings_printSelection_binding));
    	binding_callbacks.push(() => bind(printsettings, 'numberBacks', printsettings_numberBacks_binding));
    	let if_block = /*$printing*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(printsettings.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-m9jxjk");
    			add_location(main, file$1, 27, 0, 896);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(printsettings, main, null);
    			append_dev(main, t);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const printsettings_changes = {};

    			if (!updating_printGroup && dirty & /*printGroup*/ 2) {
    				updating_printGroup = true;
    				printsettings_changes.printGroup = /*printGroup*/ ctx[1];
    				add_flush_callback(() => updating_printGroup = false);
    			}

    			if (!updating_printSelection && dirty & /*printSelection*/ 4) {
    				updating_printSelection = true;
    				printsettings_changes.printSelection = /*printSelection*/ ctx[2];
    				add_flush_callback(() => updating_printSelection = false);
    			}

    			if (!updating_numberBacks && dirty & /*numberBacks*/ 8) {
    				updating_numberBacks = true;
    				printsettings_changes.numberBacks = /*numberBacks*/ ctx[3];
    				add_flush_callback(() => updating_numberBacks = false);
    			}

    			printsettings.$set(printsettings_changes);

    			if (/*$printing*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$printing*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(printsettings.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(printsettings.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(printsettings);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $cards;
    	let $printing;
    	let $bleed;
    	let $lang;
    	let $cardNames;
    	validate_store(cards, 'cards');
    	component_subscribe($$self, cards, $$value => $$invalidate(8, $cards = $$value));
    	validate_store(printing, 'printing');
    	component_subscribe($$self, printing, $$value => $$invalidate(4, $printing = $$value));
    	validate_store(bleed, 'bleed');
    	component_subscribe($$self, bleed, $$value => $$invalidate(5, $bleed = $$value));
    	validate_store(lang, 'lang');
    	component_subscribe($$self, lang, $$value => $$invalidate(6, $lang = $$value));
    	validate_store(cardNames, 'cardNames');
    	component_subscribe($$self, cardNames, $$value => $$invalidate(7, $cardNames = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrintGallery', slots, []);
    	let cardGroups = [];

    	const setNumberBackLength = () => {
    		$$invalidate(3, numberBacks = printSelection.length || 9);
    	};

    	let printGroup = 'Test Page';
    	let printSelection = [];
    	let numberBacks = 9;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrintGallery> was created with unknown prop '${key}'`);
    	});

    	function printsettings_printGroup_binding(value) {
    		printGroup = value;
    		$$invalidate(1, printGroup);
    	}

    	function printsettings_printSelection_binding(value) {
    		printSelection = value;
    		$$invalidate(2, printSelection);
    	}

    	function printsettings_numberBacks_binding(value) {
    		numberBacks = value;
    		$$invalidate(3, numberBacks);
    	}

    	$$self.$capture_state = () => ({
    		cards,
    		lang,
    		cardNames,
    		printing,
    		bleed,
    		PrintMarks,
    		PrintSettings,
    		cardGroups,
    		setNumberBackLength,
    		printGroup,
    		printSelection,
    		numberBacks,
    		$cards,
    		$printing,
    		$bleed,
    		$lang,
    		$cardNames
    	});

    	$$self.$inject_state = $$props => {
    		if ('cardGroups' in $$props) $$invalidate(0, cardGroups = $$props.cardGroups);
    		if ('printGroup' in $$props) $$invalidate(1, printGroup = $$props.printGroup);
    		if ('printSelection' in $$props) $$invalidate(2, printSelection = $$props.printSelection);
    		if ('numberBacks' in $$props) $$invalidate(3, numberBacks = $$props.numberBacks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*printGroup, $cards, printSelection, cardGroups*/ 263) {
    			{
    				$$invalidate(0, cardGroups = []);

    				const printCards = printGroup === 'All'
    				? $cards.filter(c => !!c.artist)
    				: $cards.filter(c => printSelection.includes(c.number));

    				while (printCards.length > 0) {
    					cardGroups.push(printCards.splice(0, 9));
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*printSelection*/ 4) {
    			printSelection && setNumberBackLength();
    		}
    	};

    	return [
    		cardGroups,
    		printGroup,
    		printSelection,
    		numberBacks,
    		$printing,
    		$bleed,
    		$lang,
    		$cardNames,
    		$cards,
    		printsettings_printGroup_binding,
    		printsettings_printSelection_binding,
    		printsettings_numberBacks_binding
    	];
    }

    class PrintGallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrintGallery",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.52.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (54:2) {#if $activeCard && $cardDescriptionEnabled}
    function create_if_block(ctx) {
    	let detail;
    	let button;
    	let t1;
    	let h3;
    	let t2_value = /*$activeCard*/ ctx[1].seriesNumber + "";
    	let t2;
    	let t3;
    	let t4_value = /*$activeCard*/ ctx[1].seriesTotal + "";
    	let t4;
    	let t5;
    	let t6_value = /*$activeCard*/ ctx[1].name + "";
    	let t6;
    	let t7;
    	let t8_value = /*$activeCard*/ ctx[1].artist + "";
    	let t8;
    	let t9;
    	let div;
    	let t10;
    	let t11;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$activeCard*/ ctx[1].artistAlias && create_if_block_3(ctx);
    	let each_value = /*$activeCard*/ ctx[1].artistLinks;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block1 = /*$activeCard*/ ctx[1].description && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			detail = element("detail");
    			button = element("button");
    			button.textContent = "✕";
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(t2_value);
    			t3 = text("/");
    			t4 = text(t4_value);
    			t5 = text(": ");
    			t6 = text(t6_value);
    			t7 = text(" by ");
    			t8 = text(t8_value);
    			t9 = space();
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(button, "class", "svelte-1us38hv");
    			add_location(button, file, 55, 6, 2083);
    			attr_dev(h3, "class", "svelte-1us38hv");
    			add_location(h3, file, 56, 6, 2131);
    			add_location(div, file, 57, 6, 2243);
    			attr_dev(detail, "class", "svelte-1us38hv");
    			add_location(detail, file, 54, 4, 2068);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, detail, anchor);
    			append_dev(detail, button);
    			append_dev(detail, t1);
    			append_dev(detail, h3);
    			append_dev(h3, t2);
    			append_dev(h3, t3);
    			append_dev(h3, t4);
    			append_dev(h3, t5);
    			append_dev(h3, t6);
    			append_dev(h3, t7);
    			append_dev(h3, t8);
    			append_dev(detail, t9);
    			append_dev(detail, div);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(detail, t11);
    			if (if_block1) if_block1.m(detail, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*closeDetail*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$activeCard*/ 2 && t2_value !== (t2_value = /*$activeCard*/ ctx[1].seriesNumber + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$activeCard*/ 2 && t4_value !== (t4_value = /*$activeCard*/ ctx[1].seriesTotal + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$activeCard*/ 2 && t6_value !== (t6_value = /*$activeCard*/ ctx[1].name + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$activeCard*/ 2 && t8_value !== (t8_value = /*$activeCard*/ ctx[1].artist + "")) set_data_dev(t8, t8_value);

    			if (/*$activeCard*/ ctx[1].artistAlias) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(div, t10);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$activeCard*/ 2) {
    				each_value = /*$activeCard*/ ctx[1].artistLinks;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*$activeCard*/ ctx[1].description) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(detail, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(detail);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(54:2) {#if $activeCard && $cardDescriptionEnabled}",
    		ctx
    	});

    	return block;
    }

    // (59:8) {#if $activeCard.artistAlias}
    function create_if_block_3(ctx) {
    	let span;
    	let t_value = /*$activeCard*/ ctx[1].artistAlias + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "alias svelte-1us38hv");
    			add_location(span, file, 59, 10, 2297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$activeCard*/ 2 && t_value !== (t_value = /*$activeCard*/ ctx[1].artistAlias + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(59:8) {#if $activeCard.artistAlias}",
    		ctx
    	});

    	return block;
    }

    // (65:10) {#if index > 0}
    function create_if_block_2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "|";
    			attr_dev(span, "class", "link-divider svelte-1us38hv");
    			add_location(span, file, 65, 12, 2481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(65:10) {#if index > 0}",
    		ctx
    	});

    	return block;
    }

    // (64:8) {#each $activeCard.artistLinks as link, index}
    function create_each_block(ctx) {
    	let t0;
    	let a;
    	let t1_value = /*link*/ ctx[7].title + "";
    	let t1;
    	let a_href_value;
    	let if_block = /*index*/ ctx[9] > 0 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			a = element("a");
    			t1 = text(t1_value);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[7].link);
    			attr_dev(a, "class", "svelte-1us38hv");
    			add_location(a, file, 67, 10, 2543);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$activeCard*/ 2 && t1_value !== (t1_value = /*link*/ ctx[7].title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$activeCard*/ 2 && a_href_value !== (a_href_value = /*link*/ ctx[7].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(64:8) {#each $activeCard.artistLinks as link, index}",
    		ctx
    	});

    	return block;
    }

    // (71:6) {#if $activeCard.description}
    function create_if_block_1(ctx) {
    	let p;
    	let t_value = /*$activeCard*/ ctx[1].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file, 71, 8, 2653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$activeCard*/ 2 && t_value !== (t_value = /*$activeCard*/ ctx[1].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(71:6) {#if $activeCard.description}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let navigation;
    	let t0;
    	let div;
    	let t1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let t8;
    	let about;
    	let t9;
    	let gallery;
    	let t10;
    	let printgallery;
    	let t11;
    	let whatsnext;
    	let t12;
    	let credits;
    	let t13;
    	let footer;
    	let t14;
    	let current;
    	navigation = new Navigation({ $$inline: true });
    	about = new About({ $$inline: true });
    	gallery = new Gallery({ $$inline: true });
    	printgallery = new PrintGallery({ $$inline: true });
    	whatsnext = new WhatsNext({ $$inline: true });
    	credits = new Credits({ $$inline: true });
    	footer = new Footer({ $$inline: true });
    	let if_block = /*$activeCard*/ ctx[1] && /*$cardDescriptionEnabled*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = text("Thankyou for everyone at Riptide for your support! Together we raised $1233 for ");
    			a0 = element("a");
    			a0.textContent = "We All Code";
    			t3 = text(". We're now back in hiatus mode. For updates, join our\n    ");
    			a1 = element("a");
    			a1.textContent = "Discord Server";
    			t5 = text("\n    or\n    ");
    			a2 = element("a");
    			a2.textContent = "Mailing List";
    			t7 = text(".");
    			t8 = space();
    			create_component(about.$$.fragment);
    			t9 = space();
    			create_component(gallery.$$.fragment);
    			t10 = space();
    			create_component(printgallery.$$.fragment);
    			t11 = space();
    			create_component(whatsnext.$$.fragment);
    			t12 = space();
    			create_component(credits.$$.fragment);
    			t13 = space();
    			create_component(footer.$$.fragment);
    			t14 = space();
    			if (if_block) if_block.c();
    			attr_dev(a0, "href", "https://www.weallcode.org/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noreferrer");
    			attr_dev(a0, "class", "svelte-1us38hv");
    			add_location(a0, file, 36, 84, 1503);
    			attr_dev(a1, "href", "https://discord.gg/Be9XqKmVwf");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noreferrer");
    			attr_dev(a1, "class", "svelte-1us38hv");
    			add_location(a1, file, 41, 4, 1670);
    			attr_dev(a2, "href", "https://forms.gle/keK7rG84gPcT7qit9");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noreferrer");
    			attr_dev(a2, "class", "svelte-1us38hv");
    			add_location(a2, file, 43, 4, 1773);
    			attr_dev(div, "class", "alert-banner svelte-1us38hv");
    			add_location(div, file, 35, 2, 1392);
    			set_style(main, "--gallery-width", /*$galleryWidth*/ ctx[0] + "px");
    			attr_dev(main, "class", "svelte-1us38hv");
    			add_location(main, file, 33, 0, 1323);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navigation, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			append_dev(div, t1);
    			append_dev(div, a0);
    			append_dev(div, t3);
    			append_dev(div, a1);
    			append_dev(div, t5);
    			append_dev(div, a2);
    			append_dev(div, t7);
    			append_dev(main, t8);
    			mount_component(about, main, null);
    			append_dev(main, t9);
    			mount_component(gallery, main, null);
    			append_dev(main, t10);
    			mount_component(printgallery, main, null);
    			append_dev(main, t11);
    			mount_component(whatsnext, main, null);
    			append_dev(main, t12);
    			mount_component(credits, main, null);
    			append_dev(main, t13);
    			mount_component(footer, main, null);
    			append_dev(main, t14);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeCard*/ ctx[1] && /*$cardDescriptionEnabled*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*$galleryWidth*/ 1) {
    				set_style(main, "--gallery-width", /*$galleryWidth*/ ctx[0] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(gallery.$$.fragment, local);
    			transition_in(printgallery.$$.fragment, local);
    			transition_in(whatsnext.$$.fragment, local);
    			transition_in(credits.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(gallery.$$.fragment, local);
    			transition_out(printgallery.$$.fragment, local);
    			transition_out(whatsnext.$$.fragment, local);
    			transition_out(credits.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navigation);
    			destroy_component(about);
    			destroy_component(gallery);
    			destroy_component(printgallery);
    			destroy_component(whatsnext);
    			destroy_component(credits);
    			destroy_component(footer);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $lang;
    	let $titleFontSize;
    	let $galleryWidth;
    	let $activeCard;
    	let $cardDescriptionEnabled;
    	validate_store(lang, 'lang');
    	component_subscribe($$self, lang, $$value => $$invalidate(5, $lang = $$value));
    	validate_store(titleFontSize, 'titleFontSize');
    	component_subscribe($$self, titleFontSize, $$value => $$invalidate(6, $titleFontSize = $$value));
    	validate_store(galleryWidth, 'galleryWidth');
    	component_subscribe($$self, galleryWidth, $$value => $$invalidate(0, $galleryWidth = $$value));
    	validate_store(activeCard, 'activeCard');
    	component_subscribe($$self, activeCard, $$value => $$invalidate(1, $activeCard = $$value));
    	validate_store(cardDescriptionEnabled, 'cardDescriptionEnabled');
    	component_subscribe($$self, cardDescriptionEnabled, $$value => $$invalidate(2, $cardDescriptionEnabled = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const closeDetail = () => {
    		activeCardNumber.set(undefined);
    	};

    	let splatoon1Font = 'Splatoon1, sans-serif';
    	document.body.style.setProperty('--splatoon1-font-family', splatoon1Font);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		About,
    		Credits,
    		Footer,
    		Navigation,
    		WhatsNext,
    		Gallery,
    		PrintGallery,
    		activeCard,
    		activeCardNumber,
    		cardDescriptionEnabled,
    		galleryWidth,
    		lang,
    		titleFontSize,
    		closeDetail,
    		splatoon1Font,
    		$lang,
    		$titleFontSize,
    		$galleryWidth,
    		$activeCard,
    		$cardDescriptionEnabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('splatoon1Font' in $$props) $$invalidate(4, splatoon1Font = $$props.splatoon1Font);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$titleFontSize*/ 64) {
    			document.body.style.setProperty('--title-font-size', $titleFontSize.toString());
    		}

    		if ($$self.$$.dirty & /*$lang, splatoon1Font*/ 48) {
    			{
    				if ($lang === 'ja_JP') {
    					$$invalidate(4, splatoon1Font = "Splatoon1, 'Splatoon1_ja_JP', 'DFPZongYiW9-GB', sans-serif");
    				} else if ($lang === 'zh_CN') {
    					$$invalidate(4, splatoon1Font = "Splatoon1, 'Splatoon1_zh_CN', 'DFPZongYiW9-GB', sans-serif");
    				} else if ($lang === 'zh_TW') {
    					$$invalidate(4, splatoon1Font = "Splatoon1, 'Splatoon1_zh_TW', 'DFPZongYiW9-GB', sans-serif");
    				} else {
    					$$invalidate(4, splatoon1Font = 'Splatoon1, sans-serif');
    				}

    				document.body.style.setProperty('--splatoon1-font-family', splatoon1Font);
    			}
    		}
    	};

    	return [
    		$galleryWidth,
    		$activeCard,
    		$cardDescriptionEnabled,
    		closeDetail,
    		splatoon1Font,
    		$lang,
    		$titleFontSize
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {},
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
