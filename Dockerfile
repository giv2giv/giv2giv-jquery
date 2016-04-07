FROM nginx

# Add "autoindex" directive to nginx configuration.
RUN /bin/bash -c "/bin/sed -i '24 i\    autoindex       on;' /etc/nginx/nginx.conf"
