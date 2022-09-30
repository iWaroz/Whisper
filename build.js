const { rm, copy } = require('fs-extra');
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const stdout = process.stdout;

const init = async () => {
    await clean();
    await build();
    await copy_files();
    await done();
}

const clean = async () => {
    stdout.write("Cleaning the build folder.. ");
    await rm("./build", options = { recursive: true, force: true});
    stdout.write("OK\n");
}

const copy_filter = async (src, dest) => {
    return !dest.endsWith(".ts");
}

const copy_files = async () => {
    stdout.write("Copying non typescript files from source to build.. ");
    await copy("./src", "./build", { recursive: true, filter: copy_filter });
    stdout.write("OK\n");
}

const build = async () => {
    stdout.write("Compiling.. ");
    await exec("tsc");
    stdout.write("OK\n");
}

const done = async () => {
    console.log("Done building.");
};

init().catch((e) => {
    stdout.write("ERROR\n");
    console.error(e.stdout || e)
    process.exit(1);
});
