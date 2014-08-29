giv2giv-jquery
==============

`https://giv2giv.org` user interface using jquery, history.js, crossroads.js

##Setup:##

**Step 1**: Install nginx

	sudo apt-get install nginx

**Step 2**: Edit example-nginx.conf to point to your local git folder

	root /home/my_user/giv2giv-jquery;

**Step 3**: Make a link to *your* `example-nginx.conf` in your nginx `sites-available` directory (default: `/etc/nginx/sites-enabled`)

	cd /etc/nginx/sites-enabled
	sudo ln -s ~my_user/giv2giv-jquery/example-nginx.conf

**Step 4**: Start or restart nginx

	sudo service nginx start

**Step 5**: Edit `js/webui.js` to point to your giv2giv API. Options include:

The giv2giv test server:

	GLOBAL.SERVER_URL = "https://apitest.giv2giv.org"

A local development copy of the giv2giv Ruby on Rails API from [giv2giv-rails](https://github.com/giv2giv/giv2giv-rails):

	GLOBAL.SERVER_URL = "http://localhost:3000"

**Step 6**: Using a browser navigate to `http://localhost`. If you get a `403` error try `sudo chmod -R 755 *`