# Docker Quick Tips

Here will be a growning list of useful docker instructions.

## Make docker image

In this case, `webrcade` will be the image name and, since undefined, it will get the tag `:latest`

**Note:** The trailing period is required

```sh
docker build -t webrcade .
```

## Show locally stored images

```sh
docker image ls
```

## Docker run flags

- `--rm` will automatically remove container upon close.
- `--d` will run the container in the background so the terminal can be closed or reused with the container is still running.

**Example:** `docker run --rm`

## Show all containers

```sh
docker ps -a
```

## Start/Stop a container

```sh
docker start/stop [container name]
```

## Clear local docker cache

During the build event, docker downloads and saves resources locally to allow for quick redeploy in between code edits. Over time, this cache will build up and might occasionally need a purge. Use this:

**WARNING** This will remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes. **WARNING**

```sh
docker system prune
```

***
***

```txt
Note: Please ensure any notes/documentation you create conforms to eslint standards.
```
