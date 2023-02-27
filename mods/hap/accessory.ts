export class Accessory extends EventTarget {
  public process!: Deno.Process;
  public onmessage?: (event: any) => void;

  constructor() {
    super();
  }

  public publish() {
    this.process = Deno.run({
      cmd: ["node", "./mods/hap/worker/dist/main.js"],
      env: {
        DEBUG: "*",
        DEBUG_COLORS: "1",
      },
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });

    this.process.stdout!.readable.pipeTo(Deno.stdout.writable);
    this.process.stderr!.readable.pipeTo(Deno.stderr.writable);

    // passthrough signals into child process
    const signals: Deno.Signal[] = ["SIGINT", "SIGTERM"];
    signals.forEach((signal) =>
      Deno.addSignalListener(signal, () => {
        this.process.kill(signal);
        this.process.close();
      })
    );
  }

  public postMessage(message: any) {
    if (typeof (message) === "object") {
      const json = JSON.stringify(message);
      const textEncoder = new TextEncoder();
      this.process.stdin!.write(textEncoder.encode(json + "\n"));
    }
  }
}
