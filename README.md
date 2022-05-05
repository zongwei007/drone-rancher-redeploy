[![Build](https://github.com/zongwei007/drone-rancher-redeploy/actions/workflows/build.yml/badge.svg)](https://github.com/zongwei007/drone-rancher-redeploy/actions/workflows/build.yml)

# drone-rancher-redeploy

Drone 插件，目前仅支持触发 rancher deployment 的重部署

插件参数：

- api: rancher 服务器地址
- token: rancher API token
- project: rancher 项目名
- namespace: 项目下命名空间
- deployment: 命名空间下部署应用名
- image: 容器镜像名称

配置样例：

```yml
- name: redeploy
  image: knives/drone-rancher-redeploy
  settings:
    api: https://rancher.com.cn
    token:
      from_secret: rancher_token
    project: Business
    namespace: BI
    deployment: manager-web
```
