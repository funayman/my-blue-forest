#!/bin/sh
TIMEOUT=30
HOST=db
PORT=3306

echo "Trying to connect to MySQL at $HOST:$PORT..."
for i in `seq $TIMEOUT` ; do
  nc -z "$HOST" "$PORT" > /dev/null 2>&1

  result=$?
  if [ $result -eq 0 ] ; then
    if [ $# -gt 0 ] ; then
      exec "$@"
    fi
    exit 0
  fi
  sleep 1
done
echo "Operation timed out" >&2
exit 1

# mvn package -Dmaven.test.skip=true && java -Djava.security.egd=file:/dev/./urandom -jar target/my-blue-forest-0.0.1-SNAPSHOT.jar
