# Build Instructions

## Requirements

- An IDE like [Visual Studio Code](https://code.visualstudio.com/download)
- [Docker](https://docs.docker.com/engine/install/ubuntu/) or [Docker for Windows](https://docs.docker.com/desktop/install/windows-install/)

## Build Instructions

Make the docker image by running (the period is required):

```sh
docker build -t webrcade .
```

**Dear Windows devs,** please save yourself some headache and don't build on Windows. If you absolutely must, then use the [WSL (Windows for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install) because Windows is notorious for changing line endings which will cause the build to fail saying "xxx.sh cannot be reached/does not exsist". If this does happen, open the document in vim and set the file format back to unix running `:set ff=unix` then use `:wq` to save and close the script.

- Example:

```sh
vi dist-cone-deps.sh
```

- Then at the bottom left, type `:set ff=unix` hit enter, then `:wq` hit enter.

***

## Deployment

The docker image you created above will be called "webrcade:latest" and can be verified by running:

```sh
docker image ls
```

Execute the following to spin up the image (the --rm flag is so the container is removed on shutdown):

```sh
docker run --rm --name=webrcade -p 8080:80 -v /path/to/content:/var/www/html/content webrcade:latest
```

Now webRcade will be reachable at [http://localhost:8080/](http://localhost:8080/)

See the `DOCKER.md` file for more handy docker controls.

***
***

```txt
Note: Please ensure any notes/documentation you create conforms to eslint standards.
```
