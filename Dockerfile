# each one of these commands is a layer, building on top of each other, docker caches result of each layer
FROM node:15
#where everything will start from
WORKDIR /app
# copy package.json into current Dir
COPY package.json . 
#then run npm install in /app
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ];\
    then npm install; \
    else npm install --only=production; \
    fi
#then copy everything from local root to container root
COPY . ./
ENV PORT 3000
# this doesn't actually open 3000, more like a comment to let people know
EXPOSE $PORT
# this is then run when container is built
CMD ["npm","run", "dev"]

# docker build takes so long because it has to run these commands, then when you run docker compose up it is faster because the results are cached
# therefore, when you change package.json, everything needs to rebuild
# if you only change the code, everything's cache will be utilized, then only running the last layer

#this is why it is split up between package.json, npm install, then copying the other files

#docker rm node-app -f the -f flag is force, allows you to remove a running container

#               host:container
# docker run -p 3000:3000 -d --name node-app node-app-image 

#GET INTO the container -it is interactive mode
# docker exec -it node-app bash
# exit to exit


# VOLUME
# volumes allow for us to instantaneously update our containers without having to rebuild them everytime we change code
# the :ro means read only file system, otherwise the container can write to local fs
# docker run -v /home/james/Docker/:/app:ro  -p 3000:3000 -d --name node-app node-app-image
# instead of mapping out local dir, we can use a variable $(pwd)
# if want to delete volume with container, can add on v flag to force ex: docker rm node-app -fv

# once we set PORT env var
# docker run -v $(pwd):/app:ro -e PORT=4000  -p 3000:4000 -d --name node-app node-app-image

# to use a .env file change this to --env-file ./.env^

# can check by getting into container, then running printenv


# DOCKER NETWORK

# docker network ls
# docker network inspect
# can ping other networks based on service name
# can sub ip address out for service name
