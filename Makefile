VENV=.venv
BIN=${VENV}/bin
PYTHON=${BIN}/python

CONTAINER = my-wabbit
PID_TRANSCRIBE = transcribe.pid
PID_DOWNLOAD = download.pid
PID_EMBEDDING = embedding.pid

PLAYLIST_ID ?= default_playlist_id

.PHONY: all transcribe download embedding start-rmq

init:
	python -m venv ${VENV}
	${PYTHON} -m pip install -r requirements.txt

batch: start-rmq sleep transcribe embedding download

start-rmq:
	# removes existing rabbitmq container
	docker ps -a | grep ${CONTAINER} && docker rm -f ${CONTAINER} || true 
	docker run --rm -d --hostname wabbit --name ${CONTAINER} -p 5672:5672  rabbitmq:3.10-alpine

sleep: start-rmq
	# waits for 10 seconds
	sleep 10

transcribe: start-rmq
	mkdir -p data/transcriptions/
	${PYTHON} batch/transcribe.py & echo $$! > $(PID_TRANSCRIBE)

embedding: start-rmq transcribe
	${PYTHON} batch/embedding.py & echo $$! > $(PID_EMBEDDING)

download: start-rmq transcribe embedding
	mkdir -p data/ytdl/
	${PYTHON} batch/download.py --playlist_id ${PLAYLIST_ID} & echo $$! > $(PID_DOWNLOAD)

stop: 
	-kill `cat $(PID_TRANSCRIBE)` 2>/dev/null || true
	-kill `cat $(PID_DOWNLOAD)` 2>/dev/null || true
	-kill `cat $(PID_EMBEDDING)` 2>/dev/null || true
	rm -f $(PID_TRANSCRIBE) $(PID_DOWNLOAD) $(PID_EMBEDDING)


clean-logs:
	rm data/download.log data/embedding.log data/transcribe.log