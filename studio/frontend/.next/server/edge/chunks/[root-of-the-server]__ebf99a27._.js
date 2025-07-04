(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__ebf99a27._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/studio/frontend/src/routes.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */ __turbopack_context__.s({
    "DEFAULT_LOGIN_REDIRECT": (()=>DEFAULT_LOGIN_REDIRECT),
    "apiAuthPrefix": (()=>apiAuthPrefix),
    "authRoutes": (()=>authRoutes),
    "publicRoutes": (()=>publicRoutes)
});
const publicRoutes = [
    "/"
];
const authRoutes = [
    "/auth"
];
const apiAuthPrefix = "/api/auth";
const DEFAULT_LOGIN_REDIRECT = "/dashboard";
}}),
"[project]/studio/frontend/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$frontend$2f$src$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/frontend/src/routes.ts [middleware-edge] (ecmascript)");
;
;
function middleware(request) {
    const { nextUrl } = request;
    const session = request.cookies.get('session');
    const isLoggedIn = !!session;
    const isApiAuthRoute = nextUrl.pathname.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$frontend$2f$src$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["apiAuthPrefix"]);
    const isPublicRoute = __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$frontend$2f$src$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["publicRoutes"].includes(nextUrl.pathname);
    const isAuthRoute = __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$frontend$2f$src$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["authRoutes"].includes(nextUrl.pathname);
    if (isApiAuthRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (isAuthRoute) {
        if (isLoggedIn) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$frontend$2f$src$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DEFAULT_LOGIN_REDIRECT"], nextUrl));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (!isLoggedIn && !isPublicRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/auth', nextUrl));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__ebf99a27._.js.map