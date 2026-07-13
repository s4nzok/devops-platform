# Use the official lightweight Nginx image.
FROM nginx:alpine

# Metadata about the image (good practice).
LABEL maintainer="Sanjog Bhandari"
LABEL project="NovaMart"
LABEL version="1.0"

# Remove the default Nginx website.
# This prevents the default welcome page from appearing.
RUN rm -rf /usr/share/nginx/html/*

# Copy the frontend application into the web root.
COPY src/ /usr/share/nginx/html/

# Copy CSS, JavaScript and images.
COPY assets/ /usr/share/nginx/html/assets/

# Replace the default Nginx configuration with our own.
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Document that the container listens on HTTP port 80.
EXPOSE 80

# Start Nginx in the foreground.
# Containers stop when the main process exits.
CMD ["nginx", "-g", "daemon off;"]
