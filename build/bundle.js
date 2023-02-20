
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
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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

    /* src/About.svelte generated by Svelte v3.52.0 */

    const file$g = "src/About.svelte";

    function create_fragment$h(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let p0;
    	let strong0;
    	let t3;
    	let i0;
    	let t5;
    	let t6;
    	let p1;
    	let strong1;
    	let t8;
    	let i1;
    	let t10;
    	let t11;
    	let p2;
    	let t13;
    	let p3;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "About";
    			t1 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "arty";
    			t3 = space();
    			i0 = element("i");
    			i0.textContent = "[ahr-tee]";
    			t5 = text("\n    Inclined towards the arts");
    			t6 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "siege";
    			t8 = space();
    			i1 = element("i");
    			i1.textContent = "[seej]";
    			t10 = text("\n    A blockade or assault on a territory");
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "“Arty Siege” describes the gameplay of Tableturf - territory control using ink. Players are often jostling to cut\n    each other off or to box their opponent in.";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "It also contains some of the same sounds as “our TCG”, a reference to the acronym for “Trading Card Game”.";
    			add_location(h2, file$g, 1, 2, 9);
    			attr_dev(strong0, "class", "svelte-e3t3o");
    			add_location(strong0, file$g, 3, 4, 34);
    			add_location(i0, file$g, 3, 26, 56);
    			add_location(p0, file$g, 2, 2, 26);
    			attr_dev(strong1, "class", "svelte-e3t3o");
    			add_location(strong1, file$g, 7, 4, 120);
    			add_location(i1, file$g, 7, 27, 143);
    			add_location(p1, file$g, 6, 2, 112);
    			add_location(p2, file$g, 10, 2, 207);
    			add_location(p3, file$g, 14, 2, 386);
    			add_location(main, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, p0);
    			append_dev(p0, strong0);
    			append_dev(p0, t3);
    			append_dev(p0, i0);
    			append_dev(p0, t5);
    			append_dev(main, t6);
    			append_dev(main, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t8);
    			append_dev(p1, i1);
    			append_dev(p1, t10);
    			append_dev(main, t11);
    			append_dev(main, p2);
    			append_dev(main, t13);
    			append_dev(main, p3);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
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

    /* node_modules/svelte-virtual/grid/Grid.svelte generated by Svelte v3.52.0 */
    const file$f = "node_modules/svelte-virtual/grid/Grid.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	const constants_0 = /*getItemStyle*/ child_ctx[10](/*index*/ child_ctx[38]);
    	child_ctx[39] = constants_0;
    	return child_ctx;
    }

    const get_placeholder_slot_changes = dirty => ({
    	index: dirty[0] & /*indexes*/ 128,
    	style: dirty[0] & /*indexes*/ 128
    });

    const get_placeholder_slot_context = ctx => ({
    	index: /*index*/ ctx[38],
    	style: /*style*/ ctx[39]
    });

    const get_item_slot_changes = dirty => ({
    	index: dirty[0] & /*indexes*/ 128,
    	style: dirty[0] & /*indexes*/ 128
    });

    const get_item_slot_context = ctx => ({
    	index: /*index*/ ctx[38],
    	style: /*style*/ ctx[39]
    });

    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    // (131:1) {#if $$slots.header}
    function create_if_block_1$1(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	const header_slot_template = /*#slots*/ ctx[27].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[26], get_header_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (header_slot) header_slot.c();
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[28].call(div));
    			add_location(div, file$f, 131, 2, 3842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (header_slot) {
    				header_slot.m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[28].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[26], dirty, get_header_slot_changes),
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(131:1) {#if $$slots.header}",
    		ctx
    	});

    	return block;
    }

    // (143:3) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const placeholder_slot_template = /*#slots*/ ctx[27].placeholder;
    	const placeholder_slot = create_slot(placeholder_slot_template, ctx, /*$$scope*/ ctx[26], get_placeholder_slot_context);
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
    				if (placeholder_slot.p && (!current || dirty[0] & /*$$scope, indexes*/ 67108992)) {
    					update_slot_base(
    						placeholder_slot,
    						placeholder_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(placeholder_slot_template, /*$$scope*/ ctx[26], dirty, get_placeholder_slot_changes),
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(143:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (141:3) {#if !isScrollingFast || !$$slots.placeholder}
    function create_if_block$2(ctx) {
    	let current;
    	const item_slot_template = /*#slots*/ ctx[27].item;
    	const item_slot = create_slot(item_slot_template, ctx, /*$$scope*/ ctx[26], get_item_slot_context);
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
    				if (item_slot.p && (!current || dirty[0] & /*$$scope, indexes*/ 67108992)) {
    					update_slot_base(
    						item_slot,
    						item_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(item_slot_template, /*$$scope*/ ctx[26], dirty, get_item_slot_changes),
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(141:3) {#if !isScrollingFast || !$$slots.placeholder}",
    		ctx
    	});

    	return block;
    }

    // (144:45) Missing placeholder
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
    		source: "(144:45) Missing placeholder",
    		ctx
    	});

    	return block;
    }

    // (142:38) Missing template
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
    		source: "(142:38) Missing template",
    		ctx
    	});

    	return block;
    }

    // (138:2) {#each indexes as index (getKey ? getKey(index) : index)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(138:2) {#each indexes as index (getKey ? getKey(index) : index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
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
    	let if_block = /*$$slots*/ ctx[12].header && create_if_block_1$1(ctx);
    	let each_value = /*indexes*/ ctx[7];
    	validate_each_argument(each_value);

    	const get_key = ctx => /*getKey*/ ctx[2]
    	? /*getKey*/ ctx[2](/*index*/ ctx[38])
    	: /*index*/ ctx[38];

    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const footer_slot_template = /*#slots*/ ctx[27].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[26], get_footer_slot_context);

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
    			add_location(div0, file$f, 136, 1, 3925);
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[30].call(div1));
    			set_style(div1, "position", `relative`);
    			set_style(div1, "overflow", `auto`);
    			set_style(div1, "height", style_height_1);
    			set_style(div1, "width", /*width*/ ctx[1]);
    			add_location(div1, file$f, 120, 0, 3645);
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

    			/*div1_binding*/ ctx[29](div1);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[30].bind(div1));
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
    					if_block = create_if_block_1$1(ctx);
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

    			if (dirty[0] & /*$$scope, indexes, getItemStyle, isScrollingFast, $$slots, getKey*/ 67114372) {
    				each_value = /*indexes*/ ctx[7];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}

    			if (dirty[0] & /*innerHeight*/ 512 && style_height !== (style_height = `${/*innerHeight*/ ctx[9]}px`)) {
    				set_style(div0, "height", style_height);
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[26], dirty, get_footer_slot_changes),
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
    			/*div1_binding*/ ctx[29](null);
    			div1_resize_listener();
    			mounted = false;
    			dispose();
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

    const scrollStop = scrollStop$1();
    const _scrollSpeed = scrollSpeed();

    function instance$g($$self, $$props, $$invalidate) {
    	let columnCount;
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
    	let { width = "100%" } = $$props;
    	let { overScan = 1 } = $$props;
    	let { marginLeft = 0 } = $$props;
    	let { marginTop = 0 } = $$props;
    	let { scrollPosition = 0 } = $$props;
    	let { scrollBehavior = "auto" } = $$props;
    	let { getKey = void 0 } = $$props;
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
    		scrollTo((Math.ceil((index + 1) / columnCount) - 1) * itemHeight + marginTop, behavior);
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

    	const scrollToManual = scrollPosition2 => {
    		if (!manualScroll && !isScrolling) {
    			manualScroll = true;

    			grid.scrollTo({
    				top: scrollPosition2 + headerHeight,
    				behavior: scrollBehavior
    			});

    			manualScroll = false;
    		}
    	};

    	const round = {
    		ceil: (x, multiple) => Math.ceil(x / multiple) * multiple,
    		floor: (x, multiple) => ~~(x / multiple) * multiple
    	};

    	const getIndexes = (itemCount2, itemHeight2, height2, columnCount2, overScanColumn2, scrollPosition2) => {
    		const indexes2 = [];
    		const startIndexTemp = round.floor(scrollPosition2 / itemHeight2 * columnCount2, columnCount2);

    		const startIndexOverScan = startIndexTemp > overScanColumn2
    		? startIndexTemp - overScanColumn2
    		: 0;

    		const startIndex = startIndexTemp > 0 && startIndexOverScan >= 0
    		? startIndexOverScan
    		: startIndexTemp;

    		const endIndexTemp = Math.min(itemCount2, round.ceil((scrollPosition2 + height2) / itemHeight2 * columnCount2, columnCount2));
    		const endIndexOverScan = endIndexTemp + overScanColumn2;

    		const endIndex = endIndexOverScan < itemCount2
    		? endIndexOverScan
    		: itemCount2;

    		for (let i = 0; i < endIndex - startIndex; i++) indexes2.push(i + startIndex);
    		return indexes2;
    	};

    	const getItemStyle = index => `position: absolute; transform: translate3d(${index % columnCount * itemWidth + marginLeft}px, ${(Math.ceil((index + 1) / columnCount) - 1) * itemHeight + marginTop}px, 0px); height: ${itemHeight}px; width: ${itemWidth}px; will-change: transform;`;

    	const onScroll = ({ currentTarget }) => {
    		isScrolling = true;

    		if (!manualScroll) {
    			$$invalidate(23, _scrollPosition = Math.max(0, currentTarget.scrollTop - headerHeight));
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
    		'getKey'
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
    		if ('$$scope' in $$props) $$invalidate(26, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_scrollStop: scrollStop$1,
    		__scrollSpeed: scrollSpeed,
    		scrollStop,
    		_scrollSpeed,
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
    		round,
    		getIndexes,
    		getItemStyle,
    		onScroll,
    		scrollSpeed: scrollSpeed$1,
    		overScanColumn,
    		columnCount,
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
    		if ('grid' in $$props) $$invalidate(3, grid = $$props.grid);
    		if ('_scrollPosition' in $$props) $$invalidate(23, _scrollPosition = $$props._scrollPosition);
    		if ('headerHeight' in $$props) $$invalidate(6, headerHeight = $$props.headerHeight);
    		if ('offsetWidth' in $$props) $$invalidate(4, offsetWidth = $$props.offsetWidth);
    		if ('clientWidth' in $$props) $$invalidate(5, clientWidth = $$props.clientWidth);
    		if ('indexes' in $$props) $$invalidate(7, indexes = $$props.indexes);
    		if ('manualScroll' in $$props) manualScroll = $$props.manualScroll;
    		if ('isScrolling' in $$props) isScrolling = $$props.isScrolling;
    		if ('isScrollingFast' in $$props) $$invalidate(8, isScrollingFast = $$props.isScrollingFast);
    		if ('scrollSpeed' in $$props) scrollSpeed$1 = $$props.scrollSpeed;
    		if ('overScanColumn' in $$props) $$invalidate(24, overScanColumn = $$props.overScanColumn);
    		if ('columnCount' in $$props) $$invalidate(25, columnCount = $$props.columnCount);
    		if ('innerHeight' in $$props) $$invalidate(9, innerHeight = $$props.innerHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*offsetWidth, marginLeft, clientWidth, itemWidth*/ 327728) {
    			$$invalidate(25, columnCount = Math.max(~~((offsetWidth - marginLeft - (offsetWidth - clientWidth)) / itemWidth), 1));
    		}

    		if ($$self.$$.dirty[0] & /*itemCount, columnCount, itemHeight, height*/ 33603585) {
    			$$invalidate(9, innerHeight = Math.max(round.ceil(itemCount, columnCount) * itemHeight / columnCount, height));
    		}

    		if ($$self.$$.dirty[0] & /*columnCount, overScan*/ 33685504) {
    			$$invalidate(24, overScanColumn = columnCount * overScan);
    		}

    		if ($$self.$$.dirty[0] & /*offsetWidth, itemCount, itemHeight, height, columnCount, overScanColumn, _scrollPosition*/ 58769425) {
    			if (offsetWidth) {
    				$$invalidate(7, indexes = getIndexes(itemCount, itemHeight, height, columnCount, overScanColumn, _scrollPosition));
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
    		getItemStyle,
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
    		scrollToIndex,
    		scrollToPosition,
    		_scrollPosition,
    		overScanColumn,
    		columnCount,
    		$$scope,
    		slots,
    		div_elementresize_handler,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class Grid$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
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
    				scrollToIndex: 21,
    				scrollToPosition: 22
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$g.name
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

    	get scrollToIndex() {
    		return this.$$.ctx[21];
    	}

    	set scrollToIndex(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToPosition() {
    		return this.$$.ctx[22];
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

    /* src/card/face/Art.svelte generated by Svelte v3.52.0 */
    const file$e = "src/card/face/Art.svelte";

    function create_fragment$f(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "illustrated_front svelte-1if6st0");
    			if (!src_url_equal(img.src, img_src_value = /*img_url*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "" + (/*card*/ ctx[1].name + " illustrated by " + /*card*/ ctx[1].artist));
    			attr_dev(img, "loading", "lazy");
    			add_location(img, file$e, 18, 0, 406);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "load", /*imageLoader*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*img_url*/ 1 && !src_url_equal(img.src, img_src_value = /*img_url*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
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

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Art', slots, []);
    	const card = getCardContext();
    	let loading = true;

    	const imageLoader = e => {
    		loading = false;
    	};

    	let img_base = card.img.startsWith('http') ? '' : './img/';
    	let img_url = '';
    	img_url = img_base + card.img;
    	img_url = img_url.replace('.png', '.webp');
    	img_url = img_url.replace('./CardArtRedraw', './CardArtWebp');
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Art> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getCardContext,
    		card,
    		loading,
    		imageLoader,
    		img_base,
    		img_url
    	});

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) loading = $$props.loading;
    		if ('img_base' in $$props) img_base = $$props.img_base;
    		if ('img_url' in $$props) $$invalidate(0, img_url = $$props.img_url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [img_url, card, imageLoader];
    }

    class Art extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Art",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/card/face/ArtistCredit.svelte generated by Svelte v3.52.0 */
    const file$d = "src/card/face/ArtistCredit.svelte";

    function create_fragment$e(ctx) {
    	let illus;

    	const block = {
    		c: function create() {
    			illus = element("illus");
    			illus.textContent = `Illus. ${/*card*/ ctx[0].artist}`;
    			attr_dev(illus, "class", "svelte-1t8dw27");
    			add_location(illus, file$d, 5, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, illus, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(illus);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArtistCredit', slots, []);
    	const card = getCardContext();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArtistCredit> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getCardContext, card });
    	return [card];
    }

    class ArtistCredit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArtistCredit",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/card/face/Grid.svelte generated by Svelte v3.52.0 */
    const file$c = "src/card/face/Grid.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (9:6) {#each Array(8) as _, j}
    function create_each_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "grid-space svelte-47yexu");
    			attr_dev(div, "data-space-type", /*card*/ ctx[0].grid[/*i*/ ctx[3]]?.[/*j*/ ctx[5]]);
    			add_location(div, file$c, 9, 8, 221);
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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(9:6) {#each Array(8) as _, j}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each Array(8) as _, i}
    function create_each_block$3(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Array(8);
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
    			if (dirty & /*card*/ 1) {
    				each_value_1 = Array(8);
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(8:4) {#each Array(8) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div1;
    	let div0;
    	let each_value = Array(8);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "grid svelte-47yexu");
    			add_location(div0, file$c, 6, 2, 134);
    			attr_dev(div1, "class", "grid-wrapper svelte-47yexu");
    			add_location(div1, file$c, 5, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, card*/ 1) {
    				each_value = Array(8);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
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

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	const card = getCardContext();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getCardContext, card });
    	return [card];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/card/face/Numbering.svelte generated by Svelte v3.52.0 */
    const file$b = "src/card/face/Numbering.svelte";

    function create_fragment$c(ctx) {
    	let numbering;
    	let span0;
    	let t3;
    	let span1;

    	const block = {
    		c: function create() {
    			numbering = element("numbering");
    			span0 = element("span");
    			span0.textContent = `${/*card*/ ctx[0].seriesNumber}/${/*card*/ ctx[0].seriesTotal}`;
    			t3 = space();
    			span1 = element("span");
    			add_location(span0, file$b, 6, 2, 119);
    			attr_dev(span1, "class", "set set-" + /*card*/ ctx[0].series + " svelte-1yx2fr7");
    			add_location(span1, file$b, 9, 2, 181);
    			attr_dev(numbering, "class", "svelte-1yx2fr7");
    			add_location(numbering, file$b, 5, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, numbering, anchor);
    			append_dev(numbering, span0);
    			append_dev(numbering, t3);
    			append_dev(numbering, span1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(numbering);
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

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Numbering', slots, []);
    	const card = getCardContext();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Numbering> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getCardContext, card });
    	return [card];
    }

    class Numbering extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Numbering",
    			options,
    			id: create_fragment$c.name
    		});
    	}
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

    /* src/card/face/Points.svelte generated by Svelte v3.52.0 */
    const file$a = "src/card/face/Points.svelte";

    function create_fragment$b(ctx) {
    	let points;
    	let svg;
    	let text0;
    	let t0_value = /*card*/ ctx[0].points + "";
    	let t0;
    	let text1;
    	let t1_value = /*card*/ ctx[0].points + "";
    	let t1;

    	const block = {
    		c: function create() {
    			points = element("points");
    			svg = svg_element("svg");
    			text0 = svg_element("text");
    			t0 = text(t0_value);
    			text1 = svg_element("text");
    			t1 = text(t1_value);
    			attr_dev(text0, "class", "stroke svelte-19do8p");
    			attr_dev(text0, "x", "50%");
    			attr_dev(text0, "y", "50%");
    			attr_dev(text0, "dominant-baseline", "central");
    			attr_dev(text0, "text-anchor", "middle");
    			add_location(text0, file$a, 8, 4, 192);
    			attr_dev(text1, "class", "fill svelte-19do8p");
    			attr_dev(text1, "x", "50%");
    			attr_dev(text1, "y", "50%");
    			attr_dev(text1, "dominant-baseline", "central");
    			attr_dev(text1, "text-anchor", "middle");
    			add_location(text1, file$a, 9, 4, 303);
    			attr_dev(svg, "class", "svelte-19do8p");
    			add_location(svg, file$a, 7, 2, 182);
    			attr_dev(points, "class", "" + (null_to_empty(/*card*/ ctx[0].rarity) + " svelte-19do8p"));
    			add_location(points, file$a, 6, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, points, anchor);
    			append_dev(points, svg);
    			append_dev(svg, text0);
    			append_dev(text0, t0);
    			append_dev(svg, text1);
    			append_dev(text1, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(points);
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
    	validate_slots('Points', slots, []);
    	const card = getCardContext();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Points> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getCardContext, styles, card });
    	return [card];
    }

    class Points extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Points",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/card/face/Special.svelte generated by Svelte v3.52.0 */
    const file$9 = "src/card/face/Special.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (7:2) {#each Array(card.specialCost) as _, i}
    function create_each_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "class", "special-square svelte-1ldcq0r");
    			add_location(div, file$9, 7, 4, 200);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(7:2) {#each Array(card.specialCost) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let special;
    	let each_value = Array(/*card*/ ctx[0].specialCost);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			special = element("special");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(special, "alt", "Special Cost: " + /*card*/ ctx[0].specialCost);
    			attr_dev(special, "class", "svelte-1ldcq0r");
    			add_location(special, file$9, 5, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, special, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(special, null);
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(special);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('Special', slots, []);
    	const card = getCardContext();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Special> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getCardContext, card });
    	return [card];
    }

    class Special extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Special",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/card/face/Title.svelte generated by Svelte v3.52.0 */
    const file$8 = "src/card/face/Title.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let header;
    	let span;
    	let raw_value = /*card*/ ctx[3].nameParts.join('<br />') + "";
    	let header_resize_listener;
    	let div_resize_listener;

    	const block = {
    		c: function create() {
    			div = element("div");
    			header = element("header");
    			span = element("span");
    			set_style(span, "--dropShadow", /*$styles*/ ctx[2].shadows);
    			attr_dev(span, "class", "" + (null_to_empty(/*card*/ ctx[3].rarity) + " svelte-9za8gz"));
    			add_location(span, file$8, 18, 4, 603);
    			set_style(header, "--name-width", /*nameWidth*/ ctx[0]);
    			set_style(header, "--header-scale", Math.min(1, /*wrapperWidth*/ ctx[1] * 0.64 / /*nameWidth*/ ctx[0]));
    			attr_dev(header, "class", "svelte-9za8gz");
    			add_render_callback(() => /*header_elementresize_handler*/ ctx[4].call(header));
    			add_location(header, file$8, 14, 2, 451);
    			attr_dev(div, "class", "header-wrapper svelte-9za8gz");
    			set_style(div, "--wrapper-width", /*wrapperWidth*/ ctx[1]);
    			set_style(div, "--wrapper-height-scale", /*card*/ ctx[3].nameParts.length > 1 ? 6 : 5.5);
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[5].call(div));
    			add_location(div, file$8, 8, 0, 194);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, header);
    			append_dev(header, span);
    			span.innerHTML = raw_value;
    			header_resize_listener = add_resize_listener(header, /*header_elementresize_handler*/ ctx[4].bind(header));
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[5].bind(div));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$styles*/ 4) {
    				set_style(span, "--dropShadow", /*$styles*/ ctx[2].shadows);
    			}

    			if (dirty & /*nameWidth*/ 1) {
    				set_style(header, "--name-width", /*nameWidth*/ ctx[0]);
    			}

    			if (dirty & /*wrapperWidth, nameWidth*/ 3) {
    				set_style(header, "--header-scale", Math.min(1, /*wrapperWidth*/ ctx[1] * 0.64 / /*nameWidth*/ ctx[0]));
    			}

    			if (dirty & /*wrapperWidth*/ 2) {
    				set_style(div, "--wrapper-width", /*wrapperWidth*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			header_resize_listener();
    			div_resize_listener();
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
    	let $styles;
    	validate_store(styles, 'styles');
    	component_subscribe($$self, styles, $$value => $$invalidate(2, $styles = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	const card = getCardContext();
    	let nameWidth = 1;
    	let wrapperWidth = 1;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	function header_elementresize_handler() {
    		nameWidth = this.clientWidth;
    		$$invalidate(0, nameWidth);
    	}

    	function div_elementresize_handler() {
    		wrapperWidth = this.clientWidth;
    		$$invalidate(1, wrapperWidth);
    	}

    	$$self.$capture_state = () => ({
    		getCardContext,
    		styles,
    		card,
    		nameWidth,
    		wrapperWidth,
    		$styles
    	});

    	$$self.$inject_state = $$props => {
    		if ('nameWidth' in $$props) $$invalidate(0, nameWidth = $$props.nameWidth);
    		if ('wrapperWidth' in $$props) $$invalidate(1, wrapperWidth = $$props.wrapperWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		nameWidth,
    		wrapperWidth,
    		$styles,
    		card,
    		header_elementresize_handler,
    		div_elementresize_handler
    	];
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

    /* src/card/face/Face.svelte generated by Svelte v3.52.0 */
    const file$7 = "src/card/face/Face.svelte";

    function create_fragment$8(ctx) {
    	let face;
    	let art;
    	let t0;
    	let points;
    	let t1;
    	let title;
    	let t2;
    	let special;
    	let t3;
    	let grid;
    	let t4;
    	let artistcredit;
    	let t5;
    	let numbering;
    	let current;
    	art = new Art({ $$inline: true });
    	points = new Points({ $$inline: true });
    	title = new Title({ $$inline: true });
    	special = new Special({ $$inline: true });
    	grid = new Grid({ $$inline: true });
    	artistcredit = new ArtistCredit({ $$inline: true });
    	numbering = new Numbering({ $$inline: true });

    	const block = {
    		c: function create() {
    			face = element("face");
    			create_component(art.$$.fragment);
    			t0 = space();
    			create_component(points.$$.fragment);
    			t1 = space();
    			create_component(title.$$.fragment);
    			t2 = space();
    			create_component(special.$$.fragment);
    			t3 = space();
    			create_component(grid.$$.fragment);
    			t4 = space();
    			create_component(artistcredit.$$.fragment);
    			t5 = space();
    			create_component(numbering.$$.fragment);
    			attr_dev(face, "class", "svelte-1wyqw8q");
    			add_location(face, file$7, 10, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, face, anchor);
    			mount_component(art, face, null);
    			append_dev(face, t0);
    			mount_component(points, face, null);
    			append_dev(face, t1);
    			mount_component(title, face, null);
    			append_dev(face, t2);
    			mount_component(special, face, null);
    			append_dev(face, t3);
    			mount_component(grid, face, null);
    			append_dev(face, t4);
    			mount_component(artistcredit, face, null);
    			append_dev(face, t5);
    			mount_component(numbering, face, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(art.$$.fragment, local);
    			transition_in(points.$$.fragment, local);
    			transition_in(title.$$.fragment, local);
    			transition_in(special.$$.fragment, local);
    			transition_in(grid.$$.fragment, local);
    			transition_in(artistcredit.$$.fragment, local);
    			transition_in(numbering.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(art.$$.fragment, local);
    			transition_out(points.$$.fragment, local);
    			transition_out(title.$$.fragment, local);
    			transition_out(special.$$.fragment, local);
    			transition_out(grid.$$.fragment, local);
    			transition_out(artistcredit.$$.fragment, local);
    			transition_out(numbering.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(face);
    			destroy_component(art);
    			destroy_component(points);
    			destroy_component(title);
    			destroy_component(special);
    			destroy_component(grid);
    			destroy_component(artistcredit);
    			destroy_component(numbering);
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

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Face', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Face> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Art,
    		ArtistCredit,
    		Grid,
    		Numbering,
    		Points,
    		Special,
    		Title
    	});

    	return [];
    }

    class Face extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Face",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/card/face/Glare.svelte generated by Svelte v3.52.0 */

    const file$6 = "src/card/face/Glare.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "glare " + /*rarity*/ ctx[0] + " svelte-jhd6we");
    			add_location(div, file$6, 4, 0, 51);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { rarity: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Glare",
    			options,
    			id: create_fragment$7.name
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
    const file$5 = "src/card/face/Holo.svelte";

    function create_fragment$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "holo " + /*card*/ ctx[0].rarity + " svelte-1d83e6t");
    			add_location(div, file$5, 5, 0, 105);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Holo",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/card/Card.svelte generated by Svelte v3.52.0 */
    const file$4 = "src/card/Card.svelte";

    function create_fragment$5(ctx) {
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
    	let holo;
    	let t2;
    	let face;
    	let t3;
    	let glare;
    	let current;
    	let mounted;
    	let dispose;
    	holo = new Holo({ $$inline: true });
    	face = new Face({ $$inline: true });
    	glare = new Glare({ $$inline: true });

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
    			create_component(holo.$$.fragment);
    			t2 = space();
    			create_component(face.$$.fragment);
    			t3 = space();
    			create_component(glare.$$.fragment);
    			attr_dev(img0, "class", "card_back svelte-15w3wuo");
    			if (!src_url_equal(img0.src, img0_src_value = "./img/UI/CardBack.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "The back of an Arty Siege card, showing the logo and splatters");
    			attr_dev(img0, "loading", "lazy");
    			add_location(img0, file$4, 65, 4, 1869);
    			attr_dev(img1, "class", "rarity_back svelte-15w3wuo");
    			if (!src_url_equal(img1.src, img1_src_value = /*card_front_background*/ ctx[3])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "aria-hidden", "true");
    			attr_dev(img1, "alt", "Background for " + /*card*/ ctx[12].rarity + " card");
    			attr_dev(img1, "loading", "lazy");
    			add_location(img1, file$4, 73, 8, 2084);
    			add_location(div0, file$4, 72, 6, 2070);
    			attr_dev(div1, "class", "card_front svelte-15w3wuo");
    			add_location(div1, file$4, 71, 4, 2039);
    			attr_dev(div2, "class", "tilt svelte-15w3wuo");
    			set_style(div2, "--mx", /*mx*/ ctx[7] + "px");
    			set_style(div2, "--my", /*my*/ ctx[8] + "px");
    			set_style(div2, "transform", "rotateX(" + /*x*/ ctx[5] + "deg) rotateY(" + /*y*/ ctx[6] + "deg)");
    			set_style(div2, "--posx", /*posx*/ ctx[9] + "%");
    			set_style(div2, "--posy", /*posy*/ ctx[10] + "%");
    			set_style(div2, "--o", /*o*/ ctx[11]);
    			add_location(div2, file$4, 60, 2, 1692);
    			attr_dev(card_1, "style", /*style*/ ctx[1]);
    			attr_dev(card_1, "class", "svelte-15w3wuo");
    			toggle_class(card_1, "active", /*active*/ ctx[0]);
    			toggle_class(card_1, "pagebreak", /*pagebreak*/ ctx[2]);
    			add_location(card_1, file$4, 59, 0, 1590);
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
    			mount_component(holo, div1, null);
    			append_dev(div1, t2);
    			mount_component(face, div1, null);
    			append_dev(div1, t3);
    			mount_component(glare, div1, null);
    			/*div2_binding*/ ctx[15](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(card_1, "mousemove", /*onMouseMove*/ ctx[13], false, false, false),
    					listen_dev(card_1, "mouseleave", /*onMouseLeave*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*card_front_background*/ 8 && !src_url_equal(img1.src, img1_src_value = /*card_front_background*/ ctx[3])) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (!current || dirty & /*mx*/ 128) {
    				set_style(div2, "--mx", /*mx*/ ctx[7] + "px");
    			}

    			if (!current || dirty & /*my*/ 256) {
    				set_style(div2, "--my", /*my*/ ctx[8] + "px");
    			}

    			if (!current || dirty & /*x, y*/ 96) {
    				set_style(div2, "transform", "rotateX(" + /*x*/ ctx[5] + "deg) rotateY(" + /*y*/ ctx[6] + "deg)");
    			}

    			if (!current || dirty & /*posx*/ 512) {
    				set_style(div2, "--posx", /*posx*/ ctx[9] + "%");
    			}

    			if (!current || dirty & /*posy*/ 1024) {
    				set_style(div2, "--posy", /*posy*/ ctx[10] + "%");
    			}

    			if (!current || dirty & /*o*/ 2048) {
    				set_style(div2, "--o", /*o*/ ctx[11]);
    			}

    			if (!current || dirty & /*style*/ 2) {
    				attr_dev(card_1, "style", /*style*/ ctx[1]);
    			}

    			if (!current || dirty & /*active*/ 1) {
    				toggle_class(card_1, "active", /*active*/ ctx[0]);
    			}

    			if (!current || dirty & /*pagebreak*/ 4) {
    				toggle_class(card_1, "pagebreak", /*pagebreak*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(holo.$$.fragment, local);
    			transition_in(face.$$.fragment, local);
    			transition_in(glare.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(holo.$$.fragment, local);
    			transition_out(face.$$.fragment, local);
    			transition_out(glare.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(card_1);
    			destroy_component(holo);
    			destroy_component(face);
    			destroy_component(glare);
    			/*div2_binding*/ ctx[15](null);
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

    const multiple = 10;

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	const card = getCardContext();
    	const interaction = getContext('interaction');
    	let { active = false } = $$props;
    	let { style } = $$props;
    	let { pagebreak = false } = $$props;
    	let loading = true;

    	const imageLoader = e => {
    		loading = false;
    	};

    	let card_front_background = './img/UI/CardBackground_Grey.webp';

    	if (card.rarity === 'rare') {
    		card_front_background = './img/UI/CardBackground_Gold.webp';
    	} else if (card.rarity === 'fresh') {
    		card_front_background = './img/UI/CardBackground_Fresh.webp';
    	}

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

    	function transformElement(mouseX, mouseY) {
    		let box = tiltBox.getBoundingClientRect();
    		$$invalidate(5, x = (mouseY - box.y - box.height / 2) / multiple);
    		$$invalidate(6, y = -(mouseX - box.x - box.width / 2) / multiple);
    		$$invalidate(7, mx = mouseX - box.x);
    		$$invalidate(8, my = mouseY - box.y);
    		$$invalidate(9, posx = 100 * (mx / box.width));
    		$$invalidate(10, posy = 100 * (my / box.height));
    		$$invalidate(11, o = 1);
    	}

    	const onMouseMove = e => {
    		window.requestAnimationFrame(function () {
    			transformElement(e.clientX, e.clientY);
    		});
    	};

    	const onMouseLeave = e => {
    		window.requestAnimationFrame(function () {
    			$$invalidate(5, x = 0);
    			$$invalidate(6, y = 0);
    			$$invalidate(9, posx = 50);
    			$$invalidate(10, posy = 50);
    		});

    		$$invalidate(11, o = 0);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (style === undefined && !('style' in $$props || $$self.$$.bound[$$self.$$.props['style']])) {
    			console.warn("<Card> was created without expected prop 'style'");
    		}
    	});

    	const writable_props = ['active', 'style', 'pagebreak'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tiltBox = $$value;
    			$$invalidate(4, tiltBox);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('pagebreak' in $$props) $$invalidate(2, pagebreak = $$props.pagebreak);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Face,
    		getCardContext,
    		Glare,
    		Holo,
    		card,
    		interaction,
    		active,
    		style,
    		pagebreak,
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
    		transformElement,
    		onMouseMove,
    		onMouseLeave
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('pagebreak' in $$props) $$invalidate(2, pagebreak = $$props.pagebreak);
    		if ('loading' in $$props) loading = $$props.loading;
    		if ('card_front_background' in $$props) $$invalidate(3, card_front_background = $$props.card_front_background);
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
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		style,
    		pagebreak,
    		card_front_background,
    		tiltBox,
    		x,
    		y,
    		mx,
    		my,
    		posx,
    		posy,
    		o,
    		card,
    		onMouseMove,
    		onMouseLeave,
    		div2_binding
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { active: 0, style: 1, pagebreak: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get active() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    }

    /* src/card/Context.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1$1 } = globals;
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ style });

    function create_fragment$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], get_default_slot_context);

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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, get_default_slot_changes),
    						get_default_slot_context
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Context', slots, ['default']);
    	let { cardDetails } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { units } = $$props;

    	setContext('card', Object.assign(Object.assign({}, cardDetails), {
    		width,
    		height,
    		units,
    		name: cardDetails.nameParts.join(' '),
    		points: cardDetails.grid.join('').match(/[XS]/g).length
    	}));

    	let cardWidth;
    	let scale = 1;

    	$$self.$$.on_mount.push(function () {
    		if (cardDetails === undefined && !('cardDetails' in $$props || $$self.$$.bound[$$self.$$.props['cardDetails']])) {
    			console.warn("<Context> was created without expected prop 'cardDetails'");
    		}

    		if (width === undefined && !('width' in $$props || $$self.$$.bound[$$self.$$.props['width']])) {
    			console.warn("<Context> was created without expected prop 'width'");
    		}

    		if (height === undefined && !('height' in $$props || $$self.$$.bound[$$self.$$.props['height']])) {
    			console.warn("<Context> was created without expected prop 'height'");
    		}

    		if (units === undefined && !('units' in $$props || $$self.$$.bound[$$self.$$.props['units']])) {
    			console.warn("<Context> was created without expected prop 'units'");
    		}
    	});

    	const writable_props = ['cardDetails', 'width', 'height', 'units'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Context> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cardDetails' in $$props) $$invalidate(0, cardDetails = $$props.cardDetails);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('units' in $$props) $$invalidate(3, units = $$props.units);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		cardDetails,
    		width,
    		height,
    		units,
    		cardWidth,
    		scale
    	});

    	$$self.$inject_state = $$props => {
    		if ('cardDetails' in $$props) $$invalidate(0, cardDetails = $$props.cardDetails);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('units' in $$props) $$invalidate(3, units = $$props.units);
    		if ('cardWidth' in $$props) $$invalidate(7, cardWidth = $$props.cardWidth);
    		if ('scale' in $$props) scale = $$props.scale;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*units*/ 8) {
    			scale = units === 'px' ? 1 : cardWidth / ((744 + 71) / 2);
    		}
    	};

    	return [cardDetails, width, height, units, $$scope, slots];
    }

    class Context extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			cardDetails: 0,
    			width: 1,
    			height: 2,
    			units: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Context",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get cardDetails() {
    		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cardDetails(value) {
    		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get units() {
    		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set units(value) {
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

    /* src/card/Gallery.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1 } = globals;
    const file$3 = "src/card/Gallery.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (1:0) <script lang="ts">import 'svelte/internal'; import { Grid }
    function create_catch_block$1(ctx) {
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
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import 'svelte/internal'; import { Grid }",
    		ctx
    	});

    	return block;
    }

    // (48:2) {:then cards}
    function create_then_block$1(ctx) {
    	let div3;
    	let h30;
    	let t1;
    	let input;
    	let t2;
    	let h31;
    	let t4;
    	let div0;
    	let button0;
    	let t6;
    	let t7;
    	let div1;
    	let button1;
    	let t9;
    	let div2;
    	let select;
    	let option;
    	let t11;
    	let div4;
    	let previous_key = (/*displayFilter*/ ctx[0], /*search*/ ctx[1]);
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_3 = FeatureTypeFilterOptions;
    	validate_each_argument(each_value_3);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value = FeatureTypeFilterOptions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Search by artist:";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			h31 = element("h3");
    			h31.textContent = "Filter by card type:";
    			t4 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "All";
    			t6 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = "Jump to a random card!";
    			t9 = space();
    			div2 = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "All";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			div4 = element("div");
    			key_block.c();
    			add_location(h30, file$3, 49, 6, 1521);
    			add_location(input, file$3, 50, 6, 1554);
    			add_location(h31, file$3, 51, 6, 1590);
    			attr_dev(button0, "class", "featureTypeButton svelte-1n680hr");
    			toggle_class(button0, "selected", 'All' === /*displayFilter*/ ctx[0]);
    			add_location(button0, file$3, 53, 8, 1666);
    			attr_dev(div0, "class", "featureTypeButton svelte-1n680hr");
    			add_location(div0, file$3, 52, 6, 1626);
    			add_location(button1, file$3, 81, 8, 2690);
    			add_location(div1, file$3, 80, 6, 2676);
    			option.__value = "All";
    			option.value = option.__value;
    			add_location(option, file$3, 87, 10, 2938);
    			if (/*displayFilter*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[12].call(select));
    			add_location(select, file$3, 86, 8, 2892);
    			attr_dev(div2, "class", "featureTypeSelect svelte-1n680hr");
    			add_location(div2, file$3, 85, 6, 2852);
    			attr_dev(div3, "class", "filters");
    			add_location(div3, file$3, 48, 4, 1493);
    			add_location(div4, file$3, 104, 4, 3544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h30);
    			append_dev(div3, t1);
    			append_dev(div3, input);
    			set_input_value(input, /*search*/ ctx[1]);
    			append_dev(div3, t2);
    			append_dev(div3, h31);
    			append_dev(div3, t4);
    			append_dev(div3, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t6);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div1, button1);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*displayFilter*/ ctx[0]);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div4, anchor);
    			key_block.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[11], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*search*/ 2 && input.value !== /*search*/ ctx[1]) {
    				set_input_value(input, /*search*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*displayFilter*/ 1) {
    				toggle_class(button0, "selected", 'All' === /*displayFilter*/ ctx[0]);
    			}

    			if (dirty[0] & /*displayFilter, setDisplayFilter*/ 33) {
    				each_value_3 = FeatureTypeFilterOptions;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_3.length;
    			}

    			if (dirty & /*FeatureTypeFilterOptions, Object*/ 0) {
    				each_value = FeatureTypeFilterOptions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*displayFilter*/ 1) {
    				select_option(select, /*displayFilter*/ ctx[0]);
    			}

    			if (dirty[0] & /*displayFilter, search*/ 3 && safe_not_equal(previous_key, previous_key = (/*displayFilter*/ ctx[0], /*search*/ ctx[1]))) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(div4, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div4);
    			key_block.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(48:2) {:then cards}",
    		ctx
    	});

    	return block;
    }

    // (66:10) {:else}
    function create_else_block_1(ctx) {
    	let each_1_anchor;
    	let each_value_4 = Object.keys(/*featureType*/ ctx[16]);
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
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
    			if (dirty[0] & /*displayFilter, setDisplayFilter*/ 33) {
    				each_value_4 = Object.keys(/*featureType*/ ctx[16]);
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(66:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:10) {#if typeof featureType === 'string'}
    function create_if_block_1(ctx) {
    	let button;
    	let t_value = /*featureType*/ ctx[16] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[9](/*featureType*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "featureTypeButton svelte-1n680hr");
    			toggle_class(button, "selected", /*featureType*/ ctx[16] === /*displayFilter*/ ctx[0]);
    			add_location(button, file$3, 60, 12, 1950);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*displayFilter*/ 1) {
    				toggle_class(button, "selected", /*featureType*/ ctx[16] === /*displayFilter*/ ctx[0]);
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(60:10) {#if typeof featureType === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (69:14) {#each featureType[key] as subType}
    function create_each_block_5(ctx) {
    	let button;
    	let t_value = /*subType*/ ctx[22] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[10](/*subType*/ ctx[22]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "featureTypeButton svelte-1n680hr");
    			toggle_class(button, "selected", /*subType*/ ctx[22] === /*displayFilter*/ ctx[0]);
    			add_location(button, file$3, 69, 16, 2338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*displayFilter*/ 1) {
    				toggle_class(button, "selected", /*subType*/ ctx[22] === /*displayFilter*/ ctx[0]);
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
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(69:14) {#each featureType[key] as subType}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#each Object.keys(featureType) as key}
    function create_each_block_4(ctx) {
    	let t;
    	let each_value_5 = /*featureType*/ ctx[16][/*key*/ ctx[19]];
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*displayFilter, setDisplayFilter*/ 33) {
    				each_value_5 = /*featureType*/ ctx[16][/*key*/ ctx[19]];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(67:12) {#each Object.keys(featureType) as key}",
    		ctx
    	});

    	return block;
    }

    // (59:8) {#each FeatureTypeFilterOptions as featureType}
    function create_each_block_3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*featureType*/ ctx[16] === 'string') return create_if_block_1;
    		return create_else_block_1;
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
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(59:8) {#each FeatureTypeFilterOptions as featureType}",
    		ctx
    	});

    	return block;
    }

    // (92:12) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Object.keys(/*featureType*/ ctx[16]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
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
    				each_value_1 = Object.keys(/*featureType*/ ctx[16]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(92:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (90:12) {#if typeof featureType === 'string'}
    function create_if_block$1(ctx) {
    	let option;
    	let t_value = /*featureType*/ ctx[16] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*featureType*/ ctx[16];
    			option.value = option.__value;
    			add_location(option, file$3, 90, 14, 3093);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(90:12) {#if typeof featureType === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (95:16) {#each featureType[key] as subType}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*subType*/ ctx[22] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*subType*/ ctx[22];
    			option.value = option.__value;
    			add_location(option, file$3, 95, 18, 3336);
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
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(95:16) {#each featureType[key] as subType}",
    		ctx
    	});

    	return block;
    }

    // (93:14) {#each Object.keys(featureType) as key}
    function create_each_block_1(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*featureType*/ ctx[16][/*key*/ ctx[19]];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
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
    				each_value_2 = /*featureType*/ ctx[16][/*key*/ ctx[19]];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(93:14) {#each Object.keys(featureType) as key}",
    		ctx
    	});

    	return block;
    }

    // (89:10) {#each FeatureTypeFilterOptions as featureType}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (typeof /*featureType*/ ctx[16] === 'string') return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(89:10) {#each FeatureTypeFilterOptions as featureType}",
    		ctx
    	});

    	return block;
    }

    // (115:10) 
    function create_placeholder_slot(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", "card_back svelte-1n680hr");
    			if (!src_url_equal(img.src, img_src_value = "./img/UI/CardBack.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "The back of an Arty Siege card, showing the logo and splatters");
    			add_location(img, file$3, 115, 12, 3885);
    			attr_dev(div, "slot", "placeholder");
    			attr_dev(div, "style", div_style_value = /*style*/ ctx[15]);
    			add_location(div, file$3, 114, 10, 3830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*style*/ 32768 && div_style_value !== (div_style_value = /*style*/ ctx[15])) {
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
    		source: "(115:10) ",
    		ctx
    	});

    	return block;
    }

    // (122:10) <CardContext             width={(744 + 71) / 2}             height={(1039 + 71) / 2}             units="px"             slot="item"             let:style             let:index             cardDetails={filteredCards[index]}           >
    function create_default_slot$1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: { style: /*style*/ ctx[15] },
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
    			if (dirty[0] & /*style*/ 32768) card_changes.style = /*style*/ ctx[15];
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
    		source: "(122:10) <CardContext             width={(744 + 71) / 2}             height={(1039 + 71) / 2}             units=\\\"px\\\"             slot=\\\"item\\\"             let:style             let:index             cardDetails={filteredCards[index]}           >",
    		ctx
    	});

    	return block;
    }

    // (122:10) 
    function create_item_slot(ctx) {
    	let cardcontext;
    	let current;

    	cardcontext = new Context({
    			props: {
    				width: (744 + 71) / 2,
    				height: (1039 + 71) / 2,
    				units: "px",
    				slot: "item",
    				cardDetails: /*filteredCards*/ ctx[3][/*index*/ ctx[14]],
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
    			if (dirty[0] & /*filteredCards, index*/ 16392) cardcontext_changes.cardDetails = /*filteredCards*/ ctx[3][/*index*/ ctx[14]];

    			if (dirty[0] & /*style*/ 32768 | dirty[1] & /*$$scope*/ 1) {
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
    		source: "(122:10) ",
    		ctx
    	});

    	return block;
    }

    // (106:6) {#key (displayFilter, search)}
    function create_key_block(ctx) {
    	let grid;
    	let updating_scrollToIndex;
    	let current;

    	function grid_scrollToIndex_binding(value) {
    		/*grid_scrollToIndex_binding*/ ctx[13](value);
    	}

    	let grid_props = {
    		width: "100%",
    		height: window.outerHeight,
    		itemWidth: (744 + 71) / 2,
    		itemHeight: (1039 + 71) / 2,
    		itemCount: /*filteredCards*/ ctx[3].length,
    		$$slots: {
    			item: [
    				create_item_slot,
    				({ index, style }) => ({ 14: index, 15: style }),
    				({ index, style }) => [(index ? 16384 : 0) | (style ? 32768 : 0)]
    			],
    			placeholder: [
    				create_placeholder_slot,
    				({ style }) => ({ 15: style }),
    				({ style }) => [style ? 32768 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*scrollToIndex*/ ctx[2] !== void 0) {
    		grid_props.scrollToIndex = /*scrollToIndex*/ ctx[2];
    	}

    	grid = new Grid$1({ props: grid_props, $$inline: true });
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
    			if (dirty[0] & /*filteredCards*/ 8) grid_changes.itemCount = /*filteredCards*/ ctx[3].length;

    			if (dirty[0] & /*filteredCards, index, style*/ 49160 | dirty[1] & /*$$scope*/ 1) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_scrollToIndex && dirty[0] & /*scrollToIndex*/ 4) {
    				updating_scrollToIndex = true;
    				grid_changes.scrollToIndex = /*scrollToIndex*/ ctx[2];
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
    		source: "(106:6) {#key (displayFilter, search)}",
    		ctx
    	});

    	return block;
    }

    // (46:21)      loading...   {:then cards}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(46:21)      loading...   {:then cards}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(/*getCards*/ ctx[4](), info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Card Gallery";
    			t1 = space();
    			info.block.c();
    			add_location(h2, file$3, 44, 2, 1414);
    			attr_dev(main, "class", "svelte-1n680hr");
    			add_location(main, file$3, 43, 0, 1405);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
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
    	let filteredCards;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let displayFilter = 'All';
    	let search = '';
    	let cards = [];

    	const getCards = async () => {
    		let cardFetch = await fetch('/data.csv');
    		let cardData = await cardFetch.text();
    		const cardRows = cardData.split('\r\n');
    		cardRows.shift();

    		$$invalidate(6, cards = cardRows.map(row => {
    			const cols = row.split(',');

    			return {
    				nameParts: cols.slice(2, 4).filter(s => !!s),
    				img: cols[18],
    				number: parseInt(cols[0]),
    				rarity: cols[6].toLowerCase(),
    				featureType: cols[23],
    				series: cols[7],
    				seriesNumber: cols[21],
    				seriesTotal: cols[22],
    				grid: cols.slice(9, 17),
    				points: cols[8],
    				specialCost: parseInt(cols[4]),
    				artist: cols[17],
    				artistLinkType: cols[20],
    				artistLink: cols[19]
    			};
    		}));

    		return cards;
    	};

    	const setDisplayFilter = filter => {
    		$$invalidate(0, displayFilter = filter);
    	};

    	let scrollToIndex;
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate(1, search);
    	}

    	const click_handler = () => setDisplayFilter('All');
    	const click_handler_1 = featureType => setDisplayFilter(featureType);
    	const click_handler_2 = subType => setDisplayFilter(subType);
    	const click_handler_3 = () => scrollToIndex(~~(Math.random() * filteredCards.length), 'smooth');

    	function select_change_handler() {
    		displayFilter = select_value(this);
    		$$invalidate(0, displayFilter);
    	}

    	function grid_scrollToIndex_binding(value) {
    		scrollToIndex = value;
    		$$invalidate(2, scrollToIndex);
    	}

    	$$self.$capture_state = () => ({
    		Grid: Grid$1,
    		Card,
    		CardContext: Context,
    		FeatureTypeFilterOptions,
    		displayFilter,
    		search,
    		cards,
    		getCards,
    		setDisplayFilter,
    		scrollToIndex,
    		filteredCards
    	});

    	$$self.$inject_state = $$props => {
    		if ('displayFilter' in $$props) $$invalidate(0, displayFilter = $$props.displayFilter);
    		if ('search' in $$props) $$invalidate(1, search = $$props.search);
    		if ('cards' in $$props) $$invalidate(6, cards = $$props.cards);
    		if ('scrollToIndex' in $$props) $$invalidate(2, scrollToIndex = $$props.scrollToIndex);
    		if ('filteredCards' in $$props) $$invalidate(3, filteredCards = $$props.filteredCards);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*cards, displayFilter, search*/ 67) {
    			$$invalidate(3, filteredCards = cards.filter(c => c.img && (displayFilter === 'All' || c.featureType === displayFilter) && (search === '' || c.artist.toLowerCase().includes(search.toLowerCase()))));
    		}
    	};

    	return [
    		displayFilter,
    		search,
    		scrollToIndex,
    		filteredCards,
    		getCards,
    		setDisplayFilter,
    		cards,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		select_change_handler,
    		grid_scrollToIndex_binding
    	];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/card/PrintGallery.svelte generated by Svelte v3.52.0 */
    const file$2 = "src/card/PrintGallery.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (1:0) <script lang="ts">import Card from './Card.svelte'; import CardContext from './Context.svelte'; let cards = []; const getCards = async () => {     let cardFetch = await fetch('/data.csv');     let cardData = await cardFetch.text();     const cardRows = cardData.split('\r\n');     cardRows.shift();     cards = cardRows.map((row) => {         const cols = row.split(',');         return {             nameParts: cols.slice(2, 4).filter((s) => !!s),             img: cols[18],             number: parseInt(cols[0]),             rarity: cols[6].toLowerCase(),             featureType: cols[22],             series: cols[7],             seriesNumber: cols[21],             seriesTotal: cols[22],             grid: cols.slice(9, 17),             points: cols[8],             specialCost: parseInt(cols[4]),             artist: cols[17],             artistLinkType: cols[20],             artistLink: cols[19],         }
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
    		source: "(1:0) <script lang=\\\"ts\\\">import Card from './Card.svelte'; import CardContext from './Context.svelte'; let cards = []; const getCards = async () => {     let cardFetch = await fetch('/data.csv');     let cardData = await cardFetch.text();     const cardRows = cardData.split('\\r\\n');     cardRows.shift();     cards = cardRows.map((row) => {         const cols = row.split(',');         return {             nameParts: cols.slice(2, 4).filter((s) => !!s),             img: cols[18],             number: parseInt(cols[0]),             rarity: cols[6].toLowerCase(),             featureType: cols[22],             series: cols[7],             seriesNumber: cols[21],             seriesTotal: cols[22],             grid: cols.slice(9, 17),             points: cols[8],             specialCost: parseInt(cols[4]),             artist: cols[17],             artistLinkType: cols[20],             artistLink: cols[19],         }",
    		ctx
    	});

    	return block;
    }

    // (33:32)      <div class="wrapper">       {#each cards as card, i}
    function create_then_block(ctx) {
    	let div;
    	let current;
    	let each_value = /*cards*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-zizf2o");
    			add_location(div, file$2, 33, 4, 1029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*getCards*/ 2) {
    				each_value = /*cards*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(33:32)      <div class=\\\"wrapper\\\">       {#each cards as card, i}",
    		ctx
    	});

    	return block;
    }

    // (36:8) <CardContext cardDetails={card} width={69} height={94} units="mm">
    function create_default_slot(ctx) {
    	let card;
    	let t;
    	let current;

    	card = new Card({
    			props: {
    				pagebreak: /*i*/ ctx[4] % 9 === 8,
    				style: ""
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
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
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(36:8) <CardContext cardDetails={card} width={69} height={94} units=\\\"mm\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:6) {#each cards as card, i}
    function create_each_block(ctx) {
    	let cardcontext;
    	let current;

    	cardcontext = new Context({
    			props: {
    				cardDetails: /*card*/ ctx[2],
    				width: 69,
    				height: 94,
    				units: "mm",
    				$$slots: { default: [create_default_slot] },
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

    			if (dirty & /*$$scope*/ 32) {
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:6) {#each cards as card, i}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">import Card from './Card.svelte'; import CardContext from './Context.svelte'; let cards = []; const getCards = async () => {     let cardFetch = await fetch('/data.csv');     let cardData = await cardFetch.text();     const cardRows = cardData.split('\r\n');     cardRows.shift();     cards = cardRows.map((row) => {         const cols = row.split(',');         return {             nameParts: cols.slice(2, 4).filter((s) => !!s),             img: cols[18],             number: parseInt(cols[0]),             rarity: cols[6].toLowerCase(),             featureType: cols[22],             series: cols[7],             seriesNumber: cols[21],             seriesTotal: cols[22],             grid: cols.slice(9, 17),             points: cols[8],             specialCost: parseInt(cols[4]),             artist: cols[17],             artistLinkType: cols[20],             artistLink: cols[19],         }
    function create_pending_block(ctx) {
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
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script lang=\\\"ts\\\">import Card from './Card.svelte'; import CardContext from './Context.svelte'; let cards = []; const getCards = async () => {     let cardFetch = await fetch('/data.csv');     let cardData = await cardFetch.text();     const cardRows = cardData.split('\\r\\n');     cardRows.shift();     cards = cardRows.map((row) => {         const cols = row.split(',');         return {             nameParts: cols.slice(2, 4).filter((s) => !!s),             img: cols[18],             number: parseInt(cols[0]),             rarity: cols[6].toLowerCase(),             featureType: cols[22],             series: cols[7],             seriesNumber: cols[21],             seriesTotal: cols[22],             grid: cols.slice(9, 17),             points: cols[8],             specialCost: parseInt(cols[4]),             artist: cols[17],             artistLinkType: cols[20],             artistLink: cols[19],         }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(/*getCards*/ ctx[1](), info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			info.block.c();
    			attr_dev(main, "class", "svelte-zizf2o");
    			add_location(main, file$2, 31, 0, 985);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrintGallery', slots, []);
    	let cards = [];

    	const getCards = async () => {
    		let cardFetch = await fetch('/data.csv');
    		let cardData = await cardFetch.text();
    		const cardRows = cardData.split('\r\n');
    		cardRows.shift();

    		$$invalidate(0, cards = cardRows.map(row => {
    			const cols = row.split(',');

    			return {
    				nameParts: cols.slice(2, 4).filter(s => !!s),
    				img: cols[18],
    				number: parseInt(cols[0]),
    				rarity: cols[6].toLowerCase(),
    				featureType: cols[22],
    				series: cols[7],
    				seriesNumber: cols[21],
    				seriesTotal: cols[22],
    				grid: cols.slice(9, 17),
    				points: cols[8],
    				specialCost: parseInt(cols[4]),
    				artist: cols[17],
    				artistLinkType: cols[20],
    				artistLink: cols[19]
    			};
    		}));

    		return cards; //.filter((c) => !!c.artist)
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrintGallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card, CardContext: Context, cards, getCards });

    	$$self.$inject_state = $$props => {
    		if ('cards' in $$props) $$invalidate(0, cards = $$props.cards);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cards, getCards];
    }

    class PrintGallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrintGallery",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Navigation.svelte generated by Svelte v3.52.0 */

    const file$1 = "src/Navigation.svelte";

    function create_fragment$1(ctx) {
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;
    	let t7;
    	let li4;
    	let t9;
    	let li5;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "About";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Gallery";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Print";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "What's Next";
    			t7 = space();
    			li4 = element("li");
    			li4.textContent = "How to Play";
    			t9 = space();
    			li5 = element("li");
    			li5.textContent = "Credits";
    			add_location(li0, file$1, 4, 2, 27);
    			add_location(li1, file$1, 5, 2, 44);
    			add_location(li2, file$1, 6, 2, 63);
    			add_location(li3, file$1, 7, 2, 80);
    			add_location(li4, file$1, 8, 2, 103);
    			add_location(li5, file$1, 9, 2, 126);
    			add_location(ul, file$1, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
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

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigation', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.52.0 */
    const file = "src/App.svelte";

    // (16:2) {#if printing}
    function create_if_block(ctx) {
    	let printgallery;
    	let current;
    	printgallery = new PrintGallery({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(printgallery.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(printgallery, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(printgallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(printgallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(printgallery, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:2) {#if printing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let navigation;
    	let t2;
    	let about;
    	let t3;
    	let gallery;
    	let t4;
    	let current;
    	navigation = new Navigation({ $$inline: true });
    	about = new About({ $$inline: true });
    	gallery = new Gallery({ $$inline: true });
    	let if_block = /*printing*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Arty Siege";
    			t1 = space();
    			create_component(navigation.$$.fragment);
    			t2 = space();
    			create_component(about.$$.fragment);
    			t3 = space();
    			create_component(gallery.$$.fragment);
    			t4 = space();
    			if (if_block) if_block.c();
    			add_location(h1, file, 11, 2, 318);
    			attr_dev(main, "class", "svelte-5qsw33");
    			add_location(main, file, 10, 0, 309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(navigation, main, null);
    			append_dev(main, t2);
    			mount_component(about, main, null);
    			append_dev(main, t3);
    			mount_component(gallery, main, null);
    			append_dev(main, t4);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*printing*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*printing*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
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
    			transition_in(navigation.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(gallery.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(gallery.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navigation);
    			destroy_component(about);
    			destroy_component(gallery);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let printing = true;

    	window.addEventListener('beforeprint', event => {
    		$$invalidate(0, printing = true);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		About,
    		Gallery,
    		PrintGallery,
    		Navigation,
    		printing
    	});

    	$$self.$inject_state = $$props => {
    		if ('printing' in $$props) $$invalidate(0, printing = $$props.printing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [printing];
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
