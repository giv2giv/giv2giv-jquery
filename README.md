giv2giv-jquery
==============

`https://giv2giv.org` user interface using jquery, history.js, crossroads.js

##Setup:##
To setup the project for development, you can either use the provided Dockerfile, or a custom local nginx configuration.

### Docker
**Step 1**:
Install the proper Docker distribution for your OS. Installation instructions can be found [here](https://docs.docker.com/engine/installation/).

**Step 2**:
Start the Docker service, either through the daemon (Linux) or with the Docker terminal (or `docker-machine`) (Mac / Windows).

**Step 3**:
Navigate to the giv2giv-jquery project root directory and build the nginx image:
```
cd /path/to/give2giv-jquery

docker build -t giv2giv-nginx .
```

**Step 4**:
Start a new Docker container:
```
docker run --rm -it -v /path/to/giv2giv-jquery:/usr/share/nginx/html -p 8080:80 giv2giv-nginx
```
**Note**: The path provided to `docker run` must be a the absolute path to your project directory.

**Step 5**:
Visit the development site in your browser at `http://localhost:8080`, or if you are using `docker-machine` visit the IP address of your `docker-machine` container (ex: `http://192.168.99.100:8080`). You can find the IP of your `docker-machine` by running `docker-machine ip {machine name}` where `{machine name}` is the name of your active machine (usually `default`).

### Custom Nginx configuration
**Step 1**: Install nginx

	sudo apt-get install nginx

**Step 2**: Edit example-nginx.conf to point to your local git folder

	root /home/my_user/giv2giv-jquery;

**Step 3**: Make a link to *your* `example-nginx.conf` in your nginx `sites-available` directory (default: `/etc/nginx/sites-enabled`)

	cd /etc/nginx/sites-enabled
	sudo ln -s ~my_user/giv2giv-jquery/example-nginx.conf

**Step 4**: Start or restart nginx

	sudo service nginx start

**Step 5**: Edit `js/utils.js` to point to your giv2giv API. Options include:

The giv2giv test server:

	GLOBAL.SERVER_URL = "https://apitest.giv2giv.org"

A local development copy of the giv2giv Ruby on Rails API from [giv2giv-rails](https://github.com/giv2giv/giv2giv-rails):

	GLOBAL.SERVER_URL = "http://localhost:3000"

**Step 6**: Using a browser navigate to `http://localhost`. If you get a `403` error try `sudo chmod -R 755 *`
