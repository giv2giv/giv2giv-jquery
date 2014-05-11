giv2giv-jquery
==============

https://giv2giv.org user interface using jquery, history.js, crossroads.js


##Setup:##

Install nginx

Edit example-nginx.conf to point to your local git folder
```
root /home/my_user/giv2giv-jquery;
```
Make a link to *your* example-nginx.conf in your nginx sites-available directory (default: /etc/nginx/sites-enabled)

```
cd /etc/nginx/sites-enabled
sudo ln -s ~my_user/giv2giv-jquery/example-nginx.conf
```

restart nginx

Edit js/app.js to point to your giv2giv API. Options include:

The giv2giv test server:
```
var server_url = "https://apitest.giv2giv.org"
```

A local development copy of the giv2giv Ruby on Rails API from [giv2giv-rails](https://github.com/giv2giv/giv2giv-rails):
```
var server_url = "http://localhost:3000"
```

Using a browser navigate to "http://localhost"
