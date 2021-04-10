FROM node:6.11.1

# Install the application under /app/
COPY . /app/

# Run the app
EXPOSE  10010
WORKDIR /app
CMD ["node", "index"]
