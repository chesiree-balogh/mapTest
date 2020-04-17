docker build -t mapTest-image .

docker tag mapTest-image registry.heroku.com/mapTest/web


docker push registry.heroku.com/mapTest/web

heroku container:release web -a mapTest