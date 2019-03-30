({
    generateSourceMaps: true,
    name: "@ordbok/core",
    out: "dist/client.js",
    packages: [{
        name: "@ordbok/core",
        main: "dist/lib/index"
    }],
    paths: {
        "@ordbok/core/dist/lib": "dist/client"
    }
})
