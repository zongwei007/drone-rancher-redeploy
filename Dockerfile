FROM denoland/deno:alpine-1.21.1

RUN deno install --allow-env --allow-net --name=drone-rancher-redeploy "https://raw.githubusercontent.com/zongwei007/drone-rancher-redeploy/master/src/main.ts"

ENTRYPOINT drone-rancher-redeploy
