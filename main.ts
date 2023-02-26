const hap = await Deno.run({
  cmd: ["node", "./mods/hap/worker/dist/main.js"],
  env: {
    DEBUG: "*",
    DEBUG_COLORS: "1",
  },
  stdout: "piped",
  stderr: "piped",
});

hap.stdout.readable.pipeTo(Deno.stdout.writable);
hap.stderr.readable.pipeTo(Deno.stderr.writable);

// passthrough signals into child process
const signals: Deno.Signal[] = ["SIGINT", "SIGTERM"];
signals.forEach((signal) =>
  Deno.addSignalListener(signal, () => {
    hap.kill(signal);
    hap.close();
  })
);
