import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import * as React3 from "react";
import React3__default, { useEffect, useState, useRef, forwardRef, createElement } from "react";
import * as ReactDOM from "react-dom";
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      var isInstance = false;
      try {
        isInstance = this instanceof a2;
      } catch {
      }
      if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var dist$1 = { exports: {} };
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var Action = /* @__PURE__ */ ((Action2) => {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
  return Action2;
})(Action || {});
var PopStateEventType = "popstate";
function createMemoryHistory(options = {}) {
  let { initialEntries = ["/"], initialIndex, v5Compat = false } = options;
  let entries;
  entries = initialEntries.map(
    (entry, index2) => createMemoryLocation(
      entry,
      typeof entry === "string" ? null : entry.state,
      index2 === 0 ? "default" : void 0
    )
  );
  let index = clampIndex(
    initialIndex == null ? entries.length - 1 : initialIndex
  );
  let action = "POP";
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state = null, key) {
    let location2 = createLocation(
      entries ? getCurrentLocation().pathname : "/",
      to,
      state,
      key
    );
    warning(
      location2.pathname.charAt(0) === "/",
      `relative pathnames are not supported in memory history: ${JSON.stringify(
        to
      )}`
    );
    return location2;
  }
  function createHref2(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref: createHref2,
    createURL(to) {
      return new URL(createHref2(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = "PUSH";
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({ action, location: nextLocation, delta: 1 });
      }
    },
    replace(to, state) {
      action = "REPLACE";
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({ action, location: nextLocation, delta: 0 });
      }
    },
    go(delta) {
      action = "POP";
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({ action, location: nextLocation, delta });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
function createBrowserHistory(options = {}) {
  function createBrowserLocation(window2, globalHistory) {
    let { pathname, search, hash } = window2.location;
    return createLocation(
      "",
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(
    createBrowserLocation,
    createBrowserHref,
    null,
    options
  );
}
function createHashHistory(options = {}) {
  function createHashLocation(window2, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window2.location.hash.substring(1));
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation(
      "",
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createHashHref(window2, to) {
    let base = window2.document.querySelector("base");
    let href2 = "";
    if (base && base.getAttribute("href")) {
      let url = window2.location.href;
      let hashIndex = url.indexOf("#");
      href2 = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href2 + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location2, to) {
    warning(
      location2.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        to
      )})`
    );
  }
  return getUrlBasedHistory(
    createHashLocation,
    createHashHref,
    validateHashLocation,
    options
  );
}
function invariant$1(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey$1() {
  return Math.random().toString(36).substring(2, 10);
}
function getHistoryState(location2, index) {
  return {
    usr: location2.state,
    key: location2.key,
    idx: index
  };
}
function createLocation(current, to, state = null, key) {
  let location2 = {
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: "",
    ...typeof to === "string" ? parsePath(to) : to,
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey$1()
  };
  return location2;
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref2, validateLocation, options = {}) {
  let { window: window2 = document.defaultView, v5Compat = false } = options;
  let globalHistory = window2.history;
  let action = "POP";
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }
  function getIndex() {
    let state = globalHistory.state || { idx: null };
    return state.idx;
  }
  function handlePop() {
    action = "POP";
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({ action, location: history.location, delta });
    }
  }
  function push(to, state) {
    action = "PUSH";
    let location2 = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location2, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location2, index);
    let url = history.createHref(location2);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 1 });
    }
  }
  function replace2(to, state) {
    action = "REPLACE";
    let location2 = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location2, to);
    index = getIndex();
    let historyState = getHistoryState(location2, index);
    let url = history.createHref(location2);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 0 });
    }
  }
  function createURL(to) {
    return createBrowserURLImpl(to);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref2(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace: replace2,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
function createBrowserURLImpl(to, isAbsolute = false) {
  let base = "http://localhost";
  if (typeof window !== "undefined") {
    base = window.location.origin !== "null" ? window.location.origin : window.location.href;
  }
  invariant$1(base, "No window.location.(origin|href) available to create URL");
  let href2 = typeof to === "string" ? to : createPath(to);
  href2 = href2.replace(/ $/, "%20");
  if (!isAbsolute && href2.startsWith("//")) {
    href2 = base + href2;
  }
  return new URL(href2, base);
}
function createContext(defaultValue) {
  return { defaultValue };
}
var _map;
var RouterContextProvider = class {
  /**
   * Create a new `RouterContextProvider` instance
   * @param init An optional initial context map to populate the provider with
   */
  constructor(init2) {
    __privateAdd(this, _map, /* @__PURE__ */ new Map());
    if (init2) {
      for (let [context, value] of init2) {
        this.set(context, value);
      }
    }
  }
  /**
   * Access a value from the context. If no value has been set for the context,
   * it will return the context's `defaultValue` if provided, or throw an error
   * if no `defaultValue` was set.
   * @param context The context to get the value for
   * @returns The value for the context, or the context's `defaultValue` if no
   * value was set
   */
  get(context) {
    if (__privateGet(this, _map).has(context)) {
      return __privateGet(this, _map).get(context);
    }
    if (context.defaultValue !== void 0) {
      return context.defaultValue;
    }
    throw new Error("No value found for context");
  }
  /**
   * Set a value for the context. If the context already has a value set, this
   * will overwrite it.
   *
   * @param context The context to set the value for
   * @param value The value to set for the context
   * @returns {void}
   */
  set(context, value) {
    __privateGet(this, _map).set(context, value);
  }
};
_map = /* @__PURE__ */ new WeakMap();
var unsupportedLazyRouteObjectKeys = /* @__PURE__ */ new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "children"
]);
function isUnsupportedLazyRouteObjectKey(key) {
  return unsupportedLazyRouteObjectKeys.has(
    key
  );
}
var unsupportedLazyRouteFunctionKeys = /* @__PURE__ */ new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "middleware",
  "children"
]);
function isUnsupportedLazyRouteFunctionKey(key) {
  return unsupportedLazyRouteFunctionKeys.has(
    key
  );
}
function isIndexRoute(route) {
  return route.index === true;
}
function convertRoutesToDataRoutes(routes, mapRouteProperties2, parentPath = [], manifest = {}, allowInPlaceMutations = false) {
  return routes.map((route, index) => {
    let treePath = [...parentPath, String(index)];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant$1(
      route.index !== true || !route.children,
      `Cannot specify children on an index route`
    );
    invariant$1(
      allowInPlaceMutations || !manifest[id],
      `Found a route id collision on id "${id}".  Route id's must be globally unique within Data Router usages`
    );
    if (isIndexRoute(route)) {
      let indexRoute = {
        ...route,
        id
      };
      manifest[id] = mergeRouteUpdates(
        indexRoute,
        mapRouteProperties2(indexRoute)
      );
      return indexRoute;
    } else {
      let pathOrLayoutRoute = {
        ...route,
        id,
        children: void 0
      };
      manifest[id] = mergeRouteUpdates(
        pathOrLayoutRoute,
        mapRouteProperties2(pathOrLayoutRoute)
      );
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(
          route.children,
          mapRouteProperties2,
          treePath,
          manifest,
          allowInPlaceMutations
        );
      }
      return pathOrLayoutRoute;
    }
  });
}
function mergeRouteUpdates(route, updates) {
  return Object.assign(route, {
    ...updates,
    ...typeof updates.lazy === "object" && updates.lazy != null ? {
      lazy: {
        ...route.lazy,
        ...updates.lazy
      }
    } : {}
  });
}
function matchRoutes(routes, locationArg, basename = "/") {
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location2 = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location2.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(
      branches[i],
      decoded,
      allowPartial
    );
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let { route, pathname, params } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    loaderData: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
  let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) {
        return;
      }
      invariant$1(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant$1(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        `Index routes must not have child routes. Please remove all child routes from route path "${path}".`
      );
      flattenRoutes(
        route.children,
        branches,
        routesMeta,
        path,
        hasParentOptionalSegments
      );
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    if (route.path === "" || !route.path?.includes("?")) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, true, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(
    ...restExploded.map(
      (subpath) => subpath === "" ? required : [required, subpath].join("/")
    )
  );
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map(
    (exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded
  );
}
function rankRouteBranches(branches) {
  branches.sort(
    (a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(
      a.routesMeta.map((meta) => meta.childrenIndex),
      b.routesMeta.map((meta) => meta.childrenIndex)
    )
  );
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce(
    (score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
    initialScore
  );
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath(
        {
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        },
        remainingPathname
      );
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function generatePath(originalPath, params = {}) {
  let path = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    warning(
      false,
      `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
    );
    path = path.replace(/\*$/, "/*");
  }
  const prefix = path.startsWith("/") ? "/" : "";
  const stringify2 = (p) => p == null ? "" : typeof p === "string" ? p : String(p);
  const segments = path.split(/\/+/).map((segment, index, array) => {
    const isLastSegment = index === array.length - 1;
    if (isLastSegment && segment === "*") {
      const star = "*";
      return stringify2(params[star]);
    }
    const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
    if (keyMatch) {
      const [, key, optional] = keyMatch;
      let param = params[key];
      invariant$1(optional === "?" || param != null, `Missing ":${key}" param`);
      return encodeURIComponent(stringify2(param));
    }
    return segment.replace(/\?$/g, "");
  }).filter((segment) => !!segment);
  return prefix + segments.join("/");
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce(
    (memo2, { paramName, isOptional }, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo2[paramName] = void 0;
      } else {
        memo2[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo2;
    },
    {}
  );
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (_, paramName, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(
      false,
      `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`
    );
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function prependBasename({
  basename,
  pathname
}) {
  return pathname === "/" ? basename : joinPaths([basename, pathname]);
}
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX.test(url);
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    if (isAbsoluteUrl(toPathname)) {
      pathname = toPathname;
    } else {
      if (toPathname.includes("//")) {
        let oldPathname = toPathname;
        toPathname = toPathname.replace(/\/\/+/g, "/");
        warning(
          false,
          `Pathnames cannot have embedded double slashes - normalizing ${oldPathname} -> ${toPathname}`
        );
      }
      if (toPathname.startsWith("/")) {
        pathname = resolvePathname(toPathname.substring(1), "/");
      } else {
        pathname = resolvePathname(toPathname, fromPathname);
      }
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(
    path
  )}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter(
    (match, index) => index === 0 || match.route.path && match.route.path.length > 0
  );
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map(
    (match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase
  );
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant$1(
      !to.pathname || !to.pathname.includes("?"),
      getInvalidPathError("?", "pathname", "search", to)
    );
    invariant$1(
      !to.pathname || !to.pathname.includes("#"),
      getInvalidPathError("#", "pathname", "hash", to)
    );
    invariant$1(
      !to.search || !to.search.includes("#"),
      getInvalidPathError("#", "search", "hash", to)
    );
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
var DataWithResponseInit = class {
  constructor(data2, init2) {
    this.type = "DataWithResponseInit";
    this.data = data2;
    this.init = init2 || null;
  }
};
function data(data2, init2) {
  return new DataWithResponseInit(
    data2,
    typeof init2 === "number" ? { status: init2 } : init2
  );
}
var redirect = (url, init2 = 302) => {
  let responseInit = init2;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, { ...responseInit, headers });
};
var redirectDocument = (url, init2) => {
  let response = redirect(url, init2);
  response.headers.set("X-Remix-Reload-Document", "true");
  return response;
};
var replace = (url, init2) => {
  let response = redirect(url, init2);
  response.headers.set("X-Remix-Replace", "true");
  return response;
};
var ErrorResponseImpl = class {
  constructor(status, statusText, data2, internal = false) {
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data2 instanceof Error) {
      this.data = data2.toString();
      this.error = data2;
    } else {
      this.data = data2;
    }
  }
};
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
  return matches.map((m) => m.route.path).filter(Boolean).join("/").replace(/\/\/*/g, "/") || "/";
}
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
function parseToInfo(_to, basename) {
  let to = _to;
  if (typeof to !== "string" || !ABSOLUTE_URL_REGEX.test(to)) {
    return {
      absoluteURL: void 0,
      isExternal: false,
      to
    };
  }
  let absoluteURL = to;
  let isExternal = false;
  if (isBrowser) {
    try {
      let currentUrl = new URL(window.location.href);
      let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
      let path = stripBasename(targetUrl.pathname, basename);
      if (targetUrl.origin === currentUrl.origin && path != null) {
        to = path + targetUrl.search + targetUrl.hash;
      } else {
        isExternal = true;
      }
    } catch (e) {
      warning(
        false,
        `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  }
  return {
    absoluteURL,
    isExternal,
    to
  };
}
var UninstrumentedSymbol = /* @__PURE__ */ Symbol("Uninstrumented");
function getRouteInstrumentationUpdates(fns, route) {
  let aggregated = {
    lazy: [],
    "lazy.loader": [],
    "lazy.action": [],
    "lazy.middleware": [],
    middleware: [],
    loader: [],
    action: []
  };
  fns.forEach(
    (fn) => fn({
      id: route.id,
      index: route.index,
      path: route.path,
      instrument(i) {
        let keys = Object.keys(aggregated);
        for (let key of keys) {
          if (i[key]) {
            aggregated[key].push(i[key]);
          }
        }
      }
    })
  );
  let updates = {};
  if (typeof route.lazy === "function" && aggregated.lazy.length > 0) {
    let instrumented = wrapImpl(aggregated.lazy, route.lazy, () => void 0);
    if (instrumented) {
      updates.lazy = instrumented;
    }
  }
  if (typeof route.lazy === "object") {
    let lazyObject = route.lazy;
    ["middleware", "loader", "action"].forEach((key) => {
      let lazyFn = lazyObject[key];
      let instrumentations = aggregated[`lazy.${key}`];
      if (typeof lazyFn === "function" && instrumentations.length > 0) {
        let instrumented = wrapImpl(instrumentations, lazyFn, () => void 0);
        if (instrumented) {
          updates.lazy = Object.assign(updates.lazy || {}, {
            [key]: instrumented
          });
        }
      }
    });
  }
  ["loader", "action"].forEach((key) => {
    let handler = route[key];
    if (typeof handler === "function" && aggregated[key].length > 0) {
      let original = handler[UninstrumentedSymbol] ?? handler;
      let instrumented = wrapImpl(
        aggregated[key],
        original,
        (...args) => getHandlerInfo(args[0])
      );
      if (instrumented) {
        instrumented[UninstrumentedSymbol] = original;
        updates[key] = instrumented;
      }
    }
  });
  if (route.middleware && route.middleware.length > 0 && aggregated.middleware.length > 0) {
    updates.middleware = route.middleware.map((middleware) => {
      let original = middleware[UninstrumentedSymbol] ?? middleware;
      let instrumented = wrapImpl(
        aggregated.middleware,
        original,
        (...args) => getHandlerInfo(args[0])
      );
      if (instrumented) {
        instrumented[UninstrumentedSymbol] = original;
        return instrumented;
      }
      return middleware;
    });
  }
  return updates;
}
function instrumentClientSideRouter(router2, fns) {
  let aggregated = {
    navigate: [],
    fetch: []
  };
  fns.forEach(
    (fn) => fn({
      instrument(i) {
        let keys = Object.keys(i);
        for (let key of keys) {
          if (i[key]) {
            aggregated[key].push(i[key]);
          }
        }
      }
    })
  );
  if (aggregated.navigate.length > 0) {
    let navigate = router2.navigate[UninstrumentedSymbol] ?? router2.navigate;
    let instrumentedNavigate = wrapImpl(
      aggregated.navigate,
      navigate,
      (...args) => {
        let [to, opts] = args;
        return {
          to: typeof to === "number" || typeof to === "string" ? to : to ? createPath(to) : ".",
          ...getRouterInfo(router2, opts ?? {})
        };
      }
    );
    if (instrumentedNavigate) {
      instrumentedNavigate[UninstrumentedSymbol] = navigate;
      router2.navigate = instrumentedNavigate;
    }
  }
  if (aggregated.fetch.length > 0) {
    let fetch2 = router2.fetch[UninstrumentedSymbol] ?? router2.fetch;
    let instrumentedFetch = wrapImpl(aggregated.fetch, fetch2, (...args) => {
      let [key, , href2, opts] = args;
      return {
        href: href2 ?? ".",
        fetcherKey: key,
        ...getRouterInfo(router2, opts ?? {})
      };
    });
    if (instrumentedFetch) {
      instrumentedFetch[UninstrumentedSymbol] = fetch2;
      router2.fetch = instrumentedFetch;
    }
  }
  return router2;
}
function instrumentHandler(handler, fns) {
  let aggregated = {
    request: []
  };
  fns.forEach(
    (fn) => fn({
      instrument(i) {
        let keys = Object.keys(i);
        for (let key of keys) {
          if (i[key]) {
            aggregated[key].push(i[key]);
          }
        }
      }
    })
  );
  let instrumentedHandler = handler;
  if (aggregated.request.length > 0) {
    instrumentedHandler = wrapImpl(aggregated.request, handler, (...args) => {
      let [request, context] = args;
      return {
        request: getReadonlyRequest(request),
        context: context != null ? getReadonlyContext(context) : context
      };
    });
  }
  return instrumentedHandler;
}
function wrapImpl(impls, handler, getInfo) {
  if (impls.length === 0) {
    return null;
  }
  return async (...args) => {
    let result = await recurseRight(
      impls,
      getInfo(...args),
      () => handler(...args),
      impls.length - 1
    );
    if (result.type === "error") {
      throw result.value;
    }
    return result.value;
  };
}
async function recurseRight(impls, info, handler, index) {
  let impl = impls[index];
  let result;
  if (!impl) {
    try {
      let value = await handler();
      result = { type: "success", value };
    } catch (e) {
      result = { type: "error", value: e };
    }
  } else {
    let handlerPromise = void 0;
    let callHandler = async () => {
      if (handlerPromise) {
        console.error("You cannot call instrumented handlers more than once");
      } else {
        handlerPromise = recurseRight(impls, info, handler, index - 1);
      }
      result = await handlerPromise;
      invariant$1(result, "Expected a result");
      if (result.type === "error" && result.value instanceof Error) {
        return { status: "error", error: result.value };
      }
      return { status: "success", error: void 0 };
    };
    try {
      await impl(callHandler, info);
    } catch (e) {
      console.error("An instrumentation function threw an error:", e);
    }
    if (!handlerPromise) {
      await callHandler();
    }
    await handlerPromise;
  }
  if (result) {
    return result;
  }
  return {
    type: "error",
    value: new Error("No result assigned in instrumentation chain.")
  };
}
function getHandlerInfo(args) {
  let { request, context, params, unstable_pattern } = args;
  return {
    request: getReadonlyRequest(request),
    params: { ...params },
    unstable_pattern,
    context: getReadonlyContext(context)
  };
}
function getRouterInfo(router2, opts) {
  return {
    currentUrl: createPath(router2.state.location),
    ..."formMethod" in opts ? { formMethod: opts.formMethod } : {},
    ..."formEncType" in opts ? { formEncType: opts.formEncType } : {},
    ..."formData" in opts ? { formData: opts.formData } : {},
    ..."body" in opts ? { body: opts.body } : {}
  };
}
function getReadonlyRequest(request) {
  return {
    method: request.method,
    url: request.url,
    headers: {
      get: (...args) => request.headers.get(...args)
    }
  };
}
function getReadonlyContext(context) {
  if (isPlainObject(context)) {
    let frozen = { ...context };
    Object.freeze(frozen);
    return frozen;
  } else {
    return {
      get: (ctx) => context.get(ctx)
    };
  }
}
var objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function isPlainObject(thing) {
  if (thing === null || typeof thing !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames;
}
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
var validMutationMethods = new Set(
  validMutationMethodsArr
);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
var validRequestMethods = new Set(validRequestMethodsArr);
var redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var redirectPreserveMethodStatusCodes = /* @__PURE__ */ new Set([307, 308]);
var IDLE_NAVIGATION = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
};
var IDLE_FETCHER = {
  state: "idle",
  data: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
};
var IDLE_BLOCKER = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
};
var defaultMapRouteProperties = (route) => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
var TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
var ResetLoaderDataSymbol = /* @__PURE__ */ Symbol("ResetLoaderData");
function createRouter(init2) {
  const routerWindow = init2.window ? init2.window : typeof window !== "undefined" ? window : void 0;
  const isBrowser3 = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  invariant$1(
    init2.routes.length > 0,
    "You must provide a non-empty routes array to createRouter"
  );
  let hydrationRouteProperties2 = init2.hydrationRouteProperties || [];
  let _mapRouteProperties = init2.mapRouteProperties || defaultMapRouteProperties;
  let mapRouteProperties2 = _mapRouteProperties;
  if (init2.unstable_instrumentations) {
    let instrumentations = init2.unstable_instrumentations;
    mapRouteProperties2 = (route) => {
      return {
        ..._mapRouteProperties(route),
        ...getRouteInstrumentationUpdates(
          instrumentations.map((i) => i.route).filter(Boolean),
          route
        )
      };
    };
  }
  let manifest = {};
  let dataRoutes = convertRoutesToDataRoutes(
    init2.routes,
    mapRouteProperties2,
    void 0,
    manifest
  );
  let inFlightDataRoutes;
  let basename = init2.basename || "/";
  if (!basename.startsWith("/")) {
    basename = `/${basename}`;
  }
  let dataStrategyImpl = init2.dataStrategy || defaultDataStrategyWithMiddleware;
  let future = {
    ...init2.future
  };
  let unlistenHistory = null;
  let subscribers = /* @__PURE__ */ new Set();
  let savedScrollPositions2 = null;
  let getScrollRestorationKey2 = null;
  let getScrollPosition = null;
  let initialScrollRestored = init2.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init2.history.location, basename);
  let initialMatchesIsFOW = false;
  let initialErrors = null;
  let initialized;
  if (initialMatches == null && !init2.patchRoutesOnNavigation) {
    let error = getInternalRouterError(404, {
      pathname: init2.history.location.pathname
    });
    let { matches, route } = getShortCircuitMatches(dataRoutes);
    initialized = true;
    initialMatches = matches;
    initialErrors = { [route.id]: error };
  } else {
    if (initialMatches && !init2.hydrationData) {
      let fogOfWar = checkFogOfWar(
        initialMatches,
        dataRoutes,
        init2.history.location.pathname
      );
      if (fogOfWar.active) {
        initialMatches = null;
      }
    }
    if (!initialMatches) {
      initialized = false;
      initialMatches = [];
      let fogOfWar = checkFogOfWar(
        null,
        dataRoutes,
        init2.history.location.pathname
      );
      if (fogOfWar.active && fogOfWar.matches) {
        initialMatchesIsFOW = true;
        initialMatches = fogOfWar.matches;
      }
    } else if (initialMatches.some((m) => m.route.lazy)) {
      initialized = false;
    } else if (!initialMatches.some((m) => routeHasLoaderOrMiddleware(m.route))) {
      initialized = true;
    } else {
      let loaderData = init2.hydrationData ? init2.hydrationData.loaderData : null;
      let errors = init2.hydrationData ? init2.hydrationData.errors : null;
      if (errors) {
        let idx = initialMatches.findIndex(
          (m) => errors[m.route.id] !== void 0
        );
        initialized = initialMatches.slice(0, idx + 1).every(
          (m) => !shouldLoadRouteOnHydration(m.route, loaderData, errors)
        );
      } else {
        initialized = initialMatches.every(
          (m) => !shouldLoadRouteOnHydration(m.route, loaderData, errors)
        );
      }
    }
  }
  let router2;
  let state = {
    historyAction: init2.history.action,
    location: init2.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init2.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init2.hydrationData && init2.hydrationData.loaderData || {},
    actionData: init2.hydrationData && init2.hydrationData.actionData || null,
    errors: init2.hydrationData && init2.hydrationData.errors || initialErrors,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  };
  let pendingAction = "POP";
  let pendingPopstateNavigationDfd = null;
  let pendingPreventScrollReset = false;
  let pendingNavigationController;
  let pendingViewTransitionEnabled = false;
  let appliedViewTransitions = /* @__PURE__ */ new Map();
  let removePageHideEventListener = null;
  let isUninterruptedRevalidation = false;
  let isRevalidationRequired = false;
  let cancelledFetcherLoads = /* @__PURE__ */ new Set();
  let fetchControllers = /* @__PURE__ */ new Map();
  let incrementingLoadId = 0;
  let pendingNavigationLoadId = -1;
  let fetchReloadIds = /* @__PURE__ */ new Map();
  let fetchRedirectIds = /* @__PURE__ */ new Set();
  let fetchLoadMatches = /* @__PURE__ */ new Map();
  let activeFetchers = /* @__PURE__ */ new Map();
  let fetchersQueuedForDeletion = /* @__PURE__ */ new Set();
  let blockerFunctions = /* @__PURE__ */ new Map();
  let unblockBlockerHistoryUpdate = void 0;
  let pendingRevalidationDfd = null;
  function initialize() {
    unlistenHistory = init2.history.listen(
      ({ action: historyAction, location: location2, delta }) => {
        if (unblockBlockerHistoryUpdate) {
          unblockBlockerHistoryUpdate();
          unblockBlockerHistoryUpdate = void 0;
          return;
        }
        warning(
          blockerFunctions.size === 0 || delta != null,
          "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL."
        );
        let blockerKey = shouldBlockNavigation({
          currentLocation: state.location,
          nextLocation: location2,
          historyAction
        });
        if (blockerKey && delta != null) {
          let nextHistoryUpdatePromise = new Promise((resolve) => {
            unblockBlockerHistoryUpdate = resolve;
          });
          init2.history.go(delta * -1);
          updateBlocker(blockerKey, {
            state: "blocked",
            location: location2,
            proceed() {
              updateBlocker(blockerKey, {
                state: "proceeding",
                proceed: void 0,
                reset: void 0,
                location: location2
              });
              nextHistoryUpdatePromise.then(() => init2.history.go(delta));
            },
            reset() {
              let blockers = new Map(state.blockers);
              blockers.set(blockerKey, IDLE_BLOCKER);
              updateState({ blockers });
            }
          });
          pendingPopstateNavigationDfd?.resolve();
          pendingPopstateNavigationDfd = null;
          return;
        }
        return startNavigation(historyAction, location2);
      }
    );
    if (isBrowser3) {
      restoreAppliedTransitions(routerWindow, appliedViewTransitions);
      let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
      routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
      removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
    }
    if (!state.initialized) {
      startNavigation("POP", state.location, {
        initialHydration: true
      });
    }
    return router2;
  }
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    if (removePageHideEventListener) {
      removePageHideEventListener();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  function updateState(newState, opts = {}) {
    if (newState.matches) {
      newState.matches = newState.matches.map((m) => {
        let route = manifest[m.route.id];
        let matchRoute = m.route;
        if (matchRoute.element !== route.element || matchRoute.errorElement !== route.errorElement || matchRoute.hydrateFallbackElement !== route.hydrateFallbackElement) {
          return {
            ...m,
            route
          };
        }
        return m;
      });
    }
    state = {
      ...state,
      ...newState
    };
    let unmountedFetchers = [];
    let mountedFetchers = [];
    state.fetchers.forEach((fetcher, key) => {
      if (fetcher.state === "idle") {
        if (fetchersQueuedForDeletion.has(key)) {
          unmountedFetchers.push(key);
        } else {
          mountedFetchers.push(key);
        }
      }
    });
    fetchersQueuedForDeletion.forEach((key) => {
      if (!state.fetchers.has(key) && !fetchControllers.has(key)) {
        unmountedFetchers.push(key);
      }
    });
    [...subscribers].forEach(
      (subscriber) => subscriber(state, {
        deletedFetchers: unmountedFetchers,
        newErrors: newState.errors ?? null,
        viewTransitionOpts: opts.viewTransitionOpts,
        flushSync: opts.flushSync === true
      })
    );
    unmountedFetchers.forEach((key) => deleteFetcher(key));
    mountedFetchers.forEach((key) => state.fetchers.delete(key));
  }
  function completeNavigation(location2, newState, { flushSync } = {}) {
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && location2.state?._isRedirect !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        actionData = null;
      }
    } else if (isActionReload) {
      actionData = state.actionData;
    } else {
      actionData = null;
    }
    let loaderData = newState.loaderData ? mergeLoaderData(
      state.loaderData,
      newState.loaderData,
      newState.matches || [],
      newState.errors
    ) : state.loaderData;
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
    }
    let restoreScrollPosition = isUninterruptedRevalidation ? false : getSavedScrollPosition(location2, newState.matches || state.matches);
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && location2.state?._isRedirect !== true;
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = void 0;
    }
    if (isUninterruptedRevalidation) ;
    else if (pendingAction === "POP") ;
    else if (pendingAction === "PUSH") {
      init2.history.push(location2, location2.state);
    } else if (pendingAction === "REPLACE") {
      init2.history.replace(location2, location2.state);
    }
    let viewTransitionOpts;
    if (pendingAction === "POP") {
      let priorPaths = appliedViewTransitions.get(state.location.pathname);
      if (priorPaths && priorPaths.has(location2.pathname)) {
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location2
        };
      } else if (appliedViewTransitions.has(location2.pathname)) {
        viewTransitionOpts = {
          currentLocation: location2,
          nextLocation: state.location
        };
      }
    } else if (pendingViewTransitionEnabled) {
      let toPaths = appliedViewTransitions.get(state.location.pathname);
      if (toPaths) {
        toPaths.add(location2.pathname);
      } else {
        toPaths = /* @__PURE__ */ new Set([location2.pathname]);
        appliedViewTransitions.set(state.location.pathname, toPaths);
      }
      viewTransitionOpts = {
        currentLocation: state.location,
        nextLocation: location2
      };
    }
    updateState(
      {
        ...newState,
        // matches, errors, fetchers go through as-is
        actionData,
        loaderData,
        historyAction: pendingAction,
        location: location2,
        initialized: true,
        navigation: IDLE_NAVIGATION,
        revalidation: "idle",
        restoreScrollPosition,
        preventScrollReset,
        blockers
      },
      {
        viewTransitionOpts,
        flushSync: flushSync === true
      }
    );
    pendingAction = "POP";
    pendingPreventScrollReset = false;
    pendingViewTransitionEnabled = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    pendingPopstateNavigationDfd?.resolve();
    pendingPopstateNavigationDfd = null;
    pendingRevalidationDfd?.resolve();
    pendingRevalidationDfd = null;
  }
  async function navigate(to, opts) {
    pendingPopstateNavigationDfd?.resolve();
    pendingPopstateNavigationDfd = null;
    if (typeof to === "number") {
      if (!pendingPopstateNavigationDfd) {
        pendingPopstateNavigationDfd = createDeferred();
      }
      let promise = pendingPopstateNavigationDfd.promise;
      init2.history.go(to);
      return promise;
    }
    let normalizedPath = normalizeTo(
      state.location,
      state.matches,
      basename,
      to,
      opts?.fromRouteId,
      opts?.relative
    );
    let { path, submission, error } = normalizeNavigateOptions(
      false,
      normalizedPath,
      opts
    );
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    nextLocation = {
      ...nextLocation,
      ...init2.history.encodeLocation(nextLocation)
    };
    let userReplace = opts && opts.replace != null ? opts.replace : void 0;
    let historyAction = "PUSH";
    if (userReplace === true) {
      historyAction = "REPLACE";
    } else if (userReplace === false) ;
    else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      historyAction = "REPLACE";
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : void 0;
    let flushSync = (opts && opts.flushSync) === true;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: nextLocation
          });
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({ blockers });
        }
      });
      return;
    }
    await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace,
      enableViewTransition: opts && opts.viewTransition,
      flushSync,
      callSiteDefaultShouldRevalidate: opts && opts.unstable_defaultShouldRevalidate
    });
  }
  function revalidate() {
    if (!pendingRevalidationDfd) {
      pendingRevalidationDfd = createDeferred();
    }
    interruptActiveLoads();
    updateState({ revalidation: "loading" });
    let promise = pendingRevalidationDfd.promise;
    if (state.navigation.state === "submitting") {
      return promise;
    }
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return promise;
    }
    startNavigation(
      pendingAction || state.historyAction,
      state.navigation.location,
      {
        overrideNavigation: state.navigation,
        // Proxy through any rending view transition
        enableViewTransition: pendingViewTransitionEnabled === true
      }
    );
    return promise;
  }
  async function startNavigation(historyAction, location2, opts) {
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = opts?.initialHydration && state.matches && state.matches.length > 0 && !initialMatchesIsFOW ? (
      // `matchRoutes()` has already been called if we're in here via `router.initialize()`
      state.matches
    ) : matchRoutes(routesToUse, location2, basename);
    let flushSync = (opts && opts.flushSync) === true;
    if (matches && state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location2) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location2, { matches }, { flushSync });
      return;
    }
    let fogOfWar = checkFogOfWar(matches, routesToUse, location2.pathname);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    if (!matches) {
      let { error, notFoundMatches, route } = handleNavigational404(
        location2.pathname
      );
      completeNavigation(
        location2,
        {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        },
        { flushSync }
      );
      return;
    }
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(
      init2.history,
      location2,
      pendingNavigationController.signal,
      opts && opts.submission
    );
    let scopedContext = init2.getContext ? await init2.getContext() : new RouterContextProvider();
    let pendingActionResult;
    if (opts && opts.pendingError) {
      pendingActionResult = [
        findNearestBoundary(matches).route.id,
        { type: "error", error: opts.pendingError }
      ];
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      let actionResult = await handleAction(
        request,
        location2,
        opts.submission,
        matches,
        scopedContext,
        fogOfWar.active,
        opts && opts.initialHydration === true,
        { replace: opts.replace, flushSync }
      );
      if (actionResult.shortCircuited) {
        return;
      }
      if (actionResult.pendingActionResult) {
        let [routeId, result] = actionResult.pendingActionResult;
        if (isErrorResult(result) && isRouteErrorResponse(result.error) && result.error.status === 404) {
          pendingNavigationController = null;
          completeNavigation(location2, {
            matches: actionResult.matches,
            loaderData: {},
            errors: {
              [routeId]: result.error
            }
          });
          return;
        }
      }
      matches = actionResult.matches || matches;
      pendingActionResult = actionResult.pendingActionResult;
      loadingNavigation = getLoadingNavigation(location2, opts.submission);
      flushSync = false;
      fogOfWar.active = false;
      request = createClientSideRequest(
        init2.history,
        request.url,
        request.signal
      );
    }
    let {
      shortCircuited,
      matches: updatedMatches,
      loaderData,
      errors
    } = await handleLoaders(
      request,
      location2,
      matches,
      scopedContext,
      fogOfWar.active,
      loadingNavigation,
      opts && opts.submission,
      opts && opts.fetcherSubmission,
      opts && opts.replace,
      opts && opts.initialHydration === true,
      flushSync,
      pendingActionResult,
      opts && opts.callSiteDefaultShouldRevalidate
    );
    if (shortCircuited) {
      return;
    }
    pendingNavigationController = null;
    completeNavigation(location2, {
      matches: updatedMatches || matches,
      ...getActionDataForCommit(pendingActionResult),
      loaderData,
      errors
    });
  }
  async function handleAction(request, location2, submission, matches, scopedContext, isFogOfWar, initialHydration, opts = {}) {
    interruptActiveLoads();
    let navigation = getSubmittingNavigation(location2, submission);
    updateState({ navigation }, { flushSync: opts.flushSync === true });
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(
        matches,
        location2.pathname,
        request.signal
      );
      if (discoverResult.type === "aborted") {
        return { shortCircuited: true };
      } else if (discoverResult.type === "error") {
        if (discoverResult.partialMatches.length === 0) {
          let { matches: matches2, route } = getShortCircuitMatches(dataRoutes);
          return {
            matches: matches2,
            pendingActionResult: [
              route.id,
              {
                type: "error",
                error: discoverResult.error
              }
            ]
          };
        }
        let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
        return {
          matches: discoverResult.partialMatches,
          pendingActionResult: [
            boundaryId,
            {
              type: "error",
              error: discoverResult.error
            }
          ]
        };
      } else if (!discoverResult.matches) {
        let { notFoundMatches, error, route } = handleNavigational404(
          location2.pathname
        );
        return {
          matches: notFoundMatches,
          pendingActionResult: [
            route.id,
            {
              type: "error",
              error
            }
          ]
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    let result;
    let actionMatch = getTargetMatch(matches, location2);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: "error",
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location2.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      let dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        request,
        matches,
        actionMatch,
        initialHydration ? [] : hydrationRouteProperties2,
        scopedContext
      );
      let results = await callDataStrategy(
        request,
        dsMatches,
        scopedContext,
        null
      );
      result = results[actionMatch.route.id];
      if (!result) {
        for (let match of matches) {
          if (results[match.route.id]) {
            result = results[match.route.id];
            break;
          }
        }
      }
      if (request.signal.aborted) {
        return { shortCircuited: true };
      }
    }
    if (isRedirectResult(result)) {
      let replace2;
      if (opts && opts.replace != null) {
        replace2 = opts.replace;
      } else {
        let location22 = normalizeRedirectLocation(
          result.response.headers.get("Location"),
          new URL(request.url),
          basename
        );
        replace2 = location22 === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(request, result, true, {
        submission,
        replace: replace2
      });
      return { shortCircuited: true };
    }
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      if ((opts && opts.replace) !== true) {
        pendingAction = "PUSH";
      }
      return {
        matches,
        pendingActionResult: [
          boundaryMatch.route.id,
          result,
          actionMatch.route.id
        ]
      };
    }
    return {
      matches,
      pendingActionResult: [actionMatch.route.id, result]
    };
  }
  async function handleLoaders(request, location2, matches, scopedContext, isFogOfWar, overrideNavigation, submission, fetcherSubmission, replace2, initialHydration, flushSync, pendingActionResult, callSiteDefaultShouldRevalidate) {
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location2, submission);
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    let shouldUpdateNavigationState = !isUninterruptedRevalidation && !initialHydration;
    if (isFogOfWar) {
      if (shouldUpdateNavigationState) {
        let actionData = getUpdatedActionData(pendingActionResult);
        updateState(
          {
            navigation: loadingNavigation,
            ...actionData !== void 0 ? { actionData } : {}
          },
          {
            flushSync
          }
        );
      }
      let discoverResult = await discoverRoutes(
        matches,
        location2.pathname,
        request.signal
      );
      if (discoverResult.type === "aborted") {
        return { shortCircuited: true };
      } else if (discoverResult.type === "error") {
        if (discoverResult.partialMatches.length === 0) {
          let { matches: matches2, route } = getShortCircuitMatches(dataRoutes);
          return {
            matches: matches2,
            loaderData: {},
            errors: {
              [route.id]: discoverResult.error
            }
          };
        }
        let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
        return {
          matches: discoverResult.partialMatches,
          loaderData: {},
          errors: {
            [boundaryId]: discoverResult.error
          }
        };
      } else if (!discoverResult.matches) {
        let { error, notFoundMatches, route } = handleNavigational404(
          location2.pathname
        );
        return {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let { dsMatches, revalidatingFetchers } = getMatchesToLoad(
      request,
      scopedContext,
      mapRouteProperties2,
      manifest,
      init2.history,
      state,
      matches,
      activeSubmission,
      location2,
      initialHydration ? [] : hydrationRouteProperties2,
      initialHydration === true,
      isRevalidationRequired,
      cancelledFetcherLoads,
      fetchersQueuedForDeletion,
      fetchLoadMatches,
      fetchRedirectIds,
      routesToUse,
      basename,
      init2.patchRoutesOnNavigation != null,
      pendingActionResult,
      callSiteDefaultShouldRevalidate
    );
    pendingNavigationLoadId = ++incrementingLoadId;
    if (!init2.dataStrategy && !dsMatches.some((m) => m.shouldLoad) && !dsMatches.some(
      (m) => m.route.middleware && m.route.middleware.length > 0
    ) && revalidatingFetchers.length === 0) {
      let updatedFetchers2 = markFetchRedirectsDone();
      completeNavigation(
        location2,
        {
          matches,
          loaderData: {},
          // Commit pending error if we're short circuiting
          errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? { [pendingActionResult[0]]: pendingActionResult[1].error } : null,
          ...getActionDataForCommit(pendingActionResult),
          ...updatedFetchers2 ? { fetchers: new Map(state.fetchers) } : {}
        },
        { flushSync }
      );
      return { shortCircuited: true };
    }
    if (shouldUpdateNavigationState) {
      let updates = {};
      if (!isFogOfWar) {
        updates.navigation = loadingNavigation;
        let actionData = getUpdatedActionData(pendingActionResult);
        if (actionData !== void 0) {
          updates.actionData = actionData;
        }
      }
      if (revalidatingFetchers.length > 0) {
        updates.fetchers = getUpdatedRevalidatingFetchers(revalidatingFetchers);
      }
      updateState(updates, { flushSync });
    }
    revalidatingFetchers.forEach((rf) => {
      abortFetcher(rf.key);
      if (rf.controller) {
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((f) => abortFetcher(f.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener(
        "abort",
        abortPendingFetchRevalidations
      );
    }
    let { loaderResults, fetcherResults } = await callLoadersAndMaybeResolveData(
      dsMatches,
      revalidatingFetchers,
      request,
      scopedContext
    );
    if (request.signal.aborted) {
      return { shortCircuited: true };
    }
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener(
        "abort",
        abortPendingFetchRevalidations
      );
    }
    revalidatingFetchers.forEach((rf) => fetchControllers.delete(rf.key));
    let redirect2 = findRedirect(loaderResults);
    if (redirect2) {
      await startRedirectNavigation(request, redirect2.result, true, {
        replace: replace2
      });
      return { shortCircuited: true };
    }
    redirect2 = findRedirect(fetcherResults);
    if (redirect2) {
      fetchRedirectIds.add(redirect2.key);
      await startRedirectNavigation(request, redirect2.result, true, {
        replace: replace2
      });
      return { shortCircuited: true };
    }
    let { loaderData, errors } = processLoaderData(
      state,
      matches,
      loaderResults,
      pendingActionResult,
      revalidatingFetchers,
      fetcherResults
    );
    if (initialHydration && state.errors) {
      errors = { ...state.errors, ...errors };
    }
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return {
      matches,
      loaderData,
      errors,
      ...shouldUpdateFetchers ? { fetchers: new Map(state.fetchers) } : {}
    };
  }
  function getUpdatedActionData(pendingActionResult) {
    if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
      return {
        [pendingActionResult[0]]: pendingActionResult[1].data
      };
    } else if (state.actionData) {
      if (Object.keys(state.actionData).length === 0) {
        return null;
      } else {
        return state.actionData;
      }
    }
  }
  function getUpdatedRevalidatingFetchers(revalidatingFetchers) {
    revalidatingFetchers.forEach((rf) => {
      let fetcher = state.fetchers.get(rf.key);
      let revalidatingFetcher = getLoadingFetcher(
        void 0,
        fetcher ? fetcher.data : void 0
      );
      state.fetchers.set(rf.key, revalidatingFetcher);
    });
    return new Map(state.fetchers);
  }
  async function fetch2(key, routeId, href2, opts) {
    abortFetcher(key);
    let flushSync = (opts && opts.flushSync) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(
      state.location,
      state.matches,
      basename,
      href2,
      routeId,
      opts?.relative
    );
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    let fogOfWar = checkFogOfWar(matches, routesToUse, normalizedPath);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    if (!matches) {
      setFetcherError(
        key,
        routeId,
        getInternalRouterError(404, { pathname: normalizedPath }),
        { flushSync }
      );
      return;
    }
    let { path, submission, error } = normalizeNavigateOptions(
      true,
      normalizedPath,
      opts
    );
    if (error) {
      setFetcherError(key, routeId, error, { flushSync });
      return;
    }
    let scopedContext = init2.getContext ? await init2.getContext() : new RouterContextProvider();
    let preventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      await handleFetcherAction(
        key,
        routeId,
        path,
        matches,
        scopedContext,
        fogOfWar.active,
        flushSync,
        preventScrollReset,
        submission,
        opts && opts.unstable_defaultShouldRevalidate
      );
      return;
    }
    fetchLoadMatches.set(key, { routeId, path });
    await handleFetcherLoader(
      key,
      routeId,
      path,
      matches,
      scopedContext,
      fogOfWar.active,
      flushSync,
      preventScrollReset,
      submission
    );
  }
  async function handleFetcherAction(key, routeId, path, requestMatches, scopedContext, isFogOfWar, flushSync, preventScrollReset, submission, callSiteDefaultShouldRevalidate) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(
      init2.history,
      path,
      abortController.signal,
      submission
    );
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(
        requestMatches,
        new URL(fetchRequest.url).pathname,
        fetchRequest.signal,
        key
      );
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        setFetcherError(key, routeId, discoverResult.error, { flushSync });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(
          key,
          routeId,
          getInternalRouterError(404, { pathname: path }),
          { flushSync }
        );
        return;
      } else {
        requestMatches = discoverResult.matches;
      }
    }
    let match = getTargetMatch(requestMatches, path);
    if (!match.route.action && !match.route.lazy) {
      let error = getInternalRouterError(405, {
        method: submission.formMethod,
        pathname: path,
        routeId
      });
      setFetcherError(key, routeId, error, { flushSync });
      return;
    }
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let fetchMatches = getTargetedDataStrategyMatches(
      mapRouteProperties2,
      manifest,
      fetchRequest,
      requestMatches,
      match,
      hydrationRouteProperties2,
      scopedContext
    );
    let actionResults = await callDataStrategy(
      fetchRequest,
      fetchMatches,
      scopedContext,
      key
    );
    let actionResult = actionResults[match.route.id];
    if (!actionResult) {
      for (let match2 of fetchMatches) {
        if (actionResults[match2.route.id]) {
          actionResult = actionResults[match2.route.id];
          break;
        }
      }
    }
    if (fetchRequest.signal.aborted) {
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    if (fetchersQueuedForDeletion.has(key)) {
      if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      }
    } else {
      if (isRedirectResult(actionResult)) {
        fetchControllers.delete(key);
        if (pendingNavigationLoadId > originatingLoadId) {
          updateFetcherState(key, getDoneFetcher(void 0));
          return;
        } else {
          fetchRedirectIds.add(key);
          updateFetcherState(key, getLoadingFetcher(submission));
          return startRedirectNavigation(fetchRequest, actionResult, false, {
            fetcherSubmission: submission,
            preventScrollReset
          });
        }
      }
      if (isErrorResult(actionResult)) {
        setFetcherError(key, routeId, actionResult.error);
        return;
      }
    }
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(
      init2.history,
      nextLocation,
      abortController.signal
    );
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant$1(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let { dsMatches, revalidatingFetchers } = getMatchesToLoad(
      revalidationRequest,
      scopedContext,
      mapRouteProperties2,
      manifest,
      init2.history,
      state,
      matches,
      submission,
      nextLocation,
      hydrationRouteProperties2,
      false,
      isRevalidationRequired,
      cancelledFetcherLoads,
      fetchersQueuedForDeletion,
      fetchLoadMatches,
      fetchRedirectIds,
      routesToUse,
      basename,
      init2.patchRoutesOnNavigation != null,
      [match.route.id, actionResult],
      callSiteDefaultShouldRevalidate
    );
    revalidatingFetchers.filter((rf) => rf.key !== key).forEach((rf) => {
      let staleKey = rf.key;
      let existingFetcher2 = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(
        void 0,
        existingFetcher2 ? existingFetcher2.data : void 0
      );
      state.fetchers.set(staleKey, revalidatingFetcher);
      abortFetcher(staleKey);
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({ fetchers: new Map(state.fetchers) });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((rf) => abortFetcher(rf.key));
    abortController.signal.addEventListener(
      "abort",
      abortPendingFetchRevalidations
    );
    let { loaderResults, fetcherResults } = await callLoadersAndMaybeResolveData(
      dsMatches,
      revalidatingFetchers,
      revalidationRequest,
      scopedContext
    );
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener(
      "abort",
      abortPendingFetchRevalidations
    );
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach((r) => fetchControllers.delete(r.key));
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    let redirect2 = findRedirect(loaderResults);
    if (redirect2) {
      return startRedirectNavigation(
        revalidationRequest,
        redirect2.result,
        false,
        { preventScrollReset }
      );
    }
    redirect2 = findRedirect(fetcherResults);
    if (redirect2) {
      fetchRedirectIds.add(redirect2.key);
      return startRedirectNavigation(
        revalidationRequest,
        redirect2.result,
        false,
        { preventScrollReset }
      );
    }
    let { loaderData, errors } = processLoaderData(
      state,
      matches,
      loaderResults,
      void 0,
      revalidatingFetchers,
      fetcherResults
    );
    abortStaleFetchLoads(loadId);
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant$1(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state.fetchers)
      });
    } else {
      updateState({
        errors,
        loaderData: mergeLoaderData(
          state.loaderData,
          loaderData,
          matches,
          errors
        ),
        fetchers: new Map(state.fetchers)
      });
      isRevalidationRequired = false;
    }
  }
  async function handleFetcherLoader(key, routeId, path, matches, scopedContext, isFogOfWar, flushSync, preventScrollReset, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(
      key,
      getLoadingFetcher(
        submission,
        existingFetcher ? existingFetcher.data : void 0
      ),
      { flushSync }
    );
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(
      init2.history,
      path,
      abortController.signal
    );
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(
        matches,
        new URL(fetchRequest.url).pathname,
        fetchRequest.signal,
        key
      );
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        setFetcherError(key, routeId, discoverResult.error, { flushSync });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(
          key,
          routeId,
          getInternalRouterError(404, { pathname: path }),
          { flushSync }
        );
        return;
      } else {
        matches = discoverResult.matches;
      }
    }
    let match = getTargetMatch(matches, path);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let dsMatches = getTargetedDataStrategyMatches(
      mapRouteProperties2,
      manifest,
      fetchRequest,
      matches,
      match,
      hydrationRouteProperties2,
      scopedContext
    );
    let results = await callDataStrategy(
      fetchRequest,
      dsMatches,
      scopedContext,
      key
    );
    let result = results[match.route.id];
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    if (fetchersQueuedForDeletion.has(key)) {
      updateFetcherState(key, getDoneFetcher(void 0));
      return;
    }
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(fetchRequest, result, false, {
          preventScrollReset
        });
        return;
      }
    }
    if (isErrorResult(result)) {
      setFetcherError(key, routeId, result.error);
      return;
    }
    updateFetcherState(key, getDoneFetcher(result.data));
  }
  async function startRedirectNavigation(request, redirect2, isNavigation, {
    submission,
    fetcherSubmission,
    preventScrollReset,
    replace: replace2
  } = {}) {
    if (!isNavigation) {
      pendingPopstateNavigationDfd?.resolve();
      pendingPopstateNavigationDfd = null;
    }
    if (redirect2.response.headers.has("X-Remix-Revalidate")) {
      isRevalidationRequired = true;
    }
    let location2 = redirect2.response.headers.get("Location");
    invariant$1(location2, "Expected a Location header on the redirect Response");
    location2 = normalizeRedirectLocation(
      location2,
      new URL(request.url),
      basename
    );
    let redirectLocation = createLocation(state.location, location2, {
      _isRedirect: true
    });
    if (isBrowser3) {
      let isDocumentReload = false;
      if (redirect2.response.headers.has("X-Remix-Reload-Document")) {
        isDocumentReload = true;
      } else if (isAbsoluteUrl(location2)) {
        const url = createBrowserURLImpl(location2, true);
        isDocumentReload = // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace2) {
          routerWindow.location.replace(location2);
        } else {
          routerWindow.location.assign(location2);
        }
        return;
      }
    }
    pendingNavigationController = null;
    let redirectNavigationType = replace2 === true || redirect2.response.headers.has("X-Remix-Replace") ? "REPLACE" : "PUSH";
    let { formMethod, formAction, formEncType } = state.navigation;
    if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
      submission = getSubmissionFromNavigation(state.navigation);
    }
    let activeSubmission = submission || fetcherSubmission;
    if (redirectPreserveMethodStatusCodes.has(redirect2.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectNavigationType, redirectLocation, {
        submission: {
          ...activeSubmission,
          formAction: location2
        },
        // Preserve these flags across redirects
        preventScrollReset: preventScrollReset || pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
      });
    } else {
      let overrideNavigation = getLoadingNavigation(
        redirectLocation,
        submission
      );
      await startNavigation(redirectNavigationType, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve these flags across redirects
        preventScrollReset: preventScrollReset || pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
      });
    }
  }
  async function callDataStrategy(request, matches, scopedContext, fetcherKey) {
    let results;
    let dataResults = {};
    try {
      results = await callDataStrategyImpl(
        dataStrategyImpl,
        request,
        matches,
        fetcherKey,
        scopedContext,
        false
      );
    } catch (e) {
      matches.filter((m) => m.shouldLoad).forEach((m) => {
        dataResults[m.route.id] = {
          type: "error",
          error: e
        };
      });
      return dataResults;
    }
    if (request.signal.aborted) {
      return dataResults;
    }
    if (!isMutationMethod(request.method)) {
      for (let match of matches) {
        if (results[match.route.id]?.type === "error") {
          break;
        }
        if (!results.hasOwnProperty(match.route.id) && !state.loaderData.hasOwnProperty(match.route.id) && (!state.errors || !state.errors.hasOwnProperty(match.route.id)) && match.shouldCallHandler()) {
          results[match.route.id] = {
            type: "error",
            result: new Error(
              `No result returned from dataStrategy for route ${match.route.id}`
            )
          };
        }
      }
    }
    for (let [routeId, result] of Object.entries(results)) {
      if (isRedirectDataStrategyResult(result)) {
        let response = result.result;
        dataResults[routeId] = {
          type: "redirect",
          response: normalizeRelativeRoutingRedirectResponse(
            response,
            request,
            routeId,
            matches,
            basename
          )
        };
      } else {
        dataResults[routeId] = await convertDataStrategyResultToDataResult(result);
      }
    }
    return dataResults;
  }
  async function callLoadersAndMaybeResolveData(matches, fetchersToLoad, request, scopedContext) {
    let loaderResultsPromise = callDataStrategy(
      request,
      matches,
      scopedContext,
      null
    );
    let fetcherResultsPromise = Promise.all(
      fetchersToLoad.map(async (f) => {
        if (f.matches && f.match && f.request && f.controller) {
          let results = await callDataStrategy(
            f.request,
            f.matches,
            scopedContext,
            f.key
          );
          let result = results[f.match.route.id];
          return { [f.key]: result };
        } else {
          return Promise.resolve({
            [f.key]: {
              type: "error",
              error: getInternalRouterError(404, {
                pathname: f.path
              })
            }
          });
        }
      })
    );
    let loaderResults = await loaderResultsPromise;
    let fetcherResults = (await fetcherResultsPromise).reduce(
      (acc, r) => Object.assign(acc, r),
      {}
    );
    return {
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    isRevalidationRequired = true;
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.add(key);
      }
      abortFetcher(key);
    });
  }
  function updateFetcherState(key, fetcher, opts = {}) {
    state.fetchers.set(key, fetcher);
    updateState(
      { fetchers: new Map(state.fetchers) },
      { flushSync: (opts && opts.flushSync) === true }
    );
  }
  function setFetcherError(key, routeId, error, opts = {}) {
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState(
      {
        errors: {
          [boundaryMatch.route.id]: error
        },
        fetchers: new Map(state.fetchers)
      },
      { flushSync: (opts && opts.flushSync) === true }
    );
  }
  function getFetcher(key) {
    activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
    if (fetchersQueuedForDeletion.has(key)) {
      fetchersQueuedForDeletion.delete(key);
    }
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function resetFetcher(key, opts) {
    abortFetcher(key, opts?.reason);
    updateFetcherState(key, getDoneFetcher(null));
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    fetchersQueuedForDeletion.delete(key);
    cancelledFetcherLoads.delete(key);
    state.fetchers.delete(key);
  }
  function queueFetcherForDeletion(key) {
    let count = (activeFetchers.get(key) || 0) - 1;
    if (count <= 0) {
      activeFetchers.delete(key);
      fetchersQueuedForDeletion.add(key);
    } else {
      activeFetchers.set(key, count);
    }
    updateState({ fetchers: new Map(state.fetchers) });
  }
  function abortFetcher(key, reason) {
    let controller = fetchControllers.get(key);
    if (controller) {
      controller.abort(reason);
      fetchControllers.delete(key);
    }
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant$1(fetcher, `Expected fetcher: ${key}`);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant$1(fetcher, `Expected fetcher: ${key}`);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    invariant$1(
      blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked",
      `Invalid blocker state transition: ${blocker.state} -> ${newBlocker.state}`
    );
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({ blockers });
  }
  function shouldBlockNavigation({
    currentLocation,
    nextLocation,
    historyAction
  }) {
    if (blockerFunctions.size === 0) {
      return;
    }
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      return;
    }
    if (blockerFunction({ currentLocation, nextLocation, historyAction })) {
      return blockerKey;
    }
  }
  function handleNavigational404(pathname) {
    let error = getInternalRouterError(404, { pathname });
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let { matches, route } = getShortCircuitMatches(routesToUse);
    return { notFoundMatches: matches, route, error };
  }
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions2 = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey2 = getKey || null;
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y = getSavedScrollPosition(state.location, state.matches);
      if (y != null) {
        updateState({ restoreScrollPosition: y });
      }
    }
    return () => {
      savedScrollPositions2 = null;
      getScrollPosition = null;
      getScrollRestorationKey2 = null;
    };
  }
  function getScrollKey(location2, matches) {
    if (getScrollRestorationKey2) {
      let key = getScrollRestorationKey2(
        location2,
        matches.map((m) => convertRouteMatchToUiMatch(m, state.loaderData))
      );
      return key || location2.key;
    }
    return location2.key;
  }
  function saveScrollPosition(location2, matches) {
    if (savedScrollPositions2 && getScrollPosition) {
      let key = getScrollKey(location2, matches);
      savedScrollPositions2[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location2, matches) {
    if (savedScrollPositions2) {
      let key = getScrollKey(location2, matches);
      let y = savedScrollPositions2[key];
      if (typeof y === "number") {
        return y;
      }
    }
    return null;
  }
  function checkFogOfWar(matches, routesToUse, pathname) {
    if (init2.patchRoutesOnNavigation) {
      if (!matches) {
        let fogMatches = matchRoutesImpl(
          routesToUse,
          pathname,
          basename,
          true
        );
        return { active: true, matches: fogMatches || [] };
      } else {
        if (Object.keys(matches[0].params).length > 0) {
          let partialMatches = matchRoutesImpl(
            routesToUse,
            pathname,
            basename,
            true
          );
          return { active: true, matches: partialMatches };
        }
      }
    }
    return { active: false, matches: null };
  }
  async function discoverRoutes(matches, pathname, signal, fetcherKey) {
    if (!init2.patchRoutesOnNavigation) {
      return { type: "success", matches };
    }
    let partialMatches = matches;
    while (true) {
      let isNonHMR = inFlightDataRoutes == null;
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let localManifest = manifest;
      try {
        await init2.patchRoutesOnNavigation({
          signal,
          path: pathname,
          matches: partialMatches,
          fetcherKey,
          patch: (routeId, children) => {
            if (signal.aborted) return;
            patchRoutesImpl(
              routeId,
              children,
              routesToUse,
              localManifest,
              mapRouteProperties2,
              false
            );
          }
        });
      } catch (e) {
        return { type: "error", error: e, partialMatches };
      } finally {
        if (isNonHMR && !signal.aborted) {
          dataRoutes = [...dataRoutes];
        }
      }
      if (signal.aborted) {
        return { type: "aborted" };
      }
      let newMatches = matchRoutes(routesToUse, pathname, basename);
      let newPartialMatches = null;
      if (newMatches) {
        if (Object.keys(newMatches[0].params).length === 0) {
          return { type: "success", matches: newMatches };
        } else {
          newPartialMatches = matchRoutesImpl(
            routesToUse,
            pathname,
            basename,
            true
          );
          let matchedDeeper = newPartialMatches && partialMatches.length < newPartialMatches.length && compareMatches(
            partialMatches,
            newPartialMatches.slice(0, partialMatches.length)
          );
          if (!matchedDeeper) {
            return { type: "success", matches: newMatches };
          }
        }
      }
      if (!newPartialMatches) {
        newPartialMatches = matchRoutesImpl(
          routesToUse,
          pathname,
          basename,
          true
        );
      }
      if (!newPartialMatches || compareMatches(partialMatches, newPartialMatches)) {
        return { type: "success", matches: null };
      }
      partialMatches = newPartialMatches;
    }
  }
  function compareMatches(a, b) {
    return a.length === b.length && a.every((m, i) => m.route.id === b[i].route.id);
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(
      newRoutes,
      mapRouteProperties2,
      void 0,
      manifest
    );
  }
  function patchRoutes(routeId, children, unstable_allowElementMutations = false) {
    let isNonHMR = inFlightDataRoutes == null;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    patchRoutesImpl(
      routeId,
      children,
      routesToUse,
      manifest,
      mapRouteProperties2,
      unstable_allowElementMutations
    );
    if (isNonHMR) {
      dataRoutes = [...dataRoutes];
      updateState({});
    }
  }
  router2 = {
    get basename() {
      return basename;
    },
    get future() {
      return future;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return routerWindow;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch: fetch2,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (to) => init2.history.createHref(to),
    encodeLocation: (to) => init2.history.encodeLocation(to),
    getFetcher,
    resetFetcher,
    deleteFetcher: queueFetcherForDeletion,
    dispose,
    getBlocker,
    deleteBlocker,
    patchRoutes,
    _internalFetchControllers: fetchControllers,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes,
    _internalSetStateDoNotUseOrYouWillBreakYourApp(newState) {
      updateState(newState);
    }
  };
  if (init2.unstable_instrumentations) {
    router2 = instrumentClientSideRouter(
      router2,
      init2.unstable_instrumentations.map((i) => i.router).filter(Boolean)
    );
  }
  return router2;
}
function createStaticHandler(routes, opts) {
  invariant$1(
    routes.length > 0,
    "You must provide a non-empty routes array to createStaticHandler"
  );
  let manifest = {};
  let basename = (opts ? opts.basename : null) || "/";
  let _mapRouteProperties = opts?.mapRouteProperties || defaultMapRouteProperties;
  let mapRouteProperties2 = _mapRouteProperties;
  if (opts?.unstable_instrumentations) {
    let instrumentations = opts.unstable_instrumentations;
    mapRouteProperties2 = (route) => {
      return {
        ..._mapRouteProperties(route),
        ...getRouteInstrumentationUpdates(
          instrumentations.map((i) => i.route).filter(Boolean),
          route
        )
      };
    };
  }
  let dataRoutes = convertRoutesToDataRoutes(
    routes,
    mapRouteProperties2,
    void 0,
    manifest
  );
  async function query(request, {
    requestContext,
    filterMatchesToLoad,
    skipLoaderErrorBubbling,
    skipRevalidation,
    dataStrategy,
    generateMiddlewareResponse
  } = {}) {
    let url = new URL(request.url);
    let method = request.method;
    let location2 = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location2, basename);
    requestContext = requestContext != null ? requestContext : new RouterContextProvider();
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, { method });
      let { matches: methodNotAllowedMatches, route } = getShortCircuitMatches(dataRoutes);
      let staticContext = {
        basename,
        location: location2,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {}
      };
      return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
    } else if (!matches) {
      let error = getInternalRouterError(404, { pathname: location2.pathname });
      let { matches: notFoundMatches, route } = getShortCircuitMatches(dataRoutes);
      let staticContext = {
        basename,
        location: location2,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {}
      };
      return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
    }
    if (generateMiddlewareResponse) {
      invariant$1(
        requestContext instanceof RouterContextProvider,
        "When using middleware in `staticHandler.query()`, any provided `requestContext` must be an instance of `RouterContextProvider`"
      );
      try {
        await loadLazyMiddlewareForMatches(
          matches,
          manifest,
          mapRouteProperties2
        );
        let renderedStaticContext;
        let response = await runServerMiddlewarePipeline(
          {
            request,
            unstable_pattern: getRoutePattern(matches),
            matches,
            params: matches[0].params,
            // If we're calling middleware then it must be enabled so we can cast
            // this to the proper type knowing it's not an `AppLoadContext`
            context: requestContext
          },
          async () => {
            let res = await generateMiddlewareResponse(
              async (revalidationRequest, opts2 = {}) => {
                let result2 = await queryImpl(
                  revalidationRequest,
                  location2,
                  matches,
                  requestContext,
                  dataStrategy || null,
                  skipLoaderErrorBubbling === true,
                  null,
                  "filterMatchesToLoad" in opts2 ? opts2.filterMatchesToLoad ?? null : filterMatchesToLoad ?? null,
                  skipRevalidation === true
                );
                if (isResponse(result2)) {
                  return result2;
                }
                renderedStaticContext = { location: location2, basename, ...result2 };
                return renderedStaticContext;
              }
            );
            return res;
          },
          async (error, routeId) => {
            if (isRedirectResponse(error)) {
              return error;
            }
            if (isResponse(error)) {
              try {
                error = new ErrorResponseImpl(
                  error.status,
                  error.statusText,
                  await parseResponseBody(error)
                );
              } catch (e) {
                error = e;
              }
            }
            if (isDataWithResponseInit(error)) {
              error = dataWithResponseInitToErrorResponse(error);
            }
            if (renderedStaticContext) {
              if (routeId in renderedStaticContext.loaderData) {
                renderedStaticContext.loaderData[routeId] = void 0;
              }
              let staticContext = getStaticContextFromError(
                dataRoutes,
                renderedStaticContext,
                error,
                skipLoaderErrorBubbling ? routeId : findNearestBoundary(matches, routeId).route.id
              );
              return generateMiddlewareResponse(
                () => Promise.resolve(staticContext)
              );
            } else {
              let boundaryRouteId = skipLoaderErrorBubbling ? routeId : findNearestBoundary(
                matches,
                matches.find(
                  (m) => m.route.id === routeId || m.route.loader
                )?.route.id || routeId
              ).route.id;
              let staticContext = {
                matches,
                location: location2,
                basename,
                loaderData: {},
                actionData: null,
                errors: {
                  [boundaryRouteId]: error
                },
                statusCode: isRouteErrorResponse(error) ? error.status : 500,
                actionHeaders: {},
                loaderHeaders: {}
              };
              return generateMiddlewareResponse(
                () => Promise.resolve(staticContext)
              );
            }
          }
        );
        invariant$1(isResponse(response), "Expected a response in query()");
        return response;
      } catch (e) {
        if (isResponse(e)) {
          return e;
        }
        throw e;
      }
    }
    let result = await queryImpl(
      request,
      location2,
      matches,
      requestContext,
      dataStrategy || null,
      skipLoaderErrorBubbling === true,
      null,
      filterMatchesToLoad || null,
      skipRevalidation === true
    );
    if (isResponse(result)) {
      return result;
    }
    return { location: location2, basename, ...result };
  }
  async function queryRoute(request, {
    routeId,
    requestContext,
    dataStrategy,
    generateMiddlewareResponse
  } = {}) {
    let url = new URL(request.url);
    let method = request.method;
    let location2 = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location2, basename);
    requestContext = requestContext != null ? requestContext : new RouterContextProvider();
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, { method });
    } else if (!matches) {
      throw getInternalRouterError(404, { pathname: location2.pathname });
    }
    let match = routeId ? matches.find((m) => m.route.id === routeId) : getTargetMatch(matches, location2);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location2.pathname,
        routeId
      });
    } else if (!match) {
      throw getInternalRouterError(404, { pathname: location2.pathname });
    }
    if (generateMiddlewareResponse) {
      invariant$1(
        requestContext instanceof RouterContextProvider,
        "When using middleware in `staticHandler.queryRoute()`, any provided `requestContext` must be an instance of `RouterContextProvider`"
      );
      await loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties2);
      let response = await runServerMiddlewarePipeline(
        {
          request,
          unstable_pattern: getRoutePattern(matches),
          matches,
          params: matches[0].params,
          // If we're calling middleware then it must be enabled so we can cast
          // this to the proper type knowing it's not an `AppLoadContext`
          context: requestContext
        },
        async () => {
          let res = await generateMiddlewareResponse(
            async (innerRequest) => {
              let result2 = await queryImpl(
                innerRequest,
                location2,
                matches,
                requestContext,
                dataStrategy || null,
                false,
                match,
                null,
                false
              );
              let processed = handleQueryResult(result2);
              return isResponse(processed) ? processed : typeof processed === "string" ? new Response(processed) : Response.json(processed);
            }
          );
          return res;
        },
        (error) => {
          if (isDataWithResponseInit(error)) {
            return Promise.resolve(dataWithResponseInitToResponse(error));
          }
          if (isResponse(error)) {
            return Promise.resolve(error);
          }
          throw error;
        }
      );
      return response;
    }
    let result = await queryImpl(
      request,
      location2,
      matches,
      requestContext,
      dataStrategy || null,
      false,
      match,
      null,
      false
    );
    return handleQueryResult(result);
    function handleQueryResult(result2) {
      if (isResponse(result2)) {
        return result2;
      }
      let error = result2.errors ? Object.values(result2.errors)[0] : void 0;
      if (error !== void 0) {
        throw error;
      }
      if (result2.actionData) {
        return Object.values(result2.actionData)[0];
      }
      if (result2.loaderData) {
        return Object.values(result2.loaderData)[0];
      }
      return void 0;
    }
  }
  async function queryImpl(request, location2, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, skipRevalidation) {
    invariant$1(
      request.signal,
      "query()/queryRoute() requests must contain an AbortController signal"
    );
    try {
      if (isMutationMethod(request.method)) {
        let result2 = await submit(
          request,
          matches,
          routeMatch || getTargetMatch(matches, location2),
          requestContext,
          dataStrategy,
          skipLoaderErrorBubbling,
          routeMatch != null,
          filterMatchesToLoad,
          skipRevalidation
        );
        return result2;
      }
      let result = await loadRouteData(
        request,
        matches,
        requestContext,
        dataStrategy,
        skipLoaderErrorBubbling,
        routeMatch,
        filterMatchesToLoad
      );
      return isResponse(result) ? result : {
        ...result,
        actionData: null,
        actionHeaders: {}
      };
    } catch (e) {
      if (isDataStrategyResult(e) && isResponse(e.result)) {
        if (e.type === "error") {
          throw e.result;
        }
        return e.result;
      }
      if (isRedirectResponse(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, dataStrategy, skipLoaderErrorBubbling, isRouteRequest, filterMatchesToLoad, skipRevalidation) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: "error",
        error
      };
    } else {
      let dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        request,
        matches,
        actionMatch,
        [],
        requestContext
      );
      let results = await callDataStrategy(
        request,
        dsMatches,
        isRouteRequest,
        requestContext,
        dataStrategy
      );
      result = results[actionMatch.route.id];
      if (request.signal.aborted) {
        throwStaticHandlerAbortedError(request, isRouteRequest);
      }
    }
    if (isRedirectResult(result)) {
      throw new Response(null, {
        status: result.response.status,
        headers: {
          Location: result.response.headers.get("Location")
        }
      });
    }
    if (isRouteRequest) {
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: { [actionMatch.route.id]: result.data },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {}
      };
    }
    if (skipRevalidation) {
      if (isErrorResult(result)) {
        let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
        return {
          statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
          actionData: null,
          actionHeaders: {
            ...result.headers ? { [actionMatch.route.id]: result.headers } : {}
          },
          matches,
          loaderData: {},
          errors: {
            [boundaryMatch.route.id]: result.error
          },
          loaderHeaders: {}
        };
      } else {
        return {
          actionData: {
            [actionMatch.route.id]: result.data
          },
          actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {},
          matches,
          loaderData: {},
          errors: null,
          statusCode: result.statusCode || 200,
          loaderHeaders: {}
        };
      }
    }
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    if (isErrorResult(result)) {
      let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
      let handlerContext2 = await loadRouteData(
        loaderRequest,
        matches,
        requestContext,
        dataStrategy,
        skipLoaderErrorBubbling,
        null,
        filterMatchesToLoad,
        [boundaryMatch.route.id, result]
      );
      return {
        ...handlerContext2,
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
        actionData: null,
        actionHeaders: {
          ...result.headers ? { [actionMatch.route.id]: result.headers } : {}
        }
      };
    }
    let handlerContext = await loadRouteData(
      loaderRequest,
      matches,
      requestContext,
      dataStrategy,
      skipLoaderErrorBubbling,
      null,
      filterMatchesToLoad
    );
    return {
      ...handlerContext,
      actionData: {
        [actionMatch.route.id]: result.data
      },
      // action status codes take precedence over loader status codes
      ...result.statusCode ? { statusCode: result.statusCode } : {},
      actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {}
    };
  }
  async function loadRouteData(request, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, pendingActionResult) {
    let isRouteRequest = routeMatch != null;
    if (isRouteRequest && !routeMatch?.route.loader && !routeMatch?.route.lazy) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch?.route.id
      });
    }
    let dsMatches;
    if (routeMatch) {
      dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        request,
        matches,
        routeMatch,
        [],
        requestContext
      );
    } else {
      let maxIdx = pendingActionResult && isErrorResult(pendingActionResult[1]) ? (
        // Up to but not including the boundary
        matches.findIndex((m) => m.route.id === pendingActionResult[0]) - 1
      ) : void 0;
      let pattern = getRoutePattern(matches);
      dsMatches = matches.map((match, index) => {
        if (maxIdx != null && index > maxIdx) {
          return getDataStrategyMatch(
            mapRouteProperties2,
            manifest,
            request,
            pattern,
            match,
            [],
            requestContext,
            false
          );
        }
        return getDataStrategyMatch(
          mapRouteProperties2,
          manifest,
          request,
          pattern,
          match,
          [],
          requestContext,
          (match.route.loader || match.route.lazy) != null && (!filterMatchesToLoad || filterMatchesToLoad(match))
        );
      });
    }
    if (!dataStrategy && !dsMatches.some((m) => m.shouldLoad)) {
      return {
        matches,
        loaderData: {},
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null,
        statusCode: 200,
        loaderHeaders: {}
      };
    }
    let results = await callDataStrategy(
      request,
      dsMatches,
      isRouteRequest,
      requestContext,
      dataStrategy
    );
    if (request.signal.aborted) {
      throwStaticHandlerAbortedError(request, isRouteRequest);
    }
    let handlerContext = processRouteLoaderData(
      matches,
      results,
      pendingActionResult,
      true,
      skipLoaderErrorBubbling
    );
    return {
      ...handlerContext,
      matches
    };
  }
  async function callDataStrategy(request, matches, isRouteRequest, requestContext, dataStrategy) {
    let results = await callDataStrategyImpl(
      dataStrategy || defaultDataStrategy,
      request,
      matches,
      null,
      requestContext,
      true
    );
    let dataResults = {};
    await Promise.all(
      matches.map(async (match) => {
        if (!(match.route.id in results)) {
          return;
        }
        let result = results[match.route.id];
        if (isRedirectDataStrategyResult(result)) {
          let response = result.result;
          throw normalizeRelativeRoutingRedirectResponse(
            response,
            request,
            match.route.id,
            matches,
            basename
          );
        }
        if (isRouteRequest) {
          if (isResponse(result.result)) {
            throw result;
          } else if (isDataWithResponseInit(result.result)) {
            throw dataWithResponseInitToResponse(result.result);
          }
        }
        dataResults[match.route.id] = await convertDataStrategyResultToDataResult(result);
      })
    );
    return dataResults;
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
function getStaticContextFromError(routes, handlerContext, error, boundaryId) {
  let errorBoundaryId = boundaryId || handlerContext._deepestRenderedBoundaryId || routes[0].id;
  return {
    ...handlerContext,
    statusCode: isRouteErrorResponse(error) ? error.status : 500,
    errors: {
      [errorBoundaryId]: error
    }
  };
}
function throwStaticHandlerAbortedError(request, isRouteRequest) {
  if (request.signal.reason !== void 0) {
    throw request.signal.reason;
  }
  let method = isRouteRequest ? "queryRoute" : "query";
  throw new Error(
    `${method}() call aborted without an \`AbortSignal.reason\`: ${request.method} ${request.url}`
  );
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== void 0);
}
function normalizeTo(location2, matches, basename, to, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId) {
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  let path = resolveTo(
    to ? to : ".",
    getResolveToMatches(contextualMatches),
    stripBasename(location2.pathname, basename) || location2.pathname,
    relative === "path"
  );
  if (to == null) {
    path.search = location2.search;
    path.hash = location2.hash;
  }
  if ((to == null || to === "" || to === ".") && activeRouteMatch) {
    let nakedIndex = hasNakedIndexQuery(path.search);
    if (activeRouteMatch.route.index && !nakedIndex) {
      path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
    } else if (!activeRouteMatch.route.index && nakedIndex) {
      let params = new URLSearchParams(path.search);
      let indexValues = params.getAll("index");
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if (basename !== "/") {
    path.pathname = prependBasename({ basename, pathname: path.pathname });
  }
  return createPath(path);
}
function normalizeNavigateOptions(isFetcher, path, opts) {
  if (!opts || !isSubmissionNavigation(opts)) {
    return { path };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, { method: opts.formMethod })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, { type: "invalid-body" })
  });
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = rawFormMethod.toUpperCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== void 0) {
    if (opts.formEncType === "text/plain") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(opts.body.entries()).reduce(
          (acc, [name, value]) => `${acc}${name}=${value}
`,
          ""
        )
      ) : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: void 0,
          json: void 0,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: void 0,
            json,
            text: void 0
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant$1(
    typeof FormData === "function",
    "FormData is not available in this environment"
  );
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: void 0,
    text: void 0
  };
  if (isMutationMethod(submission.formMethod)) {
    return { path, submission };
  }
  let parsedPath = parsePath(path);
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = `?${searchParams}`;
  return { path: createPath(parsedPath), submission };
}
function getMatchesToLoad(request, scopedContext, mapRouteProperties2, manifest, history, state, matches, submission, location2, lazyRoutePropertiesToSkip, initialHydration, isRevalidationRequired, cancelledFetcherLoads, fetchersQueuedForDeletion, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, hasPatchRoutesOnNavigation, pendingActionResult, callSiteDefaultShouldRevalidate) {
  let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : void 0;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location2);
  let maxIdx;
  if (initialHydration && state.errors) {
    let boundaryId = Object.keys(state.errors)[0];
    maxIdx = matches.findIndex((m) => m.route.id === boundaryId);
  } else if (pendingActionResult && isErrorResult(pendingActionResult[1])) {
    let boundaryId = pendingActionResult[0];
    maxIdx = matches.findIndex((m) => m.route.id === boundaryId) - 1;
  }
  let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : void 0;
  let shouldSkipRevalidation = actionStatus && actionStatus >= 400;
  let baseShouldRevalidateArgs = {
    currentUrl,
    currentParams: state.matches[0]?.params || {},
    nextUrl,
    nextParams: matches[0].params,
    ...submission,
    actionResult,
    actionStatus
  };
  let pattern = getRoutePattern(matches);
  let dsMatches = matches.map((match, index) => {
    let { route } = match;
    let forceShouldLoad = null;
    if (maxIdx != null && index > maxIdx) {
      forceShouldLoad = false;
    } else if (route.lazy) {
      forceShouldLoad = true;
    } else if (!routeHasLoaderOrMiddleware(route)) {
      forceShouldLoad = false;
    } else if (initialHydration) {
      forceShouldLoad = shouldLoadRouteOnHydration(
        route,
        state.loaderData,
        state.errors
      );
    } else if (isNewLoader(state.loaderData, state.matches[index], match)) {
      forceShouldLoad = true;
    }
    if (forceShouldLoad !== null) {
      return getDataStrategyMatch(
        mapRouteProperties2,
        manifest,
        request,
        pattern,
        match,
        lazyRoutePropertiesToSkip,
        scopedContext,
        forceShouldLoad
      );
    }
    let defaultShouldRevalidate = false;
    if (typeof callSiteDefaultShouldRevalidate === "boolean") {
      defaultShouldRevalidate = callSiteDefaultShouldRevalidate;
    } else if (shouldSkipRevalidation) {
      defaultShouldRevalidate = false;
    } else if (isRevalidationRequired) {
      defaultShouldRevalidate = true;
    } else if (currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search) {
      defaultShouldRevalidate = true;
    } else if (currentUrl.search !== nextUrl.search) {
      defaultShouldRevalidate = true;
    } else if (isNewRouteInstance(state.matches[index], match)) {
      defaultShouldRevalidate = true;
    }
    let shouldRevalidateArgs = {
      ...baseShouldRevalidateArgs,
      defaultShouldRevalidate
    };
    let shouldLoad = shouldRevalidateLoader(match, shouldRevalidateArgs);
    return getDataStrategyMatch(
      mapRouteProperties2,
      manifest,
      request,
      pattern,
      match,
      lazyRoutePropertiesToSkip,
      scopedContext,
      shouldLoad,
      shouldRevalidateArgs,
      callSiteDefaultShouldRevalidate
    );
  });
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f, key) => {
    if (initialHydration || !matches.some((m) => m.route.id === f.routeId) || fetchersQueuedForDeletion.has(key)) {
      return;
    }
    let fetcher = state.fetchers.get(key);
    let isMidInitialLoad = fetcher && fetcher.state !== "idle" && fetcher.data === void 0;
    let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
    if (!fetcherMatches) {
      if (hasPatchRoutesOnNavigation && isMidInitialLoad) {
        return;
      }
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: null,
        match: null,
        request: null,
        controller: null
      });
      return;
    }
    if (fetchRedirectIds.has(key)) {
      return;
    }
    let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
    let fetchController = new AbortController();
    let fetchRequest = createClientSideRequest(
      history,
      f.path,
      fetchController.signal
    );
    let fetcherDsMatches = null;
    if (cancelledFetcherLoads.has(key)) {
      cancelledFetcherLoads.delete(key);
      fetcherDsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties2,
        manifest,
        fetchRequest,
        fetcherMatches,
        fetcherMatch,
        lazyRoutePropertiesToSkip,
        scopedContext
      );
    } else if (isMidInitialLoad) {
      if (isRevalidationRequired) {
        fetcherDsMatches = getTargetedDataStrategyMatches(
          mapRouteProperties2,
          manifest,
          fetchRequest,
          fetcherMatches,
          fetcherMatch,
          lazyRoutePropertiesToSkip,
          scopedContext
        );
      }
    } else {
      let defaultShouldRevalidate;
      if (typeof callSiteDefaultShouldRevalidate === "boolean") {
        defaultShouldRevalidate = callSiteDefaultShouldRevalidate;
      } else if (shouldSkipRevalidation) {
        defaultShouldRevalidate = false;
      } else {
        defaultShouldRevalidate = isRevalidationRequired;
      }
      let shouldRevalidateArgs = {
        ...baseShouldRevalidateArgs,
        defaultShouldRevalidate
      };
      if (shouldRevalidateLoader(fetcherMatch, shouldRevalidateArgs)) {
        fetcherDsMatches = getTargetedDataStrategyMatches(
          mapRouteProperties2,
          manifest,
          fetchRequest,
          fetcherMatches,
          fetcherMatch,
          lazyRoutePropertiesToSkip,
          scopedContext,
          shouldRevalidateArgs
        );
      }
    }
    if (fetcherDsMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: fetcherDsMatches,
        match: fetcherMatch,
        request: fetchRequest,
        controller: fetchController
      });
    }
  });
  return { dsMatches, revalidatingFetchers };
}
function routeHasLoaderOrMiddleware(route) {
  return route.loader != null || route.middleware != null && route.middleware.length > 0;
}
function shouldLoadRouteOnHydration(route, loaderData, errors) {
  if (route.lazy) {
    return true;
  }
  if (!routeHasLoaderOrMiddleware(route)) {
    return false;
  }
  let hasData = loaderData != null && route.id in loaderData;
  let hasError = errors != null && errors[route.id] !== void 0;
  if (!hasData && hasError) {
    return false;
  }
  if (typeof route.loader === "function" && route.loader.hydrate === true) {
    return true;
  }
  return !hasData && !hasError;
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew = (
    // [a] -> [a, b]
    !currentMatch || // [a, b] -> [a, c]
    match.route.id !== currentMatch.route.id
  );
  let isMissingData = !currentLoaderData.hasOwnProperty(match.route.id);
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
function patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties2, allowElementMutations) {
  let childrenToPatch;
  if (routeId) {
    let route = manifest[routeId];
    invariant$1(
      route,
      `No route found to patch children into: routeId = ${routeId}`
    );
    if (!route.children) {
      route.children = [];
    }
    childrenToPatch = route.children;
  } else {
    childrenToPatch = routesToUse;
  }
  let uniqueChildren = [];
  let existingChildren = [];
  children.forEach((newRoute) => {
    let existingRoute = childrenToPatch.find(
      (existingRoute2) => isSameRoute(newRoute, existingRoute2)
    );
    if (existingRoute) {
      existingChildren.push({ existingRoute, newRoute });
    } else {
      uniqueChildren.push(newRoute);
    }
  });
  if (uniqueChildren.length > 0) {
    let newRoutes = convertRoutesToDataRoutes(
      uniqueChildren,
      mapRouteProperties2,
      [routeId || "_", "patch", String(childrenToPatch?.length || "0")],
      manifest
    );
    childrenToPatch.push(...newRoutes);
  }
  if (allowElementMutations && existingChildren.length > 0) {
    for (let i = 0; i < existingChildren.length; i++) {
      let { existingRoute, newRoute } = existingChildren[i];
      let existingRouteTyped = existingRoute;
      let [newRouteTyped] = convertRoutesToDataRoutes(
        [newRoute],
        mapRouteProperties2,
        [],
        // Doesn't matter for mutated routes since they already have an id
        {},
        // Don't touch the manifest here since we're updating in place
        true
      );
      Object.assign(existingRouteTyped, {
        element: newRouteTyped.element ? newRouteTyped.element : existingRouteTyped.element,
        errorElement: newRouteTyped.errorElement ? newRouteTyped.errorElement : existingRouteTyped.errorElement,
        hydrateFallbackElement: newRouteTyped.hydrateFallbackElement ? newRouteTyped.hydrateFallbackElement : existingRouteTyped.hydrateFallbackElement
      });
    }
  }
}
function isSameRoute(newRoute, existingRoute) {
  if ("id" in newRoute && "id" in existingRoute && newRoute.id === existingRoute.id) {
    return true;
  }
  if (!(newRoute.index === existingRoute.index && newRoute.path === existingRoute.path && newRoute.caseSensitive === existingRoute.caseSensitive)) {
    return false;
  }
  if ((!newRoute.children || newRoute.children.length === 0) && (!existingRoute.children || existingRoute.children.length === 0)) {
    return true;
  }
  return newRoute.children.every(
    (aChild, i) => existingRoute.children?.some((bChild) => isSameRoute(aChild, bChild))
  );
}
var lazyRoutePropertyCache = /* @__PURE__ */ new WeakMap();
var loadLazyRouteProperty = ({
  key,
  route,
  manifest,
  mapRouteProperties: mapRouteProperties2
}) => {
  let routeToUpdate = manifest[route.id];
  invariant$1(routeToUpdate, "No route found in manifest");
  if (!routeToUpdate.lazy || typeof routeToUpdate.lazy !== "object") {
    return;
  }
  let lazyFn = routeToUpdate.lazy[key];
  if (!lazyFn) {
    return;
  }
  let cache = lazyRoutePropertyCache.get(routeToUpdate);
  if (!cache) {
    cache = {};
    lazyRoutePropertyCache.set(routeToUpdate, cache);
  }
  let cachedPromise = cache[key];
  if (cachedPromise) {
    return cachedPromise;
  }
  let propertyPromise = (async () => {
    let isUnsupported = isUnsupportedLazyRouteObjectKey(key);
    let staticRouteValue = routeToUpdate[key];
    let isStaticallyDefined = staticRouteValue !== void 0 && key !== "hasErrorBoundary";
    if (isUnsupported) {
      warning(
        !isUnsupported,
        "Route property " + key + " is not a supported lazy route property. This property will be ignored."
      );
      cache[key] = Promise.resolve();
    } else if (isStaticallyDefined) {
      warning(
        false,
        `Route "${routeToUpdate.id}" has a static property "${key}" defined. The lazy property will be ignored.`
      );
    } else {
      let value = await lazyFn();
      if (value != null) {
        Object.assign(routeToUpdate, { [key]: value });
        Object.assign(routeToUpdate, mapRouteProperties2(routeToUpdate));
      }
    }
    if (typeof routeToUpdate.lazy === "object") {
      routeToUpdate.lazy[key] = void 0;
      if (Object.values(routeToUpdate.lazy).every((value) => value === void 0)) {
        routeToUpdate.lazy = void 0;
      }
    }
  })();
  cache[key] = propertyPromise;
  return propertyPromise;
};
var lazyRouteFunctionCache = /* @__PURE__ */ new WeakMap();
function loadLazyRoute(route, type, manifest, mapRouteProperties2, lazyRoutePropertiesToSkip) {
  let routeToUpdate = manifest[route.id];
  invariant$1(routeToUpdate, "No route found in manifest");
  if (!route.lazy) {
    return {
      lazyRoutePromise: void 0,
      lazyHandlerPromise: void 0
    };
  }
  if (typeof route.lazy === "function") {
    let cachedPromise = lazyRouteFunctionCache.get(routeToUpdate);
    if (cachedPromise) {
      return {
        lazyRoutePromise: cachedPromise,
        lazyHandlerPromise: cachedPromise
      };
    }
    let lazyRoutePromise2 = (async () => {
      invariant$1(
        typeof route.lazy === "function",
        "No lazy route function found"
      );
      let lazyRoute = await route.lazy();
      let routeUpdates = {};
      for (let lazyRouteProperty in lazyRoute) {
        let lazyValue = lazyRoute[lazyRouteProperty];
        if (lazyValue === void 0) {
          continue;
        }
        let isUnsupported = isUnsupportedLazyRouteFunctionKey(lazyRouteProperty);
        let staticRouteValue = routeToUpdate[lazyRouteProperty];
        let isStaticallyDefined = staticRouteValue !== void 0 && // This property isn't static since it should always be updated based
        // on the route updates
        lazyRouteProperty !== "hasErrorBoundary";
        if (isUnsupported) {
          warning(
            !isUnsupported,
            "Route property " + lazyRouteProperty + " is not a supported property to be returned from a lazy route function. This property will be ignored."
          );
        } else if (isStaticallyDefined) {
          warning(
            !isStaticallyDefined,
            `Route "${routeToUpdate.id}" has a static property "${lazyRouteProperty}" defined but its lazy function is also returning a value for this property. The lazy route property "${lazyRouteProperty}" will be ignored.`
          );
        } else {
          routeUpdates[lazyRouteProperty] = lazyValue;
        }
      }
      Object.assign(routeToUpdate, routeUpdates);
      Object.assign(routeToUpdate, {
        // To keep things framework agnostic, we use the provided `mapRouteProperties`
        // function to set the framework-aware properties (`element`/`hasErrorBoundary`)
        // since the logic will differ between frameworks.
        ...mapRouteProperties2(routeToUpdate),
        lazy: void 0
      });
    })();
    lazyRouteFunctionCache.set(routeToUpdate, lazyRoutePromise2);
    lazyRoutePromise2.catch(() => {
    });
    return {
      lazyRoutePromise: lazyRoutePromise2,
      lazyHandlerPromise: lazyRoutePromise2
    };
  }
  let lazyKeys = Object.keys(route.lazy);
  let lazyPropertyPromises = [];
  let lazyHandlerPromise = void 0;
  for (let key of lazyKeys) {
    if (lazyRoutePropertiesToSkip && lazyRoutePropertiesToSkip.includes(key)) {
      continue;
    }
    let promise = loadLazyRouteProperty({
      key,
      route,
      manifest,
      mapRouteProperties: mapRouteProperties2
    });
    if (promise) {
      lazyPropertyPromises.push(promise);
      if (key === type) {
        lazyHandlerPromise = promise;
      }
    }
  }
  let lazyRoutePromise = lazyPropertyPromises.length > 0 ? Promise.all(lazyPropertyPromises).then(() => {
  }) : void 0;
  lazyRoutePromise?.catch(() => {
  });
  lazyHandlerPromise?.catch(() => {
  });
  return {
    lazyRoutePromise,
    lazyHandlerPromise
  };
}
function isNonNullable(value) {
  return value !== void 0;
}
function loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties2) {
  let promises = matches.map(({ route }) => {
    if (typeof route.lazy !== "object" || !route.lazy.middleware) {
      return void 0;
    }
    return loadLazyRouteProperty({
      key: "middleware",
      route,
      manifest,
      mapRouteProperties: mapRouteProperties2
    });
  }).filter(isNonNullable);
  return promises.length > 0 ? Promise.all(promises) : void 0;
}
async function defaultDataStrategy(args) {
  let matchesToLoad = args.matches.filter((m) => m.shouldLoad);
  let keyedResults = {};
  let results = await Promise.all(matchesToLoad.map((m) => m.resolve()));
  results.forEach((result, i) => {
    keyedResults[matchesToLoad[i].route.id] = result;
  });
  return keyedResults;
}
async function defaultDataStrategyWithMiddleware(args) {
  if (!args.matches.some((m) => m.route.middleware)) {
    return defaultDataStrategy(args);
  }
  return runClientMiddlewarePipeline(args, () => defaultDataStrategy(args));
}
function runServerMiddlewarePipeline(args, handler, errorHandler) {
  return runMiddlewarePipeline(
    args,
    handler,
    processResult,
    isResponse,
    errorHandler
  );
  function processResult(result) {
    return isDataWithResponseInit(result) ? dataWithResponseInitToResponse(result) : result;
  }
}
function runClientMiddlewarePipeline(args, handler) {
  return runMiddlewarePipeline(
    args,
    handler,
    (r) => {
      if (isRedirectResponse(r)) {
        throw r;
      }
      return r;
    },
    isDataStrategyResults,
    errorHandler
  );
  function errorHandler(error, routeId, nextResult) {
    if (nextResult) {
      return Promise.resolve(
        Object.assign(nextResult.value, {
          [routeId]: { type: "error", result: error }
        })
      );
    } else {
      let { matches } = args;
      let maxBoundaryIdx = Math.min(
        // Throwing route
        Math.max(
          matches.findIndex((m) => m.route.id === routeId),
          0
        ),
        // or the shallowest route that needs to load data
        Math.max(
          matches.findIndex((m) => m.shouldCallHandler()),
          0
        )
      );
      let boundaryRouteId = findNearestBoundary(
        matches,
        matches[maxBoundaryIdx].route.id
      ).route.id;
      return Promise.resolve({
        [boundaryRouteId]: { type: "error", result: error }
      });
    }
  }
}
async function runMiddlewarePipeline(args, handler, processResult, isResult, errorHandler) {
  let { matches, request, params, context, unstable_pattern } = args;
  let tuples = matches.flatMap(
    (m) => m.route.middleware ? m.route.middleware.map((fn) => [m.route.id, fn]) : []
  );
  let result = await callRouteMiddleware(
    {
      request,
      params,
      context,
      unstable_pattern
    },
    tuples,
    handler,
    processResult,
    isResult,
    errorHandler
  );
  return result;
}
async function callRouteMiddleware(args, middlewares, handler, processResult, isResult, errorHandler, idx = 0) {
  let { request } = args;
  if (request.signal.aborted) {
    throw request.signal.reason ?? new Error(`Request aborted: ${request.method} ${request.url}`);
  }
  let tuple = middlewares[idx];
  if (!tuple) {
    let result = await handler();
    return result;
  }
  let [routeId, middleware] = tuple;
  let nextResult;
  let next = async () => {
    if (nextResult) {
      throw new Error("You may only call `next()` once per middleware");
    }
    try {
      let result = await callRouteMiddleware(
        args,
        middlewares,
        handler,
        processResult,
        isResult,
        errorHandler,
        idx + 1
      );
      nextResult = { value: result };
      return nextResult.value;
    } catch (error) {
      nextResult = { value: await errorHandler(error, routeId, nextResult) };
      return nextResult.value;
    }
  };
  try {
    let value = await middleware(args, next);
    let result = value != null ? processResult(value) : void 0;
    if (isResult(result)) {
      return result;
    } else if (nextResult) {
      return result ?? nextResult.value;
    } else {
      nextResult = { value: await next() };
      return nextResult.value;
    }
  } catch (error) {
    let response = await errorHandler(error, routeId, nextResult);
    return response;
  }
}
function getDataStrategyMatchLazyPromises(mapRouteProperties2, manifest, request, match, lazyRoutePropertiesToSkip) {
  let lazyMiddlewarePromise = loadLazyRouteProperty({
    key: "middleware",
    route: match.route,
    manifest,
    mapRouteProperties: mapRouteProperties2
  });
  let lazyRoutePromises = loadLazyRoute(
    match.route,
    isMutationMethod(request.method) ? "action" : "loader",
    manifest,
    mapRouteProperties2,
    lazyRoutePropertiesToSkip
  );
  return {
    middleware: lazyMiddlewarePromise,
    route: lazyRoutePromises.lazyRoutePromise,
    handler: lazyRoutePromises.lazyHandlerPromise
  };
}
function getDataStrategyMatch(mapRouteProperties2, manifest, request, unstable_pattern, match, lazyRoutePropertiesToSkip, scopedContext, shouldLoad, shouldRevalidateArgs = null, callSiteDefaultShouldRevalidate) {
  let isUsingNewApi = false;
  let _lazyPromises = getDataStrategyMatchLazyPromises(
    mapRouteProperties2,
    manifest,
    request,
    match,
    lazyRoutePropertiesToSkip
  );
  return {
    ...match,
    _lazyPromises,
    shouldLoad,
    shouldRevalidateArgs,
    shouldCallHandler(defaultShouldRevalidate) {
      isUsingNewApi = true;
      if (!shouldRevalidateArgs) {
        return shouldLoad;
      }
      if (typeof callSiteDefaultShouldRevalidate === "boolean") {
        return shouldRevalidateLoader(match, {
          ...shouldRevalidateArgs,
          defaultShouldRevalidate: callSiteDefaultShouldRevalidate
        });
      }
      if (typeof defaultShouldRevalidate === "boolean") {
        return shouldRevalidateLoader(match, {
          ...shouldRevalidateArgs,
          defaultShouldRevalidate
        });
      }
      return shouldRevalidateLoader(match, shouldRevalidateArgs);
    },
    resolve(handlerOverride) {
      let { lazy, loader, middleware } = match.route;
      let callHandler = isUsingNewApi || shouldLoad || handlerOverride && !isMutationMethod(request.method) && (lazy || loader);
      let isMiddlewareOnlyRoute = middleware && middleware.length > 0 && !loader && !lazy;
      if (callHandler && (isMutationMethod(request.method) || !isMiddlewareOnlyRoute)) {
        return callLoaderOrAction({
          request,
          unstable_pattern,
          match,
          lazyHandlerPromise: _lazyPromises?.handler,
          lazyRoutePromise: _lazyPromises?.route,
          handlerOverride,
          scopedContext
        });
      }
      return Promise.resolve({ type: "data", result: void 0 });
    }
  };
}
function getTargetedDataStrategyMatches(mapRouteProperties2, manifest, request, matches, targetMatch, lazyRoutePropertiesToSkip, scopedContext, shouldRevalidateArgs = null) {
  return matches.map((match) => {
    if (match.route.id !== targetMatch.route.id) {
      return {
        ...match,
        shouldLoad: false,
        shouldRevalidateArgs,
        shouldCallHandler: () => false,
        _lazyPromises: getDataStrategyMatchLazyPromises(
          mapRouteProperties2,
          manifest,
          request,
          match,
          lazyRoutePropertiesToSkip
        ),
        resolve: () => Promise.resolve({ type: "data", result: void 0 })
      };
    }
    return getDataStrategyMatch(
      mapRouteProperties2,
      manifest,
      request,
      getRoutePattern(matches),
      match,
      lazyRoutePropertiesToSkip,
      scopedContext,
      true,
      shouldRevalidateArgs
    );
  });
}
async function callDataStrategyImpl(dataStrategyImpl, request, matches, fetcherKey, scopedContext, isStaticHandler) {
  if (matches.some((m) => m._lazyPromises?.middleware)) {
    await Promise.all(matches.map((m) => m._lazyPromises?.middleware));
  }
  let dataStrategyArgs = {
    request,
    unstable_pattern: getRoutePattern(matches),
    params: matches[0].params,
    context: scopedContext,
    matches
  };
  let runClientMiddleware = isStaticHandler ? () => {
    throw new Error(
      "You cannot call `runClientMiddleware()` from a static handler `dataStrategy`. Middleware is run outside of `dataStrategy` during SSR in order to bubble up the Response.  You can enable middleware via the `respond` API in `query`/`queryRoute`"
    );
  } : (cb) => {
    let typedDataStrategyArgs = dataStrategyArgs;
    return runClientMiddlewarePipeline(typedDataStrategyArgs, () => {
      return cb({
        ...typedDataStrategyArgs,
        fetcherKey,
        runClientMiddleware: () => {
          throw new Error(
            "Cannot call `runClientMiddleware()` from within an `runClientMiddleware` handler"
          );
        }
      });
    });
  };
  let results = await dataStrategyImpl({
    ...dataStrategyArgs,
    fetcherKey,
    runClientMiddleware
  });
  try {
    await Promise.all(
      matches.flatMap((m) => [
        m._lazyPromises?.handler,
        m._lazyPromises?.route
      ])
    );
  } catch (e) {
  }
  return results;
}
async function callLoaderOrAction({
  request,
  unstable_pattern,
  match,
  lazyHandlerPromise,
  lazyRoutePromise,
  handlerOverride,
  scopedContext
}) {
  let result;
  let onReject;
  let isAction = isMutationMethod(request.method);
  let type = isAction ? "action" : "loader";
  let runHandler = (handler) => {
    let reject;
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    let actualHandler = (ctx) => {
      if (typeof handler !== "function") {
        return Promise.reject(
          new Error(
            `You cannot call the handler for a route which defines a boolean "${type}" [routeId: ${match.route.id}]`
          )
        );
      }
      return handler(
        {
          request,
          unstable_pattern,
          params: match.params,
          context: scopedContext
        },
        ...ctx !== void 0 ? [ctx] : []
      );
    };
    let handlerPromise = (async () => {
      try {
        let val = await (handlerOverride ? handlerOverride((ctx) => actualHandler(ctx)) : actualHandler());
        return { type: "data", result: val };
      } catch (e) {
        return { type: "error", result: e };
      }
    })();
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = isAction ? match.route.action : match.route.loader;
    if (lazyHandlerPromise || lazyRoutePromise) {
      if (handler) {
        let handlerError;
        let [value] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          runHandler(handler).catch((e) => {
            handlerError = e;
          }),
          // Ensure all lazy route promises are resolved before continuing
          lazyHandlerPromise,
          lazyRoutePromise
        ]);
        if (handlerError !== void 0) {
          throw handlerError;
        }
        result = value;
      } else {
        await lazyHandlerPromise;
        let handler2 = isAction ? match.route.action : match.route.loader;
        if (handler2) {
          [result] = await Promise.all([runHandler(handler2), lazyRoutePromise]);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          return { type: "data", result: void 0 };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
  } catch (e) {
    return { type: "error", result: e };
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  return result;
}
async function parseResponseBody(response) {
  let contentType = response.headers.get("Content-Type");
  if (contentType && /\bapplication\/json\b/.test(contentType)) {
    return response.body == null ? null : response.json();
  }
  return response.text();
}
async function convertDataStrategyResultToDataResult(dataStrategyResult) {
  let { result, type } = dataStrategyResult;
  if (isResponse(result)) {
    let data2;
    try {
      data2 = await parseResponseBody(result);
    } catch (e) {
      return { type: "error", error: e };
    }
    if (type === "error") {
      return {
        type: "error",
        error: new ErrorResponseImpl(result.status, result.statusText, data2),
        statusCode: result.status,
        headers: result.headers
      };
    }
    return {
      type: "data",
      data: data2,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (type === "error") {
    if (isDataWithResponseInit(result)) {
      if (result.data instanceof Error) {
        return {
          type: "error",
          error: result.data,
          statusCode: result.init?.status,
          headers: result.init?.headers ? new Headers(result.init.headers) : void 0
        };
      }
      return {
        type: "error",
        error: dataWithResponseInitToErrorResponse(result),
        statusCode: isRouteErrorResponse(result) ? result.status : void 0,
        headers: result.init?.headers ? new Headers(result.init.headers) : void 0
      };
    }
    return {
      type: "error",
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : void 0
    };
  }
  if (isDataWithResponseInit(result)) {
    return {
      type: "data",
      data: result.data,
      statusCode: result.init?.status,
      headers: result.init?.headers ? new Headers(result.init.headers) : void 0
    };
  }
  return { type: "data", data: result };
}
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename) {
  let location2 = response.headers.get("Location");
  invariant$1(
    location2,
    "Redirects returned/thrown from loaders/actions must have a Location header"
  );
  if (!isAbsoluteUrl(location2)) {
    let trimmedMatches = matches.slice(
      0,
      matches.findIndex((m) => m.route.id === routeId) + 1
    );
    location2 = normalizeTo(
      new URL(request.url),
      trimmedMatches,
      basename,
      location2
    );
    response.headers.set("Location", location2);
  }
  return response;
}
function normalizeRedirectLocation(location2, currentUrl, basename) {
  if (isAbsoluteUrl(location2)) {
    let normalizedLocation = location2;
    let url = normalizedLocation.startsWith("//") ? new URL(currentUrl.protocol + normalizedLocation) : new URL(normalizedLocation);
    let isSameBasename = stripBasename(url.pathname, basename) != null;
    if (url.origin === currentUrl.origin && isSameBasename) {
      return url.pathname + url.search + url.hash;
    }
  }
  return location2;
}
function createClientSideRequest(history, location2, signal, submission) {
  let url = history.createURL(stripHashFromPath(location2)).toString();
  let init2 = { signal };
  if (submission && isMutationMethod(submission.formMethod)) {
    let { formMethod, formEncType } = submission;
    init2.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init2.headers = new Headers({ "Content-Type": formEncType });
      init2.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      init2.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      init2.body = convertFormDataToSearchParams(submission.formData);
    } else {
      init2.body = submission.formData;
    }
  }
  return new Request(url, init2);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, results, pendingActionResult, isStaticHandler = false, skipLoaderErrorBubbling = false) {
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : void 0;
  matches.forEach((match) => {
    if (!(match.route.id in results)) {
      return;
    }
    let id = match.route.id;
    let result = results[id];
    invariant$1(
      !isRedirectResult(result),
      "Cannot handle redirect results in processLoaderData"
    );
    if (isErrorResult(result)) {
      let error = result.error;
      if (pendingError !== void 0) {
        error = pendingError;
        pendingError = void 0;
      }
      errors = errors || {};
      if (skipLoaderErrorBubbling) {
        errors[id] = error;
      } else {
        let boundaryMatch = findNearestBoundary(matches, id);
        if (errors[boundaryMatch.route.id] == null) {
          errors[boundaryMatch.route.id] = error;
        }
      }
      if (!isStaticHandler) {
        loaderData[id] = ResetLoaderDataSymbol;
      }
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      loaderData[id] = result.data;
      if (result.statusCode && result.statusCode !== 200 && !foundError) {
        statusCode = result.statusCode;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    }
  });
  if (pendingError !== void 0 && pendingActionResult) {
    errors = { [pendingActionResult[0]]: pendingError };
    if (pendingActionResult[2]) {
      loaderData[pendingActionResult[2]] = void 0;
    }
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, results, pendingActionResult, revalidatingFetchers, fetcherResults) {
  let { loaderData, errors } = processRouteLoaderData(
    matches,
    results,
    pendingActionResult
  );
  revalidatingFetchers.filter((f) => !f.matches || f.matches.some((m) => m.shouldLoad)).forEach((rf) => {
    let { key, match, controller } = rf;
    if (controller && controller.signal.aborted) {
      return;
    }
    let result = fetcherResults[key];
    invariant$1(result, "Did not find corresponding fetcher result");
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match?.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = {
          ...errors,
          [boundaryMatch.route.id]: result.error
        };
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      invariant$1(false, "Unhandled fetcher revalidation redirect");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  });
  return { loaderData, errors };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = Object.entries(newLoaderData).filter(([, v]) => v !== ResetLoaderDataSymbol).reduce((merged, [k, v]) => {
    merged[k] = v;
    return merged;
  }, {});
  for (let match of matches) {
    let id = match.route.id;
    if (!newLoaderData.hasOwnProperty(id) && loaderData.hasOwnProperty(id) && match.route.loader) {
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors && errors.hasOwnProperty(id)) {
      break;
    }
  }
  return mergedLoaderData;
}
function getActionDataForCommit(pendingActionResult) {
  if (!pendingActionResult) {
    return {};
  }
  return isErrorResult(pendingActionResult[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [pendingActionResult[0]]: pendingActionResult[1].data
    }
  };
}
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find((m) => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
  let route = routes.length === 1 ? routes[0] : routes.find((r) => r.index || !r.path || r.path === "/") || {
    id: `__shim-error-route__`
  };
  return {
    matches: [
      {
        params: {},
        pathname: "",
        pathnameBase: "",
        route
      }
    ],
    route
  };
}
function getInternalRouterError(status, {
  pathname,
  routeId,
  method,
  type,
  message
} = {}) {
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = `You made a ${method} request to "${pathname}" but did not provide a \`loader\` for route "${routeId}", so there is no way to handle the request.`;
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = `Route "${routeId}" does not match URL "${pathname}"`;
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = `No route matches URL "${pathname}"`;
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = `You made a ${method.toUpperCase()} request to "${pathname}" but did not provide an \`action\` for route "${routeId}", so there is no way to handle the request.`;
    } else if (method) {
      errorMessage = `Invalid request method "${method.toUpperCase()}"`;
    }
  }
  return new ErrorResponseImpl(
    status || 500,
    statusText,
    new Error(errorMessage),
    true
  );
}
function findRedirect(results) {
  let entries = Object.entries(results);
  for (let i = entries.length - 1; i >= 0; i--) {
    let [key, result] = entries[i];
    if (isRedirectResult(result)) {
      return { key, result };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath({ ...parsedPath, hash: "" });
}
function isHashChangeOnly(a, b) {
  if (a.pathname !== b.pathname || a.search !== b.search) {
    return false;
  }
  if (a.hash === "") {
    return b.hash !== "";
  } else if (a.hash === b.hash) {
    return true;
  } else if (b.hash !== "") {
    return true;
  }
  return false;
}
function dataWithResponseInitToResponse(data2) {
  return Response.json(data2.data, data2.init ?? void 0);
}
function dataWithResponseInitToErrorResponse(data2) {
  return new ErrorResponseImpl(
    data2.init?.status ?? 500,
    data2.init?.statusText ?? "Internal Server Error",
    data2.data
  );
}
function isDataStrategyResults(result) {
  return result != null && typeof result === "object" && Object.entries(result).every(
    ([key, value]) => typeof key === "string" && isDataStrategyResult(value)
  );
}
function isDataStrategyResult(result) {
  return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === "data" || result.type === "error");
}
function isRedirectDataStrategyResult(result) {
  return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isErrorResult(result) {
  return result.type === "error";
}
function isRedirectResult(result) {
  return (result && result.type) === "redirect";
}
function isDataWithResponseInit(value) {
  return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectStatusCode(statusCode) {
  return redirectStatusCodes.has(statusCode);
}
function isRedirectResponse(result) {
  return isResponse(result) && isRedirectStatusCode(result.status) && result.headers.has("Location");
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toUpperCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toUpperCase());
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some((v) => v === "");
}
function getTargetMatch(matches, location2) {
  let search = typeof location2 === "string" ? parsePath(location2).search : location2.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    return matches[matches.length - 1];
  }
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let { formMethod, formAction, formEncType, text, formData, json } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json: void 0,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: void 0,
      text: void 0
    };
  } else if (json !== void 0) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json,
      text: void 0
    };
  }
}
function getLoadingNavigation(location2, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location: location2,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location: location2,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0
    };
    return navigation;
  }
}
function getSubmittingNavigation(location2, submission) {
  let navigation = {
    state: "submitting",
    location: location2,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data2) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data: data2
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0,
      data: data2
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : void 0
  };
  return fetcher;
}
function getDoneFetcher(data2) {
  let fetcher = {
    state: "idle",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: data2
  };
  return fetcher;
}
function restoreAppliedTransitions(_window, transitions) {
  try {
    let sessionPositions = _window.sessionStorage.getItem(
      TRANSITIONS_STORAGE_KEY
    );
    if (sessionPositions) {
      let json = JSON.parse(sessionPositions);
      for (let [k, v] of Object.entries(json || {})) {
        if (v && Array.isArray(v)) {
          transitions.set(k, new Set(v || []));
        }
      }
    }
  } catch (e) {
  }
}
function persistAppliedTransitions(_window, transitions) {
  if (transitions.size > 0) {
    let json = {};
    for (let [k, v] of transitions) {
      json[k] = [...v];
    }
    try {
      _window.sessionStorage.setItem(
        TRANSITIONS_STORAGE_KEY,
        JSON.stringify(json)
      );
    } catch (error) {
      warning(
        false,
        `Failed to save applied view transitions in sessionStorage (${error}).`
      );
    }
  }
}
function createDeferred() {
  let resolve;
  let reject;
  let promise = new Promise((res, rej) => {
    resolve = async (val) => {
      res(val);
      try {
        await promise;
      } catch (e) {
      }
    };
    reject = async (error) => {
      rej(error);
      try {
        await promise;
      } catch (e) {
      }
    };
  });
  return {
    promise,
    //@ts-ignore
    resolve,
    //@ts-ignore
    reject
  };
}
var DataRouterContext = React3.createContext(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = React3.createContext(null);
DataRouterStateContext.displayName = "DataRouterState";
var RSCRouterContext = React3.createContext(false);
function useIsRSCRouterContext() {
  return React3.useContext(RSCRouterContext);
}
var ViewTransitionContext = React3.createContext({
  isTransitioning: false
});
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = React3.createContext(
  /* @__PURE__ */ new Map()
);
FetchersContext.displayName = "Fetchers";
var AwaitContext = React3.createContext(null);
AwaitContext.displayName = "Await";
var AwaitContextProvider = (props) => React3.createElement(AwaitContext.Provider, props);
var NavigationContext = React3.createContext(
  null
);
NavigationContext.displayName = "Navigation";
var LocationContext = React3.createContext(
  null
);
LocationContext.displayName = "Location";
var RouteContext = React3.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = React3.createContext(null);
RouteErrorContext.displayName = "RouteError";
var ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
var ERROR_DIGEST_REDIRECT = "REDIRECT";
var ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
function decodeRedirectErrorDigest(digest) {
  if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:{`)) {
    try {
      let parsed = JSON.parse(digest.slice(28));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string" && typeof parsed.location === "string" && typeof parsed.reloadDocument === "boolean" && typeof parsed.replace === "boolean") {
        return parsed;
      }
    } catch {
    }
  }
}
function decodeRouteErrorResponseDigest(digest) {
  if (digest.startsWith(
    `${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:{`
  )) {
    try {
      let parsed = JSON.parse(digest.slice(40));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string") {
        return new ErrorResponseImpl(
          parsed.status,
          parsed.statusText,
          parsed.data
        );
      }
    } catch {
    }
  }
}
function useHref(to, { relative } = {}) {
  invariant$1(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );
  let { basename, navigator: navigator2 } = React3.useContext(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to, { relative });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({ pathname: joinedPathname, search, hash });
}
function useInRouterContext() {
  return React3.useContext(LocationContext) != null;
}
function useLocation() {
  invariant$1(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );
  return React3.useContext(LocationContext).location;
}
function useNavigationType() {
  return React3.useContext(LocationContext).navigationType;
}
function useMatch(pattern) {
  invariant$1(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useMatch() may be used only in the context of a <Router> component.`
  );
  let { pathname } = useLocation();
  return React3.useMemo(
    () => matchPath(pattern, decodePath(pathname)),
    [pathname, pattern]
  );
}
var navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function useIsomorphicLayoutEffect(cb) {
  let isStatic = React3.useContext(NavigationContext).static;
  if (!isStatic) {
    React3.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let { isDataRoute } = React3.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  invariant$1(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );
  let dataRouterContext = React3.useContext(DataRouterContext);
  let { basename, navigator: navigator2 } = React3.useContext(NavigationContext);
  let { matches } = React3.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  let activeRef = React3.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React3.useCallback(
    (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        navigator2.go(to);
        return;
      }
      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname,
        options.relative === "path"
      );
      if (dataRouterContext == null && basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }
      (!!options.replace ? navigator2.replace : navigator2.push)(
        path,
        options.state,
        options
      );
    },
    [
      basename,
      navigator2,
      routePathnamesJson,
      locationPathname,
      dataRouterContext
    ]
  );
  return navigate;
}
var OutletContext = React3.createContext(null);
function useOutletContext() {
  return React3.useContext(OutletContext);
}
function useOutlet(context) {
  let outlet = React3.useContext(RouteContext).outlet;
  return React3.useMemo(
    () => outlet && /* @__PURE__ */ React3.createElement(OutletContext.Provider, { value: context }, outlet),
    [outlet, context]
  );
}
function useParams() {
  let { matches } = React3.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, { relative } = {}) {
  let { matches } = React3.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  return React3.useMemo(
    () => resolveTo(
      to,
      JSON.parse(routePathnamesJson),
      locationPathname,
      relative === "path"
    ),
    [to, routePathnamesJson, locationPathname, relative]
  );
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, onError, future) {
  invariant$1(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );
  let { navigator: navigator2 } = React3.useContext(NavigationContext);
  let { matches: parentMatches } = React3.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(
      parentPathname,
      !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`
    );
  }
  let locationFromContext = useLocation();
  let location2;
  if (locationArg) {
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    invariant$1(
      parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    );
    location2 = parsedLocationArg;
  } else {
    location2 = locationFromContext;
  }
  let pathname = location2.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, { pathname: remainingPathname });
  {
    warning(
      parentRoute || matches != null,
      `No routes matched location "${location2.pathname}${location2.search}${location2.hash}" `
    );
    warning(
      matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${location2.pathname}${location2.search}${location2.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    );
  }
  let renderedMatches = _renderMatches(
    matches && matches.map(
      (match) => Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator2.encodeLocation ? navigator2.encodeLocation(
            match.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathname
        ]),
        pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator2.encodeLocation ? navigator2.encodeLocation(
            match.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathnameBase
        ])
      })
    ),
    parentMatches,
    dataRouterState,
    onError,
    future
  );
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ React3.createElement(
      LocationContext.Provider,
      {
        value: {
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default",
            ...location2
          },
          navigationType: "POP"
          /* Pop */
        }
      },
      renderedMatches
    );
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = { padding: "0.5rem", backgroundColor: lightgrey };
  let codeStyles = { padding: "2px 4px", backgroundColor: lightgrey };
  let devInfo = null;
  {
    console.error(
      "Error handled by React Router default ErrorBoundary:",
      error
    );
    devInfo = /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ React3.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React3.createElement("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React3.createElement("code", { style: codeStyles }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React3.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ React3.createElement("pre", { style: preStyles }, stack) : null, devInfo);
}
var defaultErrorElement = /* @__PURE__ */ React3.createElement(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends React3.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error(
        "React Router caught the following error during render",
        error
      );
    }
  }
  render() {
    let error = this.state.error;
    if (this.context && typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
      const decoded = decodeRouteErrorResponseDigest(error.digest);
      if (decoded) error = decoded;
    }
    let result = error !== void 0 ? /* @__PURE__ */ React3.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ React3.createElement(
      RouteErrorContext.Provider,
      {
        value: error,
        children: this.props.component
      }
    )) : this.props.children;
    if (this.context) {
      return /* @__PURE__ */ React3.createElement(RSCErrorHandler, { error }, result);
    }
    return result;
  }
};
RenderErrorBoundary.contextType = RSCRouterContext;
var errorRedirectHandledMap = /* @__PURE__ */ new WeakMap();
function RSCErrorHandler({
  children,
  error
}) {
  let { basename } = React3.useContext(NavigationContext);
  if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
    let redirect2 = decodeRedirectErrorDigest(error.digest);
    if (redirect2) {
      let existingRedirect = errorRedirectHandledMap.get(error);
      if (existingRedirect) throw existingRedirect;
      let parsed = parseToInfo(redirect2.location, basename);
      if (isBrowser && !errorRedirectHandledMap.get(error)) {
        if (parsed.isExternal || redirect2.reloadDocument) {
          window.location.href = parsed.absoluteURL || parsed.to;
        } else {
          const redirectPromise = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(parsed.to, {
              replace: redirect2.replace
            })
          );
          errorRedirectHandledMap.set(error, redirectPromise);
          throw redirectPromise;
        }
      }
      return /* @__PURE__ */ React3.createElement(
        "meta",
        {
          httpEquiv: "refresh",
          content: `0;url=${parsed.absoluteURL || parsed.to}`
        }
      );
    }
  }
  return children;
}
function RenderedRoute({ routeContext, match, children }) {
  let dataRouterContext = React3.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ React3.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterState = null, onErrorHandler = null, future = null) {
  if (matches == null) {
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState?.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(
      (m) => m.route.id && errors?.[m.route.id] !== void 0
    );
    invariant$1(
      errorIndex >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        errors
      ).join(",")}`
    );
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1)
    );
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let { loaderData, errors: errors2 } = dataRouterState;
        let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  let onError = dataRouterState && onErrorHandler ? (error, errorInfo) => {
    onErrorHandler(error, {
      location: dataRouterState.location,
      params: dataRouterState.matches?.[0]?.params ?? {},
      unstable_pattern: getRoutePattern(dataRouterState.matches),
      errorInfo
    });
  } : void 0;
  return renderedMatches.reduceRight(
    (outlet, match, index) => {
      let error;
      let shouldRenderHydrateFallback = false;
      let errorElement = null;
      let hydrateFallbackElement = null;
      if (dataRouterState) {
        error = errors && match.route.id ? errors[match.route.id] : void 0;
        errorElement = match.route.errorElement || defaultErrorElement;
        if (renderFallback) {
          if (fallbackIndex < 0 && index === 0) {
            warningOnce(
              "route-fallback",
              false,
              "No `HydrateFallback` element provided to render during initial hydration"
            );
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = null;
          } else if (fallbackIndex === index) {
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = match.route.hydrateFallbackElement || null;
          }
        }
      }
      let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
      let getChildren = () => {
        let children;
        if (error) {
          children = errorElement;
        } else if (shouldRenderHydrateFallback) {
          children = hydrateFallbackElement;
        } else if (match.route.Component) {
          children = /* @__PURE__ */ React3.createElement(match.route.Component, null);
        } else if (match.route.element) {
          children = match.route.element;
        } else {
          children = outlet;
        }
        return /* @__PURE__ */ React3.createElement(
          RenderedRoute,
          {
            match,
            routeContext: {
              outlet,
              matches: matches2,
              isDataRoute: dataRouterState != null
            },
            children
          }
        );
      };
      return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React3.createElement(
        RenderErrorBoundary,
        {
          location: dataRouterState.location,
          revalidation: dataRouterState.revalidation,
          component: errorElement,
          error,
          children: getChildren(),
          routeContext: { outlet: null, matches: matches2, isDataRoute: true },
          onError
        }
      ) : getChildren();
    },
    null
  );
}
function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
  let ctx = React3.useContext(DataRouterContext);
  invariant$1(ctx, getDataRouterConsoleError(hookName));
  return ctx;
}
function useDataRouterState(hookName) {
  let state = React3.useContext(DataRouterStateContext);
  invariant$1(state, getDataRouterConsoleError(hookName));
  return state;
}
function useRouteContext(hookName) {
  let route = React3.useContext(RouteContext);
  invariant$1(route, getDataRouterConsoleError(hookName));
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  invariant$1(
    thisRoute.route.id,
    `${hookName} can only be used on routes that contain a unique "id"`
  );
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId(
    "useRouteId"
    /* UseRouteId */
  );
}
function useNavigation() {
  let state = useDataRouterState(
    "useNavigation"
    /* UseNavigation */
  );
  return state.navigation;
}
function useRevalidator() {
  let dataRouterContext = useDataRouterContext(
    "useRevalidator"
    /* UseRevalidator */
  );
  let state = useDataRouterState(
    "useRevalidator"
    /* UseRevalidator */
  );
  let revalidate = React3.useCallback(async () => {
    await dataRouterContext.router.revalidate();
  }, [dataRouterContext.router]);
  return React3.useMemo(
    () => ({ revalidate, state: state.revalidation }),
    [revalidate, state.revalidation]
  );
}
function useMatches() {
  let { matches, loaderData } = useDataRouterState(
    "useMatches"
    /* UseMatches */
  );
  return React3.useMemo(
    () => matches.map((m) => convertRouteMatchToUiMatch(m, loaderData)),
    [matches, loaderData]
  );
}
function useLoaderData() {
  let state = useDataRouterState(
    "useLoaderData"
    /* UseLoaderData */
  );
  let routeId = useCurrentRouteId(
    "useLoaderData"
    /* UseLoaderData */
  );
  return state.loaderData[routeId];
}
function useRouteLoaderData(routeId) {
  let state = useDataRouterState(
    "useRouteLoaderData"
    /* UseRouteLoaderData */
  );
  return state.loaderData[routeId];
}
function useActionData() {
  let state = useDataRouterState(
    "useActionData"
    /* UseActionData */
  );
  let routeId = useCurrentRouteId(
    "useLoaderData"
    /* UseLoaderData */
  );
  return state.actionData ? state.actionData[routeId] : void 0;
}
function useRouteError() {
  let error = React3.useContext(RouteErrorContext);
  let state = useDataRouterState(
    "useRouteError"
    /* UseRouteError */
  );
  let routeId = useCurrentRouteId(
    "useRouteError"
    /* UseRouteError */
  );
  if (error !== void 0) {
    return error;
  }
  return state.errors?.[routeId];
}
function useAsyncValue() {
  let value = React3.useContext(AwaitContext);
  return value?._data;
}
function useAsyncError() {
  let value = React3.useContext(AwaitContext);
  return value?._error;
}
var blockerId = 0;
function useBlocker(shouldBlock) {
  let { router: router2, basename } = useDataRouterContext(
    "useBlocker"
    /* UseBlocker */
  );
  let state = useDataRouterState(
    "useBlocker"
    /* UseBlocker */
  );
  let [blockerKey, setBlockerKey] = React3.useState("");
  let blockerFunction = React3.useCallback(
    (arg) => {
      if (typeof shouldBlock !== "function") {
        return !!shouldBlock;
      }
      if (basename === "/") {
        return shouldBlock(arg);
      }
      let { currentLocation, nextLocation, historyAction } = arg;
      return shouldBlock({
        currentLocation: {
          ...currentLocation,
          pathname: stripBasename(currentLocation.pathname, basename) || currentLocation.pathname
        },
        nextLocation: {
          ...nextLocation,
          pathname: stripBasename(nextLocation.pathname, basename) || nextLocation.pathname
        },
        historyAction
      });
    },
    [basename, shouldBlock]
  );
  React3.useEffect(() => {
    let key = String(++blockerId);
    setBlockerKey(key);
    return () => router2.deleteBlocker(key);
  }, [router2]);
  React3.useEffect(() => {
    if (blockerKey !== "") {
      router2.getBlocker(blockerKey, blockerFunction);
    }
  }, [router2, blockerKey, blockerFunction]);
  return blockerKey && state.blockers.has(blockerKey) ? state.blockers.get(blockerKey) : IDLE_BLOCKER;
}
function useNavigateStable() {
  let { router: router2 } = useDataRouterContext(
    "useNavigate"
    /* UseNavigateStable */
  );
  let id = useCurrentRouteId(
    "useNavigate"
    /* UseNavigateStable */
  );
  let activeRef = React3.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React3.useCallback(
    async (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        await router2.navigate(to);
      } else {
        await router2.navigate(to, { fromRouteId: id, ...options });
      }
    },
    [router2, id]
  );
  return navigate;
}
var alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}
function useRoute(...args) {
  const currentRouteId = useCurrentRouteId(
    "useRoute"
    /* UseRoute */
  );
  const id = args[0] ?? currentRouteId;
  const state = useDataRouterState(
    "useRoute"
    /* UseRoute */
  );
  const route = state.matches.find(({ route: route2 }) => route2.id === id);
  if (route === void 0) return void 0;
  return {
    handle: route.route.handle,
    loaderData: state.loaderData[id],
    actionData: state.actionData?.[id]
  };
}
var alreadyWarned2 = {};
function warnOnce(condition, message) {
  if (!condition && !alreadyWarned2[message]) {
    alreadyWarned2[message] = true;
    console.warn(message);
  }
}
var USE_OPTIMISTIC = "useOptimistic";
var useOptimisticImpl = React3[USE_OPTIMISTIC];
var stableUseOptimisticSetter = () => void 0;
function useOptimisticSafe(val) {
  if (useOptimisticImpl) {
    return useOptimisticImpl(val);
  } else {
    return [val, stableUseOptimisticSetter];
  }
}
function mapRouteProperties(route) {
  let updates = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: route.hasErrorBoundary || route.ErrorBoundary != null || route.errorElement != null
  };
  if (route.Component) {
    {
      if (route.element) {
        warning(
          false,
          "You should not include both `Component` and `element` on your route - `Component` will be used."
        );
      }
    }
    Object.assign(updates, {
      element: React3.createElement(route.Component),
      Component: void 0
    });
  }
  if (route.HydrateFallback) {
    {
      if (route.hydrateFallbackElement) {
        warning(
          false,
          "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - `HydrateFallback` will be used."
        );
      }
    }
    Object.assign(updates, {
      hydrateFallbackElement: React3.createElement(route.HydrateFallback),
      HydrateFallback: void 0
    });
  }
  if (route.ErrorBoundary) {
    {
      if (route.errorElement) {
        warning(
          false,
          "You should not include both `ErrorBoundary` and `errorElement` on your route - `ErrorBoundary` will be used."
        );
      }
    }
    Object.assign(updates, {
      errorElement: React3.createElement(route.ErrorBoundary),
      ErrorBoundary: void 0
    });
  }
  return updates;
}
var hydrationRouteProperties = [
  "HydrateFallback",
  "hydrateFallbackElement"
];
function createMemoryRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    getContext: opts?.getContext,
    future: opts?.future,
    history: createMemoryHistory({
      initialEntries: opts?.initialEntries,
      initialIndex: opts?.initialIndex
    }),
    hydrationData: opts?.hydrationData,
    routes,
    hydrationRouteProperties,
    mapRouteProperties,
    dataStrategy: opts?.dataStrategy,
    patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
    unstable_instrumentations: opts?.unstable_instrumentations
  }).initialize();
}
var Deferred = class {
  constructor() {
    this.status = "pending";
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (value) => {
        if (this.status === "pending") {
          this.status = "resolved";
          resolve(value);
        }
      };
      this.reject = (reason) => {
        if (this.status === "pending") {
          this.status = "rejected";
          reject(reason);
        }
      };
    });
  }
};
function RouterProvider({
  router: router2,
  flushSync: reactDomFlushSyncImpl,
  onError,
  unstable_useTransitions
}) {
  let unstable_rsc = useIsRSCRouterContext();
  unstable_useTransitions = unstable_rsc || unstable_useTransitions;
  let [_state, setStateImpl] = React3.useState(router2.state);
  let [state, setOptimisticState] = useOptimisticSafe(_state);
  let [pendingState, setPendingState] = React3.useState();
  let [vtContext, setVtContext] = React3.useState({
    isTransitioning: false
  });
  let [renderDfd, setRenderDfd] = React3.useState();
  let [transition, setTransition] = React3.useState();
  let [interruption, setInterruption] = React3.useState();
  let fetcherData = React3.useRef(/* @__PURE__ */ new Map());
  let setState = React3.useCallback(
    (newState, { deletedFetchers, newErrors, flushSync, viewTransitionOpts }) => {
      if (newErrors && onError) {
        Object.values(newErrors).forEach(
          (error) => onError(error, {
            location: newState.location,
            params: newState.matches[0]?.params ?? {},
            unstable_pattern: getRoutePattern(newState.matches)
          })
        );
      }
      newState.fetchers.forEach((fetcher, key) => {
        if (fetcher.data !== void 0) {
          fetcherData.current.set(key, fetcher.data);
        }
      });
      deletedFetchers.forEach((key) => fetcherData.current.delete(key));
      warnOnce(
        flushSync === false || reactDomFlushSyncImpl != null,
        'You provided the `flushSync` option to a router update, but you are not using the `<RouterProvider>` from `react-router/dom` so `ReactDOM.flushSync()` is unavailable.  Please update your app to `import { RouterProvider } from "react-router/dom"` and ensure you have `react-dom` installed as a dependency to use the `flushSync` option.'
      );
      let isViewTransitionAvailable = router2.window != null && router2.window.document != null && typeof router2.window.document.startViewTransition === "function";
      warnOnce(
        viewTransitionOpts == null || isViewTransitionAvailable,
        "You provided the `viewTransition` option to a router update, but you do not appear to be running in a DOM environment as `window.startViewTransition` is not available."
      );
      if (!viewTransitionOpts || !isViewTransitionAvailable) {
        if (reactDomFlushSyncImpl && flushSync) {
          reactDomFlushSyncImpl(() => setStateImpl(newState));
        } else if (unstable_useTransitions === false) {
          setStateImpl(newState);
        } else {
          React3.startTransition(() => {
            if (unstable_useTransitions === true) {
              setOptimisticState((s) => getOptimisticRouterState(s, newState));
            }
            setStateImpl(newState);
          });
        }
        return;
      }
      if (reactDomFlushSyncImpl && flushSync) {
        reactDomFlushSyncImpl(() => {
          if (transition) {
            renderDfd?.resolve();
            transition.skipTransition();
          }
          setVtContext({
            isTransitioning: true,
            flushSync: true,
            currentLocation: viewTransitionOpts.currentLocation,
            nextLocation: viewTransitionOpts.nextLocation
          });
        });
        let t = router2.window.document.startViewTransition(() => {
          reactDomFlushSyncImpl(() => setStateImpl(newState));
        });
        t.finished.finally(() => {
          reactDomFlushSyncImpl(() => {
            setRenderDfd(void 0);
            setTransition(void 0);
            setPendingState(void 0);
            setVtContext({ isTransitioning: false });
          });
        });
        reactDomFlushSyncImpl(() => setTransition(t));
        return;
      }
      if (transition) {
        renderDfd?.resolve();
        transition.skipTransition();
        setInterruption({
          state: newState,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      } else {
        setPendingState(newState);
        setVtContext({
          isTransitioning: true,
          flushSync: false,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      }
    },
    [
      router2.window,
      reactDomFlushSyncImpl,
      transition,
      renderDfd,
      unstable_useTransitions,
      setOptimisticState,
      onError
    ]
  );
  React3.useLayoutEffect(() => router2.subscribe(setState), [router2, setState]);
  React3.useEffect(() => {
    if (vtContext.isTransitioning && !vtContext.flushSync) {
      setRenderDfd(new Deferred());
    }
  }, [vtContext]);
  React3.useEffect(() => {
    if (renderDfd && pendingState && router2.window) {
      let newState = pendingState;
      let renderPromise = renderDfd.promise;
      let transition2 = router2.window.document.startViewTransition(async () => {
        if (unstable_useTransitions === false) {
          setStateImpl(newState);
        } else {
          React3.startTransition(() => {
            if (unstable_useTransitions === true) {
              setOptimisticState((s) => getOptimisticRouterState(s, newState));
            }
            setStateImpl(newState);
          });
        }
        await renderPromise;
      });
      transition2.finished.finally(() => {
        setRenderDfd(void 0);
        setTransition(void 0);
        setPendingState(void 0);
        setVtContext({ isTransitioning: false });
      });
      setTransition(transition2);
    }
  }, [
    pendingState,
    renderDfd,
    router2.window,
    unstable_useTransitions,
    setOptimisticState
  ]);
  React3.useEffect(() => {
    if (renderDfd && pendingState && state.location.key === pendingState.location.key) {
      renderDfd.resolve();
    }
  }, [renderDfd, transition, state.location, pendingState]);
  React3.useEffect(() => {
    if (!vtContext.isTransitioning && interruption) {
      setPendingState(interruption.state);
      setVtContext({
        isTransitioning: true,
        flushSync: false,
        currentLocation: interruption.currentLocation,
        nextLocation: interruption.nextLocation
      });
      setInterruption(void 0);
    }
  }, [vtContext.isTransitioning, interruption]);
  let navigator2 = React3.useMemo(() => {
    return {
      createHref: router2.createHref,
      encodeLocation: router2.encodeLocation,
      go: (n) => router2.navigate(n),
      push: (to, state2, opts) => router2.navigate(to, {
        state: state2,
        preventScrollReset: opts?.preventScrollReset
      }),
      replace: (to, state2, opts) => router2.navigate(to, {
        replace: true,
        state: state2,
        preventScrollReset: opts?.preventScrollReset
      })
    };
  }, [router2]);
  let basename = router2.basename || "/";
  let dataRouterContext = React3.useMemo(
    () => ({
      router: router2,
      navigator: navigator2,
      static: false,
      basename,
      onError
    }),
    [router2, navigator2, basename, onError]
  );
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(DataRouterContext.Provider, { value: dataRouterContext }, /* @__PURE__ */ React3.createElement(DataRouterStateContext.Provider, { value: state }, /* @__PURE__ */ React3.createElement(FetchersContext.Provider, { value: fetcherData.current }, /* @__PURE__ */ React3.createElement(ViewTransitionContext.Provider, { value: vtContext }, /* @__PURE__ */ React3.createElement(
    Router,
    {
      basename,
      location: state.location,
      navigationType: state.historyAction,
      navigator: navigator2,
      unstable_useTransitions
    },
    /* @__PURE__ */ React3.createElement(
      MemoizedDataRoutes,
      {
        routes: router2.routes,
        future: router2.future,
        state,
        onError
      }
    )
  ))))), null);
}
function getOptimisticRouterState(currentState, newState) {
  return {
    // Don't surface "current location specific" stuff mid-navigation
    // (historyAction, location, matches, loaderData, errors, initialized,
    // restoreScroll, preventScrollReset, blockers, etc.)
    ...currentState,
    // Only surface "pending/in-flight stuff"
    // (navigation, revalidation, actionData, fetchers, )
    navigation: newState.navigation.state !== "idle" ? newState.navigation : currentState.navigation,
    revalidation: newState.revalidation !== "idle" ? newState.revalidation : currentState.revalidation,
    actionData: newState.navigation.state !== "submitting" ? newState.actionData : currentState.actionData,
    fetchers: newState.fetchers
  };
}
var MemoizedDataRoutes = React3.memo(DataRoutes);
function DataRoutes({
  routes,
  future,
  state,
  onError
}) {
  return useRoutesImpl(routes, void 0, state, onError, future);
}
function MemoryRouter({
  basename,
  children,
  initialEntries,
  initialIndex,
  unstable_useTransitions
}) {
  let historyRef = React3.useRef();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = React3.useState({
    action: history.action,
    location: history.location
  });
  let setState = React3.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        React3.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  React3.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ React3.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
function Navigate({
  to,
  replace: replace2,
  state,
  relative
}) {
  invariant$1(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    `<Navigate> may be used only in the context of a <Router> component.`
  );
  let { static: isStatic } = React3.useContext(NavigationContext);
  warning(
    !isStatic,
    `<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.`
  );
  let { matches } = React3.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(
    to,
    getResolveToMatches(matches),
    locationPathname,
    relative === "path"
  );
  let jsonPath = JSON.stringify(path);
  React3.useEffect(() => {
    navigate(JSON.parse(jsonPath), { replace: replace2, state, relative });
  }, [navigate, jsonPath, relative, replace2, state]);
  return null;
}
function Outlet(props) {
  return useOutlet(props.context);
}
function Route(props) {
  invariant$1(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}
function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = "POP",
  navigator: navigator2,
  static: staticProp = false,
  unstable_useTransitions
}) {
  invariant$1(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`
  );
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = React3.useMemo(
    () => ({
      basename,
      navigator: navigator2,
      static: staticProp,
      unstable_useTransitions,
      future: {}
    }),
    [basename, navigator2, staticProp, unstable_useTransitions]
  );
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = React3.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  warning(
    locationContext != null,
    `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`
  );
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ React3.createElement(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ React3.createElement(LocationContext.Provider, { children, value: locationContext }));
}
function Routes({
  children,
  location: location2
}) {
  return useRoutes(createRoutesFromChildren(children), location2);
}
function Await({
  children,
  errorElement,
  resolve
}) {
  let dataRouterContext = React3.useContext(DataRouterContext);
  let dataRouterStateContext = React3.useContext(DataRouterStateContext);
  let onError = React3.useCallback(
    (error, errorInfo) => {
      if (dataRouterContext && dataRouterContext.onError && dataRouterStateContext) {
        dataRouterContext.onError(error, {
          location: dataRouterStateContext.location,
          params: dataRouterStateContext.matches[0]?.params || {},
          unstable_pattern: getRoutePattern(dataRouterStateContext.matches),
          errorInfo
        });
      }
    },
    [dataRouterContext, dataRouterStateContext]
  );
  return /* @__PURE__ */ React3.createElement(
    AwaitErrorBoundary,
    {
      resolve,
      errorElement,
      onError
    },
    /* @__PURE__ */ React3.createElement(ResolveAwait, null, children)
  );
}
var AwaitErrorBoundary = class extends React3.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error(
        "<Await> caught the following error during render",
        error,
        errorInfo
      );
    }
  }
  render() {
    let { children, errorElement, resolve } = this.props;
    let promise = null;
    let status = 0;
    if (!(resolve instanceof Promise)) {
      status = 1;
      promise = Promise.resolve();
      Object.defineProperty(promise, "_tracked", { get: () => true });
      Object.defineProperty(promise, "_data", { get: () => resolve });
    } else if (this.state.error) {
      status = 2;
      let renderError = this.state.error;
      promise = Promise.reject().catch(() => {
      });
      Object.defineProperty(promise, "_tracked", { get: () => true });
      Object.defineProperty(promise, "_error", { get: () => renderError });
    } else if (resolve._tracked) {
      promise = resolve;
      status = "_error" in promise ? 2 : "_data" in promise ? 1 : 0;
    } else {
      status = 0;
      Object.defineProperty(resolve, "_tracked", { get: () => true });
      promise = resolve.then(
        (data2) => Object.defineProperty(resolve, "_data", { get: () => data2 }),
        (error) => {
          this.props.onError?.(error);
          Object.defineProperty(resolve, "_error", { get: () => error });
        }
      );
    }
    if (status === 2 && !errorElement) {
      throw promise._error;
    }
    if (status === 2) {
      return /* @__PURE__ */ React3.createElement(AwaitContext.Provider, { value: promise, children: errorElement });
    }
    if (status === 1) {
      return /* @__PURE__ */ React3.createElement(AwaitContext.Provider, { value: promise, children });
    }
    throw promise;
  }
};
function ResolveAwait({
  children
}) {
  let data2 = useAsyncValue();
  let toRender = typeof children === "function" ? children(data2) : children;
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, toRender);
}
function createRoutesFromChildren(children, parentPath = []) {
  let routes = [];
  React3.Children.forEach(children, (element, index) => {
    if (!React3.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === React3.Fragment) {
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children, treePath)
      );
      return;
    }
    invariant$1(
      element.type === Route,
      `[${typeof element.type === "string" ? element.type : element.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );
    invariant$1(
      !element.props.index || !element.props.children,
      "An index route cannot have child routes."
    );
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      middleware: element.props.middleware,
      loader: element.props.loader,
      action: element.props.action,
      hydrateFallbackElement: element.props.hydrateFallbackElement,
      HydrateFallback: element.props.HydrateFallback,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.hasErrorBoundary === true || element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(
        element.props.children,
        treePath
      );
    }
    routes.push(route);
  });
  return routes;
}
var createRoutesFromElements = createRoutesFromChildren;
function renderMatches(matches) {
  return _renderMatches(matches);
}
function useRouteComponentProps() {
  return {
    params: useParams(),
    loaderData: useLoaderData(),
    actionData: useActionData(),
    matches: useMatches()
  };
}
function WithComponentProps({
  children
}) {
  const props = useRouteComponentProps();
  return React3.cloneElement(children, props);
}
function withComponentProps(Component4) {
  return function WithComponentProps2() {
    const props = useRouteComponentProps();
    return React3.createElement(Component4, props);
  };
}
function useHydrateFallbackProps() {
  return {
    params: useParams(),
    loaderData: useLoaderData(),
    actionData: useActionData()
  };
}
function WithHydrateFallbackProps({
  children
}) {
  const props = useHydrateFallbackProps();
  return React3.cloneElement(children, props);
}
function withHydrateFallbackProps(HydrateFallback) {
  return function WithHydrateFallbackProps2() {
    const props = useHydrateFallbackProps();
    return React3.createElement(HydrateFallback, props);
  };
}
function useErrorBoundaryProps() {
  return {
    params: useParams(),
    loaderData: useLoaderData(),
    actionData: useActionData(),
    error: useRouteError()
  };
}
function WithErrorBoundaryProps({
  children
}) {
  const props = useErrorBoundaryProps();
  return React3.cloneElement(children, props);
}
function withErrorBoundaryProps(ErrorBoundary) {
  return function WithErrorBoundaryProps2() {
    const props = useErrorBoundaryProps();
    return React3.createElement(ErrorBoundary, props);
  };
}
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return typeof HTMLElement !== "undefined" && object instanceof HTMLElement;
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
function createSearchParams(init2 = "") {
  return new URLSearchParams(
    typeof init2 === "string" || Array.isArray(init2) || init2 instanceof URLSearchParams ? init2 : Object.keys(init2).reduce((memo2, key) => {
      let value = init2[key];
      return memo2.concat(
        Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
      );
    }, [])
  );
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    warning(
      false,
      `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`
    );
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error(
        `Cannot submit a <button> or <input type="submit"> without a <form>`
      );
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let { name, type, value } = target;
      if (type === "image") {
        let prefix = name ? `${name}.` : "";
        formData.append(`${prefix}x`, "0");
        formData.append(`${prefix}y`, "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error(
      `Cannot submit element that is not <form>, <button>, or <input type="submit|image">`
    );
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return { action, method: method.toLowerCase(), encType, formData, body };
}
var HOLE = -1;
var NAN = -2;
var NEGATIVE_INFINITY = -3;
var NEGATIVE_ZERO = -4;
var NULL = -5;
var POSITIVE_INFINITY = -6;
var UNDEFINED = -7;
var TYPE_BIGINT = "B";
var TYPE_DATE = "D";
var TYPE_ERROR = "E";
var TYPE_MAP = "M";
var TYPE_NULL_OBJECT = "N";
var TYPE_PROMISE = "P";
var TYPE_REGEXP = "R";
var TYPE_SET = "S";
var TYPE_SYMBOL = "Y";
var TYPE_URL = "U";
var TYPE_PREVIOUS_RESOLVED = "Z";
var Deferred2 = class {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
};
function createLineSplittingTransform() {
  const decoder = new TextDecoder();
  let leftover = "";
  return new TransformStream({
    transform(chunk, controller) {
      const str = decoder.decode(chunk, { stream: true });
      const parts = (leftover + str).split("\n");
      leftover = parts.pop() || "";
      for (const part of parts) {
        controller.enqueue(part);
      }
    },
    flush(controller) {
      if (leftover) {
        controller.enqueue(leftover);
      }
    }
  });
}
function flatten(input) {
  const { indices } = this;
  const existing = indices.get(input);
  if (existing) return [existing];
  if (input === void 0) return UNDEFINED;
  if (input === null) return NULL;
  if (Number.isNaN(input)) return NAN;
  if (input === Number.POSITIVE_INFINITY) return POSITIVE_INFINITY;
  if (input === Number.NEGATIVE_INFINITY) return NEGATIVE_INFINITY;
  if (input === 0 && 1 / input < 0) return NEGATIVE_ZERO;
  const index = this.index++;
  indices.set(input, index);
  stringify.call(this, input, index);
  return index;
}
function stringify(input, index) {
  const { deferred, plugins, postPlugins } = this;
  const str = this.stringified;
  const stack = [[input, index]];
  while (stack.length > 0) {
    const [input2, index2] = stack.pop();
    const partsForObj = (obj) => Object.keys(obj).map((k) => `"_${flatten.call(this, k)}":${flatten.call(this, obj[k])}`).join(",");
    let error = null;
    switch (typeof input2) {
      case "boolean":
      case "number":
      case "string":
        str[index2] = JSON.stringify(input2);
        break;
      case "bigint":
        str[index2] = `["${TYPE_BIGINT}","${input2}"]`;
        break;
      case "symbol": {
        const keyFor = Symbol.keyFor(input2);
        if (!keyFor) {
          error = new Error(
            "Cannot encode symbol unless created with Symbol.for()"
          );
        } else {
          str[index2] = `["${TYPE_SYMBOL}",${JSON.stringify(keyFor)}]`;
        }
        break;
      }
      case "object": {
        if (!input2) {
          str[index2] = `${NULL}`;
          break;
        }
        const isArray = Array.isArray(input2);
        let pluginHandled = false;
        if (!isArray && plugins) {
          for (const plugin of plugins) {
            const pluginResult = plugin(input2);
            if (Array.isArray(pluginResult)) {
              pluginHandled = true;
              const [pluginIdentifier, ...rest] = pluginResult;
              str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
              if (rest.length > 0) {
                str[index2] += `,${rest.map((v) => flatten.call(this, v)).join(",")}`;
              }
              str[index2] += "]";
              break;
            }
          }
        }
        if (!pluginHandled) {
          let result = isArray ? "[" : "{";
          if (isArray) {
            for (let i = 0; i < input2.length; i++)
              result += (i ? "," : "") + (i in input2 ? flatten.call(this, input2[i]) : HOLE);
            str[index2] = `${result}]`;
          } else if (input2 instanceof Date) {
            const dateTime = input2.getTime();
            str[index2] = `["${TYPE_DATE}",${Number.isNaN(dateTime) ? JSON.stringify("invalid") : dateTime}]`;
          } else if (input2 instanceof URL) {
            str[index2] = `["${TYPE_URL}",${JSON.stringify(input2.href)}]`;
          } else if (input2 instanceof RegExp) {
            str[index2] = `["${TYPE_REGEXP}",${JSON.stringify(
              input2.source
            )},${JSON.stringify(input2.flags)}]`;
          } else if (input2 instanceof Set) {
            if (input2.size > 0) {
              str[index2] = `["${TYPE_SET}",${[...input2].map((val) => flatten.call(this, val)).join(",")}]`;
            } else {
              str[index2] = `["${TYPE_SET}"]`;
            }
          } else if (input2 instanceof Map) {
            if (input2.size > 0) {
              str[index2] = `["${TYPE_MAP}",${[...input2].flatMap(([k, v]) => [
                flatten.call(this, k),
                flatten.call(this, v)
              ]).join(",")}]`;
            } else {
              str[index2] = `["${TYPE_MAP}"]`;
            }
          } else if (input2 instanceof Promise) {
            str[index2] = `["${TYPE_PROMISE}",${index2}]`;
            deferred[index2] = input2;
          } else if (input2 instanceof Error) {
            str[index2] = `["${TYPE_ERROR}",${JSON.stringify(input2.message)}`;
            if (input2.name !== "Error") {
              str[index2] += `,${JSON.stringify(input2.name)}`;
            }
            str[index2] += "]";
          } else if (Object.getPrototypeOf(input2) === null) {
            str[index2] = `["${TYPE_NULL_OBJECT}",{${partsForObj(input2)}}]`;
          } else if (isPlainObject2(input2)) {
            str[index2] = `{${partsForObj(input2)}}`;
          } else {
            error = new Error("Cannot encode object with prototype");
          }
        }
        break;
      }
      default: {
        const isArray = Array.isArray(input2);
        let pluginHandled = false;
        if (!isArray && plugins) {
          for (const plugin of plugins) {
            const pluginResult = plugin(input2);
            if (Array.isArray(pluginResult)) {
              pluginHandled = true;
              const [pluginIdentifier, ...rest] = pluginResult;
              str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
              if (rest.length > 0) {
                str[index2] += `,${rest.map((v) => flatten.call(this, v)).join(",")}`;
              }
              str[index2] += "]";
              break;
            }
          }
        }
        if (!pluginHandled) {
          error = new Error("Cannot encode function or unexpected type");
        }
      }
    }
    if (error) {
      let pluginHandled = false;
      if (postPlugins) {
        for (const plugin of postPlugins) {
          const pluginResult = plugin(input2);
          if (Array.isArray(pluginResult)) {
            pluginHandled = true;
            const [pluginIdentifier, ...rest] = pluginResult;
            str[index2] = `[${JSON.stringify(pluginIdentifier)}`;
            if (rest.length > 0) {
              str[index2] += `,${rest.map((v) => flatten.call(this, v)).join(",")}`;
            }
            str[index2] += "]";
            break;
          }
        }
      }
      if (!pluginHandled) {
        throw error;
      }
    }
  }
}
var objectProtoNames2 = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function isPlainObject2(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames2;
}
var globalObj = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : void 0;
function unflatten(parsed) {
  const { hydrated, values } = this;
  if (typeof parsed === "number") return hydrate.call(this, parsed);
  if (!Array.isArray(parsed) || !parsed.length) throw new SyntaxError();
  const startIndex = values.length;
  for (const value of parsed) {
    values.push(value);
  }
  hydrated.length = values.length;
  return hydrate.call(this, startIndex);
}
function hydrate(index) {
  const { hydrated, values, deferred, plugins } = this;
  let result;
  const stack = [
    [
      index,
      (v) => {
        result = v;
      }
    ]
  ];
  let postRun = [];
  while (stack.length > 0) {
    const [index2, set] = stack.pop();
    switch (index2) {
      case UNDEFINED:
        set(void 0);
        continue;
      case NULL:
        set(null);
        continue;
      case NAN:
        set(NaN);
        continue;
      case POSITIVE_INFINITY:
        set(Infinity);
        continue;
      case NEGATIVE_INFINITY:
        set(-Infinity);
        continue;
      case NEGATIVE_ZERO:
        set(-0);
        continue;
    }
    if (hydrated[index2]) {
      set(hydrated[index2]);
      continue;
    }
    const value = values[index2];
    if (!value || typeof value !== "object") {
      hydrated[index2] = value;
      set(value);
      continue;
    }
    if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const [type, b, c] = value;
        switch (type) {
          case TYPE_DATE:
            set(hydrated[index2] = new Date(b));
            continue;
          case TYPE_URL:
            set(hydrated[index2] = new URL(b));
            continue;
          case TYPE_BIGINT:
            set(hydrated[index2] = BigInt(b));
            continue;
          case TYPE_REGEXP:
            set(hydrated[index2] = new RegExp(b, c));
            continue;
          case TYPE_SYMBOL:
            set(hydrated[index2] = Symbol.for(b));
            continue;
          case TYPE_SET:
            const newSet = /* @__PURE__ */ new Set();
            hydrated[index2] = newSet;
            for (let i = value.length - 1; i > 0; i--)
              stack.push([
                value[i],
                (v) => {
                  newSet.add(v);
                }
              ]);
            set(newSet);
            continue;
          case TYPE_MAP:
            const map = /* @__PURE__ */ new Map();
            hydrated[index2] = map;
            for (let i = value.length - 2; i > 0; i -= 2) {
              const r = [];
              stack.push([
                value[i + 1],
                (v) => {
                  r[1] = v;
                }
              ]);
              stack.push([
                value[i],
                (k) => {
                  r[0] = k;
                }
              ]);
              postRun.push(() => {
                map.set(r[0], r[1]);
              });
            }
            set(map);
            continue;
          case TYPE_NULL_OBJECT:
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index2] = obj;
            for (const key of Object.keys(b).reverse()) {
              const r = [];
              stack.push([
                b[key],
                (v) => {
                  r[1] = v;
                }
              ]);
              stack.push([
                Number(key.slice(1)),
                (k) => {
                  r[0] = k;
                }
              ]);
              postRun.push(() => {
                obj[r[0]] = r[1];
              });
            }
            set(obj);
            continue;
          case TYPE_PROMISE:
            if (hydrated[b]) {
              set(hydrated[index2] = hydrated[b]);
            } else {
              const d = new Deferred2();
              deferred[b] = d;
              set(hydrated[index2] = d.promise);
            }
            continue;
          case TYPE_ERROR:
            const [, message, errorType] = value;
            let error = errorType && globalObj && globalObj[errorType] ? new globalObj[errorType](message) : new Error(message);
            hydrated[index2] = error;
            set(error);
            continue;
          case TYPE_PREVIOUS_RESOLVED:
            set(hydrated[index2] = hydrated[b]);
            continue;
          default:
            if (Array.isArray(plugins)) {
              const r = [];
              const vals = value.slice(1);
              for (let i = 0; i < vals.length; i++) {
                const v = vals[i];
                stack.push([
                  v,
                  (v2) => {
                    r[i] = v2;
                  }
                ]);
              }
              postRun.push(() => {
                for (const plugin of plugins) {
                  const result2 = plugin(value[0], ...r);
                  if (result2) {
                    set(hydrated[index2] = result2.value);
                    return;
                  }
                }
                throw new SyntaxError();
              });
              continue;
            }
            throw new SyntaxError();
        }
      } else {
        const array = [];
        hydrated[index2] = array;
        for (let i = 0; i < value.length; i++) {
          const n = value[i];
          if (n !== HOLE) {
            stack.push([
              n,
              (v) => {
                array[i] = v;
              }
            ]);
          }
        }
        set(array);
        continue;
      }
    } else {
      const object = {};
      hydrated[index2] = object;
      for (const key of Object.keys(value).reverse()) {
        const r = [];
        stack.push([
          value[key],
          (v) => {
            r[1] = v;
          }
        ]);
        stack.push([
          Number(key.slice(1)),
          (k) => {
            r[0] = k;
          }
        ]);
        postRun.push(() => {
          object[r[0]] = r[1];
        });
      }
      set(object);
      continue;
    }
  }
  while (postRun.length > 0) {
    postRun.pop()();
  }
  return result;
}
async function decode(readable, options) {
  const { plugins } = options ?? {};
  const done = new Deferred2();
  const reader = readable.pipeThrough(createLineSplittingTransform()).getReader();
  const decoder = {
    values: [],
    hydrated: [],
    deferred: {},
    plugins
  };
  const decoded = await decodeInitial.call(decoder, reader);
  let donePromise = done.promise;
  if (decoded.done) {
    done.resolve();
  } else {
    donePromise = decodeDeferred.call(decoder, reader).then(done.resolve).catch((reason) => {
      for (const deferred of Object.values(decoder.deferred)) {
        deferred.reject(reason);
      }
      done.reject(reason);
    });
  }
  return {
    done: donePromise.then(() => reader.closed),
    value: decoded.value
  };
}
async function decodeInitial(reader) {
  const read = await reader.read();
  if (!read.value) {
    throw new SyntaxError();
  }
  let line;
  try {
    line = JSON.parse(read.value);
  } catch (reason) {
    throw new SyntaxError();
  }
  return {
    done: read.done,
    value: unflatten.call(this, line)
  };
}
async function decodeDeferred(reader) {
  let read = await reader.read();
  while (!read.done) {
    if (!read.value) continue;
    const line = read.value;
    switch (line[0]) {
      case TYPE_PROMISE: {
        const colonIndex = line.indexOf(":");
        const deferredId = Number(line.slice(1, colonIndex));
        const deferred = this.deferred[deferredId];
        if (!deferred) {
          throw new Error(`Deferred ID ${deferredId} not found in stream`);
        }
        const lineData = line.slice(colonIndex + 1);
        let jsonLine;
        try {
          jsonLine = JSON.parse(lineData);
        } catch (reason) {
          throw new SyntaxError();
        }
        const value = unflatten.call(this, jsonLine);
        deferred.resolve(value);
        break;
      }
      case TYPE_ERROR: {
        const colonIndex = line.indexOf(":");
        const deferredId = Number(line.slice(1, colonIndex));
        const deferred = this.deferred[deferredId];
        if (!deferred) {
          throw new Error(`Deferred ID ${deferredId} not found in stream`);
        }
        const lineData = line.slice(colonIndex + 1);
        let jsonLine;
        try {
          jsonLine = JSON.parse(lineData);
        } catch (reason) {
          throw new SyntaxError();
        }
        const value = unflatten.call(this, jsonLine);
        deferred.reject(value);
        break;
      }
      default:
        throw new SyntaxError();
    }
    read = await reader.read();
  }
}
function encode(input, options) {
  const { plugins, postPlugins, signal } = options ?? {};
  const encoder3 = {
    deferred: {},
    index: 0,
    indices: /* @__PURE__ */ new Map(),
    stringified: [],
    plugins,
    postPlugins,
    signal
  };
  const textEncoder = new TextEncoder();
  let lastSentIndex = 0;
  const readable = new ReadableStream({
    async start(controller) {
      const id = flatten.call(encoder3, input);
      if (Array.isArray(id)) {
        throw new Error("This should never happen");
      }
      if (id < 0) {
        controller.enqueue(textEncoder.encode(`${id}
`));
      } else {
        controller.enqueue(
          textEncoder.encode(`[${encoder3.stringified.join(",")}]
`)
        );
        lastSentIndex = encoder3.stringified.length - 1;
      }
      const seenPromises = /* @__PURE__ */ new WeakSet();
      if (Object.keys(encoder3.deferred).length) {
        let raceDone;
        const racePromise = new Promise((resolve, reject) => {
          raceDone = resolve;
          if (signal) {
            const rejectPromise = () => reject(signal.reason || new Error("Signal was aborted."));
            if (signal.aborted) {
              rejectPromise();
            } else {
              signal.addEventListener("abort", (event) => {
                rejectPromise();
              });
            }
          }
        });
        while (Object.keys(encoder3.deferred).length > 0) {
          for (const [deferredId, deferred] of Object.entries(
            encoder3.deferred
          )) {
            if (seenPromises.has(deferred)) continue;
            seenPromises.add(
              // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
              encoder3.deferred[Number(deferredId)] = Promise.race([
                racePromise,
                deferred
              ]).then(
                (resolved) => {
                  const id2 = flatten.call(encoder3, resolved);
                  if (Array.isArray(id2)) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_PROMISE}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`
                      )
                    );
                    encoder3.index++;
                    lastSentIndex++;
                  } else if (id2 < 0) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_PROMISE}${deferredId}:${id2}
`
                      )
                    );
                  } else {
                    const values = encoder3.stringified.slice(lastSentIndex + 1).join(",");
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_PROMISE}${deferredId}:[${values}]
`
                      )
                    );
                    lastSentIndex = encoder3.stringified.length - 1;
                  }
                },
                (reason) => {
                  if (!reason || typeof reason !== "object" || !(reason instanceof Error)) {
                    reason = new Error("An unknown error occurred");
                  }
                  const id2 = flatten.call(encoder3, reason);
                  if (Array.isArray(id2)) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_ERROR}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`
                      )
                    );
                    encoder3.index++;
                    lastSentIndex++;
                  } else if (id2 < 0) {
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_ERROR}${deferredId}:${id2}
`
                      )
                    );
                  } else {
                    const values = encoder3.stringified.slice(lastSentIndex + 1).join(",");
                    controller.enqueue(
                      textEncoder.encode(
                        `${TYPE_ERROR}${deferredId}:[${values}]
`
                      )
                    );
                    lastSentIndex = encoder3.stringified.length - 1;
                  }
                }
              ).finally(() => {
                delete encoder3.deferred[Number(deferredId)];
              })
            );
          }
          await Promise.race(Object.values(encoder3.deferred));
        }
        raceDone();
      }
      await Promise.all(Object.values(encoder3.deferred));
      controller.close();
    }
  });
  return readable;
}
async function createRequestInit(request) {
  let init2 = { signal: request.signal };
  if (request.method !== "GET") {
    init2.method = request.method;
    let contentType = request.headers.get("Content-Type");
    if (contentType && /\bapplication\/json\b/.test(contentType)) {
      init2.headers = { "Content-Type": contentType };
      init2.body = JSON.stringify(await request.json());
    } else if (contentType && /\btext\/plain\b/.test(contentType)) {
      init2.headers = { "Content-Type": contentType };
      init2.body = await request.text();
    } else if (contentType && /\bapplication\/x-www-form-urlencoded\b/.test(contentType)) {
      init2.body = new URLSearchParams(await request.text());
    } else {
      init2.body = await request.formData();
    }
  }
  return init2;
}
var ESCAPE_LOOKUP = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function escapeHtml(html) {
  return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
var SingleFetchRedirectSymbol = /* @__PURE__ */ Symbol("SingleFetchRedirect");
var SingleFetchNoResultError = class extends Error {
};
var SINGLE_FETCH_REDIRECT_STATUS = 202;
var NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([100, 101, 204, 205]);
function StreamTransfer({
  context,
  identifier,
  reader,
  textDecoder,
  nonce
}) {
  if (!context.renderMeta || !context.renderMeta.didRenderScripts) {
    return null;
  }
  if (!context.renderMeta.streamCache) {
    context.renderMeta.streamCache = {};
  }
  let { streamCache } = context.renderMeta;
  let promise = streamCache[identifier];
  if (!promise) {
    promise = streamCache[identifier] = reader.read().then((result) => {
      streamCache[identifier].result = {
        done: result.done,
        value: textDecoder.decode(result.value, { stream: true })
      };
    }).catch((e) => {
      streamCache[identifier].error = e;
    });
  }
  if (promise.error) {
    throw promise.error;
  }
  if (promise.result === void 0) {
    throw promise;
  }
  let { done, value } = promise.result;
  let scriptTag = value ? /* @__PURE__ */ React3.createElement(
    "script",
    {
      nonce,
      dangerouslySetInnerHTML: {
        __html: `window.__reactRouterContext.streamController.enqueue(${escapeHtml(
          JSON.stringify(value)
        )});`
      }
    }
  ) : null;
  if (done) {
    return /* @__PURE__ */ React3.createElement(React3.Fragment, null, scriptTag, /* @__PURE__ */ React3.createElement(
      "script",
      {
        nonce,
        dangerouslySetInnerHTML: {
          __html: `window.__reactRouterContext.streamController.close();`
        }
      }
    ));
  } else {
    return /* @__PURE__ */ React3.createElement(React3.Fragment, null, scriptTag, /* @__PURE__ */ React3.createElement(React3.Suspense, null, /* @__PURE__ */ React3.createElement(
      StreamTransfer,
      {
        context,
        identifier: identifier + 1,
        reader,
        textDecoder,
        nonce
      }
    )));
  }
}
function getTurboStreamSingleFetchDataStrategy(getRouter, manifest, routeModules, ssr, basename) {
  let dataStrategy = getSingleFetchDataStrategyImpl(
    getRouter,
    (match) => {
      let manifestRoute = manifest.routes[match.route.id];
      invariant2(manifestRoute, "Route not found in manifest");
      let routeModule = routeModules[match.route.id];
      return {
        hasLoader: manifestRoute.hasLoader,
        hasClientLoader: manifestRoute.hasClientLoader,
        hasShouldRevalidate: Boolean(routeModule?.shouldRevalidate)
      };
    },
    fetchAndDecodeViaTurboStream,
    ssr,
    basename
  );
  return async (args) => args.runClientMiddleware(dataStrategy);
}
function getSingleFetchDataStrategyImpl(getRouter, getRouteInfo, fetchAndDecode, ssr, basename, shouldAllowOptOut = () => true) {
  return async (args) => {
    let { request, matches, fetcherKey } = args;
    let router2 = getRouter();
    if (request.method !== "GET") {
      return singleFetchActionStrategy(args, fetchAndDecode, basename);
    }
    let foundRevalidatingServerLoader = matches.some((m) => {
      let { hasLoader, hasClientLoader } = getRouteInfo(m);
      return m.shouldCallHandler() && hasLoader && !hasClientLoader;
    });
    if (!ssr && !foundRevalidatingServerLoader) {
      return nonSsrStrategy(args, getRouteInfo, fetchAndDecode, basename);
    }
    if (fetcherKey) {
      return singleFetchLoaderFetcherStrategy(args, fetchAndDecode, basename);
    }
    return singleFetchLoaderNavigationStrategy(
      args,
      router2,
      getRouteInfo,
      fetchAndDecode,
      ssr,
      basename,
      shouldAllowOptOut
    );
  };
}
async function singleFetchActionStrategy(args, fetchAndDecode, basename) {
  let actionMatch = args.matches.find((m) => m.shouldCallHandler());
  invariant2(actionMatch, "No action match found");
  let actionStatus = void 0;
  let result = await actionMatch.resolve(async (handler) => {
    let result2 = await handler(async () => {
      let { data: data2, status } = await fetchAndDecode(args, basename, [
        actionMatch.route.id
      ]);
      actionStatus = status;
      return unwrapSingleFetchResult(data2, actionMatch.route.id);
    });
    return result2;
  });
  if (isResponse(result.result) || isRouteErrorResponse(result.result) || isDataWithResponseInit(result.result)) {
    return { [actionMatch.route.id]: result };
  }
  return {
    [actionMatch.route.id]: {
      type: result.type,
      result: data(result.result, actionStatus)
    }
  };
}
async function nonSsrStrategy(args, getRouteInfo, fetchAndDecode, basename) {
  let matchesToLoad = args.matches.filter((m) => m.shouldCallHandler());
  let results = {};
  await Promise.all(
    matchesToLoad.map(
      (m) => m.resolve(async (handler) => {
        try {
          let { hasClientLoader } = getRouteInfo(m);
          let routeId = m.route.id;
          let result = hasClientLoader ? await handler(async () => {
            let { data: data2 } = await fetchAndDecode(args, basename, [routeId]);
            return unwrapSingleFetchResult(data2, routeId);
          }) : await handler();
          results[m.route.id] = { type: "data", result };
        } catch (e) {
          results[m.route.id] = { type: "error", result: e };
        }
      })
    )
  );
  return results;
}
async function singleFetchLoaderNavigationStrategy(args, router2, getRouteInfo, fetchAndDecode, ssr, basename, shouldAllowOptOut = () => true) {
  let routesParams = /* @__PURE__ */ new Set();
  let foundOptOutRoute = false;
  let routeDfds = args.matches.map(() => createDeferred2());
  let singleFetchDfd = createDeferred2();
  let results = {};
  let resolvePromise = Promise.all(
    args.matches.map(
      async (m, i) => m.resolve(async (handler) => {
        routeDfds[i].resolve();
        let routeId = m.route.id;
        let { hasLoader, hasClientLoader, hasShouldRevalidate } = getRouteInfo(m);
        let defaultShouldRevalidate = !m.shouldRevalidateArgs || m.shouldRevalidateArgs.actionStatus == null || m.shouldRevalidateArgs.actionStatus < 400;
        let shouldCall = m.shouldCallHandler(defaultShouldRevalidate);
        if (!shouldCall) {
          foundOptOutRoute || (foundOptOutRoute = m.shouldRevalidateArgs != null && // This is a revalidation,
          hasLoader && // for a route with a server loader,
          hasShouldRevalidate === true);
          return;
        }
        if (shouldAllowOptOut(m) && hasClientLoader) {
          if (hasLoader) {
            foundOptOutRoute = true;
          }
          try {
            let result = await handler(async () => {
              let { data: data2 } = await fetchAndDecode(args, basename, [routeId]);
              return unwrapSingleFetchResult(data2, routeId);
            });
            results[routeId] = { type: "data", result };
          } catch (e) {
            results[routeId] = { type: "error", result: e };
          }
          return;
        }
        if (hasLoader) {
          routesParams.add(routeId);
        }
        try {
          let result = await handler(async () => {
            let data2 = await singleFetchDfd.promise;
            return unwrapSingleFetchResult(data2, routeId);
          });
          results[routeId] = { type: "data", result };
        } catch (e) {
          results[routeId] = { type: "error", result: e };
        }
      })
    )
  );
  await Promise.all(routeDfds.map((d) => d.promise));
  let isInitialLoad = !router2.state.initialized && router2.state.navigation.state === "idle";
  if ((isInitialLoad || routesParams.size === 0) && !window.__reactRouterHdrActive) {
    singleFetchDfd.resolve({ routes: {} });
  } else {
    let targetRoutes = ssr && foundOptOutRoute && routesParams.size > 0 ? [...routesParams.keys()] : void 0;
    try {
      let data2 = await fetchAndDecode(args, basename, targetRoutes);
      singleFetchDfd.resolve(data2.data);
    } catch (e) {
      singleFetchDfd.reject(e);
    }
  }
  await resolvePromise;
  await bubbleMiddlewareErrors(
    singleFetchDfd.promise,
    args.matches,
    routesParams,
    results
  );
  return results;
}
async function bubbleMiddlewareErrors(singleFetchPromise, matches, routesParams, results) {
  try {
    let middlewareError;
    let fetchedData = await singleFetchPromise;
    if ("routes" in fetchedData) {
      for (let match of matches) {
        if (match.route.id in fetchedData.routes) {
          let routeResult = fetchedData.routes[match.route.id];
          if ("error" in routeResult) {
            middlewareError = routeResult.error;
            if (results[match.route.id]?.result == null) {
              results[match.route.id] = {
                type: "error",
                result: middlewareError
              };
            }
            break;
          }
        }
      }
    }
    if (middlewareError !== void 0) {
      Array.from(routesParams.values()).forEach((routeId) => {
        if (results[routeId].result instanceof SingleFetchNoResultError) {
          results[routeId].result = middlewareError;
        }
      });
    }
  } catch (e) {
  }
}
async function singleFetchLoaderFetcherStrategy(args, fetchAndDecode, basename) {
  let fetcherMatch = args.matches.find((m) => m.shouldCallHandler());
  invariant2(fetcherMatch, "No fetcher match found");
  let routeId = fetcherMatch.route.id;
  let result = await fetcherMatch.resolve(
    async (handler) => handler(async () => {
      let { data: data2 } = await fetchAndDecode(args, basename, [routeId]);
      return unwrapSingleFetchResult(data2, routeId);
    })
  );
  return { [fetcherMatch.route.id]: result };
}
function stripIndexParam$1(url) {
  let indexValues = url.searchParams.getAll("index");
  url.searchParams.delete("index");
  let indexValuesToKeep = [];
  for (let indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }
  for (let toKeep of indexValuesToKeep) {
    url.searchParams.append("index", toKeep);
  }
  return url;
}
function singleFetchUrl(reqUrl, basename, extension) {
  let url = typeof reqUrl === "string" ? new URL(
    reqUrl,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window === "undefined" ? "server://singlefetch/" : window.location.origin
  ) : reqUrl;
  if (url.pathname === "/") {
    url.pathname = `_root.${extension}`;
  } else if (basename && stripBasename(url.pathname, basename) === "/") {
    url.pathname = `${basename.replace(/\/$/, "")}/_root.${extension}`;
  } else {
    url.pathname = `${url.pathname.replace(/\/$/, "")}.${extension}`;
  }
  return url;
}
async function fetchAndDecodeViaTurboStream(args, basename, targetRoutes) {
  let { request } = args;
  let url = singleFetchUrl(request.url, basename, "data");
  if (request.method === "GET") {
    url = stripIndexParam$1(url);
    if (targetRoutes) {
      url.searchParams.set("_routes", targetRoutes.join(","));
    }
  }
  let res = await fetch(url, await createRequestInit(request));
  if (res.status >= 400 && !res.headers.has("X-Remix-Response")) {
    throw new ErrorResponseImpl(res.status, res.statusText, await res.text());
  }
  if (res.status === 204 && res.headers.has("X-Remix-Redirect")) {
    return {
      status: SINGLE_FETCH_REDIRECT_STATUS,
      data: {
        redirect: {
          redirect: res.headers.get("X-Remix-Redirect"),
          status: Number(res.headers.get("X-Remix-Status") || "302"),
          revalidate: res.headers.get("X-Remix-Revalidate") === "true",
          reload: res.headers.get("X-Remix-Reload-Document") === "true",
          replace: res.headers.get("X-Remix-Replace") === "true"
        }
      }
    };
  }
  if (NO_BODY_STATUS_CODES.has(res.status)) {
    let routes = {};
    if (targetRoutes && request.method !== "GET") {
      routes[targetRoutes[0]] = { data: void 0 };
    }
    return {
      status: res.status,
      data: { routes }
    };
  }
  invariant2(res.body, "No response body to decode");
  try {
    let decoded = await decodeViaTurboStream(res.body, window);
    let data2;
    if (request.method === "GET") {
      let typed = decoded.value;
      if (SingleFetchRedirectSymbol in typed) {
        data2 = { redirect: typed[SingleFetchRedirectSymbol] };
      } else {
        data2 = { routes: typed };
      }
    } else {
      let typed = decoded.value;
      let routeId = targetRoutes?.[0];
      invariant2(routeId, "No routeId found for single fetch call decoding");
      if ("redirect" in typed) {
        data2 = { redirect: typed };
      } else {
        data2 = { routes: { [routeId]: typed } };
      }
    }
    return { status: res.status, data: data2 };
  } catch (e) {
    throw new Error("Unable to decode turbo-stream response");
  }
}
function decodeViaTurboStream(body, global2) {
  return decode(body, {
    plugins: [
      (type, ...rest) => {
        if (type === "SanitizedError") {
          let [name, message, stack] = rest;
          let Constructor = Error;
          if (name && name in global2 && typeof global2[name] === "function") {
            Constructor = global2[name];
          }
          let error = new Constructor(message);
          error.stack = stack;
          return { value: error };
        }
        if (type === "ErrorResponse") {
          let [data2, status, statusText] = rest;
          return {
            value: new ErrorResponseImpl(status, statusText, data2)
          };
        }
        if (type === "SingleFetchRedirect") {
          return { value: { [SingleFetchRedirectSymbol]: rest[0] } };
        }
        if (type === "SingleFetchClassInstance") {
          return { value: rest[0] };
        }
        if (type === "SingleFetchFallback") {
          return { value: void 0 };
        }
      }
    ]
  });
}
function unwrapSingleFetchResult(result, routeId) {
  if ("redirect" in result) {
    let {
      redirect: location2,
      revalidate,
      reload,
      replace: replace2,
      status
    } = result.redirect;
    throw redirect(location2, {
      status,
      headers: {
        // Three R's of redirecting (lol Veep)
        ...revalidate ? { "X-Remix-Revalidate": "yes" } : null,
        ...reload ? { "X-Remix-Reload-Document": "yes" } : null,
        ...replace2 ? { "X-Remix-Replace": "yes" } : null
      }
    });
  }
  let routeResult = result.routes[routeId];
  if (routeResult == null) {
    throw new SingleFetchNoResultError(
      `No result found for routeId "${routeId}"`
    );
  } else if ("error" in routeResult) {
    throw routeResult.error;
  } else if ("data" in routeResult) {
    return routeResult.data;
  } else {
    throw new Error(`Invalid response found for routeId "${routeId}"`);
  }
}
function createDeferred2() {
  let resolve;
  let reject;
  let promise = new Promise((res, rej) => {
    resolve = async (val) => {
      res(val);
      try {
        await promise;
      } catch (e) {
      }
    };
    reject = async (error) => {
      rej(error);
      try {
        await promise;
      } catch (e) {
      }
    };
  });
  return {
    promise,
    //@ts-ignore
    resolve,
    //@ts-ignore
    reject
  };
}
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    console.error(
      `Error loading route module \`${route.module}\`, reloading page...`
    );
    console.error(error);
    if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && // @ts-expect-error
    void 0) ;
    window.location.reload();
    return new Promise(() => {
    });
  }
}
function getKeyedLinksForMatches(matches, routeModules, manifest) {
  let descriptors = matches.map((match) => {
    let module = routeModules[match.route.id];
    let route = manifest.routes[match.route.id];
    return [
      route && route.css ? route.css.map((href2) => ({ rel: "stylesheet", href: href2 })) : [],
      module?.links?.() || []
    ];
  }).flat(2);
  let preloads = getModuleLinkHrefs(matches, manifest);
  return dedupeLinkDescriptors(descriptors, preloads);
}
function getRouteCssDescriptors(route) {
  if (!route.css) return [];
  return route.css.map((href2) => ({ rel: "stylesheet", href: href2 }));
}
async function prefetchRouteCss(route) {
  if (!route.css) return;
  let descriptors = getRouteCssDescriptors(route);
  await Promise.all(descriptors.map(prefetchStyleLink));
}
async function prefetchStyleLinks(route, routeModule) {
  if (!route.css && !routeModule.links || !isPreloadSupported()) return;
  let descriptors = [];
  if (route.css) {
    descriptors.push(...getRouteCssDescriptors(route));
  }
  if (routeModule.links) {
    descriptors.push(...routeModule.links());
  }
  if (descriptors.length === 0) return;
  let styleLinks = [];
  for (let descriptor of descriptors) {
    if (!isPageLinkDescriptor(descriptor) && descriptor.rel === "stylesheet") {
      styleLinks.push({
        ...descriptor,
        rel: "preload",
        as: "style"
      });
    }
  }
  await Promise.all(styleLinks.map(prefetchStyleLink));
}
async function prefetchStyleLink(descriptor) {
  return new Promise((resolve) => {
    if (descriptor.media && !window.matchMedia(descriptor.media).matches || document.querySelector(
      `link[rel="stylesheet"][href="${descriptor.href}"]`
    )) {
      return resolve();
    }
    let link = document.createElement("link");
    Object.assign(link, descriptor);
    function removeLink() {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }
    link.onload = () => {
      removeLink();
      resolve();
    };
    link.onerror = () => {
      removeLink();
      resolve();
    };
    document.head.appendChild(link);
  });
}
function isPageLinkDescriptor(object) {
  return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(
    matches.map(async (match) => {
      let route = manifest.routes[match.route.id];
      if (route) {
        let mod = await loadRouteModule(route, routeModules);
        return mod.links ? mod.links() : [];
      }
      return [];
    })
  );
  return dedupeLinkDescriptors(
    links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map(
      (link) => link.rel === "stylesheet" ? { ...link, rel: "prefetch", as: "style" } : { ...link, rel: "prefetch" }
    )
  );
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location2, mode) {
  let isNew = (match, index) => {
    if (!currentMatches[index]) return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    return (
      // param change, /users/123 -> /users/456
      currentMatches[index].pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"]
    );
  };
  if (mode === "assets") {
    return nextMatches.filter(
      (match, index) => isNew(match, index) || matchPathChanged(match, index)
    );
  }
  if (mode === "data") {
    return nextMatches.filter((match, index) => {
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(
            location2.pathname + location2.search + location2.hash,
            window.origin
          ),
          currentParams: currentMatches[0]?.params || {},
          nextUrl: new URL(page, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    });
  }
  return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
  return dedupeHrefs(
    matches.map((match) => {
      let route = manifest.routes[match.route.id];
      if (!route) return [];
      let hrefs = [route.module];
      if (route.clientActionModule) {
        hrefs = hrefs.concat(route.clientActionModule);
      }
      if (route.clientLoaderModule) {
        hrefs = hrefs.concat(route.clientLoaderModule);
      }
      if (includeHydrateFallback && route.hydrateFallbackModule) {
        hrefs = hrefs.concat(route.hydrateFallbackModule);
      }
      if (route.imports) {
        hrefs = hrefs.concat(route.imports);
      }
      return hrefs;
    }).flat(1)
  );
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  let preloadsSet = new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let alreadyModulePreload = preloads && !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href);
    if (alreadyModulePreload) {
      return deduped;
    }
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }
    return deduped;
  }, []);
}
var _isPreloadSupported;
function isPreloadSupported() {
  if (_isPreloadSupported !== void 0) {
    return _isPreloadSupported;
  }
  let el = document.createElement("link");
  _isPreloadSupported = el.relList.supports("preload");
  el = null;
  return _isPreloadSupported;
}
function RemixRootDefaultHydrateFallback() {
  return /* @__PURE__ */ React3.createElement(BoundaryShell, { title: "Loading...", renderScripts: true }, /* @__PURE__ */ React3.createElement(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: `
              console.log(
                "💿 Hey developer 👋. You can provide a way better UX than this " +
                "when your app is loading JS modules and/or running \`clientLoader\` " +
                "functions. Check out https://reactrouter.com/start/framework/route-module#hydratefallback " +
                "for more information."
              );
            `
      }
    }
  ));
}
function groupRoutesByParentId$1(manifest) {
  let routes = {};
  Object.values(manifest).forEach((route) => {
    if (route) {
      let parentId = route.parentId || "";
      if (!routes[parentId]) {
        routes[parentId] = [];
      }
      routes[parentId].push(route);
    }
  });
  return routes;
}
function getRouteComponents(route, routeModule, isSpaMode) {
  let Component4 = getRouteModuleComponent(routeModule);
  let HydrateFallback = routeModule.HydrateFallback && (!isSpaMode || route.id === "root") ? routeModule.HydrateFallback : route.id === "root" ? RemixRootDefaultHydrateFallback : void 0;
  let ErrorBoundary = routeModule.ErrorBoundary ? routeModule.ErrorBoundary : route.id === "root" ? () => /* @__PURE__ */ React3.createElement(RemixRootDefaultErrorBoundary, { error: useRouteError() }) : void 0;
  if (route.id === "root" && routeModule.Layout) {
    return {
      ...Component4 ? {
        element: /* @__PURE__ */ React3.createElement(routeModule.Layout, null, /* @__PURE__ */ React3.createElement(Component4, null))
      } : { Component: Component4 },
      ...ErrorBoundary ? {
        errorElement: /* @__PURE__ */ React3.createElement(routeModule.Layout, null, /* @__PURE__ */ React3.createElement(ErrorBoundary, null))
      } : { ErrorBoundary },
      ...HydrateFallback ? {
        hydrateFallbackElement: /* @__PURE__ */ React3.createElement(routeModule.Layout, null, /* @__PURE__ */ React3.createElement(HydrateFallback, null))
      } : { HydrateFallback }
    };
  }
  return { Component: Component4, ErrorBoundary, HydrateFallback };
}
function createServerRoutes(manifest, routeModules, future, isSpaMode, parentId = "", routesByParentId = groupRoutesByParentId$1(manifest), spaModeLazyPromise = Promise.resolve({ Component: () => null })) {
  return (routesByParentId[parentId] || []).map((route) => {
    let routeModule = routeModules[route.id];
    invariant2(
      routeModule,
      "No `routeModule` available to create server routes"
    );
    let dataRoute = {
      ...getRouteComponents(route, routeModule, isSpaMode),
      caseSensitive: route.caseSensitive,
      id: route.id,
      index: route.index,
      path: route.path,
      handle: routeModule.handle,
      // For SPA Mode, all routes are lazy except root.  However we tell the
      // router root is also lazy here too since we don't need a full
      // implementation - we just need a `lazy` prop to tell the RR rendering
      // where to stop which is always at the root route in SPA mode
      lazy: isSpaMode ? () => spaModeLazyPromise : void 0,
      // For partial hydration rendering, we need to indicate when the route
      // has a loader/clientLoader, but it won't ever be called during the static
      // render, so just give it a no-op function so we can render down to the
      // proper fallback
      loader: route.hasLoader || route.hasClientLoader ? () => null : void 0
      // We don't need middleware/action/shouldRevalidate on these routes since
      // they're for a static render
    };
    let children = createServerRoutes(
      manifest,
      routeModules,
      future,
      isSpaMode,
      route.id,
      routesByParentId,
      spaModeLazyPromise
    );
    if (children.length > 0) dataRoute.children = children;
    return dataRoute;
  });
}
function createClientRoutesWithHMRRevalidationOptOut(needsRevalidation, manifest, routeModulesCache, initialState, ssr, isSpaMode) {
  return createClientRoutes(
    manifest,
    routeModulesCache,
    initialState,
    ssr,
    isSpaMode,
    "",
    groupRoutesByParentId$1(manifest),
    needsRevalidation
  );
}
function preventInvalidServerHandlerCall$1(type, route) {
  if (type === "loader" && !route.hasLoader || type === "action" && !route.hasAction) {
    let fn = type === "action" ? "serverAction()" : "serverLoader()";
    let msg = `You are trying to call ${fn} on a route that does not have a server ${type} (routeId: "${route.id}")`;
    console.error(msg);
    throw new ErrorResponseImpl(400, "Bad Request", new Error(msg), true);
  }
}
function noActionDefinedError(type, routeId) {
  let article = type === "clientAction" ? "a" : "an";
  let msg = `Route "${routeId}" does not have ${article} ${type}, but you are trying to submit to it. To fix this, please add ${article} \`${type}\` function to the route`;
  console.error(msg);
  throw new ErrorResponseImpl(405, "Method Not Allowed", new Error(msg), true);
}
function createClientRoutes(manifest, routeModulesCache, initialState, ssr, isSpaMode, parentId = "", routesByParentId = groupRoutesByParentId$1(manifest), needsRevalidation) {
  return (routesByParentId[parentId] || []).map((route) => {
    let routeModule = routeModulesCache[route.id];
    function fetchServerHandler(singleFetch) {
      invariant2(
        typeof singleFetch === "function",
        "No single fetch function available for route handler"
      );
      return singleFetch();
    }
    function fetchServerLoader(singleFetch) {
      if (!route.hasLoader) return Promise.resolve(null);
      return fetchServerHandler(singleFetch);
    }
    function fetchServerAction(singleFetch) {
      if (!route.hasAction) {
        throw noActionDefinedError("action", route.id);
      }
      return fetchServerHandler(singleFetch);
    }
    function prefetchModule(modulePath) {
      import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        modulePath
      );
    }
    function prefetchRouteModuleChunks(route2) {
      if (route2.clientActionModule) {
        prefetchModule(route2.clientActionModule);
      }
      if (route2.clientLoaderModule) {
        prefetchModule(route2.clientLoaderModule);
      }
    }
    async function prefetchStylesAndCallHandler(handler) {
      let cachedModule = routeModulesCache[route.id];
      let linkPrefetchPromise = cachedModule ? prefetchStyleLinks(route, cachedModule) : Promise.resolve();
      try {
        return handler();
      } finally {
        await linkPrefetchPromise;
      }
    }
    let dataRoute = {
      id: route.id,
      index: route.index,
      path: route.path
    };
    if (routeModule) {
      Object.assign(dataRoute, {
        ...dataRoute,
        ...getRouteComponents(route, routeModule, isSpaMode),
        middleware: routeModule.clientMiddleware,
        handle: routeModule.handle,
        shouldRevalidate: getShouldRevalidateFunction(
          dataRoute.path,
          routeModule,
          route,
          ssr,
          needsRevalidation
        )
      });
      let hasInitialData = initialState && initialState.loaderData && route.id in initialState.loaderData;
      let initialData = hasInitialData ? initialState?.loaderData?.[route.id] : void 0;
      let hasInitialError = initialState && initialState.errors && route.id in initialState.errors;
      let initialError = hasInitialError ? initialState?.errors?.[route.id] : void 0;
      let isHydrationRequest = needsRevalidation == null && (routeModule.clientLoader?.hydrate === true || !route.hasLoader);
      dataRoute.loader = async ({ request, params, context, unstable_pattern }, singleFetch) => {
        try {
          let result = await prefetchStylesAndCallHandler(async () => {
            invariant2(
              routeModule,
              "No `routeModule` available for critical-route loader"
            );
            if (!routeModule.clientLoader) {
              return fetchServerLoader(singleFetch);
            }
            return routeModule.clientLoader({
              request,
              params,
              context,
              unstable_pattern,
              async serverLoader() {
                preventInvalidServerHandlerCall$1("loader", route);
                if (isHydrationRequest) {
                  if (hasInitialData) {
                    return initialData;
                  }
                  if (hasInitialError) {
                    throw initialError;
                  }
                }
                return fetchServerLoader(singleFetch);
              }
            });
          });
          return result;
        } finally {
          isHydrationRequest = false;
        }
      };
      dataRoute.loader.hydrate = shouldHydrateRouteLoader(
        route.id,
        routeModule.clientLoader,
        route.hasLoader,
        isSpaMode
      );
      dataRoute.action = ({ request, params, context, unstable_pattern }, singleFetch) => {
        return prefetchStylesAndCallHandler(async () => {
          invariant2(
            routeModule,
            "No `routeModule` available for critical-route action"
          );
          if (!routeModule.clientAction) {
            if (isSpaMode) {
              throw noActionDefinedError("clientAction", route.id);
            }
            return fetchServerAction(singleFetch);
          }
          return routeModule.clientAction({
            request,
            params,
            context,
            unstable_pattern,
            async serverAction() {
              preventInvalidServerHandlerCall$1("action", route);
              return fetchServerAction(singleFetch);
            }
          });
        });
      };
    } else {
      if (!route.hasClientLoader) {
        dataRoute.loader = (_, singleFetch) => prefetchStylesAndCallHandler(() => {
          return fetchServerLoader(singleFetch);
        });
      }
      if (!route.hasClientAction) {
        dataRoute.action = (_, singleFetch) => prefetchStylesAndCallHandler(() => {
          if (isSpaMode) {
            throw noActionDefinedError("clientAction", route.id);
          }
          return fetchServerAction(singleFetch);
        });
      }
      let lazyRoutePromise;
      async function getLazyRoute() {
        if (lazyRoutePromise) {
          return await lazyRoutePromise;
        }
        lazyRoutePromise = (async () => {
          if (route.clientLoaderModule || route.clientActionModule) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
          let routeModulePromise = loadRouteModuleWithBlockingLinks(
            route,
            routeModulesCache
          );
          prefetchRouteModuleChunks(route);
          return await routeModulePromise;
        })();
        return await lazyRoutePromise;
      }
      dataRoute.lazy = {
        loader: route.hasClientLoader ? async () => {
          let { clientLoader } = route.clientLoaderModule ? await import(
            /* @vite-ignore */
            /* webpackIgnore: true */
            route.clientLoaderModule
          ) : await getLazyRoute();
          invariant2(clientLoader, "No `clientLoader` export found");
          return (args, singleFetch) => clientLoader({
            ...args,
            async serverLoader() {
              preventInvalidServerHandlerCall$1("loader", route);
              return fetchServerLoader(singleFetch);
            }
          });
        } : void 0,
        action: route.hasClientAction ? async () => {
          let clientActionPromise = route.clientActionModule ? import(
            /* @vite-ignore */
            /* webpackIgnore: true */
            route.clientActionModule
          ) : getLazyRoute();
          prefetchRouteModuleChunks(route);
          let { clientAction } = await clientActionPromise;
          invariant2(clientAction, "No `clientAction` export found");
          return (args, singleFetch) => clientAction({
            ...args,
            async serverAction() {
              preventInvalidServerHandlerCall$1("action", route);
              return fetchServerAction(singleFetch);
            }
          });
        } : void 0,
        middleware: route.hasClientMiddleware ? async () => {
          let { clientMiddleware } = route.clientMiddlewareModule ? await import(
            /* @vite-ignore */
            /* webpackIgnore: true */
            route.clientMiddlewareModule
          ) : await getLazyRoute();
          invariant2(clientMiddleware, "No `clientMiddleware` export found");
          return clientMiddleware;
        } : void 0,
        shouldRevalidate: async () => {
          let lazyRoute = await getLazyRoute();
          return getShouldRevalidateFunction(
            dataRoute.path,
            lazyRoute,
            route,
            ssr,
            needsRevalidation
          );
        },
        handle: async () => (await getLazyRoute()).handle,
        // No need to wrap these in layout since the root route is never
        // loaded via route.lazy()
        Component: async () => (await getLazyRoute()).Component,
        ErrorBoundary: route.hasErrorBoundary ? async () => (await getLazyRoute()).ErrorBoundary : void 0
      };
    }
    let children = createClientRoutes(
      manifest,
      routeModulesCache,
      initialState,
      ssr,
      isSpaMode,
      route.id,
      routesByParentId,
      needsRevalidation
    );
    if (children.length > 0) dataRoute.children = children;
    return dataRoute;
  });
}
function getShouldRevalidateFunction(path, route, manifestRoute, ssr, needsRevalidation) {
  if (needsRevalidation) {
    return wrapShouldRevalidateForHdr(
      manifestRoute.id,
      route.shouldRevalidate,
      needsRevalidation
    );
  }
  if (!ssr && manifestRoute.hasLoader && !manifestRoute.hasClientLoader) {
    let myParams = path ? compilePath(path)[1].map((p) => p.paramName) : [];
    const didParamsChange = (opts) => myParams.some((p) => opts.currentParams[p] !== opts.nextParams[p]);
    if (route.shouldRevalidate) {
      let fn = route.shouldRevalidate;
      return (opts) => fn({
        ...opts,
        defaultShouldRevalidate: didParamsChange(opts)
      });
    } else {
      return (opts) => didParamsChange(opts);
    }
  }
  return route.shouldRevalidate;
}
function wrapShouldRevalidateForHdr(routeId, routeShouldRevalidate, needsRevalidation) {
  let handledRevalidation = false;
  return (arg) => {
    if (!handledRevalidation) {
      handledRevalidation = true;
      return needsRevalidation.has(routeId);
    }
    return routeShouldRevalidate ? routeShouldRevalidate(arg) : arg.defaultShouldRevalidate;
  };
}
async function loadRouteModuleWithBlockingLinks(route, routeModules) {
  let routeModulePromise = loadRouteModule(route, routeModules);
  let prefetchRouteCssPromise = prefetchRouteCss(route);
  let routeModule = await routeModulePromise;
  await Promise.all([
    prefetchRouteCssPromise,
    prefetchStyleLinks(route, routeModule)
  ]);
  return {
    Component: getRouteModuleComponent(routeModule),
    ErrorBoundary: routeModule.ErrorBoundary,
    clientMiddleware: routeModule.clientMiddleware,
    clientAction: routeModule.clientAction,
    clientLoader: routeModule.clientLoader,
    handle: routeModule.handle,
    links: routeModule.links,
    meta: routeModule.meta,
    shouldRevalidate: routeModule.shouldRevalidate
  };
}
function getRouteModuleComponent(routeModule) {
  if (routeModule.default == null) return void 0;
  let isEmptyObject = typeof routeModule.default === "object" && Object.keys(routeModule.default).length === 0;
  if (!isEmptyObject) {
    return routeModule.default;
  }
}
function shouldHydrateRouteLoader(routeId, clientLoader, hasLoader, isSpaMode) {
  return isSpaMode && routeId !== "root" || clientLoader != null && (clientLoader.hydrate === true || hasLoader !== true);
}
var nextPaths$1 = /* @__PURE__ */ new Set();
var discoveredPathsMaxSize$1 = 1e3;
var discoveredPaths$1 = /* @__PURE__ */ new Set();
var URL_LIMIT$1 = 7680;
function isFogOfWarEnabled(routeDiscovery, ssr) {
  return routeDiscovery.mode === "lazy" && ssr === true;
}
function getPartialManifest({ sri, ...manifest }, router2) {
  let routeIds = new Set(router2.state.matches.map((m) => m.route.id));
  let segments = router2.state.location.pathname.split("/").filter(Boolean);
  let paths = ["/"];
  segments.pop();
  while (segments.length > 0) {
    paths.push(`/${segments.join("/")}`);
    segments.pop();
  }
  paths.forEach((path) => {
    let matches = matchRoutes(router2.routes, path, router2.basename);
    if (matches) {
      matches.forEach((m) => routeIds.add(m.route.id));
    }
  });
  let initialRoutes = [...routeIds].reduce(
    (acc, id) => Object.assign(acc, { [id]: manifest.routes[id] }),
    {}
  );
  return {
    ...manifest,
    routes: initialRoutes,
    sri: sri ? true : void 0
  };
}
function getPatchRoutesOnNavigationFunction(manifest, routeModules, ssr, routeDiscovery, isSpaMode, basename) {
  if (!isFogOfWarEnabled(routeDiscovery, ssr)) {
    return void 0;
  }
  return async ({ path, patch, signal, fetcherKey }) => {
    if (discoveredPaths$1.has(path)) {
      return;
    }
    await fetchAndApplyManifestPatches$1(
      [path],
      fetcherKey ? window.location.href : path,
      manifest,
      routeModules,
      ssr,
      isSpaMode,
      basename,
      routeDiscovery.manifestPath,
      patch,
      signal
    );
  };
}
function useFogOFWarDiscovery(router2, manifest, routeModules, ssr, routeDiscovery, isSpaMode) {
  React3.useEffect(() => {
    if (!isFogOfWarEnabled(routeDiscovery, ssr) || // @ts-expect-error - TS doesn't know about this yet
    window.navigator?.connection?.saveData === true) {
      return;
    }
    function registerElement(el) {
      let path = el.tagName === "FORM" ? el.getAttribute("action") : el.getAttribute("href");
      if (!path) {
        return;
      }
      let pathname = el.tagName === "A" ? el.pathname : new URL(path, window.location.origin).pathname;
      if (!discoveredPaths$1.has(pathname)) {
        nextPaths$1.add(pathname);
      }
    }
    async function fetchPatches() {
      document.querySelectorAll("a[data-discover], form[data-discover]").forEach(registerElement);
      let lazyPaths = Array.from(nextPaths$1.keys()).filter((path) => {
        if (discoveredPaths$1.has(path)) {
          nextPaths$1.delete(path);
          return false;
        }
        return true;
      });
      if (lazyPaths.length === 0) {
        return;
      }
      try {
        await fetchAndApplyManifestPatches$1(
          lazyPaths,
          null,
          manifest,
          routeModules,
          ssr,
          isSpaMode,
          router2.basename,
          routeDiscovery.manifestPath,
          router2.patchRoutes
        );
      } catch (e) {
        console.error("Failed to fetch manifest patches", e);
      }
    }
    let debouncedFetchPatches = debounce$1(fetchPatches, 100);
    fetchPatches();
    let observer = new MutationObserver(() => debouncedFetchPatches());
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-discover", "href", "action"]
    });
    return () => observer.disconnect();
  }, [ssr, isSpaMode, manifest, routeModules, router2, routeDiscovery]);
}
function getManifestPath(_manifestPath, basename) {
  let manifestPath = _manifestPath || "/__manifest";
  if (basename == null) {
    return manifestPath;
  }
  return `${basename}${manifestPath}`.replace(/\/+/g, "/");
}
var MANIFEST_VERSION_STORAGE_KEY = "react-router-manifest-version";
async function fetchAndApplyManifestPatches$1(paths, errorReloadPath, manifest, routeModules, ssr, isSpaMode, basename, manifestPath, patchRoutes, signal) {
  const searchParams = new URLSearchParams();
  searchParams.set("paths", paths.sort().join(","));
  searchParams.set("version", manifest.version);
  let url = new URL(
    getManifestPath(manifestPath, basename),
    window.location.origin
  );
  url.search = searchParams.toString();
  if (url.toString().length > URL_LIMIT$1) {
    nextPaths$1.clear();
    return;
  }
  let serverPatches;
  try {
    let res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    } else if (res.status === 204 && res.headers.has("X-Remix-Reload-Document")) {
      if (!errorReloadPath) {
        console.warn(
          "Detected a manifest version mismatch during eager route discovery. The next navigation/fetch to an undiscovered route will result in a new document navigation to sync up with the latest manifest."
        );
        return;
      }
      try {
        if (sessionStorage.getItem(MANIFEST_VERSION_STORAGE_KEY) === manifest.version) {
          console.error(
            "Unable to discover routes due to manifest version mismatch."
          );
          return;
        }
        sessionStorage.setItem(MANIFEST_VERSION_STORAGE_KEY, manifest.version);
      } catch {
      }
      window.location.href = errorReloadPath;
      console.warn("Detected manifest version mismatch, reloading...");
      await new Promise(() => {
      });
    } else if (res.status >= 400) {
      throw new Error(await res.text());
    }
    try {
      sessionStorage.removeItem(MANIFEST_VERSION_STORAGE_KEY);
    } catch {
    }
    serverPatches = await res.json();
  } catch (e) {
    if (signal?.aborted) return;
    throw e;
  }
  let knownRoutes = new Set(Object.keys(manifest.routes));
  let patches = Object.values(serverPatches).reduce((acc, route) => {
    if (route && !knownRoutes.has(route.id)) {
      acc[route.id] = route;
    }
    return acc;
  }, {});
  Object.assign(manifest.routes, patches);
  paths.forEach((p) => addToFifoQueue$1(p, discoveredPaths$1));
  let parentIds = /* @__PURE__ */ new Set();
  Object.values(patches).forEach((patch) => {
    if (patch && (!patch.parentId || !patches[patch.parentId])) {
      parentIds.add(patch.parentId);
    }
  });
  parentIds.forEach(
    (parentId) => patchRoutes(
      parentId || null,
      createClientRoutes(patches, routeModules, null, ssr, isSpaMode, parentId)
    )
  );
}
function addToFifoQueue$1(path, queue) {
  if (queue.size >= discoveredPathsMaxSize$1) {
    let first = queue.values().next().value;
    queue.delete(first);
  }
  queue.add(path);
}
function debounce$1(callback, wait) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}
function useDataRouterContext2() {
  let context = React3.useContext(DataRouterContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterContext.Provider> element"
  );
  return context;
}
function useDataRouterStateContext() {
  let context = React3.useContext(DataRouterStateContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  );
  return context;
}
var FrameworkContext = React3.createContext(void 0);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
  let context = React3.useContext(FrameworkContext);
  invariant2(
    context,
    "You must render this element inside a <HydratedRouter> element"
  );
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let frameworkContext = React3.useContext(FrameworkContext);
  let [maybePrefetch, setMaybePrefetch] = React3.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = React3.useState(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
  let ref = React3.useRef(null);
  React3.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer = new IntersectionObserver(callback, { threshold: 0.5 });
      if (ref.current) observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [prefetch]);
  React3.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  let setIntent = () => {
    setMaybePrefetch(true);
  };
  let cancelIntent = () => {
    setMaybePrefetch(false);
    setShouldPrefetch(false);
  };
  if (!frameworkContext) {
    return [false, ref, {}];
  }
  if (prefetch !== "intent") {
    return [shouldPrefetch, ref, {}];
  }
  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent)
    }
  ];
}
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function getActiveMatches(matches, errors, isSpaMode) {
  if (isSpaMode && !isHydrated) {
    return [matches[0]];
  }
  if (errors) {
    let errorIdx = matches.findIndex((m) => errors[m.route.id] !== void 0);
    return matches.slice(0, errorIdx + 1);
  }
  return matches;
}
var CRITICAL_CSS_DATA_ATTRIBUTE = "data-react-router-critical-css";
function Links({ nonce }) {
  let { isSpaMode, manifest, routeModules, criticalCss } = useFrameworkContext();
  let { errors, matches: routerMatches } = useDataRouterStateContext();
  let matches = getActiveMatches(routerMatches, errors, isSpaMode);
  let keyedLinks = React3.useMemo(
    () => getKeyedLinksForMatches(matches, routeModules, manifest),
    [matches, routeModules, manifest]
  );
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, typeof criticalCss === "string" ? /* @__PURE__ */ React3.createElement(
    "style",
    {
      ...{ [CRITICAL_CSS_DATA_ATTRIBUTE]: "" },
      dangerouslySetInnerHTML: { __html: criticalCss }
    }
  ) : null, typeof criticalCss === "object" ? /* @__PURE__ */ React3.createElement(
    "link",
    {
      ...{ [CRITICAL_CSS_DATA_ATTRIBUTE]: "" },
      rel: "stylesheet",
      href: criticalCss.href,
      nonce
    }
  ) : null, keyedLinks.map(
    ({ key, link }) => isPageLinkDescriptor(link) ? /* @__PURE__ */ React3.createElement(PrefetchPageLinks, { key, nonce, ...link }) : /* @__PURE__ */ React3.createElement("link", { key, nonce, ...link })
  ));
}
function PrefetchPageLinks({ page, ...linkProps }) {
  let { router: router2 } = useDataRouterContext2();
  let matches = React3.useMemo(
    () => matchRoutes(router2.routes, page, router2.basename),
    [router2.routes, page, router2.basename]
  );
  if (!matches) {
    return null;
  }
  return /* @__PURE__ */ React3.createElement(PrefetchPageLinksImpl, { page, matches, ...linkProps });
}
function useKeyedPrefetchLinks(matches) {
  let { manifest, routeModules } = useFrameworkContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = React3.useState([]);
  React3.useEffect(() => {
    let interrupted = false;
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then(
      (links) => {
        if (!interrupted) {
          setKeyedPrefetchLinks(links);
        }
      }
    );
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location2 = useLocation();
  let { manifest, routeModules } = useFrameworkContext();
  let { basename } = useDataRouterContext2();
  let { loaderData, matches } = useDataRouterStateContext();
  let newMatchesForData = React3.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location2,
      "data"
    ),
    [page, nextMatches, matches, manifest, location2]
  );
  let newMatchesForAssets = React3.useMemo(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location2,
      "assets"
    ),
    [page, nextMatches, matches, manifest, location2]
  );
  let dataHrefs = React3.useMemo(() => {
    if (page === location2.pathname + location2.search + location2.hash) {
      return [];
    }
    let routesParams = /* @__PURE__ */ new Set();
    let foundOptOutRoute = false;
    nextMatches.forEach((m) => {
      let manifestRoute = manifest.routes[m.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return;
      }
      if (!newMatchesForData.some((m2) => m2.route.id === m.route.id) && m.route.id in loaderData && routeModules[m.route.id]?.shouldRevalidate) {
        foundOptOutRoute = true;
      } else if (manifestRoute.hasClientLoader) {
        foundOptOutRoute = true;
      } else {
        routesParams.add(m.route.id);
      }
    });
    if (routesParams.size === 0) {
      return [];
    }
    let url = singleFetchUrl(page, basename, "data");
    if (foundOptOutRoute && routesParams.size > 0) {
      url.searchParams.set(
        "_routes",
        nextMatches.filter((m) => routesParams.has(m.route.id)).map((m) => m.route.id).join(",")
      );
    }
    return [url.pathname + url.search];
  }, [
    basename,
    loaderData,
    location2,
    manifest,
    newMatchesForData,
    nextMatches,
    page,
    routeModules
  ]);
  let moduleHrefs = React3.useMemo(
    () => getModuleLinkHrefs(newMatchesForAssets, manifest),
    [newMatchesForAssets, manifest]
  );
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, dataHrefs.map((href2) => /* @__PURE__ */ React3.createElement("link", { key: href2, rel: "prefetch", as: "fetch", href: href2, ...linkProps })), moduleHrefs.map((href2) => /* @__PURE__ */ React3.createElement("link", { key: href2, rel: "modulepreload", href: href2, ...linkProps })), keyedPrefetchLinks.map(({ key, link }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ React3.createElement("link", { key, nonce: linkProps.nonce, ...link })
  )));
}
function Meta() {
  let { isSpaMode, routeModules } = useFrameworkContext();
  let {
    errors,
    matches: routerMatches,
    loaderData
  } = useDataRouterStateContext();
  let location2 = useLocation();
  let _matches = getActiveMatches(routerMatches, errors, isSpaMode);
  let error = null;
  if (errors) {
    error = errors[_matches[_matches.length - 1].route.id];
  }
  let meta = [];
  let leafMeta = null;
  let matches = [];
  for (let i = 0; i < _matches.length; i++) {
    let _match = _matches[i];
    let routeId = _match.route.id;
    let data2 = loaderData[routeId];
    let params = _match.params;
    let routeModule = routeModules[routeId];
    let routeMeta = [];
    let match = {
      id: routeId,
      data: data2,
      loaderData: data2,
      meta: [],
      params: _match.params,
      pathname: _match.pathname,
      handle: _match.route.handle,
      error
    };
    matches[i] = match;
    if (routeModule?.meta) {
      routeMeta = typeof routeModule.meta === "function" ? routeModule.meta({
        data: data2,
        loaderData: data2,
        params,
        location: location2,
        matches,
        error
      }) : Array.isArray(routeModule.meta) ? [...routeModule.meta] : routeModule.meta;
    } else if (leafMeta) {
      routeMeta = [...leafMeta];
    }
    routeMeta = routeMeta || [];
    if (!Array.isArray(routeMeta)) {
      throw new Error(
        "The route at " + _match.route.path + " returns an invalid value. All route meta functions must return an array of meta objects.\n\nTo reference the meta function API, see https://remix.run/route/meta"
      );
    }
    match.meta = routeMeta;
    matches[i] = match;
    meta = [...routeMeta];
    leafMeta = meta;
  }
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, meta.flat().map((metaProps) => {
    if (!metaProps) {
      return null;
    }
    if ("tagName" in metaProps) {
      let { tagName, ...rest } = metaProps;
      if (!isValidMetaTag(tagName)) {
        console.warn(
          `A meta object uses an invalid tagName: ${tagName}. Expected either 'link' or 'meta'`
        );
        return null;
      }
      let Comp = tagName;
      return /* @__PURE__ */ React3.createElement(Comp, { key: JSON.stringify(rest), ...rest });
    }
    if ("title" in metaProps) {
      return /* @__PURE__ */ React3.createElement("title", { key: "title" }, String(metaProps.title));
    }
    if ("charset" in metaProps) {
      metaProps.charSet ?? (metaProps.charSet = metaProps.charset);
      delete metaProps.charset;
    }
    if ("charSet" in metaProps && metaProps.charSet != null) {
      return typeof metaProps.charSet === "string" ? /* @__PURE__ */ React3.createElement("meta", { key: "charSet", charSet: metaProps.charSet }) : null;
    }
    if ("script:ld+json" in metaProps) {
      try {
        let json = JSON.stringify(metaProps["script:ld+json"]);
        return /* @__PURE__ */ React3.createElement(
          "script",
          {
            key: `script:ld+json:${json}`,
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: escapeHtml(json) }
          }
        );
      } catch (err) {
        return null;
      }
    }
    return /* @__PURE__ */ React3.createElement("meta", { key: JSON.stringify(metaProps), ...metaProps });
  }));
}
function isValidMetaTag(tagName) {
  return typeof tagName === "string" && /^(meta|link)$/.test(tagName);
}
var isHydrated = false;
function setIsHydrated() {
  isHydrated = true;
}
function Scripts(scriptProps) {
  let {
    manifest,
    serverHandoffString,
    isSpaMode,
    renderMeta,
    routeDiscovery,
    ssr
  } = useFrameworkContext();
  let { router: router2, static: isStatic, staticContext } = useDataRouterContext2();
  let { matches: routerMatches } = useDataRouterStateContext();
  let isRSCRouterContext = useIsRSCRouterContext();
  let enableFogOfWar = isFogOfWarEnabled(routeDiscovery, ssr);
  if (renderMeta) {
    renderMeta.didRenderScripts = true;
  }
  let matches = getActiveMatches(routerMatches, null, isSpaMode);
  React3.useEffect(() => {
    setIsHydrated();
  }, []);
  let initialScripts = React3.useMemo(() => {
    if (isRSCRouterContext) {
      return null;
    }
    let streamScript = "window.__reactRouterContext.stream = new ReadableStream({start(controller){window.__reactRouterContext.streamController = controller;}}).pipeThrough(new TextEncoderStream());";
    let contextScript = staticContext ? `window.__reactRouterContext = ${serverHandoffString};${streamScript}` : " ";
    let routeModulesScript = !isStatic ? " " : `${manifest.hmr?.runtime ? `import ${JSON.stringify(manifest.hmr.runtime)};` : ""}${!enableFogOfWar ? `import ${JSON.stringify(manifest.url)}` : ""};
${matches.map((match, routeIndex) => {
      let routeVarName = `route${routeIndex}`;
      let manifestEntry = manifest.routes[match.route.id];
      invariant2(manifestEntry, `Route ${match.route.id} not found in manifest`);
      let {
        clientActionModule,
        clientLoaderModule,
        clientMiddlewareModule,
        hydrateFallbackModule,
        module
      } = manifestEntry;
      let chunks = [
        ...clientActionModule ? [
          {
            module: clientActionModule,
            varName: `${routeVarName}_clientAction`
          }
        ] : [],
        ...clientLoaderModule ? [
          {
            module: clientLoaderModule,
            varName: `${routeVarName}_clientLoader`
          }
        ] : [],
        ...clientMiddlewareModule ? [
          {
            module: clientMiddlewareModule,
            varName: `${routeVarName}_clientMiddleware`
          }
        ] : [],
        ...hydrateFallbackModule ? [
          {
            module: hydrateFallbackModule,
            varName: `${routeVarName}_HydrateFallback`
          }
        ] : [],
        { module, varName: `${routeVarName}_main` }
      ];
      if (chunks.length === 1) {
        return `import * as ${routeVarName} from ${JSON.stringify(module)};`;
      }
      let chunkImportsSnippet = chunks.map((chunk) => `import * as ${chunk.varName} from "${chunk.module}";`).join("\n");
      let mergedChunksSnippet = `const ${routeVarName} = {${chunks.map((chunk) => `...${chunk.varName}`).join(",")}};`;
      return [chunkImportsSnippet, mergedChunksSnippet].join("\n");
    }).join("\n")}
  ${enableFogOfWar ? (
      // Inline a minimal manifest with the SSR matches
      `window.__reactRouterManifest = ${JSON.stringify(
        getPartialManifest(manifest, router2),
        null,
        2
      )};`
    ) : ""}
  window.__reactRouterRouteModules = {${matches.map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`).join(",")}};

import(${JSON.stringify(manifest.entry.module)});`;
    return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(
      "script",
      {
        ...scriptProps,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: contextScript },
        type: void 0
      }
    ), /* @__PURE__ */ React3.createElement(
      "script",
      {
        ...scriptProps,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: routeModulesScript },
        type: "module",
        async: true
      }
    ));
  }, []);
  let preloads = isHydrated || isRSCRouterContext ? [] : dedupe(
    manifest.entry.imports.concat(
      getModuleLinkHrefs(matches, manifest, {
        includeHydrateFallback: true
      })
    )
  );
  let sri = typeof manifest.sri === "object" ? manifest.sri : {};
  warnOnce(
    !isRSCRouterContext,
    "The <Scripts /> element is a no-op when using RSC and can be safely removed."
  );
  return isHydrated || isRSCRouterContext ? null : /* @__PURE__ */ React3.createElement(React3.Fragment, null, typeof manifest.sri === "object" ? /* @__PURE__ */ React3.createElement(
    "script",
    {
      "rr-importmap": "",
      type: "importmap",
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          integrity: sri
        })
      }
    }
  ) : null, !enableFogOfWar ? /* @__PURE__ */ React3.createElement(
    "link",
    {
      rel: "modulepreload",
      href: manifest.url,
      crossOrigin: scriptProps.crossOrigin,
      integrity: sri[manifest.url],
      suppressHydrationWarning: true
    }
  ) : null, /* @__PURE__ */ React3.createElement(
    "link",
    {
      rel: "modulepreload",
      href: manifest.entry.module,
      crossOrigin: scriptProps.crossOrigin,
      integrity: sri[manifest.entry.module],
      suppressHydrationWarning: true
    }
  ), preloads.map((path) => /* @__PURE__ */ React3.createElement(
    "link",
    {
      key: path,
      rel: "modulepreload",
      href: path,
      crossOrigin: scriptProps.crossOrigin,
      integrity: sri[path],
      suppressHydrationWarning: true
    }
  )), initialScripts);
}
function dedupe(array) {
  return [...new Set(array)];
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var RemixErrorBoundary = class extends React3.Component {
  constructor(props) {
    super(props);
    this.state = { error: props.error || null, location: props.location };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location) {
      return { error: props.error || null, location: props.location };
    }
    return { error: props.error || state.error, location: state.location };
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ React3.createElement(
        RemixRootDefaultErrorBoundary,
        {
          error: this.state.error,
          isOutsideRemixApp: true
        }
      );
    } else {
      return this.props.children;
    }
  }
};
function RemixRootDefaultErrorBoundary({
  error,
  isOutsideRemixApp
}) {
  console.error(error);
  let heyDeveloper = /* @__PURE__ */ React3.createElement(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: `
        console.log(
          "💿 Hey developer 👋. You can provide a way better UX than this when your app throws errors. Check out https://reactrouter.com/how-to/error-boundary for more information."
        );
      `
      }
    }
  );
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ React3.createElement(BoundaryShell, { title: "Unhandled Thrown Response!" }, /* @__PURE__ */ React3.createElement("h1", { style: { fontSize: "24px" } }, error.status, " ", error.statusText), heyDeveloper);
  }
  let errorInstance;
  if (error instanceof Error) {
    errorInstance = error;
  } else {
    let errorString = error == null ? "Unknown Error" : typeof error === "object" && "toString" in error ? error.toString() : JSON.stringify(error);
    errorInstance = new Error(errorString);
  }
  return /* @__PURE__ */ React3.createElement(
    BoundaryShell,
    {
      title: "Application Error!",
      isOutsideRemixApp
    },
    /* @__PURE__ */ React3.createElement("h1", { style: { fontSize: "24px" } }, "Application Error"),
    /* @__PURE__ */ React3.createElement(
      "pre",
      {
        style: {
          padding: "2rem",
          background: "hsla(10, 50%, 50%, 0.1)",
          color: "red",
          overflow: "auto"
        }
      },
      errorInstance.stack
    ),
    heyDeveloper
  );
}
function BoundaryShell({
  title,
  renderScripts,
  isOutsideRemixApp,
  children
}) {
  let { routeModules } = useFrameworkContext();
  if (routeModules.root?.Layout && !isOutsideRemixApp) {
    return children;
  }
  return /* @__PURE__ */ React3.createElement("html", { lang: "en" }, /* @__PURE__ */ React3.createElement("head", null, /* @__PURE__ */ React3.createElement("meta", { charSet: "utf-8" }), /* @__PURE__ */ React3.createElement(
    "meta",
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover"
    }
  ), /* @__PURE__ */ React3.createElement("title", null, title)), /* @__PURE__ */ React3.createElement("body", null, /* @__PURE__ */ React3.createElement("main", { style: { fontFamily: "system-ui, sans-serif", padding: "2rem" } }, children, renderScripts ? /* @__PURE__ */ React3.createElement(Scripts, null) : null)));
}
var isBrowser2 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
  if (isBrowser2) {
    window.__reactRouterVersion = // @ts-expect-error
    "7.11.0";
  }
} catch (e) {
}
function createBrowserRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    getContext: opts?.getContext,
    future: opts?.future,
    history: createBrowserHistory({ window: opts?.window }),
    hydrationData: opts?.hydrationData || parseHydrationData(),
    routes,
    mapRouteProperties,
    hydrationRouteProperties,
    dataStrategy: opts?.dataStrategy,
    patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
    window: opts?.window,
    unstable_instrumentations: opts?.unstable_instrumentations
  }).initialize();
}
function createHashRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    getContext: opts?.getContext,
    future: opts?.future,
    history: createHashHistory({ window: opts?.window }),
    hydrationData: opts?.hydrationData || parseHydrationData(),
    routes,
    mapRouteProperties,
    hydrationRouteProperties,
    dataStrategy: opts?.dataStrategy,
    patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
    window: opts?.window,
    unstable_instrumentations: opts?.unstable_instrumentations
  }).initialize();
}
function parseHydrationData() {
  let state = window?.__staticRouterHydrationData;
  if (state && state.errors) {
    state = {
      ...state,
      errors: deserializeErrors$1(state.errors)
    };
  }
  return state;
}
function deserializeErrors$1(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new ErrorResponseImpl(
        val.status,
        val.statusText,
        val.data,
        val.internal === true
      );
    } else if (val && val.__type === "Error") {
      if (val.__subType) {
        let ErrorConstructor = window[val.__subType];
        if (typeof ErrorConstructor === "function") {
          try {
            let error = new ErrorConstructor(val.message);
            error.stack = "";
            serialized[key] = error;
          } catch (e) {
          }
        }
      }
      if (serialized[key] == null) {
        let error = new Error(val.message);
        error.stack = "";
        serialized[key] = error;
      }
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
function BrowserRouter({
  basename,
  children,
  unstable_useTransitions,
  window: window2
}) {
  let historyRef = React3.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window: window2, v5Compat: true });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = React3.useState({
    action: history.action,
    location: history.location
  });
  let setState = React3.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        React3.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  React3.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ React3.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
function HashRouter({
  basename,
  children,
  unstable_useTransitions,
  window: window2
}) {
  let historyRef = React3.useRef();
  if (historyRef.current == null) {
    historyRef.current = createHashHistory({ window: window2, v5Compat: true });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = React3.useState({
    action: history.action,
    location: history.location
  });
  let setState = React3.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        React3.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  React3.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ React3.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
function HistoryRouter({
  basename,
  children,
  history,
  unstable_useTransitions
}) {
  let [state, setStateImpl] = React3.useState({
    action: history.action,
    location: history.location
  });
  let setState = React3.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        React3.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  React3.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ React3.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
HistoryRouter.displayName = "unstable_HistoryRouter";
var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var Link = React3.forwardRef(
  function LinkWithRef({
    onClick,
    discover = "render",
    prefetch = "none",
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...rest
  }, forwardedRef) {
    let { basename, unstable_useTransitions } = React3.useContext(NavigationContext);
    let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to);
    let parsed = parseToInfo(to, basename);
    to = parsed.to;
    let href2 = useHref(to, { relative });
    let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(
      prefetch,
      rest
    );
    let internalOnClick = useLinkClickHandler(to, {
      replace: replace2,
      state,
      target,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    });
    function handleClick(event) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }
    let link = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ React3.createElement(
        "a",
        {
          ...rest,
          ...prefetchHandlers,
          href: parsed.absoluteURL || href2,
          onClick: parsed.isExternal || reloadDocument ? onClick : handleClick,
          ref: mergeRefs(forwardedRef, prefetchRef),
          target,
          "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
        }
      )
    );
    return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ React3.createElement(React3.Fragment, null, link, /* @__PURE__ */ React3.createElement(PrefetchPageLinks, { page: href2 })) : link;
  }
);
Link.displayName = "Link";
var NavLink = React3.forwardRef(
  function NavLinkWithRef({
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children,
    ...rest
  }, ref) {
    let path = useResolvedPath(to, { relative: rest.relative });
    let location2 = useLocation();
    let routerState = React3.useContext(DataRouterStateContext);
    let { navigator: navigator2, basename } = React3.useContext(NavigationContext);
    let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useViewTransitionState(path) && viewTransition === true;
    let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
    let locationPathname = location2.pathname;
    let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
      toPathname = toPathname.toLowerCase();
    }
    if (nextLocationPathname && basename) {
      nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
    }
    const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
    let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
    let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
    let renderProps = {
      isActive,
      isPending,
      isTransitioning
    };
    let ariaCurrent = isActive ? ariaCurrentProp : void 0;
    let className;
    if (typeof classNameProp === "function") {
      className = classNameProp(renderProps);
    } else {
      className = [
        classNameProp,
        isActive ? "active" : null,
        isPending ? "pending" : null,
        isTransitioning ? "transitioning" : null
      ].filter(Boolean).join(" ");
    }
    let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
    return /* @__PURE__ */ React3.createElement(
      Link,
      {
        ...rest,
        "aria-current": ariaCurrent,
        className,
        ref,
        style,
        to,
        viewTransition
      },
      typeof children === "function" ? children(renderProps) : children
    );
  }
);
NavLink.displayName = "NavLink";
var Form = React3.forwardRef(
  ({
    discover = "render",
    fetcherKey,
    navigate,
    reloadDocument,
    replace: replace2,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...props
  }, forwardedRef) => {
    let { unstable_useTransitions } = React3.useContext(NavigationContext);
    let submit = useSubmit();
    let formAction = useFormAction(action, { relative });
    let formMethod = method.toLowerCase() === "get" ? "get" : "post";
    let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX2.test(action);
    let submitHandler = (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = submitter?.getAttribute("formmethod") || method;
      let doSubmit = () => submit(submitter || event.currentTarget, {
        fetcherKey,
        method: submitMethod,
        navigate,
        replace: replace2,
        state,
        relative,
        preventScrollReset,
        viewTransition,
        unstable_defaultShouldRevalidate
      });
      if (unstable_useTransitions && navigate !== false) {
        React3.startTransition(() => doSubmit());
      } else {
        doSubmit();
      }
    };
    return /* @__PURE__ */ React3.createElement(
      "form",
      {
        ref: forwardedRef,
        method: formMethod,
        action: formAction,
        onSubmit: reloadDocument ? onSubmit : submitHandler,
        ...props,
        "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
      }
    );
  }
);
Form.displayName = "Form";
function ScrollRestoration({
  getKey,
  storageKey,
  ...props
}) {
  let remixContext = React3.useContext(FrameworkContext);
  let { basename } = React3.useContext(NavigationContext);
  let location2 = useLocation();
  let matches = useMatches();
  useScrollRestoration({ getKey, storageKey });
  let ssrKey = React3.useMemo(
    () => {
      if (!remixContext || !getKey) return null;
      let userKey = getScrollRestorationKey(
        location2,
        matches,
        basename,
        getKey
      );
      return userKey !== location2.key ? userKey : null;
    },
    // Nah, we only need this the first time for the SSR render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (!remixContext || remixContext.isSpaMode) {
    return null;
  }
  let restoreScroll = ((storageKey2, restoreKey) => {
    if (!window.history.state || !window.history.state.key) {
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({ key }, "");
    }
    try {
      let positions = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
      let storedY = positions[restoreKey || window.history.state.key];
      if (typeof storedY === "number") {
        window.scrollTo(0, storedY);
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem(storageKey2);
    }
  }).toString();
  return /* @__PURE__ */ React3.createElement(
    "script",
    {
      ...props,
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: `(${restoreScroll})(${JSON.stringify(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        )}, ${JSON.stringify(ssrKey)})`
      }
    }
  );
}
ScrollRestoration.displayName = "ScrollRestoration";
function getDataRouterConsoleError2(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
  let ctx = React3.useContext(DataRouterContext);
  invariant$1(ctx, getDataRouterConsoleError2(hookName));
  return ctx;
}
function useDataRouterState2(hookName) {
  let state = React3.useContext(DataRouterStateContext);
  invariant$1(state, getDataRouterConsoleError2(hookName));
  return state;
}
function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  state,
  preventScrollReset,
  relative,
  viewTransition,
  unstable_defaultShouldRevalidate,
  unstable_useTransitions
} = {}) {
  let navigate = useNavigate();
  let location2 = useLocation();
  let path = useResolvedPath(to, { relative });
  return React3.useCallback(
    (event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();
        let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location2) === createPath(path);
        let doNavigate = () => navigate(to, {
          replace: replace2,
          state,
          preventScrollReset,
          relative,
          viewTransition,
          unstable_defaultShouldRevalidate
        });
        if (unstable_useTransitions) {
          React3.startTransition(() => doNavigate());
        } else {
          doNavigate();
        }
      }
    },
    [
      location2,
      navigate,
      path,
      replaceProp,
      state,
      target,
      to,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    ]
  );
}
function useSearchParams(defaultInit) {
  warning(
    typeof URLSearchParams !== "undefined",
    `You cannot use the \`useSearchParams\` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.`
  );
  let defaultSearchParamsRef = React3.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = React3.useRef(false);
  let location2 = useLocation();
  let searchParams = React3.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      getSearchParamsForLocation(
        location2.search,
        hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current
      )
    ),
    [location2.search]
  );
  let navigate = useNavigate();
  let setSearchParams = React3.useCallback(
    (nextInit, navigateOptions) => {
      const newSearchParams = createSearchParams(
        typeof nextInit === "function" ? nextInit(new URLSearchParams(searchParams)) : nextInit
      );
      hasSetSearchParamsRef.current = true;
      navigate("?" + newSearchParams, navigateOptions);
    },
    [navigate, searchParams]
  );
  return [searchParams, setSearchParams];
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
function useSubmit() {
  let { router: router2 } = useDataRouterContext3(
    "useSubmit"
    /* UseSubmit */
  );
  let { basename } = React3.useContext(NavigationContext);
  let currentRouteId = useRouteId();
  let routerFetch = router2.fetch;
  let routerNavigate = router2.navigate;
  return React3.useCallback(
    async (target, options = {}) => {
      let { action, method, encType, formData, body } = getFormSubmissionInfo(
        target,
        basename
      );
      if (options.navigate === false) {
        let key = options.fetcherKey || getUniqueFetcherId();
        await routerFetch(key, currentRouteId, options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          flushSync: options.flushSync
        });
      } else {
        await routerNavigate(options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          replace: options.replace,
          state: options.state,
          fromRouteId: currentRouteId,
          flushSync: options.flushSync,
          viewTransition: options.viewTransition
        });
      }
    },
    [routerFetch, routerNavigate, basename, currentRouteId]
  );
}
function useFormAction(action, { relative } = {}) {
  let { basename } = React3.useContext(NavigationContext);
  let routeContext = React3.useContext(RouteContext);
  invariant$1(routeContext, "useFormAction must be used inside a RouteContext");
  let [match] = routeContext.matches.slice(-1);
  let path = { ...useResolvedPath(action ? action : ".", { relative }) };
  let location2 = useLocation();
  if (action == null) {
    path.search = location2.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useFetcher({
  key
} = {}) {
  let { router: router2 } = useDataRouterContext3(
    "useFetcher"
    /* UseFetcher */
  );
  let state = useDataRouterState2(
    "useFetcher"
    /* UseFetcher */
  );
  let fetcherData = React3.useContext(FetchersContext);
  let route = React3.useContext(RouteContext);
  let routeId = route.matches[route.matches.length - 1]?.route.id;
  invariant$1(fetcherData, `useFetcher must be used inside a FetchersContext`);
  invariant$1(route, `useFetcher must be used inside a RouteContext`);
  invariant$1(
    routeId != null,
    `useFetcher can only be used on routes that contain a unique "id"`
  );
  let defaultKey = React3.useId();
  let [fetcherKey, setFetcherKey] = React3.useState(key || defaultKey);
  if (key && key !== fetcherKey) {
    setFetcherKey(key);
  }
  let { deleteFetcher, getFetcher, resetFetcher, fetch: routerFetch } = router2;
  React3.useEffect(() => {
    getFetcher(fetcherKey);
    return () => deleteFetcher(fetcherKey);
  }, [deleteFetcher, getFetcher, fetcherKey]);
  let load = React3.useCallback(
    async (href2, opts) => {
      invariant$1(routeId, "No routeId available for fetcher.load()");
      await routerFetch(fetcherKey, routeId, href2, opts);
    },
    [fetcherKey, routeId, routerFetch]
  );
  let submitImpl = useSubmit();
  let submit = React3.useCallback(
    async (target, opts) => {
      await submitImpl(target, {
        ...opts,
        navigate: false,
        fetcherKey
      });
    },
    [fetcherKey, submitImpl]
  );
  let reset = React3.useCallback(
    (opts) => resetFetcher(fetcherKey, opts),
    [resetFetcher, fetcherKey]
  );
  let FetcherForm = React3.useMemo(() => {
    let FetcherForm2 = React3.forwardRef(
      (props, ref) => {
        return /* @__PURE__ */ React3.createElement(Form, { ...props, navigate: false, fetcherKey, ref });
      }
    );
    FetcherForm2.displayName = "fetcher.Form";
    return FetcherForm2;
  }, [fetcherKey]);
  let fetcher = state.fetchers.get(fetcherKey) || IDLE_FETCHER;
  let data2 = fetcherData.get(fetcherKey);
  let fetcherWithComponents = React3.useMemo(
    () => ({
      Form: FetcherForm,
      submit,
      load,
      reset,
      ...fetcher,
      data: data2
    }),
    [FetcherForm, submit, load, reset, fetcher, data2]
  );
  return fetcherWithComponents;
}
function useFetchers() {
  let state = useDataRouterState2(
    "useFetchers"
    /* UseFetchers */
  );
  return Array.from(state.fetchers.entries()).map(([key, fetcher]) => ({
    ...fetcher,
    key
  }));
}
var SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
var savedScrollPositions = {};
function getScrollRestorationKey(location2, matches, basename, getKey) {
  let key = null;
  if (getKey) {
    if (basename !== "/") {
      key = getKey(
        {
          ...location2,
          pathname: stripBasename(location2.pathname, basename) || location2.pathname
        },
        matches
      );
    } else {
      key = getKey(location2, matches);
    }
  }
  if (key == null) {
    key = location2.key;
  }
  return key;
}
function useScrollRestoration({
  getKey,
  storageKey
} = {}) {
  let { router: router2 } = useDataRouterContext3(
    "useScrollRestoration"
    /* UseScrollRestoration */
  );
  let { restoreScrollPosition, preventScrollReset } = useDataRouterState2(
    "useScrollRestoration"
    /* UseScrollRestoration */
  );
  let { basename } = React3.useContext(NavigationContext);
  let location2 = useLocation();
  let matches = useMatches();
  let navigation = useNavigation();
  React3.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);
  usePageHide(
    React3.useCallback(() => {
      if (navigation.state === "idle") {
        let key = getScrollRestorationKey(location2, matches, basename, getKey);
        savedScrollPositions[key] = window.scrollY;
      }
      try {
        sessionStorage.setItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY,
          JSON.stringify(savedScrollPositions)
        );
      } catch (error) {
        warning(
          false,
          `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`
        );
      }
      window.history.scrollRestoration = "auto";
    }, [navigation.state, getKey, basename, location2, matches, storageKey])
  );
  if (typeof document !== "undefined") {
    React3.useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        );
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e) {
      }
    }, [storageKey]);
    React3.useLayoutEffect(() => {
      let disableScrollRestoration = router2?.enableScrollRestoration(
        savedScrollPositions,
        () => window.scrollY,
        getKey ? (location22, matches2) => getScrollRestorationKey(location22, matches2, basename, getKey) : void 0
      );
      return () => disableScrollRestoration && disableScrollRestoration();
    }, [router2, basename, getKey]);
    React3.useLayoutEffect(() => {
      if (restoreScrollPosition === false) {
        return;
      }
      if (typeof restoreScrollPosition === "number") {
        window.scrollTo(0, restoreScrollPosition);
        return;
      }
      try {
        if (location2.hash) {
          let el = document.getElementById(
            decodeURIComponent(location2.hash.slice(1))
          );
          if (el) {
            el.scrollIntoView();
            return;
          }
        }
      } catch {
        warning(
          false,
          `"${location2.hash.slice(
            1
          )}" is not a decodable element ID. The view will not scroll to it.`
        );
      }
      if (preventScrollReset === true) {
        return;
      }
      window.scrollTo(0, 0);
    }, [location2, restoreScrollPosition, preventScrollReset]);
  }
}
function useBeforeUnload(callback, options) {
  let { capture } = options || {};
  React3.useEffect(() => {
    let opts = capture != null ? { capture } : void 0;
    window.addEventListener("beforeunload", callback, opts);
    return () => {
      window.removeEventListener("beforeunload", callback, opts);
    };
  }, [callback, capture]);
}
function usePageHide(callback, options) {
  let { capture } = {};
  React3.useEffect(() => {
    let opts = capture != null ? { capture } : void 0;
    window.addEventListener("pagehide", callback, opts);
    return () => {
      window.removeEventListener("pagehide", callback, opts);
    };
  }, [callback, capture]);
}
function usePrompt({
  when,
  message
}) {
  let blocker = useBlocker(when);
  React3.useEffect(() => {
    if (blocker.state === "blocked") {
      let proceed = window.confirm(message);
      if (proceed) {
        setTimeout(blocker.proceed, 0);
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
  React3.useEffect(() => {
    if (blocker.state === "blocked" && !when) {
      blocker.reset();
    }
  }, [blocker, when]);
}
function useViewTransitionState(to, { relative } = {}) {
  let vtContext = React3.useContext(ViewTransitionContext);
  invariant$1(
    vtContext != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename } = useDataRouterContext3(
    "useViewTransitionState"
    /* useViewTransitionState */
  );
  let path = useResolvedPath(to, { relative });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
function StaticRouter({
  basename,
  children,
  location: locationProp = "/"
}) {
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let action = "POP";
  let location2 = {
    pathname: locationProp.pathname || "/",
    search: locationProp.search || "",
    hash: locationProp.hash || "",
    state: locationProp.state != null ? locationProp.state : null,
    key: locationProp.key || "default"
  };
  let staticNavigator = getStatelessNavigator();
  return /* @__PURE__ */ React3.createElement(
    Router,
    {
      basename,
      children,
      location: location2,
      navigationType: action,
      navigator: staticNavigator,
      static: true,
      unstable_useTransitions: false
    }
  );
}
function StaticRouterProvider({
  context,
  router: router2,
  hydrate: hydrate2 = true,
  nonce
}) {
  invariant$1(
    router2 && context,
    "You must provide `router` and `context` to <StaticRouterProvider>"
  );
  let dataRouterContext = {
    router: router2,
    navigator: getStatelessNavigator(),
    static: true,
    staticContext: context,
    basename: context.basename || "/"
  };
  let fetchersContext = /* @__PURE__ */ new Map();
  let hydrateScript = "";
  if (hydrate2 !== false) {
    let data2 = {
      loaderData: context.loaderData,
      actionData: context.actionData,
      errors: serializeErrors$1(context.errors)
    };
    let json = htmlEscape(JSON.stringify(JSON.stringify(data2)));
    hydrateScript = `window.__staticRouterHydrationData = JSON.parse(${json});`;
  }
  let { state } = dataRouterContext.router;
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(DataRouterContext.Provider, { value: dataRouterContext }, /* @__PURE__ */ React3.createElement(DataRouterStateContext.Provider, { value: state }, /* @__PURE__ */ React3.createElement(FetchersContext.Provider, { value: fetchersContext }, /* @__PURE__ */ React3.createElement(ViewTransitionContext.Provider, { value: { isTransitioning: false } }, /* @__PURE__ */ React3.createElement(
    Router,
    {
      basename: dataRouterContext.basename,
      location: state.location,
      navigationType: state.historyAction,
      navigator: dataRouterContext.navigator,
      static: dataRouterContext.static,
      unstable_useTransitions: false
    },
    /* @__PURE__ */ React3.createElement(
      DataRoutes2,
      {
        routes: router2.routes,
        future: router2.future,
        state
      }
    )
  ))))), hydrateScript ? /* @__PURE__ */ React3.createElement(
    "script",
    {
      suppressHydrationWarning: true,
      nonce,
      dangerouslySetInnerHTML: { __html: hydrateScript }
    }
  ) : null);
}
function DataRoutes2({
  routes,
  future,
  state
}) {
  return useRoutesImpl(routes, void 0, state, void 0, future);
}
function serializeErrors$1(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (isRouteErrorResponse(val)) {
      serialized[key] = { ...val, __type: "RouteErrorResponse" };
    } else if (val instanceof Error) {
      serialized[key] = {
        message: val.message,
        __type: "Error",
        // If this is a subclass (i.e., ReferenceError), send up the type so we
        // can re-create the same type during hydration.
        ...val.name !== "Error" ? {
          __subType: val.name
        } : {}
      };
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
function getStatelessNavigator() {
  return {
    createHref,
    encodeLocation,
    push(to) {
      throw new Error(
        `You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`
      );
    },
    replace(to) {
      throw new Error(
        `You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`
      );
    },
    go(delta) {
      throw new Error(
        `You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`
      );
    },
    back() {
      throw new Error(
        `You cannot use navigator.back() on the server because it is a stateless environment.`
      );
    },
    forward() {
      throw new Error(
        `You cannot use navigator.forward() on the server because it is a stateless environment.`
      );
    }
  };
}
function createStaticHandler2(routes, opts) {
  return createStaticHandler(routes, {
    ...opts,
    mapRouteProperties
  });
}
function createStaticRouter(routes, context, opts = {}) {
  let manifest = {};
  let dataRoutes = convertRoutesToDataRoutes(
    routes,
    mapRouteProperties,
    void 0,
    manifest
  );
  let matches = context.matches.map((match) => {
    let route = manifest[match.route.id] || match.route;
    return {
      ...match,
      route
    };
  });
  let msg = (method) => `You cannot use router.${method}() on the server because it is a stateless environment`;
  return {
    get basename() {
      return context.basename;
    },
    get future() {
      return {
        v8_middleware: false,
        ...opts?.future
      };
    },
    get state() {
      return {
        historyAction: "POP",
        location: context.location,
        matches,
        loaderData: context.loaderData,
        actionData: context.actionData,
        errors: context.errors,
        initialized: true,
        navigation: IDLE_NAVIGATION,
        restoreScrollPosition: null,
        preventScrollReset: false,
        revalidation: "idle",
        fetchers: /* @__PURE__ */ new Map(),
        blockers: /* @__PURE__ */ new Map()
      };
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return void 0;
    },
    initialize() {
      throw msg("initialize");
    },
    subscribe() {
      throw msg("subscribe");
    },
    enableScrollRestoration() {
      throw msg("enableScrollRestoration");
    },
    navigate() {
      throw msg("navigate");
    },
    fetch() {
      throw msg("fetch");
    },
    revalidate() {
      throw msg("revalidate");
    },
    createHref,
    encodeLocation,
    getFetcher() {
      return IDLE_FETCHER;
    },
    deleteFetcher() {
      throw msg("deleteFetcher");
    },
    resetFetcher() {
      throw msg("resetFetcher");
    },
    dispose() {
      throw msg("dispose");
    },
    getBlocker() {
      return IDLE_BLOCKER;
    },
    deleteBlocker() {
      throw msg("deleteBlocker");
    },
    patchRoutes() {
      throw msg("patchRoutes");
    },
    _internalFetchControllers: /* @__PURE__ */ new Map(),
    _internalSetRoutes() {
      throw msg("_internalSetRoutes");
    },
    _internalSetStateDoNotUseOrYouWillBreakYourApp() {
      throw msg("_internalSetStateDoNotUseOrYouWillBreakYourApp");
    }
  };
}
function createHref(to) {
  return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
  let href2 = typeof to === "string" ? to : createPath(to);
  href2 = href2.replace(/ $/, "%20");
  let encoded = ABSOLUTE_URL_REGEX3.test(href2) ? new URL(href2) : new URL(href2, "http://localhost");
  return {
    pathname: encoded.pathname,
    search: encoded.search,
    hash: encoded.hash
  };
}
var ABSOLUTE_URL_REGEX3 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var ESCAPE_LOOKUP2 = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var ESCAPE_REGEX2 = /[&><\u2028\u2029]/g;
function htmlEscape(str) {
  return str.replace(ESCAPE_REGEX2, (match) => ESCAPE_LOOKUP2[match]);
}
var dist = {};
var hasRequiredDist$1;
function requireDist$1() {
  if (hasRequiredDist$1) return dist;
  hasRequiredDist$1 = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.parseCookie = parseCookie;
  dist.parse = parseCookie;
  dist.stringifyCookie = stringifyCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  dist.parseSetCookie = parseSetCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
  const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
  const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  const maxAgeRegExp = /^-?\d+$/;
  const __toString = Object.prototype.toString;
  const NullObject = /* @__PURE__ */ (() => {
    const C = function() {
    };
    C.prototype = /* @__PURE__ */ Object.create(null);
    return C;
  })();
  function parseCookie(str, options) {
    const obj = new NullObject();
    const len = str.length;
    if (len < 2)
      return obj;
    const dec = options?.decode || decode2;
    let index = 0;
    do {
      const eqIdx = eqIndex(str, index, len);
      if (eqIdx === -1)
        break;
      const endIdx = endIndex(str, index, len);
      if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      const key = valueSlice(str, index, eqIdx);
      if (obj[key] === void 0) {
        obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  function stringifyCookie(cookie, options) {
    const enc = options?.encode || encodeURIComponent;
    const cookieStrings = [];
    for (const name of Object.keys(cookie)) {
      const val = cookie[name];
      if (val === void 0)
        continue;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`cookie name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`cookie val is invalid: ${val}`);
      }
      cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join("; ");
  }
  function stringifySetCookie(_name, _val, _opts) {
    const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
    const options = typeof _val === "object" ? _val : _opts;
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(cookie.name)) {
      throw new TypeError(`argument name is invalid: ${cookie.name}`);
    }
    const value = cookie.value ? enc(cookie.value) : "";
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError(`argument val is invalid: ${cookie.value}`);
    }
    let str = cookie.name + "=" + value;
    if (cookie.maxAge !== void 0) {
      if (!Number.isInteger(cookie.maxAge)) {
        throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
      }
      str += "; Max-Age=" + cookie.maxAge;
    }
    if (cookie.domain) {
      if (!domainValueRegExp.test(cookie.domain)) {
        throw new TypeError(`option domain is invalid: ${cookie.domain}`);
      }
      str += "; Domain=" + cookie.domain;
    }
    if (cookie.path) {
      if (!pathValueRegExp.test(cookie.path)) {
        throw new TypeError(`option path is invalid: ${cookie.path}`);
      }
      str += "; Path=" + cookie.path;
    }
    if (cookie.expires) {
      if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
        throw new TypeError(`option expires is invalid: ${cookie.expires}`);
      }
      str += "; Expires=" + cookie.expires.toUTCString();
    }
    if (cookie.httpOnly) {
      str += "; HttpOnly";
    }
    if (cookie.secure) {
      str += "; Secure";
    }
    if (cookie.partitioned) {
      str += "; Partitioned";
    }
    if (cookie.priority) {
      const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${cookie.priority}`);
      }
    }
    if (cookie.sameSite) {
      const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
      switch (sameSite) {
        case true:
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
      }
    }
    return str;
  }
  function parseSetCookie(str, options) {
    const dec = options?.decode || decode2;
    const len = str.length;
    const endIdx = endIndex(str, 0, len);
    const eqIdx = eqIndex(str, 0, endIdx);
    const setCookie2 = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
      name: valueSlice(str, 0, eqIdx),
      value: dec(valueSlice(str, eqIdx + 1, endIdx))
    };
    let index = endIdx + 1;
    while (index < len) {
      const endIdx2 = endIndex(str, index, len);
      const eqIdx2 = eqIndex(str, index, endIdx2);
      const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
      const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
      switch (attr.toLowerCase()) {
        case "httponly":
          setCookie2.httpOnly = true;
          break;
        case "secure":
          setCookie2.secure = true;
          break;
        case "partitioned":
          setCookie2.partitioned = true;
          break;
        case "domain":
          setCookie2.domain = val;
          break;
        case "path":
          setCookie2.path = val;
          break;
        case "max-age":
          if (val && maxAgeRegExp.test(val))
            setCookie2.maxAge = Number(val);
          break;
        case "expires":
          if (!val)
            break;
          const date = new Date(val);
          if (Number.isFinite(date.valueOf()))
            setCookie2.expires = date;
          break;
        case "priority":
          if (!val)
            break;
          const priority = val.toLowerCase();
          if (priority === "low" || priority === "medium" || priority === "high") {
            setCookie2.priority = priority;
          }
          break;
        case "samesite":
          if (!val)
            break;
          const sameSite = val.toLowerCase();
          if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
            setCookie2.sameSite = sameSite;
          }
          break;
      }
      index = endIdx2 + 1;
    }
    return setCookie2;
  }
  function endIndex(str, min, len) {
    const index = str.indexOf(";", min);
    return index === -1 ? len : index;
  }
  function eqIndex(str, min, max) {
    const index = str.indexOf("=", min);
    return index < max ? index : -1;
  }
  function valueSlice(str, min, max) {
    let start = min;
    let end = max;
    do {
      const code = str.charCodeAt(start);
      if (code !== 32 && code !== 9)
        break;
    } while (++start < end);
    while (end > start) {
      const code = str.charCodeAt(end - 1);
      if (code !== 32 && code !== 9)
        break;
      end--;
    }
    return str.slice(start, end);
  }
  function decode2(str) {
    if (str.indexOf("%") === -1)
      return str;
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  return dist;
}
var distExports$1 = /* @__PURE__ */ requireDist$1();
var setCookie = { exports: {} };
var hasRequiredSetCookie;
function requireSetCookie() {
  if (hasRequiredSetCookie) return setCookie.exports;
  hasRequiredSetCookie = 1;
  var defaultParseOptions = {
    decodeValues: true,
    map: false,
    silent: false
  };
  function isForbiddenKey(key) {
    return typeof key !== "string" || key in {};
  }
  function createNullObj() {
    return /* @__PURE__ */ Object.create(null);
  }
  function isNonEmptyString(str) {
    return typeof str === "string" && !!str.trim();
  }
  function parseString(setCookieValue, options) {
    var parts = setCookieValue.split(";").filter(isNonEmptyString);
    var nameValuePairStr = parts.shift();
    var parsed = parseNameValuePair(nameValuePairStr);
    var name = parsed.name;
    var value = parsed.value;
    options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
    if (isForbiddenKey(name)) {
      return null;
    }
    try {
      value = options.decodeValues ? decodeURIComponent(value) : value;
    } catch (e) {
      console.error(
        "set-cookie-parser: failed to decode cookie value. Set options.decodeValues=false to disable decoding.",
        e
      );
    }
    var cookie = createNullObj();
    cookie.name = name;
    cookie.value = value;
    parts.forEach(function(part) {
      var sides = part.split("=");
      var key = sides.shift().trimLeft().toLowerCase();
      if (isForbiddenKey(key)) {
        return;
      }
      var value2 = sides.join("=");
      if (key === "expires") {
        cookie.expires = new Date(value2);
      } else if (key === "max-age") {
        var n = parseInt(value2, 10);
        if (!Number.isNaN(n)) cookie.maxAge = n;
      } else if (key === "secure") {
        cookie.secure = true;
      } else if (key === "httponly") {
        cookie.httpOnly = true;
      } else if (key === "samesite") {
        cookie.sameSite = value2;
      } else if (key === "partitioned") {
        cookie.partitioned = true;
      } else if (key) {
        cookie[key] = value2;
      }
    });
    return cookie;
  }
  function parseNameValuePair(nameValuePairStr) {
    var name = "";
    var value = "";
    var nameValueArr = nameValuePairStr.split("=");
    if (nameValueArr.length > 1) {
      name = nameValueArr.shift();
      value = nameValueArr.join("=");
    } else {
      value = nameValuePairStr;
    }
    return { name, value };
  }
  function parse(input, options) {
    options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
    if (!input) {
      if (!options.map) {
        return [];
      } else {
        return createNullObj();
      }
    }
    if (input.headers) {
      if (typeof input.headers.getSetCookie === "function") {
        input = input.headers.getSetCookie();
      } else if (input.headers["set-cookie"]) {
        input = input.headers["set-cookie"];
      } else {
        var sch = input.headers[Object.keys(input.headers).find(function(key) {
          return key.toLowerCase() === "set-cookie";
        })];
        if (!sch && input.headers.cookie && !options.silent) {
          console.warn(
            "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
          );
        }
        input = sch;
      }
    }
    if (!Array.isArray(input)) {
      input = [input];
    }
    if (!options.map) {
      return input.filter(isNonEmptyString).map(function(str) {
        return parseString(str, options);
      }).filter(Boolean);
    } else {
      var cookies = createNullObj();
      return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
        var cookie = parseString(str, options);
        if (cookie && !isForbiddenKey(cookie.name)) {
          cookies2[cookie.name] = cookie;
        }
        return cookies2;
      }, cookies);
    }
  }
  function splitCookiesString(cookiesString) {
    if (Array.isArray(cookiesString)) {
      return cookiesString;
    }
    if (typeof cookiesString !== "string") {
      return [];
    }
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
      while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
        pos += 1;
      }
      return pos < cookiesString.length;
    }
    function notSpecialChar() {
      ch = cookiesString.charAt(pos);
      return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while (pos < cookiesString.length) {
      start = pos;
      cookiesSeparatorFound = false;
      while (skipWhitespace()) {
        ch = cookiesString.charAt(pos);
        if (ch === ",") {
          lastComma = pos;
          pos += 1;
          skipWhitespace();
          nextStart = pos;
          while (pos < cookiesString.length && notSpecialChar()) {
            pos += 1;
          }
          if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
            cookiesSeparatorFound = true;
            pos = nextStart;
            cookiesStrings.push(cookiesString.substring(start, lastComma));
            start = pos;
          } else {
            pos = lastComma + 1;
          }
        } else {
          pos += 1;
        }
      }
      if (!cookiesSeparatorFound || pos >= cookiesString.length) {
        cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
      }
    }
    return cookiesStrings;
  }
  setCookie.exports = parse;
  setCookie.exports.parse = parse;
  setCookie.exports.parseString = parseString;
  setCookie.exports.splitCookiesString = splitCookiesString;
  return setCookie.exports;
}
var setCookieExports = /* @__PURE__ */ requireSetCookie();
function ServerRouter({
  context,
  url,
  nonce
}) {
  if (typeof url === "string") {
    url = new URL(url);
  }
  let { manifest, routeModules, criticalCss, serverHandoffString } = context;
  let routes = createServerRoutes(
    manifest.routes,
    routeModules,
    context.future,
    context.isSpaMode
  );
  context.staticHandlerContext.loaderData = {
    ...context.staticHandlerContext.loaderData
  };
  for (let match of context.staticHandlerContext.matches) {
    let routeId = match.route.id;
    let route = routeModules[routeId];
    let manifestRoute = context.manifest.routes[routeId];
    if (route && manifestRoute && shouldHydrateRouteLoader(
      routeId,
      route.clientLoader,
      manifestRoute.hasLoader,
      context.isSpaMode
    ) && (route.HydrateFallback || !manifestRoute.hasLoader)) {
      delete context.staticHandlerContext.loaderData[routeId];
    }
  }
  let router2 = createStaticRouter(routes, context.staticHandlerContext);
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(
    FrameworkContext.Provider,
    {
      value: {
        manifest,
        routeModules,
        criticalCss,
        serverHandoffString,
        future: context.future,
        ssr: context.ssr,
        isSpaMode: context.isSpaMode,
        routeDiscovery: context.routeDiscovery,
        serializeError: context.serializeError,
        renderMeta: context.renderMeta
      }
    },
    /* @__PURE__ */ React3.createElement(RemixErrorBoundary, { location: router2.state.location }, /* @__PURE__ */ React3.createElement(
      StaticRouterProvider,
      {
        router: router2,
        context: context.staticHandlerContext,
        hydrate: false
      }
    ))
  ), context.serverHandoffStream ? /* @__PURE__ */ React3.createElement(React3.Suspense, null, /* @__PURE__ */ React3.createElement(
    StreamTransfer,
    {
      context,
      identifier: 0,
      reader: context.serverHandoffStream.getReader(),
      textDecoder: new TextDecoder(),
      nonce
    }
  )) : null);
}
function createRoutesStub(routes, _context) {
  return function RoutesTestStub({
    initialEntries,
    initialIndex,
    hydrationData,
    future
  }) {
    let routerRef = React3.useRef();
    let frameworkContextRef = React3.useRef();
    if (routerRef.current == null) {
      frameworkContextRef.current = {
        future: {
          unstable_subResourceIntegrity: future?.unstable_subResourceIntegrity === true,
          v8_middleware: future?.v8_middleware === true
        },
        manifest: {
          routes: {},
          entry: { imports: [], module: "" },
          url: "",
          version: ""
        },
        routeModules: {},
        ssr: false,
        isSpaMode: false,
        routeDiscovery: { mode: "lazy", manifestPath: "/__manifest" }
      };
      let patched = processRoutes(
        // @ts-expect-error `StubRouteObject` is stricter about `loader`/`action`
        // types compared to `AgnosticRouteObject`
        convertRoutesToDataRoutes(routes, (r) => r),
        _context !== void 0 ? _context : future?.v8_middleware ? new RouterContextProvider() : {},
        frameworkContextRef.current.manifest,
        frameworkContextRef.current.routeModules
      );
      routerRef.current = createMemoryRouter(patched, {
        initialEntries,
        initialIndex,
        hydrationData
      });
    }
    return /* @__PURE__ */ React3.createElement(FrameworkContext.Provider, { value: frameworkContextRef.current }, /* @__PURE__ */ React3.createElement(RouterProvider, { router: routerRef.current }));
  };
}
function processRoutes(routes, context, manifest, routeModules, parentId) {
  return routes.map((route) => {
    if (!route.id) {
      throw new Error(
        "Expected a route.id in react-router processRoutes() function"
      );
    }
    let newRoute = {
      id: route.id,
      path: route.path,
      index: route.index,
      Component: route.Component ? withComponentProps(route.Component) : void 0,
      HydrateFallback: route.HydrateFallback ? withHydrateFallbackProps(route.HydrateFallback) : void 0,
      ErrorBoundary: route.ErrorBoundary ? withErrorBoundaryProps(route.ErrorBoundary) : void 0,
      action: route.action ? (args) => route.action({ ...args, context }) : void 0,
      loader: route.loader ? (args) => route.loader({ ...args, context }) : void 0,
      middleware: route.middleware ? route.middleware.map(
        (mw) => (...args) => mw(
          { ...args[0], context },
          args[1]
        )
      ) : void 0,
      handle: route.handle,
      shouldRevalidate: route.shouldRevalidate
    };
    let entryRoute = {
      id: route.id,
      path: route.path,
      index: route.index,
      parentId,
      hasAction: route.action != null,
      hasLoader: route.loader != null,
      // When testing routes, you should be stubbing loader/action/middleware,
      // not trying to re-implement the full loader/clientLoader/SSR/hydration
      // flow. That is better tested via E2E tests.
      hasClientAction: false,
      hasClientLoader: false,
      hasClientMiddleware: false,
      hasErrorBoundary: route.ErrorBoundary != null,
      // any need for these?
      module: "build/stub-path-to-module.js",
      clientActionModule: void 0,
      clientLoaderModule: void 0,
      clientMiddlewareModule: void 0,
      hydrateFallbackModule: void 0
    };
    manifest.routes[newRoute.id] = entryRoute;
    routeModules[route.id] = {
      default: newRoute.Component || Outlet,
      ErrorBoundary: newRoute.ErrorBoundary || void 0,
      handle: route.handle,
      links: route.links,
      meta: route.meta,
      shouldRevalidate: route.shouldRevalidate
    };
    if (route.children) {
      newRoute.children = processRoutes(
        route.children,
        context,
        manifest,
        routeModules,
        newRoute.id
      );
    }
    return newRoute;
  });
}
var encoder = /* @__PURE__ */ new TextEncoder();
var sign = async (value, secret) => {
  let data2 = encoder.encode(value);
  let key = await createKey(secret, ["sign"]);
  let signature = await crypto.subtle.sign("HMAC", key, data2);
  let hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(
    /=+$/,
    ""
  );
  return value + "." + hash;
};
var unsign = async (cookie, secret) => {
  let index = cookie.lastIndexOf(".");
  let value = cookie.slice(0, index);
  let hash = cookie.slice(index + 1);
  let data2 = encoder.encode(value);
  let key = await createKey(secret, ["verify"]);
  try {
    let signature = byteStringToUint8Array(atob(hash));
    let valid = await crypto.subtle.verify("HMAC", key, signature, data2);
    return valid ? value : false;
  } catch (error) {
    return false;
  }
};
var createKey = async (secret, usages) => crypto.subtle.importKey(
  "raw",
  encoder.encode(secret),
  { name: "HMAC", hash: "SHA-256" },
  false,
  usages
);
function byteStringToUint8Array(byteString) {
  let array = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }
  return array;
}
var createCookie = (name, cookieOptions = {}) => {
  let { secrets = [], ...options } = {
    path: "/",
    sameSite: "lax",
    ...cookieOptions
  };
  warnOnceAboutExpiresCookie(name, options.expires);
  return {
    get name() {
      return name;
    },
    get isSigned() {
      return secrets.length > 0;
    },
    get expires() {
      return typeof options.maxAge !== "undefined" ? new Date(Date.now() + options.maxAge * 1e3) : options.expires;
    },
    async parse(cookieHeader, parseOptions) {
      if (!cookieHeader) return null;
      let cookies = distExports$1.parse(cookieHeader, { ...options, ...parseOptions });
      if (name in cookies) {
        let value = cookies[name];
        if (typeof value === "string" && value !== "") {
          let decoded = await decodeCookieValue(value, secrets);
          return decoded;
        } else {
          return "";
        }
      } else {
        return null;
      }
    },
    async serialize(value, serializeOptions) {
      return distExports$1.serialize(
        name,
        value === "" ? "" : await encodeCookieValue(value, secrets),
        {
          ...options,
          ...serializeOptions
        }
      );
    }
  };
};
var isCookie = (object) => {
  return object != null && typeof object.name === "string" && typeof object.isSigned === "boolean" && typeof object.parse === "function" && typeof object.serialize === "function";
};
async function encodeCookieValue(value, secrets) {
  let encoded = encodeData(value);
  if (secrets.length > 0) {
    encoded = await sign(encoded, secrets[0]);
  }
  return encoded;
}
async function decodeCookieValue(value, secrets) {
  if (secrets.length > 0) {
    for (let secret of secrets) {
      let unsignedValue = await unsign(value, secret);
      if (unsignedValue !== false) {
        return decodeData(unsignedValue);
      }
    }
    return null;
  }
  return decodeData(value);
}
function encodeData(value) {
  return btoa(myUnescape(encodeURIComponent(JSON.stringify(value))));
}
function decodeData(value) {
  try {
    return JSON.parse(decodeURIComponent(myEscape(atob(value))));
  } catch (error) {
    return {};
  }
}
function myEscape(value) {
  let str = value.toString();
  let result = "";
  let index = 0;
  let chr, code;
  while (index < str.length) {
    chr = str.charAt(index++);
    if (/[\w*+\-./@]/.exec(chr)) {
      result += chr;
    } else {
      code = chr.charCodeAt(0);
      if (code < 256) {
        result += "%" + hex(code, 2);
      } else {
        result += "%u" + hex(code, 4).toUpperCase();
      }
    }
  }
  return result;
}
function hex(code, length) {
  let result = code.toString(16);
  while (result.length < length) result = "0" + result;
  return result;
}
function myUnescape(value) {
  let str = value.toString();
  let result = "";
  let index = 0;
  let chr, part;
  while (index < str.length) {
    chr = str.charAt(index++);
    if (chr === "%") {
      if (str.charAt(index) === "u") {
        part = str.slice(index + 1, index + 5);
        if (/^[\da-f]{4}$/i.exec(part)) {
          result += String.fromCharCode(parseInt(part, 16));
          index += 5;
          continue;
        }
      } else {
        part = str.slice(index, index + 2);
        if (/^[\da-f]{2}$/i.exec(part)) {
          result += String.fromCharCode(parseInt(part, 16));
          index += 2;
          continue;
        }
      }
    }
    result += chr;
  }
  return result;
}
function warnOnceAboutExpiresCookie(name, expires) {
  warnOnce(
    !expires,
    `The "${name}" cookie has an "expires" property set. This will cause the expires value to not be updated when the session is committed. Instead, you should set the expires value when serializing the cookie. You can use \`commitSession(session, { expires })\` if using a session storage object, or \`cookie.serialize("value", { expires })\` if you're using the cookie directly.`
  );
}
function createEntryRouteModules(manifest) {
  return Object.keys(manifest).reduce((memo, routeId) => {
    let route = manifest[routeId];
    if (route) {
      memo[routeId] = route.module;
    }
    return memo;
  }, {});
}
var ServerMode = /* @__PURE__ */ ((ServerMode2) => {
  ServerMode2["Development"] = "development";
  ServerMode2["Production"] = "production";
  ServerMode2["Test"] = "test";
  return ServerMode2;
})(ServerMode || {});
function isServerMode(value) {
  return value === "development" || value === "production" || value === "test";
}
function sanitizeError(error, serverMode) {
  if (error instanceof Error && serverMode !== "development") {
    let sanitized = new Error("Unexpected Server Error");
    sanitized.stack = void 0;
    return sanitized;
  }
  return error;
}
function sanitizeErrors(errors, serverMode) {
  return Object.entries(errors).reduce((acc, [routeId, error]) => {
    return Object.assign(acc, { [routeId]: sanitizeError(error, serverMode) });
  }, {});
}
function serializeError(error, serverMode) {
  let sanitized = sanitizeError(error, serverMode);
  return {
    message: sanitized.message,
    stack: sanitized.stack
  };
}
function serializeErrors(errors, serverMode) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (isRouteErrorResponse(val)) {
      serialized[key] = { ...val, __type: "RouteErrorResponse" };
    } else if (val instanceof Error) {
      let sanitized = sanitizeError(val, serverMode);
      serialized[key] = {
        message: sanitized.message,
        stack: sanitized.stack,
        __type: "Error",
        // If this is a subclass (i.e., ReferenceError), send up the type so we
        // can re-create the same type during hydration.  This will only apply
        // in dev mode since all production errors are sanitized to normal
        // Error instances
        ...sanitized.name !== "Error" ? {
          __subType: sanitized.name
        } : {}
      };
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
function matchServerRoutes(routes, pathname, basename) {
  let matches = matchRoutes(
    routes,
    pathname,
    basename
  );
  if (!matches) return null;
  return matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: match.route
  }));
}
async function callRouteHandler(handler, args) {
  let result = await handler({
    request: stripRoutesParam(stripIndexParam(args.request)),
    params: args.params,
    context: args.context,
    unstable_pattern: args.unstable_pattern
  });
  if (isDataWithResponseInit(result) && result.init && result.init.status && isRedirectStatusCode(result.init.status)) {
    throw new Response(null, result.init);
  }
  return result;
}
function stripIndexParam(request) {
  let url = new URL(request.url);
  let indexValues = url.searchParams.getAll("index");
  url.searchParams.delete("index");
  let indexValuesToKeep = [];
  for (let indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }
  for (let toKeep of indexValuesToKeep) {
    url.searchParams.append("index", toKeep);
  }
  let init2 = {
    method: request.method,
    body: request.body,
    headers: request.headers,
    signal: request.signal
  };
  if (init2.body) {
    init2.duplex = "half";
  }
  return new Request(url.href, init2);
}
function stripRoutesParam(request) {
  let url = new URL(request.url);
  url.searchParams.delete("_routes");
  let init2 = {
    method: request.method,
    body: request.body,
    headers: request.headers,
    signal: request.signal
  };
  if (init2.body) {
    init2.duplex = "half";
  }
  return new Request(url.href, init2);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    console.error(
      "The following error is a bug in React Router; please open an issue! https://github.com/remix-run/react-router/issues/new/choose"
    );
    throw new Error(message);
  }
}
var globalDevServerHooksKey = "__reactRouterDevServerHooks";
function setDevServerHooks(devServerHooks) {
  globalThis[globalDevServerHooksKey] = devServerHooks;
}
function getDevServerHooks() {
  return globalThis[globalDevServerHooksKey];
}
function getBuildTimeHeader(request, headerName) {
  if (typeof process !== "undefined") {
    try {
      if (process.env?.IS_RR_BUILD_REQUEST === "yes") {
        return request.headers.get(headerName);
      }
    } catch (e) {
    }
  }
  return null;
}
function groupRoutesByParentId(manifest) {
  let routes = {};
  Object.values(manifest).forEach((route) => {
    if (route) {
      let parentId = route.parentId || "";
      if (!routes[parentId]) {
        routes[parentId] = [];
      }
      routes[parentId].push(route);
    }
  });
  return routes;
}
function createRoutes(manifest, parentId = "", routesByParentId = groupRoutesByParentId(manifest)) {
  return (routesByParentId[parentId] || []).map((route) => ({
    ...route,
    children: createRoutes(manifest, route.id, routesByParentId)
  }));
}
function createStaticHandlerDataRoutes(manifest, future, parentId = "", routesByParentId = groupRoutesByParentId(manifest)) {
  return (routesByParentId[parentId] || []).map((route) => {
    let commonRoute = {
      // Always include root due to default boundaries
      hasErrorBoundary: route.id === "root" || route.module.ErrorBoundary != null,
      id: route.id,
      path: route.path,
      middleware: route.module.middleware,
      // Need to use RR's version in the param typed here to permit the optional
      // context even though we know it'll always be provided in remix
      loader: route.module.loader ? async (args) => {
        let preRenderedData = getBuildTimeHeader(
          args.request,
          "X-React-Router-Prerender-Data"
        );
        if (preRenderedData != null) {
          let encoded = preRenderedData ? decodeURI(preRenderedData) : preRenderedData;
          invariant(encoded, "Missing prerendered data for route");
          let uint8array = new TextEncoder().encode(encoded);
          let stream = new ReadableStream({
            start(controller) {
              controller.enqueue(uint8array);
              controller.close();
            }
          });
          let decoded = await decodeViaTurboStream(stream, global);
          let data2 = decoded.value;
          if (data2 && SingleFetchRedirectSymbol in data2) {
            let result = data2[SingleFetchRedirectSymbol];
            let init2 = { status: result.status };
            if (result.reload) {
              throw redirectDocument(result.redirect, init2);
            } else if (result.replace) {
              throw replace(result.redirect, init2);
            } else {
              throw redirect(result.redirect, init2);
            }
          } else {
            invariant(
              data2 && route.id in data2,
              "Unable to decode prerendered data"
            );
            let result = data2[route.id];
            invariant(
              "data" in result,
              "Unable to process prerendered data"
            );
            return result.data;
          }
        }
        let val = await callRouteHandler(route.module.loader, args);
        return val;
      } : void 0,
      action: route.module.action ? (args) => callRouteHandler(route.module.action, args) : void 0,
      handle: route.module.handle
    };
    return route.index ? {
      index: true,
      ...commonRoute
    } : {
      caseSensitive: route.caseSensitive,
      children: createStaticHandlerDataRoutes(
        manifest,
        future,
        route.id,
        routesByParentId
      ),
      ...commonRoute
    };
  });
}
function createServerHandoffString(serverHandoff) {
  return escapeHtml(JSON.stringify(serverHandoff));
}
function getDocumentHeaders(context, build) {
  return getDocumentHeadersImpl(context, (m) => {
    let route = build.routes[m.route.id];
    invariant(route, `Route with id "${m.route.id}" not found in build`);
    return route.module.headers;
  });
}
function getDocumentHeadersImpl(context, getRouteHeadersFn, _defaultHeaders) {
  let boundaryIdx = context.errors ? context.matches.findIndex((m) => context.errors[m.route.id]) : -1;
  let matches = boundaryIdx >= 0 ? context.matches.slice(0, boundaryIdx + 1) : context.matches;
  let errorHeaders;
  if (boundaryIdx >= 0) {
    let { actionHeaders, actionData, loaderHeaders, loaderData } = context;
    context.matches.slice(boundaryIdx).some((match) => {
      let id = match.route.id;
      if (actionHeaders[id] && (!actionData || !actionData.hasOwnProperty(id))) {
        errorHeaders = actionHeaders[id];
      } else if (loaderHeaders[id] && !loaderData.hasOwnProperty(id)) {
        errorHeaders = loaderHeaders[id];
      }
      return errorHeaders != null;
    });
  }
  const defaultHeaders = new Headers(_defaultHeaders);
  return matches.reduce((parentHeaders, match, idx) => {
    let { id } = match.route;
    let loaderHeaders = context.loaderHeaders[id] || new Headers();
    let actionHeaders = context.actionHeaders[id] || new Headers();
    let includeErrorHeaders = errorHeaders != null && idx === matches.length - 1;
    let includeErrorCookies = includeErrorHeaders && errorHeaders !== loaderHeaders && errorHeaders !== actionHeaders;
    let headersFn = getRouteHeadersFn(match);
    if (headersFn == null) {
      let headers2 = new Headers(parentHeaders);
      if (includeErrorCookies) {
        prependCookies(errorHeaders, headers2);
      }
      prependCookies(actionHeaders, headers2);
      prependCookies(loaderHeaders, headers2);
      return headers2;
    }
    let headers = new Headers(
      typeof headersFn === "function" ? headersFn({
        loaderHeaders,
        parentHeaders,
        actionHeaders,
        errorHeaders: includeErrorHeaders ? errorHeaders : void 0
      }) : headersFn
    );
    if (includeErrorCookies) {
      prependCookies(errorHeaders, headers);
    }
    prependCookies(actionHeaders, headers);
    prependCookies(loaderHeaders, headers);
    prependCookies(parentHeaders, headers);
    return headers;
  }, new Headers(defaultHeaders));
}
function prependCookies(parentHeaders, childHeaders) {
  let parentSetCookieString = parentHeaders.get("Set-Cookie");
  if (parentSetCookieString) {
    let cookies = setCookieExports.splitCookiesString(parentSetCookieString);
    let childCookies = new Set(childHeaders.getSetCookie());
    cookies.forEach((cookie) => {
      if (!childCookies.has(cookie)) {
        childHeaders.append("Set-Cookie", cookie);
      }
    });
  }
}
var SERVER_NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([
  ...NO_BODY_STATUS_CODES,
  304
]);
async function singleFetchAction(build, serverMode, staticHandler, request, handlerUrl, loadContext, handleError) {
  try {
    let handlerRequest = new Request(handlerUrl, {
      method: request.method,
      body: request.body,
      headers: request.headers,
      signal: request.signal,
      ...request.body ? { duplex: "half" } : void 0
    });
    let result = await staticHandler.query(handlerRequest, {
      requestContext: loadContext,
      skipLoaderErrorBubbling: true,
      skipRevalidation: true,
      generateMiddlewareResponse: build.future.v8_middleware ? async (query) => {
        try {
          let innerResult = await query(handlerRequest);
          return handleQueryResult(innerResult);
        } catch (error) {
          return handleQueryError(error);
        }
      } : void 0
    });
    return handleQueryResult(result);
  } catch (error) {
    return handleQueryError(error);
  }
  function handleQueryResult(result) {
    return isResponse(result) ? result : staticContextToResponse(result);
  }
  function handleQueryError(error) {
    handleError(error);
    return generateSingleFetchResponse(request, build, serverMode, {
      result: { error },
      headers: new Headers(),
      status: 500
    });
  }
  function staticContextToResponse(context) {
    let headers = getDocumentHeaders(context, build);
    if (isRedirectStatusCode(context.statusCode) && headers.has("Location")) {
      return new Response(null, { status: context.statusCode, headers });
    }
    if (context.errors) {
      Object.values(context.errors).forEach((err) => {
        if (!isRouteErrorResponse(err) || err.error) {
          handleError(err);
        }
      });
      context.errors = sanitizeErrors(context.errors, serverMode);
    }
    let singleFetchResult;
    if (context.errors) {
      singleFetchResult = { error: Object.values(context.errors)[0] };
    } else {
      singleFetchResult = {
        data: Object.values(context.actionData || {})[0]
      };
    }
    return generateSingleFetchResponse(request, build, serverMode, {
      result: singleFetchResult,
      headers,
      status: context.statusCode
    });
  }
}
async function singleFetchLoaders(build, serverMode, staticHandler, request, handlerUrl, loadContext, handleError) {
  let routesParam = new URL(request.url).searchParams.get("_routes");
  let loadRouteIds = routesParam ? new Set(routesParam.split(",")) : null;
  try {
    let handlerRequest = new Request(handlerUrl, {
      headers: request.headers,
      signal: request.signal
    });
    let result = await staticHandler.query(handlerRequest, {
      requestContext: loadContext,
      filterMatchesToLoad: (m) => !loadRouteIds || loadRouteIds.has(m.route.id),
      skipLoaderErrorBubbling: true,
      generateMiddlewareResponse: build.future.v8_middleware ? async (query) => {
        try {
          let innerResult = await query(handlerRequest);
          return handleQueryResult(innerResult);
        } catch (error) {
          return handleQueryError(error);
        }
      } : void 0
    });
    return handleQueryResult(result);
  } catch (error) {
    return handleQueryError(error);
  }
  function handleQueryResult(result) {
    return isResponse(result) ? result : staticContextToResponse(result);
  }
  function handleQueryError(error) {
    handleError(error);
    return generateSingleFetchResponse(request, build, serverMode, {
      result: { error },
      headers: new Headers(),
      status: 500
    });
  }
  function staticContextToResponse(context) {
    let headers = getDocumentHeaders(context, build);
    if (isRedirectStatusCode(context.statusCode) && headers.has("Location")) {
      return new Response(null, { status: context.statusCode, headers });
    }
    if (context.errors) {
      Object.values(context.errors).forEach((err) => {
        if (!isRouteErrorResponse(err) || err.error) {
          handleError(err);
        }
      });
      context.errors = sanitizeErrors(context.errors, serverMode);
    }
    let results = {};
    let loadedMatches = new Set(
      context.matches.filter(
        (m) => loadRouteIds ? loadRouteIds.has(m.route.id) : m.route.loader != null
      ).map((m) => m.route.id)
    );
    if (context.errors) {
      for (let [id, error] of Object.entries(context.errors)) {
        results[id] = { error };
      }
    }
    for (let [id, data2] of Object.entries(context.loaderData)) {
      if (!(id in results) && loadedMatches.has(id)) {
        results[id] = { data: data2 };
      }
    }
    return generateSingleFetchResponse(request, build, serverMode, {
      result: results,
      headers,
      status: context.statusCode
    });
  }
}
function generateSingleFetchResponse(request, build, serverMode, {
  result,
  headers,
  status
}) {
  let resultHeaders = new Headers(headers);
  resultHeaders.set("X-Remix-Response", "yes");
  if (SERVER_NO_BODY_STATUS_CODES.has(status)) {
    return new Response(null, { status, headers: resultHeaders });
  }
  resultHeaders.set("Content-Type", "text/x-script");
  resultHeaders.delete("Content-Length");
  return new Response(
    encodeViaTurboStream(
      result,
      request.signal,
      build.entry.module.streamTimeout,
      serverMode
    ),
    {
      status: status || 200,
      headers: resultHeaders
    }
  );
}
function generateSingleFetchRedirectResponse(redirectResponse, request, build, serverMode) {
  let redirect2 = getSingleFetchRedirect(
    redirectResponse.status,
    redirectResponse.headers,
    build.basename
  );
  let headers = new Headers(redirectResponse.headers);
  headers.delete("Location");
  headers.set("Content-Type", "text/x-script");
  return generateSingleFetchResponse(request, build, serverMode, {
    result: request.method === "GET" ? { [SingleFetchRedirectSymbol]: redirect2 } : redirect2,
    headers,
    status: SINGLE_FETCH_REDIRECT_STATUS
  });
}
function getSingleFetchRedirect(status, headers, basename) {
  let redirect2 = headers.get("Location");
  if (basename) {
    redirect2 = stripBasename(redirect2, basename) || redirect2;
  }
  return {
    redirect: redirect2,
    status,
    revalidate: (
      // Technically X-Remix-Revalidate isn't needed here - that was an implementation
      // detail of ?_data requests as our way to tell the front end to revalidate when
      // we didn't have a response body to include that information in.
      // With single fetch, we tell the front end via this revalidate boolean field.
      // However, we're respecting it for now because it may be something folks have
      // used in their own responses
      // TODO(v3): Consider removing or making this official public API
      headers.has("X-Remix-Revalidate") || headers.has("Set-Cookie")
    ),
    reload: headers.has("X-Remix-Reload-Document"),
    replace: headers.has("X-Remix-Replace")
  };
}
function encodeViaTurboStream(data2, requestSignal, streamTimeout, serverMode) {
  let controller = new AbortController();
  let timeoutId = setTimeout(
    () => controller.abort(new Error("Server Timeout")),
    typeof streamTimeout === "number" ? streamTimeout : 4950
  );
  requestSignal.addEventListener("abort", () => clearTimeout(timeoutId));
  return encode(data2, {
    signal: controller.signal,
    plugins: [
      (value) => {
        if (value instanceof Error) {
          let { name, message, stack } = serverMode === "production" ? sanitizeError(value, serverMode) : value;
          return ["SanitizedError", name, message, stack];
        }
        if (value instanceof ErrorResponseImpl) {
          let { data: data3, status, statusText } = value;
          return ["ErrorResponse", data3, status, statusText];
        }
        if (value && typeof value === "object" && SingleFetchRedirectSymbol in value) {
          return ["SingleFetchRedirect", value[SingleFetchRedirectSymbol]];
        }
      }
    ],
    postPlugins: [
      (value) => {
        if (!value) return;
        if (typeof value !== "object") return;
        return [
          "SingleFetchClassInstance",
          Object.fromEntries(Object.entries(value))
        ];
      },
      () => ["SingleFetchFallback"]
    ]
  });
}
function derive(build, mode) {
  let routes = createRoutes(build.routes);
  let dataRoutes = createStaticHandlerDataRoutes(build.routes, build.future);
  let serverMode = isServerMode(mode) ? mode : "production";
  let staticHandler = createStaticHandler(dataRoutes, {
    basename: build.basename,
    unstable_instrumentations: build.entry.module.unstable_instrumentations
  });
  let errorHandler = build.entry.module.handleError || ((error, { request }) => {
    if (serverMode !== "test" && !request.signal.aborted) {
      console.error(
        // @ts-expect-error This is "private" from users but intended for internal use
        isRouteErrorResponse(error) && error.error ? error.error : error
      );
    }
  });
  let requestHandler = async (request, initialContext) => {
    let params = {};
    let loadContext;
    let handleError = (error) => {
      if (mode === "development") {
        getDevServerHooks()?.processRequestError?.(error);
      }
      errorHandler(error, {
        context: loadContext,
        params,
        request
      });
    };
    if (build.future.v8_middleware) {
      if (initialContext && !(initialContext instanceof RouterContextProvider)) {
        let error = new Error(
          "Invalid `context` value provided to `handleRequest`. When middleware is enabled you must return an instance of `RouterContextProvider` from your `getLoadContext` function."
        );
        handleError(error);
        return returnLastResortErrorResponse(error, serverMode);
      }
      loadContext = initialContext || new RouterContextProvider();
    } else {
      loadContext = initialContext || {};
    }
    let url = new URL(request.url);
    let normalizedBasename = build.basename || "/";
    let normalizedPath = url.pathname;
    if (stripBasename(normalizedPath, normalizedBasename) === "/_root.data") {
      normalizedPath = normalizedBasename;
    } else if (normalizedPath.endsWith(".data")) {
      normalizedPath = normalizedPath.replace(/\.data$/, "");
    }
    if (stripBasename(normalizedPath, normalizedBasename) !== "/" && normalizedPath.endsWith("/")) {
      normalizedPath = normalizedPath.slice(0, -1);
    }
    let isSpaMode = getBuildTimeHeader(request, "X-React-Router-SPA-Mode") === "yes";
    if (!build.ssr) {
      let decodedPath = decodeURI(normalizedPath);
      if (normalizedBasename !== "/") {
        let strippedPath = stripBasename(decodedPath, normalizedBasename);
        if (strippedPath == null) {
          errorHandler(
            new ErrorResponseImpl(
              404,
              "Not Found",
              `Refusing to prerender the \`${decodedPath}\` path because it does not start with the basename \`${normalizedBasename}\``
            ),
            {
              context: loadContext,
              params,
              request
            }
          );
          return new Response("Not Found", {
            status: 404,
            statusText: "Not Found"
          });
        }
        decodedPath = strippedPath;
      }
      if (build.prerender.length === 0) {
        isSpaMode = true;
      } else if (!build.prerender.includes(decodedPath) && !build.prerender.includes(decodedPath + "/")) {
        if (url.pathname.endsWith(".data")) {
          errorHandler(
            new ErrorResponseImpl(
              404,
              "Not Found",
              `Refusing to SSR the path \`${decodedPath}\` because \`ssr:false\` is set and the path is not included in the \`prerender\` config, so in production the path will be a 404.`
            ),
            {
              context: loadContext,
              params,
              request
            }
          );
          return new Response("Not Found", {
            status: 404,
            statusText: "Not Found"
          });
        } else {
          isSpaMode = true;
        }
      }
    }
    let manifestUrl = getManifestPath(
      build.routeDiscovery.manifestPath,
      normalizedBasename
    );
    if (url.pathname === manifestUrl) {
      try {
        let res = await handleManifestRequest(build, routes, url);
        return res;
      } catch (e) {
        handleError(e);
        return new Response("Unknown Server Error", { status: 500 });
      }
    }
    let matches = matchServerRoutes(routes, normalizedPath, build.basename);
    if (matches && matches.length > 0) {
      Object.assign(params, matches[0].params);
    }
    let response;
    if (url.pathname.endsWith(".data")) {
      let handlerUrl = new URL(request.url);
      handlerUrl.pathname = normalizedPath;
      let singleFetchMatches = matchServerRoutes(
        routes,
        handlerUrl.pathname,
        build.basename
      );
      response = await handleSingleFetchRequest(
        serverMode,
        build,
        staticHandler,
        request,
        handlerUrl,
        loadContext,
        handleError
      );
      if (isRedirectResponse(response)) {
        response = generateSingleFetchRedirectResponse(
          response,
          request,
          build,
          serverMode
        );
      }
      if (build.entry.module.handleDataRequest) {
        response = await build.entry.module.handleDataRequest(response, {
          context: loadContext,
          params: singleFetchMatches ? singleFetchMatches[0].params : {},
          request
        });
        if (isRedirectResponse(response)) {
          response = generateSingleFetchRedirectResponse(
            response,
            request,
            build,
            serverMode
          );
        }
      }
    } else if (!isSpaMode && matches && matches[matches.length - 1].route.module.default == null && matches[matches.length - 1].route.module.ErrorBoundary == null) {
      response = await handleResourceRequest(
        serverMode,
        build,
        staticHandler,
        matches.slice(-1)[0].route.id,
        request,
        loadContext,
        handleError
      );
    } else {
      let { pathname } = url;
      let criticalCss = void 0;
      if (build.unstable_getCriticalCss) {
        criticalCss = await build.unstable_getCriticalCss({ pathname });
      } else if (mode === "development" && getDevServerHooks()?.getCriticalCss) {
        criticalCss = await getDevServerHooks()?.getCriticalCss?.(pathname);
      }
      response = await handleDocumentRequest(
        serverMode,
        build,
        staticHandler,
        request,
        loadContext,
        handleError,
        isSpaMode,
        criticalCss
      );
    }
    if (request.method === "HEAD") {
      return new Response(null, {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  };
  if (build.entry.module.unstable_instrumentations) {
    requestHandler = instrumentHandler(
      requestHandler,
      build.entry.module.unstable_instrumentations.map((i) => i.handler).filter(Boolean)
    );
  }
  return {
    routes,
    dataRoutes,
    serverMode,
    staticHandler,
    errorHandler,
    requestHandler
  };
}
var createRequestHandler = (build, mode) => {
  let _build;
  let routes;
  let serverMode;
  let staticHandler;
  let errorHandler;
  let _requestHandler;
  return async function requestHandler(request, initialContext) {
    _build = typeof build === "function" ? await build() : build;
    if (typeof build === "function") {
      let derived = derive(_build, mode);
      routes = derived.routes;
      serverMode = derived.serverMode;
      staticHandler = derived.staticHandler;
      errorHandler = derived.errorHandler;
      _requestHandler = derived.requestHandler;
    } else if (!routes || !serverMode || !staticHandler || !errorHandler || !_requestHandler) {
      let derived = derive(_build, mode);
      routes = derived.routes;
      serverMode = derived.serverMode;
      staticHandler = derived.staticHandler;
      errorHandler = derived.errorHandler;
      _requestHandler = derived.requestHandler;
    }
    return _requestHandler(request, initialContext);
  };
};
async function handleManifestRequest(build, routes, url) {
  if (build.assets.version !== url.searchParams.get("version")) {
    return new Response(null, {
      status: 204,
      headers: {
        "X-Remix-Reload-Document": "true"
      }
    });
  }
  let patches = {};
  if (url.searchParams.has("paths")) {
    let paths = /* @__PURE__ */ new Set();
    let pathParam = url.searchParams.get("paths") || "";
    let requestedPaths = pathParam.split(",").filter(Boolean);
    requestedPaths.forEach((path) => {
      if (!path.startsWith("/")) {
        path = `/${path}`;
      }
      let segments = path.split("/").slice(1);
      segments.forEach((_, i) => {
        let partialPath = segments.slice(0, i + 1).join("/");
        paths.add(`/${partialPath}`);
      });
    });
    for (let path of paths) {
      let matches = matchServerRoutes(routes, path, build.basename);
      if (matches) {
        for (let match of matches) {
          let routeId = match.route.id;
          let route = build.assets.routes[routeId];
          if (route) {
            patches[routeId] = route;
          }
        }
      }
    }
    return Response.json(patches, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  }
  return new Response("Invalid Request", { status: 400 });
}
async function handleSingleFetchRequest(serverMode, build, staticHandler, request, handlerUrl, loadContext, handleError) {
  let response = request.method !== "GET" ? await singleFetchAction(
    build,
    serverMode,
    staticHandler,
    request,
    handlerUrl,
    loadContext,
    handleError
  ) : await singleFetchLoaders(
    build,
    serverMode,
    staticHandler,
    request,
    handlerUrl,
    loadContext,
    handleError
  );
  return response;
}
async function handleDocumentRequest(serverMode, build, staticHandler, request, loadContext, handleError, isSpaMode, criticalCss) {
  try {
    let result = await staticHandler.query(request, {
      requestContext: loadContext,
      generateMiddlewareResponse: build.future.v8_middleware ? async (query) => {
        try {
          let innerResult = await query(request);
          if (!isResponse(innerResult)) {
            innerResult = await renderHtml(innerResult, isSpaMode);
          }
          return innerResult;
        } catch (error) {
          handleError(error);
          return new Response(null, { status: 500 });
        }
      } : void 0
    });
    if (!isResponse(result)) {
      result = await renderHtml(result, isSpaMode);
    }
    return result;
  } catch (error) {
    handleError(error);
    return new Response(null, { status: 500 });
  }
  async function renderHtml(context, isSpaMode2) {
    let headers = getDocumentHeaders(context, build);
    if (SERVER_NO_BODY_STATUS_CODES.has(context.statusCode)) {
      return new Response(null, { status: context.statusCode, headers });
    }
    if (context.errors) {
      Object.values(context.errors).forEach((err) => {
        if (!isRouteErrorResponse(err) || err.error) {
          handleError(err);
        }
      });
      context.errors = sanitizeErrors(context.errors, serverMode);
    }
    let state = {
      loaderData: context.loaderData,
      actionData: context.actionData,
      errors: serializeErrors(context.errors, serverMode)
    };
    let baseServerHandoff = {
      basename: build.basename,
      future: build.future,
      routeDiscovery: build.routeDiscovery,
      ssr: build.ssr,
      isSpaMode: isSpaMode2
    };
    let entryContext = {
      manifest: build.assets,
      routeModules: createEntryRouteModules(build.routes),
      staticHandlerContext: context,
      criticalCss,
      serverHandoffString: createServerHandoffString({
        ...baseServerHandoff,
        criticalCss
      }),
      serverHandoffStream: encodeViaTurboStream(
        state,
        request.signal,
        build.entry.module.streamTimeout,
        serverMode
      ),
      renderMeta: {},
      future: build.future,
      ssr: build.ssr,
      routeDiscovery: build.routeDiscovery,
      isSpaMode: isSpaMode2,
      serializeError: (err) => serializeError(err, serverMode)
    };
    let handleDocumentRequestFunction = build.entry.module.default;
    try {
      return await handleDocumentRequestFunction(
        request,
        context.statusCode,
        headers,
        entryContext,
        loadContext
      );
    } catch (error) {
      handleError(error);
      let errorForSecondRender = error;
      if (isResponse(error)) {
        try {
          let data2 = await unwrapResponse(error);
          errorForSecondRender = new ErrorResponseImpl(
            error.status,
            error.statusText,
            data2
          );
        } catch (e) {
        }
      }
      context = getStaticContextFromError(
        staticHandler.dataRoutes,
        context,
        errorForSecondRender
      );
      if (context.errors) {
        context.errors = sanitizeErrors(context.errors, serverMode);
      }
      let state2 = {
        loaderData: context.loaderData,
        actionData: context.actionData,
        errors: serializeErrors(context.errors, serverMode)
      };
      entryContext = {
        ...entryContext,
        staticHandlerContext: context,
        serverHandoffString: createServerHandoffString(baseServerHandoff),
        serverHandoffStream: encodeViaTurboStream(
          state2,
          request.signal,
          build.entry.module.streamTimeout,
          serverMode
        ),
        renderMeta: {}
      };
      try {
        return await handleDocumentRequestFunction(
          request,
          context.statusCode,
          headers,
          entryContext,
          loadContext
        );
      } catch (error2) {
        handleError(error2);
        return returnLastResortErrorResponse(error2, serverMode);
      }
    }
  }
}
async function handleResourceRequest(serverMode, build, staticHandler, routeId, request, loadContext, handleError) {
  try {
    let result = await staticHandler.queryRoute(request, {
      routeId,
      requestContext: loadContext,
      generateMiddlewareResponse: build.future.v8_middleware ? async (queryRoute) => {
        try {
          let innerResult = await queryRoute(request);
          return handleQueryRouteResult(innerResult);
        } catch (error) {
          return handleQueryRouteError(error);
        }
      } : void 0
    });
    return handleQueryRouteResult(result);
  } catch (error) {
    return handleQueryRouteError(error);
  }
  function handleQueryRouteResult(result) {
    if (isResponse(result)) {
      return result;
    }
    if (typeof result === "string") {
      return new Response(result);
    }
    return Response.json(result);
  }
  function handleQueryRouteError(error) {
    if (isResponse(error)) {
      return error;
    }
    if (isRouteErrorResponse(error)) {
      handleError(error);
      return errorResponseToJson(error, serverMode);
    }
    if (error instanceof Error && error.message === "Expected a response from queryRoute") {
      let newError = new Error(
        "Expected a Response to be returned from resource route handler"
      );
      handleError(newError);
      return returnLastResortErrorResponse(newError, serverMode);
    }
    handleError(error);
    return returnLastResortErrorResponse(error, serverMode);
  }
}
function errorResponseToJson(errorResponse, serverMode) {
  return Response.json(
    serializeError(
      // @ts-expect-error This is "private" from users but intended for internal use
      errorResponse.error || new Error("Unexpected Server Error"),
      serverMode
    ),
    {
      status: errorResponse.status,
      statusText: errorResponse.statusText
    }
  );
}
function returnLastResortErrorResponse(error, serverMode) {
  let message = "Unexpected Server Error";
  if (serverMode !== "production") {
    message += `

${String(error)}`;
  }
  return new Response(message, {
    status: 500,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
function unwrapResponse(response) {
  let contentType = response.headers.get("Content-Type");
  return contentType && /\bapplication\/json\b/.test(contentType) ? response.body == null ? null : response.json() : response.text();
}
function flash(name) {
  return `__flash_${name}__`;
}
var createSession = (initialData = {}, id = "") => {
  let map = new Map(Object.entries(initialData));
  return {
    get id() {
      return id;
    },
    get data() {
      return Object.fromEntries(map);
    },
    has(name) {
      return map.has(name) || map.has(flash(name));
    },
    get(name) {
      if (map.has(name)) return map.get(name);
      let flashName = flash(name);
      if (map.has(flashName)) {
        let value = map.get(flashName);
        map.delete(flashName);
        return value;
      }
      return void 0;
    },
    set(name, value) {
      map.set(name, value);
    },
    flash(name, value) {
      map.set(flash(name), value);
    },
    unset(name) {
      map.delete(name);
    }
  };
};
var isSession = (object) => {
  return object != null && typeof object.id === "string" && typeof object.data !== "undefined" && typeof object.has === "function" && typeof object.get === "function" && typeof object.set === "function" && typeof object.flash === "function" && typeof object.unset === "function";
};
function createSessionStorage({
  cookie: cookieArg,
  createData,
  readData,
  updateData,
  deleteData
}) {
  let cookie = isCookie(cookieArg) ? cookieArg : createCookie(cookieArg?.name || "__session", cookieArg);
  warnOnceAboutSigningSessionCookie(cookie);
  return {
    async getSession(cookieHeader, options) {
      let id = cookieHeader && await cookie.parse(cookieHeader, options);
      let data2 = id && await readData(id);
      return createSession(data2 || {}, id || "");
    },
    async commitSession(session, options) {
      let { id, data: data2 } = session;
      let expires = options?.maxAge != null ? new Date(Date.now() + options.maxAge * 1e3) : options?.expires != null ? options.expires : cookie.expires;
      if (id) {
        await updateData(id, data2, expires);
      } else {
        id = await createData(data2, expires);
      }
      return cookie.serialize(id, options);
    },
    async destroySession(session, options) {
      await deleteData(session.id);
      return cookie.serialize("", {
        ...options,
        maxAge: void 0,
        expires: /* @__PURE__ */ new Date(0)
      });
    }
  };
}
function warnOnceAboutSigningSessionCookie(cookie) {
  warnOnce(
    cookie.isSigned,
    `The "${cookie.name}" cookie is not signed, but session cookies should be signed to prevent tampering on the client before they are sent back to the server. See https://reactrouter.com/explanation/sessions-and-cookies#signing-cookies for more information.`
  );
}
function createCookieSessionStorage({ cookie: cookieArg } = {}) {
  let cookie = isCookie(cookieArg) ? cookieArg : createCookie(cookieArg?.name || "__session", cookieArg);
  warnOnceAboutSigningSessionCookie(cookie);
  return {
    async getSession(cookieHeader, options) {
      return createSession(
        cookieHeader && await cookie.parse(cookieHeader, options) || {}
      );
    },
    async commitSession(session, options) {
      let serializedCookie = await cookie.serialize(session.data, options);
      if (serializedCookie.length > 4096) {
        throw new Error(
          "Cookie length will exceed browser maximum. Length: " + serializedCookie.length
        );
      }
      return serializedCookie;
    },
    async destroySession(_session, options) {
      return cookie.serialize("", {
        ...options,
        maxAge: void 0,
        expires: /* @__PURE__ */ new Date(0)
      });
    }
  };
}
function createMemorySessionStorage({ cookie } = {}) {
  let map = /* @__PURE__ */ new Map();
  return createSessionStorage({
    cookie,
    async createData(data2, expires) {
      let id = Math.random().toString(36).substring(2, 10);
      map.set(id, { data: data2, expires });
      return id;
    },
    async readData(id) {
      if (map.has(id)) {
        let { data: data2, expires } = map.get(id);
        if (!expires || expires > /* @__PURE__ */ new Date()) {
          return data2;
        }
        if (expires) map.delete(id);
      }
      return null;
    },
    async updateData(id, data2, expires) {
      map.set(id, { data: data2, expires });
    },
    async deleteData(id) {
      map.delete(id);
    }
  });
}
function href(path, ...args) {
  let params = args[0];
  let result = trimTrailingSplat(path).replace(
    /\/:([\w-]+)(\?)?/g,
    // same regex as in .\router\utils.ts: compilePath().
    (_, param, questionMark) => {
      const isRequired = questionMark === void 0;
      const value = params?.[param];
      if (isRequired && value === void 0) {
        throw new Error(
          `Path '${path}' requires param '${param}' but it was not provided`
        );
      }
      return value === void 0 ? "" : "/" + value;
    }
  );
  if (path.endsWith("*")) {
    const value = params?.["*"];
    if (value !== void 0) {
      result += "/" + value;
    }
  }
  return result || "/";
}
function trimTrailingSplat(path) {
  let i = path.length - 1;
  let char = path[i];
  if (char !== "*" && char !== "/") return path;
  i--;
  for (; i >= 0; i--) {
    if (path[i] !== "/") break;
  }
  return path.slice(0, i + 1);
}
var encoder2 = new TextEncoder();
var trailer = "</body></html>";
function injectRSCPayload(rscStream) {
  let decoder = new TextDecoder();
  let resolveFlightDataPromise;
  let flightDataPromise = new Promise(
    (resolve) => resolveFlightDataPromise = resolve
  );
  let startedRSC = false;
  let buffered = [];
  let timeout = null;
  function flushBufferedChunks(controller) {
    for (let chunk of buffered) {
      let buf = decoder.decode(chunk, { stream: true });
      if (buf.endsWith(trailer)) {
        buf = buf.slice(0, -trailer.length);
      }
      controller.enqueue(encoder2.encode(buf));
    }
    buffered.length = 0;
    timeout = null;
  }
  return new TransformStream({
    transform(chunk, controller) {
      buffered.push(chunk);
      if (timeout) {
        return;
      }
      timeout = setTimeout(async () => {
        flushBufferedChunks(controller);
        if (!startedRSC) {
          startedRSC = true;
          writeRSCStream(rscStream, controller).catch((err) => controller.error(err)).then(resolveFlightDataPromise);
        }
      }, 0);
    },
    async flush(controller) {
      await flightDataPromise;
      if (timeout) {
        clearTimeout(timeout);
        flushBufferedChunks(controller);
      }
      controller.enqueue(encoder2.encode("</body></html>"));
    }
  });
}
async function writeRSCStream(rscStream, controller) {
  let decoder = new TextDecoder("utf-8", { fatal: true });
  const reader = rscStream.getReader();
  try {
    let read;
    while ((read = await reader.read()) && !read.done) {
      const chunk = read.value;
      try {
        writeChunk(
          JSON.stringify(decoder.decode(chunk, { stream: true })),
          controller
        );
      } catch (err) {
        let base64 = JSON.stringify(btoa(String.fromCodePoint(...chunk)));
        writeChunk(
          `Uint8Array.from(atob(${base64}), m => m.codePointAt(0))`,
          controller
        );
      }
    }
  } finally {
    reader.releaseLock();
  }
  let remaining = decoder.decode();
  if (remaining.length) {
    writeChunk(JSON.stringify(remaining), controller);
  }
}
function writeChunk(chunk, controller) {
  controller.enqueue(
    encoder2.encode(
      `<script>${escapeScript(
        `(self.__FLIGHT_DATA||=[]).push(${chunk})`
      )}<\/script>`
    )
  );
}
function escapeScript(script) {
  return script.replace(/<!--/g, "<\\!--").replace(/<\/(script)/gi, "</\\$1");
}
var RSCRouterGlobalErrorBoundary = class extends React3__default.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, location: props.location };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location) {
      return { error: null, location: props.location };
    }
    return { error: state.error, location: state.location };
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ React3__default.createElement(
        RSCDefaultRootErrorBoundaryImpl,
        {
          error: this.state.error,
          renderAppShell: true
        }
      );
    } else {
      return this.props.children;
    }
  }
};
function ErrorWrapper({
  renderAppShell,
  title,
  children
}) {
  if (!renderAppShell) {
    return children;
  }
  return /* @__PURE__ */ React3__default.createElement("html", { lang: "en" }, /* @__PURE__ */ React3__default.createElement("head", null, /* @__PURE__ */ React3__default.createElement("meta", { charSet: "utf-8" }), /* @__PURE__ */ React3__default.createElement(
    "meta",
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1,viewport-fit=cover"
    }
  ), /* @__PURE__ */ React3__default.createElement("title", null, title)), /* @__PURE__ */ React3__default.createElement("body", null, /* @__PURE__ */ React3__default.createElement("main", { style: { fontFamily: "system-ui, sans-serif", padding: "2rem" } }, children)));
}
function RSCDefaultRootErrorBoundaryImpl({
  error,
  renderAppShell
}) {
  console.error(error);
  let heyDeveloper = /* @__PURE__ */ React3__default.createElement(
    "script",
    {
      dangerouslySetInnerHTML: {
        __html: `
        console.log(
          "💿 Hey developer 👋. You can provide a way better UX than this when your app throws errors. Check out https://reactrouter.com/how-to/error-boundary for more information."
        );
      `
      }
    }
  );
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ React3__default.createElement(
      ErrorWrapper,
      {
        renderAppShell,
        title: "Unhandled Thrown Response!"
      },
      /* @__PURE__ */ React3__default.createElement("h1", { style: { fontSize: "24px" } }, error.status, " ", error.statusText),
      heyDeveloper
    );
  }
  let errorInstance;
  if (error instanceof Error) {
    errorInstance = error;
  } else {
    let errorString = error == null ? "Unknown Error" : typeof error === "object" && "toString" in error ? error.toString() : JSON.stringify(error);
    errorInstance = new Error(errorString);
  }
  return /* @__PURE__ */ React3__default.createElement(ErrorWrapper, { renderAppShell, title: "Application Error!" }, /* @__PURE__ */ React3__default.createElement("h1", { style: { fontSize: "24px" } }, "Application Error"), /* @__PURE__ */ React3__default.createElement(
    "pre",
    {
      style: {
        padding: "2rem",
        background: "hsla(10, 50%, 50%, 0.1)",
        color: "red",
        overflow: "auto"
      }
    },
    errorInstance.stack
  ), heyDeveloper);
}
function RSCDefaultRootErrorBoundary({
  hasRootLayout
}) {
  let error = useRouteError();
  if (hasRootLayout === void 0) {
    throw new Error("Missing 'hasRootLayout' prop");
  }
  return /* @__PURE__ */ React3__default.createElement(
    RSCDefaultRootErrorBoundaryImpl,
    {
      renderAppShell: !hasRootLayout,
      error
    }
  );
}
function createRSCRouteModules(payload) {
  const routeModules = {};
  for (const match of payload.matches) {
    populateRSCRouteModules(routeModules, match);
  }
  return routeModules;
}
function populateRSCRouteModules(routeModules, matches) {
  matches = Array.isArray(matches) ? matches : [matches];
  for (const match of matches) {
    routeModules[match.id] = {
      links: match.links,
      meta: match.meta,
      default: noopComponent
    };
  }
}
var noopComponent = () => null;
var REACT_USE = "use";
var useImpl = React3[REACT_USE];
function useSafe(promise) {
  if (useImpl) {
    return useImpl(promise);
  }
  throw new Error("React Router v7 requires React 19+ for RSC features.");
}
async function routeRSCServerRequest({
  request,
  serverResponse,
  createFromReadableStream,
  renderHTML,
  hydrate: hydrate2 = true
}) {
  const url = new URL(request.url);
  const isDataRequest = isReactServerRequest(url);
  const respondWithRSCPayload = isDataRequest || isManifestRequest(url) || request.headers.has("rsc-action-id");
  if (respondWithRSCPayload || serverResponse.headers.get("React-Router-Resource") === "true") {
    return serverResponse;
  }
  if (!serverResponse.body) {
    throw new Error("Missing body in server response");
  }
  const detectRedirectResponse = serverResponse.clone();
  let serverResponseB = null;
  if (hydrate2) {
    serverResponseB = serverResponse.clone();
  }
  const body = serverResponse.body;
  let buffer;
  let streamControllers = [];
  const createStream = () => {
    if (!buffer) {
      buffer = [];
      return body.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            buffer.push(chunk);
            controller.enqueue(chunk);
            streamControllers.forEach((c) => c.enqueue(chunk));
          },
          flush() {
            streamControllers.forEach((c) => c.close());
            streamControllers = [];
          }
        })
      );
    }
    return new ReadableStream({
      start(controller) {
        buffer.forEach((chunk) => controller.enqueue(chunk));
        streamControllers.push(controller);
      }
    });
  };
  let deepestRenderedBoundaryId = null;
  const getPayload = () => {
    const payloadPromise = Promise.resolve(
      createFromReadableStream(createStream())
    );
    return Object.defineProperties(payloadPromise, {
      _deepestRenderedBoundaryId: {
        get() {
          return deepestRenderedBoundaryId;
        },
        set(boundaryId) {
          deepestRenderedBoundaryId = boundaryId;
        }
      },
      formState: {
        get() {
          return payloadPromise.then(
            (payload) => payload.type === "render" ? payload.formState : void 0
          );
        }
      }
    });
  };
  let renderRedirect;
  let renderError;
  try {
    if (!detectRedirectResponse.body) {
      throw new Error("Failed to clone server response");
    }
    const payload = await createFromReadableStream(
      detectRedirectResponse.body
    );
    if (serverResponse.status === SINGLE_FETCH_REDIRECT_STATUS && payload.type === "redirect") {
      const headers2 = new Headers(serverResponse.headers);
      headers2.delete("Content-Encoding");
      headers2.delete("Content-Length");
      headers2.delete("Content-Type");
      headers2.delete("X-Remix-Response");
      headers2.set("Location", payload.location);
      return new Response(serverResponseB?.body || "", {
        headers: headers2,
        status: payload.status,
        statusText: serverResponse.statusText
      });
    }
    let reactHeaders = new Headers();
    let status = serverResponse.status;
    let statusText = serverResponse.statusText;
    let html = await renderHTML(getPayload, {
      onError(error) {
        if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
          renderRedirect = decodeRedirectErrorDigest(error.digest);
          if (renderRedirect) {
            return error.digest;
          }
          let routeErrorResponse = decodeRouteErrorResponseDigest(error.digest);
          if (routeErrorResponse) {
            renderError = routeErrorResponse;
            status = routeErrorResponse.status;
            statusText = routeErrorResponse.statusText;
            return error.digest;
          }
        }
      },
      onHeaders(headers2) {
        for (const [key, value] of headers2) {
          reactHeaders.append(key, value);
        }
      }
    });
    const headers = new Headers(reactHeaders);
    for (const [key, value] of serverResponse.headers) {
      headers.append(key, value);
    }
    headers.set("Content-Type", "text/html; charset=utf-8");
    if (renderRedirect) {
      headers.set("Location", renderRedirect.location);
      return new Response(html, {
        status: renderRedirect.status,
        headers
      });
    }
    const redirectTransform = new TransformStream({
      flush(controller) {
        if (renderRedirect) {
          controller.enqueue(
            new TextEncoder().encode(
              `<meta http-equiv="refresh" content="0;url=${escapeHtml(renderRedirect.location)}"/>`
            )
          );
        }
      }
    });
    if (!hydrate2) {
      return new Response(html.pipeThrough(redirectTransform), {
        status,
        statusText,
        headers
      });
    }
    if (!serverResponseB?.body) {
      throw new Error("Failed to clone server response");
    }
    const body2 = html.pipeThrough(injectRSCPayload(serverResponseB.body)).pipeThrough(redirectTransform);
    return new Response(body2, {
      status,
      statusText,
      headers
    });
  } catch (reason) {
    if (reason instanceof Response) {
      return reason;
    }
    if (renderRedirect) {
      return new Response(`Redirect: ${renderRedirect.location}`, {
        status: renderRedirect.status,
        headers: {
          Location: renderRedirect.location
        }
      });
    }
    try {
      reason = renderError ?? reason;
      let [status, statusText] = isRouteErrorResponse(reason) ? [reason.status, reason.statusText] : [500, ""];
      let retryRedirect;
      let reactHeaders = new Headers();
      const html = await renderHTML(
        () => {
          const decoded = Promise.resolve(
            createFromReadableStream(createStream())
          );
          const payloadPromise = decoded.then(
            (payload) => Object.assign(payload, {
              status,
              errors: deepestRenderedBoundaryId ? {
                [deepestRenderedBoundaryId]: reason
              } : {}
            })
          );
          return Object.defineProperties(payloadPromise, {
            _deepestRenderedBoundaryId: {
              get() {
                return deepestRenderedBoundaryId;
              },
              set(boundaryId) {
                deepestRenderedBoundaryId = boundaryId;
              }
            },
            formState: {
              get() {
                return payloadPromise.then(
                  (payload) => payload.type === "render" ? payload.formState : void 0
                );
              }
            }
          });
        },
        {
          onError(error) {
            if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
              retryRedirect = decodeRedirectErrorDigest(error.digest);
              if (retryRedirect) {
                return error.digest;
              }
              let routeErrorResponse = decodeRouteErrorResponseDigest(
                error.digest
              );
              if (routeErrorResponse) {
                status = routeErrorResponse.status;
                statusText = routeErrorResponse.statusText;
                return error.digest;
              }
            }
          },
          onHeaders(headers2) {
            for (const [key, value] of headers2) {
              reactHeaders.append(key, value);
            }
          }
        }
      );
      const headers = new Headers(reactHeaders);
      for (const [key, value] of serverResponse.headers) {
        headers.append(key, value);
      }
      headers.set("Content-Type", "text/html; charset=utf-8");
      if (retryRedirect) {
        headers.set("Location", retryRedirect.location);
        return new Response(html, {
          status: retryRedirect.status,
          headers
        });
      }
      const retryRedirectTransform = new TransformStream({
        flush(controller) {
          if (retryRedirect) {
            controller.enqueue(
              new TextEncoder().encode(
                `<meta http-equiv="refresh" content="0;url=${escapeHtml(retryRedirect.location)}"/>`
              )
            );
          }
        }
      });
      if (!hydrate2) {
        return new Response(html.pipeThrough(retryRedirectTransform), {
          status,
          statusText,
          headers
        });
      }
      if (!serverResponseB?.body) {
        throw new Error("Failed to clone server response");
      }
      const body2 = html.pipeThrough(injectRSCPayload(serverResponseB.body)).pipeThrough(retryRedirectTransform);
      return new Response(body2, {
        status,
        statusText,
        headers
      });
    } catch {
    }
    throw reason;
  }
}
function RSCStaticRouter({ getPayload }) {
  const decoded = getPayload();
  const payload = useSafe(decoded);
  if (payload.type === "redirect") {
    throw new Response(null, {
      status: payload.status,
      headers: {
        Location: payload.location
      }
    });
  }
  if (payload.type !== "render") return null;
  let patchedLoaderData = { ...payload.loaderData };
  for (const match of payload.matches) {
    if (shouldHydrateRouteLoader(
      match.id,
      match.clientLoader,
      match.hasLoader,
      false
    ) && (match.hydrateFallbackElement || !match.hasLoader)) {
      delete patchedLoaderData[match.id];
    }
  }
  const context = {
    get _deepestRenderedBoundaryId() {
      return decoded._deepestRenderedBoundaryId ?? null;
    },
    set _deepestRenderedBoundaryId(boundaryId) {
      decoded._deepestRenderedBoundaryId = boundaryId;
    },
    actionData: payload.actionData,
    actionHeaders: {},
    basename: payload.basename,
    errors: payload.errors,
    loaderData: patchedLoaderData,
    loaderHeaders: {},
    location: payload.location,
    statusCode: 200,
    matches: payload.matches.map((match) => ({
      params: match.params,
      pathname: match.pathname,
      pathnameBase: match.pathnameBase,
      route: {
        id: match.id,
        action: match.hasAction || !!match.clientAction,
        handle: match.handle,
        hasErrorBoundary: match.hasErrorBoundary,
        loader: match.hasLoader || !!match.clientLoader,
        index: match.index,
        path: match.path,
        shouldRevalidate: match.shouldRevalidate
      }
    }))
  };
  const router2 = createStaticRouter(
    payload.matches.reduceRight((previous, match) => {
      const route = {
        id: match.id,
        action: match.hasAction || !!match.clientAction,
        element: match.element,
        errorElement: match.errorElement,
        handle: match.handle,
        hasErrorBoundary: !!match.errorElement,
        hydrateFallbackElement: match.hydrateFallbackElement,
        index: match.index,
        loader: match.hasLoader || !!match.clientLoader,
        path: match.path,
        shouldRevalidate: match.shouldRevalidate
      };
      if (previous.length > 0) {
        route.children = previous;
      }
      return [route];
    }, []),
    context
  );
  const frameworkContext = {
    future: {
      // These flags have no runtime impact so can always be false.  If we add
      // flags that drive runtime behavior they'll need to be proxied through.
      v8_middleware: false,
      unstable_subResourceIntegrity: false
    },
    isSpaMode: false,
    ssr: true,
    criticalCss: "",
    manifest: {
      routes: {},
      version: "1",
      url: "",
      entry: {
        module: "",
        imports: []
      }
    },
    routeDiscovery: { mode: "lazy", manifestPath: "/__manifest" },
    routeModules: createRSCRouteModules(payload)
  };
  return /* @__PURE__ */ React3.createElement(RSCRouterContext.Provider, { value: true }, /* @__PURE__ */ React3.createElement(RSCRouterGlobalErrorBoundary, { location: payload.location }, /* @__PURE__ */ React3.createElement(FrameworkContext.Provider, { value: frameworkContext }, /* @__PURE__ */ React3.createElement(
    StaticRouterProvider,
    {
      context,
      router: router2,
      hydrate: false,
      nonce: payload.nonce
    }
  ))));
}
function isReactServerRequest(url) {
  return url.pathname.endsWith(".rsc");
}
function isManifestRequest(url) {
  return url.pathname.endsWith(".manifest");
}
function deserializeErrors(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new ErrorResponseImpl(
        val.status,
        val.statusText,
        val.data,
        val.internal === true
      );
    } else if (val && val.__type === "Error") {
      if (val.__subType) {
        let ErrorConstructor = window[val.__subType];
        if (typeof ErrorConstructor === "function") {
          try {
            let error = new ErrorConstructor(val.message);
            error.stack = val.stack;
            serialized[key] = error;
          } catch (e) {
          }
        }
      }
      if (serialized[key] == null) {
        let error = new Error(val.message);
        error.stack = val.stack;
        serialized[key] = error;
      }
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
function getHydrationData({
  state,
  routes,
  getRouteInfo,
  location: location2,
  basename,
  isSpaMode
}) {
  let hydrationData = {
    ...state,
    loaderData: { ...state.loaderData }
  };
  let initialMatches = matchRoutes(routes, location2, basename);
  if (initialMatches) {
    for (let match of initialMatches) {
      let routeId = match.route.id;
      let routeInfo = getRouteInfo(routeId);
      if (shouldHydrateRouteLoader(
        routeId,
        routeInfo.clientLoader,
        routeInfo.hasLoader,
        isSpaMode
      ) && (routeInfo.hasHydrateFallback || !routeInfo.hasLoader)) {
        delete hydrationData.loaderData[routeId];
      } else if (!routeInfo.hasLoader) {
        hydrationData.loaderData[routeId] = null;
      }
    }
  }
  return hydrationData;
}
function RouterProvider2(props) {
  return /* @__PURE__ */ React3.createElement(RouterProvider, { flushSync: ReactDOM.flushSync, ...props });
}
var ssrInfo = null;
var router = null;
function initSsrInfo() {
  if (!ssrInfo && window.__reactRouterContext && window.__reactRouterManifest && window.__reactRouterRouteModules) {
    if (window.__reactRouterManifest.sri === true) {
      const importMap = document.querySelector("script[rr-importmap]");
      if (importMap?.textContent) {
        try {
          window.__reactRouterManifest.sri = JSON.parse(
            importMap.textContent
          ).integrity;
        } catch (err) {
          console.error("Failed to parse import map", err);
        }
      }
    }
    ssrInfo = {
      context: window.__reactRouterContext,
      manifest: window.__reactRouterManifest,
      routeModules: window.__reactRouterRouteModules,
      stateDecodingPromise: void 0,
      router: void 0,
      routerInitialized: false
    };
  }
}
function createHydratedRouter({
  getContext,
  unstable_instrumentations
}) {
  initSsrInfo();
  if (!ssrInfo) {
    throw new Error(
      "You must be using the SSR features of React Router in order to skip passing a `router` prop to `<RouterProvider>`"
    );
  }
  let localSsrInfo = ssrInfo;
  if (!ssrInfo.stateDecodingPromise) {
    let stream = ssrInfo.context.stream;
    invariant$1(stream, "No stream found for single fetch decoding");
    ssrInfo.context.stream = void 0;
    ssrInfo.stateDecodingPromise = decodeViaTurboStream(stream, window).then((value) => {
      ssrInfo.context.state = value.value;
      localSsrInfo.stateDecodingPromise.value = true;
    }).catch((e) => {
      localSsrInfo.stateDecodingPromise.error = e;
    });
  }
  if (ssrInfo.stateDecodingPromise.error) {
    throw ssrInfo.stateDecodingPromise.error;
  }
  if (!ssrInfo.stateDecodingPromise.value) {
    throw ssrInfo.stateDecodingPromise;
  }
  let routes = createClientRoutes(
    ssrInfo.manifest.routes,
    ssrInfo.routeModules,
    ssrInfo.context.state,
    ssrInfo.context.ssr,
    ssrInfo.context.isSpaMode
  );
  let hydrationData = void 0;
  if (ssrInfo.context.isSpaMode) {
    let { loaderData } = ssrInfo.context.state;
    if (ssrInfo.manifest.routes.root?.hasLoader && loaderData && "root" in loaderData) {
      hydrationData = {
        loaderData: {
          root: loaderData.root
        }
      };
    }
  } else {
    hydrationData = getHydrationData({
      state: ssrInfo.context.state,
      routes,
      getRouteInfo: (routeId) => ({
        clientLoader: ssrInfo.routeModules[routeId]?.clientLoader,
        hasLoader: ssrInfo.manifest.routes[routeId]?.hasLoader === true,
        hasHydrateFallback: ssrInfo.routeModules[routeId]?.HydrateFallback != null
      }),
      location: window.location,
      basename: window.__reactRouterContext?.basename,
      isSpaMode: ssrInfo.context.isSpaMode
    });
    if (hydrationData && hydrationData.errors) {
      hydrationData.errors = deserializeErrors(hydrationData.errors);
    }
  }
  let router2 = createRouter({
    routes,
    history: createBrowserHistory(),
    basename: ssrInfo.context.basename,
    getContext,
    hydrationData,
    hydrationRouteProperties,
    unstable_instrumentations,
    mapRouteProperties,
    future: {
      middleware: ssrInfo.context.future.v8_middleware
    },
    dataStrategy: getTurboStreamSingleFetchDataStrategy(
      () => router2,
      ssrInfo.manifest,
      ssrInfo.routeModules,
      ssrInfo.context.ssr,
      ssrInfo.context.basename
    ),
    patchRoutesOnNavigation: getPatchRoutesOnNavigationFunction(
      ssrInfo.manifest,
      ssrInfo.routeModules,
      ssrInfo.context.ssr,
      ssrInfo.context.routeDiscovery,
      ssrInfo.context.isSpaMode,
      ssrInfo.context.basename
    )
  });
  ssrInfo.router = router2;
  if (router2.state.initialized) {
    ssrInfo.routerInitialized = true;
    router2.initialize();
  }
  router2.createRoutesForHMR = /* spacer so ts-ignore does not affect the right hand of the assignment */
  createClientRoutesWithHMRRevalidationOptOut;
  window.__reactRouterDataRouter = router2;
  return router2;
}
function HydratedRouter(props) {
  if (!router) {
    router = createHydratedRouter({
      getContext: props.getContext,
      unstable_instrumentations: props.unstable_instrumentations
    });
  }
  let [criticalCss, setCriticalCss] = React3.useState(
    process.env.NODE_ENV === "development" ? ssrInfo?.context.criticalCss : void 0
  );
  React3.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setCriticalCss(void 0);
    }
  }, []);
  React3.useEffect(() => {
    if (process.env.NODE_ENV === "development" && criticalCss === void 0) {
      document.querySelectorAll(`[${CRITICAL_CSS_DATA_ATTRIBUTE}]`).forEach((element) => element.remove());
    }
  }, [criticalCss]);
  let [location2, setLocation] = React3.useState(router.state.location);
  React3.useLayoutEffect(() => {
    if (ssrInfo && ssrInfo.router && !ssrInfo.routerInitialized) {
      ssrInfo.routerInitialized = true;
      ssrInfo.router.initialize();
    }
  }, []);
  React3.useLayoutEffect(() => {
    if (ssrInfo && ssrInfo.router) {
      return ssrInfo.router.subscribe((newState) => {
        if (newState.location !== location2) {
          setLocation(newState.location);
        }
      });
    }
  }, [location2]);
  invariant$1(ssrInfo, "ssrInfo unavailable for HydratedRouter");
  useFogOFWarDiscovery(
    router,
    ssrInfo.manifest,
    ssrInfo.routeModules,
    ssrInfo.context.ssr,
    ssrInfo.context.routeDiscovery,
    ssrInfo.context.isSpaMode
  );
  return (
    // This fragment is important to ensure we match the <ServerRouter> JSX
    // structure so that useId values hydrate correctly
    /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(
      FrameworkContext.Provider,
      {
        value: {
          manifest: ssrInfo.manifest,
          routeModules: ssrInfo.routeModules,
          future: ssrInfo.context.future,
          criticalCss,
          ssr: ssrInfo.context.ssr,
          isSpaMode: ssrInfo.context.isSpaMode,
          routeDiscovery: ssrInfo.context.routeDiscovery
        }
      },
      /* @__PURE__ */ React3.createElement(RemixErrorBoundary, { location: location2 }, /* @__PURE__ */ React3.createElement(
        RouterProvider2,
        {
          router,
          unstable_useTransitions: props.unstable_useTransitions,
          onError: props.onError
        }
      ))
    ), /* @__PURE__ */ React3.createElement(React3.Fragment, null))
  );
}
function createCallServer({
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  fetch: fetchImplementation = fetch
}) {
  const globalVar = window;
  let landedActionId = 0;
  return async (id, args) => {
    let actionId = globalVar.__routerActionID = (globalVar.__routerActionID ?? (globalVar.__routerActionID = 0)) + 1;
    const temporaryReferences = createTemporaryReferenceSet();
    const payloadPromise = fetchImplementation(
      new Request(location.href, {
        body: await encodeReply(args, { temporaryReferences }),
        method: "POST",
        headers: {
          Accept: "text/x-component",
          "rsc-action-id": id
        }
      })
    ).then((response) => {
      if (!response.body) {
        throw new Error("No response body");
      }
      return createFromReadableStream(response.body, {
        temporaryReferences
      });
    });
    React3.startTransition(
      () => (
        // @ts-expect-error - Needs React 19 types
        Promise.resolve(payloadPromise).then(async (payload) => {
          if (payload.type === "redirect") {
            if (payload.reload || isExternalLocation(payload.location)) {
              window.location.href = payload.location;
              return;
            }
            React3.startTransition(() => {
              globalVar.__reactRouterDataRouter.navigate(payload.location, {
                replace: payload.replace
              });
            });
            return;
          }
          if (payload.type !== "action") {
            throw new Error("Unexpected payload type");
          }
          const rerender = await payload.rerender;
          if (rerender && landedActionId < actionId && globalVar.__routerActionID <= actionId) {
            if (rerender.type === "redirect") {
              if (rerender.reload || isExternalLocation(rerender.location)) {
                window.location.href = rerender.location;
                return;
              }
              React3.startTransition(() => {
                globalVar.__reactRouterDataRouter.navigate(rerender.location, {
                  replace: rerender.replace
                });
              });
              return;
            }
            React3.startTransition(() => {
              let lastMatch;
              for (const match of rerender.matches) {
                globalVar.__reactRouterDataRouter.patchRoutes(
                  lastMatch?.id ?? null,
                  [createRouteFromServerManifest(match)],
                  true
                );
                lastMatch = match;
              }
              window.__reactRouterDataRouter._internalSetStateDoNotUseOrYouWillBreakYourApp(
                {
                  loaderData: Object.assign(
                    {},
                    globalVar.__reactRouterDataRouter.state.loaderData,
                    rerender.loaderData
                  ),
                  errors: rerender.errors ? Object.assign(
                    {},
                    globalVar.__reactRouterDataRouter.state.errors,
                    rerender.errors
                  ) : null
                }
              );
            });
          }
        }).catch(() => {
        })
      )
    );
    return payloadPromise.then((payload) => {
      if (payload.type !== "action" && payload.type !== "redirect") {
        throw new Error("Unexpected payload type");
      }
      return payload.actionResult;
    });
  };
}
function createRouterFromPayload({
  fetchImplementation,
  createFromReadableStream,
  getContext,
  payload
}) {
  const globalVar = window;
  if (globalVar.__reactRouterDataRouter && globalVar.__reactRouterRouteModules)
    return {
      router: globalVar.__reactRouterDataRouter,
      routeModules: globalVar.__reactRouterRouteModules
    };
  if (payload.type !== "render") throw new Error("Invalid payload type");
  globalVar.__reactRouterRouteModules = globalVar.__reactRouterRouteModules ?? {};
  populateRSCRouteModules(globalVar.__reactRouterRouteModules, payload.matches);
  let patches = /* @__PURE__ */ new Map();
  payload.patches?.forEach((patch) => {
    invariant$1(patch.parentId, "Invalid patch parentId");
    if (!patches.has(patch.parentId)) {
      patches.set(patch.parentId, []);
    }
    patches.get(patch.parentId)?.push(patch);
  });
  let routes = payload.matches.reduceRight((previous, match) => {
    const route = createRouteFromServerManifest(
      match,
      payload
    );
    if (previous.length > 0) {
      route.children = previous;
      let childrenToPatch = patches.get(match.id);
      if (childrenToPatch) {
        route.children.push(
          ...childrenToPatch.map((r) => createRouteFromServerManifest(r))
        );
      }
    }
    return [route];
  }, []);
  globalVar.__reactRouterDataRouter = createRouter({
    routes,
    getContext,
    basename: payload.basename,
    history: createBrowserHistory(),
    hydrationData: getHydrationData({
      state: {
        loaderData: payload.loaderData,
        actionData: payload.actionData,
        errors: payload.errors
      },
      routes,
      getRouteInfo: (routeId) => {
        let match = payload.matches.find((m) => m.id === routeId);
        invariant$1(match, "Route not found in payload");
        return {
          clientLoader: match.clientLoader,
          hasLoader: match.hasLoader,
          hasHydrateFallback: match.hydrateFallbackElement != null
        };
      },
      location: payload.location,
      basename: payload.basename,
      isSpaMode: false
    }),
    async patchRoutesOnNavigation({ path, signal }) {
      if (discoveredPaths.has(path)) {
        return;
      }
      await fetchAndApplyManifestPatches(
        [path],
        createFromReadableStream,
        fetchImplementation,
        signal
      );
    },
    // FIXME: Pass `build.ssr` into this function
    dataStrategy: getRSCSingleFetchDataStrategy(
      () => globalVar.__reactRouterDataRouter,
      true,
      payload.basename,
      createFromReadableStream,
      fetchImplementation
    )
  });
  if (globalVar.__reactRouterDataRouter.state.initialized) {
    globalVar.__routerInitialized = true;
    globalVar.__reactRouterDataRouter.initialize();
  } else {
    globalVar.__routerInitialized = false;
  }
  let lastLoaderData = void 0;
  globalVar.__reactRouterDataRouter.subscribe(({ loaderData, actionData }) => {
    if (lastLoaderData !== loaderData) {
      globalVar.__routerActionID = (globalVar.__routerActionID ?? (globalVar.__routerActionID = 0)) + 1;
    }
  });
  globalVar.__reactRouterDataRouter._updateRoutesForHMR = (routeUpdateByRouteId) => {
    const oldRoutes = window.__reactRouterDataRouter.routes;
    const newRoutes = [];
    function walkRoutes(routes2, parentId) {
      return routes2.map((route) => {
        const routeUpdate = routeUpdateByRouteId.get(route.id);
        if (routeUpdate) {
          const {
            routeModule,
            hasAction,
            hasComponent,
            hasErrorBoundary,
            hasLoader
          } = routeUpdate;
          const newRoute = createRouteFromServerManifest({
            clientAction: routeModule.clientAction,
            clientLoader: routeModule.clientLoader,
            element: route.element,
            errorElement: route.errorElement,
            handle: route.handle,
            hasAction,
            hasComponent,
            hasErrorBoundary,
            hasLoader,
            hydrateFallbackElement: route.hydrateFallbackElement,
            id: route.id,
            index: route.index,
            links: routeModule.links,
            meta: routeModule.meta,
            parentId,
            path: route.path,
            shouldRevalidate: routeModule.shouldRevalidate
          });
          if (route.children) {
            newRoute.children = walkRoutes(route.children, route.id);
          }
          return newRoute;
        }
        const updatedRoute = { ...route };
        if (route.children) {
          updatedRoute.children = walkRoutes(route.children, route.id);
        }
        return updatedRoute;
      });
    }
    newRoutes.push(
      ...walkRoutes(oldRoutes, void 0)
    );
    window.__reactRouterDataRouter._internalSetRoutes(newRoutes);
  };
  return {
    router: globalVar.__reactRouterDataRouter,
    routeModules: globalVar.__reactRouterRouteModules
  };
}
var renderedRoutesContext = createContext();
function getRSCSingleFetchDataStrategy(getRouter, ssr, basename, createFromReadableStream, fetchImplementation) {
  let dataStrategy = getSingleFetchDataStrategyImpl(
    getRouter,
    (match) => {
      let M = match;
      return {
        hasLoader: M.route.hasLoader,
        hasClientLoader: M.route.hasClientLoader,
        hasComponent: M.route.hasComponent,
        hasAction: M.route.hasAction,
        hasClientAction: M.route.hasClientAction,
        hasShouldRevalidate: M.route.hasShouldRevalidate
      };
    },
    // pass map into fetchAndDecode so it can add payloads
    getFetchAndDecodeViaRSC(createFromReadableStream, fetchImplementation),
    ssr,
    basename,
    // If the route has a component but we don't have an element, we need to hit
    // the server loader flow regardless of whether the client loader calls
    // `serverLoader` or not, otherwise we'll have nothing to render.
    (match) => {
      let M = match;
      return M.route.hasComponent && !M.route.element;
    }
  );
  return async (args) => args.runClientMiddleware(async () => {
    let context = args.context;
    context.set(renderedRoutesContext, []);
    let results = await dataStrategy(args);
    const renderedRoutesById = /* @__PURE__ */ new Map();
    for (const route of context.get(renderedRoutesContext)) {
      if (!renderedRoutesById.has(route.id)) {
        renderedRoutesById.set(route.id, []);
      }
      renderedRoutesById.get(route.id).push(route);
    }
    React3.startTransition(() => {
      for (const match of args.matches) {
        const renderedRoutes = renderedRoutesById.get(match.route.id);
        if (renderedRoutes) {
          for (const rendered of renderedRoutes) {
            window.__reactRouterDataRouter.patchRoutes(
              rendered.parentId ?? null,
              [createRouteFromServerManifest(rendered)],
              true
            );
          }
        }
      }
    });
    return results;
  });
}
function getFetchAndDecodeViaRSC(createFromReadableStream, fetchImplementation) {
  return async (args, basename, targetRoutes) => {
    let { request, context } = args;
    let url = singleFetchUrl(request.url, basename, "rsc");
    if (request.method === "GET") {
      url = stripIndexParam$1(url);
      if (targetRoutes) {
        url.searchParams.set("_routes", targetRoutes.join(","));
      }
    }
    let res = await fetchImplementation(
      new Request(url, await createRequestInit(request))
    );
    if (res.status >= 400 && !res.headers.has("X-Remix-Response")) {
      throw new ErrorResponseImpl(res.status, res.statusText, await res.text());
    }
    invariant$1(res.body, "No response body to decode");
    try {
      const payload = await createFromReadableStream(res.body, {
        temporaryReferences: void 0
      });
      if (payload.type === "redirect") {
        return {
          status: res.status,
          data: {
            redirect: {
              redirect: payload.location,
              reload: payload.reload,
              replace: payload.replace,
              revalidate: false,
              status: payload.status
            }
          }
        };
      }
      if (payload.type !== "render") {
        throw new Error("Unexpected payload type");
      }
      context.get(renderedRoutesContext).push(...payload.matches);
      let results = { routes: {} };
      const dataKey = isMutationMethod(request.method) ? "actionData" : "loaderData";
      for (let [routeId, data2] of Object.entries(payload[dataKey] || {})) {
        results.routes[routeId] = { data: data2 };
      }
      if (payload.errors) {
        for (let [routeId, error] of Object.entries(payload.errors)) {
          results.routes[routeId] = { error };
        }
      }
      return { status: res.status, data: results };
    } catch (e) {
      throw new Error("Unable to decode RSC response");
    }
  };
}
function RSCHydratedRouter({
  createFromReadableStream,
  fetch: fetchImplementation = fetch,
  payload,
  routeDiscovery = "eager",
  getContext
}) {
  if (payload.type !== "render") throw new Error("Invalid payload type");
  let { router: router2, routeModules } = React3.useMemo(
    () => createRouterFromPayload({
      payload,
      fetchImplementation,
      getContext,
      createFromReadableStream
    }),
    [createFromReadableStream, payload, fetchImplementation, getContext]
  );
  React3.useEffect(() => {
    setIsHydrated();
  }, []);
  React3.useLayoutEffect(() => {
    const globalVar = window;
    if (!globalVar.__routerInitialized) {
      globalVar.__routerInitialized = true;
      globalVar.__reactRouterDataRouter.initialize();
    }
  }, []);
  let [{ routes, state }, setState] = React3.useState(() => ({
    routes: cloneRoutes(router2.routes),
    state: router2.state
  }));
  React3.useLayoutEffect(
    () => router2.subscribe((newState) => {
      if (diffRoutes(router2.routes, routes))
        React3.startTransition(() => {
          setState({
            routes: cloneRoutes(router2.routes),
            state: newState
          });
        });
    }),
    [router2.subscribe, routes, router2]
  );
  const transitionEnabledRouter = React3.useMemo(
    () => ({
      ...router2,
      state,
      routes
    }),
    [router2, routes, state]
  );
  React3.useEffect(() => {
    if (routeDiscovery === "lazy" || // @ts-expect-error - TS doesn't know about this yet
    window.navigator?.connection?.saveData === true) {
      return;
    }
    function registerElement(el) {
      let path = el.tagName === "FORM" ? el.getAttribute("action") : el.getAttribute("href");
      if (!path) {
        return;
      }
      let pathname = el.tagName === "A" ? el.pathname : new URL(path, window.location.origin).pathname;
      if (!discoveredPaths.has(pathname)) {
        nextPaths.add(pathname);
      }
    }
    async function fetchPatches() {
      document.querySelectorAll("a[data-discover], form[data-discover]").forEach(registerElement);
      let paths = Array.from(nextPaths.keys()).filter((path) => {
        if (discoveredPaths.has(path)) {
          nextPaths.delete(path);
          return false;
        }
        return true;
      });
      if (paths.length === 0) {
        return;
      }
      try {
        await fetchAndApplyManifestPatches(
          paths,
          createFromReadableStream,
          fetchImplementation
        );
      } catch (e) {
        console.error("Failed to fetch manifest patches", e);
      }
    }
    let debouncedFetchPatches = debounce(fetchPatches, 100);
    fetchPatches();
    let observer = new MutationObserver(() => debouncedFetchPatches());
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-discover", "href", "action"]
    });
  }, [routeDiscovery, createFromReadableStream, fetchImplementation]);
  const frameworkContext = {
    future: {
      // These flags have no runtime impact so can always be false.  If we add
      // flags that drive runtime behavior they'll need to be proxied through.
      v8_middleware: false,
      unstable_subResourceIntegrity: false
    },
    isSpaMode: false,
    ssr: true,
    criticalCss: "",
    manifest: {
      routes: {},
      version: "1",
      url: "",
      entry: {
        module: "",
        imports: []
      }
    },
    routeDiscovery: { mode: "lazy", manifestPath: "/__manifest" },
    routeModules
  };
  return /* @__PURE__ */ React3.createElement(RSCRouterContext.Provider, { value: true }, /* @__PURE__ */ React3.createElement(RSCRouterGlobalErrorBoundary, { location: state.location }, /* @__PURE__ */ React3.createElement(FrameworkContext.Provider, { value: frameworkContext }, /* @__PURE__ */ React3.createElement(
    RouterProvider,
    {
      router: transitionEnabledRouter,
      flushSync: ReactDOM.flushSync
    }
  ))));
}
function createRouteFromServerManifest(match, payload) {
  let hasInitialData = payload && match.id in payload.loaderData;
  let initialData = payload?.loaderData[match.id];
  let hasInitialError = payload?.errors && match.id in payload.errors;
  let initialError = payload?.errors?.[match.id];
  let isHydrationRequest = match.clientLoader?.hydrate === true || !match.hasLoader || // If the route has a component but we don't have an element, we need to hit
  // the server loader flow regardless of whether the client loader calls
  // `serverLoader` or not, otherwise we'll have nothing to render.
  match.hasComponent && !match.element;
  invariant$1(window.__reactRouterRouteModules);
  populateRSCRouteModules(window.__reactRouterRouteModules, match);
  let dataRoute = {
    id: match.id,
    element: match.element,
    errorElement: match.errorElement,
    handle: match.handle,
    hasErrorBoundary: match.hasErrorBoundary,
    hydrateFallbackElement: match.hydrateFallbackElement,
    index: match.index,
    loader: match.clientLoader ? async (args, singleFetch) => {
      try {
        let result = await match.clientLoader({
          ...args,
          serverLoader: () => {
            preventInvalidServerHandlerCall(
              "loader",
              match.id,
              match.hasLoader
            );
            if (isHydrationRequest) {
              if (hasInitialData) {
                return initialData;
              }
              if (hasInitialError) {
                throw initialError;
              }
            }
            return callSingleFetch(singleFetch);
          }
        });
        return result;
      } finally {
        isHydrationRequest = false;
      }
    } : (
      // We always make the call in this RSC world since even if we don't
      // have a `loader` we may need to get the `element` implementation
      ((_, singleFetch) => callSingleFetch(singleFetch))
    ),
    action: match.clientAction ? (args, singleFetch) => match.clientAction({
      ...args,
      serverAction: async () => {
        preventInvalidServerHandlerCall(
          "action",
          match.id,
          match.hasLoader
        );
        return await callSingleFetch(singleFetch);
      }
    }) : match.hasAction ? (_, singleFetch) => callSingleFetch(singleFetch) : () => {
      throw noActionDefinedError("action", match.id);
    },
    path: match.path,
    shouldRevalidate: match.shouldRevalidate,
    // We always have a "loader" in this RSC world since even if we don't
    // have a `loader` we may need to get the `element` implementation
    hasLoader: true,
    hasClientLoader: match.clientLoader != null,
    hasAction: match.hasAction,
    hasClientAction: match.clientAction != null,
    hasShouldRevalidate: match.shouldRevalidate != null
  };
  if (typeof dataRoute.loader === "function") {
    dataRoute.loader.hydrate = shouldHydrateRouteLoader(
      match.id,
      match.clientLoader,
      match.hasLoader,
      false
    );
  }
  return dataRoute;
}
function callSingleFetch(singleFetch) {
  invariant$1(typeof singleFetch === "function", "Invalid singleFetch parameter");
  return singleFetch();
}
function preventInvalidServerHandlerCall(type, routeId, hasHandler) {
  if (!hasHandler) {
    let fn = type === "action" ? "serverAction()" : "serverLoader()";
    let msg = `You are trying to call ${fn} on a route that does not have a server ${type} (routeId: "${routeId}")`;
    console.error(msg);
    throw new ErrorResponseImpl(400, "Bad Request", new Error(msg), true);
  }
}
var nextPaths = /* @__PURE__ */ new Set();
var discoveredPathsMaxSize = 1e3;
var discoveredPaths = /* @__PURE__ */ new Set();
var URL_LIMIT = 7680;
function getManifestUrl(paths) {
  if (paths.length === 0) {
    return null;
  }
  if (paths.length === 1) {
    return new URL(`${paths[0]}.manifest`, window.location.origin);
  }
  const globalVar = window;
  let basename = (globalVar.__reactRouterDataRouter.basename ?? "").replace(
    /^\/|\/$/g,
    ""
  );
  let url = new URL(`${basename}/.manifest`, window.location.origin);
  url.searchParams.set("paths", paths.sort().join(","));
  return url;
}
async function fetchAndApplyManifestPatches(paths, createFromReadableStream, fetchImplementation, signal) {
  let url = getManifestUrl(paths);
  if (url == null) {
    return;
  }
  if (url.toString().length > URL_LIMIT) {
    nextPaths.clear();
    return;
  }
  let response = await fetchImplementation(new Request(url, { signal }));
  if (!response.body || response.status < 200 || response.status >= 300) {
    throw new Error("Unable to fetch new route matches from the server");
  }
  let payload = await createFromReadableStream(response.body, {
    temporaryReferences: void 0
  });
  if (payload.type !== "manifest") {
    throw new Error("Failed to patch routes");
  }
  paths.forEach((p) => addToFifoQueue(p, discoveredPaths));
  React3.startTransition(() => {
    payload.patches.forEach((p) => {
      window.__reactRouterDataRouter.patchRoutes(
        p.parentId ?? null,
        [createRouteFromServerManifest(p)]
      );
    });
  });
}
function addToFifoQueue(path, queue) {
  if (queue.size >= discoveredPathsMaxSize) {
    let first = queue.values().next().value;
    if (typeof first === "string") queue.delete(first);
  }
  queue.add(path);
}
function debounce(callback, wait) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}
function isExternalLocation(location2) {
  const newLocation = new URL(location2, window.location.href);
  return newLocation.origin !== window.location.origin;
}
function cloneRoutes(routes) {
  if (!routes) return void 0;
  return routes.map((route) => ({
    ...route,
    children: cloneRoutes(route.children)
  }));
}
function diffRoutes(a, b) {
  if (a.length !== b.length) return true;
  return a.some((route, index) => {
    if (route.element !== b[index].element) return true;
    if (route.errorElement !== b[index].errorElement)
      return true;
    if (route.hydrateFallbackElement !== b[index].hydrateFallbackElement)
      return true;
    if (route.hasErrorBoundary !== b[index].hasErrorBoundary)
      return true;
    if (route.hasLoader !== b[index].hasLoader) return true;
    if (route.hasClientLoader !== b[index].hasClientLoader)
      return true;
    if (route.hasAction !== b[index].hasAction) return true;
    if (route.hasClientAction !== b[index].hasClientAction)
      return true;
    return diffRoutes(route.children || [], b[index].children || []);
  });
}
function getRSCStream() {
  let encoder3 = new TextEncoder();
  let streamController = null;
  let rscStream = new ReadableStream({
    start(controller) {
      if (typeof window === "undefined") {
        return;
      }
      let handleChunk = (chunk) => {
        if (typeof chunk === "string") {
          controller.enqueue(encoder3.encode(chunk));
        } else {
          controller.enqueue(chunk);
        }
      };
      window.__FLIGHT_DATA || (window.__FLIGHT_DATA = []);
      window.__FLIGHT_DATA.forEach(handleChunk);
      window.__FLIGHT_DATA.push = (chunk) => {
        handleChunk(chunk);
        return 0;
      };
      streamController = controller;
    }
  });
  if (typeof document !== "undefined" && document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      streamController?.close();
    });
  } else {
    streamController?.close();
  }
  return rscStream;
}
const domExport = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HydratedRouter,
  RouterProvider: RouterProvider2,
  unstable_RSCHydratedRouter: RSCHydratedRouter,
  unstable_createCallServer: createCallServer,
  unstable_getRSCStream: getRSCStream
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(domExport);
const development = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Await,
  BrowserRouter,
  Form,
  HashRouter,
  IDLE_BLOCKER,
  IDLE_FETCHER,
  IDLE_NAVIGATION,
  Link,
  Links,
  MemoryRouter,
  Meta,
  NavLink,
  Navigate,
  NavigationType: Action,
  Outlet,
  PrefetchPageLinks,
  Route,
  Router,
  RouterContextProvider,
  RouterProvider,
  Routes,
  Scripts,
  ScrollRestoration,
  ServerRouter,
  StaticRouter,
  StaticRouterProvider,
  UNSAFE_AwaitContextProvider: AwaitContextProvider,
  UNSAFE_DataRouterContext: DataRouterContext,
  UNSAFE_DataRouterStateContext: DataRouterStateContext,
  UNSAFE_ErrorResponseImpl: ErrorResponseImpl,
  UNSAFE_FetchersContext: FetchersContext,
  UNSAFE_FrameworkContext: FrameworkContext,
  UNSAFE_LocationContext: LocationContext,
  UNSAFE_NavigationContext: NavigationContext,
  UNSAFE_RSCDefaultRootErrorBoundary: RSCDefaultRootErrorBoundary,
  UNSAFE_RemixErrorBoundary: RemixErrorBoundary,
  UNSAFE_RouteContext: RouteContext,
  UNSAFE_ServerMode: ServerMode,
  UNSAFE_SingleFetchRedirectSymbol: SingleFetchRedirectSymbol,
  UNSAFE_ViewTransitionContext: ViewTransitionContext,
  UNSAFE_WithComponentProps: WithComponentProps,
  UNSAFE_WithErrorBoundaryProps: WithErrorBoundaryProps,
  UNSAFE_WithHydrateFallbackProps: WithHydrateFallbackProps,
  UNSAFE_createBrowserHistory: createBrowserHistory,
  UNSAFE_createClientRoutes: createClientRoutes,
  UNSAFE_createClientRoutesWithHMRRevalidationOptOut: createClientRoutesWithHMRRevalidationOptOut,
  UNSAFE_createRouter: createRouter,
  UNSAFE_decodeViaTurboStream: decodeViaTurboStream,
  UNSAFE_deserializeErrors: deserializeErrors,
  UNSAFE_getHydrationData: getHydrationData,
  UNSAFE_getPatchRoutesOnNavigationFunction: getPatchRoutesOnNavigationFunction,
  UNSAFE_getTurboStreamSingleFetchDataStrategy: getTurboStreamSingleFetchDataStrategy,
  UNSAFE_hydrationRouteProperties: hydrationRouteProperties,
  UNSAFE_invariant: invariant$1,
  UNSAFE_mapRouteProperties: mapRouteProperties,
  UNSAFE_shouldHydrateRouteLoader: shouldHydrateRouteLoader,
  UNSAFE_useFogOFWarDiscovery: useFogOFWarDiscovery,
  UNSAFE_useScrollRestoration: useScrollRestoration,
  UNSAFE_withComponentProps: withComponentProps,
  UNSAFE_withErrorBoundaryProps: withErrorBoundaryProps,
  UNSAFE_withHydrateFallbackProps: withHydrateFallbackProps,
  createBrowserRouter,
  createContext,
  createCookie,
  createCookieSessionStorage,
  createHashRouter,
  createMemoryRouter,
  createMemorySessionStorage,
  createPath,
  createRequestHandler,
  createRoutesFromChildren,
  createRoutesFromElements,
  createRoutesStub,
  createSearchParams,
  createSession,
  createSessionStorage,
  createStaticHandler: createStaticHandler2,
  createStaticRouter,
  data,
  generatePath,
  href,
  isCookie,
  isRouteErrorResponse,
  isSession,
  matchPath,
  matchRoutes,
  parsePath,
  redirect,
  redirectDocument,
  renderMatches,
  replace,
  resolvePath,
  unstable_HistoryRouter: HistoryRouter,
  unstable_RSCStaticRouter: RSCStaticRouter,
  unstable_routeRSCServerRequest: routeRSCServerRequest,
  unstable_setDevServerHooks: setDevServerHooks,
  unstable_usePrompt: usePrompt,
  unstable_useRoute: useRoute,
  useActionData,
  useAsyncError,
  useAsyncValue,
  useBeforeUnload,
  useBlocker,
  useFetcher,
  useFetchers,
  useFormAction,
  useHref,
  useInRouterContext,
  useLinkClickHandler,
  useLoaderData,
  useLocation,
  useMatch,
  useMatches,
  useNavigate,
  useNavigation,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRevalidator,
  useRouteError,
  useRouteLoaderData,
  useRoutes,
  useSearchParams,
  useSubmit,
  useViewTransitionState
}, Symbol.toStringTag, { value: "Module" }));
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(development);
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist$1.exports;
  hasRequiredDist = 1;
  (function(module) {
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export(index_exports, {
      HydratedRouter: () => import_dom.HydratedRouter,
      RouterProvider: () => import_dom.RouterProvider
    });
    module.exports = __toCommonJS(index_exports);
    var import_dom = require$$0;
    __reExport(index_exports, require$$1, module.exports);
  })(dist$1);
  return dist$1.exports;
}
var distExports = /* @__PURE__ */ requireDist();
const ScrollToTop = () => {
  const { pathname } = distExports.useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
const PayOnline = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    amount: ""
  });
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }
    const options = {
      key: "rzp_live_SlWNuGVbsl0XQU",
      amount: formData.amount * 100,
      currency: "INR",
      name: "Acharya Seemaa Singh",
      description: "Direct Online Payment",
      handler: function(response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
        setOpen(false);
        setFormData({ name: "", email: "", phone: "", dob: "", amount: "" });
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        "Customer Name": formData.name,
        "Customer Email": formData.email,
        "Customer Phone": formData.phone,
        "Date of Birth": formData.dob,
        "Source": "Pay Online Button"
      },
      theme: { color: "#7A1E1E" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setOpen(!open),
        className: "fixed right-3 top-3/4 -translate-y-1/2 rotate-90 origin-right bg-[#7A1E1E] text-white shadow-lg z-50 px-4 py-2 hover:bg-[#5a1616] transition-colors",
        children: "Pay Online"
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setOpen(false),
          className: "absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-black md:text-xl text-lg",
          children: "╳"
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-[#7A1E1E] text-2xl mb-1 text-center font-bold", children: "Pay Online" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm text-center mb-6", children: "Enter details to proceed with payment" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handlePayment, className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "name",
            placeholder: "Full Name",
            required: true,
            value: formData.name,
            onChange: handleInput,
            className: "border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            name: "email",
            placeholder: "Email Address",
            required: true,
            value: formData.email,
            onChange: handleInput,
            className: "border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            name: "phone",
            placeholder: "Phone Number",
            required: true,
            value: formData.phone,
            onChange: handleInput,
            className: "border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase tracking-wider text-gray-400 ml-1 font-bold", children: "Date of Birth" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              name: "dob",
              required: true,
              value: formData.dob,
              onChange: handleInput,
              className: "border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase tracking-wider text-[#7A1E1E] ml-1 font-bold", children: "Amount (₹)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              name: "amount",
              placeholder: "0.00",
              required: true,
              value: formData.amount,
              onChange: handleInput,
              className: "w-full border-2 border-[#7A1E1E] p-3 rounded-xl outline-none font-bold text-xl text-center text-[#7A1E1E]"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "bg-[#7A1E1E] text-white py-4 rounded-xl font-bold mt-2 shadow-lg hover:bg-[#5a1616] active:scale-95 transition-all",
            children: "PAY NOW"
          }
        )
      ] })
    ] }) })
  ] });
};
const SITE_URL = "https://www.seemaaastrologer.com";
const SITE_NAME = "Acharya Seemaa Singh";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const SOCIAL_LINKS = [
  "https://www.facebook.com/astrologerseemasingh",
  "https://www.instagram.com/astrologerseemasingh"
];
const services$1 = [
  {
    slug: "relationship-challenges",
    title: "Relationship Challenges",
    seoTitle: "Relationship Astrology & Marriage Guidance | Acharya Seemaa Singh",
    description: "Astrology guidance for relationship conflicts, marriage problems and emotional bonds, with Vedic astrologer Acharya Seemaa Singh. Book an online consultation."
  },
  {
    slug: "business-setbacks",
    title: "Business Setbacks",
    seoTitle: "Business Astrology for Setbacks & Growth | Acharya Seemaa Singh",
    description: "Vedic astrology insights for business losses, delays and strategic growth. Understand planetary timing and remedies with Acharya Seemaa Singh."
  },
  {
    slug: "financial-struggle",
    title: "Financial Struggle",
    seoTitle: "Financial Astrology & Money Guidance | Acharya Seemaa Singh",
    description: "Astrology-based guidance for money stress, financial planning and prosperity. Consult Vedic astrologer Acharya Seemaa Singh online."
  },
  {
    slug: "career-roadblocks",
    title: "Career Roadblocks",
    seoTitle: "Career Astrology & Job Guidance | Acharya Seemaa Singh",
    description: "Career astrology for job confusion, stalled growth and the right professional direction, from Vedic astrologer Acharya Seemaa Singh."
  },
  {
    slug: "transits-of-the-month",
    title: "Transits of the Month",
    seoTitle: "Monthly Planetary Transits Forecast | Acharya Seemaa Singh",
    description: "Understand how this month's planetary transits may affect your decisions, relationships and emotions, explained by Acharya Seemaa Singh."
  },
  {
    slug: "astro-numerology",
    title: "Astro Numerology",
    seoTitle: "Astro Numerology: Life Path & Lucky Numbers | Acharya Seemaa Singh",
    description: "Numerology and astrology combined: life path, destiny numbers and karmic lessons, with Acharya Seemaa Singh. Book a personal reading."
  },
  {
    slug: "vedic-astrology",
    title: "Vedic Astrology",
    seoTitle: "Vedic Astrology (Jyotish) Consultation | Acharya Seemaa Singh",
    description: "Birth chart (kundli) analysis, doshas, remedies and predictions by Vedic astrologer Acharya Seemaa Singh, with 20+ years of experience."
  },
  {
    slug: "vedic-vastu",
    title: "Vedic Vastu",
    seoTitle: "Vastu Shastra Consultation for Home & Office | Acharya Seemaa Singh",
    description: "Vastu consultation for homes and offices: directions, placements and energy balance for peace and prosperity, by Acharya Seemaa Singh."
  }
];
const signs$2 = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces"
];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const personLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#seemaa`,
  name: "Seemaa Singh",
  alternateName: ["Acharya Seemaa Singh", "Seema Singh"],
  jobTitle: "Vedic Astrologer",
  url: SITE_URL,
  image: OG_IMAGE,
  sameAs: SOCIAL_LINKS,
  knowsAbout: [
    "Vedic astrology",
    "Numerology",
    "Tarot",
    "Vastu Shastra",
    "Aura reading",
    "Energy dowsing"
  ],
  telephone: ["+917696134636", "+12362589866"],
  email: "Info@seemaaastrologer.com"
};
const websiteLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Seemaa Astrologer",
  publisher: { "@id": `${SITE_URL}/#seemaa` }
};
const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });
const pages = {
  "/": {
    title: "Acharya Seemaa Singh | Vedic Astrologer, Tarot, Numerology & Vastu",
    description: "Consult Acharya Seemaa Singh, a Vedic astrologer with 20+ years of experience serving clients in India and Canada. Kundli, tarot, numerology, Vastu and more.",
    jsonLd: graph(websiteLd, personLd)
  },
  "/about": {
    title: "About Acharya Seemaa Singh | Astrologer, Author & Teacher",
    description: "Meet Acharya Seemaa Singh: Vedic astrologer, tarot expert, author of Tarot for Beginners, with over two decades of experience guiding clients worldwide.",
    jsonLd: graph(
      {
        "@type": "AboutPage",
        url: `${SITE_URL}/about`,
        name: "About Acharya Seemaa Singh",
        about: { "@id": `${SITE_URL}/#seemaa` }
      },
      personLd
    )
  },
  "/horoscope": {
    title: "Zodiac Signs: Personality, Traits & Predictions | Acharya Seemaa Singh",
    description: "Explore all 12 zodiac signs (Rashi): personality, traits and guidance from Vedic astrologer Acharya Seemaa Singh."
  },
  "/consultation": {
    title: "Book an Astrology Consultation Online | Acharya Seemaa Singh",
    description: "Book a 1-to-1 online astrology consultation with Acharya Seemaa Singh. Choose your date, time slot and duration."
  },
  "/contact": {
    title: "Contact Acharya Seemaa Singh | Astrology Consultations",
    description: "Contact Acharya Seemaa Singh for astrology, tarot, numerology and Vastu consultations. Phone, email and booking details."
  }
};
services$1.forEach((s) => {
  const url = `${SITE_URL}/services/${s.slug}`;
  pages[`/services/${s.slug}`] = {
    title: s.seoTitle,
    description: s.description,
    jsonLd: graph(
      {
        "@type": "Service",
        name: s.title,
        description: s.description,
        url,
        serviceType: s.title,
        provider: { "@id": `${SITE_URL}/#seemaa` },
        areaServed: ["India", "Canada", "Worldwide (online)"]
      },
      personLd
    )
  };
});
signs$2.forEach((sign2) => {
  pages[`/horoscope/${sign2}`] = {
    title: `${cap(sign2)} Zodiac Sign: Personality & Traits | Acharya Seemaa Singh`,
    description: `${cap(sign2)} personality, strengths and traits explained by Vedic astrologer Acharya Seemaa Singh. Book a personal horoscope reading.`
  };
});
const notFoundSeo = {
  title: "Page not found | Acharya Seemaa Singh",
  description: "This page could not be found.",
  noindex: true
};
function normalizePath(pathname) {
  if (!pathname) return "/";
  let p = pathname.split("?")[0].split("#")[0];
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}
function getSeo(pathname) {
  const path = normalizePath(pathname);
  const page = pages[path];
  if (!page) return { ...notFoundSeo, path };
  return { ...page, path, canonical: `${SITE_URL}${path === "/" ? "/" : path}` };
}
function setTag(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}
function Seo() {
  const { pathname } = distExports.useLocation();
  useEffect(() => {
    const seo = getSeo(pathname);
    document.title = seo.title;
    setTag('meta[name="description"]', "meta", { name: "description", content: seo.description });
    setTag('meta[name="robots"]', "meta", {
      name: "robots",
      content: seo.noindex ? "noindex, follow" : "index, follow"
    });
    if (seo.canonical) {
      setTag('link[rel="canonical"]', "link", { rel: "canonical", href: seo.canonical });
      setTag('meta[property="og:url"]', "meta", { property: "og:url", content: seo.canonical });
    }
    setTag('meta[property="og:title"]', "meta", { property: "og:title", content: seo.title });
    setTag('meta[property="og:description"]', "meta", { property: "og:description", content: seo.description });
    setTag('meta[property="og:type"]', "meta", { property: "og:type", content: "website" });
    setTag('meta[property="og:site_name"]', "meta", { property: "og:site_name", content: SITE_NAME });
    setTag('meta[property="og:image"]', "meta", { property: "og:image", content: OG_IMAGE });
    setTag('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary_large_image" });
    document.head.querySelectorAll("script[data-seo-jsonld]").forEach((n) => n.remove());
    if (seo.jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-seo-jsonld", "");
      s.text = JSON.stringify(seo.jsonLd);
      document.head.appendChild(s);
    }
  }, [pathname]);
  return null;
}
const zodiacWheel = "/assets/zodiacwheel-5QZMaSs9.png";
const seemaapic1$1 = "/assets/seemaapic1-Cjz91AN0.png";
const ganeshgpng = "/assets/ganeshg-BlkHXYXO.png";
const Seemaa$1 = "/assets/seemaa--6uakrT7.png";
var DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext = React3__default.createContext && /* @__PURE__ */ React3__default.createContext(DefaultContext);
var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /* @__PURE__ */ React3__default.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data2) {
  return (props) => /* @__PURE__ */ React3__default.createElement(IconBase, _extends({
    attr: _objectSpread({}, data2.attr)
  }, props), Tree2Element(data2.child));
}
function IconBase(props) {
  var elem = (conf) => {
    var {
      attr,
      size,
      title
    } = props, svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /* @__PURE__ */ React3__default.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /* @__PURE__ */ React3__default.createElement("title", null, title), props.children);
  };
  return IconContext !== void 0 ? /* @__PURE__ */ React3__default.createElement(IconContext.Consumer, null, (conf) => elem(conf)) : elem(DefaultContext);
}
function HiOutlineMenu(props) {
  return GenIcon({ "attr": { "fill": "none", "viewBox": "0 0 24 24", "strokeWidth": "2", "stroke": "currentColor", "aria-hidden": "true" }, "child": [{ "tag": "path", "attr": { "strokeLinecap": "round", "strokeLinejoin": "round", "d": "M4 6h16M4 12h16M4 18h16" }, "child": [] }] })(props);
}
function HiOutlineX(props) {
  return GenIcon({ "attr": { "fill": "none", "viewBox": "0 0 24 24", "strokeWidth": "2", "stroke": "currentColor", "aria-hidden": "true" }, "child": [{ "tag": "path", "attr": { "strokeLinecap": "round", "strokeLinejoin": "round", "d": "M6 18L18 6M6 6l12 12" }, "child": [] }] })(props);
}
const logo = "/assets/logoastrologer-BbasjhxY.png";
const aries = "/assets/aries-CKfvK_Ca.webp";
const taurus = "/assets/taurus-DPjgSfTm.webp";
const gemini = "/assets/gemini-CCZq6J4W.webp";
const cancer = "/assets/cancer-CDC3I14f.webp";
const leo = "/assets/leo-C6eeMloY.webp";
const virgo = "/assets/virgo-zW12IWdQ.webp";
const libra = "/assets/libra-Bafe-UsZ.webp";
const scorpio = "/assets/scorpio-nqnkcnFE.webp";
const sagittarius = "/assets/sagittarius-CVGx0Ibf.webp";
const capricorn = "/assets/capricorn-CNVYT-0I.webp";
const aquarius = "/assets/aquarius-I8elDB3a.webp";
const pisces = "/assets/pisces-D8GSH_jt.webp";
const services = [
  "Relationship Challenges",
  "Business Setbacks",
  "Financial Struggle",
  "Career Roadblocks",
  "Transits of the Month",
  "Astro Numerology",
  "Vedic Astrology",
  "Vedic Vastu"
];
const horoscopes = [
  { name: "ARIES", image: aries },
  { name: "TAURUS", image: taurus },
  { name: "GEMINI", image: gemini },
  { name: "CANCER", image: cancer },
  { name: "LEO", image: leo },
  { name: "VIRGO", image: virgo },
  { name: "LIBRA", image: libra },
  { name: "SCORPIO", image: scorpio },
  { name: "SAGITTARIUS", image: sagittarius },
  { name: "CAPRICORN", image: capricorn },
  { name: "AQUARIUS", image: aquarius },
  { name: "PISCES", image: pisces }
];
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [horoscopeOpen, setHoroscopeOpen] = useState(false);
  const navigate = distExports.useNavigate();
  const generateServiceUrl = (title) => `/services/${title.toLowerCase().replace(/\s+/g, "-")}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center justify-between px-6 py-4 bg-[#7A1E1E] shadow-md fixed w-full top-0 left-0 z-50", children: [
      /* @__PURE__ */ jsx(distExports.Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsx("img", { src: logo, alt: "Acharya Seemaa Singh logo", className: "h-12 sm:h-13", loading: "lazy" }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex space-x-6 text-lg gap-4 items-center", children: [
        /* @__PURE__ */ jsx(distExports.Link, { to: "/", className: "text-[#FAF9F6] font-serif hover:text-[#F4C430]", children: "Home" }),
        /* @__PURE__ */ jsx(distExports.Link, { to: "/about", className: "text-[#FAF9F6] font-serif hover:text-[#F4C430]", children: "About" }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("button", { className: "text-[#FAF9F6] font-serif hover:text-[#F4C430] transition-colors duration-300", children: "Services" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg w-64 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 divide-y divide-[#F4C430]/30", children: services.map((s) => /* @__PURE__ */ jsx(
            distExports.Link,
            {
              to: generateServiceUrl(s),
              className: "block px-4 py-3 text-[#7A1E1E] hover:bg-[#F4C430]/20 font-serif font-semibold transition-all duration-200",
              children: s
            },
            s
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("button", { className: "text-[#FAF9F6] font-serif hover:text-[#F4C430] transition-colors duration-300", children: "Horoscope" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg w-56 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 divide-y divide-[#F4C430]/30", children: horoscopes.map((h) => /* @__PURE__ */ jsxs(
            distExports.Link,
            {
              to: `/horoscope/${h.name.toLowerCase()}`,
              className: "flex items-center gap-2 px-4 py-2 hover:bg-[#F4C430]/20 transition-all duration-200",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: h.image,
                    alt: h.name,
                    className: "w-8 h-8 rounded-full border border-[#F4C430]/50"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-[#7A1E1E] font-serif font-semibold", children: h.name })
              ]
            },
            h.name
          )) })
        ] }),
        /* @__PURE__ */ jsx(distExports.Link, { to: "/contact", className: "text-[#FAF9F6] font-serif hover:text-[#F4C430]", children: "Contact Us" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/consultation"),
          className: "hidden md:block bg-[#F4C430] text-[#7A1E1E] w-42 py-2 rounded-full font-serif font-semibold cursor-pointer",
          children: "Book Consultation"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex items-center md:hidden", children: /* @__PURE__ */ jsx("button", { className: "text-3xl text-[#F4C430]", onClick: () => setOpen(!open), children: open ? /* @__PURE__ */ jsx(HiOutlineX, {}) : /* @__PURE__ */ jsx(HiOutlineMenu, {}) }) })
    ] }),
    open && /* @__PURE__ */ jsxs("div", { className: "fixed top-0 left-0 h-full w-3/4 bg-white shadow-lg z-50 p-6 flex flex-col gap-4 rounded-r-3xl overflow-y-auto", children: [
      /* @__PURE__ */ jsx(
        distExports.Link,
        {
          to: "/",
          className: "text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430]",
          onClick: () => setOpen(false),
          children: "Home"
        }
      ),
      /* @__PURE__ */ jsx(
        distExports.Link,
        {
          to: "/about",
          className: "text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430]",
          onClick: () => setOpen(false),
          children: "About"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430] w-full text-left",
            onClick: () => setServiceOpen(!serviceOpen),
            children: "Services"
          }
        ),
        serviceOpen && /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-col bg-white shadow-lg rounded-xl p-2 divide-y divide-[#F4C430]/30", children: services.map((s) => /* @__PURE__ */ jsx(
          distExports.Link,
          {
            to: generateServiceUrl(s),
            className: "text-[#7A1E1E] px-3 py-2 hover:bg-[#F4C430]/30 rounded-lg",
            onClick: () => setOpen(false),
            children: s
          },
          s
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430] w-full text-left",
            onClick: () => setHoroscopeOpen(!horoscopeOpen),
            children: "Horoscope"
          }
        ),
        horoscopeOpen && /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-col bg-white shadow-lg rounded-xl p-2 divide-y divide-[#F4C430]/30", children: horoscopes.map((h) => /* @__PURE__ */ jsxs(
          distExports.Link,
          {
            to: `/horoscope/${h.name.toLowerCase()}`,
            className: "flex items-center gap-2 text-[#7A1E1E] px-3 py-2 hover:bg-[#F4C430]/30 rounded-lg",
            onClick: () => setOpen(false),
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: h.image,
                  alt: h.name,
                  className: "w-8 h-8 rounded-full border border-[#F4C430]/50"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "font-serif font-semibold", children: h.name })
            ]
          },
          h.name
        )) })
      ] }),
      /* @__PURE__ */ jsx(
        distExports.Link,
        {
          to: "/contact",
          className: "text-lg text-[#7A1E1E] font-serif hover:text-[#F4C430]",
          onClick: () => setOpen(false),
          children: "Contact Us"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            navigate("/consultation");
            setOpen(false);
          },
          className: "bg-[#F4C430] text-[#7A1E1E] w-48 py-2 rounded-full font-serif font-semibold",
          children: "Book Consultation"
        }
      )
    ] })
  ] });
};
const CountUp = ({ end, duration = 2e3 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          let increment = end / (duration / 16);
          const updateCounter = () => {
            start += increment;
            if (start < end) {
              setCount(Math.ceil(start));
              requestAnimationFrame(updateCounter);
            } else {
              setCount(end);
            }
          };
          updateCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
  }, [end, duration]);
  return /* @__PURE__ */ jsx("span", { ref, children: count });
};
const Seemaa = () => {
  const navigate = distExports.useNavigate();
  return /* @__PURE__ */ jsxs("section", { className: "flex w-full px-4 py-12 bg-[#FAF9F6] flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 animate-slide-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-1 items-center gap-4 animate-slide-up", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center md:flex-col gap-4 md:gap-2", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: Seemaa$1,
              alt: "Seemaa",
              className: "w-36 md:w-80 h-auto object-contain rounded-3xl shadow-xl ring-4 ring-[#F4C430]/50",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:hidden", children: [
            /* @__PURE__ */ jsx("span", { className: "text-l font-bold font-serif text-[#7A1E1E]", children: "Seemaa Singh" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#7A1E1E]/80", children: "Astrologer" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex flex-col items-center mt-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold font-serif text-[#7A1E1E]", children: "Seemaa Singh" }),
          /* @__PURE__ */ jsx("span", { className: "text-lg text-[#7A1E1E]/80", children: "Astrologer" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2 md:space-y-6 text-center md:text-justify animate-slide-up", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-5xl font-serif font-bold text-[#7A1E1E]", children: "Welcome" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm md:text-lg leading-relaxed", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold font-serif text-[#7A1E1E]", children: "SEEMAA" }),
          " – A Research scholar & astrologer. Seemaa carved her niche in the field of astrology since her young age. She was always attracted to the mystery of future-telling and got her education from Bhartiya Vidya Bhawan, Chandigarh, India. After completion of her course in astrology she found herself incomplete and restless because somewhere in her mind she was not satisfied with her studies in astrology. She devoted two years of her life for advanced studies in astrology from her guru who taught her the judicious application and use of Mithraism and Occultism."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center md:justify-start gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                document.getElementById("booking")?.scrollIntoView({
                  behavior: "smooth"
                });
              },
              className: "bg-[#7A1E1E] text-[#FAF9F6] font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:bg-[#F4C430] hover:text-[#7A1E1E] transition text-sm sm:text-base cursor-pointer font-serif",
              children: "Book Consultant"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate("/about"),
              className: "border-2 border-[#7A1E1E] text-[#7A1E1E] font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-[#7A1E1E] hover:text-[#FAF9F6] transition text-sm sm:text-base cursor-pointer font-serif",
              children: "Learn More"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-3 rounded-xl w-full max-w-3xl mx-auto mt-6 animate-slide-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center flex-1", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-l md:text-3xl font-bold text-[#7A1E1E]", children: [
          /* @__PURE__ */ jsx(CountUp, { end: 20 }),
          "+"
        ] }),
        /* @__PURE__ */ jsx("h5", { className: "text-xs md:text-sm text-[#7A1E1E]/80", children: "Years of Experience" })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "w-16 md:w-20 border-[#7A1E1E]/40 md:hidden" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center flex-1", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-l md:text-3xl font-bold text-[#7A1E1E]", children: [
          /* @__PURE__ */ jsx(CountUp, { end: 50 }),
          "K+"
        ] }),
        /* @__PURE__ */ jsx("h5", { className: "text-xs md:text-sm text-[#7A1E1E]/80", children: "Clients" })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "w-16 md:w-20 border-[#7A1E1E]/40 md:hidden" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center flex-1", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-l md:text-3xl font-bold text-[#7A1E1E]", children: [
          /* @__PURE__ */ jsx(CountUp, { end: 25 }),
          "+"
        ] }),
        /* @__PURE__ */ jsx("h5", { className: "text-xs md:text-sm text-[#7A1E1E]/80", children: "Awards" })
      ] })
    ] })
  ] });
};
const serviceBg = "/assets/servicebg-DxSVFZwn.png";
function FaBusinessTime(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 640 512" }, "child": [{ "tag": "path", "attr": { "d": "M496 224c-79.59 0-144 64.41-144 144s64.41 144 144 144 144-64.41 144-144-64.41-144-144-144zm64 150.29c0 5.34-4.37 9.71-9.71 9.71h-60.57c-5.34 0-9.71-4.37-9.71-9.71v-76.57c0-5.34 4.37-9.71 9.71-9.71h12.57c5.34 0 9.71 4.37 9.71 9.71V352h38.29c5.34 0 9.71 4.37 9.71 9.71v12.58zM496 192c5.4 0 10.72.33 16 .81V144c0-25.6-22.4-48-48-48h-80V48c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h395.12c28.6-20.09 63.35-32 100.88-32zM320 96H192V64h128v32zm6.82 224H208c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h291.43C327.1 423.96 320 396.82 320 368c0-16.66 2.48-32.72 6.82-48z" }, "child": [] }] })(props);
}
function FaChartLine(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z" }, "child": [] }] })(props);
}
function FaHashtag(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 448 512" }, "child": [{ "tag": "path", "attr": { "d": "M440.667 182.109l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l14.623-81.891C377.123 38.754 371.468 32 363.997 32h-40.632a12 12 0 0 0-11.813 9.891L296.175 128H197.54l14.623-81.891C213.477 38.754 207.822 32 200.35 32h-40.632a12 12 0 0 0-11.813 9.891L132.528 128H53.432a12 12 0 0 0-11.813 9.891l-7.143 40C33.163 185.246 38.818 192 46.289 192h74.81L98.242 320H19.146a12 12 0 0 0-11.813 9.891l-7.143 40C-1.123 377.246 4.532 384 12.003 384h74.81L72.19 465.891C70.877 473.246 76.532 480 84.003 480h40.632a12 12 0 0 0 11.813-9.891L151.826 384h98.634l-14.623 81.891C234.523 473.246 240.178 480 247.65 480h40.632a12 12 0 0 0 11.813-9.891L315.472 384h79.096a12 12 0 0 0 11.813-9.891l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l22.857-128h79.096a12 12 0 0 0 11.813-9.891zM261.889 320h-98.634l22.857-128h98.634l-22.857 128z" }, "child": [] }] })(props);
}
function FaHeart(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" }, "child": [] }] })(props);
}
function FaHome(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 576 512" }, "child": [{ "tag": "path", "attr": { "d": "M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z" }, "child": [] }] })(props);
}
function FaMoneyBillWave(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 640 512" }, "child": [{ "tag": "path", "attr": { "d": "M621.16 54.46C582.37 38.19 543.55 32 504.75 32c-123.17-.01-246.33 62.34-369.5 62.34-30.89 0-61.76-3.92-92.65-13.72-3.47-1.1-6.95-1.62-10.35-1.62C15.04 79 0 92.32 0 110.81v317.26c0 12.63 7.23 24.6 18.84 29.46C57.63 473.81 96.45 480 135.25 480c123.17 0 246.34-62.35 369.51-62.35 30.89 0 61.76 3.92 92.65 13.72 3.47 1.1 6.95 1.62 10.35 1.62 17.21 0 32.25-13.32 32.25-31.81V83.93c-.01-12.64-7.24-24.6-18.85-29.47zM48 132.22c20.12 5.04 41.12 7.57 62.72 8.93C104.84 170.54 79 192.69 48 192.69v-60.47zm0 285v-47.78c34.37 0 62.18 27.27 63.71 61.4-22.53-1.81-43.59-6.31-63.71-13.62zM320 352c-44.19 0-80-42.99-80-96 0-53.02 35.82-96 80-96s80 42.98 80 96c0 53.03-35.83 96-80 96zm272 27.78c-17.52-4.39-35.71-6.85-54.32-8.44 5.87-26.08 27.5-45.88 54.32-49.28v57.72zm0-236.11c-30.89-3.91-54.86-29.7-55.81-61.55 19.54 2.17 38.09 6.23 55.81 12.66v48.89z" }, "child": [] }] })(props);
}
function FaStarOfLife(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 480 512" }, "child": [{ "tag": "path", "attr": { "d": "M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z" }, "child": [] }] })(props);
}
function FaUserTie(props) {
  return GenIcon({ "attr": { "viewBox": "0 0 448 512" }, "child": [{ "tag": "path", "attr": { "d": "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-56h-96l32 56-32 136-47.8-191.4C56.9 292 0 350.3 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-72.1-56.9-130.4-128.2-133.8z" }, "child": [] }] })(props);
}
const Services = [
  {
    title: "Relationship Challenges",
    desc: "Guidance on overcoming personal conflicts, misunderstandings, and building stronger emotional bonds.",
    icon: /* @__PURE__ */ jsx(FaHeart, { size: 50, className: "text-[#7A1E1E]" })
  },
  {
    title: "Business Setbacks",
    desc: "Insights to navigate obstacles in business ventures, recover from losses, and plan strategic growth.",
    icon: /* @__PURE__ */ jsx(FaBusinessTime, { size: 50, className: "text-[#7A1E1E]" })
  },
  {
    title: "Financial Struggle",
    desc: "Advice on managing financial difficulties, improving budgeting, and attracting prosperity.",
    icon: /* @__PURE__ */ jsx(FaMoneyBillWave, { size: 50, className: "text-[#7A1E1E]" })
  },
  {
    title: "Career Roadblocks",
    desc: "Support for tackling professional challenges, finding growth opportunities, and enhancing career prospects.",
    icon: /* @__PURE__ */ jsx(FaUserTie, { size: 50, className: "text-[#7A1E1E]" })
  },
  {
    title: "Transits of the Month",
    desc: "Astrological transits help forecast future trends and planetary movements affecting your life.",
    icon: /* @__PURE__ */ jsx(FaChartLine, { size: 50, className: "text-[#7A1E1E]" })
  },
  {
    title: "Astro Numerology",
    desc: "Numerology reveals the occult influence of numbers on personality, destiny, and life paths.",
    icon: /* @__PURE__ */ jsx(FaHashtag, { size: 50, className: "text-[#7A1E1E]" })
  },
  {
    title: "Vedic Astrology",
    desc: "Jyotish is the ancient science of light, guiding life decisions through planetary wisdom.",
    icon: /* @__PURE__ */ jsx(FaStarOfLife, { size: 50, className: "text-[#7A1E1E]" })
  },
  {
    title: "Vedic Vastu",
    desc: "Vastu Shastra balances energies of space for peace, prosperity, and harmony.",
    icon: /* @__PURE__ */ jsx(FaHome, { size: 50, className: "text-[#7A1E1E]" })
  }
];
const Service = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setAnimate(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "services",
      ref: sectionRef,
      className: "w-full px-5 py-10 bg-cover bg-center",
      style: { backgroundImage: `url(${serviceBg})` },
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl py-5 font-semibold text-center text-[#7A1E1E] font-serif", children: "Our Services" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto sm:overflow-x-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex gap-6 w-full py-5 sm:grid sm:grid-cols-2 lg:grid-cols-4", children: Services.map((item, index) => {
          const urlName = item.title.toLowerCase().replace(/\s+/g, "-");
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `group relative bg-[#F2EDE8] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center p-6 border-2 border-[#F4C430]/40 ${animate ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`,
              style: { minWidth: "300px" },
              children: [
                /* @__PURE__ */ jsx("div", { className: "p-6 bg-[#F4C430]/20 rounded-3xl mb-4 flex justify-center items-center transition-transform duration-700 group-hover:scale-110", children: item.icon }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-semibold text-[#7A1E1E] mb-2", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm", children: item.desc }),
                /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(distExports.Link, { to: `/services/${urlName}`, children: /* @__PURE__ */ jsx("button", { className: "bg-[#7A1E1E] text-[#F2EDE8] px-6 py-2 rounded-full font-semibold hover:bg-[#5c1515] transition-colors cursor-pointer", children: "Consult Now" }) }) })
              ]
            },
            index
          );
        }) }) })
      ]
    }
  );
};
const award1 = "/assets/award1-oDmKTe-c.webp";
const award2 = "/assets/award2-DuSjJLKZ.webp";
const award3 = "/assets/award3-CMkZJnRh.webp";
const award4 = "/assets/award4-Bcxf7LvZ.webp";
const award5 = "/assets/award5-4PQGiRM4.webp";
const award6 = "/assets/award6-CibUZcYr.webp";
const awardsData = [
  { title: "Achievement One", content: "Short description lorem ipsum text goes here.", image: award1 },
  { title: "Achievement Two", content: "Short description lorem ipsum text goes here.", image: award2 },
  { title: "Achievement Three", content: "Short description lorem ipsum text goes here.", image: award3 },
  { title: "Achievement Four", content: "Short description lorem ipsum text goes here.", image: award4 },
  { title: "Achievement Five", content: "Short description lorem ipsum text goes here.", image: award5 },
  { title: "Achievement Six", content: "Short description lorem ipsum text goes here.", image: award6 }
];
const Awards = () => {
  const [index, setIndex] = useState(0);
  const current = awardsData[index];
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % awardsData.length);
    }, 3e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "relative w-full px-2 sm:px-4 py-8 sm:py-12 bg-[#7A1E1E] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 stars animate-stars z-0" }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-8 left-8 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-12 right-12 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-1/3 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/25 blur-2xl animate-float" })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "relative z-10 text-center text-2xl sm:text-3xl md:text-4xl font-serif text-[#F4C430] mb-6 sm:mb-10", children: "Achievements & Celebrated Faces" }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 max-w-6xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-white shadow-2xl rounded-3xl p-4 sm:p-6 md:p-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 sm:gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 flex flex-col justify-between order-2 md:order-1", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 flex-nowrap md:flex-wrap mb-2 sm:mb-4 no-scrollbar", children: awardsData.map((item, i) => /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => setIndex(i),
            className: `shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden cursor-pointer border-2 transition-all
                      ${index === i ? "grayscale-0 border-[#7A1E1E]" : "grayscale border-transparent opacity-70"}
                    `,
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: item.image,
                alt: "small award",
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            )
          },
          i
        )) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl md:text-2xl font-serif text-[#7A1E1E] mb-2 sm:mb-3", children: current.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm md:text-base text-gray-700 leading-snug sm:leading-relaxed mb-4 sm:mb-6", children: current.content }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIndex((index + 1) % awardsData.length),
              className: "mt-2 sm:mt-4 text-[#7A1E1E] font-semibold hover:underline text-xs sm:text-sm md:text-base w-fit",
              children: "Next →"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 flex justify-center items-center order-1 md:order-2 mb-4 sm:mb-6 md:mb-0", children: /* @__PURE__ */ jsx("div", { className: "w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-[#F4C430]", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: current.image,
          alt: "award",
          className: "w-full h-full object-cover",
          loading: "lazy"
        }
      ) }) })
    ] }) }) })
  ] });
};
const signs$1 = [
  { name: "ARIES", image: aries },
  { name: "TAURUS", image: taurus },
  { name: "GEMINI", image: gemini },
  { name: "CANCER", image: cancer },
  { name: "LEO", image: leo },
  { name: "VIRGO", image: virgo },
  { name: "LIBRA", image: libra },
  { name: "SCORPIO", image: scorpio },
  { name: "SAGITTARIUS", image: sagittarius },
  { name: "CAPRICORN", image: capricorn },
  { name: "AQUARIUS", image: aquarius },
  { name: "PISCES", image: pisces }
];
const Horoscope = () => {
  return /* @__PURE__ */ jsxs("section", { className: "w-full py-14 px-4 bg-[#FFF9F2]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-center text-3xl md:text-4xl font-serif text-[#7A1E1E] mb-4", children: "Know What Your Zodiac Sign Says About You" }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-sm md:text-base text-[#7A1E1E]/80 mb-10", children: "Click on the Rashi to know about your Personality, Traits, Life Predictions, and Remedies!" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-6", children: signs$1.map((sign2, index) => /* @__PURE__ */ jsxs(
      distExports.Link,
      {
        to: `/horoscope/${sign2.name.toLowerCase()}`,
        className: "flex flex-col items-center cursor-pointer group",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: sign2.image,
              alt: sign2.name,
              loading: "lazy",
              className: "w-16 h-16 md:w-18 md:h-18 object-contain"
            }
          ) }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-serif font-semibold tracking-wide text-[#7A1E1E]", children: sign2.name })
        ]
      },
      index
    )) })
  ] });
};
class EmailJSResponseStatus {
  constructor(_status = 0, _text = "Network Error") {
    this.status = _status;
    this.text = _text;
  }
}
const createWebStorage = () => {
  if (typeof localStorage === "undefined")
    return;
  return {
    get: (key) => Promise.resolve(localStorage.getItem(key)),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    remove: (key) => Promise.resolve(localStorage.removeItem(key))
  };
};
const store = {
  origin: "https://api.emailjs.com",
  blockHeadless: false,
  storageProvider: createWebStorage()
};
const buildOptions = (options) => {
  if (!options)
    return {};
  if (typeof options === "string") {
    return {
      publicKey: options
    };
  }
  if (options.toString() === "[object Object]") {
    return options;
  }
  return {};
};
const init = (options, origin = "https://api.emailjs.com") => {
  if (!options)
    return;
  const opts = buildOptions(options);
  store.publicKey = opts.publicKey;
  store.blockHeadless = opts.blockHeadless;
  store.storageProvider = opts.storageProvider;
  store.blockList = opts.blockList;
  store.limitRate = opts.limitRate;
  store.origin = opts.origin || origin;
};
const sendPost = async (url, data2, headers = {}) => {
  const response = await fetch(store.origin + url, {
    method: "POST",
    headers,
    body: data2
  });
  const message = await response.text();
  const responseStatus = new EmailJSResponseStatus(response.status, message);
  if (response.ok) {
    return responseStatus;
  }
  throw responseStatus;
};
const validateParams = (publicKey, serviceID, templateID) => {
  if (!publicKey || typeof publicKey !== "string") {
    throw "The public key is required. Visit https://dashboard.emailjs.com/admin/account";
  }
  if (!serviceID || typeof serviceID !== "string") {
    throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
  }
  if (!templateID || typeof templateID !== "string") {
    throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";
  }
};
const validateTemplateParams = (templateParams) => {
  if (templateParams && templateParams.toString() !== "[object Object]") {
    throw "The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/";
  }
};
const isHeadless = (navigator2) => {
  return navigator2.webdriver || !navigator2.languages || navigator2.languages.length === 0;
};
const headlessError = () => {
  return new EmailJSResponseStatus(451, "Unavailable For Headless Browser");
};
const validateBlockListParams = (list, watchVariable) => {
  if (!Array.isArray(list)) {
    throw "The BlockList list has to be an array";
  }
  if (typeof watchVariable !== "string") {
    throw "The BlockList watchVariable has to be a string";
  }
};
const isBlockListDisabled = (options) => {
  return !options.list?.length || !options.watchVariable;
};
const getValue = (data2, name) => {
  return data2 instanceof FormData ? data2.get(name) : data2[name];
};
const isBlockedValueInParams = (options, params) => {
  if (isBlockListDisabled(options))
    return false;
  validateBlockListParams(options.list, options.watchVariable);
  const value = getValue(params, options.watchVariable);
  if (typeof value !== "string")
    return false;
  return options.list.includes(value);
};
const blockedEmailError = () => {
  return new EmailJSResponseStatus(403, "Forbidden");
};
const validateLimitRateParams = (throttle, id) => {
  if (typeof throttle !== "number" || throttle < 0) {
    throw "The LimitRate throttle has to be a positive number";
  }
  if (id && typeof id !== "string") {
    throw "The LimitRate ID has to be a non-empty string";
  }
};
const getLeftTime = async (id, throttle, storage) => {
  const lastTime = Number(await storage.get(id) || 0);
  return throttle - Date.now() + lastTime;
};
const isLimitRateHit = async (defaultID, options, storage) => {
  if (!options.throttle || !storage) {
    return false;
  }
  validateLimitRateParams(options.throttle, options.id);
  const id = options.id || defaultID;
  const leftTime = await getLeftTime(id, options.throttle, storage);
  if (leftTime > 0) {
    return true;
  }
  await storage.set(id, Date.now().toString());
  return false;
};
const limitRateError = () => {
  return new EmailJSResponseStatus(429, "Too Many Requests");
};
const send = async (serviceID, templateID, templateParams, options) => {
  const opts = buildOptions(options);
  const publicKey = opts.publicKey || store.publicKey;
  const blockHeadless = opts.blockHeadless || store.blockHeadless;
  const storageProvider = opts.storageProvider || store.storageProvider;
  const blockList = { ...store.blockList, ...opts.blockList };
  const limitRate = { ...store.limitRate, ...opts.limitRate };
  if (blockHeadless && isHeadless(navigator)) {
    return Promise.reject(headlessError());
  }
  validateParams(publicKey, serviceID, templateID);
  validateTemplateParams(templateParams);
  if (templateParams && isBlockedValueInParams(blockList, templateParams)) {
    return Promise.reject(blockedEmailError());
  }
  if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) {
    return Promise.reject(limitRateError());
  }
  const params = {
    lib_version: "4.4.1",
    user_id: publicKey,
    service_id: serviceID,
    template_id: templateID,
    template_params: templateParams
  };
  return sendPost("/api/v1.0/email/send", JSON.stringify(params), {
    "Content-type": "application/json"
  });
};
const validateForm = (form) => {
  if (!form || form.nodeName !== "FORM") {
    throw "The 3rd parameter is expected to be the HTML form element or the style selector of the form";
  }
};
const findHTMLForm = (form) => {
  return typeof form === "string" ? document.querySelector(form) : form;
};
const sendForm = async (serviceID, templateID, form, options) => {
  const opts = buildOptions(options);
  const publicKey = opts.publicKey || store.publicKey;
  const blockHeadless = opts.blockHeadless || store.blockHeadless;
  const storageProvider = store.storageProvider || opts.storageProvider;
  const blockList = { ...store.blockList, ...opts.blockList };
  const limitRate = { ...store.limitRate, ...opts.limitRate };
  if (blockHeadless && isHeadless(navigator)) {
    return Promise.reject(headlessError());
  }
  const currentForm = findHTMLForm(form);
  validateParams(publicKey, serviceID, templateID);
  validateForm(currentForm);
  const formData = new FormData(currentForm);
  if (isBlockedValueInParams(blockList, formData)) {
    return Promise.reject(blockedEmailError());
  }
  if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) {
    return Promise.reject(limitRateError());
  }
  formData.append("lib_version", "4.4.1");
  formData.append("service_id", serviceID);
  formData.append("template_id", templateID);
  formData.append("user_id", publicKey);
  return sendPost("/api/v1.0/email/send-form", formData);
};
const emailjs = {
  init,
  send,
  sendForm,
  EmailJSResponseStatus
};
const bookingpic2 = "/assets/bookingpic2-Ck6BjiFy.png";
const BASE_PRICES_INR = { 30: 5100, 60: 7e3, 90: 11e3 };
const BASE_PRICES_CAD = { 30: 150, 60: 200, 90: 250 };
const BOOKED_KEY = "booked_slots_seemaa";
const RATES_KEY = "inr_rates_seemaa";
const RATES_TTL_MS = 6 * 60 * 60 * 1e3;
const COUPON_CODE2 = "DIVIYAVEDIC";
const COUPON_DISCOUNT2 = 0.1;
const COUNTRY_CONFIG = {
  India: { name: "India", tz: "Asia/Kolkata", code: "+91", currency: "INR", symbol: "₹", label: "India (+91)" },
  Canada: { name: "Canada", tz: "America/Toronto", code: "+1", currency: "CAD", symbol: "CA$", label: "Canada (+1)" },
  USA: { name: "USA", tz: "America/New_York", code: "+1", currency: "USD", symbol: "$", label: "USA (+1)" },
  UK: { name: "UK", tz: "Europe/London", code: "+44", currency: "GBP", symbol: "£", label: "United Kingdom (+44)" },
  UAE: { name: "UAE", tz: "Asia/Dubai", code: "+971", currency: "AED", symbol: "AED ", label: "UAE (+971)" },
  Australia: { name: "Australia", tz: "Australia/Sydney", code: "+61", currency: "AUD", symbol: "A$", label: "Australia (+61)" },
  Singapore: { name: "Singapore", tz: "Asia/Singapore", code: "+65", currency: "SGD", symbol: "S$", label: "Singapore (+65)" },
  NewZealand: { name: "New Zealand", tz: "Pacific/Auckland", code: "+64", currency: "NZD", symbol: "NZ$", label: "New Zealand (+64)" },
  Germany: { name: "Germany", tz: "Europe/Berlin", code: "+49", currency: "EUR", symbol: "€", label: "Germany (+49)" },
  France: { name: "France", tz: "Europe/Paris", code: "+33", currency: "EUR", symbol: "€", label: "France (+33)" },
  Italy: { name: "Italy", tz: "Europe/Rome", code: "+39", currency: "EUR", symbol: "€", label: "Italy (+39)" },
  Spain: { name: "Spain", tz: "Europe/Madrid", code: "+34", currency: "EUR", symbol: "€", label: "Spain (+34)" },
  Netherlands: { name: "Netherlands", tz: "Europe/Amsterdam", code: "+31", currency: "EUR", symbol: "€", label: "Netherlands (+31)" },
  Ireland: { name: "Ireland", tz: "Europe/Dublin", code: "+353", currency: "EUR", symbol: "€", label: "Ireland (+353)" },
  Other: { name: "Your local", tz: "UTC", code: "", currency: "USD", symbol: "$", label: "Other country (USD)" }
};
const ISO_TO_KEY = {
  IN: "India",
  CA: "Canada",
  US: "USA",
  GB: "UK",
  AE: "UAE",
  AU: "Australia",
  SG: "Singapore",
  NZ: "NewZealand",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  IE: "Ireland"
};
const FALLBACK_RATES = {
  INR: 1,
  CAD: 0.01473,
  USD: 0.01055,
  EUR: 942e-5,
  GBP: 82e-4,
  AED: 0.03875,
  AUD: 0.0161,
  SGD: 0.0137,
  NZD: 0.0182
};
const ceilTo5 = (n) => Math.ceil(n / 5 - 1e-9) * 5;
const round2 = (n) => Math.round(n * 100) / 100;
const fmtAmt = (n) => Number.isInteger(n) ? String(n) : n.toFixed(2);
function getLocalPrice(duration, currency, rates) {
  if (currency === "INR") return BASE_PRICES_INR[duration];
  if (currency === "CAD") return BASE_PRICES_CAD[duration];
  const perCad = (rates[currency] ?? FALLBACK_RATES[currency]) / (rates.CAD ?? FALLBACK_RATES.CAD);
  return ceilTo5(BASE_PRICES_CAD[duration] * perCad);
}
function readCachedRates(onlyFresh = false) {
  try {
    const c = JSON.parse(localStorage.getItem(RATES_KEY) || "null");
    if (!c || !c.rates) return null;
    if (onlyFresh && Date.now() - c.ts > RATES_TTL_MS) return null;
    return { ...FALLBACK_RATES, ...c.rates };
  } catch {
    return null;
  }
}
async function fetchLiveRates() {
  const cached = readCachedRates(true);
  if (cached) return cached;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5e3);
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      signal: ctrl.signal
    });
    clearTimeout(timer);
    const data2 = await res.json();
    if (data2 && data2.result === "success" && data2.rates) {
      const rates = { INR: 1 };
      Object.values(COUNTRY_CONFIG).forEach((c) => {
        if (data2.rates[c.currency]) rates[c.currency] = data2.rates[c.currency];
      });
      localStorage.setItem(
        RATES_KEY,
        JSON.stringify({ ts: Date.now(), rates })
      );
      return { ...FALLBACK_RATES, ...rates };
    }
  } catch {
  }
  return null;
}
const CANADA_TZ = /* @__PURE__ */ new Set([
  "America/Toronto",
  "America/Vancouver",
  "America/Edmonton",
  "America/Winnipeg",
  "America/Halifax",
  "America/St_Johns",
  "America/Regina",
  "America/Montreal",
  "America/Moncton",
  "America/Glace_Bay",
  "America/Goose_Bay",
  "America/Whitehorse",
  "America/Yellowknife",
  "America/Iqaluit",
  "America/Thunder_Bay",
  "America/Nipigon"
]);
const US_TZ = /* @__PURE__ */ new Set([
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "America/Detroit",
  "America/Boise",
  "America/Juneau",
  "America/Adak",
  "Pacific/Honolulu"
]);
const TZ_TO_KEY = {
  "Asia/Kolkata": "India",
  "Asia/Calcutta": "India",
  "Europe/London": "UK",
  "Asia/Dubai": "UAE",
  "Asia/Singapore": "Singapore",
  "Pacific/Auckland": "NewZealand",
  "Europe/Berlin": "Germany",
  "Europe/Paris": "France",
  "Europe/Rome": "Italy",
  "Europe/Madrid": "Spain",
  "Europe/Amsterdam": "Netherlands",
  "Europe/Dublin": "Ireland"
};
function tzToKey(tz) {
  if (!tz) return "Other";
  if (CANADA_TZ.has(tz)) return "Canada";
  if (US_TZ.has(tz) || tz.startsWith("America/Indiana/") || tz.startsWith("America/Kentucky/") || tz.startsWith("America/North_Dakota/"))
    return "USA";
  if (tz.startsWith("Australia/")) return "Australia";
  return TZ_TO_KEY[tz] || "Other";
}
function safeTz(tz) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return null;
  }
}
async function detectLocation() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4e3);
    const res = await fetch("https://ipapi.co/json/", { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d && d.country_code) {
        return {
          key: ISO_TO_KEY[d.country_code] || "Other",
          tz: d.timezone ? safeTz(d.timezone) : null
        };
      }
    }
  } catch {
  }
  const tz = safeTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return { key: tzToKey(tz), tz };
}
function tzAbbr(tz) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short"
    }).formatToParts(/* @__PURE__ */ new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value || tz;
  } catch {
    return tz;
  }
}
function generateSlots(durationMinutes) {
  const slots = [];
  const dayStart = 10 * 60;
  const dayEnd = 16 * 60;
  for (let t = dayStart; t + durationMinutes <= dayEnd; t += durationMinutes) {
    const startH = Math.floor(t / 60);
    const startM = t % 60;
    const endT = t + durationMinutes;
    const endH = Math.floor(endT / 60);
    const endM = endT % 60;
    const fmt = (h, m) => {
      const suffix = h >= 12 ? "PM" : "AM";
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${display}:${String(m).padStart(2, "0")} ${suffix}`;
    };
    slots.push({
      startH,
      startM,
      endH,
      endM,
      label: `${fmt(startH, startM)} – ${fmt(endH, endM)}`,
      key: `${startH}:${String(startM).padStart(2, "0")}-${endH}:${String(endM).padStart(2, "0")}`
    });
  }
  return slots;
}
function getNowInTZ(tz) {
  const now = /* @__PURE__ */ new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return {
    year: parseInt(get("year")),
    month: parseInt(get("month")) - 1,
    day: parseInt(get("day")),
    hour: parseInt(get("hour")) % 24,
    minute: parseInt(get("minute"))
  };
}
function getAvailableDates(tz) {
  const now = getNowInTZ(tz);
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(now.year, now.month, now.day + i);
    dates.push(d);
  }
  return dates;
}
function getFirstAllowedMinutes(nowHour, nowMinute, durationMinutes) {
  const nowTotal = nowHour * 60 + nowMinute;
  if (durationMinutes === 30) return Math.ceil((nowTotal + 60) / 30) * 30;
  if (durationMinutes === 60)
    return nowMinute < 30 ? (nowHour + 1) * 60 : (nowHour + 2) * 60;
  if (durationMinutes === 90) {
    const base = nowMinute < 30 ? (nowHour + 1) * 60 : (nowHour + 2) * 60;
    let s = 10 * 60;
    while (s < base) s += 90;
    return s;
  }
  return (nowHour + 1) * 60;
}
function loadBooked() {
  try {
    return JSON.parse(localStorage.getItem(BOOKED_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveBooked(data2) {
  localStorage.setItem(BOOKED_KEY, JSON.stringify(data2));
}
function getBookedRangesForDate(dateKey) {
  const booked = loadBooked();
  const ranges = [];
  Object.keys(booked).forEach((k) => {
    if (!k.startsWith(dateKey + "_")) return;
    const slotKey = k.replace(dateKey + "_", "");
    const match = slotKey.match(/^(\d+):(\d+)-(\d+):(\d+)$/);
    if (!match) return;
    const startMin = parseInt(match[1]) * 60 + parseInt(match[2]);
    const endMin = parseInt(match[3]) * 60 + parseInt(match[4]);
    if (!isNaN(startMin) && !isNaN(endMin) && endMin > startMin) {
      ranges.push({ start: startMin, end: endMin });
    }
  });
  return ranges;
}
function slotOverlapsBooked(slot, bookedRanges) {
  const s = slot.startH * 60 + slot.startM;
  const e = slot.endH * 60 + slot.endM;
  return bookedRanges.some((r) => s < r.end && e > r.start);
}
function isPastCutoff(slot, now, durationMinutes, isToday) {
  if (!isToday) return false;
  return slot.startH * 60 + slot.startM < getFirstAllowedMinutes(now.hour, now.minute, durationMinutes);
}
function formatDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getAvailableSlotsForDate(dateObj, tz, durationMinutes) {
  const now = getNowInTZ(tz);
  const isToday = dateObj.getFullYear() === now.year && dateObj.getMonth() === now.month && dateObj.getDate() === now.day;
  const dateKey = formatDateKey(dateObj);
  const bookedRanges = getBookedRangesForDate(dateKey);
  return generateSlots(durationMinutes).filter((slot) => {
    if (isPastCutoff(slot, now, durationMinutes, isToday)) return false;
    if (slotOverlapsBooked(slot, bookedRanges)) return false;
    return true;
  });
}
function SlotPicker({
  tz,
  onSelect,
  selectedDate,
  selectedSlot,
  durationMinutes
}) {
  const dates = getAvailableDates(tz);
  const [activeDate, setActiveDate] = useState(selectedDate || dates[0]);
  const dateKey = formatDateKey(activeDate);
  const bookedRanges = getBookedRangesForDate(dateKey);
  const now = getNowInTZ(tz);
  const isToday = activeDate.getFullYear() === now.year && activeDate.getMonth() === now.month && activeDate.getDate() === now.day;
  const allSlots = generateSlots(durationMinutes);
  const availableSlots = getAvailableSlotsForDate(
    activeDate,
    tz,
    durationMinutes
  );
  const visibleSlots = allSlots.filter(
    (slot) => !isPastCutoff(slot, now, durationMinutes, isToday)
  );
  const handleDateClick = (d) => {
    setActiveDate(d);
    onSelect(d, null);
  };
  const handleSlotClick = (slot) => {
    if (!slotOverlapsBooked(slot, bookedRanges)) onSelect(activeDate, slot);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[0.78rem] font-semibold text-[#7A1E1E] uppercase tracking-[0.05em] mb-2", children: "Select Date" }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1.5 no-scrollbar", children: dates.map((d, i) => {
      const isSel = formatDateKey(activeDate) === formatDateKey(d);
      const hasSlots = getAvailableSlotsForDate(d, tz, durationMinutes).length > 0;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleDateClick(d),
          disabled: !hasSlots,
          className: `shrink-0 flex flex-col items-center px-2.5 py-2 rounded-xl border-[1.5px] min-w-13 cursor-pointer transition-all
                ${isSel ? "bg-[#7A1E1E] border-[#7A1E1E]" : "bg-white border-[#e0c9a6] hover:border-[#7A1E1E] hover:bg-[#fff6ee]"}
                ${!hasSlots ? "opacity-35 cursor-not-allowed" : ""}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: `date-chip__day ${isSel ? "text-white" : ""}`, children: d.toLocaleDateString("en-US", { weekday: "short" }) }),
            /* @__PURE__ */ jsx("span", { className: `date-chip__num ${isSel ? "text-white" : ""}`, children: d.getDate() }),
            /* @__PURE__ */ jsx("span", { className: `date-chip__mon ${isSel ? "text-white" : ""}`, children: d.toLocaleDateString("en-US", { month: "short" }) })
          ]
        },
        i
      );
    }) }),
    /* @__PURE__ */ jsx("p", { className: "text-[0.78rem] font-semibold text-[#7A1E1E] uppercase tracking-[0.05em] mb-2 mt-4", children: "Select Time Slot" }),
    visibleSlots.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-[0.82rem] text-gray-400 text-center py-3", children: "No slots available for today. Please choose another date." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: visibleSlots.map((slot) => {
      const isOverlapping = slotOverlapsBooked(slot, bookedRanges);
      const isAvailable = availableSlots.some((s) => s.key === slot.key);
      const isSel = selectedSlot?.key === slot.key && selectedDate && formatDateKey(activeDate) === formatDateKey(selectedDate);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSlotClick(slot),
          disabled: isOverlapping || !isAvailable,
          className: `relative py-2.5 px-2 rounded-[10px] border-[1.5px] text-[0.82rem] font-medium text-center transition-all
                  ${isSel ? "bg-[#7A1E1E] border-[#7A1E1E] text-white" : ""}
                  ${isOverlapping ? "bg-[#f0ebe4] text-[#bbb] cursor-not-allowed border-[#ddd]" : ""}
                  ${!isSel && !isOverlapping ? "bg-white border-[#e0c9a6] text-[#3a1a1a] cursor-pointer hover:border-[#7A1E1E] hover:bg-[#fff6ee]" : ""}`,
          children: [
            slot.label,
            isOverlapping && /* @__PURE__ */ jsx("span", { className: "slot-booked-tag", children: "Booked" })
          ]
        },
        slot.key
      );
    }) })
  ] });
}
const Booking = () => {
  const form = useRef();
  const userPickedCountry = useRef(false);
  const [duration, setDuration] = useState("30");
  const [step, setStep] = useState("price");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  const [isSending, setIsSending] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [showLongNote, setShowLongNote] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [country, setCountry] = useState("India");
  const [detected, setDetected] = useState(null);
  const [rates, setRates] = useState(() => readCachedRates() || FALLBACK_RATES);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const cfg = COUNTRY_CONFIG[country];
  const tz = detected && detected.key === country && detected.tz ? detected.tz : cfg.tz;
  const tzLabel = tzAbbr(tz);
  const timeName = `${cfg.name} time`;
  const durationMinutes = duration === "30" ? 30 : duration === "60" ? 60 : 90;
  const basePrice = getLocalPrice(duration, cfg.currency, rates);
  cfg.currency === "INR" ? BASE_PRICES_INR[duration] : Math.round(
    basePrice / (rates[cfg.currency] ?? FALLBACK_RATES[cfg.currency])
  );
  const appliedDiscount = appliedCouponCode === COUPON_CODE2 ? COUPON_DISCOUNT2 : 0;
  const applyDiscount = (amount, currency) => currency === "INR" ? Math.round(amount * (1 - appliedDiscount)) : round2(amount * (1 - appliedDiscount));
  const finalPrice = couponApplied ? applyDiscount(basePrice, cfg.currency) : basePrice;
  const discount = round2(basePrice - finalPrice);
  const chargeCurrency = cfg.currency;
  const chargeAmount = finalPrice;
  const money = (n, dash = true) => cfg.currency === "INR" ? `₹${fmtAmt(n)}${dash ? "/-" : ""}` : `${cfg.symbol}${fmtAmt(n)}`;
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    let cancelled = false;
    detectLocation().then((loc) => {
      if (cancelled || !loc) return;
      setDetected(loc);
      if (!userPickedCountry.current) setCountry(loc.key);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    fetchLiveRates().then((r) => {
      if (!cancelled && r) setRates(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const handleSlotSelect = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    if (slot !== null) setShowSlotPicker(false);
  };
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === COUPON_CODE2) {
      setAppliedCouponCode(COUPON_CODE2);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code.");
      setCouponApplied(false);
    }
  };
  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponInput("");
    setCouponError("");
    setAppliedCouponCode("");
  };
  const getBookingDateStr = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long"
    });
  };
  const getBookingTimeStr = () => selectedSlot ? `${selectedSlot.label} (${cfg.name} time, ${tzLabel})` : "";
  const loadRazorpayScript2 = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    if (isSending) return;
    if (!selectedDate || !selectedSlot) {
      alert("Please select a date and time slot before confirming.");
      return;
    }
    const res = await loadRazorpayScript2();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const options = {
      key: "rzp_live_SlWNuGVbsl0XQU",
      amount: Math.round(chargeAmount * 100),
      currency: chargeCurrency,
      name: "Acharya Seemaa Singh",
      description: `${durationMinutes} Min Consultation`,
      image: bookingpic2,
      handler: function(response) {
        console.log("Payment Success:", response.razorpay_payment_id);
        finalizeBooking(response.razorpay_payment_id);
      },
      prefill: {
        name: form.current.user_name.value,
        email: form.current.user_email.value,
        contact: `${cfg.code}${form.current.user_phone.value}`
      },
      notes: {
        address: "Consultation Booking",
        date: getBookingDateStr(),
        time: getBookingTimeStr(),
        country: cfg.name
      },
      theme: {
        color: "#7A1E1E"
      }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  const finalizeBooking = (paymentId) => {
    setIsSending(true);
    const booked = loadBooked();
    const key = `${formatDateKey(selectedDate)}_${selectedSlot.key}`;
    booked[key] = true;
    saveBooked(booked);
    emailjs.sendForm(
      "service_astrology",
      "template_az2acka",
      form.current,
      "V_nIV9ssCU2IIcTBB"
    ).then(() => {
      alert(
        `Payment Successful! (Ref: ${paymentId}). Your booking is confirmed.`
      );
      setStep("price");
      setSelectedDate(null);
      setSelectedSlot(null);
      setCouponApplied(false);
      setCouponInput("");
      setAppliedCouponCode("");
    }).catch((err) => {
      console.error(err);
      alert(
        "Payment was successful but email notification failed. Please contact support."
      );
    }).finally(() => setIsSending(false));
  };
  const slotButtonLabel = selectedDate && selectedSlot ? `${selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${selectedSlot.label}` : "Pick a Slot";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      "section",
      {
        id: "booking",
        className: "w-full bg-[#FAF9F6] py-14 px-4 flex justify-center",
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl w-full", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-center font-serif text-3xl md:text-4xl mb-2", children: [
            "Choose Your ",
            /* @__PURE__ */ jsx("span", { className: "text-[#7A1E1E]", children: "Consultation" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-center text-sm md:text-base text-gray-600 mb-10", children: "Trusted astrologer with proven experience, ready to guide you with clarity and practical solutions" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-center items-start gap-4 transition-all duration-500", children: [
            (step === "price" || !isMobile && step === "form") && /* @__PURE__ */ jsxs(
              "div",
              {
                className: `bg-[#FFF6E8] rounded-2xl border-2 border-[#7A1E1E] p-4 shadow-xl flex flex-col transition-all duration-500
                ${isMobile ? "w-full max-w-sm mx-auto" : step === "form" ? "w-1/2" : "w-full max-w-md mx-auto"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: bookingpic2,
                      alt: "Astrologer Seemaa Ji",
                      loading: "lazy",
                      className: `rounded-xl mx-auto object-cover ${isMobile ? "h-32 w-32" : "h-50 w-50"}`
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: `text-center font-serif ${isMobile ? "text-base" : "text-lg"} mb-1`,
                      children: "Acharya Seemaa Singh"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: `text-center text-gray-600 mb-4 ${isMobile ? "text-xs" : "text-sm"}`,
                      children: "20+ Years Experience | 50,000+ Clients"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "ul",
                    {
                      className: `text-gray-700 space-y-1 mb-5 ${isMobile ? "text-xs" : "text-sm"}`,
                      children: [
                        /* @__PURE__ */ jsx("li", { children: "✔ Clear, actionable guidance" }),
                        /* @__PURE__ */ jsx("li", { children: "✔ Simple & effective remedies" }),
                        /* @__PURE__ */ jsx("li", { children: "✔ Detailed predictions" }),
                        /* @__PURE__ */ jsx("li", { children: "✔ Career & relationship advice" }),
                        /* @__PURE__ */ jsx("li", { children: "✔ Personalized astrological insights" }),
                        /* @__PURE__ */ jsx("li", { children: "✔ Practical solutions for daily life" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: `font-semibold mb-2 ${isMobile ? "text-xs" : "text-sm"}`,
                        children: "Online Consultation Duration"
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["30", "60", "90"].map((t) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => {
                          setDuration(t);
                          if (t === "90") setShowLongNote(true);
                          setSelectedDate(null);
                          setSelectedSlot(null);
                        },
                        className: `flex-1 py-2 rounded-lg text-sm border cursor-pointer ${duration === t ? "bg-[#7A1E1E] text-white" : "bg-white text-[#7A1E1E]"}`,
                        children: t === "30" ? "30 Min" : t === "60" ? "1 Hour" : "1+ Hour"
                      },
                      t
                    )) }),
                    duration === "90" && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: "Note: the 1+ Hour session lasts between 1 hour and 1 hour 30 minutes, and never more than 90 minutes." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-auto", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `font-semibold ${isMobile ? "text-sm" : "text-lg"}`,
                        children: money(basePrice)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "bg-[#7A1E1E] text-white px-4 py-1.5 rounded-lg hover:bg-[#5e1515] cursor-pointer",
                        onClick: () => setStep("form"),
                        children: "Proceed"
                      }
                    )
                  ] })
                ]
              }
            ),
            (step === "form" || isMobile && step === "form") && /* @__PURE__ */ jsxs(
              "div",
              {
                className: `bg-[#FAF9F6] rounded-2xl border border-[#E7C9A5] p-6 flex-1 transition-all duration-500
                ${isMobile ? "w-full max-w-sm mx-auto mt-6" : "w-1/2"}`,
                children: [
                  isMobile && /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setStep("price"),
                      className: "text-[#7A1E1E] font-semibold mb-4 flex items-center gap-2",
                      children: "← Back"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
                    /* @__PURE__ */ jsx(
                      "h3",
                      {
                        className: `font-serif text-[#7A1E1E] text-center w-full ${isMobile ? "text-lg" : "text-2xl"}`,
                        children: "Book Your Appointment"
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "text-right whitespace-nowrap", children: couponApplied ? /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "line-through text-gray-400 text-sm", children: money(basePrice, false) }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `font-semibold text-[#7A1E1E] ml-1 ${isMobile ? "text-sm" : "text-lg"}`,
                          children: money(finalPrice)
                        }
                      )
                    ] }) : /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `font-semibold text-[#7A1E1E] ${isMobile ? "text-sm" : "text-lg"}`,
                        children: money(basePrice)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "form",
                    {
                      ref: form,
                      onSubmit: handlePayment,
                      className: "grid grid-cols-1 gap-4",
                      children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "hidden",
                            name: "booking_duration",
                            value: durationMinutes
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "hidden",
                            name: "booking_price",
                            value: chargeAmount
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "hidden",
                            name: "booking_currency",
                            value: chargeCurrency
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "hidden",
                            name: "booking_date",
                            value: getBookingDateStr()
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "hidden",
                            name: "booking_time",
                            value: getBookingTimeStr()
                          }
                        ),
                        /* @__PURE__ */ jsx("input", { type: "hidden", name: "country_code", value: cfg.code }),
                        /* @__PURE__ */ jsx("input", { type: "hidden", name: "client_country", value: cfg.name }),
                        /* @__PURE__ */ jsx("input", { type: "hidden", name: "client_timezone", value: tz }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "hidden",
                            name: "coupon_applied",
                            value: couponApplied ? `${appliedCouponCode} (-${Math.round(appliedDiscount * 100)}%)` : "No coupon used"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "hidden",
                            name: "coupon_code_entered",
                            value: couponApplied ? appliedCouponCode : couponInput || "None"
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              name: "user_name",
                              placeholder: "Name",
                              required: true,
                              className: "bg-[#7A1E1E] text-white placeholder-white p-3 rounded-lg outline-none"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "email",
                              name: "user_email",
                              placeholder: "Email",
                              required: true,
                              className: "bg-[#7A1E1E] text-white placeholder-white p-3 rounded-lg outline-none"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide", children: "Your Country" }),
                            /* @__PURE__ */ jsx(
                              "select",
                              {
                                className: "country-select",
                                value: country,
                                onChange: (e) => {
                                  userPickedCountry.current = true;
                                  setCountry(e.target.value);
                                  setSelectedDate(null);
                                  setSelectedSlot(null);
                                },
                                children: Object.entries(COUNTRY_CONFIG).map(([k, v]) => /* @__PURE__ */ jsx("option", { value: k, children: v.label }, k))
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide", children: "Phone Number" }),
                            /* @__PURE__ */ jsxs("div", { className: "flex rounded-[10px] overflow-hidden", children: [
                              /* @__PURE__ */ jsx("div", { className: "bg-[#5e1515] text-white text-[0.88rem] font-semibold px-3 flex items-center whitespace-nowrap shrink-0 border-r border-white/20", children: cfg.code || "🌐" }),
                              /* @__PURE__ */ jsx(
                                "input",
                                {
                                  type: "tel",
                                  name: "user_phone",
                                  placeholder: cfg.code ? "Number" : "With country code",
                                  required: true,
                                  className: "flex-1 min-w-0 bg-[#7A1E1E] text-white border-none outline-none px-3 py-3 text-[0.9rem] placeholder-white/70"
                                }
                              )
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide", children: [
                            "Appointment Slot · ",
                            cfg.name,
                            " Time · ",
                            durationMinutes,
                            " Min Online Session"
                          ] }),
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              type: "button",
                              className: "w-full px-4 py-3 rounded-[10px] border-[1.5px] border-[#7A1E1E] bg-white text-[#7A1E1E] font-semibold text-[0.9rem] cursor-pointer flex items-center justify-between hover:bg-[#fff6ee] transition-all",
                              onClick: () => setShowSlotPicker(true),
                              children: [
                                /* @__PURE__ */ jsx("span", { children: slotButtonLabel }),
                                /* @__PURE__ */ jsx("span", { children: "🗓" })
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxs("p", { className: "text-[0.72rem] text-gray-500 mt-1", children: [
                            "All slot times are in ",
                            timeName,
                            " (",
                            tzLabel,
                            ")."
                          ] }),
                          duration === "90" && /* @__PURE__ */ jsx("p", { className: "text-[0.72rem] font-semibold text-red-600 mt-1", children: "Note: the 1+ Hour session lasts between 1 hour and 1 hour 30 minutes, never more than 90 minutes." })
                        ] }),
                        /* @__PURE__ */ jsx(
                          "textarea",
                          {
                            name: "user_message",
                            rows: "3",
                            placeholder: "Message (for specific question)",
                            className: "bg-[#7A1E1E] text-white placeholder-white/70 p-3 rounded-lg outline-none"
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide", children: "Coupon Code" }),
                          couponApplied ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-green-50 border border-green-300 rounded-lg px-4 py-2.5", children: [
                            /* @__PURE__ */ jsxs("div", { children: [
                              /* @__PURE__ */ jsxs("span", { className: "text-green-700 font-semibold text-sm", children: [
                                appliedCouponCode,
                                " applied!"
                              ] }),
                              /* @__PURE__ */ jsxs("span", { className: "text-green-600 text-xs ml-2", children: [
                                "−",
                                money(discount, false),
                                " (",
                                Math.round(appliedDiscount * 100),
                                "% off)"
                              ] })
                            ] }),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: removeCoupon,
                                className: "text-red-400 text-xs underline cursor-pointer",
                                children: "Remove"
                              }
                            )
                          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "text",
                                value: couponInput,
                                onChange: (e) => {
                                  setCouponInput(e.target.value.toUpperCase());
                                  setCouponError("");
                                },
                                placeholder: "Enter Coupon Code",
                                className: "flex-1 bg-[#7A1E1E] text-white placeholder-white/60 p-3 rounded-lg outline-none uppercase tracking-widest text-sm"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                onClick: applyCoupon,
                                className: "bg-[#cbb05f] text-[#3B1F1B] px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-[#e0ca7a] transition-all whitespace-nowrap",
                                children: "Apply"
                              }
                            )
                          ] }),
                          couponError && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: couponError })
                        ] }),
                        false,
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-1", children: [
                          couponApplied && /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
                            /* @__PURE__ */ jsx("span", { children: "Total: " }),
                            /* @__PURE__ */ jsx("span", { className: "line-through text-gray-400", children: money(basePrice, false) }),
                            /* @__PURE__ */ jsx("span", { className: "text-[#7A1E1E] font-bold ml-1", children: money(finalPrice, false) }),
                            /* @__PURE__ */ jsxs("span", { className: "text-green-600 text-xs ml-1", children: [
                              "(saved ",
                              money(discount, false),
                              ")"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "submit",
                              disabled: isSending || !selectedDate || !selectedSlot,
                              className: `${couponApplied ? "" : "w-full"} bg-[#7A1E1E] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#5e1515] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`,
                              children: isSending ? "Sending…" : "Confirm Booking"
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("hr", { className: "bg-[#7A1E1E] w-full h-0.5" }),
    showLongNote && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowLongNote(false);
        },
        children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-[#E7C9A5]", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-serif text-lg text-[#7A1E1E] mb-2", children: "About the 1+ Hour session" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 font-semibold leading-relaxed", children: "This session lasts between 1 hour and 1 hour 30 minutes. It will never be longer than 90 minutes." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowLongNote(false),
              className: "mt-5 bg-[#7A1E1E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#5e1515] cursor-pointer",
              children: "Got it"
            }
          )
        ] })
      }
    ),
    showSlotPicker && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4",
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowSlotPicker(false);
        },
        children: /* @__PURE__ */ jsxs("div", { className: "slot-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-base font-bold text-[#7A1E1E]", children: [
              "📅 Select Your Slot (",
              cfg.name,
              " Time · ",
              tzLabel,
              " ·",
              " ",
              durationMinutes,
              " Min)"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "bg-transparent border-none text-[1.4rem] text-[#7A1E1E] cursor-pointer leading-none",
                onClick: () => setShowSlotPicker(false),
                children: "✕"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            SlotPicker,
            {
              tz,
              onSelect: handleSlotSelect,
              selectedDate,
              selectedSlot,
              durationMinutes
            },
            `${tz}-${durationMinutes}`
          ),
          selectedDate && selectedSlot && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowSlotPicker(false),
              className: "w-full mt-4 bg-[#7A1E1E] text-white py-2.5 rounded-xl font-semibold hover:bg-[#5e1515] cursor-pointer",
              children: "Confirm Slot ✓"
            }
          )
        ] })
      }
    )
  ] });
};
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Icon = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("volume-2", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("volume-x", __iconNode);
const news1 = "/assets/denikbhaskar-DmPARsiJ.webp";
const news2 = "/assets/fwtv-DGJ4P_9l.webp";
const news3 = "/assets/indianews-KTChbOhL.webp";
const news4 = "/assets/zsangam-DuJtGYun.webp";
const news5 = "/assets/jantatv-DWKjshnv.webp";
const news6 = "/assets/liveindia-CYV3W-yK.webp";
const news7 = "/assets/omnitv-BvIuE3x1.webp";
const news8 = "/assets/ptcnews-Bb6OFEek.webp";
const news9 = "/assets/spaceradio-CfwbAnXB.webp";
const news10 = "/assets/yugmarg-DtwUVWfh.webp";
const defaultTestimonials = [
  {
    text: "Seemaa is an amazing astrologer! Her insights into my career and personal life were incredibly accurate and helped me make the right decisions.",
    name: "— Riya Sharma"
  },
  {
    text: "I was skeptical at first, but her guidance truly changed my perspective. Highly recommended for clarity and peace.",
    name: "— Aman Verma"
  },
  {
    text: "Her readings are deeply intuitive and precise. I felt understood and guided in the right direction.",
    name: "— Neha Kapoor"
  },
  {
    text: "Very calm, knowledgeable, and accurate. The remedies she suggested worked beautifully for me.",
    name: "— Rohit Mehta"
  }
];
const mediaNews = [
  news1,
  news2,
  news3,
  news4,
  news5,
  news6,
  news7,
  news8,
  news9,
  news10
];
const Review = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [testimonials, setTestimonials] = useState(() => {
    if (typeof window === "undefined") return defaultTestimonials;
    try {
      const saved = localStorage.getItem("testimonials");
      return saved ? JSON.parse(saved) : defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    localStorage.setItem("testimonials", JSON.stringify(testimonials));
  }, [testimonials]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setAnimate(true),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message) return;
    setTestimonials([
      { text: message, name: `— ${name}` },
      ...testimonials
    ]);
    setName("");
    setMessage("");
    setShowForm(false);
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: sectionRef,
      className: "flex flex-col md:flex-row w-full items-center justify-center bg-[#FAF9F6] gap-10 px-6 py-12",
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `w-full md:w-1/2 flex flex-col items-center justify-center text-[#7A1E1E]
        transition-all duration-700 ${animate ? "animate-left-right" : "opacity-0 -translate-x-10"}`,
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-serif mb-6", children: "Featured & Trusted" }),
              /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-auto scrollbar-hide", children: /* @__PURE__ */ jsx("div", { className: "flex gap-6 min-w-max px-4", children: mediaNews.map((img, index) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white flex items-center justify-center",
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: img,
                      alt: "",
                      className: "w-full h-full object-cover scale-125",
                      loading: "lazy"
                    }
                  )
                },
                index
              )) }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("hr", { className: "hidden md:block bg-[#7A1E1E] w-px h-48" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `w-full md:w-1/2 flex flex-col items-center justify-center text-[#7A1E1E]
        transition-all duration-700 ${animate ? "animate-right-left" : "opacity-0 translate-x-10"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-serif", children: "What People Think" }),
                /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowForm(!showForm),
                      className: "p-2 rounded-full bg-[#7A1E1E]/10 hover:bg-[#7A1E1E]/20 transition",
                      children: /* @__PURE__ */ jsx(Pencil, { size: 18 })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#7A1E1E] text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition", children: "Add your review" })
                ] })
              ] }),
              showForm && /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: handleSubmit,
                  className: "w-full max-w-md mb-4 bg-white p-4 rounded-xl shadow space-y-3",
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Your name",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        className: "w-full border rounded-lg px-3 py-2 text-sm"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        placeholder: "Write your review...",
                        value: message,
                        onChange: (e) => setMessage(e.target.value),
                        className: "w-full border rounded-lg px-3 py-2 text-sm resize-none h-24"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        className: "w-full bg-[#7A1E1E] text-white py-2 rounded-lg text-sm hover:opacity-90",
                        children: "Submit Review"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-full max-w-md h-46 p-6 bg-[#7A1E1E]/10 rounded-2xl overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#7A1E1E]/40", children: testimonials.map((item, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "bg-white/70 rounded-xl p-4 text-center shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#4B2E2B] mb-3", children: [
                      '"',
                      item.text,
                      '"'
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#7A1E1E]", children: item.name })
                  ]
                },
                index
              )) })
            ]
          }
        )
      ]
    }
  );
};
const bookImg1 = "/assets/book-CXuvLV96.webp";
const bookImg3 = "/assets/book3-B3NRM9-p.webp";
const bookImg4 = "/assets/book4-Dcxt-NKJ.webp";
const tarotVideo = "/assets/Tarotvid-C_R6_UHN.mp4";
const books = [
  {
    title: "Healing Through Mantra",
    author: "Seemaa Singh",
    image: bookImg3,
    description: "The present book is an attempt to develop the human potential through Mantra."
  },
  {
    title: "Tarot for Beginners",
    author: "Seemaa Singh",
    image: bookImg1,
    description: "Learn the basics of Tarot reading and discover how to interpret cards for insight and guidance."
  },
  {
    title: "The Rock That Was Not",
    author: "Seemaa Singh",
    image: bookImg4,
    description: "An inspiring story about finding inner strength, overcoming challenges, and spiritual growth."
  }
];
const BookCard = ({ book, animate }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `
      relative bg-white rounded-3xl shadow-2xl overflow-hidden
      flex flex-col items-center p-3 sm:p-4 md:p-6 transition-transform duration-300 hover:scale-105
      max-h-112 md:max-h-96
      ${animate ? "animate-left-right" : "opacity-0"}
    `,
    children: [
      /* @__PURE__ */ jsx("div", { className: "w-44 h-60 sm:w-52 sm:h-64 md:w-56 md:h-72 lg:w-60 lg:h-80 rounded-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: book.image,
          alt: book.title,
          className: "w-full h-full object-cover rounded-xl"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 md:mt-3 text-center px-2 flex-1 flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-sm md:text-lg lg:text-xl font-semibold text-[#7A1E1E] mb-1 sm:mb-2", children: book.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-[0.7rem] md:text-sm text-gray-600 italic mb-1 sm:mb-2", children: [
          "by ",
          book.author
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs sm:text-[0.7rem] md:text-sm leading-snug", children: book.description })
      ] }) })
    ]
  }
);
const Book = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: sectionRef,
      className: "relative w-full py-14 px-3 sm:px-4 overflow-hidden bg-linear-to-b from-[#7A1E1E] via-[#5c1616] to-[#FFFDF8]",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 opacity-[0.07] pointer-events-none",
            style: {
              backgroundImage: "radial-gradient(circle, #FFD700 1px, transparent 1px)",
              backgroundSize: "26px 26px"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-10 -right-16 w-72 h-72 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" }),
        /* @__PURE__ */ jsx("h2", { className: "relative text-center text-2xl sm:text-3xl md:text-4xl font-serif text-[#FFD700] mb-3 z-10", children: "Famous Books by Seemaa" }),
        /* @__PURE__ */ jsx("p", { className: "relative text-center text-[#f5e6c8] text-sm sm:text-base mb-10 z-10 max-w-xl mx-auto", children: "Words of wisdom, woven with the wisdom of the stars" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-5xl mx-auto mb-14 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10 bg-white/5 backdrop-blur-sm border border-[#FFD700]/20 rounded-3xl p-5 sm:p-8 shadow-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center md:text-left", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block text-[#FFD700] text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 font-semibold", children: "Tarot for Beginners" }),
            /* @__PURE__ */ jsxs("h3", { className: "font-serif text-xl sm:text-2xl md:text-3xl text-[#FFD700] mb-4 leading-snug", children: [
              "Lost Between Questions?",
              /* @__PURE__ */ jsx("br", {}),
              " Discover the Path Ahead."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[#f5e6c8] text-sm sm:text-base leading-relaxed mb-5", children: [
              "Unlock the wisdom hidden within love, career, finance, and health. Learn to read the signs and discover the story each card holds. Introducing",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[#FFD700] font-semibold", children: "Tarot for Beginners" }),
              " ",
              "by Seemaa Singh, published by Dinette Publishers."
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[#f5e6c8]/80 text-xs sm:text-sm italic", children: "Have a story to share? Turn your manuscript into a published book with our free publication program." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full max-w-55 sm:max-w-65 md:max-w-70 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl overflow-hidden shadow-[0_0_0_4px_rgba(255,215,0,0.25)] border border-[#FFD700]/40", children: [
            /* @__PURE__ */ jsx(
              "video",
              {
                ref: videoRef,
                src: tarotVideo,
                autoPlay: true,
                loop: true,
                muted,
                playsInline: true,
                className: "w-full h-auto block"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggleMute,
                className: "absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-[#FFD700] p-2 rounded-full transition-colors duration-200",
                "aria-label": muted ? "Unmute video" : "Mute video",
                children: muted ? /* @__PURE__ */ jsx(VolumeX, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" })
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 overflow-x-auto flex gap-4 snap-x snap-mandatory no-scrollbar pb-2 md:p-15", children: books.map((b, index) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "min-w-[65%] sm:min-w-[50%] md:min-w-[35%] lg:min-w-[30%] snap-center",
            children: /* @__PURE__ */ jsx(BookCard, { book: b, animate })
          },
          index
        )) })
      ]
    }
  );
};
const Footer = () => {
  const [openPolicy, setOpenPolicy] = useState(null);
  return /* @__PURE__ */ jsxs("footer", { className: "w-full bg-[#7A1E1E] text-white", children: [
    /* @__PURE__ */ jsx("hr", { className: "bg-[#7A1E1E] w-full h-0.5" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-8 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-1", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: logo,
              alt: "Seemaa Astrologer",
              loading: "lazy",
              className: "w-28 mb-4"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-white/80 text-xs leading-relaxed", children: "Authentic Vedic Astrology & Spiritual Guidance for Life Balance." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3", children: "Contact Us" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-xs text-white/80", children: [
            /* @__PURE__ */ jsx("a", { href: "tel:+12362589866", className: "hover:text-white", children: "+1 236-258-9866" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://wa.me/12362589866?text=Hi%20Seemaa%20Ji%2C%20I%20want%20to%20book%20a%20consultation.",
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": "Chat on WhatsApp",
                className: "hover:opacity-80",
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    className: "w-5 h-5",
                    fill: "#25D366",
                    children: /* @__PURE__ */ jsx("path", { d: "M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.59 5.93L0 24l6.4-1.68a11.8 11.8 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44zM12.05 21.77h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.8 1 1.01-3.7-.24-.38a9.9 9.9 0 0 1-1.52-5.26c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.93-9.86 9.93zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" })
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-white/80", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:Info@seemaaastrologer.com",
              className: "hover:text-white",
              children: "Info@seemaaastrologer.com"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-white/80", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-white mb-1", children: "Office (Canada)" }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "https://www.google.com/maps/search/?api=1&query=30+Eglinton+Ave+W,+Mississauga,+ON+L5R+3E7,+Canada",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "hover:text-white leading-relaxed",
                children: [
                  "Unit 50, 30 Eglinton Ave W,",
                  /* @__PURE__ */ jsx("br", {}),
                  "Mississauga, ON L5R 3E7,",
                  /* @__PURE__ */ jsx("br", {}),
                  "Canada"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3", children: "Services" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-white/80", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              distExports.Link,
              {
                to: "/services/vedic-astrology",
                className: "hover:text-white",
                children: "Vedic Astrology"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              distExports.Link,
              {
                to: "/services/vedic-vastu",
                className: "hover:text-white",
                children: "Vastu"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              distExports.Link,
              {
                to: "/services/transits-of-the-month",
                className: "hover:text-white",
                children: "Transits of the Month"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              distExports.Link,
              {
                to: "/services/astro-numerology",
                className: "hover:text-white",
                children: "Numerology"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3", children: "Links" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-white/80", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(distExports.Link, { to: "/about", className: "hover:text-white", children: "About Us" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(distExports.Link, { to: "/consultation", className: "hover:text-white", children: "Appointment" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(distExports.Link, { to: "/horoscope", className: "hover:text-white", children: "Horoscope" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(distExports.Link, { to: "/contact", className: "hover:text-white", children: "Contact us" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3", children: "Policy" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-xs text-white/80", children: [
            /* @__PURE__ */ jsx(
              "li",
              {
                className: "cursor-pointer hover:text-white",
                onClick: () => setOpenPolicy("disclaimer"),
                children: "Disclaimer"
              }
            ),
            /* @__PURE__ */ jsx(
              "li",
              {
                className: "cursor-pointer hover:text-white",
                onClick: () => setOpenPolicy("privacy"),
                children: "Privacy Policy"
              }
            ),
            /* @__PURE__ */ jsx(
              "li",
              {
                className: "cursor-pointer hover:text-white",
                onClick: () => setOpenPolicy("payment"),
                children: "Pay Online"
              }
            )
          ] })
        ] }),
        openPolicy && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white text-black rounded-xl max-w-md w-full p-5 relative", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setOpenPolicy(null),
              className: "absolute top-3 right-3 text-gray-500 hover:text-black",
              children: "✕"
            }
          ),
          openPolicy === "disclaimer" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Disclaimer" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "All consultations and guidance are based on personal belief and experience. Results may vary for each individual." })
          ] }),
          openPolicy === "privacy" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Privacy Policy" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Your personal details are kept strictly confidential and are never shared with any third party." })
          ] }),
          openPolicy === "payment" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Pay Online" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "All payments are processed securely. No card or payment information is stored on our servers." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-white/30 my-6" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between text-xs text-white/70 gap-3", children: [
        /* @__PURE__ */ jsx("p", { children: "© 2005 All rights reserved. Astrologer Seemaa" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://www.facebook.com/astrologerseemasingh?mibextid=wwXIfr&rdid=bsv69xUqoUvsKiIN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17viL4jZXm%2F%3Fmibextid%3DwwXIfr#",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-white",
              children: "Facebook"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://www.instagram.com/astrologerseemasingh?igsh=ZHhzdG13ZzRhd3M5&utm_source=qr",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-white",
              children: "Instagram"
            }
          )
        ] })
      ] })
    ] })
  ] });
};
const scrollToBooking = () => {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
};
const banners = [
  {
    id: 0,
    type: "seemaa",
    bg: "from-[#1a0500] via-[#3B1205] to-[#6B2010]",
    textColor: "text-[#F4E4C1]",
    accentColor: "#cbb05f"
  },
  {
    id: 1,
    type: "regular",
    bg: "from-[#1a0a00] via-[#3B1F1B] to-[#7A1E1E]",
    textColor: "text-[#cbb05f]",
    title: "UNRAVEL THE REALM OF ASTROLOGY",
    subtitle: "Ancient wisdom backed by practical understanding.",
    person: ganeshgpng,
    accentColor: "#cbb05f",
    patternType: "geometric"
  },
  {
    id: 2,
    type: "regular",
    bg: "from-[#060d1f] via-[#0B132B] to-[#1C2541]",
    textColor: "text-[#EAE2B7]",
    title: "Acharya Seemaa Singh, Astrologer & Vastu Expert",
    subtitle: "Know about yourself and the purpose of your life through authentic astrology and vastu knowledge.",
    person: seemaapic1$1,
    accentColor: "#EAE2B7",
    patternType: "cosmic"
  }
];
const Home = () => {
  const [active, setActive] = useState(0);
  const total = banners.length;
  useEffect(() => {
    const interval = setInterval(() => setActive((p) => (p + 1) % total), 7500);
    return () => clearInterval(interval);
  }, [total]);
  const prev = () => setActive((active - 1 + total) % total);
  const next = () => setActive((active + 1) % total);
  const banner = banners[active];
  const NavArrow = ({ dir, onClick }) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: `absolute ${dir === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white w-10 h-10 rounded-full border border-white/20 transition-all text-lg`,
      children: dir === "left" ? "‹" : "›"
    }
  );
  const Dots = () => /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: banners.map((_, i) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActive(i),
        className: `nav-dot ${active === i ? "active" : ""}`
      },
      i
    )) }),
    /* @__PURE__ */ jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsx("div", { className: "progress-fill" }, active) })
  ] });
  const MobileDots = () => /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2", children: banners.map((_, i) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => setActive(i),
      className: `nav-dot ${active === i ? "active" : ""}`
    },
    i
  )) });
  const StarField = () => /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none z-0", children: [
    /* @__PURE__ */ jsx("div", { className: "stars" }),
    /* @__PURE__ */ jsx("div", { className: "stars2" })
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("section", { className: "w-full mt-25 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "hidden md:block", children: [
        banner.type === "seemaa" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `max-w-350 w-full mx-auto min-h-90 rounded-2xl overflow-hidden relative grain-overlay bg-linear-to-r ${banner.bg}`,
            children: [
              /* @__PURE__ */ jsx(StarField, {}),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 geo-pattern pointer-events-none" }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: {
                    background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 rounded-2xl pointer-events-none",
                  style: {
                    boxShadow: "inset 0 0 0 1px rgba(203,176,95,0.12), inset 0 0 80px rgba(0,0,0,0.3)"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-0 left-0 right-0 h-px",
                  style: {
                    background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute bottom-0 left-0 right-0 h-px",
                  style: {
                    background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`
                  }
                }
              ),
              /* @__PURE__ */ jsx(NavArrow, { dir: "left", onClick: prev }),
              /* @__PURE__ */ jsx(NavArrow, { dir: "right", onClick: next }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-20 w-1/2 px-12 pt-8 pb-8 flex flex-col justify-center min-h-90 slide-in", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "h-px w-8",
                      style: { background: banner.accentColor + "80" }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-xs font-semibold tracking-[0.25em] uppercase opacity-70",
                      style: { color: banner.accentColor },
                      children: "✦ Vedic Astrology & Vastu"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "h1",
                  {
                    className: "text-4xl font-serif font-bold leading-tight text-[#F4E4C1]",
                    style: { textShadow: "0 2px 20px rgba(0,0,0,0.5)" },
                    children: "Acharya Seemaa Singh"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: "mt-1 text-lg font-medium",
                    style: { color: banner.accentColor },
                    children: "Astrologer · Vastu Expert · Life Coach"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-[#F2EDE8]/80 max-w-sm leading-relaxed", children: "With over 20 years of experience and 50,000+ consultations, Seemaa Ji blends authentic Vedic knowledge with practical guidance — helping you navigate career, relationships, health, and life's purpose." }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mt-5 mb-5", children: [
                  { num: "20+", label: "Years Exp." },
                  { num: "50K+", label: "Clients" },
                  { num: "100%", label: "Authentic" }
                ].map((stat) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: "text-xl font-bold font-serif",
                      style: { color: banner.accentColor },
                      children: stat.num
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-[#F2EDE8]/60 text-xs", children: stat.label })
                ] }, stat.label)) }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 flex-wrap", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
                      className: "border px-6 py-2.5 rounded-full font-semibold font-serif text-sm transition-all cursor-pointer hover:bg-white/10",
                      style: {
                        borderColor: banner.accentColor + "60",
                        color: banner.accentColor
                      },
                      children: "Explore Services"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: scrollToBooking,
                      className: "px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer transition-all hover:scale-105 shadow-lg",
                      style: {
                        background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                        color: "#3B1F1B"
                      },
                      children: "Book Consultation"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 h-full w-1/2 flex justify-end items-end overflow-hidden", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: Seemaa$1,
                  alt: "Acharya Seemaa Singh",
                  className: "h-full object-cover object-top",
                  style: {
                    maskImage: "linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)"
                  }
                }
              ) }),
              /* @__PURE__ */ jsx(Dots, {})
            ]
          },
          "seemaa-desk"
        ),
        banner.type === "regular" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `max-w-350 w-full mx-auto min-h-90 rounded-2xl overflow-hidden relative grain-overlay bg-linear-to-r ${banner.bg}`,
            children: [
              /* @__PURE__ */ jsx(StarField, {}),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `absolute inset-0 pointer-events-none ${banner.patternType === "geometric" ? "geo-pattern" : "cosmic-pattern"}`
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: {
                    background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 rounded-2xl pointer-events-none",
                  style: {
                    boxShadow: `inset 0 0 0 1px rgba(${banner.patternType === "geometric" ? "203,176,95" : "234,226,183"},0.12), inset 0 0 80px rgba(0,0,0,0.3)`
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-0 left-0 right-0 h-px",
                  style: {
                    background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute bottom-0 left-0 right-0 h-px",
                  style: {
                    background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`
                  }
                }
              ),
              /* @__PURE__ */ jsx(NavArrow, { dir: "left", onClick: prev }),
              /* @__PURE__ */ jsx(NavArrow, { dir: "right", onClick: next }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `relative z-20 w-1/2 px-12 pt-8 pb-8 flex flex-col justify-center min-h-90 ${banner.textColor} slide-in`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "h-px w-8",
                          style: { background: banner.accentColor + "80" }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "text-xs font-semibold tracking-[0.25em] uppercase opacity-70",
                          style: { color: banner.accentColor },
                          children: banner.id === 1 ? "✦ Ancient Wisdom" : "✦ Trusted Guidance"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "h1",
                      {
                        className: "text-4xl font-serif font-bold leading-tight",
                        style: { textShadow: "0 2px 20px rgba(0,0,0,0.5)" },
                        children: banner.title
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { className: "mt-4 text-base text-[#F2EDE8]/80 max-w-sm leading-relaxed", children: banner.subtitle }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 my-5", children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "h-px flex-1 max-w-16",
                          style: {
                            background: `linear-gradient(90deg, ${banner.accentColor}60, transparent)`
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "w-1.5 h-1.5 rounded-full",
                          style: { background: banner.accentColor + "80" }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "h-px w-6",
                          style: { background: banner.accentColor + "40" }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 flex-wrap", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
                          className: "border px-6 py-2.5 rounded-full font-semibold font-serif text-sm transition-all cursor-pointer hover:bg-white/10",
                          style: {
                            borderColor: banner.accentColor + "60",
                            color: banner.accentColor
                          },
                          children: "Explore Services"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: scrollToBooking,
                          className: "px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer transition-all hover:scale-105 shadow-lg",
                          style: {
                            background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                            color: "#3B1F1B"
                          },
                          children: "Book Consultation"
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-1/2 h-full flex justify-center items-center overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "relative w-96 aspect-square", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 rounded-full blur-3xl opacity-25",
                    style: { background: banner.accentColor }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: zodiacWheel,
                    className: "absolute inset-0 w-full h-full animate-spin-slow opacity-60",
                    loading: "lazy",
                    alt: "Wheel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: banner.person,
                    className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-72 z-10 drop-shadow-2xl",
                    loading: "lazy",
                    alt: "Person"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(Dots, {})
            ]
          },
          `regular-desk-${banner.id}`
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:hidden", children: [
        banner.type === "seemaa" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `mx-4 rounded-2xl overflow-hidden relative min-h-100 grain-overlay bg-linear-to-br ${banner.bg}`,
            children: [
              /* @__PURE__ */ jsx(StarField, {}),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 geo-pattern pointer-events-none" }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: {
                    background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)"
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute right-0 bottom-0 h-3/4 w-1/2 z-0", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: Seemaa$1,
                  alt: "Acharya Seemaa Singh",
                  className: "h-full w-full object-cover object-top",
                  style: {
                    maskImage: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 90%)",
                    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 90%)",
                    opacity: 0.45
                  }
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col text-center px-6 py-10 slide-in", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "h-px w-6",
                      style: { background: banner.accentColor + "80" }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-xs font-semibold tracking-widest uppercase opacity-70",
                      style: { color: banner.accentColor },
                      children: "✦ Vedic Astrology & Vastu"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "h-px w-6",
                      style: { background: banner.accentColor + "80" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("h1", { className: "text-2xl font-serif font-bold leading-snug text-[#F4E4C1]", children: "Acharya Seemaa Singh" }),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: "mt-1 text-sm font-semibold",
                    style: { color: banner.accentColor },
                    children: "Astrologer · Vastu Expert · Life Coach"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-[#F2EDE8]/75 leading-relaxed max-w-xs mx-auto", children: "20+ years of authentic Vedic wisdom guiding 50,000+ clients through life, career, relationships & beyond." }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-6 mt-4 mb-5", children: [
                  { num: "20+", label: "Years" },
                  { num: "50K+", label: "Clients" },
                  { num: "100%", label: "Authentic" }
                ].map((stat) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: "text-lg font-bold font-serif",
                      style: { color: banner.accentColor },
                      children: stat.num
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-[#F2EDE8]/60 text-xs", children: stat.label })
                ] }, stat.label)) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
                      className: "border px-6 py-2 rounded-full font-semibold font-serif text-sm cursor-pointer",
                      style: {
                        borderColor: banner.accentColor + "60",
                        color: banner.accentColor
                      },
                      children: "Explore Services"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: scrollToBooking,
                      className: "px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer",
                      style: {
                        background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                        color: "#3B1F1B"
                      },
                      children: "Book Consultation"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(MobileDots, {})
            ]
          },
          "seemaa-mob"
        ),
        banner.type === "regular" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `mx-4 rounded-2xl overflow-hidden relative min-h-100 grain-overlay bg-linear-to-br ${banner.bg}`,
            children: [
              /* @__PURE__ */ jsx(StarField, {}),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `absolute inset-0 pointer-events-none ${banner.patternType === "geometric" ? "geo-pattern" : "cosmic-pattern"}`
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: {
                    background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-0 left-0 right-0 h-px",
                  style: {
                    background: `linear-gradient(90deg, transparent, ${banner.accentColor}55, transparent)`
                  }
                }
              ),
              banner.id === 2 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `relative z-20 text-center px-6 pt-3 ${banner.textColor} slide-in`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-2 mt-1", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "h-px w-6",
                            style: { background: banner.accentColor + "60" }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: "text-xs tracking-widest uppercase opacity-60",
                            style: { color: banner.accentColor },
                            children: "✦ Trusted Guidance"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "h-px w-6",
                            style: { background: banner.accentColor + "60" }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold leading-snug", children: banner.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#F2EDE8]/80", children: banner.subtitle }),
                      /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-center", children: /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: scrollToBooking,
                          className: "px-6 py-2 rounded-full font-serif font-semibold text-sm cursor-pointer",
                          style: {
                            background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                            color: "#3B1F1B"
                          },
                          children: "Book Consultation"
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative w-72 aspect-square", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute inset-0 rounded-full blur-3xl opacity-20",
                      style: { background: banner.accentColor }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: zodiacWheel,
                      className: "absolute inset-0 w-full h-full animate-spin-slow opacity-55",
                      alt: "Wheel",
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: banner.person,
                      className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-44 z-10 drop-shadow-2xl",
                      alt: "Person",
                      loading: "lazy"
                    }
                  )
                ] }) })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: zodiacWheel,
                    className: "absolute -top-20 left-1/2 -translate-x-1/2 w-72 animate-spin-slow opacity-55",
                    alt: "Wheel",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `relative z-20 text-center px-6 pt-40 ${banner.textColor} slide-in`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "h-px w-6",
                            style: { background: banner.accentColor + "60" }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: "text-xs tracking-widest uppercase opacity-60",
                            style: { color: banner.accentColor },
                            children: "✦ Ancient Wisdom"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "h-px w-6",
                            style: { background: banner.accentColor + "60" }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold font-serif leading-snug", children: banner.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#F2EDE8]/80", children: banner.subtitle }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-col items-center gap-3", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
                            className: "border px-6 py-2.5 rounded-full font-semibold font-serif text-sm cursor-pointer",
                            style: {
                              borderColor: banner.accentColor + "60",
                              color: banner.accentColor
                            },
                            children: "Explore Services"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: scrollToBooking,
                            className: "px-6 py-2.5 rounded-full font-serif font-semibold text-sm cursor-pointer",
                            style: {
                              background: `linear-gradient(135deg, ${banner.accentColor}, #fff8dc)`,
                              color: "#3B1F1B"
                            },
                            children: "Book Consultation"
                          }
                        )
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(MobileDots, {})
            ]
          },
          `regular-mob-${banner.id}`
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Seemaa, {}),
    /* @__PURE__ */ jsx(Service, {}),
    /* @__PURE__ */ jsx(Awards, {}),
    /* @__PURE__ */ jsx(Horoscope, {}),
    /* @__PURE__ */ jsx(Booking, {}),
    /* @__PURE__ */ jsx(Review, {}),
    /* @__PURE__ */ jsx(Book, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const aboutseemaapic2 = "/assets/aboutseemaapic2-DwaAaB20.webp";
const About = () => {
  const sectionRefMobile = useRef(null);
  const sectionRefDesktop = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRefMobile.current) observer.observe(sectionRefMobile.current);
    if (sectionRefDesktop.current) observer.observe(sectionRefDesktop.current);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    isMobile ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-6 px-4 py-8 my-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm flex flex-col bg-[#7A1E1E] overflow-hidden items-center justify-center my-6 px-4 py-4 rounded-xl animate-slide-up", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 stars animate-stars z-0" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-10 w-44 h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-16 right-16 w-56 h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/25 blur-2xl animate-float" })
        ] }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: Seemaa$1,
            alt: "Acharya Seemaa Singh",
            loading: "lazy",
            className: "w-36 max-w-full h-auto object-cover bg-[#FAF9F6] rounded-full shadow-lg mb-4"
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold font-serif text-[#F4C430] mb-2 text-center", children: "Acharya Seemaa Singh" }),
        /* @__PURE__ */ jsxs("ul", { className: "flex flex-wrap justify-center gap-2 mb-3 text-[#FAF9F6]", children: [
          /* @__PURE__ */ jsx("li", { className: "px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif", children: "Astrologer" }),
          /* @__PURE__ */ jsx("li", { className: "px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif", children: "Astro-Healer" }),
          /* @__PURE__ */ jsx("li", { className: "px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif", children: "Numerologist" }),
          /* @__PURE__ */ jsx("li", { className: "px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif", children: "Tarot Expert" }),
          /* @__PURE__ */ jsx("li", { className: "px-2 py-1 text-sm bg-[#F4C430]/20 rounded-full font-serif", children: "Cartomancy Expert" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[#FAF9F6] text-sm leading-relaxed text-center", children: "A distinguished astrologer and astro-healer with over two decades of experience guiding individuals through Vedic Astrology, Numerology, Tarot, Cartomancy, Aura Reading, Energy Dowsing, and Vaastu Consultancy." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 w-full items-center animate-slide-up", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm flex flex-col items-center gap-4", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: aboutseemaapic2,
            alt: "About Seemaa",
            loading: "lazy",
            className: "w-full rounded-2xl shadow-xl border-4 border-[#F4C430] object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-[#7A1E1E] text-2xl mb-2 font-serif", children: "Astrological Journey" }),
          /* @__PURE__ */ jsxs("div", { className: "w-full bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xl text-[#F4C430] text-center font-semibold mb-1 font-serif", children: "Academic Excellence" }),
            /* @__PURE__ */ jsx("p", { className: "text-[#FAF9F6] text-center text-sm leading-relaxed", children: "Topped the Jyotish Visharad program conducted by the Indian Council of Astrological Studies and received the Degree in Jyotish (2001–2002) in Chandigarh." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xl text-[#F4C430] text-center font-semibold mb-1 font-serif", children: "Areas of Expertise" }),
            /* @__PURE__ */ jsxs("ul", { className: "grid grid-cols-2 gap-2 text-[#FAF9F6] text-center text-sm leading-relaxed", children: [
              /* @__PURE__ */ jsx("li", { children: "Vedic Astrology" }),
              /* @__PURE__ */ jsx("li", { children: "Numerology" }),
              /* @__PURE__ */ jsx("li", { children: "Tarot Reading" }),
              /* @__PURE__ */ jsx("li", { children: "Cartomancy" }),
              /* @__PURE__ */ jsx("li", { children: "Aura Reading" }),
              /* @__PURE__ */ jsx("li", { children: "Energy Dowsing" }),
              /* @__PURE__ */ jsx("li", { children: "Vaastu" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "md:hidden w-full py-10 px-4 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-bold text-[#7A1E1E] mb-2", children: "Acharya Seemaa Singh" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold font-serif text-gray-700 mb-4", children: "Astrologer • Astro-Healer • Numerologist" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm leading-relaxed", children: "Acharya Seemaa Singh is a trusted spiritual guide with decades of experience in astrology and healing sciences, helping people find clarity and balance in life." }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm leading-relaxed mt-3", children: "Her compassionate guidance supports individuals in relationships, career growth, health, and overall well-being." })
      ] }) }) }),
      /* @__PURE__ */ jsxs(
        "section",
        {
          ref: sectionRefMobile,
          className: `w-full bg-[#7A1E1E] overflow-hidden py-8 px-4 sm:py-12 sm:px-8 rounded-2xl transition-all duration-700 ${animate ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 stars animate-stars z-0" }),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-10 w-32 h-32 rounded-full bg-[#F4C430]/40 blur-2xl animate-spin-slow sm:w-44 sm:h-44" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-10 w-40 h-40 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit sm:w-56 sm:h-56 sm:bottom-16 sm:right-16" }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-white/25 blur-xl animate-float sm:w-32 sm:h-32" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold font-serif text-[#F4C430] text-center py-6 sm:py-8", children: "Global Learning & Collaborations" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-[#FAF9F6] overflow-hidden rounded-xl p-4 sm:p-6 border-l-4 border-[#F4C430] shadow-md", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold text-[#7A1E1E] mb-1 sm:mb-2 font-serif", children: "Advanced Studies in Vancouver" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-xs sm:text-sm", children: "During her stay in Vancouver, Canada, she pursued advanced studies in Aura Reading and Energy Dowsing." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[#FAF9F6] overflow-hidden rounded-xl p-4 sm:p-6 border-l-4 border-[#F4C430] shadow-md", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold text-[#7A1E1E] mb-1 sm:mb-2 font-serif", children: "Professional Associations" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-xs sm:text-sm", children: "Member of Fraser Valley Astrological Guild (FVAG)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-xs sm:text-sm", children: "Associated with American Institute of Vedic Studies (USA), led by renowned scholar David Frawley" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[#FAF9F6] overflow-hidden col-span-1 sm:col-span-2 rounded-xl p-4 sm:p-6 border-l-4 border-[#F4C430] shadow-md", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold text-[#7A1E1E] mb-1 sm:mb-2 font-serif", children: "Guest Speaker" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-xs sm:text-sm", children: "Frequently invited as a guest speaker at YMCA and other prestigious forums, where she shared insights on astrology, healing, and spiritual awareness." })
                ] })
              ] })
            ] })
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-8 mt-25 px-8", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative w-full flex flex-col bg-[#7A1E1E] overflow-hidden items-center justify-center animate-slide-up gap-8 p-8 rounded-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 stars animate-stars z-0" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-10 w-44 h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-16 right-16 w-56 h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/25 blur-2xl animate-float" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center gap-8 w-full", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: Seemaa$1,
              alt: "Acharya Seemaa Singh",
              className: "w-60 md:w-80 h-auto mt-5 bg-[#FAF9F6] ring-4 ring-[#F4C430]/50 object-cover rounded-full shadow-xl"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-serif font-bold text-[#F4C430] mb-4", children: "Acharya Seemaa Singh" }),
            /* @__PURE__ */ jsxs("ul", { className: "flex flex-wrap gap-3 md:gap-4 mb-4 text-[#FAF9F6]", children: [
              /* @__PURE__ */ jsx("li", { className: "px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif", children: "Astrologer" }),
              /* @__PURE__ */ jsx("li", { className: "px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif", children: "Astro-Healer" }),
              /* @__PURE__ */ jsx("li", { className: "px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif", children: "Numerologist" }),
              /* @__PURE__ */ jsx("li", { className: "px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif", children: "Tarot Expert" }),
              /* @__PURE__ */ jsx("li", { className: "px-3 py-1 text-sm md:text-base bg-[#F4C430]/20 rounded-full font-serif", children: "Cartomancy Expert" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[#FAF9F6] text-base md:text-lg leading-relaxed md:text-justify ", children: "A distinguished astrologer and astro-healer with more than two decades of extensive experience, dedicated to guiding individuals on their life journeys through the profound practices of Vedic Astrology, Numerology, Tarot, Cartomancy, Aura Reading, Energy Dowsing, and Vaastu Consultancy. Renowned for insightful predictions and personalized guidance, helping clients achieve balance, clarity, and fulfillment in all aspects of life." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-4 p-3 rounded-xl w-full max-w-3xl mx-auto mt-2 animate-slide-up bg-[#FAF9F6]", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center flex-1", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xl md:text-3xl font-bold text-[#7A1E1E]", children: [
              /* @__PURE__ */ jsx(CountUp, { end: 20 }),
              "+"
            ] }),
            /* @__PURE__ */ jsx("h5", { className: "text-xs md:text-sm text-[#7A1E1E]/80", children: "Years of Experience" })
          ] }),
          /* @__PURE__ */ jsx("hr", { className: "w-12 md:w-20 border-[#7A1E1E]/40 md:hidden" }),
          /* @__PURE__ */ jsxs("div", { className: "text-center flex-1", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xl md:text-3xl font-bold text-[#7A1E1E]", children: [
              /* @__PURE__ */ jsx(CountUp, { end: 50 }),
              "K+"
            ] }),
            /* @__PURE__ */ jsx("h5", { className: "text-xs md:text-sm text-[#7A1E1E]/80", children: "Clients" })
          ] }),
          /* @__PURE__ */ jsx("hr", { className: "w-12 md:w-20 border-[#7A1E1E]/40 md:hidden" }),
          /* @__PURE__ */ jsxs("div", { className: "text-center flex-1", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xl md:text-3xl font-bold text-[#7A1E1E]", children: [
              /* @__PURE__ */ jsx(CountUp, { end: 25 }),
              "+"
            ] }),
            /* @__PURE__ */ jsx("h5", { className: "text-xs md:text-sm text-[#7A1E1E]/80", children: "Awards" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex flex-row w-full bg-[#FAF9F6] overflow-hidden py-12 items-start justify-center gap-10 animate-slide-up rounded-2xl",
          style: { backgroundImage: `url(${serviceBg})` },
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm flex flex-col items-center justify-center gap-4", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: aboutseemaapic2,
                alt: "About Seemaa",
                className: "w-full mt-13 rounded-2xl shadow-xl border-4 border-[#F4C430] object-cover"
              }
            ) }),
            /* @__PURE__ */ jsx("hr", { className: "hidden md:block bg-[#7A1E1E] w-0.5 h-120" }),
            /* @__PURE__ */ jsxs("div", { className: "w-1/2 flex flex-col items-center text-center gap-5", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[#7A1E1E] text-3xl font-bold mb-5 font-serif", children: "Astrological Journey & Training" }),
              /* @__PURE__ */ jsxs("div", { className: "w-150 bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-2xl text-[#F4C430] font-semibold mb-2 font-serif", children: "Academic Excellence" }),
                /* @__PURE__ */ jsx("p", { className: "text-[#FAF9F6] text-center leading-relaxed", children: "Topped the Jyotish Visharad program conducted by the Indian Council of Astrological Studies and received the Degree in Jyotish (2001–2002) in Chandigarh." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-150 bg-[#7A1E1E] overflow-hidden rounded-xl p-4 border-l-4 border-[#F4C430] shadow-md", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-2xl text-[#F4C430] font-semibold mb-2 font-serif", children: "Areas of Expertise" }),
                /* @__PURE__ */ jsxs("ul", { className: "grid grid-cols-3 gap-2 text-[#FAF9F6] text-center leading-relaxed ", children: [
                  /* @__PURE__ */ jsx("li", { children: "Vedic Astrology" }),
                  /* @__PURE__ */ jsx("li", { children: "Numerology" }),
                  /* @__PURE__ */ jsx("li", { children: "Tarot Reading" }),
                  /* @__PURE__ */ jsx("li", { children: "Cartomancy" }),
                  /* @__PURE__ */ jsx("li", { children: "Aura Reading" }),
                  /* @__PURE__ */ jsx("li", { children: "Energy Dowsing" }),
                  /* @__PURE__ */ jsx("li", { children: "Vaastu" })
                ] })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("section", { className: "w-full py-16 px-4 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl w-full text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-serif font-bold text-[#7A1E1E] mb-4", children: "Acharya Seemaa Singh" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold font-serif text-gray-700 mb-6", children: "Astrologer • Astro-Healer • Numerologist • Tarot & Cartomancy Expert" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto", children: "Acharya Seemaa Singh is a highly respected spiritual guide with more than two decades of experience in Vedic Astrology, Numerology, Tarot, and Astro-Healing. Her guidance brings clarity, balance, and peace to those seeking direction in life." }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mt-4", children: "Known for her accurate insights and compassionate approach, she helps individuals overcome challenges related to relationships, career, health, finances, and overall well-being through ancient wisdom and modern understanding." })
      ] }) }),
      /* @__PURE__ */ jsxs(
        "section",
        {
          ref: sectionRefDesktop,
          className: `w-full bg-[#7A1E1E] overflow-hidden py-12 px-8 rounded-2xl transition-all duration-700 ${animate ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 stars animate-stars z-0" }),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-10 w-44 h-44 rounded-full bg-[#F4C430]/40 blur-3xl animate-spin-slow" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-16 right-16 w-56 h-56 rounded-full bg-[#7A1E1E]/35 blur-3xl animate-orbit" }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/25 blur-2xl animate-float" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold font-serif text-[#F4C430] text-center py-8", children: "Global Learning & Collaborations" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-[#FAF9F6] overflow-hidden rounded-xl p-6 border-l-4 border-[#F4C430] shadow-md", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-bold text-[#7A1E1E] mb-2", children: "Advanced Studies in Vancouver" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-sm md:text-base", children: "During her stay in Vancouver, Canada, she pursued advanced studies in Aura Reading and Energy Dowsing." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[#FAF9F6] overflow-hidden rounded-xl p-6 border-l-4 border-[#F4C430] shadow-md", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-bold text-[#7A1E1E] mb-2", children: "Professional Associations" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-sm md:text-base", children: "Member of Fraser Valley Astrological Guild (FVAG)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-sm md:text-base", children: "Associated with American Institute of Vedic Studies (USA), led by renowned scholar David Frawley" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "col-span-2 bg-[#FAF9F6] overflow-hidden rounded-xl p-6 border-l-4 border-[#F4C430] shadow-md", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-bold text-[#7A1E1E] mb-2", children: "Guest Speaker" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E] leading-relaxed text-sm md:text-base", children: "Frequently invited as a guest speaker at YMCA and other prestigious forums, where she shared insights on astrology, healing, and spiritual awareness." })
                ] })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Review, {}),
    /* @__PURE__ */ jsx(Booking, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
function NotFound() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("section", { className: "min-h-[60vh] flex flex-col items-center justify-center text-center px-6 mt-20 bg-[#F2EDE8]", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-serif font-bold text-[#7A1E1E] mb-4", children: "Page not found" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-6", children: "The page you are looking for does not exist or has moved." }),
      /* @__PURE__ */ jsx(distExports.Link, { to: "/", className: "bg-[#7A1E1E] text-[#F2EDE8] px-6 py-2 rounded-full font-semibold", children: "Back to home" })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const servicesData = {
  "relationship-challenges": {
    title: "Relationship Challenges",
    icon: /* @__PURE__ */ jsx(FaHeart, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Get guidance on resolving emotional conflicts, improving understanding, healing misunderstandings, and building stronger emotional bonds. This service focuses on helping individuals and couples restore harmony and create healthier relationships."
  },
  "business-setbacks": {
    title: "Business Setbacks",
    icon: /* @__PURE__ */ jsx(FaBusinessTime, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Receive insights to navigate business obstacles, recover from failures, understand market challenges, and plan your strategic growth. This service helps you make better business decisions with clarity and confidence."
  },
  "financial-struggle": {
    title: "Financial Struggle",
    icon: /* @__PURE__ */ jsx(FaMoneyBillWave, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Learn how to manage financial difficulties, improve planning, budgeting, savings, and attract prosperity. This service offers guidance on overcoming money-related stress and creating long-term stability."
  },
  "career-roadblocks": {
    title: "Career Roadblocks",
    icon: /* @__PURE__ */ jsx(FaUserTie, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Get support in tackling professional challenges, career confusion, finding the right opportunities, job growth, and enhancing career prospects with the right direction and clarity."
  },
  "transits-of-the-month": {
    title: "Transits of the Month",
    icon: /* @__PURE__ */ jsx(FaChartLine, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Astrological transits help forecast future trends and planetary movements affecting your life. Understand how current cosmic shifts influence your decisions and emotional patterns."
  },
  "astro-numerology": {
    title: "Astro Numerology",
    icon: /* @__PURE__ */ jsx(FaHashtag, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Numerology reveals the hidden influence of numbers on personality, destiny, decision-making, and life events. This service helps you understand life paths, lucky numbers, and karmic lessons."
  },
  "vedic-astrology": {
    title: "Vedic Astrology",
    icon: /* @__PURE__ */ jsx(FaStarOfLife, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Jyotish, the ancient science of light, guides your life decisions through planetary wisdom. Get deep insights into your birth chart, doshas, remedies, and predictions."
  },
  "vedic-vastu": {
    title: "Vedic Vastu",
    icon: /* @__PURE__ */ jsx(FaHome, { size: 60, className: "text-[#7A1E1E]" }),
    description: "Vastu Shastra balances home and office energies for peace, prosperity, and harmony. Learn how directions, placements, and structures influence your well-being and success."
  }
};
function ServiceBrief() {
  const { slug: serviceName } = distExports.useParams();
  const navigate = distExports.useNavigate();
  const service = servicesData[serviceName];
  useEffect(() => {
    if (service) window.scrollTo({ top: 0 });
  }, [serviceName, service]);
  if (!service) {
    return /* @__PURE__ */ jsx(NotFound, {});
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col md:flex-row gap-6 px-4 md:px-20 py-10 items-center md:items-start bg-[#F2EDE8] mt-20", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center md:w-1/2 mb-6 md:mb-0", children: /* @__PURE__ */ jsx("div", { className: "p-6 md:p-8 bg-[#F4C430]/20 rounded-3xl shadow-lg flex justify-center items-center w-48 md:w-64 h-48 md:h-64", children: service.icon }) }),
      /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 flex flex-col justify-center text-center md:text-left", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-4", children: service.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm md:text-lg leading-relaxed", children: service.description }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/consultation"),
            className: "mt-6 bg-[#7A1E1E] text-[#F2EDE8] px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-[#5c1515] transition-colors cursor-pointer",
            children: "Book Now"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-12 px-4 md:px-20 bg-[#F2EDE8] flex flex-col md:flex-row items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 text-center md:text-left", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-4", children: "About Acharya Seemaa Singh" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm md:text-lg leading-relaxed", children: "Acharya Seemaa Singh is a distinguished astrologer and astro-healer with over two decades of experience guiding individuals through Vedic Astrology, Numerology, Tarot, Aura Reading, Energy Dowsing, and Vastu consultancy. She combines ancient wisdom with modern insights to provide accurate predictions and practical solutions." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:w-1/2 flex justify-center", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: seemaapic1$1,
          alt: "Acharya Seemaa Singh",
          className: "rounded-3xl w-48 md:w-96 h-48 md:h-96 object-cover shadow-lg",
          loading: "lazy"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-12 px-4 md:px-20 bg-[#F2EDE8] text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-6", children: "Why Choose Us" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm md:text-lg max-w-3xl mx-auto mb-8", children: "We prioritize personal guidance, accurate analysis, and holistic solutions to improve your life. Our clients trust us for clarity, reliability, and deep insight into personal, professional, and financial aspects of life." }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-[#F4C430]/20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold font-serif text-[#7A1E1E] text-centermb-2", children: "Expert Guidance" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs md:text-sm", children: "Decades of expertise in astrology and numerology ensure precise insights and remedies." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#F4C430]/20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold font-serif text-[#7A1E1E] text-centermb-2", children: "Personalized Approach" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs md:text-sm", children: "Tailored solutions to fit your unique life situation and challenges." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#F4C430]/20 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold font-serif text-[#7A1E1E] text-centermb-2", children: "Trusted Results" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs md:text-sm", children: "Proven client satisfaction with meaningful outcomes in relationships, career, and finance." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-12 px-4 md:px-20 bg-[#F2EDE8]", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold font-serif text-[#7A1E1E] text-center mb-6", children: "Our Services" }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto flex gap-4 md:grid md:grid-cols-4", children: Object.values(servicesData).map((item, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "shrink md:shrink-0 bg-[#F2EDE8] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center p-4 md:p-6 border-2 border-[#F4C430]/40 min-w-62.5 md:min-w-0",
          children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 md:p-6 bg-[#F4C430]/20 rounded-3xl mb-4 flex justify-center items-center transition-transform duration-700 group-hover:scale-110", children: item.icon }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-serif  font-semibold text-[#7A1E1E] mb-2", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs md:text-sm", children: item.description }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => navigate("/consultation"),
                className: "mt-4 bg-[#7A1E1E] text-[#F2EDE8] font-serif text-center px-4 md:px-6 py-2 rounded-full font-semibold hover:bg-[#5c1515] transition-colors cursor-pointer",
                children: "Book Now"
              }
            )
          ]
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ jsx(Booking, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const SeemaaPic = "/assets/seemaapic2-C-KEjORY.webp";
const horoscopeBriefs = {
  ARIES: "Aries are courageous, determined, confident, and enthusiastic. They are natural leaders. They love challenges and take initiative in most situations. Aries are highly energetic and love adventure. They can sometimes be impulsive but are always honest. Their passion inspires others around them.",
  TAURUS: "Taurus are reliable, patient, practical, devoted, and responsible. They enjoy stability and comfort in life. Taurus values loyalty and has a strong sense of perseverance. They appreciate beauty and are often drawn to art and nature. They can be stubborn, but their determination helps them achieve goals.",
  GEMINI: "Gemini are adaptable, curious, affectionate, and quick-witted. They love learning and communication, often making great conversationalists. Geminis are versatile and enjoy variety in life. They can be playful and social, making friends easily. Their curiosity drives them to explore new ideas constantly.",
  CANCER: "Cancer are loyal, emotional, sympathetic, and persuasive. They value family and home above all else. Cancers are deeply intuitive and often sense the emotions of others. They are nurturing and protective of loved ones. Their strong emotional depth allows them to connect meaningfully.",
  LEO: "Leo are creative, passionate, generous, and cheerful. They love being in the spotlight and inspiring others. Leos are natural leaders with a strong sense of pride. They are warm-hearted and often very charismatic. Their confidence and determination help them achieve great things.",
  VIRGO: "Virgo are loyal, analytical, kind, hardworking, and practical. They value precision, order, and attention to detail. Virgos are excellent problem-solvers and planners. They often seek perfection in their work and personal life. Their helpful nature makes them dependable friends and partners.",
  LIBRA: "Libra are cooperative, diplomatic, gracious, and fair-minded. They value harmony and strong relationships. Libras are social and enjoy connecting with people. They are idealistic and often seek balance in all areas of life. Their charm and tact make them natural peacemakers.",
  SCORPIO: "Scorpio are resourceful, brave, passionate, and stubborn. They are deeply emotional and highly intuitive. Scorpios are determined and often achieve great success. They value loyalty and expect the same from others. Their intensity and focus make them powerful leaders.",
  SAGITTARIUS: "Sagittarius are generous, idealistic, and have a great sense of humor. They love adventure, travel, and exploring new horizons. Sagittarians are optimistic and enthusiastic. They value freedom and independence. Their curiosity and philosophical nature make them lifelong learners.",
  CAPRICORN: "Capricorn are responsible, disciplined, self-controlled, and good managers. They aim high and work diligently to achieve their goals. Capricorns value tradition and structure. They are practical, patient, and reliable. Their perseverance allows them to overcome challenges effectively.",
  AQUARIUS: "Aquarius are progressive, original, independent, and humanitarian. They love innovation and thinking outside the box. Aquarians are often visionaries and forward-thinkers. They value friendship and equality. Their creativity and intellect inspire those around them.",
  PISCES: "Pisces are compassionate, artistic, intuitive, gentle, and wise. They are deeply empathetic and often understand others' emotions. Pisces are imaginative and love creative expression. They are kind-hearted and often help those in need. Their dreamy nature allows them to see possibilities others might miss."
};
const signs = [
  { name: "ARIES", image: aries },
  { name: "TAURUS", image: taurus },
  { name: "GEMINI", image: gemini },
  { name: "CANCER", image: cancer },
  { name: "LEO", image: leo },
  { name: "VIRGO", image: virgo },
  { name: "LIBRA", image: libra },
  { name: "SCORPIO", image: scorpio },
  { name: "SAGITTARIUS", image: sagittarius },
  { name: "CAPRICORN", image: capricorn },
  { name: "AQUARIUS", image: aquarius },
  { name: "PISCES", image: pisces }
];
const HoroscopeBrief = () => {
  const { sign: signParam } = distExports.useParams();
  const upper = (signParam || "aries").toUpperCase();
  const selected = horoscopeBriefs[upper] ? upper : "ARIES";
  const displayName = selected.charAt(0) + selected.slice(1).toLowerCase();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("section", { id: "horoscope", className: "w-full h-auto mt-15 py-2 px-4 bg-[#FFF9F2]", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-10 animate-slide-up", children: [
        /* @__PURE__ */ jsx("div", { className: "shrink-0 w-36 h-36 sm:w-44 sm:h-44 md:w-64 md:h-64 rounded-full bg-white flex items-center justify-center p-4 sm:p-6 shadow-lg", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: signs.find((s) => s.name === selected).image,
            alt: selected,
            loading: "lazy",
            className: "w-full h-full object-contain rounded-full"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 text-[#7A1E1E] flex flex-col justify-center text-center md:text-left", children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl md:text-4xl text-center font-serif font-bold mb-3", children: [
            displayName,
            " Zodiac Sign: Personality & Traits"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base md:text-lg md:text-justify text-center leading-6 sm:leading-7 md:leading-8", children: horoscopeBriefs[selected] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10 mt-20 animate-slide-up", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A1E1E] font-bold mb-3", children: "Discover Your Zodiac Sign" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#7A1E1E]/80 text-sm sm:text-base md:text-lg", children: "Click on a sign to know about your personality, traits, and life predictions." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 animate-slide-up", children: signs.map((sign2) => /* @__PURE__ */ jsxs(
        distExports.Link,
        {
          to: `/horoscope/${sign2.name.toLowerCase()}`,
          className: `flex flex-col items-center cursor-pointer p-3 rounded-lg transition-transform duration-300 ${selected === sign2.name ? "bg-[#F4C430]/30 shadow-lg scale-105" : "bg-white shadow-md hover:scale-105"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden p-2", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: sign2.image,
                alt: sign2.name,
                className: "w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 object-contain",
                loading: "lazy"
              }
            ) }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs sm:text-sm md:text-base font-serif font-semibold text-[#7A1E1E] tracking-wide text-center", children: sign2.name })
          ]
        },
        sign2.name
      )) }),
      /* @__PURE__ */ jsx("div", { className: "w-full py-16 px-4 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl w-full text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: SeemaaPic,
            alt: "Acharya Seemaa Singh",
            className: "w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 object-cover rounded-2xl shadow-lg",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#7A1E1E] mb-4", children: "Acharya Seemaa Singh" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto mt-4", children: "Acharya Seemaa Singh is a renowned astrologer with years of experience in reading zodiac signs and providing precise horoscope guidance. Her deep understanding of planetary positions and astrological charts allows her to deliver accurate predictions. Known for her empathetic approach, she not only predicts but also guides her clients on remedies and life choices. Many people trust her for personal, professional, and spiritual insights. Her dedication and expertise make her one of the most respected names in astrology today." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Booking, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const seemaapic1 = "/assets/seemaafullpic-DXcpDsSe.png";
const BookConsultation = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "w-full mt-20 bg-gray-50 flex justify-center px-3 md:px-6 animate-slide-up", children: /* @__PURE__ */ jsxs(
      "section",
      {
        ref: sectionRef,
        className: "w-full max-w-6xl relative py-10 md:py-24 my-4 md:my-10 flex flex-col items-center justify-center px-4 md:px-8 bg-linear-to-r from-[#7A1E1E] to-[#3B1F1B] overflow-hidden rounded-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex justify-center items-center pointer-events-none", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute w-32 h-32 md:w-72 md:h-72 rounded-full bg-yellow-400 opacity-20 blur-3xl animate-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "w-32 h-32 md:w-96 md:h-96 rounded-full overflow-hidden animate-spin-slow opacity-80", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: zodiacWheel,
                alt: "Zodiac Wheel",
                loading: "lazy",
                className: "w-full h-full object-contain"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "relative z-10 text-xl md:text-5xl font-serif font-bold mb-2 md:mb-3 text-center text-[#F2EDE8]", children: "Over 50,000 People Found Clarity" }),
          /* @__PURE__ */ jsx("p", { className: "relative z-10 text-sm md:text-2xl font-serif mb-2 md:mb-3 text-center text-[#F2EDE8]", children: "What are you thinking about today? Let the stars guide you." }),
          /* @__PURE__ */ jsx("p", { className: "relative z-10 max-w-md md:max-w-xl text-xs md:text-lg text-[#F2EDE8] text-center mb-4 md:mb-5", children: "Discover your true path with personalized insights from Acharya Seemaa Singh, a renowned astrologer, numerologist, and healer." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                document.getElementById("booking")?.scrollIntoView({
                  behavior: "smooth"
                });
              },
              className: "relative z-10 bg-[#F4C430] text-[#7A1E1E] w-36 md:w-52 py-2 md:py-3 rounded-full font-serif font-semibold cursor-pointer text-xs md:text-base",
              children: "Book Consultation"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("section", { className: "w-full bg-[#FFF6EB] py-12 md:py-20 px-3 md:px-4 animate-slide-up", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-serif text-[#7A1E1E] mb-2 md:mb-3", children: "How the Consultation Process Flows" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs md:text-base text-gray-600 mb-8 md:mb-14", children: "Clear • Simple • Effective" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10", children: [
        {
          step: "STEP 1",
          title: "Schedule Your Call",
          desc: "Choose a time slot and briefly share what you'd like guidance on."
        },
        {
          step: "STEP 2",
          title: "One-on-One Insight",
          desc: "Connect with an astrologer for focused, personalized guidance."
        },
        {
          step: "STEP 3",
          title: "Clarity & Direction",
          desc: "Leave with confidence, clarity, and practical next steps."
        }
      ].map((item, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative bg-white border border-[#923131]  rounded-xl\n              p-4 md:p-8 w-full md:w-1/3",
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "absolute -top-3 left-1/2 -translate-x-1/2\n                bg-white border border-[#923131] \n                px-3 py-0.5 md:px-4 md:py-1\n                rounded-full text-[10px] md:text-sm font-semibold",
                children: item.step
              }
            ),
            /* @__PURE__ */ jsx("h3", { className: "text-base md:text-xl font-serif text-[#7A1E1E] mb-2 md:mb-4 mt-2", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-gray-600 leading-relaxed", children: item.desc })
          ]
        },
        index
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "w-full py-12 md:py-16 bg-[#FFF9F4]", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-center text-2xl md:text-4xl font-serif mb-10", children: [
        "Why Choose",
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-[#7A1E1E]", children: "Acharya Seemaa Singh?" })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          ref: sectionRef,
          className: "max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `flex justify-center transition-all duration-1000 ease-out transform ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`,
                children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-linear-to-br from-yellow-200 to-orange-100 blur-2xl" }),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: seemaapic1,
                      alt: "Acharya Seemaa Singh",
                      loading: "lazy",
                      className: "relative rounded-full max-w-xs md:max-w-sm w-full object-cover"
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `space-y-5 transition-all duration-1000 ease-out transform ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-5 shadow-sm border", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-semibold mb-2", children: "☞ Vast Experience & Deep Knowledge" }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs md:text-sm leading-relaxed", children: "With over two decades of expertise in Vedic Astrology, Numerology, Tarot, Cartomancy, Aura Reading, Energy Dowsing, and Vaastu, Acharya Seemaa Singh blends classical wisdom with intuitive insight to guide individuals toward clarity and balance." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-[#FFF3E6] rounded-xl p-5 shadow-sm border", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-semibold mb-2", children: "☞ Compassionate Healer & Ethical Guidance" }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs md:text-sm leading-relaxed", children: "A natural healer with deep empathy, she believes astrology is a tool for empowerment and healing — not fear. Every consultation is conducted with honesty, confidentiality, and karmic integrity." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-5 shadow-sm border", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-semibold mb-2", children: "☞ Rare Expertise & Global Recognition" }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-xs md:text-sm leading-relaxed", children: "One of the few experts in Cartomancy using playing cards, Acharya Seemaa Singh has international exposure from Canada, media features, radio shows, and guest lectures — making her guidance both trusted and globally respected." })
                  ] })
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Booking, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const ContactUs = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "w-full mt-20 bg-gray-50 flex justify-center px-3 md:px-6 animate-slide-up", children: /* @__PURE__ */ jsxs("section", { className: "w-full max-w-6xl relative py-10 md:py-24 my-4 md:my-10 flex flex-col items-center justify-center px-4 md:px-8 bg-linear-to-r from-[#7A1E1E] to-[#3B1F1B] overflow-hidden rounded-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute flex justify-center items-center pointer-events-none", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute w-32 h-32 md:w-72 md:h-72 rounded-full bg-yellow-400 opacity-20 blur-3xl animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "w-28 h-28 md:w-66 md:h-66 rounded-full overflow-hidden animate-spin-slow opacity-80", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: zodiacWheel,
            alt: "Zodiac Wheel",
            loading: "lazy",
            className: "w-full h-full object-contain"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-[#FAF9F6] font-serif text-xl sm:text-2xl md:text-4xl text-center z-10", children: "Here are Our Contact Details" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#FAF9F6] text-sm sm:text-base md:text-lg text-center z-10", children: "Message us anytime; we will try to reply as soon as possible." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            document.getElementById("booking")?.scrollIntoView({
              behavior: "smooth"
            });
          },
          className: "relative z-10 bg-[#F4C430] text-[#7A1E1E] w-36 md:w-52 py-2 md:py-3 rounded-full font-serif font-semibold cursor-pointer text-xs md:text-base",
          children: "Book Consultation"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "flex flex-col bg-gray-50 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-3xl my-8 px-4 text-center", children: /* @__PURE__ */ jsxs("h3", { className: "text-gray-500 text-base md:text-lg", children: [
      "Important Note: Please be aware that our main office is currently located in",
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-bold font-serif text-[#7A1E1E]", children: "Canada" }),
      ". Due to the time zone difference, there may be delays in answering calls. If you are calling from",
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-bold font-serif text-[#7A1E1E]", children: "India" }),
      " ",
      "or other regions, we recommend contacting us in the",
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-bold font-serif text-[#7A1E1E]", children: "evening" }),
      " ",
      "local time for a quicker response. Alternatively, if you send us a message, our team will get back to you as soon as possible."
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 mt-10 mb-10 w-full max-w-full px-4 sm:px-6 justify-center items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold text-xl font-serif text-[#7A1E1E] mb-2", children: "India Office" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "tel:+917696134636",
            className: "text-gray-600 text-center hover:text-[#7A1E1E] transition-colors",
            children: "📞 +91 7696134636"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold text-xl font-serif text-[#7A1E1E] mb-2", children: "Canada Office" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "tel:+12362589866",
            className: "text-gray-600 text-center hover:text-[#7A1E1E] transition-colors",
            children: "📞 +1 236-258-9866"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto flex flex-col items-center bg-white rounded-xl shadow-lg p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold text-xl font-serif text-[#7A1E1E] mb-2", children: "Email" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "mailto:Info@seemaaastrologer.com",
            className: "text-gray-600 text-center hover:text-[#7A1E1E] transition-colors",
            children: "✉️ Info@seemaaastrologer.com"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Booking, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
function App() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, {}),
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(PayOnline, {}),
    /* @__PURE__ */ jsxs(distExports.Routes, { children: [
      /* @__PURE__ */ jsx(distExports.Route, { path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
      /* @__PURE__ */ jsx(distExports.Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
      /* @__PURE__ */ jsx(distExports.Route, { path: "/services/:slug", element: /* @__PURE__ */ jsx(ServiceBrief, {}) }),
      /* @__PURE__ */ jsx(distExports.Route, { path: "/horoscope", element: /* @__PURE__ */ jsx(HoroscopeBrief, {}) }),
      /* @__PURE__ */ jsx(distExports.Route, { path: "/horoscope/:sign", element: /* @__PURE__ */ jsx(HoroscopeBrief, {}) }),
      /* @__PURE__ */ jsx(distExports.Route, { path: "/consultation", element: /* @__PURE__ */ jsx(BookConsultation, {}) }),
      /* @__PURE__ */ jsx(distExports.Route, { path: "/contact", element: /* @__PURE__ */ jsx(ContactUs, {}) }),
      /* @__PURE__ */ jsx(distExports.Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
    ] })
  ] });
}
function render(url) {
  return renderToString(
    /* @__PURE__ */ jsx(distExports.StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) })
  );
}
export {
  render
};
